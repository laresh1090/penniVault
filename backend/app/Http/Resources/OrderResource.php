<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'buyerId' => $this->buyer_id,
            'listingId' => $this->listing_id,
            'vendorId' => $this->vendor_id,
            'amount' => (float) $this->amount,
            'commissionAmount' => (float) $this->commission_amount,
            'vendorAmount' => (float) $this->vendor_amount,
            'status' => $this->status->value,
            'reference' => $this->reference,
            'paymentMethod' => $this->payment_method->value,
            'metadata' => $this->metadata,
            'canBeCancelled' => $this->canBeCancelled(),
            'canBeRefunded' => $this->canBeRefunded(),
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),

            'buyer' => $this->when($this->relationLoaded('buyer'), function () {
                return [
                    'id' => $this->buyer->id,
                    'firstName' => $this->buyer->first_name,
                    'lastName' => $this->buyer->last_name,
                    'email' => $this->buyer->email,
                    'avatarUrl' => $this->buyer->avatar_url,
                ];
            }),

            'vendor' => $this->when($this->relationLoaded('vendor'), function () {
                return [
                    'id' => $this->vendor->id,
                    'firstName' => $this->vendor->first_name,
                    'lastName' => $this->vendor->last_name,
                    'vendorProfile' => $this->when(
                        $this->vendor->relationLoaded('vendorProfile') && $this->vendor->vendorProfile,
                        fn () => ['businessName' => $this->vendor->vendorProfile->business_name]
                    ),
                ];
            }),

            'listing' => $this->when($this->relationLoaded('listing'), function () {
                return [
                    'id' => $this->listing->id,
                    'title' => $this->listing->title,
                    'category' => $this->listing->category->value,
                    'primaryImage' => $this->listing->primary_image,
                ];
            }),

            'installmentPlan' => $this->when(
                $this->relationLoaded('installmentPlan') && $this->installmentPlan,
                function () {
                    return new InstallmentPlanResource($this->installmentPlan);
                }
            ),
        ];
    }
}
