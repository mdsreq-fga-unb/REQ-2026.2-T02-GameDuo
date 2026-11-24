<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Saque extends Model
{
  public const SOLICITADO = "solicitado";
  public const PROCESSANDO = "processando";
  // o Asaas não respondeu: não se sabe se a transferência saiu, então não se reenvia
  public const VERIFICACAO = "verificacao";
  public const PAGO = "pago";
  public const FALHOU = "falhou";

  public const EM_ANDAMENTO = [self::SOLICITADO, self::PROCESSANDO, self::VERIFICACAO];

  protected $table = "Saque";

  protected $guarded = ["id"];

  protected $hidden = ["chave_pix"];

  protected $casts = [
    "centavos" => "integer",
    "chave_pix" => "encrypted",
    "finalizado_em" => "datetime",
  ];

  public function resumo(): array
  {
    return [
      "id" => $this->id,
      "valor" => $this->centavos / 100,
      "status" => $this->status,
      "motivo_falha" => $this->motivo_falha,
      "solicitado_em" => $this->created_at,
      "finalizado_em" => $this->finalizado_em,
    ];
  }
}
