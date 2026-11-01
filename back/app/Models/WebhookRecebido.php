<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Registro de cada aviso do Asaas; o unique em evento_id garante a idempotência.
class WebhookRecebido extends Model
{
  protected $table = "WebhookRecebido";

  protected $fillable = [
    "evento_id",
    "tipo",
    "payload",
  ];

  protected $casts = [
    "payload" => "array",
  ];
}
