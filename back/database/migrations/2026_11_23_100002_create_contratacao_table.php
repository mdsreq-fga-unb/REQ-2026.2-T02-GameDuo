<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Contratacao', function (Blueprint $table) {
            $table->id();
            $table->foreignId('oferta_id')->constrained('Oferta');
            $table->text('consumidor_email');
            $table->text('prestador_email');

            // cópia da oferta no momento da contratação (RN11 e RN12)
            $table->string('titulo', 120);
            $table->text('descricao')->nullable();
            $table->string('jogo', 60);
            $table->string('modalidade', 20);
            $table->unsignedSmallInteger('duracao');
            $table->unsignedInteger('preco');
            $table->string('comunicacao', 40)->nullable();
            $table->text('condicoes')->nullable();
            $table->string('contato_prestador', 100);
            $table->string('contato_consumidor', 100);

            $table->timestamp('inicio')->nullable();
            $table->timestamp('fim')->nullable();
            $table->string('status', 12)->default('agendada');

            // RN28: um resultado por participante
            $table->string('resultado_consumidor', 12)->nullable();
            $table->text('justificativa_consumidor')->nullable();
            $table->string('resultado_prestador', 12)->nullable();
            $table->text('justificativa_prestador')->nullable();

            $table->timestamp('concluida_em')->nullable();
            $table->timestamp('cancelada_em')->nullable();
            $table->string('cancelada_por', 12)->nullable();
            // RN44: decisão da administração
            $table->text('decidida_por')->nullable();
            $table->text('motivo_decisao')->nullable();
            $table->timestamps();

            $table->foreign('consumidor_email')->references('email')->on('Usuario');
            $table->foreign('prestador_email')->references('email')->on('Usuario');
            $table->index(['prestador_email', 'inicio']);
            $table->index('consumidor_email');
            $table->index(['status', 'fim']);
        });

        Schema::table('MovimentoMoeda', function (Blueprint $table) {
            $table->foreignId('contratacao_id')->nullable()->constrained('Contratacao');
            // RNF03: quem causou o lançamento
            $table->string('autor')->nullable();
            // RN25: a mesma operação nunca vira dois lançamentos
            $table->string('chave', 60)->nullable()->unique();
        });
    }

    public function down(): void
    {
        Schema::table('MovimentoMoeda', function (Blueprint $table) {
            $table->dropUnique(['chave']);
            $table->dropConstrainedForeignId('contratacao_id');
        });
        Schema::table('MovimentoMoeda', function (Blueprint $table) {
            $table->dropColumn(['autor', 'chave']);
        });
        Schema::dropIfExists('Contratacao');
    }
};
