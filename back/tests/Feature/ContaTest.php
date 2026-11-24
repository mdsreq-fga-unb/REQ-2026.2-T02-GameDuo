<?php

namespace Tests\Feature;

use App\Mail\CodigoRecuperacaoMail;
use App\Models\CodigoRecuperacao;
use App\Models\Usuario;
use App\Services\Classes\RecuperacaoSenhaService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Testing\TestResponse;
use Tests\CriaTabelasDoSupabase;
use Tests\TestCase;

class ContaTest extends TestCase
{
    use RefreshDatabase, CriaTabelasDoSupabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->criarTabelasDoSupabase();
        $this->criarUsuario('ana@gameduo.com');
        Mail::fake();
    }

    private function pedirCodigo(): string
    {
        // direto no serviço: no teste o afterResponse da rota rodaria de novo a cada requisição
        app(RecuperacaoSenhaService::class)->solicitar('ana@gameduo.com');
        $codigo = '';
        Mail::assertSent(CodigoRecuperacaoMail::class, function ($mail) use (&$codigo) {
            $codigo = $mail->codigo;

            return $mail->hasTo('ana@gameduo.com');
        });

        return $codigo;
    }

    private function redefinir(string $codigo, string $senha = 'NovaSenha1!'): TestResponse
    {
        return $this->postJson('/api/senha/redefinir', [
            'email' => 'ana@gameduo.com', 'codigo' => $codigo, 'senha' => $senha, 'senha_confirmation' => $senha,
        ]);
    }

    public function test_recupera_a_senha_com_codigo_de_uso_unico(): void
    {
        $codigo = $this->pedirCodigo();
        $this->postJson('/api/senha/validar', ['email' => 'ana@gameduo.com', 'codigo' => $codigo])->assertOk();
        $this->redefinir($codigo)->assertOk();

        $this->postJson('/api/login', ['email' => 'ana@gameduo.com', 'senha' => 'senha123'])->assertUnauthorized();
        $this->postJson('/api/login', ['email' => 'ana@gameduo.com', 'senha' => 'NovaSenha1!'])->assertOk();
        $this->redefinir($codigo, 'OutraSenha1!')->assertUnprocessable();
    }

    public function test_codigo_expira_em_30_minutos(): void
    {
        $codigo = $this->pedirCodigo();
        $this->travel(31)->minutes();
        $this->redefinir($codigo)->assertUnprocessable();
    }

    public function test_cinco_erros_bloqueiam_o_codigo(): void
    {
        $codigo = $this->pedirCodigo();
        $errado = $codigo === '000000' ? '111111' : '000000';
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/senha/validar', ['email' => 'ana@gameduo.com', 'codigo' => $errado])->assertUnprocessable();
        }
        $this->redefinir($codigo)->assertUnprocessable();
    }

    public function test_codigo_novo_invalida_o_anterior_e_fica_com_hash(): void
    {
        $this->pedirCodigo();
        CodigoRecuperacao::query()->update(['codigo_hash' => bcrypt('999999')]);
        $novo = $this->pedirCodigo();
        $this->assertDatabaseCount('CodigoRecuperacao', 1);
        $this->assertNotSame($novo, CodigoRecuperacao::first()->codigo_hash);
    }

    public function test_resposta_nao_revela_se_a_conta_existe(): void
    {
        $existe = $this->postJson('/api/senha/solicitar', ['email' => 'ana@gameduo.com'])->json();
        $naoExiste = $this->postJson('/api/senha/solicitar', ['email' => 'ninguem@gameduo.com'])->json();
        $this->assertSame($existe, $naoExiste);
        Mail::assertSent(CodigoRecuperacaoMail::class, fn ($mail) => $mail->hasTo('ana@gameduo.com'));
        Mail::assertNotSent(CodigoRecuperacaoMail::class, fn ($mail) => $mail->hasTo('ninguem@gameduo.com'));
    }

    public function test_limita_pedidos_por_conta(): void
    {
        for ($i = 0; $i < 7; $i++) {
            $this->postJson('/api/senha/solicitar', ['email' => 'ana@gameduo.com'])->assertOk();
        }
        Mail::assertSentCount(5);
    }

    public function test_senha_fraca_e_recusada(): void
    {
        $this->redefinir($this->pedirCodigo(), 'fraca')->assertJsonValidationErrors('senha');
    }

    public function test_email_do_codigo_renderiza(): void
    {
        $this->assertStringContainsString('123456', (new CodigoRecuperacaoMail('123456'))->render());
    }

    public function test_usuario_corrige_os_dados_da_conta(): void
    {
        $this->criarUsuario('bia@gameduo.com');
        $this->actingAs(Usuario::find('ana@gameduo.com'), 'api');

        $this->putJson('/api/me', ['nome' => 'Ana Silva', 'nickname' => 'ana', 'email' => 'x@x.com', 'role' => 'admin'])
            ->assertOk()->assertJsonPath('usuario.nome', 'Ana Silva');
        $this->assertDatabaseHas('Usuario', ['email' => 'ana@gameduo.com', 'role' => 'user']);

        $this->putJson('/api/me', ['nome' => 'Ana', 'nickname' => 'BIA'])->assertJsonValidationErrors('nickname');
        $this->putJson('/api/me', ['nome' => 'Ana', 'nickname' => 'ana', 'senha_atual' => 'errada', 'senha' => 'NovaSenha1!', 'senha_confirmation' => 'NovaSenha1!'])
            ->assertJsonValidationErrors('senha_atual');
        $this->putJson('/api/me', ['nome' => 'Ana', 'nickname' => 'ana', 'senha_atual' => 'senha123', 'senha' => 'NovaSenha1!', 'senha_confirmation' => 'NovaSenha1!'])
            ->assertOk();
        $this->postJson('/api/login', ['email' => 'ana@gameduo.com', 'senha' => 'NovaSenha1!'])->assertOk();
    }

    public function test_cadastro_recusa_nickname_em_uso(): void
    {
        $this->postJson('/api/usuarios', ['email' => 'n@n.com', 'nome' => 'N', 'nickname' => 'Ana', 'senha' => 'NovaSenha1!', 'senha_confirmation' => 'NovaSenha1!'])
            ->assertJsonValidationErrors('nickname');
    }
}
