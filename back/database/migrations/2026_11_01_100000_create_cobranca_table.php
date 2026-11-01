<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // uma linha por compra de moedas
        Schema::create('Cobranca', function (Blueprint $table) {
            $table->id();
            $table->text('email');
            $table->string('pacote', 20);
            $table->unsignedInteger('moedas');
            $table->decimal('valor', 10, 2);
            $table->string('forma', 10);
            $table->string('status', 20)->default('pendente');
            // externalReference: liga o aviso do Asaas ao pedido certo
            $table->uuid('referencia')->unique();
            $table->string('asaas_id')->unique();
            $table->string('asaas_cliente_id');
            $table->text('link_pagamento')->nullable();
            $table->text('pix_copia_cola')->nullable();
            $table->timestamp('pago_em')->nullable();
            $table->timestamps();

            $table->foreign('email')->references('email')->on('Usuario')->cascadeOnDelete();
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Cobranca');
    }
};
