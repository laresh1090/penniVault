<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SavingsPlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'name' => $this->name,
            'description' => $this->description,
            'productType' => $this->product_type->value,
            'targetAmount' => (float) $this->target_amount,
            'currentAmount' => (float) $this->current_amount,
            'startDate' => $this->start_date->toDateString(),
            'endDate' => $this->end_date?->toDateString(),
            'frequency' => $this->frequency->value,
            'contributionAmount' => (float) $this->contribution_amount,
            'status' => $this->status->value,
            'linkedAssetId' => $this->linked_asset_id,
            'hasInterest' => $this->has_interest,
            'interestRate' => $this->interest_rate ? (float) $this->interest_rate : null,
            'accruedInterest' => (float) $this->accrued_interest,
            'isFixedTerm' => $this->is_fixed_term,
            'earlyWithdrawalPenaltyPercent' => (float) $this->early_withdrawal_penalty_percent,
            'progressPercent' => $this->progress_percent,
            'maturedAt' => $this->matured_at?->toISOString(),
            'brokenAt' => $this->broken_at?->toISOString(),
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
            'transactions' => TransactionResource::collection(
                $this->whenLoaded('transactions')
            ),
            'interestAccruals' => InterestAccrualResource::collection(
                $this->whenLoaded('interestAccruals')
            ),
        ];
    }
}
