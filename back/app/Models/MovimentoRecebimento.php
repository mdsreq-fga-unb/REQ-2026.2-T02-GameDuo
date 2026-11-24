<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Extrato de recebimentos (RF27/RF28). email nulo = parte da plataforma.
class MovimentoRecebimento extends Model
{
  public const REPASSE = "repasse";
  public const COMISSAO = "comissao";
  public const SAQUE = "saque";
  public const ESTORNO_SAQUE = "estorno_saque";

  protected $table = "MovimentoRecebimento";

  protected $guarded = ["id"];

  protected $casts = [
    "centavos" => "integer",
    "disponivel_em" => "datetime",
  ];

  public function contratacao(): BelongsTo
  {
    return $this->belongsTo(Contratacao::class, "contratacao_id");
  }
}
