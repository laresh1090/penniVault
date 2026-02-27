<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GroupMember extends Model
{
    use HasUlids;

    protected $fillable = [
        'group_savings_id',
        'user_id',
        'position',
        'total_contributed',
        'joined_at',
        'left_at',
    ];

    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'total_contributed' => 'decimal:2',
            'joined_at' => 'datetime',
            'left_at' => 'datetime',
        ];
    }

    // -- Relationships --

    public function group(): BelongsTo
    {
        return $this->belongsTo(GroupSavings::class, 'group_savings_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function contributions(): HasMany
    {
        return $this->hasMany(GroupContribution::class)->orderBy('round');
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(GroupPayout::class);
    }

    // -- Helpers --

    public function hasPaidRound(int $round): bool
    {
        return $this->contributions()
            ->where('round', $round)
            ->where('status', 'paid')
            ->exists();
    }

    public function displayName(): string
    {
        return $this->user->first_name . ' ' . $this->user->last_name;
    }
}
