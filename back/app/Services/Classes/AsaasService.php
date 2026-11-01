<?php

namespace App\Services\Classes;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

// Única classe do projeto que faz requisição para o Asaas.
class AsaasService
{
    private const FORMAS = [
        'pix' => 'PIX',
        'cartao' => 'CREDIT_CARD',
    ];

    // devolve o id do cliente no Asaas (cus_...)
    public function criarCliente(string $nome, string $email, string $cpf): string
    {
        return $this->http()->post('/customers', [
            'name' => $nome,
            'email' => $email,
            'cpfCnpj' => $cpf,
            'notificationDisabled' => true,
        ])->throw()->json('id');
    }

    public function criarCobranca(
        string $clienteId,
        string $forma,
        float $valor,
        string $descricao,
        string $referencia
    ): array {
        return $this->http()->post('/payments', [
            'customer' => $clienteId,
            'billingType' => self::FORMAS[$forma],
            'value' => $valor,
            'dueDate' => now()->addDays(config('asaas.vencimento_dias'))->toDateString(),
            'description' => $descricao,
            'externalReference' => $referencia,
        ])->throw()->json();
    }

    // encodedImage (PNG em base64), payload (copia e cola) e expirationDate
    public function qrCodePix(string $cobrancaId): array
    {
        return $this->http()->get("/payments/{$cobrancaId}/pixQrCode")->throw()->json();
    }

    private function http(): PendingRequest
    {
        return Http::baseUrl(config('asaas.url'))
            ->withHeaders([
                'access_token' => config('asaas.api_key'),
                'User-Agent' => 'GameDuo',
            ])
            ->acceptJson()
            ->timeout(15);
    }
}
