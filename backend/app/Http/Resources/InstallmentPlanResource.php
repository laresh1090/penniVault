<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstallmentPlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'orderId' => $this->order_id,
            'userId' => $this->user_id,
            'totalAmount' => (float) $this->total_amount,
            'upfrontAmount' => (float) $this->upfront_amount,
            'upfrontPercent' => (float) $this->upfront_percent,
            'remainingAmount' => (float) $this->remaining_amount,
            'markupPercent' => (float) $this->markup_percent,
            'markupAmount' => (float) $this->markup_amount,
            'monthlyAmount' => (float) $this->monthly_amount,
            'numberOfPayments' => $this->number_of_payments,
            'paymentsCompleted' => $this->payments_completed,
            'nextPaymentDueAt' => $this->next_payment_due_at?->toISOString(),
            'status' => $this->status->value,
            'progressPercent' => $this->progressPercent(),
            'amountPaidSoFar' => $this->amountPaidSoFar(),
            'amountRemaining' => $this->amountRemaining(),
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),

            'order' => $this->when($this->relationLoaded('order'), function () {
                return [
                    'id' => $this->order->id,
                    'reference' => $this->order->reference,
                    'amount' => (float) $this->order->amount,
                    'status' => $this->order->status->value,
                    'listing' => $this->when(
                        $this->order->relationLoaded('listing') && $this->order->listing,
                        function () {
                            return [
                                'id' => $this->order->listing->id,
                                'title' => $this->order->listing->title,
                                'category' => $this->order->listing->category->value,
                                'price' => (float) $this->order->listing->price,
                                'primaryImage' => $this->order->listing->primary_image,
                                'images' => $this->order->listing->images ?? [],
                            ];
                        }
                    ),
                    'vendor' => $this->when(
                        $this->order->relationLoaded('vendor') && $this->order->vendor,
                        function () {
                            return [
                                'id' => $this->order->vendor->id,
                                'firstName' => $this->order->vendor->first_name,
                                'lastName' => $this->order->vendor->last_name,
                            ];
                        }
                    ),
                    'buyer' => $this->when(
                        $this->order->relationLoaded('buyer') && $this->order->buyer,
                        function () {
                            return [
                                'id' => $this->order->buyer->id,
                                'firstName' => $this->order->buyer->first_name,
                                'lastName' => $this->order->buyer->last_name,
                            ];
                        }
                    ),
                ];
            }),

            'payments' => $this->when($this->relationLoaded('payments'), function () {
                return InstallmentPaymentResource::collection($this->payments);
            }),

            'user' => $this->when($this->relationLoaded('user'), function () {
                return [
                    'id' => $this->user->id,
                    'firstName' => $this->user->first_name,
                    'lastName' => $this->user->last_name,
                ];
            }),
        ];
    }
}
