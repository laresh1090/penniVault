<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class InvestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Investment amount is required.',
            'amount.min' => 'Minimum investment amount is 1,000 Naira.',
        ];
    }
}
