# 4 Estratégias de Engenharia de Software

A partir das informações apresentadas nas seções Cenário Atual do Cliente e do Negócio e Solução Proposta, foram tomadas as decisões referentes às estratégias de engenharia de software a serem adotadas na construção do GameDuo.

## 4.1 Estratégia Priorizada

**Abordagem de Desenvolvimento de Software: Ágil.**
A abordagem ágil guiará o desenvolvimento do produto, permitindo flexibilidade, adaptação a mudanças e foco na entrega contínua de valor para os dois lados da plataforma: jogadores que buscam evolução técnica e prestadores que desejam rentabilizar seu conhecimento.

**Ciclo de vida: Iterativo e Incremental.**
O ciclo iterativo e incremental permitirá construir a plataforma gradualmente, com validação a cada etapa das funcionalidades críticas, como a verificação de credenciais (Elo) e a custódia dos créditos até a validação bilateral da sessão.

**Processo de Engenharia de Software: OpenUP.**
Processo de desenvolvimento adotado para a construção do produto, por organizar o trabalho em fases com marcos de decisão claros e por tratar a redução de risco arquitetural como atividade explícita das etapas iniciais.

## 4.2 Quadro Comparativo

O quadro a seguir compara o OpenUP com o Rapid Application Development (RAD), dois processos de desenvolvimento de software iterativos e adaptativos que poderiam ser adotados na construção do GameDuo.

| Características | OpenUP | RAD |
| --- | --- | --- |
| **Abordagem Geral** | Iterativo e incremental, com fases, papéis e artefatos definidos, mantendo agilidade moderada. | Iterativo, com forte foco em prototipação rápida e ciclos curtos de validação com o usuário. |
| **Foco Principal** | Equilibrar requisitos, arquitetura e entregas incrementais, reduzindo risco a cada iteração. | Acelerar a entrega de versões funcionais para validação contínua. |
| **Estrutura do Processo** | Quatro fases (Iniciação, Elaboração, Construção e Transição), cada uma com iterações internas e encerrada por um marco de decisão. | Quatro fases (planejamento de requisitos, design do usuário, construção e cutover), com o workshop de design do usuário no centro do processo. |
| **Foco em Arquitetura** | Trata a arquitetura e os riscos técnicos de forma explícita já na Elaboração, antes que a Construção avance. | Prioriza a velocidade e pode postergar decisões arquiteturais, com risco de concentrar a atenção no que é visível na interface. |
| **Tratamento dos Requisitos** | Casos de uso leves ou histórias de usuário, detalhados progressivamente, começando pelos de maior risco ou prioridade. | Requisitos de alto nível no início, detalhados durante a prototipação. Os protótipos servem ao mesmo tempo como especificação e como validação. |
| **Práticas de Desenvolvimento** | Não define práticas de construção. Práticas como testes automatizados e integração contínua podem ser incorporadas, mas precisam ser adotadas pela equipe de forma explícita. | Também não define práticas de construção. Depende de ferramentas de prototipação e de frameworks de desenvolvimento rápido para sustentar o ritmo. |
| **Documentação** | Enxuta, limitada a um conjunto mínimo de artefatos como visão, lista de requisitos e casos de uso simplificados, produzidos quando agregam valor ao projeto. | Mínima, concentrada em telas, fluxos de dados e modelo do banco de dados. |
| **Colaboração com o Cliente** | Pontos de validação definidos ao final de cada iteração e nos marcos de fase. | Depende de participação frequente e contínua do cliente nos workshops de prototipação. |
| **Flexibilidade de Requisitos** | Os requisitos evoluem a cada iteração conforme risco e valor. Mudanças estruturais após a Elaboração têm custo maior. | Alta flexibilidade, com requisitos que emergem do feedback sobre os protótipos. |
| **Qualidade Técnica** | Não é garantida pelo processo. As fases e os marcos organizam as decisões, mas a qualidade depende das práticas, dos critérios e dos testes que a equipe adotar. | Também não é garantida pelo processo. O feedback rápido ajuda a detectar falhas de usabilidade, mas os requisitos não funcionais precisam de atenção deliberada. |
| **Controle de Qualidade** | Exercido por revisão de artefatos, demonstrações e decisão de continuidade nos marcos de fase. | Exercido pela avaliação dos protótipos a cada ciclo, dependendo da frequência com que o cliente valida. |
| **Perfil de Equipe** | Equipes pequenas e co-localizadas, tipicamente de três a dez pessoas. Oferece pouca orientação a equipes sem experiência prévia. | Equipes pequenas apoiadas por ferramentas de prototipação, com usuários disponíveis durante todo o projeto. |
| **Adequação ao Contexto do GameDuo** | Compatível com uma equipe de cinco integrantes, um cliente disponível a cada quinze dias e marcos que coincidem com as Unidades da disciplina. | Perde força, pois depende de cliente altamente disponível e prioriza a entrega das telas, que é onde o projeto concentra menos risco. |

## 4.3 Justificativa

A escolha do OpenUP não decorre de uma deficiência do RAD, mas do ajuste entre o que cada processo se propõe a resolver e as condições em que o GameDuo será desenvolvido.

**Onde está o risco do produto.**
O RAD é eficaz quando os requisitos são difíceis de descrever, mas fáceis de visualizar, porque valida o sistema por meio de protótipos funcionais. Sua fraqueza conhecida é a tendência de concentrar atenção no que aparece na tela e deixar os aspectos não funcionais em segundo plano. O risco do GameDuo está justamente nesses aspectos: a custódia dos créditos até a validação bilateral da sessão, o split de pagamento e a verificação de Elo por meio de APIs de terceiros. São decisões estruturais, pouco visíveis na interface e caras de reverter depois de implementadas. O OpenUP trata esse tipo de risco na fase de Elaboração, que existe para reduzi-lo antes que a Construção avance.

**Disponibilidade do cliente.**
O RAD depende de participação intensa do cliente durante todo o processo, com os workshops de prototipação como núcleo do trabalho. O GameDuo tem um único tomador de decisão, Ciro Vargas, disponível em reuniões quinzenais por Google Meet ou Discord e para dúvidas pontuais por WhatsApp. Essa disponibilidade sustenta as revisões e demonstrações previstas no OpenUP, mas não sustentaria workshops contínuos.

**Ferramental disponível.**
O ritmo do RAD pressupõe ferramentas de prototipação e frameworks de desenvolvimento rápido. A construção do GameDuo foi definida sobre React, PHP e Supabase, sem plataforma de geração acelerada de aplicações. Adotar o RAD exigiria rever essa decisão ou operar o processo sem o apoio que o torna viável.

**Marcos alinhados ao calendário da disciplina.**
As entregas seguem as Unidades da disciplina, com datas fixas e artefatos definidos. Os marcos de fase do OpenUP se encaixam nessa estrutura e oferecem pontos naturais de validação com o cliente, conforme detalhado na seção 6. O RAD concentra a entrega final no cutover, o que daria menos pontos formais de verificação ao longo do semestre.

**A qualidade depende das práticas adotadas.**
Nenhum dos dois processos garante qualidade técnica por si. As fases e os marcos do OpenUP organizam as decisões e criam oportunidades de verificação, mas a qualidade vem das práticas que a equipe aplica de fato. Por isso elas estão declaradas na seção 5 e não são pressupostas aqui: inspeção com checklist, revisão por pares antes da validação com o cliente, critérios de aceitação em BDD, testes de aceitação conduzidos pelo Analista de Qualidade, validação por prototipação nas reuniões quinzenais e as definições de Pronto (DoR) e de Concluído (DoD) como portões de entrada e de saída de cada iteração.

**Limitação assumida.**
O OpenUP oferece pouca orientação a equipes sem experiência prévia, e esta é a primeira vez que a equipe o utiliza. A mitigação está nos papéis definidos na seção 7.1, nas reuniões internas previstas na seção 7.2 e na revisão por pares aplicada antes de cada validação com o cliente.

---
