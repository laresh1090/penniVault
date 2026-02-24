<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wallet extends Model
{
    use HasUlids;

    protected $fillable = [
        'user_id',
        'real_balance',
        'virtual_balance',
        'currency',
    ];

    protected function casts(): array
    {
        return [
            'real_balance' => 'decimal:2',
            'virtual_balance' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get total balance (real + virtual).
     */
    public function getTotalBalanceAttribute(): float
    {
        return (float) $this->real_balance + (float) $this->virtual_balance;
    }
}
