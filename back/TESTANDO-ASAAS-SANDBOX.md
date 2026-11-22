# Testar Asaas sandbox local

## .env (back)

```dotenv
ASAAS_API_KEY='$aact_hmlg_...'      # aspas simples por causa do $
ASAAS_WEBHOOK_TOKEN=um-token-qualquer
# QUEUE_CONNECTION=sync             # opcional: credita na hora, sem queue:work
```

```bash
php artisan config:clear
```

## Subir (3 terminais, em back/)

```bash
php artisan serve
php artisan queue:work
cloudflared tunnel --url http://127.0.0.1:8000
```

(Front: `npm run dev` em `front/`, telas de carteira, compra e pagamento.)

## Webhook no painel do Asaas

- URL: `https://<url-do-tunel>.trycloudflare.com/api/webhooks/asaas`
- Token: o mesmo `ASAAS_WEBHOOK_TOKEN`
- Eventos: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`, `PAYMENT_DELETED`

**A URL do túnel muda a cada `cloudflared`. Atualizar no painel sempre.**

## Testar

1. Comprar moedas pelo front (ou `POST /api/checkout` com `{"pacote":"basico","forma":"pix","cpf":"..."}`; CPF válido, só na 1ª compra).
2. No painel do sandbox, confirmar o recebimento da cobrança.
3. Conferir: cobrança `paga` e saldo em `GET /api/carteira`.

## Sem túnel (simular webhook)

```bash
curl -X POST http://127.0.0.1:8000/api/webhooks/asaas \
  -H "Content-Type: application/json" \
  -H "asaas-access-token: um-token-qualquer" \
  -d '{"id":"evt_1","event":"PAYMENT_RECEIVED","payment":{"id":"pay_XXX"}}'
```

`id` do evento tem que mudar a cada envio (repetido é ignorado).

## Se der ruim

- **502 no checkout**: chave errada/sem aspas, CPF inválido ou conta sem chave Pix. Ver `storage/logs/laravel.log`.
- **401 no webhook**: token diferente do `.env` (rodar `config:clear` e reiniciar o serve).
- **200 mas continua pendente**: `queue:work` não está rodando.
- **Asaas parou de enviar**: fila do webhook interrompida no painel, reativar.
