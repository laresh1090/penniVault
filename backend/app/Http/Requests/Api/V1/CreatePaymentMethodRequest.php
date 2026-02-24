<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class CreatePaymentMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bankName' => ['required', 'string', 'max:255'],
            'bankCode' => ['required', 'string', 'max:10'],
            'accountNumber' => ['required', 'string', 'size:10'],
            'accountName' => ['required', 'string', 'max:255'],
            'isDefault' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'accountNumber.size' => 'Nigerian account numbers must be exactly 10 digits.',
        ];
    }
}
