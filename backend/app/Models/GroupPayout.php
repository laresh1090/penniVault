<?php

namespace App\Models;

use App\Enums\PayoutStatus;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GroupPayout extends Model
{
    use HasUlids;

    protected $fillable = [
        'group_savings_id',
        'group_member_id',
        'round',
        'amount',
        'real_amount',
        'virtual_amount',
        'status',
        'expected_date',
        'paid_at',
        'transaction_id',
    ];

    protected function casts(): array
    {
        return [
            'status' => PayoutStatus::class,
            'amount' => 'decimal:2',
            'real_amount' => 'decimal:2',
            'virtual_amount' => 'decimal:2',
            'round' => 'integer',
            'expected_date' => 'date',
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

    public function isCompleted(): bool
    {
        return $this->status === PayoutStatus::Completed;
    }

    public function isCurrent(): bool
    {
        return $this->status === PayoutStatus::Current;
    }
}
