<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CodigoRecuperacao extends Model
{
  protected $table = "CodigoRecuperacao";

  protected $guarded = ["id"];

  protected $hidden = ["codigo_hash"];

  protected $casts = ["expira_em" => "datetime", "tentativas" => "integer"];
}
