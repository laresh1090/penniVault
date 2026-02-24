<?php

namespace App\Models;

use App\Enums\SavingsFrequency;
use App\Enums\SavingsProductType;
use App\Enums\SavingsStatus;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class SavingsPlan extends Model
{
    use HasUlids;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'product_type',
        'target_amount',
        'current_amount',
        'start_date',
        'end_date',
        'frequency',
        'contribution_amount',
        'status',
        'linked_asset_id',
        'has_interest',
        'interest_rate',
        'accrued_interest',
        'is_fixed_term',
        'early_withdrawal_penalty_percent',
        'last_interest_accrual_date',
        'matured_at',
        'broken_at',
    ];

    protected function casts(): array
    {
        return [
            'product_type' => SavingsProductType::class,
            'status' => SavingsStatus::class,
            'frequency' => SavingsFrequency::class,
            'target_amount' => 'decimal:2',
            'current_amount' => 'decimal:2',
            'contribution_amount' => 'decimal:2',
            'interest_rate' => 'decimal:2',
            'accrued_interest' => 'decimal:2',
            'early_withdrawal_penalty_percent' => 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
            'last_interest_accrual_date' => 'date',
            'has_interest' => 'boolean',
            'is_fixed_term' => 'boolean',
            'matured_at' => 'datetime',
            'broken_at' => 'datetime',
        ];
    }

    // -- Relationships --

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function interestAccruals(): HasMany
    {
        return $this->hasMany(InterestAccrual::class);
    }

    public function transactions(): MorphMany
    {
        return $this->morphMany(Transaction::class, 'transactionable');
    }

    // -- Scopes --

    public function scopeActive($query)
    {
        return $query->where('status', SavingsStatus::Active);
    }

    public function scopeOfType($query, SavingsProductType $type)
    {
        return $query->where('product_type', $type);
    }

    public function scopeWithInterest($query)
    {
        return $query->where('has_interest', true);
    }

    // -- Helpers --

    public function isPenniSave(): bool
    {
        return $this->product_type === SavingsProductType::PenniSave;
    }

    public function isPenniLock(): bool
    {
        return $this->product_type === SavingsProductType::PenniLock;
    }

    public function isTargetSave(): bool
    {
        return $this->product_type === SavingsProductType::TargetSave;
    }

    public function isMatured(): bool
    {
        return $this->matured_at !== null;
    }

    public function isBroken(): bool
    {
        return $this->broken_at !== null;
    }

    /**
     * Calculate progress percentage toward target_amount.
     */
    public function getProgressPercentAttribute(): float
    {
        if ((float) $this->target_amount <= 0) {
            return 0;
        }

        return min(100, round(((float) $this->current_amount / (float) $this->target_amount) * 100, 2));
    }
}
