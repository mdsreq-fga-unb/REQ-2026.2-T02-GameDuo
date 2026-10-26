#!/usr/bin/env bash
# Mede o tempo das rotas da API. Uso (dentro da pasta back, com o "php artisan serve" rodando):
#   bash medir-velocidade.sh [porta] [repetições]
PORTA=${1:-8000}
REPETICOES=${2:-5}
URL="http://127.0.0.1:$PORTA"

# Gera um token de um usuário prestador (só leitura, não grava nada no banco)
TOKEN=$(php -r 'require "vendor/autoload.php"; $a = require "bootstrap/app.php";
  $a->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
  $u = App\Models\Usuario::whereHas("provedor")->first() ?? App\Models\Usuario::first();
  echo auth("api")->login($u);')

medir() { # método rota [auth] [corpo]
  local soma=0 tempos="" codigo n=$REPETICOES
  # o /login aceita só 5 tentativas por minuto (throttle), então mede no máximo 3
  [[ $2 == /api/login && $n -gt 3 ]] && n=3
  for ((i = 1; i <= n; i++)); do
    read -r codigo t < <(curl -s -o /dev/null -w "%{http_code} %{time_total}" -X "$1" \
      -H "Accept: application/json" -H "Content-Type: application/json" \
      ${3:+-H "Authorization: Bearer $TOKEN"} ${4:+-d "$4"} "$URL$2")
    ms=$(awk "BEGIN { printf \"%d\", $t * 1000 }")
    soma=$((soma + ms)); tempos+="$ms "
  done
  printf "%-6s %-22s HTTP %s | média %5d ms | (%s)\n" "$1" "$2" "$codigo" $((soma / n)) "${tempos% }"
}

echo "Medindo $URL ($REPETICOES vezes cada rota)..."
medir GET  /api/ofertas
medir GET  /api/me auth
medir GET  /api/minhas-ofertas auth
# e-mail inexistente: passa pelo throttle e pela busca do usuário, sem afetar ninguém
# espere 1 minuto entre uma medição e outra, senão o /login responde 429
medir POST /api/login "" '{"email":"teste-velocidade@naoexiste.com","senha":"x"}'
