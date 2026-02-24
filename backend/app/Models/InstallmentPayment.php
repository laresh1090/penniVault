<?php

namespace App\Models;

use App\Enums\InstallmentPaymentStatus;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstallmentPayment extends Model
{
    use HasUlids;

    protected $fillable = [
        'installment_plan_id',
        'payment_number',
        'amount',
        'due_date',
        'paid_at',
        'status',
        'transaction_id',
    ];

    protected function casts(): array
    {
        return [
            'status' => InstallmentPaymentStatus::class,
            'amount' => 'decimal:2',
            'payment_number' => 'integer',
            'due_date' => 'date',
            'paid_at' => 'datetime',
        ];
    }

    // -- Relationships --

    public function plan(): BelongsTo
    {
        return $this->belongsTo(InstallmentPlan::class, 'installment_plan_id');
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    // -- Scopes --

    public function scopePending($query)
    {
        return $query->where('status', InstallmentPaymentStatus::Pending);
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', InstallmentPaymentStatus::Overdue);
    }

    public function scopeDueBefore($query, $date)
    {
        return $query->where('due_date', '<=', $date);
    }

    // -- Helpers --

    public function isPending(): bool
    {
        return $this->status === InstallmentPaymentStatus::Pending;
    }

    public function isPaid(): bool
    {
        return $this->status === InstallmentPaymentStatus::Paid;
    }

    public function isOverdue(): bool
    {
        return $this->status === InstallmentPaymentStatus::Overdue;
    }
}
