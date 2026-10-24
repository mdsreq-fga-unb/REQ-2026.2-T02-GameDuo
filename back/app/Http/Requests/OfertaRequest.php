<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OfertaRequest extends FormRequest
{
    // RN08: nesta entrega as ofertas são de coaching e duo
    public const MODALIDADES = ['Coaching', 'Duo'];

    public const JOGOS = ['Counter-Strike 2', 'League of Legends'];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'min:5', 'max:120'],
            'descricao' => ['nullable', 'string', 'max:1000'],
            'jogo' => ['required', 'string', Rule::in(self::JOGOS)],
            'modalidade' => ['required', 'string', Rule::in(self::MODALIDADES)],
            'nivel' => ['nullable', 'string', 'max:50'],
            'duracao' => ['required', 'integer', 'min:15', 'max:480'],
            'preco' => ['required', 'integer', 'min:1', 'max:100000'],
        ];
    }

    public function messages(): array
    {
        return [
            'titulo.required' => 'Informe o título da oferta.',
            'titulo.min' => 'O título deve ter pelo menos 5 caracteres.',
            'titulo.max' => 'O título deve ter no máximo 120 caracteres.',
            'jogo.required' => 'Escolha o jogo.',
            'jogo.in' => 'Escolha um jogo da lista.',
            'modalidade.required' => 'Escolha a modalidade.',
            'modalidade.in' => 'A modalidade deve ser Coaching ou Duo.',
            'duracao.required' => 'Informe a duração.',
            'duracao.integer' => 'A duração deve ser um número de minutos.',
            'duracao.min' => 'A duração mínima é de 15 minutos.',
            'duracao.max' => 'A duração máxima é de 480 minutos.',
            'preco.required' => 'Informe o preço.',
            'preco.integer' => 'O preço deve ser um número inteiro de créditos.',
            'preco.min' => 'O preço deve ser de pelo menos 1 crédito.',
            'preco.max' => 'O preço deve ser de no máximo 100000 créditos.',
        ];
    }
}
