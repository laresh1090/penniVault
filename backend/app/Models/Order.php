<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Order extends Model
{
    use HasUlids;

    protected $fillable = [
        'buyer_id',
        'listing_id',
        'vendor_id',
        'amount',
        'commission_amount',
        'vendor_amount',
        'status',
        'reference',
        'payment_method',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'amount' => 'decimal:2',
            'commission_amount' => 'decimal:2',
            'vendor_amount' => 'decimal:2',
            'payment_method' => PaymentMethod::class,
            'metadata' => 'array',
        ];
    }

    // -- Relationships --

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function transactions(): MorphMany
    {
        return $this->morphMany(Transaction::class, 'transactionable');
    }

    public function installmentPlan(): HasOne
    {
        return $this->hasOne(InstallmentPlan::class);
    }

    // -- Scopes --

    public function scopeForBuyer($query, string $buyerId)
    {
        return $query->where('buyer_id', $buyerId);
    }

    public function scopeForVendor($query, string $vendorId)
    {
        return $query->where('vendor_id', $vendorId);
    }

    public function scopeOfStatus($query, OrderStatus $status)
    {
        return $query->where('status', $status);
    }

    // -- Helpers --

    public function isPending(): bool
    {
        return $this->status === OrderStatus::Pending;
    }

    public function isConfirmed(): bool
    {
        return $this->status === OrderStatus::Confirmed;
    }

    public function isDelivered(): bool
    {
        return $this->status === OrderStatus::Delivered;
    }

    public function isCancelled(): bool
    {
        return $this->status === OrderStatus::Cancelled;
    }

    public function canBeCancelled(): bool
    {
        return $this->status === OrderStatus::Pending;
    }

    public function canBeRefunded(): bool
    {
        return in_array($this->status, [OrderStatus::Confirmed, OrderStatus::Delivered]);
    }

    public function isInstallment(): bool
    {
        return $this->payment_method === PaymentMethod::Installment;
    }
}
