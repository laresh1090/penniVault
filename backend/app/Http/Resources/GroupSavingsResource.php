<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GroupSavingsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'contributionAmount' => (float) $this->contribution_amount,
            'frequency' => $this->frequency->value,
            'totalSlots' => $this->total_slots,
            'filledSlots' => $this->filled_slots,
            'currentRound' => $this->current_round,
            'totalRounds' => $this->total_rounds,
            'status' => $this->status->value,
            'startDate' => $this->start_date?->toISOString(),
            'nextPayoutDate' => $this->next_payout_date?->toISOString(),
            'createdAt' => $this->created_at->toISOString(),
            'mode' => $this->mode->value,
            'payoutStartRound' => $this->payoutStartRound(),
            'vendorId' => $this->vendor_id,
            'listingId' => $this->listing_id,
            'productPrice' => $this->product_price ? (float) $this->product_price : null,
            'payoutStartPercent' => $this->payout_start_percent ? (float) $this->payout_start_percent : null,
            'freezePayoutUntilPercent' => $this->freeze_payout_until_percent ? (float) $this->freeze_payout_until_percent : null,
            'listing' => $this->whenLoaded('listing', function () {
                return [
                    'id' => $this->listing->id,
                    'title' => $this->listing->title,
                    'price' => (float) $this->listing->price,
                    'category' => $this->listing->category->value,
                    'primaryImage' => $this->listing->primary_image,
                ];
            }),
            'vendor' => $this->whenLoaded('vendor', function () {
                return [
                    'id' => $this->vendor->id,
                    'name' => $this->vendor->first_name . ' ' . $this->vendor->last_name,
                ];
            }),
            'members' => $this->whenLoaded('members', function () {
                return $this->members->map(function ($member) {
                    return [
                        'userId' => $member->user_id,
                        'name' => $member->user->first_name . ' ' . $member->user->last_name,
                        'avatarUrl' => $member->user->avatar_url,
                        'position' => $member->position,
                        'hasPaidCurrentRound' => $member->hasPaidRound($this->current_round),
                        'totalContributed' => (float) $member->total_contributed,
                        'joinedAt' => $member->joined_at->toISOString(),
                    ];
                });
            }),
        ];
    }
}
