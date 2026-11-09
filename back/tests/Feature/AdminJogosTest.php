<?php

namespace Tests\Feature;

use App\Models\CatalogoJogo;
use App\Models\Oferta;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CriaTabelasDoSupabase;
use Tests\TestCase;

// RF50: o admin mantém os jogos; o catálogo e as ofertas usam só os ativos.
// A migration já cria Counter-Strike 2 e League of Legends, ambos ativos.
class AdminJogosTest extends TestCase
{
    use RefreshDatabase, CriaTabelasDoSupabase;

    private ?string $token = null;

    private array $oferta = [
        'titulo' => 'Coaching de mira',
        'modalidade' => 'Coaching',
        'duracao' => 60,
        'preco' => 100,
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->criarTabelasDoSupabase();
        $this->criarAdmin('ciro@gameduo.com');
    }

    // o login do admin só acontece nos testes que precisam dele
    private function tokenDoAdmin(): string
    {
        return $this->token ??= $this->tokenDe('ciro@gameduo.com');
    }

    private function salvar(array $dados, ?int $id = null)
    {
        $request = $this->withToken($this->tokenDoAdmin());

        return $id ? $request->putJson("/api/admin/jogos/{$id}", $dados) : $request->postJson('/api/admin/jogos', $dados);
    }

    private function idDe(string $nome): int
    {
        return CatalogoJogo::where('nome', $nome)->value('id');
    }

    public function test_admin_lista_ativos_e_inativos(): void
    {
        CatalogoJogo::create(['nome' => 'Valorant', 'ativo' => false]);

        $this->withToken($this->tokenDoAdmin())
            ->getJson('/api/admin/jogos')
            ->assertOk()
            ->assertJsonCount(3, 'jogos')
            ->assertJsonPath('jogos.2.nome', 'Valorant')
            ->assertJsonPath('jogos.2.ativo', false);
    }

    public function test_admin_cadastra_jogo(): void
    {
        $this->salvar(['nome' => '  Valorant  ', 'ativo' => true])
            ->assertCreated()
            ->assertJsonPath('message', 'Jogo salvo com sucesso!')
            ->assertJsonPath('jogo.nome', 'Valorant');

        $this->assertDatabaseHas('CatalogoJogo', ['nome' => 'Valorant', 'ativo' => true]);
    }

    public function test_nome_vazio_retorna_422(): void
    {
        $this->salvar(['nome' => '   ', 'ativo' => true])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['nome']);
    }

    public function test_nome_repetido_retorna_409_mesmo_com_maiusculas_e_espacos(): void
    {
        $this->salvar(['nome' => 'counter-STRIKE   2', 'ativo' => true])
            ->assertStatus(409)
            ->assertJsonPath('errors.nome.0', 'Já existe um jogo com esse nome.');

        $this->assertSame(2, CatalogoJogo::count());
    }

    public function test_admin_edita_e_desativa_jogo(): void
    {
        $id = $this->idDe('League of Legends');

        $this->salvar(['nome' => 'League of Legends', 'ativo' => false], $id)
            ->assertOk()
            ->assertJsonPath('jogo.ativo', false);

        $this->salvar(['nome' => 'LoL', 'ativo' => true], $id)
            ->assertOk()
            ->assertJsonPath('jogo.nome', 'LoL');
    }

    public function test_editar_para_nome_de_outro_jogo_retorna_409(): void
    {
        $this->salvar(['nome' => 'Counter-Strike 2', 'ativo' => true], $this->idDe('League of Legends'))
            ->assertStatus(409);
    }

    public function test_editar_jogo_inexistente_retorna_404(): void
    {
        $this->salvar(['nome' => 'Qualquer', 'ativo' => true], 9999)
            ->assertNotFound();
    }

    public function test_jogo_desativado_some_da_lista_publica_e_do_resumo(): void
    {
        $this->salvar(['nome' => 'League of Legends', 'ativo' => false], $this->idDe('League of Legends'))
            ->assertOk();

        $this->getJson('/api/jogos')
            ->assertOk()
            ->assertExactJson(['jogos' => ['Counter-Strike 2']]);

        $this->withToken($this->tokenDoAdmin())
            ->getJson('/api/admin/resumo')
            ->assertJsonPath('jogos_ativos', 1);
    }

    public function test_nova_oferta_so_aceita_jogo_ativo(): void
    {
        CatalogoJogo::create(['nome' => 'Valorant', 'ativo' => false]);
        $this->criarUsuario('coach@gameduo.com', prestador: true);
        $token = $this->tokenDe('coach@gameduo.com');

        $this->withToken($token)
            ->postJson('/api/ofertas', [...$this->oferta, 'jogo' => 'Valorant'])
            ->assertUnprocessable()
            ->assertJsonPath('errors.jogo.0', 'Escolha um jogo da lista.');

        $this->withToken($token)
            ->postJson('/api/ofertas', [...$this->oferta, 'jogo' => 'Counter-Strike 2'])
            ->assertCreated();
    }

    public function test_oferta_existente_pode_manter_jogo_desativado(): void
    {
        $this->criarUsuario('coach@gameduo.com', prestador: true);
        $oferta = new Oferta([...$this->oferta, 'jogo' => 'League of Legends']);
        $oferta->email = 'coach@gameduo.com';
        $oferta->save();
        CatalogoJogo::where('nome', 'League of Legends')->update(['ativo' => false]);

        $this->withToken($this->tokenDe('coach@gameduo.com'))
            ->putJson("/api/ofertas/{$oferta->id}", [...$this->oferta, 'jogo' => 'League of Legends', 'preco' => 150])
            ->assertOk();
    }

    public function test_admin_exclui_jogo_sem_ofertas(): void
    {
        $jogo = CatalogoJogo::create(['nome' => 'Valorant', 'ativo' => true]);

        $this->withToken($this->tokenDoAdmin())
            ->deleteJson("/api/admin/jogos/{$jogo->id}")
            ->assertOk()
            ->assertJsonPath('message', 'Jogo excluído com sucesso!');

        $this->assertDatabaseMissing('CatalogoJogo', ['nome' => 'Valorant']);
    }

    public function test_nao_exclui_jogo_usado_em_oferta(): void
    {
        $this->criarUsuario('coach@gameduo.com', prestador: true);
        $oferta = new Oferta([...$this->oferta, 'jogo' => 'League of Legends']);
        $oferta->email = 'coach@gameduo.com';
        $oferta->save();

        $this->withToken($this->tokenDoAdmin())
            ->deleteJson('/api/admin/jogos/' . $this->idDe('League of Legends'))
            ->assertStatus(409)
            ->assertJsonPath('message', 'Este jogo é usado em 1 oferta(s) e não pode ser excluído. Desative-o para tirá-lo do catálogo.');

        $this->assertDatabaseHas('CatalogoJogo', ['nome' => 'League of Legends']);
    }

    public function test_excluir_jogo_inexistente_retorna_404(): void
    {
        $this->withToken($this->tokenDoAdmin())
            ->deleteJson('/api/admin/jogos/9999')
            ->assertNotFound();
    }

    public function test_usuario_comum_nao_mantem_jogos(): void
    {
        $this->criarUsuario('jogador@gameduo.com');
        $token = $this->tokenDe('jogador@gameduo.com');

        $this->withToken($token)->getJson('/api/admin/jogos')->assertForbidden();
        $this->withToken($token)->postJson('/api/admin/jogos', ['nome' => 'Valorant', 'ativo' => true])->assertForbidden();
        $this->withToken($token)->deleteJson('/api/admin/jogos/' . $this->idDe('Counter-Strike 2'))->assertForbidden();
    }

    public function test_visitante_nao_mantem_jogos_mas_ve_a_lista_publica(): void
    {
        $this->getJson('/api/admin/jogos')->assertUnauthorized();
        $this->postJson('/api/admin/jogos', ['nome' => 'Valorant', 'ativo' => true])->assertUnauthorized();
        $this->deleteJson('/api/admin/jogos/' . $this->idDe('Counter-Strike 2'))->assertUnauthorized();

        $this->getJson('/api/jogos')
            ->assertOk()
            ->assertExactJson(['jogos' => ['Counter-Strike 2', 'League of Legends']]);
    }
}
