<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:200'],
            'subject' => ['nullable', 'string', 'max:200'],
            'message' => ['required', 'string', 'min:3', 'max:5000'],
        ];
    }
}
