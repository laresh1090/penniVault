<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class SavingsContributionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:100'],
            'source' => ['required', 'in:wallet,card,bank_transfer'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.min' => 'Minimum contribution is 100 Naira.',
            'source.in' => 'Source must be wallet, card, or bank_transfer.',
        ];
    }
}
