<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Usuario extends Model
{
  protected $table = "Usuario";
  protected $primaryKey = "email";

  public $incrementing = false;

  protected $keyType = "string";

  public $timestamps = false;

  protected $hidden = [ 

  "senha",
  ];

}