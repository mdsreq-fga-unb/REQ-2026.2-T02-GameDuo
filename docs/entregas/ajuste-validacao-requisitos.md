# Registro de análise e ajuste dos requisitos

Esta página registra a decisão da equipe para cada apontamento feito pela equipe ByteLab na avaliação dos nossos requisitos, e o que foi alterado na [lista de requisitos](../visao-produto/requisitos-software.md).

## Critérios de decisão

- **Aceito:** o requisito foi ajustado como sugerido.
- **Parcialmente aceito:** o requisito foi ajustado, mas de forma diferente da sugerida.
- **Não aceito:** o requisito foi mantido, com justificativa.
- **Não aplicável:** o apontamento não se aplica ao escopo do projeto.

Vários apontamentos pedem prazos, limites, fórmulas ou políticas (por exemplo, prazo de reagendamento ou fórmula da reputação). Essas são regras de negócio que ainda serão definidas com o cliente e não entram na descrição dos requisitos. Por isso, esses apontamentos aparecem como **Não aceito**.

## Resumo

A avaliação trouxe **74 apontamentos**: 40 sobre RFs, 18 sobre RNFs e 16 sugestões de RNFs que poderiam estar faltando.

| Decisão | RFs | RNFs | Sugestões | Total |
| --- | --- | --- | --- | --- |
| Aceito | 13 | 6 | 1 | 20 |
| Parcialmente aceito | 8 | 6 | 5 | 19 |
| Não aceito | 18 | 6 | 10 | 34 |
| Não aplicável | 1 | 0 | 0 | 1 |
| **Total** | **40** | **18** | **16** | **74** |

Principais alterações:

- **Requisitos que faziam coisas demais foram divididos:** a consulta de solicitações saiu do RF20 e virou o RF52; a consulta de ofertas recebidas saiu do RF21 e virou o RF53; o RNF09 ficou só com a agenda, e a parte financeira virou o RNF13.
- **Novos requisitos:** RF54 (histórico do consumidor), RNF13 (integridade financeira), RNF14 (proteção de senhas e dados) e RNF15 (falhas de integração).
- **Nomes corrigidos** para bater com a descrição: RF11, RF50, RF51 e RNF11.
- **Critérios dos RNFs mais fáceis de testar:** RNF02, RNF03, RNF05, RNF07, RNF08, RNF11 e RNF12.
- **Redação padronizada:** todos os RFs começam com “O sistema deve”.

## Decisões por apontamento

### Requisitos funcionais

| Código/feedback | Decisão da equipe | Ajuste realizado ou justificativa |
| --- | --- | --- |
| RF01–RF03 — Associados só à administração (CP7) | **Parcialmente aceito** | Mantivemos na CP7, que também trata da gestão de contas, e explicamos na página que esses requisitos servem a todos os usuários. Não criamos uma nova CP. |
| RF03 — Validação da recuperação de senha | **Parcialmente aceito** | Informamos os canais de recuperação (e-mail ou telefone). As condições para aceitar ou recusar a recuperação são regra de negócio. |
| RF06 — Falhas da integração | **Aceito** | Criamos o RNF15, que define o que acontece quando a integração com o jogo falha ou responde errado. |
| RF06 — Separar vincular e verificar | **Não aceito** | Para o usuário, vincular a conta e ver o resultado da verificação é uma única ação. Separar geraria dois requisitos que nunca são usados sozinhos. |
| RF11 — Separar cadastrar, editar e publicar | **Não aceito** | As três operações fazem parte da manutenção da mesma oferta. Pausar e encerrar, que são ações diferentes, já têm requisitos próprios (RF12 e RF13). |
| RF11 — Nome mais restrito que a descrição | **Aceito** | Nome alterado de “Publicar ofertas” para “Manter ofertas”. |
| RF11 — Ciclo de vida da oferta | **Não aceito** | Os estados da oferta já estão cobertos: publicada (RF11), pausada (RF12) e encerrada (RF13). Não vimos necessidade de estados como rascunho. |
| RF17 — Separar solicitação e resposta | **Parcialmente aceito** | Reescrevemos o RF17 deixando claras as ações possíveis (solicitar, aceitar, recusar e contrapropor), mas mantivemos um só requisito porque tudo faz parte da mesma negociação. |
| RF17 — Prazo para reagendar | **Não aceito** | O prazo é regra de negócio e será definido com o cliente. |
| RF17 — Resultado da recusa ou contraproposta | **Parcialmente aceito** | O RF17 agora exige registrar o resultado da negociação. O que acontece com o horário original é regra de negócio. |
| RF20 — Consultar e oferecer juntos | **Aceito** | O RF20 ficou só com a oferta de atendimento. A consulta virou o RF52. |
| RF20–RF21 — Várias ofertas para a mesma solicitação | **Não aceito** | O que acontece com as outras ofertas depois da escolha é regra de negócio e será definido com o cliente. |
| RF21 — Consultar, escolher e registrar juntos | **Parcialmente aceito** | A consulta das ofertas recebidas virou o RF53. Escolher e registrar a contratação ficaram juntos porque acontecem na mesma operação. |
| RF21 — Registro automático da contratação | **Aceito** | A descrição agora diz que o consumidor escolhe a oferta e o sistema registra a contratação automaticamente. |
| RF23 — Tipos de saldo | **Não aceito** | O RF23 já separa os saldos em disponível, retido e pendente. |
| RF24 — Falta histórico do consumidor | **Aceito** | Criamos o RF54, para o consumidor consultar suas contratações, compras e movimentações de créditos. |
| RF29 — Compra repetida ou com falha | **Aceito** | Criamos o RNF13, que impede cobrança ou crédito duplicado quando uma operação é repetida ou interrompida. |
| RF29–RF30 — Como o prestador disponibiliza o conteúdo | **Parcialmente aceito** | Em vez de criar um novo requisito, o RF11 passou a incluir o envio dos vídeos ou documentos nas ofertas de conteúdo. |
| RF30 — Por quanto tempo o conteúdo fica disponível | **Não aceito** | O prazo de acesso é regra de negócio e será definido com o cliente. |
| RF34 — Termo “avaliações válidas” | **Aceito** | Trocamos “avaliações válidas” por “notas das avaliações das sessões do prestador”. |
| RF34 — Fórmula da reputação | **Não aceito** | A fórmula é regra de negócio e será definida com o cliente. |
| RF35 — “Política de publicação” não identificada | **Parcialmente aceito** | Retiramos do RF35 a menção a uma política que não estava definida. |
| RF35 — Quando só uma das partes avalia | **Não aceito** | O prazo e a condição de publicação são regra de negócio e serão definidos com o cliente. |
| RF36 — Quem pode denunciar | **Aceito** | A descrição agora diz que consumidores e prestadores podem denunciar. |
| RF36 — O que pode ser denunciado | **Não aceito** | O RF36 já lista o que pode ser denunciado: usuário, contratação e conteúdo. |
| RF41 — Quais são as sanções | **Não aceito** | O catálogo de sanções é política de moderação e será definido com o cliente. O RF41 já prevê o banimento. |
| RF41 — Duração e reversão das sanções | **Não aceito** | Duração e reversão são regras de moderação a definir com o cliente. O motivo e o responsável já são registrados pelo RF41. |
| RF41 — Efeito da sanção em contratos e saldo | **Não aceito** | Os efeitos financeiros de uma decisão já são tratados pelo RF40 (Executar decisão financeira). |
| RF43 — Muitas notificações em um só requisito | **Parcialmente aceito** | Reescrevemos o RF43 listando os eventos, mas mantivemos um só requisito para não criar um requisito por notificação. |
| RF43 — Quem recebe e quando | **Aceito** | O RF43 agora diz qual evento gera notificação e quem é avisado. |
| RF44 — Termo “dados autorizados” | **Aceito** | Trocamos por “dados cadastrais e sanções”. |
| RF44–RF49 — Sobreposição de permissões | **Não aceito** | Consultar usuários (RF44) e conceder permissões (RF49) são funcionalidades diferentes. As duas seguem a mesma regra de acesso (RNF02), então não há conflito. |
| RF47 — Quando a nova comissão passa a valer | **Não aceito** | A vigência da comissão é regra de negócio e será definida com o cliente. |
| RF47 — Limites da comissão | **Não aceito** | Os limites são regra de negócio e serão definidos com o cliente. |
| RF49 — Verbo “gerenciar” | **Não aceito** | A descrição já diz quais são as operações: conceder e revogar permissões. |
| RF49 — Quem altera a permissão de quem | **Não aceito** | A hierarquia de administração é regra de negócio e será definida com o cliente. |
| RF50 — Nome diferente da descrição | **Aceito** | Nome alterado para “Manter jogos do catálogo”, com as operações de cadastrar e atualizar. |
| RF50 — Desativar jogo usado em ofertas antigas | **Não aplicável** | O sistema não prevê desativar nem excluir jogos, então esse caso não acontece. |
| RF51 — “Informações do site” genérico | **Aceito** | Limitamos à apresentação da plataforma e às informações de contato. |
| RF51 — Verbo “manter” | **Aceito** | Nome alterado para “Atualizar informações institucionais”. |

### Requisitos não funcionais

| Código/feedback | Decisão da equipe | Ajuste realizado ou justificativa |
| --- | --- | --- |
| RNF01 — Quais operações exigem segundo fator | **Não aceito** | A lista de operações protegidas ainda será definida com o cliente. |
| RNF01 — Política de autenticação não identificada | **Não aceito** | A política de autenticação ainda será definida com o cliente. Quando existir, será referenciada no RNF01. |
| RNF02 — Classificação como segurança | **Não aceito** | O RNF02 é uma restrição que vale para todo o sistema, e não uma funcionalidade. A funcionalidade de conceder permissões já está no RF49. |
| RNF02 — Matriz de permissões | **Parcialmente aceito** | O critério agora testa o acesso por papel, por dono do dado e pela situação do registro. A tabela completa de permissões ainda será montada. |
| RNF04 — Repete o RF47 | **Aceito** | O RNF04 agora fala só da possibilidade de alterar taxas pelo painel, sem repetir a funcionalidade do RF47. |
| RNF04 — Onde e por quem configurar | **Parcialmente aceito** | O requisito já indica o painel administrativo. Não definimos tempo de aplicação da mudança porque não vimos necessidade. |
| RNF05 — Deveria ser RF ou regra de negócio | **Não aceito** | O cálculo em si é uma funcionalidade (RF34). O RNF05 define só com que frequência ele roda, o que é uma restrição de operação. |
| RNF05 — Sentido de “diariamente” | **Parcialmente aceito** | O critério agora exige pelo menos uma atualização concluída por dia. Não fixamos horário. |
| RNF07 — “Atender à LGPD” amplo demais | **Parcialmente aceito** | O critério agora exige um inventário dos dados pessoais: para que servem, quem acessa e por quanto tempo ficam guardados. |
| RNF07 — LGPD em um único requisito | **Parcialmente aceito** | A proteção técnica dos dados ficou no novo RNF14, e o controle de acesso no RNF02. Não criamos um requisito para cada ponto da LGPD. |
| RNF08 — “Linguagem compreensível” subjetivo | **Aceito** | O critério agora diz o que a mensagem precisa ter: qual campo está errado e como corrigir. |
| RNF08 — Falta métrica | **Não aceito** | Com o novo critério, dá para testar se a mensagem mostra o campo e a correção. Um percentual de compreensão exigiria testes com usuários que não estão previstos. |
| RNF09 — Agenda e finanças juntas | **Aceito** | O RNF09 ficou só com a agenda. A parte financeira virou o RNF13. |
| RNF09 — Domínios diferentes | **Aceito** | Agenda (RNF09) e finanças (RNF13) agora têm requisitos e testes separados. |
| RNF11 — É mais comportamento de interface | **Parcialmente aceito** | Mudamos o nome para “Prevenção de ações involuntárias”, mas mantivemos como usabilidade, porque o objetivo é evitar erros do usuário. |
| RNF11 — Lista aberta (“como”) | **Aceito** | A lista agora é fechada: cancelar contratação, encerrar oferta e aplicar sanção. |
| RNF12 — Guia de estilo não identificado | **Não aceito** | O guia de estilo ainda não existe. Quando for criado, será referenciado no RNF12. |
| RNF12 — Falta métrica de consistência | **Aceito** | O critério agora lista as telas e o que comparar entre elas: cor, tipografia, botões e espaçamento. |

### Sugestões de RNFs que poderiam estar faltando

| Código/feedback | Decisão da equipe | Ajuste realizado ou justificativa |
| --- | --- | --- |
| Desempenho | **Não aceito** | A infraestrutura ainda não foi definida, então não dá para fixar tempos de resposta realistas. |
| Escalabilidade | **Não aceito** | Pelo mesmo motivo, ainda não dá para definir quantos usuários simultâneos o sistema vai suportar. |
| Disponibilidade | **Não aceito** | O percentual de disponibilidade depende da hospedagem, que ainda não foi escolhida. |
| Recuperação de falhas | **Não aceito** | Recuperação de falhas depende da hospedagem, que ainda não foi escolhida. Será tratada quando a infraestrutura for definida. |
| Backup | **Não aceito** | Frequência e guarda das cópias de segurança dependem da hospedagem, que ainda não foi escolhida. |
| Acessibilidade | **Não aceito** | A equipe não priorizou acessibilidade nesta versão, que tem foco em contratação, pagamento e moderação. Pode entrar em uma versão futura. |
| Compatibilidade | **Não aceito** | Navegadores e versões serão definidos no plano de testes. |
| Responsividade | **Aceito** | Vimos que realmente é uma parte fundamental para a experiência do usuário e adicionamos como RNF |
| Proteção de dados | **Parcialmente aceito** | Criamos o RNF14, que protege as senhas e exige conexão criptografada. Não exigimos criptografia de todos os dados armazenados. |
| Gestão de sessão | **Não aceito** | Expiração e sessões simultâneas fazem parte das regras de autenticação, ainda a definir com o cliente. |
| Proteção contra abuso | **Não aceito** | O limite de tentativas faz parte das regras de autenticação, ainda a definir com o cliente. |
| Resiliência de integrações | **Parcialmente aceito** | O RNF15 trata falhas e respostas inválidas das integrações. Não definimos tempo limite nem número de novas tentativas. |
| Integridade financeira | **Aceito** | Criamos o RNF13, que impede débito ou crédito duplicado. |
| Precisão monetária | **Parcialmente aceito** | O RNF13 exige que as partes de uma divisão somem o valor total. A regra de arredondamento ainda não foi definida. |
| Auditabilidade | **Parcialmente aceito** | O RNF03 passou a registrar também as movimentações financeiras, com data e resultado. Não definimos por quanto tempo os registros ficam guardados. |
| Retenção e exclusão de dados | **Parcialmente aceito** | O inventário exigido pelo RNF07 inclui por quanto tempo cada dado fica guardado. Os prazos ainda não foram definidos. |
