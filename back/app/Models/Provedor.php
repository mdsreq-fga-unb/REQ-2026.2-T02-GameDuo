<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

// Perfil de prestador: o usuário é prestador quando tem uma linha nesta tabela.
class Provedor extends Model
{
  protected $table = "Provedor";
  protected $primaryKey = "email";

  public $incrementing = false;

  protected $keyType = "string";

  public $timestamps = false;

  // dados de recebimento (ex.: chave Pix) não saem na API
  protected $hidden = [
    "dados",
  ];

  protected $fillable = [
    "email",
    "apresentacao",
    "dados",
  ];

  public function ofertas(): HasMany
  {
    return $this->hasMany(Oferta::class, "email", "email");
  }
}
