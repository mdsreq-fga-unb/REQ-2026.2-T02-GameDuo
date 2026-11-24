<?php

namespace App\Http\Requests;

use App\Models\Contratacao;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ResultadoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'resultado' => ['required', 'string', Rule::in([Contratacao::OCORREU, Contratacao::NAO_OCORREU, Contratacao::PROBLEMA])],
            // RN28: justificativa quando aplicável
            'justificativa' => ['nullable', 'string', 'max:1000', 'required_unless:resultado,'.Contratacao::OCORREU],
        ];
    }

    public function messages(): array
    {
        return [
            'resultado.required' => 'Informe o que aconteceu na sessão.',
            'resultado.in' => 'Escolha uma das opções de resultado.',
            'justificativa.required_unless' => 'Conte o que aconteceu.',
            'justificativa.max' => 'A justificativa deve ter no máximo 1000 caracteres.',
        ];
    }
}
