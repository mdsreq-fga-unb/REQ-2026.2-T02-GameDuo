<?php

return [

    // MVP roda só no sandbox; a URL fica no .env para trocar sem mexer no código
    'url' => env('ASAAS_URL', 'https://api-sandbox.asaas.com/v3'),

    // chave da conta (sandbox começa com $aact_hmlg_). No .env use aspas simples por causa do "$"
    'api_key' => env('ASAAS_API_KEY'),

    // token cadastrado no painel do Asaas ao criar o webhook; chega no header asaas-access-token
    'webhook_token' => env('ASAAS_WEBHOOK_TOKEN'),

    // dias até o vencimento da cobrança
    'vencimento_dias' => 1,

    // pacotes à venda: 1 moeda = R$ 1,00. Valores provisórios até o painel de taxas (RNF04)
    'pacotes' => [
        'basico' => ['moedas' => 50, 'valor' => 50.00],
        'padrao' => ['moedas' => 100, 'valor' => 100.00],
        'plus' => ['moedas' => 250, 'valor' => 250.00],
        'pro' => ['moedas' => 500, 'valor' => 500.00],
    ],

];
