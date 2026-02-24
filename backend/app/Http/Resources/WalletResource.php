<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WalletResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'realBalance' => (float) $this->real_balance,
            'virtualBalance' => (float) $this->virtual_balance,
            'totalBalance' => $this->total_balance,
            'currency' => $this->currency,
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
