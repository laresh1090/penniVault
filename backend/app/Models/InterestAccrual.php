<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InterestAccrual extends Model
{
    use HasUlids;

    protected $fillable = [
        'savings_plan_id',
        'accrual_date',
        'principal',
        'annual_rate',
        'daily_amount',
        'cumulative_interest',
    ];

    protected function casts(): array
    {
        return [
            'accrual_date' => 'date',
            'principal' => 'decimal:2',
            'annual_rate' => 'decimal:2',
            'daily_amount' => 'decimal:2',
            'cumulative_interest' => 'decimal:2',
        ];
    }

    public function savingsPlan(): BelongsTo
    {
        return $this->belongsTo(SavingsPlan::class);
    }
}
