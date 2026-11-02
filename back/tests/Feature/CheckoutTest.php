<?php

namespace Tests\Feature;

use App\Models\Cobranca;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\CriaTabelasDoSupabase;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase, CriaTabelasDoSupabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['asaas.url' => 'https://asaas.teste/v3', 'asaas.api_key' => 'chave-teste']);

        $this->criarTabelasDoSupabase();
        $this->criarUsuario('jogador@gameduo.com');
    }

    private function fingirAsaas(): void
    {
        Http::fake([
            'asaas.teste/v3/customers' => Http::response(['id' => 'cus_1']),
            'asaas.teste/v3/payments' => Http::response([
                'id' => 'pay_1',
                'customer' => 'cus_1',
                'invoiceUrl' => 'https://sandbox.asaas.com/i/pay_1',
            ]),
            'asaas.teste/v3/payments/pay_1/pixQrCode' => Http::response([
                'encodedImage' => 'iVBORw0KGgo=',
                'payload' => '00020126pix-copia-e-cola',
                'expirationDate' => '2026-11-02 23:59:59',
            ]),
        ]);
    }

    public function test_cliente_gera_cobranca_pix(): void
    {
        $this->fingirAsaas();

        $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->postJson('/api/checkout', ['pacote' => 'padrao', 'forma' => 'pix', 'cpf' => '529.982.247-25'])
            ->assertCreated()
            ->assertJsonPath('cobranca.status', 'pendente')
            ->assertJsonPath('cobranca.moedas', 100)
            ->assertJsonPath('pix.copia_cola', '00020126pix-copia-e-cola');

        $this->assertDatabaseHas('Cobranca', [
            'email' => 'jogador@gameduo.com',
            'asaas_id' => 'pay_1',
            'status' => 'pendente',
        ]);

        Http::assertSent(fn (Request $r) => $r->url() === 'https://asaas.teste/v3/customers'
            && $r['cpfCnpj'] === '52998224725'
            && $r->hasHeader('access_token', 'chave-teste'));

        Http::assertSent(fn (Request $r) => $r->url() === 'https://asaas.teste/v3/payments'
            && $r['billingType'] === 'PIX'
            && $r['value'] == 100);
    }

    public function test_cartao_devolve_link_sem_qrcode(): void
    {
        $this->fingirAsaas();

        $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->postJson('/api/checkout', ['pacote' => 'basico', 'forma' => 'cartao', 'cpf' => '52998224725'])
            ->assertCreated()
            ->assertJsonPath('cobranca.link_pagamento', 'https://sandbox.asaas.com/i/pay_1')
            ->assertJsonPath('pix', null);

        Http::assertSent(fn (Request $r) => $r->url() === 'https://asaas.teste/v3/payments'
            && $r['billingType'] === 'CREDIT_CARD');
        Http::assertNotSent(fn (Request $r) => str_contains($r->url(), 'pixQrCode'));
    }

    public function test_segunda_compra_reaproveita_o_cliente_do_asaas(): void
    {
        $this->fingirAsaas();
        $token = $this->tokenDe('jogador@gameduo.com');

        $this->withToken($token)
            ->postJson('/api/checkout', ['pacote' => 'basico', 'forma' => 'cartao', 'cpf' => '52998224725'])
            ->assertCreated();

        Cobranca::query()->update(['asaas_id' => 'pay_antigo']);

        $this->withToken($token)
            ->postJson('/api/checkout', ['pacote' => 'basico', 'forma' => 'cartao'])
            ->assertCreated();

        $criacoesDeCliente = collect(Http::recorded())
            ->filter(fn ($par) => str_ends_with($par[0]->url(), '/customers'));

        $this->assertCount(1, $criacoesDeCliente);
    }

    public function test_primeira_compra_exige_cpf(): void
    {
        $this->fingirAsaas();

        $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->postJson('/api/checkout', ['pacote' => 'basico', 'forma' => 'pix'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('cpf');

        Http::assertNothingSent();
    }

    public function test_valida_pacote_e_forma(): void
    {
        $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->postJson('/api/checkout', ['pacote' => 'gratis', 'forma' => 'boleto'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['pacote', 'forma']);
    }

    public function test_erro_no_asaas_nao_grava_cobranca(): void
    {
        Http::fake([
            'asaas.teste/v3/customers' => Http::response([
                'errors' => [['code' => 'invalid_cpfCnpj', 'description' => 'O CPF informado é inválido.']],
            ], 400),
        ]);

        $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->postJson('/api/checkout', ['pacote' => 'basico', 'forma' => 'pix', 'cpf' => '11111111111'])
            ->assertStatus(502)
            ->assertJsonPath('detalhes.0', 'O CPF informado é inválido.');

        $this->assertDatabaseCount('Cobranca', 0);
    }

    public function test_falha_de_conexao_com_o_asaas_responde_502(): void
    {
        Http::fake(fn () => throw new ConnectionException('cURL error 60: SSL certificate problem'));

        $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->postJson('/api/checkout', ['pacote' => 'basico', 'forma' => 'pix', 'cpf' => '52998224725'])
            ->assertStatus(502)
            ->assertJsonPath('detalhes', null)
            ->assertJsonMissingPath('trace');

        $this->assertDatabaseCount('Cobranca', 0);
    }

    public function test_so_o_dono_consulta_a_cobranca(): void
    {
        $this->fingirAsaas();
        $this->criarUsuario('outro@gameduo.com');

        $id = $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->postJson('/api/checkout', ['pacote' => 'basico', 'forma' => 'pix', 'cpf' => '52998224725'])
            ->json('cobranca.id');

        $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->getJson("/api/checkout/{$id}")
            ->assertOk()
            ->assertJsonPath('cobranca.status', 'pendente');

        $this->withToken($this->tokenDe('outro@gameduo.com'))
            ->getJson("/api/checkout/{$id}")
            ->assertNotFound();
    }

    public function test_checkout_exige_login(): void
    {
        $this->postJson('/api/checkout', ['pacote' => 'basico', 'forma' => 'pix'])->assertUnauthorized();
    }
}
