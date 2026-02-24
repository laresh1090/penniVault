<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'type' => $this->type->value,
            'category' => $this->category,
            'amount' => (float) $this->amount,
            'balanceAfter' => (float) $this->balance_after,
            'description' => $this->description,
            'status' => $this->status->value,
            'reference' => $this->reference,
            'metadata' => $this->metadata,
            'createdAt' => $this->created_at->toISOString(),
        ];
    }
}
