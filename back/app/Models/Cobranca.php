<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Compra de moedas: criada pendente no checkout e marcada como paga pelo webhook do Asaas.
class Cobranca extends Model
{
  public const PENDENTE = "pendente";
  public const PAGA = "paga";
  public const VENCIDA = "vencida";
  public const CANCELADA = "cancelada";

  protected $table = "Cobranca";

  protected $fillable = [
    "email",
    "pacote",
    "moedas",
    "valor",
    "forma",
    "status",
    "referencia",
    "asaas_id",
    "asaas_cliente_id",
    "link_pagamento",
    "pix_copia_cola",
    "pago_em",
  ];

  protected $casts = [
    "moedas" => "integer",
    "valor" => "decimal:2",
    "pago_em" => "datetime",
  ];

  public function resumo(): array
  {
    return [
      "id" => $this->id,
      "pacote" => $this->pacote,
      "moedas" => $this->moedas,
      "valor" => $this->valor,
      "forma" => $this->forma,
      "status" => $this->status,
      "link_pagamento" => $this->link_pagamento,
      "pix_copia_cola" => $this->pix_copia_cola,
      "pago_em" => $this->pago_em,
      "criada_em" => $this->created_at,
    ];
  }
}
