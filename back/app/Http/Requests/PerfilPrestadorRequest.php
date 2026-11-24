<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

// RF04 / RN05
class PerfilPrestadorRequest extends FormRequest
{
    public const FORMATOS = ['Individual', 'Em grupo', 'Ao vivo', 'Análise de partidas'];

    public const IDIOMAS = ['Português', 'Inglês', 'Espanhol'];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return self::regras();
    }

    public static function regras(): array
    {
        return [
            'apresentacao' => ['required', 'string', 'max:500'],
            'jogos' => ['required', 'array', 'min:1', 'max:20'],
            'jogos.*.jogo' => ['required', 'string', 'distinct', Rule::exists('CatalogoJogo', 'nome')],
            'jogos.*.nivel' => ['required', 'string', 'max:50'],
            'modalidades' => ['required', 'array', 'min:1'],
            'modalidades.*' => ['string', 'distinct', Rule::in(OfertaRequest::MODALIDADES)],
            'formatos' => ['required', 'array', 'min:1'],
            'formatos.*' => ['string', 'distinct', Rule::in(self::FORMATOS)],
            'idiomas' => ['required', 'array', 'min:1'],
            'idiomas.*' => ['string', 'distinct', Rule::in(self::IDIOMAS)],
        ];
    }

    public function messages(): array
    {
        return self::mensagens();
    }

    public static function mensagens(): array
    {
        return [
            'apresentacao.required' => 'Escreva uma apresentação.',
            'apresentacao.max' => 'A apresentação deve ter no máximo 500 caracteres.',
            'jogos.required' => 'Escolha pelo menos um jogo.',
            'jogos.*.jogo.*' => 'Escolha jogos da lista, sem repetir.',
            'jogos.*.nivel.required' => 'Informe o nível em cada jogo escolhido.',
            'jogos.*.nivel.max' => 'O nível deve ter no máximo 50 caracteres.',
            'modalidades.required' => 'Escolha pelo menos uma modalidade.',
            'formatos.required' => 'Escolha pelo menos um formato.',
            'idiomas.required' => 'Escolha pelo menos um idioma.',
        ];
    }
}
