<?php

namespace Tests\Feature;

use App\Jobs\EnviarSaque;
use App\Models\MovimentoRecebimento;
use App\Models\Provedor;
use App\Models\Saque;
use App\Models\Usuario;
use App\Services\Classes\RecebimentoService;
use App\Services\Classes\SaqueService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Illuminate\Testing\TestResponse;
use Tests\CriaTabelasDoSupabase;
use Tests\TestCase;

class SaqueTest extends TestCase
{
    use RefreshDatabase, CriaTabelasDoSupabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['asaas.url' => 'https://asaas.teste/v3', 'asaas.api_key' => 'k', 'asaas.webhook_token' => 'segredo']);
        $this->criarTabelasDoSupabase();
        $this->criarUsuario('coach@gameduo.com', prestador: true);
        Provedor::find('coach@gameduo.com')->update(['tipo_chave' => 'EMAIL', 'cpf_titular' => '52998224725']);
        $this->repasse(10000, now()->subDay(), 'a');
        $this->repasse(5000, now()->addDay(), 'b');
        $this->actingAs(Usuario::find('coach@gameduo.com'), 'api');
    }

    private function repasse(int $centavos, $disponivelEm, string $chave): void
    {
        MovimentoRecebimento::create([
            'email' => 'coach@gameduo.com', 'tipo' => 'repasse', 'centavos' => $centavos,
            'disponivel_em' => $disponivelEm, 'chave' => $chave,
        ]);
    }

    private function asaas(array $corpo = ['id' => 'tra_1', 'status' => 'PENDING'], int $status = 200): void
    {
        Http::fake(['asaas.teste/v3/transfers' => Http::response($corpo, $status)]);
    }

    private function sacar(float|int $valor): TestResponse
    {
        return $this->postJson('/api/saques', ['valor' => $valor]);
    }

    private function aviso(string $id, string $evento, array $transferencia): TestResponse
    {
        return $this->withHeader('asaas-access-token', 'segredo')
            ->postJson('/api/webhooks/asaas', ['id' => $id, 'event' => $evento, 'transfer' => $transferencia]);
    }

    private function disponivel(): int
    {
        return app(RecebimentoService::class)->disponivel('coach@gameduo.com');
    }

    public function test_saque_reserva_o_valor_e_envia_a_transferencia(): void
    {
        $this->asaas();
        $this->sacar(60.5)->assertCreated()->assertJsonPath('saque.status', 'processando');

        $this->assertSame(3950, $this->disponivel());
        $this->getJson('/api/carteira')->assertJsonPath('recebimentos.em_saque', 60.5);
        Http::assertSent(fn (Request $r) => $r['value'] === 60.5 && $r['pixAddressKey'] === 'pix@teste.com'
            && $r['pixAddressKeyType'] === 'EMAIL' && $r['externalReference'] === Saque::value('referencia'));
        // a chave não fica legível no banco
        $this->assertStringNotContainsString('pix@teste.com', Saque::first()->getRawOriginal('chave_pix'));
    }

    public function test_respeita_minimo_saldo_carencia_e_dados(): void
    {
        $this->asaas();
        $this->sacar(19.99)->assertJsonValidationErrors('valor');
        $this->sacar(100.01)->assertJsonValidationErrors('valor');
        $this->sacar(60)->assertCreated();
        $this->sacar(60)->assertJsonValidationErrors('valor');

        Provedor::find('coach@gameduo.com')->update(['cpf_titular' => null]);
        $this->actingAs(Usuario::find('coach@gameduo.com'), 'api');
        $this->sacar(20)->assertUnprocessable();
        $this->assertDatabaseCount('Saque', 1);
    }

    public function test_quem_nao_e_prestador_nao_saca(): void
    {
        $this->actingAs($this->criarUsuario('ana@gameduo.com'), 'api');
        $this->sacar(50)->assertForbidden();
    }

    public function test_aviso_conclui_e_repetido_nao_muda_nada(): void
    {
        $this->asaas();
        $this->sacar(60);
        $transferencia = ['id' => 'tra_1', 'status' => 'DONE', 'externalReference' => Saque::value('referencia')];

        $this->aviso('evt_1', 'TRANSFER_DONE', $transferencia)->assertOk();
        $this->aviso('evt_1', 'TRANSFER_DONE', $transferencia)->assertOk();
        $this->aviso('evt_2', 'TRANSFER_FAILED', [...$transferencia, 'status' => 'FAILED'])->assertOk();

        $this->assertDatabaseHas('Saque', ['status' => 'pago', 'asaas_id' => 'tra_1']);
        $this->assertSame(4000, $this->disponivel());
    }

    public function test_falha_devolve_o_valor_uma_vez(): void
    {
        $this->asaas();
        $this->sacar(60);
        $transferencia = ['id' => 'tra_1', 'status' => 'FAILED', 'failReason' => 'Chave inexistente'];

        $this->aviso('evt_1', 'TRANSFER_FAILED', $transferencia);
        $this->aviso('evt_2', 'TRANSFER_FAILED', $transferencia);

        $this->assertSame(10000, $this->disponivel());
        $this->getJson('/api/saques')->assertJsonPath('saques.0.status', 'falhou')->assertJsonPath('saques.0.motivo_falha', 'Chave inexistente');
    }

    public function test_recusa_do_asaas_estorna_na_hora(): void
    {
        $this->asaas(['errors' => []], 400);
        $this->sacar(60)->assertCreated()->assertJsonPath('saque.status', 'falhou');
        $this->assertSame(10000, $this->disponivel());
    }

    public function test_resultado_incerto_nao_estorna_nem_reenvia(): void
    {
        $this->asaas([], 500);
        $this->sacar(60)->assertJsonPath('saque.status', 'verificacao');
        $this->assertSame(4000, $this->disponivel());

        app(SaqueService::class)->enviar(Saque::value('id'));
        $this->travel(1)->hours();
        $this->artisan('saques:reenfileirar');
        Http::assertSentCount(1);
    }

    public function test_sem_conexao_fica_em_verificacao_e_admin_resolve(): void
    {
        Http::fake(fn () => throw new ConnectionException('timeout'));
        $this->sacar(60)->assertJsonPath('saque.status', 'verificacao');

        $this->criarAdmin('admin@gameduo.com');
        $args = ['id' => Saque::value('id'), 'resultado' => 'falhou', '--motivo' => 'Conferido no painel'];
        $this->artisan('saques:resolver', [...$args, '--admin' => 'coach@gameduo.com'])->assertFailed();
        $this->artisan('saques:resolver', [...$args, '--admin' => 'admin@gameduo.com'])->assertSuccessful();
        $this->artisan('saques:resolver', [...$args, '--admin' => 'admin@gameduo.com']);

        $this->assertSame(10000, $this->disponivel());
        $this->assertDatabaseHas('Saque', ['status' => 'falhou', 'resolvido_por' => 'admin@gameduo.com']);
    }

    public function test_pedido_perdido_na_fila_e_reenfileirado(): void
    {
        Queue::fake();
        $this->sacar(60)->assertJsonPath('saque.status', 'solicitado');
        $this->artisan('saques:reenfileirar');
        Queue::assertPushed(EnviarSaque::class, 1);
        $this->travel(6)->minutes();
        $this->artisan('saques:reenfileirar');
        Queue::assertPushed(EnviarSaque::class, 2);
    }

    public function test_aviso_de_transferencia_desconhecida_e_ignorado(): void
    {
        $this->aviso('evt_9', 'TRANSFER_DONE', ['id' => 'x', 'status' => 'DONE', 'externalReference' => 'nao-e-uuid'])->assertOk();
        $this->assertDatabaseCount('Saque', 0);
    }

    public function test_prestador_mantem_dados_de_recebimento(): void
    {
        $this->putJson('/api/prestador/recebimento', ['tipo_chave' => 'PHONE', 'dados' => '+55 (61) 99999-8888', 'cpf_titular' => '529.982.247-25'])->assertOk();
        $this->actingAs(Usuario::find('coach@gameduo.com'), 'api');
        $this->getJson('/api/prestador/recebimento')
            ->assertJsonPath('dados', '61999998888')
            ->assertJsonPath('cpf_titular', '52998224725');
        $this->assertStringNotContainsString('52998224725', Provedor::first()->getRawOriginal('cpf_titular'));

        $this->putJson('/api/prestador/recebimento', ['tipo_chave' => 'EMAIL', 'dados' => 'nao-email', 'cpf_titular' => '11111111111'])
            ->assertJsonValidationErrors(['dados', 'cpf_titular']);
    }
}
