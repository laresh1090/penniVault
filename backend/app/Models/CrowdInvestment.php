<?php

namespace App\Models;

use App\Enums\InvestmentCategory;
use App\Enums\InvestmentRiskLevel;
use App\Enums\InvestmentStatus;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CrowdInvestment extends Model
{
    use HasUlids;

    protected $fillable = [
        'vendor_id',
        'title',
        'description',
        'category',
        'target_amount',
        'current_amount',
        'minimum_investment',
        'expected_roi_percent',
        'duration_days',
        'start_date',
        'end_date',
        'status',
        'images',
        'location',
        'risk_level',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'category' => InvestmentCategory::class,
            'status' => InvestmentStatus::class,
            'risk_level' => InvestmentRiskLevel::class,
            'target_amount' => 'decimal:2',
            'current_amount' => 'decimal:2',
            'minimum_investment' => 'decimal:2',
            'expected_roi_percent' => 'decimal:2',
            'duration_days' => 'integer',
            'start_date' => 'date',
            'end_date' => 'date',
            'images' => 'array',
            'metadata' => 'array',
        ];
    }

    // -- Relationships --

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function userInvestments(): HasMany
    {
        return $this->hasMany(UserInvestment::class);
    }

    // -- Scopes --

    public function scopeOpen($query)
    {
        return $query->where('status', InvestmentStatus::Open);
    }

    public function scopeOfCategory($query, InvestmentCategory $category)
    {
        return $query->where('category', $category);
    }

    public function scopeOfRiskLevel($query, InvestmentRiskLevel $riskLevel)
    {
        return $query->where('risk_level', $riskLevel);
    }

    public function scopeByVendor($query, string $vendorId)
    {
        return $query->where('vendor_id', $vendorId);
    }

    // -- Helpers --

    public function isOpen(): bool
    {
        return $this->status === InvestmentStatus::Open;
    }

    public function isFunded(): bool
    {
        return $this->status === InvestmentStatus::Funded;
    }

    public function isMatured(): bool
    {
        return $this->status === InvestmentStatus::Matured;
    }

    public function getFundingProgressAttribute(): float
    {
        if ((float) $this->target_amount <= 0) {
            return 0;
        }

        return min(100, round(((float) $this->current_amount / (float) $this->target_amount) * 100, 2));
    }

    public function getRemainingAmountAttribute(): float
    {
        return max(0, (float) $this->target_amount - (float) $this->current_amount);
    }

    public function getInvestorCountAttribute(): int
    {
        return $this->userInvestments()->distinct('user_id')->count('user_id');
    }

    public function canAcceptInvestment(float $amount): bool
    {
        if (! $this->isOpen()) {
            return false;
        }

        if ($amount < (float) $this->minimum_investment) {
            return false;
        }

        if ($amount > $this->remaining_amount) {
            return false;
        }

        return true;
    }

    public function getPrimaryImageAttribute(): ?string
    {
        $images = $this->images;

        return is_array($images) && count($images) > 0 ? $images[0] : null;
    }
}
