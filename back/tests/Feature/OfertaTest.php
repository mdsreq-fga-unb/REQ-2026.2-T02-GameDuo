<?php

namespace Tests\Feature;

use App\Models\Oferta;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CriaTabelasDoSupabase;
use Tests\TestCase;

class OfertaTest extends TestCase
{
    use RefreshDatabase, CriaTabelasDoSupabase;

    private array $oferta = [
        'titulo' => 'Mira e spray control',
        'descricao' => 'Treino focado em mira.',
        'jogo' => 'Counter-Strike 2',
        'modalidade' => 'Coaching',
        'nivel' => 'Faceit Nível 10',
        'duracao' => 60,
        'preco' => 110,
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->criarTabelasDoSupabase();
        $this->criarUsuario('coach@gameduo.com', prestador: true);
        $this->criarUsuario('jogador@gameduo.com');
    }

    private function criarOfertaDo(string $email): Oferta
    {
        $oferta = new Oferta($this->oferta);
        $oferta->email = $email;
        $oferta->save();

        return $oferta;
    }

    public function test_prestador_cria_oferta(): void
    {
        $this->withToken($this->tokenDe('coach@gameduo.com'))
            ->postJson('/api/ofertas', $this->oferta)
            ->assertCreated()
            ->assertJsonPath('oferta.titulo', 'Mira e spray control')
            ->assertJsonPath('oferta.prestador.nickname', 'coach');

        $this->assertDatabaseHas('Oferta', ['email' => 'coach@gameduo.com', 'preco' => 110]);
    }

    public function test_usuario_que_nao_e_prestador_nao_cria_oferta(): void
    {
        $this->withToken($this->tokenDe('jogador@gameduo.com'))
            ->postJson('/api/ofertas', $this->oferta)
            ->assertForbidden();

        $this->assertDatabaseCount('Oferta', 0);
    }

    public function test_visitante_nao_cria_oferta(): void
    {
        $this->postJson('/api/ofertas', $this->oferta)->assertUnauthorized();
    }

    public function test_valida_campos_da_oferta(): void
    {
        $this->withToken($this->tokenDe('coach@gameduo.com'))
            ->postJson('/api/ofertas', ['modalidade' => 'Conteúdo', 'preco' => 0])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['titulo', 'jogo', 'modalidade', 'duracao', 'preco']);
    }

    public function test_catalogo_publico_lista_e_mostra_ofertas(): void
    {
        $oferta = $this->criarOfertaDo('coach@gameduo.com');

        $this->getJson('/api/ofertas')
            ->assertOk()
            ->assertJsonCount(1, 'ofertas')
            ->assertJsonMissingPath('ofertas.0.email');

        $this->getJson("/api/ofertas/{$oferta->id}")
            ->assertOk()
            ->assertJsonPath('oferta.jogo', 'Counter-Strike 2');

        $this->getJson('/api/ofertas/999')->assertNotFound();
    }

    public function test_minhas_ofertas_lista_so_as_do_prestador(): void
    {
        $this->criarUsuario('outro@gameduo.com', prestador: true);
        $this->criarOfertaDo('coach@gameduo.com');
        $this->criarOfertaDo('outro@gameduo.com');

        $this->withToken($this->tokenDe('coach@gameduo.com'))
            ->getJson('/api/minhas-ofertas')
            ->assertOk()
            ->assertJsonCount(1, 'ofertas');
    }

    public function test_dono_edita_e_exclui_a_oferta(): void
    {
        $oferta = $this->criarOfertaDo('coach@gameduo.com');
        $token = $this->tokenDe('coach@gameduo.com');

        $this->withToken($token)
            ->putJson("/api/ofertas/{$oferta->id}", [...$this->oferta, 'preco' => 150])
            ->assertOk()
            ->assertJsonPath('oferta.preco', 150);

        $this->withToken($token)
            ->deleteJson("/api/ofertas/{$oferta->id}")
            ->assertOk();

        $this->assertDatabaseCount('Oferta', 0);
    }

    public function test_prestador_nao_mexe_na_oferta_de_outro(): void
    {
        $this->criarUsuario('outro@gameduo.com', prestador: true);
        $oferta = $this->criarOfertaDo('coach@gameduo.com');
        $token = $this->tokenDe('outro@gameduo.com');

        $this->withToken($token)
            ->putJson("/api/ofertas/{$oferta->id}", [...$this->oferta, 'preco' => 1])
            ->assertForbidden();

        $this->withToken($token)
            ->deleteJson("/api/ofertas/{$oferta->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('Oferta', ['id' => $oferta->id, 'preco' => 110]);
    }
}
