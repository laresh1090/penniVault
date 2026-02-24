<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class WalletDepositRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:100', 'max:50000000'],
            'channel' => ['required', 'in:card,bank_transfer'],
            'cardDetails' => ['required_if:channel,card', 'nullable', 'array'],
            'cardDetails.number' => ['required_if:channel,card', 'nullable', 'string'],
            'cardDetails.expiry' => ['required_if:channel,card', 'nullable', 'string'],
            'cardDetails.cvv' => ['required_if:channel,card', 'nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.min' => 'Minimum deposit is 100 Naira.',
            'amount.max' => 'Maximum deposit is 50,000,000 Naira.',
        ];
    }
}
