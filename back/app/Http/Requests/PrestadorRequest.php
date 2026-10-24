<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PrestadorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'apresentacao' => ['nullable', 'string', 'max:500'],
            'dados' => ['required', 'string', 'max:150'],
        ];
    }

    public function messages(): array
    {
        return [
            'dados.required' => 'Informe sua chave Pix para recebimento.',
            'dados.max' => 'A chave Pix deve ter no máximo 150 caracteres.',
            'apresentacao.max' => 'A apresentação deve ter no máximo 500 caracteres.',
        ];
    }
}
