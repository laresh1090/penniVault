<?php

namespace App\Models;

use App\Enums\GroupSavingsMode;
use App\Enums\GroupSavingsStatus;
use App\Enums\SavingsFrequency;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GroupSavings extends Model
{
    use HasUlids;

    protected $fillable = [
        'name',
        'description',
        'created_by_id',
        'contribution_amount',
        'frequency',
        'total_slots',
        'filled_slots',
        'current_round',
        'total_rounds',
        'status',
        'start_date',
        'next_payout_date',
        'mode',
        'vendor_id',
        'listing_id',
        'product_price',
        'payout_start_percent',
        'freeze_payout_until_percent',
    ];

    protected function casts(): array
    {
        return [
            'status' => GroupSavingsStatus::class,
            'frequency' => SavingsFrequency::class,
            'mode' => GroupSavingsMode::class,
            'contribution_amount' => 'decimal:2',
            'product_price' => 'decimal:2',
            'payout_start_percent' => 'decimal:2',
            'freeze_payout_until_percent' => 'decimal:2',
            'total_slots' => 'integer',
            'filled_slots' => 'integer',
            'current_round' => 'integer',
            'total_rounds' => 'integer',
            'start_date' => 'date',
            'next_payout_date' => 'date',
        ];
    }

    // -- Relationships --

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(GroupMember::class)->orderBy('position');
    }

    public function contributions(): HasMany
    {
        return $this->hasMany(GroupContribution::class);
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(GroupPayout::class)->orderBy('round');
    }

    // -- Scopes --

    public function scopeActive($query)
    {
        return $query->where('status', GroupSavingsStatus::Active);
    }

    public function scopePending($query)
    {
        return $query->where('status', GroupSavingsStatus::Pending);
    }

    public function scopeHasSlots($query)
    {
        return $query->whereColumn('filled_slots', '<', 'total_slots');
    }

    public function scopePeerMode($query)
    {
        return $query->where('mode', 'peer');
    }

    public function scopeVendorMode($query)
    {
        return $query->where('mode', 'vendor');
    }

    public function scopeByVendor($query, string $vendorId)
    {
        return $query->where('vendor_id', $vendorId);
    }

    // -- Helpers --

    public function isFull(): bool
    {
        return $this->filled_slots >= $this->total_slots;
    }

    public function isActive(): bool
    {
        return $this->status === GroupSavingsStatus::Active;
    }

    public function isPeerMode(): bool
    {
        return $this->mode === GroupSavingsMode::Peer;
    }

    public function isVendorMode(): bool
    {
        return $this->mode === GroupSavingsMode::Vendor;
    }

    public function poolSize(): float
    {
        return (float) $this->contribution_amount * $this->filled_slots;
    }

    /**
     * Determine the round at which payouts begin.
     * - Peer mode: round 1 by default, or after freeze threshold
     * - Vendor mode: after payout_start_percent (default 40%)
     */
    public function payoutStartRound(): int
    {
        if ($this->isVendorMode()) {
            $percent = (float) ($this->payout_start_percent ?? 40);
            return max(1, (int) ceil($this->total_rounds * $percent / 100));
        }

        // Peer mode
        if ($this->freeze_payout_until_percent !== null && (float) $this->freeze_payout_until_percent > 0) {
            return max(1, (int) ceil($this->total_rounds * (float) $this->freeze_payout_until_percent / 100));
        }

        return 1;
    }

    public function hasMember(string $userId): bool
    {
        return $this->members()->where('user_id', $userId)->exists();
    }

    public function getMember(string $userId): ?GroupMember
    {
        return $this->members()->where('user_id', $userId)->first();
    }
}
