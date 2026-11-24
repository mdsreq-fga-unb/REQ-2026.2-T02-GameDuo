<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContratacaoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'oferta_id' => ['required', 'integer'],
            // com fuso explícito, como a API devolve em /vagas
            'inicio' => ['required', 'string', 'date', 'regex:/(Z|[+-]\d{2}:\d{2})$/'],
            'contato' => ['required', 'string', 'max:100'],
            'preco' => ['nullable', 'integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'oferta_id.required' => 'Escolha uma oferta.',
            'inicio.required' => 'Escolha um horário.',
            'inicio.date' => 'Escolha um horário da lista.',
            'inicio.regex' => 'Escolha um horário da lista.',
            'contato.required' => 'Informe como o prestador pode falar com você.',
            'contato.max' => 'O contato deve ter no máximo 100 caracteres.',
        ];
    }
}
