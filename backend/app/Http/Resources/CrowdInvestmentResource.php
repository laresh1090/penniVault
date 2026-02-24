<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CrowdInvestmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'vendorId' => $this->vendor_id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category->value,
            'targetAmount' => (float) $this->target_amount,
            'currentAmount' => (float) $this->current_amount,
            'minimumInvestment' => (float) $this->minimum_investment,
            'expectedRoiPercent' => (float) $this->expected_roi_percent,
            'durationDays' => $this->duration_days,
            'startDate' => $this->start_date->toDateString(),
            'endDate' => $this->end_date->toDateString(),
            'status' => $this->status->value,
            'images' => $this->images ?? [],
            'primaryImage' => $this->primary_image,
            'location' => $this->location,
            'riskLevel' => $this->risk_level->value,
            'metadata' => $this->metadata,

            'fundingProgress' => $this->funding_progress,
            'remainingAmount' => $this->remaining_amount,
            'investorCount' => $this->investor_count,

            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),

            'vendor' => $this->when($this->relationLoaded('vendor'), function () {
                return [
                    'id' => $this->vendor->id,
                    'firstName' => $this->vendor->first_name,
                    'lastName' => $this->vendor->last_name,
                    'avatarUrl' => $this->vendor->avatar_url,
                    'vendorProfile' => $this->when(
                        $this->vendor->relationLoaded('vendorProfile') && $this->vendor->vendorProfile,
                        function () {
                            return [
                                'businessName' => $this->vendor->vendorProfile->business_name,
                                'businessType' => $this->vendor->vendorProfile->business_type->value,
                                'businessLogoUrl' => $this->vendor->vendorProfile->business_logo_url,
                                'isApproved' => $this->vendor->vendorProfile->is_approved,
                            ];
                        }
                    ),
                ];
            }),
        ];
    }
}
