<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstallmentPaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'installmentPlanId' => $this->installment_plan_id,
            'paymentNumber' => $this->payment_number,
            'amount' => (float) $this->amount,
            'dueDate' => $this->due_date->toISOString(),
            'paidAt' => $this->paid_at?->toISOString(),
            'status' => $this->status->value,
            'transactionId' => $this->transaction_id,
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
