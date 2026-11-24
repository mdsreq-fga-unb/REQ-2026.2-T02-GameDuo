<?php

namespace App\Services\Classes;

use App\Models\Oferta;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Collection;

class OfertaService
{
    public function listar(): Collection
    {
        return Oferta::ativas()->with('usuario.provedor')->latest('id')->get();
    }

    public function listarDoPrestador(Usuario $usuario): Collection
    {
        return Oferta::ativas()->with('usuario.provedor')
            ->where('email', $usuario->email)
            ->latest('id')
            ->get();
    }

    public function criar(Usuario $usuario, array $dados): Oferta
    {
        $oferta = new Oferta($dados);
        $oferta->email = $usuario->email;
        $oferta->save();

        return $oferta->load('usuario.provedor');
    }

    public function atualizar(Oferta $oferta, array $dados): Oferta
    {
        $oferta->update($dados);

        return $oferta->load('usuario.provedor');
    }

    public function encerrar(Oferta $oferta): void
    {
        if ($oferta->ativa()) {
            $oferta->status = Oferta::ENCERRADA;
            $oferta->encerrada_em = now();
            $oferta->save();
        }
    }

    public function pertenceA(Oferta $oferta, Usuario $usuario): bool
    {
        return $oferta->email === $usuario->email;
    }
}
