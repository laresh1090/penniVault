<?php

namespace App\Models;

use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Transaction extends Model
{
    use HasUlids;

    protected $fillable = [
        'user_id',
        'wallet_id',
        'type',
        'category',
        'amount',
        'balance_after',
        'description',
        'status',
        'reference',
        'transactionable_type',
        'transactionable_id',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'type' => TransactionType::class,
            'status' => TransactionStatus::class,
            'amount' => 'decimal:2',
            'balance_after' => 'decimal:2',
            'metadata' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    /**
     * Polymorphic relation to the source entity (SavingsPlan, etc.)
     */
    public function transactionable(): MorphTo
    {
        return $this->morphTo();
    }
}
