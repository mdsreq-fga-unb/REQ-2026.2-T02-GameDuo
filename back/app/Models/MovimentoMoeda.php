<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Extrato do cliente: o saldo é sempre a soma de "moedas" dos movimentos.
class MovimentoMoeda extends Model
{
  public const COMPRA = "compra";
  public const CONTRATACAO = "contratacao";
  public const DEVOLUCAO = "devolucao";

  protected $table = "MovimentoMoeda";

  protected $fillable = [
    "email",
    "tipo",
    "moedas",
    "descricao",
    "cobranca_id",
  ];

  protected $casts = [
    "moedas" => "integer",
  ];

  public function resumo(): array
  {
    return [
      "id" => $this->id,
      "tipo" => $this->tipo,
      "moedas" => $this->moedas,
      "descricao" => $this->descricao,
      "data" => $this->created_at,
    ];
  }
}
