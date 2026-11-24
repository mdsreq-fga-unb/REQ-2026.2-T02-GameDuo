# Finalização do MVP

Registro do que foi implementado em 23/11/2026 a partir do levantamento "GameDuo — O que falta no MVP". As regras seguem o catálogo da branch `main` (`data/requisitos.yaml` e `8.4regras-negocio.md`).

**Situação:** os 15 RFs pendentes (6 incompletos e 9 sem código) têm implementação, e a edição da conta prevista no RF01 foi incluída. Antes de considerar o MVP entregue, faltam as decisões e validações externas listadas em [Pendências](#pendencias).

## Requisitos funcionais

| RF | O que foi feito | Onde aparece |
| --- | --- | --- |
| RF01 Cadastrar usuários | Edição de nome, nickname e senha (com a senha atual). Nickname único, sem diferenciar maiúsculas. O e-mail não muda, porque é a chave da conta. | Minha conta |
| RF03 Recuperar senha | Código de 6 dígitos por e-mail, guardado com hash, de uso único, válido por 30 min e bloqueado após 5 erros. A resposta não revela se a conta existe. O código fixo e a opção por telefone saíram. | Recuperar senha |
| RF04 Configurar perfil | Apresentação, jogos com nível declarado, modalidades, formatos e idiomas, na ativação e depois dela. | Perfil de prestador |
| RF05 Dados de recebimento | Chave Pix com tipo e CPF validados, editáveis e visíveis só ao dono. CPF criptografado no banco. | Perfil de prestador |
| RF07 Perfil do prestador | Página pública com perfil e ofertas ativas e aviso de que o nível é declarado. | Link na oferta |
| RF10 Detalhes da oferta | O aviso "Em breve" deu lugar à contratação. A página mostra forma de comunicação e condições (RN09). | Página da oferta |
| RF13 Encerrar oferta | Status `encerrada`: sai do catálogo e da lista e bloqueia contratações, sem afetar as já feitas. | Minhas ofertas |
| RF14 Agenda semanal | Intervalos por dia e por oferta. Recusa sobreposição na mesma oferta e intervalo menor que a sessão. | Minhas ofertas → Agenda |
| RF15 Disponibilidade | Vagas dos próximos 14 dias, no horário de Brasília, sem as ocupadas em qualquer oferta do prestador. | Página da oferta |
| RF16 Agendar | Contratação automática, com troca de contatos só entre as partes (RN21). | Página da oferta, Sessões |
| RF18 Cancelar | Até o horário marcado, por qualquer das partes, com confirmação e devolução integral. | Sessões |
| RF23 Carteira | Saldo disponível, retido e pendente com origem e previsão. Prestador vê também disponível para saque, carência e saque em andamento. | Carteira |
| RF25 Reservar créditos | A reserva é gravada na mesma transação da contratação. | Automático |
| RF26 Liberar valores | Após as duas confirmações ou 48 h sem problema registrado. | Automático |
| RF27 Dividir receita | 70/30 em centavos inteiros, uma única vez por sessão. | Automático |
| RF28 Processar saques | Reserva do valor, transferência Pix pelo Asaas, aviso `TRANSFER_*` e devolução em caso de falha. | Carteira |
| RF31 Registrar resultado | Uma resposta por participante, com justificativa quando há problema, que suspende a liberação. | Sessões |

## Requisitos não funcionais

| RNF | Situação | Observação |
| --- | --- | --- |
| RNF02, RNF06 | Atendidos | Já estavam atendidos. |
| RNF03 Auditabilidade | Atendido nos RFs do MVP | Lançamentos têm autor, data, operação e contratação ou saque de origem. |
| RNF07 Dados pessoais | Verificado em parte | Teste confirma que e-mail, CPF, Pix e contato não saem nas rotas públicas. A chave Pix em `Provedor.dados` ainda não é criptografada; a cópia no saque é. |
| RNF09 Agenda | Implementado | Trava por prestador. Testado com pedidos repetidos, não com concorrência real no Postgres. |
| RNF10 Usuário logado | Atendido | Nickname e perfis visíveis também no celular. |
| RNF11 Confirmação | Atendido | Cancelar, encerrar, registrar resultado e sacar. |
| RNF13 Integridade financeira | Implementado | Transações, travas e chave única por operação. Mesma ressalva do RNF09. |
| RNF14 Credenciais | Parcial | Falta conferir HTTPS em produção. O token fica em `localStorage`, exposto em caso de XSS, e sessões abertas não são encerradas ao trocar a senha. |
| RNF15 Falhas de integração | Implementado | Recusa do Asaas devolve o valor; falta de resposta deixa o saque "em verificação", sem reenvio, para não pagar duas vezes. |
| RNF16 Responsividade | Verificado | Larguras de 375, 768 e 1280 px nas telas principais. Capturas de 375 e 1280 px inspecionadas por amostragem. |

## Decisões provisórias

Adotadas para não bloquear o desenvolvimento. Precisam da validação do PO com Ciro.

| Regra | Valor adotado | Onde mudar |
| --- | --- | --- |
| RN42 Valor mínimo de saque | R$ 20,00 | `SAQUE_MINIMO` no `.env` |
| RN29 Início das 48 h | Término previsto da sessão | `Contratacao::prazoResultado` |
| RN40 Início da carência de 30 dias | Conclusão, pelas duas confirmações ou automática | `RecebimentoService::dividir` |

Outras escolhas:

- **Agendas de ofertas diferentes podem se cruzar.** O levantamento pedia impedir. O catálogo e a RN20 só proíbem contratações sobrepostas, e isso é garantido.
- **Ganhos do prestador ficam em `MovimentoRecebimento`**, não em `MovimentoMoeda`, porque usar ganhos para contratar (RN43) é de versão futura.
- **Ofertas antigas, sem contato cadastrado,** enviam o e-mail do prestador a quem contrata, até serem editadas.
- **Prestadores antigos** continuam ativos com o perfil incompleto, mas só sacam depois de completar os dados.
- **A decisão da RN44 é executada por comando**, porque a tela de ocorrências (RF38) está fora do MVP.

## Banco de dados

Quatro migrations `2026_11_23_*`, que só adicionam estruturas:

- **`Provedor`:** código público, perfil, tipo da chave e CPF.
- **`Oferta`:** status, data de encerramento, comunicação, contato e condições.
- **`MovimentoMoeda`:** contratação, autor e chave única.
- **Novas:** `AgendaOferta`, `Contratacao`, `Saque`, `MovimentoRecebimento` e `CodigoRecuperacao`.

As migrations **não foram aplicadas no Supabase**. Sem elas, a nova versão não funciona.

## Rotas novas ou alteradas

| Rota (prefixo `/api`) | Acesso | Uso |
| --- | --- | --- |
| `POST /senha/solicitar`, `/senha/validar`, `/senha/redefinir` | Público | RF03 |
| `GET /ofertas/{id}/vagas` | Público | RF15 |
| `GET /prestadores/{codigo}` | Público | RF07 |
| `PUT /me` | Logado | RF01 |
| `GET` e `POST /contratacoes` | Logado | RF16 |
| `POST /contratacoes/{id}/cancelar` e `/resultado` | Participante | RF18, RF31 |
| `GET /carteira` (ampliada) | Logado | RF23 |
| `POST /prestador` (agora exige perfil e recebimento completos) | Logado | RF04, RF05 |
| `GET` e `PUT /prestador/perfil` e `/prestador/recebimento` | Prestador | RF04, RF05 |
| `GET` e `PUT /ofertas/{id}/agenda` | Dono | RF14 |
| `POST` e `PUT /ofertas` (agora exigem comunicação e contato) | Prestador | RN09 |
| `DELETE /ofertas/{id}` (agora encerra) | Dono | RF13 |
| `GET` e `POST /saques` | Prestador | RF28 |
| `POST /webhooks/asaas` (agora trata `TRANSFER_*`) | Asaas | RF28 |

## Como colocar em funcionamento

1. Faça backup do banco e rode `php artisan migrate` em `back/`.
2. No `.env`, preencha `MAIL_*`, `EMAIL_SAC` e `SAQUE_MINIMO` (modelo em `.env.example`). Sem `MAIL_*`, o código de recuperação só aparece no log do servidor.
3. Não troque a `APP_KEY` depois: ela decifra o CPF e as chaves dos saques. Toda a equipe que usa o mesmo banco precisa da mesma chave.
4. Mantenha `php artisan queue:work` e `php artisan schedule:work` rodando.
5. No painel do Asaas, inclua os eventos `TRANSFER_*` no webhook e habilite transferências por API.

Comandos da administração:

```bash
php artisan contratacoes:concluir
php artisan contratacoes:decidir 12 devolver --motivo="Prestador faltou" --admin=admin@exemplo.com
php artisan saques:resolver 5 falhou --motivo="Conferido no Asaas" --admin=admin@exemplo.com
```

`decidir` aceita `liberar` ou `devolver`; `resolver` aceita `pago` ou `falhou`. Confira o painel do Asaas antes de usar `saques:resolver`.

## Verificação realizada

| Verificação | Resultado |
| --- | --- |
| Backend (`php artisan test`) | 118 testes aprovados (eram 73) |
| Frontend (`npm test`) | 73 testes aprovados (eram 54) |
| Cobertura do front (`npm run test:coverage`) | 100% nos arquivos configurados |
| Build (`npm run build`) | Concluído |
| Migrations em SQLite | Aplicadas sobre o esquema antigo, revertidas e reaplicadas |
| Jornada no navegador (Edge, API e front reais, SQLite) | Perfil, oferta, agenda, contratação, cancelamento, resultado, divisão, saque, encerramento, edição da conta e recuperação de senha sem erros. Asaas propositalmente inacessível; datas da sessão e da carência adiantadas no banco; código de e-mail lido do log. |

## Pendências

- [ ] Validar RN42, RN29 e RN40 com Ciro.
- [ ] Aplicar as migrations no Supabase e testar as travas com acessos simultâneos no Postgres.
- [ ] Testar transferência e webhook no sandbox do Asaas.
- [ ] Testar o envio de e-mail com um servidor SMTP real e definir o e-mail de SAC.
- [ ] Verificar HTTPS em produção e decidir sobre o token em `localStorage`.
- [ ] Verificar nicknames repetidos antigos: a regra vale só para novos cadastros e edições, sem índice único no banco.
- [ ] Atualizar os status em `data/requisitos.yaml`, na branch `main`.
- [ ] Alinhar com a equipe o nome da branch `devloper`.
