# Registro de análise e ajuste dos requisitos

## Objetivo e referência da atividade

Registrar a análise de cada apontamento recebido, os ajustes realizados e as justificativas de manutenção do requisito, conforme a atividade **“Ajuste e validação”**, publicada por George Marsicano Correa em 16/09/2026, com prazo até **29/09/2026, no início da aula**, e participação obrigatória dos monitores.

Fontes: avaliação recebida em `Avaliacao_Ampliada_Requisitos_GoHorse_GameDuo (1).pdf` (cinco páginas), [orientação do professor](https://aprender3.unb.br/mod/forum/discuss.php?d=315943), [visão do produto](../visao-produto/solucao-proposta.md) e [lista revisada de requisitos](../visao-produto/requisitos-software.md).

**Data da revisão documental:** 28/09/2026. **Base:** commit `f229d11a`, preservando a edição local do RF03 que acrescenta recuperação por e-mail ou telefone.

**Situação:** revisão documental preparada com apoio do Codex para conferência da equipe. As decisões abaixo descrevem o tratamento aplicado ao documento; ainda precisam de ratificação da equipe com participação dos monitores. Não constituem ata de reunião, aprovação do cliente ou evidência de validação humana já realizada.

A página de requisitos contém o catálogo revisado, sem decisões de feedback. Este registro separado contém as decisões e as pendências. Prazos, fórmulas, percentuais e políticas de negócio não foram inseridos nas descrições dos requisitos.

## Critérios de decisão

- **Aceito:** o requisito ou critério relacionado foi ajustado em resposta ao apontamento.
- **Parcialmente aceito:** houve ajuste, mas não exatamente da forma sugerida; limitações e definições ainda necessárias estão explicitadas.
- **Não aceito:** o requisito foi mantido quanto ao ponto questionado, com justificativa. Quando a regra é pertinente, mas depende de decisão, o encaminhamento foi registrado separadamente; isso não significa que a regra deixou de ser necessária.
- **Não aplicável:** o comentário não corresponde ao escopo consolidado nesta revisão.

Preservaram-se os códigos existentes. RF52–RF54 acrescentam consultas independentes e histórico do consumidor; RNF13–RNF18 separam integridade financeira e cobrem riscos essenciais de segurança, integração, recuperação e uso. A matriz de rastreabilidade foi atualizada. O catálogo orienta a seleção do MVP; a presença de um requisito não determina sua prioridade ou inclusão automática na primeira entrega.

## Decisões por apontamento

Há **74 apontamentos individualizados**: 40 sobre RFs, 18 sobre RNFs e 16 sugestões complementares. A ordem acompanha o PDF; linhas com o mesmo requisito representam comentários diferentes.

### Requisitos funcionais

| Código/feedback | Decisão da equipe para ratificação | Ajuste realizado ou justificativa |
| --- | --- | --- |
| F01 — RF01–RF03: Rastreabilidade exclusiva com administração | **Parcialmente aceito** | A introdução da seção 8.1 explicita o caráter transversal do acesso e o vínculo com gestão de contas em CP7. Não foi criada uma CP adicional. |
| F02 — RF03: Validação da recuperação de senha | **Parcialmente aceito** | Preservada a edição existente com recuperação por e-mail ou telefone e padronizada a redação. Condições de validade e rejeição não foram inventadas: seguem em P01, fora da descrição. |
| F03 — RF06: Falhas da integração | **Aceito** | RNF15 distingue falha de integração de confirmação bem-sucedida e acrescenta verificação por simulação de indisponibilidade e resposta inválida. |
| F04 — RF06: Separar vinculação e verificação | **Não aceito** | Mantido um objetivo funcional: verificar a credencial da conta vinculada. Os passos de consulta não exigem requisitos independentes nesta granularidade. |
| F05 — RF11: Separar cadastro, edição e publicação | **Parcialmente aceito** | Mantido o agrupamento de manutenção da oferta, com operações explícitas e associação do material digital. Pausa e encerramento continuam em RF12 e RF13; não foi adotada a divisão integral sugerida. |
| F06 — RF11: Nome mais restrito que a descrição | **Aceito** | Título alterado de Publicar ofertas para Manter ofertas, correspondente às operações descritas. |
| F07 — RF11: Ciclo de vida da oferta | **Parcialmente aceito** | Título e descrição foram alinhados a RF12 e RF13. Não foram criados estados hipotéticos como rascunho ou suspensão; transições e efeitos de edição seguem para confirmação em P02. |
| F08 — RF17: Separar solicitação e respostas | **Parcialmente aceito** | Mantido o objetivo de reagendar, com solicitação, alternativas de resposta e registro do resultado explícitos. Não foi criado um RF por resposta. |
| F09 — RF17: Prazo para reagendamento | **Não aceito** | Mantida a descrição funcional sem prazo de negócio. A necessidade do prazo foi registrada em P03 e deve ser decidida pelo cliente; não foi assumido valor nesta revisão. |
| F10 — RF17: Resultado de recusa e contraproposta | **Parcialmente aceito** | Acrescentado o registro do resultado da negociação. A regra específica sobre manter o horário anterior e expirar propostas permanece em P03. |
| F11 — RF20: Consulta e proposta independentes | **Aceito** | RF20 passou a tratar da oferta de atendimento; a consulta foi separada em RF52. |
| F12 — RF20–RF21: Múltiplas propostas para uma solicitação | **Parcialmente aceito** | Consulta e seleção foram separadas em RF53 e RF21; RNF09 verifica reservas incompatíveis. O destino das propostas não selecionadas continua em P03, sem presumir encerramento automático. |
| F13 — RF21: Consulta, seleção e registro no mesmo RF | **Parcialmente aceito** | Consulta separada em RF53. Escolha e registro automático permanecem juntos como ação e resultado da contratação. |
| F14 — RF21: Responsabilidade pelo registro da contratação | **Aceito** | A descrição explicita que o consumidor escolhe e o sistema registra automaticamente a contratação. |
| F15 — RF23: Tipos e estados de saldo | **Não aceito** | Mantido: a descrição já distingue disponível, retido e pendente. Definições e transições financeiras pertencem a P04; não são adicionadas como regras dentro do RF. |
| F16 — RF24: Ausência de histórico do consumidor | **Aceito** | Criado RF54 para consulta de contratações, conteúdos e movimentações de créditos do consumidor. RF24 continua específico da prestação. |
| F17 — RF29: Falha e repetição da compra | **Aceito** | Criado RNF13 para consistência de compras e demais operações financeiras, incluindo repetição, concorrência e interrupção; RNF15 cobre falhas de integração. |
| F18 — RF29–RF30: Disponibilização de conteúdo pelo prestador | **Parcialmente aceito** | RF11 já previa publicar ofertas de conteúdo e passou a explicitar a associação de vídeos ou documentos. Não foi criado outro requisito duplicando publicação. |
| F19 — RF30: Duração e condições do acesso adquirido | **Não aceito** | Mantida a capacidade de acessar o material comprado. Prazo, download, retirada e direito de acesso dependem do cliente e estão em P05; não foram presumidos acesso permanente ou expiração. |
| F20 — RF34: Expressão avaliações válidas | **Parcialmente aceito** | Substituída a expressão indefinida pela fonte concreta: notas das avaliações das sessões do prestador. Elegibilidade e exclusões permanecem em P06. |
| F21 — RF34: Fórmula da reputação | **Parcialmente aceito** | A fonte das notas e a atualização foram explicitadas. A fórmula não foi escolhida sem validação; permanece em P06, fora da descrição do requisito. |
| F22 — RF35: Política de publicação não identificada | **Parcialmente aceito** | Descrição passou a identificar o objetivo de publicar avaliações de sessões e conteúdos. A política mencionada sem referência foi retirada da frase; sua definição continua necessária em P06, incluindo a simultaneidade prevista em CP6. |
| F23 — RF35: Publicação quando apenas uma parte avalia | **Não aceito** | Não foi acrescentado prazo arbitrário ao RF. A decisão está em P06; a revisão textual não resolve nem declara validada essa regra. |
| F24 — RF36: Ator que pode denunciar | **Aceito** | Consumidores e prestadores foram explicitados como atores da denúncia, coerentes com os participantes do produto. |
| F25 — RF36: Objetos da denúncia | **Não aceito** | Mantidos usuário, contratação e conteúdo, já enumerados. Não foi incluída nova categoria apenas por ter sido sugerida. |
| F26 — RF41: Conjunto de sanções | **Não aceito** | Mantida a capacidade já prevista, incluindo banimento. Não foi criado catálogo de punições sem decisão de negócio; confirmar o conjunto em P07. |
| F27 — RF41: Duração, motivo e reversão de sanções | **Não aceito** | Motivo e responsável já constam do RF. Duração e reversão são decisões registradas em P07; a sugestão não justifica presumir suspensão temporária ou recurso. |
| F28 — RF41: Efeito em contratos, saldo e conteúdos | **Não aceito** | Mantida a separação entre sanção e execução financeira do RF40. Os efeitos precisam ser decididos em P07 antes de implementar a jornada; não foram criados confisco, reembolso ou cancelamento automático. |
| F29 — RF43: Escopo de múltiplas notificações | **Parcialmente aceito** | Mantido um requisito de notificação, com distinção entre participantes de contratações e de ocorrências. Não foi criado um requisito para cada evento. |
| F30 — RF43: Destinatários e momento de envio | **Parcialmente aceito** | Eventos e participantes foram explicitados. Canais, destinatários por situação e proteção de dados de denúncias serão consolidados em P08. |
| F31 — RF44: Dados autorizados indefinidos | **Parcialmente aceito** | O objeto passou a ser dados cadastrais e sanções. RNF02 continua impondo autorização por papel, titularidade e estado; a matriz concreta permanece em P01. |
| F32 — RF44–RF49: Sobreposição entre consulta e permissões | **Não aceito** | Consultar usuários e conceder/revogar permissões são capacidades distintas. Mantidas sob a restrição comum RNF02; não há duplicidade funcional a eliminar. |
| F33 — RF47: Vigência das comissões | **Não aceito** | Mantida a capacidade de configurar. Vigência e aplicação a contratos existentes estão em P04; não foi presumida retroatividade ou não retroatividade. |
| F34 — RF47: Limites de comissões e taxas | **Não aceito** | Mantido o RF sem percentuais ou faixas não aprovadas. Unidades, limites e base de cálculo seguem em P04; RNF08 cobre a clareza de mensagens de validação. |
| F35 — RF49: Verbo gerenciar amplo | **Não aceito** | A descrição já explicita conceder e revogar. O título agrupa essas duas operações sem ocultá-las. |
| F36 — RF49: Quem altera permissões de quem | **Não aceito** | Mantido o responsável autorizado, sem inventar hierarquia administrativa. A matriz e a autoridade de concessão são pendências de P01, necessárias à verificação de RNF02. |
| F37 — RF50: Nome e descrição inconsistentes | **Aceito** | Nome alterado para Manter jogos do catálogo; operações delimitadas a cadastrar e atualizar. |
| F38 — RF50: Desativação/exclusão e histórico | **Não aplicável** | A versão revisada não oferece exclusão ou desativação de jogos. Não se adicionou essa capacidade para depois tratar seus efeitos. Se o escopo mudar, o apontamento deverá ser reaberto. |
| F39 — RF51: Informações administráveis genéricas | **Aceito** | Escopo delimitado à apresentação da plataforma e às informações de contato, sem pressupor um gerenciador completo de páginas. |
| F40 — RF51: Verbo manter genérico | **Parcialmente aceito** | A descrição já indicava atualizar; o título foi alinhado a essa ação, sem acrescentar cadastro, exclusão ou publicação. |

### Requisitos não funcionais

| Código/feedback | Decisão da equipe para ratificação | Ajuste realizado ou justificativa |
| --- | --- | --- |
| N01 — RNF01: Operações que exigem segundo fator | **Não aceito** | Mantido o requisito sem escolher operações que o cliente ainda não confirmou. P01 exige a lista antes de encerrar a validação; o critério atual depende dessa definição. |
| N02 — RNF01: Identificação da política de autenticação | **Não aceito** | Não foi criada uma política fictícia. P01 concentra recuperação, segundo fator e permissões para decisão e posterior referência versionada. |
| N03 — RNF02: Classificação como segurança | **Não aceito** | Mantida a classificação de produto/segurança: o requisito impõe restrição de acesso transversal. RF49 descreve a função de administrar permissões. |
| N04 — RNF02: Matriz de permissões verificável | **Parcialmente aceito** | Critério passou a cobrir papel, titularidade, situação do registro e acesso direto à API. A matriz concreta precisa de confirmação em P01; o ajuste não a substitui. |
| N05 — RNF04: Duplicidade com RF47 | **Parcialmente aceito** | Redação passou a enfatizar a propriedade de configurabilidade sem edição de código. RF47 e RF48 continuam descrevendo as capacidades administrativas. |
| N06 — RNF04: Onde, por quem e como configurar | **Parcialmente aceito** | Mantido o painel administrativo e simplificado o teste de persistência e uso da configuração. Não foram criadas metas de tempo ou reinicialização sem necessidade confirmada. |
| N07 — RNF05: Classificação da periodicidade | **Não aceito** | Mantida como restrição operacional de frequência do processamento, na taxonomia declarada. RF34 permanece a função de calcular; RNF05 não define a fórmula de reputação. |
| N08 — RNF05: Significado de diariamente | **Parcialmente aceito** | Critério passou a exigir processamento concluído por dia no fuso de referência. O fuso deve ser confirmado em P06; não foi inventado horário fixo. |
| N09 — RNF07: Conformidade sem critério concreto | **Parcialmente aceito** | Substituído o texto de critério a definir por verificação do inventário de dados contra interfaces e armazenamento. P09 registra que inventário e avaliação das obrigações aplicáveis ainda precisam ser concluídos; isso não comprova conformidade legal integral. |
| N10 — RNF07: Privacidade em um único item | **Parcialmente aceito** | RNF02 e RNF14 complementam acesso e proteção técnica. Finalidades e retenção ficam em P09; não foi transformada toda possibilidade legal em funcionalidade presumida. |
| N11 — RNF08: Linguagem compreensível subjetiva | **Parcialmente aceito** | Critério delimitado a entradas inválidas em cadastro, contratação e pagamento, exigindo identificação do problema e orientação de correção. Revisão com usuários/equipe permanece necessária. |
| N12 — RNF08: Exigir percentual e amostra | **Não aceito** | Um percentual arbitrário não é necessário para verificar presença de orientação e identificação de erro. Não foi assumida meta de compreensão sem protocolo acordado. |
| N13 — RNF09: Separar agenda e finanças | **Aceito** | RNF09 ficou dedicado à agenda; integridade financeira foi transferida e ampliada em RNF13. |
| N14 — RNF09: Domínios e testes diferentes | **Aceito** | RNF09 verifica sobreposição de reservas; RNF13 verifica lançamentos e saldos, com rastreabilidade própria para cada domínio. |
| N15 — RNF11: Comportamento de interface versus usabilidade | **Parcialmente aceito** | Nome alterado para Prevenção de ações involuntárias e critério explicitado como prevenção de erro. Mantido em usabilidade, aplicado às funções já existentes. |
| N16 — RNF11: Lista aberta com como | **Aceito** | Retirado o caráter exemplificativo. O requisito cobre cancelamento de contratação, encerramento de oferta e aplicação de sanção. |
| N17 — RNF12: Guia visual não identificado | **Parcialmente aceito** | Verificação delimitada por telas, componentes, função e estado. Guia e versão ainda devem ser identificados em P10; não foi declarada a existência de um Design System. |
| N18 — RNF12: Métrica de consistência visual | **Parcialmente aceito** | Critério passou a comparar cor, tipografia, botões e espaçamento de componentes equivalentes. Não se exige número artificial; a referência visual deverá ser consolidada em P10. |

### Sugestões complementares

| Código/feedback | Decisão da equipe para ratificação | Ajuste realizado ou justificativa |
| --- | --- | --- |
| B01 — Complemento: Desempenho | **Não aceito** | Não foi inserido tempo de resposta sem ambiente, carga e necessidade acordados. P11 registra a definição de metas para as jornadas do MVP. |
| B02 — Complemento: Escalabilidade | **Não aceito** | Não foi inventada quantidade de usuários/transações a partir do objetivo de crescimento. Capacidade e cenário de carga seguem em P11. |
| B03 — Complemento: Disponibilidade | **Não aceito** | Não foi prometido percentual sem infraestrutura ou método de medição acordados. Registrar a meta em P11 antes de assumir compromisso operacional. |
| B04 — Complemento: Recuperação de falhas | **Parcialmente aceito** | Criado RNF16 com verificação de restauração e integridade dos vínculos. Tempo máximo e perda tolerada continuam em P11. |
| B05 — Complemento: Backup | **Parcialmente aceito** | RNF16 exige recuperação a partir de cópia; frequência, retenção e responsável operacional permanecem em P11. |
| B06 — Complemento: Acessibilidade | **Parcialmente aceito** | RNF17 cobre teclado, foco, rótulos e independência de cor nas jornadas essenciais, sem alegar certificação de norma completa. |
| B07 — Complemento: Compatibilidade | **Não aceito** | Não foram escolhidos navegadores e versões sem definir a matriz de homologação. P10 registra essa escolha antes dos testes. |
| B08 — Complemento: Responsividade | **Parcialmente aceito** | RNF18 cobre uso em celular e computador. Dimensões da verificação ficam no plano de teste de P10, sem presumir suporte a todos os dispositivos. |
| B09 — Complemento: Proteção de dados | **Parcialmente aceito** | RNF14 acrescenta proteção de senhas e transmissão criptografada; RNF02 limita acesso. Não foi prometida uma arquitetura específica de criptografia de todos os dados em repouso. |
| B10 — Complemento: Gestão de sessão | **Não aceito** | Não foram presumidos prazo de sessão, múltiplas sessões ou política de revogação. P01 registra a definição necessária para autenticação e recuperação. |
| B11 — Complemento: Proteção contra abuso | **Não aceito** | Não foram definidos limites arbitrários de tentativas. P01 inclui a escolha do controle e seus parâmetros para as operações sensíveis. |
| B12 — Complemento: Resiliência de integrações | **Parcialmente aceito** | RNF15 cobre falhas, respostas inválidas e repetição segura. Timeout e política de retentativa dependem das integrações selecionadas e seguem em P11. |
| B13 — Complemento: Integridade financeira | **Aceito** | RNF13 cobre ausência de duplicidade, preservação de reservas e consistência dos totais em operações simultâneas, repetidas e interrompidas. |
| B14 — Complemento: Precisão monetária | **Parcialmente aceito** | RNF13 exige recomposição do total distribuído. Unidade, conversão e arredondamento seguem em P04; a forma de armazenamento será decisão arquitetural. |
| B15 — Complemento: Auditabilidade | **Parcialmente aceito** | RNF03 foi ampliado às movimentações financeiras, incluindo data e resultado. Prazo de retenção e acesso aos registros permanecem em P09. |
| B16 — Complemento: Retenção/exclusão de dados | **Parcialmente aceito** | RNF07 passa a exigir correspondência com o inventário, incluindo retenção. P09 registra os prazos e tratamentos a definir; não foi presumida exclusão imediata com contratos ativos. |

## Definições pendentes para validação

As pendências abaixo foram identificadas, não resolvidas por suposição. As regras aprovadas deverão ser registradas em artefato próprio e relacionadas aos requisitos. Uma pendência que altera o resultado esperado de uma jornada do MVP deve ser fechada antes de considerar essa jornada pronta para implementação.

| ID | Definição necessária | Requisitos relacionados | Participação necessária | Situação |
| --- | --- | --- | --- | --- |
| P01 | Recuperação válida/inválida; operações e canais de segundo fator; matriz papel × recurso × estado × operação; autoridade de concessão; sessão e prevenção de abuso. | RF01–RF03, RF38, RF44, RF49, RNF01, RNF02, RNF14 | Equipe e cliente; revisão com monitores | Pendente |
| P02 | Estados e transições de ofertas, efeitos de edição sobre contratações existentes e associação do material digital. | RF11–RF13 | Equipe e cliente | Pendente |
| P03 | Prazos e respostas de reagendamento; manutenção do horário anterior; cancelamento; destino das propostas restantes após a escolha. | RF16–RF21, RF52, RF53, RNF09 | Equipe e cliente | Pendente |
| P04 | Tipos e transições de saldo; reserva/liberação; conversão de créditos; base, limites, arredondamento e vigência de comissões; taxas e penalidades. | RF22–RF29, RF40, RF47, RF48, RF54, RNF13 | Equipe e cliente, considerando o gateway | Pendente |
| P05 | Prazo e condições do acesso comprado, download, atualização e retirada do material. | RF29, RF30 | Equipe e cliente | Pendente |
| P06 | Elegibilidade e fórmula das avaliações/indicadores, publicação simultânea e unilateral, fuso do processamento diário. | RF08, RF32–RF35, RNF05 | Equipe e cliente | Pendente |
| P07 | Sanções previstas, duração/reversão e efeitos sobre contratos, saldo e conteúdo adquirido; distinguir sanção de decisão financeira. | RF39–RF42 | Equipe e cliente | Pendente |
| P08 | Destinatários por evento, canais e condições de envio, preservando a confidencialidade das denúncias. | RF43, RNF02 | Equipe e cliente | Pendente |
| P09 | Inventário de dados, finalidade, acesso, retenção e exclusão; cobertura das obrigações aplicáveis e retenção da auditoria. | RNF02, RNF03, RNF07, RNF14 | Equipe e responsável pelo produto | Pendente |
| P10 | Guia de estilo identificável e versionado; matriz de navegadores/dispositivos e dimensões para homologação. | RNF08, RNF12, RNF17, RNF18 | Equipe; revisão com monitores | Pendente |
| P11 | Gateway e falhas de integração; metas de carga, resposta, disponibilidade e recuperação; frequência/retenção de backup e procedimento de restauração. | RF06, RF22, RF26–RF28, RNF15, RNF16 | Equipe e cliente, conforme arquitetura viável | Pendente |

A visão do produto ainda apresenta prazos em aberto em CP5 e remete a um detalhamento 2.3.2 de CP6 que não consta da página. Esses pontos precisam ser sincronizados com P03, P04 e P06; a referência a uma política não comprova que ela já foi definida. O escopo do MVP deverá ser priorizado com o cliente, preservando a coerência entre contratação, conclusão e movimentação financeira.

## Verificação da consistência do conjunto

| Critério do professor | Evidência ou encaminhamento | Situação |
| --- | --- | --- |
| Analisar todos os feedbacks | 74 registros individuais acima, incluindo as sugestões complementares. | Análise documental realizada |
| Registrar decisões | Cada apontamento possui decisão e ajuste/justificativa. | Registrado para ratificação |
| Corrigir RFs e RNFs pertinentes | Catálogo com 54 RFs e 18 RNFs; descrições de RF centradas em capacidades e RNFs com classificação e critério. | Revisado |
| Diferenciar RFs e RNFs e conferir classificação | Mantidos atributos de segurança e usabilidade; periodicidade justificada como restrição operacional; funções separadas de propriedades. | Revisão documental realizada; conferência com monitores pendente |
| Padronizar códigos, nomes e classificação | Códigos antigos preservados, novos códigos sem reutilização e descrições funcionais com sujeito “O sistema deve”. | Verificado |
| Tratar duplicidades, conflitos e amplitude excessiva | Consultas separadas em RF52/RF53, histórico em RF54, agenda e finanças em RNF09/RNF13, títulos e objetos delimitados. | Ajustado; políticas relacionadas ainda dependem de validação |
| Tornar RNFs verificáveis sempre que possível | Critérios concretos ampliados; parâmetros ainda não aprovados identificados em P01 e P06–P11. | Parcial; não se presume validação completa |
| Verificar novamente a consistência | Conferência de códigos, links, rastreabilidade e geração do site, registrada abaixo. | Verificação técnica documental |
| Validar internamente a versão revisada | Registrar reunião, participantes, decisões e alterações finais. | Pendente |
| Participação mandatória de monitores | Registrar nome, data e evidência da participação efetiva. | Pendente |
| Publicar a versão revisada | Revisar primeiro na branch `docs` e na prévia local; publicar após a aprovação e a integração à `main`. | Pendente por decisão da equipe |
| Evidência de revisão e validação | Este registro e o histórico Git evidenciam a revisão; ata e participação dos monitores ainda precisam ser anexadas. | Revisão registrada; validação humana pendente |

## Evidências e histórico

| Data | Ação | Evidência |
| --- | --- | --- |
| 28/09/2026 | Revisão documental assistida, preservando a edição existente do RF03 | Diferenças versionadas da seção 8 e este registro na branch `docs` |
| 28/09/2026 | Verificação técnica da documentação | Build MkDocs em modo estrito concluído; 54 RFs, 18 RNFs e 74 apontamentos conferidos; códigos únicos, estrutura das tabelas, links internos e correspondência entre requisitos e matriz verificados |
| 28/09/2026 | Preparação para revisão local | Navegação separada para o catálogo e para este registro; publicação no Pages adiada até aprovação da equipe |

### Registro da validação interna com monitores

Preencher somente após a participação efetiva. A aprovação deste texto não substitui a revisão conjunta dos requisitos.

| Campo | Registro |
| --- | --- |
| Data e horário | Pendente |
| Integrantes presentes | Pendente |
| Monitor(es) participante(s) | Pendente |
| Versão/commit revisado | Pendente |
| Decisões ratificadas ou alteradas | Pendente |
| Pendências resolvidas e regras aprovadas | Pendente |
| Evidência da reunião/revisão | Pendente |
| Resultado da validação | Pendente |

A lista somente poderá ser declarada **ajustada, estável e validada** após a ratificação, o tratamento das pendências relevantes ao recorte acordado e o registro da participação dos monitores. A publicação do documento, por si só, não comprova essas etapas.
