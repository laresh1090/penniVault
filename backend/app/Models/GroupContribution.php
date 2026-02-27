<?php

namespace App\Models;

use App\Enums\ContributionStatus;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GroupContribution extends Model
{
    use HasUlids;

    protected $fillable = [
        'group_savings_id',
        'group_member_id',
        'round',
        'amount',
        'status',
        'paid_at',
        'transaction_id',
    ];

    protected function casts(): array
    {
        return [
            'status' => ContributionStatus::class,
            'amount' => 'decimal:2',
            'round' => 'integer',
            'paid_at' => 'datetime',
        ];
    }

    // -- Relationships --

    public function group(): BelongsTo
    {
        return $this->belongsTo(GroupSavings::class, 'group_savings_id');
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(GroupMember::class, 'group_member_id');
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    // -- Helpers --

    public function isPaid(): bool
    {
        return $this->status === ContributionStatus::Paid;
    }
}
