<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'vendorId' => $this->vendor_id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category->value,
            'price' => (float) $this->price,
            'images' => $this->images ?? [],
            'primaryImage' => $this->primary_image,
            'location' => $this->location,
            'status' => $this->status->value,
            'featured' => $this->featured,
            'stockQuantity' => $this->stock_quantity,
            'inStock' => $this->isInStock(),
            'metadata' => $this->metadata,
            'allowInstallment' => $this->allow_installment,
            'minUpfrontPercent' => (float) $this->min_upfront_percent,
            'installmentMarkup6m' => (float) $this->installment_markup_6m,
            'installmentMarkup12m' => (float) $this->installment_markup_12m,
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

            'orderCount' => $this->when($this->relationLoaded('orders'), function () {
                return $this->orders->count();
            }),
        ];
    }
}
