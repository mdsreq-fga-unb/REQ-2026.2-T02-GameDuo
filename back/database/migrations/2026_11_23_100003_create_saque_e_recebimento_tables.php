<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Saque', function (Blueprint $table) {
            $table->id();
            $table->text('email');
            $table->unsignedInteger('centavos');
            // cópia criptografada da chave no momento do pedido
            $table->text('chave_pix');
            $table->string('tipo_chave', 10);
            $table->string('status', 15)->default('solicitado');
            // externalReference da transferência no Asaas
            $table->uuid('referencia')->unique();
            $table->string('asaas_id')->nullable()->unique();
            $table->string('motivo_falha')->nullable();
            // RNF03: quem resolveu manualmente, quando for o caso
            $table->string('resolvido_por')->nullable();
            $table->timestamp('finalizado_em')->nullable();
            $table->timestamps();

            $table->foreign('email')->references('email')->on('Usuario');
            $table->index('email');
        });

        // Recebimentos do prestador e da plataforma. Separado de MovimentoMoeda porque
        // ganhos não viram saldo para contratar no MVP (RN43 é futura).
        Schema::create('MovimentoRecebimento', function (Blueprint $table) {
            $table->id();
            // null = plataforma
            $table->text('email')->nullable();
            $table->string('tipo', 20);
            // centavos inteiros: 70% de um preço ímpar não é valor inteiro em reais
            $table->integer('centavos');
            $table->string('descricao')->nullable();
            $table->foreignId('contratacao_id')->nullable()->constrained('Contratacao');
            $table->foreignId('saque_id')->nullable()->constrained('Saque');
            $table->timestamp('disponivel_em')->nullable();
            $table->string('autor')->nullable();
            $table->string('chave', 60)->unique();
            $table->timestamps();

            $table->foreign('email')->references('email')->on('Usuario');
            $table->index(['email', 'disponivel_em']);
        });

        Schema::create('CodigoRecuperacao', function (Blueprint $table) {
            $table->id();
            // um código vigente por conta
            $table->string('email')->unique();
            $table->string('codigo_hash');
            $table->unsignedTinyInteger('tentativas')->default(0);
            $table->timestamp('expira_em')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('CodigoRecuperacao');
        Schema::dropIfExists('MovimentoRecebimento');
        Schema::dropIfExists('Saque');
    }
};
