<?php

namespace App\Services\Classes;

use App\Models\Contratacao;
use App\Models\Oferta;
use App\Models\Provedor;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AgendaService
{
    // RF14: troca a agenda inteira da oferta. Contratações já feitas não mudam.
    public function salvar(Oferta $oferta, array $intervalos): Collection
    {
        return DB::transaction(function () use ($oferta, $intervalos) {
            // mesma trava usada ao contratar: ninguém contrata no meio da troca
            Provedor::lockForUpdate()->findOrFail($oferta->email);

            $oferta->agenda()->delete();
            $oferta->agenda()->createMany($intervalos);

            return $oferta->agenda()->get();
        });
    }

    // RF15: horários livres da oferta (instantes em UTC)
    public function vagas(Oferta $oferta): Collection
    {
        $fuso = config('gameduo.fuso');
        $hoje = now($fuso)->startOfDay();
        $agenda = $oferta->agenda()->get()->groupBy('dia');

        // o limite vale para o dia inteiro; a margem cobre a diferença de fuso
        $ocupadas = Contratacao::ocupando(
            $oferta->email,
            now(),
            $hoje->copy()->addDays(config('gameduo.agenda_dias') + 1)->utc(),
        )->get(['inicio', 'fim']);

        $vagas = collect();

        for ($d = 0; $d < config('gameduo.agenda_dias'); $d++) {
            $data = $hoje->copy()->addDays($d);

            foreach ($agenda->get($data->dayOfWeek, collect()) as $intervalo) {
                $inicio = $data->copy()->setTimeFromTimeString($intervalo->inicio)->utc();
                $limite = $data->copy()->setTimeFromTimeString($intervalo->fim)->utc();

                while ($inicio->copy()->addMinutes($oferta->duracao)->lte($limite)) {
                    $fim = $inicio->copy()->addMinutes($oferta->duracao);
                    $livre = $ocupadas->doesntContain(
                        fn ($c) => $c->inicio->lt($fim) && $c->fim->gt($inicio)
                    );

                    if ($inicio->gt(now()) && $livre) {
                        $vagas->push(['inicio' => $inicio->copy(), 'fim' => $fim]);
                    }

                    $inicio = $fim;
                }
            }
        }

        return $vagas;
    }

    // devolve a vaga livre que começa neste instante, ou null
    public function vagaEm(Oferta $oferta, Carbon $inicio): ?array
    {
        return $this->vagas($oferta)->first(fn ($vaga) => $vaga['inicio']->equalTo($inicio));
    }
}
