<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('Oferta', function (Blueprint $table) {
            // RF13: encerrar em vez de apagar
            $table->string('status', 12)->default('ativa')->index();
            $table->timestamp('encerrada_em')->nullable();
            // RN09 e RN21; contato só aparece para o dono e para quem contratou
            $table->string('comunicacao', 40)->nullable();
            $table->string('contato', 100)->nullable();
            $table->text('condicoes')->nullable();
        });

        // RF14: agenda semanal da oferta, no horário de Brasília
        Schema::create('AgendaOferta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('oferta_id')->constrained('Oferta')->cascadeOnDelete();
            // 0 = domingo ... 6 = sábado
            $table->unsignedTinyInteger('dia');
            $table->string('inicio', 5);
            $table->string('fim', 5);
            $table->unique(['oferta_id', 'dia', 'inicio']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('AgendaOferta');
        Schema::table('Oferta', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });
        Schema::table('Oferta', function (Blueprint $table) {
            $table->dropColumn(['status', 'encerrada_em', 'comunicacao', 'contato', 'condicoes']);
        });
    }
};
