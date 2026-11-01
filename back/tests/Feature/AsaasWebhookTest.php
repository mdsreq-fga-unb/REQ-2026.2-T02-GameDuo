<?php

namespace Tests\Feature;

use App\Models\Cobranca;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CriaTabelasDoSupabase;
use Tests\TestCase;

class AsaasWebhookTest extends TestCase
{
    use RefreshDatabase, CriaTabelasDoSupabase;

    private Cobranca $cobranca;

    protected function setUp(): void
    {
        parent::setUp();

        config(['asaas.webhook_token' => 'token-webhook']);

        $this->criarTabelasDoSupabase();
        $this->criarUsuario('jogador@gameduo.com');

        $this->cobranca = Cobranca::create([
            'email' => 'jogador@gameduo.com',
            'pacote' => 'padrao',
            'moedas' => 100,
            'valor' => 100,
            'forma' => 'pix',
            'status' => Cobranca::PENDENTE,
            'referencia' => '7f1c2a1e-0000-4000-8000-000000000001',
            'asaas_id' => 'pay_1',
            'asaas_cliente_id' => 'cus_1',
        ]);
    }

    private function aviso(string $id, string $evento = 'PAYMENT_RECEIVED', string $token = 'token-webhook')
    {
        return $this->withHeader('asaas-access-token', $token)->postJson('/api/webhooks/asaas', [
            'id' => $id,
            'event' => $evento,
            'payment' => ['id' => 'pay_1', 'externalReference' => $this->cobranca->referencia, 'value' => 100],
        ]);
    }

    private function saldo(): int
    {
        return $this->withToken($this->tokenDe('jogador@gameduo.com'))->getJson('/api/carteira')->json('saldo');
    }

    public function test_recusa_token_invalido(): void
    {
        $this->aviso('evt_1', token: 'errado')->assertUnauthorized();

        $this->assertDatabaseCount('WebhookRecebido', 0);
    }

    public function test_recusa_tudo_sem_token_configurado(): void
    {
        config(['asaas.webhook_token' => null]);

        $this->aviso('evt_1', token: '')->assertUnauthorized();
    }

    public function test_pagamento_credita_moedas(): void
    {
        $this->aviso('evt_1')->assertOk();

        $this->assertSame(Cobranca::PAGA, $this->cobranca->fresh()->status);
        $this->assertSame(100, $this->saldo());

        $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->getJson('/api/carteira/extrato')
            ->assertJsonCount(1, 'movimentos')
            ->assertJsonPath('movimentos.0.tipo', 'compra');
    }

    public function test_aviso_duplicado_nao_credita_em_dobro(): void
    {
        $this->aviso('evt_1')->assertOk();
        $this->aviso('evt_1')->assertOk()->assertJsonPath('message', 'Aviso já processado.');

        $this->assertDatabaseCount('WebhookRecebido', 1);
        $this->assertSame(100, $this->saldo());
    }

    public function test_confirmado_e_depois_recebido_credita_uma_vez(): void
    {
        $this->aviso('evt_1', 'PAYMENT_CONFIRMED')->assertOk();
        $this->aviso('evt_2', 'PAYMENT_RECEIVED')->assertOk();

        $this->assertDatabaseCount('MovimentoMoeda', 1);
        $this->assertSame(100, $this->saldo());
    }

    public function test_vencimento_marca_cobranca_sem_creditar(): void
    {
        $this->aviso('evt_1', 'PAYMENT_OVERDUE')->assertOk();

        $this->assertSame(Cobranca::VENCIDA, $this->cobranca->fresh()->status);
        $this->assertSame(0, $this->saldo());
    }

    public function test_aviso_de_cobranca_desconhecida_responde_200(): void
    {
        $this->withHeader('asaas-access-token', 'token-webhook')
            ->postJson('/api/webhooks/asaas', [
                'id' => 'evt_9',
                'event' => 'PAYMENT_RECEIVED',
                'payment' => ['id' => 'pay_de_outro_sistema'],
            ])
            ->assertOk();

        $this->assertDatabaseCount('MovimentoMoeda', 0);
    }
}
