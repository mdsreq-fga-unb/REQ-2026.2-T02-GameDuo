<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

// Cadastro e edição de jogo pelo admin (RF50). Nome repetido é checado no controller (409).
class JogoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    // "  League   of Legends " → "League of Legends"
    protected function prepareForValidation(): void
    {
        if (is_string($this->nome)) {
            $this->merge(['nome' => preg_replace('/\s+/', ' ', trim($this->nome))]);
        }
    }

    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:60'],
            'ativo' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'Informe o nome do jogo.',
            'nome.max' => 'O nome do jogo deve ter no máximo 60 caracteres.',
            'ativo.required' => 'Informe se o jogo está ativo ou inativo.',
            'ativo.boolean' => 'A situação deve ser ativo ou inativo.',
        ];
    }
}
