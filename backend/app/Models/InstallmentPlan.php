<?php

namespace App\Models;

use App\Enums\InstallmentPaymentStatus;
use App\Enums\InstallmentPlanStatus;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InstallmentPlan extends Model
{
    use HasUlids;

    protected $fillable = [
        'order_id',
        'user_id',
        'total_amount',
        'upfront_amount',
        'upfront_percent',
        'remaining_amount',
        'markup_percent',
        'markup_amount',
        'monthly_amount',
        'number_of_payments',
        'payments_completed',
        'next_payment_due_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => InstallmentPlanStatus::class,
            'total_amount' => 'decimal:2',
            'upfront_amount' => 'decimal:2',
            'upfront_percent' => 'decimal:2',
            'remaining_amount' => 'decimal:2',
            'markup_percent' => 'decimal:2',
            'markup_amount' => 'decimal:2',
            'monthly_amount' => 'decimal:2',
            'number_of_payments' => 'integer',
            'payments_completed' => 'integer',
            'next_payment_due_at' => 'date',
        ];
    }

    // -- Relationships --

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(InstallmentPayment::class)->orderBy('payment_number');
    }

    // -- Scopes --

    public function scopeActive($query)
    {
        return $query->where('status', InstallmentPlanStatus::Active);
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', InstallmentPlanStatus::Overdue);
    }

    public function scopeForUser($query, string $userId)
    {
        return $query->where('user_id', $userId);
    }

    // -- Helpers --

    public function amountPaidSoFar(): float
    {
        return (float) $this->upfront_amount + ($this->payments_completed * (float) $this->monthly_amount);
    }

    public function amountRemaining(): float
    {
        return (float) $this->total_amount - $this->amountPaidSoFar();
    }

    public function progressPercent(): int
    {
        if ($this->number_of_payments <= 0) {
            return 100;
        }

        return (int) round(($this->payments_completed / $this->number_of_payments) * 100);
    }

    public function isCompleted(): bool
    {
        return $this->status === InstallmentPlanStatus::Completed;
    }

    public function isActive(): bool
    {
        return $this->status === InstallmentPlanStatus::Active;
    }

    public function nextPendingPayment(): ?InstallmentPayment
    {
        return $this->payments()
            ->where('status', InstallmentPaymentStatus::Pending)
            ->orderBy('payment_number')
            ->first();
    }
}
