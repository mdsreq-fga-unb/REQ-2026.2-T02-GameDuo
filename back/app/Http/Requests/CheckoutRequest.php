<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckoutRequest extends FormRequest
{
    public const FORMAS = ['pix', 'cartao'];

    public function authorize(): bool
    {
        return true;
    }

    // aceita o CPF com ou sem pontuação
    protected function prepareForValidation(): void
    {
        if ($this->filled('cpf')) {
            $this->merge(['cpf' => preg_replace('/\D/', '', (string) $this->input('cpf'))]);
        }
    }

    public function rules(): array
    {
        return [
            'pacote' => ['required', 'string', Rule::in(array_keys(config('asaas.pacotes')))],
            'forma' => ['required', 'string', Rule::in(self::FORMAS)],
            // obrigatório só na primeira compra (o CheckoutService confere)
            'cpf' => ['nullable', 'digits:11'],
        ];
    }

    public function messages(): array
    {
        return [
            'pacote.required' => 'Escolha um pacote de moedas.',
            'pacote.in' => 'Escolha um pacote da lista.',
            'forma.required' => 'Escolha a forma de pagamento.',
            'forma.in' => 'A forma de pagamento deve ser Pix ou cartão.',
            'cpf.digits' => 'O CPF deve ter 11 dígitos.',
        ];
    }
}
