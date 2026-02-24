<?php

namespace App\Models;

use App\Enums\UserInvestmentStatus;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class UserInvestment extends Model
{
    use HasUlids;

    protected $fillable = [
        'user_id',
        'crowd_investment_id',
        'amount',
        'expected_return',
        'actual_return',
        'status',
        'invested_at',
        'matured_at',
        'returned_at',
        'reference',
    ];

    protected function casts(): array
    {
        return [
            'status' => UserInvestmentStatus::class,
            'amount' => 'decimal:2',
            'expected_return' => 'decimal:2',
            'actual_return' => 'decimal:2',
            'invested_at' => 'datetime',
            'matured_at' => 'datetime',
            'returned_at' => 'datetime',
        ];
    }

    // -- Relationships --

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function crowdInvestment(): BelongsTo
    {
        return $this->belongsTo(CrowdInvestment::class);
    }

    public function transactions(): MorphMany
    {
        return $this->morphMany(Transaction::class, 'transactionable');
    }

    // -- Scopes --

    public function scopeActive($query)
    {
        return $query->where('status', UserInvestmentStatus::Active);
    }

    public function scopeForUser($query, string $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeMatured($query)
    {
        return $query->where('status', UserInvestmentStatus::Matured);
    }

    // -- Helpers --

    public function isActive(): bool
    {
        return $this->status === UserInvestmentStatus::Active;
    }

    public function isMatured(): bool
    {
        return $this->status === UserInvestmentStatus::Matured;
    }

    public function isReturned(): bool
    {
        return $this->status === UserInvestmentStatus::Returned;
    }

    public function getTotalExpectedPayoutAttribute(): float
    {
        return (float) $this->amount + (float) $this->expected_return;
    }

    public function getTotalActualPayoutAttribute(): ?float
    {
        if ($this->actual_return === null) {
            return null;
        }

        return (float) $this->amount + (float) $this->actual_return;
    }

    public function getDaysRemainingAttribute(): int
    {
        if ($this->matured_at !== null) {
            return 0;
        }

        $endDate = $this->crowdInvestment?->end_date;

        if (! $endDate) {
            return 0;
        }

        return max(0, now()->diffInDays($endDate, false));
    }
}
