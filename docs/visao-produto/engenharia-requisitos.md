# 5 Engenharia de Requisitos

Duas características do projeto orientaram essa definição. A primeira é a natureza do domínio: o mercado de coaching e duo remunerado tem vocabulário próprio e uma fronteira delicada entre o que a plataforma pretende oferecer (coaching e duo, com cada jogador em sua própria conta) e o que ela precisa excluir (boosting por compartilhamento de conta). A segunda é a concentração de risco em decisões estruturais — a custódia dos créditos até a validação bilateral da sessão e a verificação do Elo por meio de APIs de terceiros. Por isso, as técnicas de descoberta e de validação foram concentradas nas fases iniciais, quando o custo de reverter uma decisão ainda é baixo.

---

## 5.1 Atividades e Técnicas de ER

### Elicitação e Descoberta

- **Entrevistas com o cliente:** entrevistas conduzidas com Ciro Vargas por Google Meet e Discord, nas reuniões quinzenais, para levantar as regras de negócio da custódia de créditos, os critérios de validação bilateral da sessão, as políticas de repasse e a fronteira entre coaching, duo e boosting. Como o cliente é o idealizador, o único tomador de decisão e arquiteto de software, as entrevistas cobrem tanto a necessidade de negócio quanto as restrições técnicas.
- **Brainstorming:** sessões realizadas nas reuniões internas da equipe (segundas e quartas, 20h30) para gerar alternativas de solução para problemas ainda em aberto, como o mecanismo de comprovação de que a sessão contratada foi efetivamente prestada e o formato da avaliação cruzada entre consumidor e prestador.
- **Análise de domínio de negócio:** estudo do ecossistema de e-sports e de jogos competitivos (League of Legends, Elden Ring) para compreender conceitos como elo, ranqueada, high elo, duo e coaching, garantindo que os requisitos sejam declarados com a terminologia usada pelos dois perfis de usuário.
- **Análise documental:** leitura da documentação pública das APIs de jogos utilizadas para verificação de credenciais, dos termos de serviço das desenvolvedoras (que delimitam o que a plataforma pode oferecer) e da documentação do gateway de pagamento com split, para identificar restrições que se tornam requisitos.
- **Análise competitiva (benchmarking):** exame das soluções já mapeadas na seção 2.5 — Metafy, ProGuides, E-Pal, LFCarry e Fiverr — para descobrir funcionalidades esperadas pelo mercado e identificar as lacunas que o GameDuo pretende preencher.

### Análise e Consenso

- **Priorização MoSCoW:** classificação dos requisitos em *Must have*, *Should have*, *Could have* e *Won't have*, com o cliente, para delimitar o MVP em torno da proposta de valor central — encontrar um prestador confiável, contratar uma sessão e concluir a transação com segurança para as duas partes.
- **Matriz valor de negócio × esforço:** avaliação de cada item quanto ao valor de negócio, à complexidade técnica e ao esforço de implementação, gerando um índice de prioridade que apoia a decisão sobre o que entra no MVP e o que fica para releases posteriores.
- **Lista de Riscos (OpenUP):** registro e reavaliação periódica dos riscos de requisitos — dependência de APIs externas, indefinição do meio de pagamento e mudanças nos termos de serviço das desenvolvedoras —, com o impacto de cada risco sobre os requisitos associados.
- **Análise de viabilidade técnica:** discussão entre a equipe e o cliente sobre o custo de implementação de cada requisito dentro do semestre letivo, considerando a disponibilidade parcial dos cinco integrantes.
- **Negociação e consenso com o cliente:** quando o esforço estimado de um requisito não se sustenta no prazo disponível, a equipe apresenta alternativas de escopo reduzido ao cliente, e a decisão é registrada como acordo formal na documentação da reunião.

### Declaração de Requisitos

- **Declaração padronizada de requisitos funcionais:** cada RF é escrito no formato "verbo no infinitivo + objeto + complemento", com identificador único, de modo a permitir rastreabilidade com as características de produto (CP1 a CP6) e com os objetivos específicos (OE1 a OE5).
- **Classificação de requisitos não funcionais pelo modelo URPS+:** os RNFs são declarados e classificados em usabilidade, confiabilidade, desempenho, suportabilidade e restrições de projeto, incluindo as exigências de conformidade com a LGPD e a restrição de implementação (React, PHP e Supabase).
- **História de Usuarios:** os requisitos funcionais são derivados em histórias de usuário. Os perfis refletem os dois lados da plataforma: consumidor, prestador e administrador.
- **Critérios de aceitação em BDD:** cada história recebe critérios no formato Dado/Quando/Então, o que é especialmente relevante para os fluxos com regra condicional, como a liberação do repasse somente após a validação bilateral da sessão.

### Representação de Requisitos

- **Rich Picture:** representação do cenário atual, já elaborada na seção 1.3, mantida e atualizada conforme o entendimento do domínio evolui.
- **Diagrama de Ishikawa:** representação das causas do problema central, apresentada na seção 1.4, usada como âncora para justificar a existência de cada requisito.
- **Protótipos de baixa e de alta fidelidade:** wireframes para validar a estrutura das telas e protótipos navegáveis no Figma para validar a jornada completa com o cliente antes da implementação, prática coerente com a redução de risco prevista na fase de Elaboração do OpenUP.
- **Matriz de rastreabilidade:** tabela que relaciona objetivos específicos, características de produto, valor de negócio, requisitos funcionais e requisitos não funcionais, permitindo verificar se toda característica está coberta e se todo requisito tem origem justificada.

### Verificação e Validação de Requisitos

- **Inspeção com checklist:** revisão de cada requisito quanto a completude, ausência de ambiguidade, consistência com os demais e testabilidade, conduzida pelo Analista de Requisitos antes de o item ser considerado pronto para desenvolvimento.
- **Revisão por pares (walkthrough interno):** leitura conjunta dos requisitos pela equipe, com participação das frentes de frontend, backend e banco de dados, para identificar inviabilidades técnicas antes da validação com o cliente.
- **Validação por prototipação:** apresentação dos protótipos ao cliente nas reuniões quinzenais, de modo que a validação ocorra sobre algo concreto e não apenas sobre texto.
- **Revisão dos critérios de aceitação e testes de aceitação:** verificação, pelo Analista de Qualidade, de que o incremento entregue satisfaz os critérios em BDD declarados para cada história.
- **Definição de Pronto (DoR) e Definição de Concluído (DoD):** aplicadas como portões de entrada e de saída de cada iteração, garantindo que nenhum requisito entre em desenvolvimento sem critérios de aceitação e que nenhum incremento seja apresentado ao cliente sem estar testado.

### Organização e Atualização de Requisitos

- **Lista de itens de trabalho e backlog do produto:** artefato central do OpenUP para organização dos requisitos, mantido priorizado e associado às iterações de cada fase.
- **Refinamento contínuo do backlog:** revisão periódica para manter o backlog Detalhado na medida certa, Emergente, Estimável e Priorizado, com os itens da próxima iteração mais detalhados do que os itens distantes.
- **Controle de versão e histórico de revisão:** todo o conteúdo é versionado em Git e publicado no GitPages, com registro de data, versão, descrição da alteração e autor, permitindo reconstituir quando e por que um requisito mudou.
- **Manutenção da matriz de rastreabilidade:** a cada alteração de requisito, a matriz é atualizada para preservar o vínculo entre objetivos, características, requisitos e histórias, evitando requisitos órfãos e características descobertas.


---

## 5.2 Engenharia de Requisitos e o OpenUP

O OpenUP organiza o desenvolvimento em quatro fases, cada uma encerrada por um marco de decisão. As atividades da ER se distribuem por todas elas, mudando de ênfase conforme o objetivo da fase.

**Iniciação.** O foco é entender o problema, delimitar o escopo e alcançar consenso sobre a visão do produto. A ER concentra-se em elicitação ampla e em representação do cenário. O marco de fase é o acordo sobre objetivos e escopo com o cliente.

**Elaboração.** O foco é reduzir risco. A ER detalha e estabiliza a base de requisitos que sustenta as decisões arquiteturais, especialmente as relativas à custódia de créditos e à verificação de Elo, e valida essa base com protótipos e provas de conceito. O marco de fase é a aprovação da arquitetura e da linha-base de requisitos.

**Construção.** O foco é construir o produto por incrementos. A ER passa a operar por iteração: refinamento dos itens que entram na iteração, validação do que sai dela e atualização contínua do backlog e da rastreabilidade. O marco de fase é a capacidade operacional inicial do produto.

**Transição.** O foco é entregar o produto ao usuário. A ER se volta à homologação com o cliente, à coleta de feedback de uso real e à consolidação dos requisitos remanescentes para evolução futura.

A tabela a seguir apresenta o mapeamento das atividades da ER, suas práticas e técnicas, a partir das fases do OpenUP.

| Fases do OpenUP | Atividades da ER | Prática | Técnica | Resultados Esperados |
| --------------- | ---------------- | ------- | ------- | -------------------- |
| **Iniciação** | Elicitação e Descoberta | Levantamento inicial de necessidades | Entrevista com o cliente, brainstorming, análise de domínio de negócio, análise competitiva | Problema central compreendido, objetivos específicos (OE1–OE5) definidos e visão do produto acordada |
| | Análise e Consenso | Delimitação de escopo e identificação de riscos | Lista de riscos, análise de viabilidade, priorização MoSCoW preliminar | Escopo do MVP delimitado e riscos de requisitos registrados |
| | Declaração | Registro das necessidades em alto nível | Características de produto (CP) e valor de negócio (VN), glossário do domínio | CP1–CP6 declaradas e vocabulário do domínio unificado |
| | Representação | Modelagem do cenário atual | Rich Picture, diagrama de Ishikawa, mapa de stakeholders | Cenário, causas do problema e partes interessadas representados visualmente |
| | Verificação e Validação | Validação da visão com o cliente | Walkthrough da visão na reunião quinzenal | Visão do produto aprovada por Ciro Vargas, encerrando o marco da fase |
| | Organização e Atualização | Publicação versionada da documentação | Controle de versão em Git e histórico de revisão no GitPages | Documento de visão publicado e rastreável por versão |
| **Elaboração** | Elicitação e Descoberta | Detalhamento dos requisitos críticos | Entrevistas focadas, análise documental das APIs e do gateway, prova de conceito | Restrições técnicas identificadas e requisitos de custódia e de verificação de Elo esclarecidos |
| | Análise e Consenso | Priorização e definição do MVP | Priorização MoSCoW, matriz valor de negócio × esforço, negociação com o cliente | Backlog priorizado e conjunto de funcionalidades do MVP acordado |
| | Declaração | Especificação dos requisitos | Declaração padronizada de RF, classificação de RNF pelo modelo URPS+, historias de usuario, critérios de aceitação em BDD | Listas de RF e RNF declaradas e histórias de usuário com critérios de aceitação |
| | Representação | Modelagem e prototipação | Diagrama de casos de uso (UML), diagrama de atividades do fluxo de contratação, wireframes e protótipo navegável | Fluxo de contratação e telas principais representados e compreendidos pela equipe e pelo cliente |
| | Verificação e Validação | Inspeção e validação da linha-base | Inspeção com checklist, revisão por pares, validação por prototipação com o cliente | Requisitos verificados quanto a ambiguidade e testabilidade, e linha-base aprovada no marco da fase |
| | Organização e Atualização | Estabelecimento da rastreabilidade | Matriz de rastreabilidade (OE → CP → VN → RF → RNF), Definition of Ready (DoR) | Backlog rastreável e itens prontos para entrar em desenvolvimento |
| **Construção** | Elicitação e Descoberta | Refinamento por iteração | Entrevistas pontuais por WhatsApp, coleta de dúvidas sobre regras de negócio | Lacunas e ambiguidades resolvidas antes da implementação do incremento |
| | Declaração | Detalhamento dos itens da iteração | Critérios de aceitação em BDD, aplicação da DoR | Histórias da iteração prontas, com critérios claros e objetivos definidos |
| | Representação | Prototipação incremental | Wireframes e telas de alta fidelidade das funcionalidades da iteração | Interfaces definidas antes da codificação, reduzindo retrabalho de frontend |
| | Verificação e Validação | Validação do incremento com o cliente | Revisão dos critérios de aceitação, testes de aceitação, aplicação da DoD, demonstração quinzenal | Incremento verificado pela equipe e validado pelo cliente |
| | Análise e Consenso | Replanejamento de escopo | Renegociação de prioridades, reavaliação da lista de riscos | Prioridades ajustadas conforme o feedback e o andamento real do projeto |
| | Organização e Atualização | Manutenção do backlog e da rastreabilidade | Refinamento contínuo (DEEP), atualização da matriz de rastreabilidade e do histórico de revisão | Backlog atualizado, priorizado e coerente com o produto construído |
| **Transição** | Verificação e Validação | Homologação do produto | Testes de aceitação com o cliente e uso assistido com usuários dos dois perfis | Aceite formal do produto e confirmação de que os requisitos foram atendidos |
| | Elicitação e Descoberta | Coleta de feedback de uso real | Feedback dos usuários piloto, observação de uso assistido | Novas necessidades identificadas para evolução do produto |
| | Análise e Consenso | Definição do escopo remanescente | Priorização MoSCoW dos itens não entregues | Backlog remanescente priorizado para releases futuras |
| | Organização e Atualização | Consolidação da documentação | Atualização do documento no GitPages e registro das lições aprendidas | Documentação final publicada e alinhada ao produto entregue |


