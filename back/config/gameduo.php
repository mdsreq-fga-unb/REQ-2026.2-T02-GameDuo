<?php

// Regras de negócio com números. Os valores marcados como provisórios aguardam decisão do cliente.
return [

    // agenda e telas usam o horário de Brasília; o banco guarda tudo em UTC
    'fuso' => 'America/Sao_Paulo',

    // quantos dias à frente o consumidor consegue ver e contratar (RF15)
    'agenda_dias' => 14,

    // RN29: prazo para registrar o resultado, contado do término previsto da sessão (provisório)
    'prazo_resultado_horas' => 48,

    // RN33: parte do prestador, em %; o restante é da plataforma
    'percentual_prestador' => 70,

    // RN40: carência para saque, contada da conclusão da contratação (provisório)
    'carencia_dias' => 30,

    // RN42: valor mínimo de saque em reais (provisório)
    'saque_minimo' => (float) env('SAQUE_MINIMO', 20),

    // RN04: validade do código de recuperação, em minutos
    'recuperacao_minutos' => 30,
    'recuperacao_tentativas' => 5,

    // RN31: canal para detalhar problemas da sessão
    'email_sac' => env('EMAIL_SAC') ?: 'sac@gameduo.example',

];
