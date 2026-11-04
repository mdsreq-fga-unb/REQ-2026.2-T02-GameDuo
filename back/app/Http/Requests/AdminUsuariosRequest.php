<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

// Filtros da lista de usuários do painel admin (RF44), vindos da query string.
class AdminUsuariosRequest extends FormRequest
{
    public const TIPOS = ['todos', 'consumidores', 'prestadores'];

    // limite para ninguém pedir a base inteira de uma vez
    public const MAX_POR_PAGINA = 50;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'busca' => ['nullable', 'string', 'max:100'],
            'tipo' => ['nullable', 'string', Rule::in(self::TIPOS)],
            'pagina' => ['nullable', 'integer', 'min:1'],
            'por_pagina' => ['nullable', 'integer', 'min:1', 'max:' . self::MAX_POR_PAGINA],
        ];
    }

    public function messages(): array
    {
        return [
            'busca.max' => 'A busca deve ter no máximo 100 caracteres.',
            'tipo.in' => 'O tipo deve ser todos, consumidores ou prestadores.',
            'pagina.integer' => 'A página deve ser um número.',
            'pagina.min' => 'A página deve ser 1 ou maior.',
            'por_pagina.integer' => 'A quantidade por página deve ser um número.',
            'por_pagina.min' => 'A quantidade por página deve ser 1 ou maior.',
            'por_pagina.max' => 'A quantidade por página deve ser no máximo ' . self::MAX_POR_PAGINA . '.',
        ];
    }
}
