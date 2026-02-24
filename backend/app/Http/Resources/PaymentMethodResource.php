<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentMethodResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'bankName' => $this->bank_name,
            'bankCode' => $this->bank_code,
            'accountNumber' => $this->masked_account_number,
            'accountName' => $this->account_name,
            'isDefault' => $this->is_default,
            'createdAt' => $this->created_at->toISOString(),
        ];
    }
}
