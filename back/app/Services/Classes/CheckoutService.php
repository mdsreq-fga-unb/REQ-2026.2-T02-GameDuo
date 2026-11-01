<?php

namespace App\Services\Classes;

use App\Models\Cobranca;
use App\Models\Usuario;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    public function __construct(private AsaasService $asaas)
    {
    }

    // cria a cobrança no Asaas e grava como pendente; devolve a cobrança e, no Pix, o QR Code
    public function criar(Usuario $usuario, string $pacote, string $forma, ?string $cpf): array
    {
        $dadosPacote = config("asaas.pacotes.{$pacote}");
        $referencia = (string) Str::uuid();

        $pagamento = $this->asaas->criarCobranca(
            $this->clienteAsaas($usuario, $cpf),
            $forma,
            $dadosPacote['valor'],
            "GameDuo - {$dadosPacote['moedas']} moedas",
            $referencia,
        );

        $pix = $forma === 'pix' ? $this->asaas->qrCodePix($pagamento['id']) : null;

        $cobranca = Cobranca::create([
            'email' => $usuario->email,
            'pacote' => $pacote,
            'moedas' => $dadosPacote['moedas'],
            'valor' => $dadosPacote['valor'],
            'forma' => $forma,
            'status' => Cobranca::PENDENTE,
            'referencia' => $referencia,
            'asaas_id' => $pagamento['id'],
            'asaas_cliente_id' => $pagamento['customer'],
            'link_pagamento' => $pagamento['invoiceUrl'] ?? null,
            'pix_copia_cola' => $pix['payload'] ?? null,
        ]);

        return [
            'cobranca' => $cobranca->resumo(),
            'pix' => $pix ? [
                'qrcode' => $pix['encodedImage'],
                'copia_cola' => $pix['payload'],
                'expira_em' => $pix['expirationDate'],
            ] : null,
        ];
    }

    public function pertenceA(Cobranca $cobranca, Usuario $usuario): bool
    {
        return $cobranca->email === $usuario->email;
    }

    // reaproveita o cliente das compras anteriores para não criar duplicado no Asaas
    private function clienteAsaas(Usuario $usuario, ?string $cpf): string
    {
        $clienteId = Cobranca::where('email', $usuario->email)->latest('id')->value('asaas_cliente_id');

        if ($clienteId) {
            return $clienteId;
        }

        if (! $cpf) {
            throw ValidationException::withMessages([
                'cpf' => 'Informe o CPF para a primeira compra.',
            ]);
        }

        return $this->asaas->criarCliente($usuario->nome, $usuario->email, $cpf);
    }
}
