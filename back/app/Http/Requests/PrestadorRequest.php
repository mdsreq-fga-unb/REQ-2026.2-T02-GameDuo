<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

// Ativação: perfil de prestação (RN05) e dados de recebimento (RN06) juntos
class PrestadorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(RecebimentoRequest::normalizar($this->only(['dados', 'tipo_chave', 'cpf_titular'])));
    }

    public function rules(): array
    {
        return [
            ...PerfilPrestadorRequest::regras(),
            ...RecebimentoRequest::regras($this->input('tipo_chave')),
        ];
    }

    public function messages(): array
    {
        return [
            ...PerfilPrestadorRequest::mensagens(),
            ...RecebimentoRequest::mensagens(),
        ];
    }
}
