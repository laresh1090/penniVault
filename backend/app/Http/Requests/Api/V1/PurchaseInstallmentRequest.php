<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class PurchaseInstallmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'months' => ['required', 'integer', 'in:6,12'],
        ];
    }

    public function messages(): array
    {
        return [
            'months.in' => 'Installment plan must be either 6 or 12 months.',
        ];
    }
}
