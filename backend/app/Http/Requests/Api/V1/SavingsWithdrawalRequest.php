<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class SavingsWithdrawalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:100'],
            'destination' => ['required', 'in:wallet,bank_account'],
            'paymentMethodId' => ['required_if:destination,bank_account', 'nullable', 'string'],
            'confirmPenalty' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.min' => 'Minimum withdrawal is 100 Naira.',
            'paymentMethodId.required_if' => 'Bank account is required when withdrawing to bank.',
        ];
    }
}
