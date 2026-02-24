<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserInvestmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'crowdInvestmentId' => $this->crowd_investment_id,
            'amount' => (float) $this->amount,
            'expectedReturn' => (float) $this->expected_return,
            'actualReturn' => $this->actual_return !== null ? (float) $this->actual_return : null,
            'status' => $this->status->value,
            'investedAt' => $this->invested_at->toISOString(),
            'maturedAt' => $this->matured_at?->toISOString(),
            'returnedAt' => $this->returned_at?->toISOString(),
            'reference' => $this->reference,

            'totalExpectedPayout' => $this->total_expected_payout,
            'totalActualPayout' => $this->total_actual_payout,
            'daysRemaining' => $this->days_remaining,

            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),

            'crowdInvestment' => $this->when($this->relationLoaded('crowdInvestment'), function () {
                return [
                    'id' => $this->crowdInvestment->id,
                    'title' => $this->crowdInvestment->title,
                    'category' => $this->crowdInvestment->category->value,
                    'expectedRoiPercent' => (float) $this->crowdInvestment->expected_roi_percent,
                    'durationDays' => $this->crowdInvestment->duration_days,
                    'status' => $this->crowdInvestment->status->value,
                    'primaryImage' => $this->crowdInvestment->primary_image,
                    'location' => $this->crowdInvestment->location,
                    'vendorId' => $this->crowdInvestment->vendor_id,
                ];
            }),

            'user' => $this->when($this->relationLoaded('user'), function () {
                return [
                    'id' => $this->user->id,
                    'firstName' => $this->user->first_name,
                    'lastName' => $this->user->last_name,
                    'email' => $this->user->email,
                ];
            }),
        ];
    }
}
