<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role->value,
            'status' => $this->status->value,
            'avatarUrl' => $this->avatar_url,
            'dateOfBirth' => $this->date_of_birth?->toDateString(),
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'bio' => $this->bio,
            'emailVerifiedAt' => $this->email_verified_at?->toISOString(),
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
            'vendorProfile' => $this->when($this->relationLoaded('vendorProfile') && $this->vendorProfile, function () {
                return [
                    'businessName' => $this->vendorProfile->business_name,
                    'businessType' => $this->vendorProfile->business_type->value,
                    'registrationNumber' => $this->vendorProfile->registration_number,
                    'businessAddress' => $this->vendorProfile->business_address,
                    'businessLogoUrl' => $this->vendorProfile->business_logo_url,
                    'isApproved' => $this->vendorProfile->is_approved,
                ];
            }),
        ];
    }
}
