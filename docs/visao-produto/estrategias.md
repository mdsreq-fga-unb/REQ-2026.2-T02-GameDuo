# 4 Estratégias de Engenharia de Software

A partir das informações apresentadas nas seções [Cenário Atual do Cliente e do Negócio](cenario-atual.md) e [Solução Proposta](solucao-proposta.md), foram tomadas as decisões referentes às estratégias de engenharia de software a serem adotadas na construção do GameDuo.

## 4.1 Estratégia Priorizada

**Abordagem de Desenvolvimento de Software: Ágil.**
A abordagem ágil guiará o desenvolvimento do produto, permitindo flexibilidade, adaptação a mudanças e foco na entrega contínua de valor para os dois lados da plataforma — jogadores que buscam evolução técnica e prestadores que desejam rentabilizar seu conhecimento.

**Ciclo de vida: Iterativo e Incremental.**
O ciclo iterativo e incremental permitirá construir a plataforma gradualmente, com validação a cada etapa das funcionalidades críticas, como a verificação de credenciais (Elo) e a custódia dos créditos até a validação bilateral da sessão.

**Processo de Engenharia de Software: OpenUP.**
Processo de desenvolvimento adotado para a construção do produto, por organizar o trabalho em fases com marcos de decisão claros e por tratar a redução de risco arquitetural como atividade explícita das etapas iniciais.

## 4.2 Quadro Comparativo

O quadro a seguir compara dois processos de desenvolvimento que poderiam ser adotados no GameDuo:

| Características | OpenUP | Kanban |
| --- | --- | --- |
| **Abordagem geral** | Iterativo e incremental, ancorado em uma arquitetura estabelecida nas fases iniciais. | Fluxo contínuo de trabalho, com foco em visualizar o processo, limitar o trabalho em progresso e otimizar o tempo de atravessamento. |
| **Estrutura de processos** | Fases delimitadas (Iniciação, Elaboração, Construção, Transição), com marcos de decisão ao final de cada uma. | Sem fases ou iterações prescritas: o trabalho é puxado conforme a capacidade da equipe, o que permite entregas contínuas e responde bem a demandas de chegada irregular. |
| **Complexidade do processo** | Mais prescritivo: define papéis, disciplinas, artefatos e marcos, exigindo que a equipe compreenda a estrutura antes de operá-la. | Deliberadamente simples em sua formulação: começa a partir do processo já praticado e evolui por melhoria incremental. A simplicidade das regras, porém, transfere para a equipe a responsabilidade de estabelecer as políticas que farão o método funcionar. |
| **Foco em arquitetura** | Trata a arquitetura como risco a ser reduzido cedo, com protótipos executáveis já na fase de Elaboração. | Neutro quanto à arquitetura: por ser um método de gestão de fluxo, opera sobre o processo de trabalho existente e deixa as decisões técnicas a critério da equipe. |
| **Práticas de desenvolvimento** | Prescreve práticas ao longo das disciplinas: casos de uso, prototipação arquitetural, desenvolvimento orientado a testes e integração contínua entre as iterações. | Não prescreve práticas de construção. As práticas técnicas adotadas são escolha da equipe e podem ser incorporadas às políticas de cada etapa do quadro. |
| **Flexibilidade de requisitos** | Flexível dentro das iterações, embora mudanças estruturais após a Elaboração tenham custo maior. | Flexibilidade máxima: a prioridade da fila pode ser alterada a qualquer momento, sem esperar o encerramento de um ciclo. |
| **Colaboração com o cliente** | Envolvimento contínuo, com pontos formais de validação nos marcos de cada fase. | Não prescreve eventos de validação; a cadência de interação com o cliente é definida livremente pela equipe, conforme a natureza do fluxo. |
| **Qualidade técnica** | Assegurada pela definição arquitetural prévia e pelas revisões a cada marco de fase. | Assegurada pelos critérios de passagem entre as etapas do quadro e pela redução de WIP, que diminui troca de contexto e retrabalho. |
| **Controle de qualidade** | Exercido por verificações previstas no próprio processo: revisão de artefatos, avaliação de iteração e decisão de continuidade nos marcos de fase. | Exercido pelas políticas explícitas de cada coluna e pelo acompanhamento das métricas de fluxo, que expõem gargalos e itens bloqueados assim que surgem. |
| **Documentação** | Documentação formal por fase, com ênfase em requisitos e arquitetura. | Documentação enxuta, centrada na política explícita de cada etapa e nas métricas de fluxo (lead time, throughput, diagrama de fluxo cumulativo). |
| **Escalabilidade** | Escala por meio da estrutura de fases e da definição formal de papéis, o que facilita coordenar equipes maiores e distribuídas. | Escala por meio do encadeamento de quadros e da gestão de filas entre times, sendo particularmente eficaz quando há dependências entre equipes que operam em fluxo contínuo. |
| **Suporte à equipe** | Papéis e responsabilidades definidos, com controle de progresso mais formal. | Não define papéis nem altera a estrutura existente — parte do princípio de melhoria evolutiva sobre o processo já praticado pela equipe. |
| **Adaptação ao projeto GameDuo** | Adequado a um produto novo cujos maiores riscos são estruturais (custódia de créditos, meios de pagamento, integração com APIs de terceiros) e que precisa de marcos de validação claros dentro de um semestre letivo. | Mais indicado a contextos de fluxo contínuo e demanda recorrente — sustentação, manutenção evolutiva ou operação de um produto já existente — situação distinta da construção inicial do GameDuo. |

## 4.3 Justificativa

A escolha do OpenUP não decorre de qualquer limitação do Kanban como método, mas do ajuste entre cada processo e as condições concretas em que o GameDuo será desenvolvido.

**Natureza do trabalho a ser realizado.**
O Kanban foi concebido para gerir fluxo de demanda que chega continuamente e cuja prioridade muda ao longo do tempo. O GameDuo, nesta etapa, é a construção inicial de um produto cujo escopo já está delimitado pelos objetivos específicos (OE1 a OE5). Não há um fluxo de demanda a ser otimizado — há um produto a ser estruturado do zero, com uma sequência de decisões que precisam ser tomadas em ordem.

**Ausência de histórico para calibrar o método.**
O valor do Kanban cresce à medida que a equipe acumula dados de fluxo: limites de trabalho em progresso ajustados à capacidade real, lead time medido e gargalos identificados por observação. Uma equipe recém-formada, atuando por um único semestre, não gera histórico suficiente para acionar esses mecanismos. Os principais instrumentos do método permaneceriam subaproveitados.

**Risco concentrado em decisões estruturais.**
A custódia dos créditos até a validação bilateral da sessão e a verificação de Elo por meio de APIs de terceiros são decisões caras de reverter depois de implementadas. O OpenUP endereça esse ponto diretamente: a fase de Elaboração existe para reduzir risco arquitetural por meio de protótipos executáveis antes que a Construção avance. O Kanban não trata dessa dimensão — não por deficiência, mas porque não é o problema que se propõe a resolver.

**Necessidade de marcos alinhados à disciplina.**
As entregas do projeto seguem as Unidades da disciplina, com datas fixas e artefatos definidos. Os marcos de fase do OpenUP se encaixam nessa estrutura e oferecem pontos naturais de validação com o cliente. O Kanban, por não prescrever cadência, exigiria que a equipe construísse do zero seus próprios pontos de sincronização com o cronograma e com o stakeholder.

**Acesso ao cliente e capacidade de validação.**
Ciro Vargas é pessoa física, idealizador do produto e único tomador de decisão, acessível por WhatsApp, Discord e Google Meet. Sua disponibilidade viabiliza os momentos de validação previstos nos marcos do OpenUP, sem a rigidez de uma cadeia de aprovação corporativa e sem depender de uma cadência que a equipe precisaria definir por conta própria.

---


