<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InterestAccrualResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'accrualDate' => $this->accrual_date->toDateString(),
            'principal' => (float) $this->principal,
            'annualRate' => (float) $this->annual_rate,
            'dailyAmount' => (float) $this->daily_amount,
            'cumulativeInterest' => (float) $this->cumulative_interest,
        ];
    }
}
