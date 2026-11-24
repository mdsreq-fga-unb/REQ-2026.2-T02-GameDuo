<?php

namespace Tests\Feature;

use App\Models\Contratacao;
use App\Models\MovimentoMoeda;
use App\Models\MovimentoRecebimento;
use App\Models\Oferta;
use App\Models\Provedor;
use App\Models\Usuario;
use App\Services\Classes\RecebimentoService;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Testing\TestResponse;
use Tests\CriaTabelasDoSupabase;
use Tests\TestCase;

class ContratacaoTest extends TestCase
{
    use RefreshDatabase, CriaTabelasDoSupabase;

    private Oferta $oferta;

    // segunda-feira, 10:00 em Brasília
    private const AGORA = '2026-11-23T13:00:00Z';

    // terça-feira, 09:00 em Brasília
    private const VAGA = '2026-11-24T12:00:00Z';

    protected function setUp(): void
    {
        parent::setUp();

        Carbon::setTestNow(self::AGORA);
        $this->criarTabelasDoSupabase();
        $this->criarUsuario('coach@gameduo.com', prestador: true);
        $this->criarUsuario('ana@gameduo.com');
        $this->criarUsuario('bia@gameduo.com');
        $this->oferta = $this->novaOferta();
        $this->agenda($this->oferta, [['dia' => 2, 'inicio' => '09:00', 'fim' => '11:00']]);
        $this->creditar('ana@gameduo.com', 200);
        $this->creditar('bia@gameduo.com', 200);
    }

    private function novaOferta(int $duracao = 60): Oferta
    {
        $oferta = new Oferta([
            'titulo' => 'Treino de mira', 'jogo' => 'Counter-Strike 2', 'modalidade' => 'Coaching',
            'duracao' => $duracao, 'preco' => 85, 'comunicacao' => 'Discord', 'contato' => 'coach#1',
        ]);
        $oferta->email = 'coach@gameduo.com';
        $oferta->save();

        return $oferta;
    }

    private function agenda(Oferta $oferta, array $intervalos): TestResponse
    {
        return $this->como('coach@gameduo.com')->putJson("/api/ofertas/{$oferta->id}/agenda", ['intervalos' => $intervalos]);
    }

    private function creditar(string $email, int $moedas): void
    {
        MovimentoMoeda::create(['email' => $email, 'tipo' => 'compra', 'moedas' => $moedas]);
    }

    private function como(string $email): static
    {
        $this->actingAs(Usuario::find($email), 'api');

        return $this;
    }

    private function contratar(string $email = 'ana@gameduo.com', ?Oferta $oferta = null, string $inicio = self::VAGA, array $extra = []): TestResponse
    {
        return $this->como($email)->postJson('/api/contratacoes', [
            'oferta_id' => ($oferta ?? $this->oferta)->id, 'inicio' => $inicio, 'contato' => "{$email}#discord", ...$extra,
        ]);
    }

    private function resultado(string $email, string $resultado, ?string $justificativa = null): TestResponse
    {
        $id = Contratacao::value('id');

        return $this->como($email)->postJson("/api/contratacoes/{$id}/resultado", compact('resultado', 'justificativa'));
    }

    private function saldo(string $email): int
    {
        return (int) MovimentoMoeda::where('email', $email)->sum('moedas');
    }

    // ---------- agenda e vagas ----------

    public function test_vagas_seguem_a_agenda_no_fuso_de_brasilia(): void
    {
        $this->getJson("/api/ofertas/{$this->oferta->id}/vagas")
            ->assertOk()
            // duas terças em 14 dias, duas vagas de 60 min em cada
            ->assertJsonCount(4, 'vagas')
            ->assertJsonPath('vagas.0.inicio', '2026-11-24T12:00:00.000000Z')
            ->assertJsonPath('vagas.1.inicio', '2026-11-24T13:00:00.000000Z');
    }

    public function test_vaga_noturna_no_ultimo_dia_respeita_a_ocupacao(): void
    {
        // 23h em Brasília já é o dia seguinte em UTC
        $this->agenda($this->oferta, [['dia' => 0, 'inicio' => '22:00', 'fim' => '23:00']])->assertOk();
        $ultima = '2026-12-07T01:00:00Z';
        $this->contratar(inicio: $ultima)->assertCreated();
        $this->contratar('bia@gameduo.com', inicio: $ultima)->assertConflict();
    }

    public function test_vagas_nao_incluem_horarios_passados(): void
    {
        $this->agenda($this->oferta, [['dia' => 1, 'inicio' => '09:00', 'fim' => '11:00']])->assertOk();

        // hoje às 10:00 já começou: só restam as da segunda que vem
        $this->getJson("/api/ofertas/{$this->oferta->id}/vagas")
            ->assertJsonCount(2, 'vagas')
            ->assertJsonPath('vagas.0.inicio', '2026-11-30T12:00:00.000000Z');
    }

    public function test_agenda_recusa_sobreposicao_intervalo_curto_e_outro_dono(): void
    {
        $this->agenda($this->oferta, [
            ['dia' => 2, 'inicio' => '09:00', 'fim' => '11:00'],
            ['dia' => 2, 'inicio' => '10:30', 'fim' => '12:00'],
        ])->assertJsonValidationErrors('intervalos');

        $this->agenda($this->oferta, [['dia' => 2, 'inicio' => '09:00', 'fim' => '09:30']])->assertJsonValidationErrors('intervalos');
        $this->agenda($this->oferta, [['dia' => 2, 'inicio' => '11:00', 'fim' => '09:00']])->assertUnprocessable();

        $this->criarUsuario('outro@gameduo.com', prestador: true);
        $this->como('outro@gameduo.com')
            ->putJson("/api/ofertas/{$this->oferta->id}/agenda", ['intervalos' => []])
            ->assertForbidden();
    }

    // ---------- contratar e reservar ----------

    public function test_contratar_reserva_moedas_e_troca_contatos(): void
    {
        $this->contratar()
            ->assertCreated()
            ->assertJsonPath('contratacao.status', 'agendada')
            ->assertJsonPath('contratacao.outra_parte.contato', 'coach#1')
            ->assertJsonMissing(['contato' => 'ana@gameduo.com#discord']);

        $this->assertSame(115, $this->saldo('ana@gameduo.com'));

        $this->como('coach@gameduo.com')->getJson('/api/contratacoes')
            ->assertJsonPath('contratacoes.0.papel', 'prestador')
            ->assertJsonPath('contratacoes.0.outra_parte.contato', 'ana@gameduo.com#discord');

        $this->como('ana@gameduo.com')->getJson('/api/carteira')
            ->assertJsonPath('saldo', 115)
            ->assertJsonPath('retido', 85)
            ->assertJsonPath('retidos.0.titulo', 'Treino de mira');
    }

    public function test_mesmo_horario_so_e_contratado_uma_vez(): void
    {
        $this->contratar()->assertCreated();
        $this->contratar('bia@gameduo.com')->assertConflict();
        $this->contratar()->assertConflict();

        $this->assertDatabaseCount('Contratacao', 1);
        $this->assertSame(200, $this->saldo('bia@gameduo.com'));
        $this->assertSame(115, $this->saldo('ana@gameduo.com'));
    }

    public function test_horario_ocupado_some_de_todas_as_ofertas_do_prestador(): void
    {
        $outra = $this->novaOferta(90);
        $this->agenda($outra, [['dia' => 2, 'inicio' => '08:00', 'fim' => '12:30']])->assertOk();
        $this->contratar()->assertCreated();

        // 08:00–09:30 cruza a sessão das 09:00
        $this->contratar('bia@gameduo.com', $outra, '2026-11-24T11:00:00Z')->assertConflict();
        $this->contratar('bia@gameduo.com', $outra, '2026-11-24T14:00:00Z')->assertCreated();
    }

    public function test_nao_contrata_sem_saldo_fora_da_agenda_ou_a_propria_oferta(): void
    {
        MovimentoMoeda::where('email', 'ana@gameduo.com')->delete();
        $this->contratar()->assertUnprocessable();
        $this->contratar('bia@gameduo.com', inicio: '2026-11-24T12:30:00Z')->assertConflict();
        $this->contratar('coach@gameduo.com')->assertUnprocessable();
        $this->contratar('bia@gameduo.com', extra: ['preco' => 10])->assertConflict();
        $this->assertDatabaseCount('Contratacao', 0);
    }

    public function test_contratar_exige_login(): void
    {
        $this->app['auth']->forgetGuards();
        $this->postJson('/api/contratacoes', [])->assertUnauthorized();
    }

    public function test_oferta_antiga_sem_contato_usa_o_email(): void
    {
        $this->oferta->update(['contato' => null, 'comunicacao' => null]);
        $this->contratar()->assertJsonPath('contratacao.outra_parte.contato', 'coach@gameduo.com');
    }

    // ---------- encerrar oferta ----------

    public function test_encerrar_tira_do_catalogo_e_mantem_o_contratado(): void
    {
        $this->contratar()->assertCreated();
        $this->como('coach@gameduo.com')->deleteJson("/api/ofertas/{$this->oferta->id}")->assertOk();

        $this->getJson('/api/ofertas')->assertJsonCount(0, 'ofertas');
        $this->getJson("/api/ofertas/{$this->oferta->id}")->assertNotFound();
        $this->getJson("/api/ofertas/{$this->oferta->id}/vagas")->assertNotFound();
        $this->getJson('/api/minhas-ofertas')->assertJsonCount(0, 'ofertas');
        $this->contratar('bia@gameduo.com', inicio: '2026-11-24T13:00:00Z')->assertConflict();
        $this->assertDatabaseHas('Contratacao', ['status' => 'agendada', 'preco' => 85]);
    }

    public function test_mudar_o_preco_nao_altera_o_contratado(): void
    {
        $this->contratar();
        $this->oferta->update(['preco' => 500, 'duracao' => 120]);
        $this->assertDatabaseHas('Contratacao', ['preco' => 85, 'duracao' => 60]);
    }

    // ---------- cancelar ----------

    public function test_cancelar_devolve_tudo_uma_vez_e_libera_o_horario(): void
    {
        $id = $this->contratar()->json('contratacao.id');

        $this->como('coach@gameduo.com')->postJson("/api/contratacoes/{$id}/cancelar")
            ->assertOk()->assertJsonPath('contratacao.cancelada_por', 'prestador');
        $this->como('ana@gameduo.com')->postJson("/api/contratacoes/{$id}/cancelar")->assertConflict();

        $this->assertSame(200, $this->saldo('ana@gameduo.com'));
        $this->contratar('bia@gameduo.com')->assertCreated();
    }

    public function test_nao_cancela_depois_do_horario_nem_de_terceiros(): void
    {
        $id = $this->contratar()->json('contratacao.id');
        $this->como('bia@gameduo.com')->postJson("/api/contratacoes/{$id}/cancelar")->assertNotFound();

        Carbon::setTestNow(self::VAGA);
        $this->como('ana@gameduo.com')->postJson("/api/contratacoes/{$id}/cancelar")->assertConflict();
        $this->assertSame(115, $this->saldo('ana@gameduo.com'));
    }

    // ---------- resultado, liberação e divisão ----------

    public function test_dois_ocorreu_conclui_e_divide_70_30(): void
    {
        $this->contratar();
        $this->resultado('ana@gameduo.com', 'ocorreu')->assertConflict();

        Carbon::setTestNow('2026-11-24T13:00:00Z');
        $this->resultado('ana@gameduo.com', 'ocorreu')->assertOk()->assertJsonPath('contratacao.status', 'agendada');
        $this->resultado('ana@gameduo.com', 'ocorreu')->assertConflict();
        $this->resultado('bia@gameduo.com', 'ocorreu')->assertNotFound();
        $this->resultado('coach@gameduo.com', 'ocorreu')->assertOk()->assertJsonPath('contratacao.status', 'concluida');

        // 85 moedas: R$ 59,50 e R$ 25,50
        $this->assertDatabaseHas('MovimentoRecebimento', ['email' => 'coach@gameduo.com', 'tipo' => 'repasse', 'centavos' => 5950]);
        $this->assertDatabaseHas('MovimentoRecebimento', ['email' => null, 'tipo' => 'comissao', 'centavos' => 2550]);

        $this->como('coach@gameduo.com')->getJson('/api/carteira')
            ->assertJsonPath('recebimentos.disponivel', 0)
            ->assertJsonPath('recebimentos.em_carencia', 59.5)
            ->assertJsonPath('recebimentos.carencias.0.disponivel_em', '2026-12-24T13:00:00.000000Z');

        Carbon::setTestNow('2026-12-24T13:00:00Z');
        $this->assertSame(5950, app(RecebimentoService::class)->disponivel('coach@gameduo.com'));
    }

    public function test_prazo_de_48h_conclui_sozinho_uma_unica_vez(): void
    {
        $this->contratar();

        // a sessão termina às 13:00Z do dia 24
        Carbon::setTestNow('2026-11-26T13:00:00Z');
        $this->artisan('contratacoes:concluir')->assertSuccessful();
        $this->assertDatabaseHas('Contratacao', ['status' => 'agendada']);

        Carbon::setTestNow('2026-11-26T13:00:01Z');
        $this->resultado('ana@gameduo.com', 'problema', 'Não apareceu')->assertConflict();
        $this->artisan('contratacoes:concluir');
        $this->artisan('contratacoes:concluir');

        $this->assertDatabaseHas('Contratacao', ['status' => 'concluida']);
        $this->assertDatabaseCount('MovimentoRecebimento', 2);
    }

    public function test_abrir_a_lista_conclui_vencidas_sem_agendador(): void
    {
        $this->contratar();
        Carbon::setTestNow('2026-11-27T00:00:00Z');
        $this->como('ana@gameduo.com')->getJson('/api/contratacoes')->assertJsonPath('contratacoes.0.status', 'concluida');
    }

    public function test_problema_exige_justificativa_e_suspende_a_liberacao(): void
    {
        $this->contratar();
        Carbon::setTestNow('2026-11-24T13:00:00Z');

        $this->resultado('ana@gameduo.com', 'problema')->assertJsonValidationErrors('justificativa');
        $this->resultado('coach@gameduo.com', 'ocorreu')->assertOk();
        $this->resultado('ana@gameduo.com', 'nao_ocorreu', 'O prestador faltou')->assertJsonPath('contratacao.status', 'em_analise');

        Carbon::setTestNow('2026-12-30T13:00:00Z');
        $this->artisan('contratacoes:concluir');
        $this->assertDatabaseHas('Contratacao', ['status' => 'em_analise']);
        $this->assertDatabaseCount('MovimentoRecebimento', 0);
        $this->como('ana@gameduo.com')->getJson('/api/carteira')->assertJsonPath('retido', 85);
    }

    public function test_confirmacao_depois_do_problema_nao_libera(): void
    {
        $this->contratar();
        Carbon::setTestNow('2026-11-24T13:00:00Z');
        $this->resultado('ana@gameduo.com', 'problema', 'Caiu');
        $this->resultado('coach@gameduo.com', 'ocorreu')->assertJsonPath('contratacao.status', 'em_analise');
        $this->assertDatabaseCount('MovimentoRecebimento', 0);
    }

    public function test_admin_decide_devolver_ou_liberar(): void
    {
        $this->criarAdmin('admin@gameduo.com');
        $this->contratar();
        $id = Contratacao::value('id');
        $args = ['id' => $id, '--motivo' => 'Relato conferido', '--admin' => 'admin@gameduo.com'];

        // só em análise, só admin e só com motivo
        $this->artisan('contratacoes:decidir', [...$args, 'decisao' => 'devolver'])->assertFailed();
        Carbon::setTestNow('2026-11-24T13:00:00Z');
        $this->resultado('ana@gameduo.com', 'problema', 'Caiu');
        $this->artisan('contratacoes:decidir', [...$args, 'decisao' => 'devolver', '--admin' => 'ana@gameduo.com'])->assertFailed();
        $this->artisan('contratacoes:decidir', [...$args, 'decisao' => 'devolver', '--motivo' => ''])->assertFailed();

        $this->artisan('contratacoes:decidir', [...$args, 'decisao' => 'devolver'])->assertSuccessful();
        $this->artisan('contratacoes:decidir', [...$args, 'decisao' => 'liberar'])->assertFailed();
        $this->assertSame(200, $this->saldo('ana@gameduo.com'));
        $this->assertDatabaseHas('MovimentoMoeda', ['chave' => "devolucao:{$id}", 'autor' => 'admin@gameduo.com']);

        $this->contratar(inicio: '2026-12-01T12:00:00Z')->assertCreated();
        $novo = Contratacao::latest('id')->value('id');
        Contratacao::whereKey($novo)->update(['status' => 'em_analise']);
        $this->artisan('contratacoes:decidir', [...$args, 'id' => $novo, 'decisao' => 'liberar'])->assertSuccessful();
        $this->assertDatabaseHas('MovimentoRecebimento', ['chave' => "repasse:{$novo}", 'centavos' => 5950]);
    }

    public function test_banco_impede_repasse_em_dobro(): void
    {
        $this->contratar();
        $contratacao = Contratacao::first();
        $contratacao->concluida_em = now();
        app(RecebimentoService::class)->dividir($contratacao, 'sistema');

        $this->expectException(UniqueConstraintViolationException::class);
        app(RecebimentoService::class)->dividir($contratacao, 'sistema');
    }

    public function test_dados_sigilosos_nao_aparecem_em_respostas_publicas(): void
    {
        Provedor::find('coach@gameduo.com')->update(['cpf_titular' => '52998224725', 'tipo_chave' => 'EMAIL']);
        $codigo = Provedor::find('coach@gameduo.com')->codigo;

        foreach (['/api/ofertas', "/api/ofertas/{$this->oferta->id}", "/api/prestadores/{$codigo}"] as $rota) {
            $corpo = $this->getJson($rota)->assertOk()->getContent();
            foreach (['coach@gameduo.com', 'pix@teste.com', '52998224725', 'coach#1'] as $segredo) {
                $this->assertStringNotContainsString($segredo, $corpo, $rota);
            }
        }
    }
}
