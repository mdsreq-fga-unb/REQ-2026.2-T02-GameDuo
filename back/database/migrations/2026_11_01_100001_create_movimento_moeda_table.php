<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // extrato do cliente: o saldo é a soma desta tabela, nunca um campo editado à mão
        Schema::create('MovimentoMoeda', function (Blueprint $table) {
            $table->id();
            $table->text('email');
            $table->string('tipo', 20);
            // positivo na compra e na devolução, negativo na contratação
            $table->integer('moedas');
            $table->string('descricao')->nullable();
            // unique: uma cobrança nunca vira dois créditos
            $table->foreignId('cobranca_id')->nullable()->unique()->constrained('Cobranca');
            $table->timestamps();

            $table->foreign('email')->references('email')->on('Usuario')->cascadeOnDelete();
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('MovimentoMoeda');
    }
};
