# 5 Engenharia de Requisitos

Duas características do projeto orientaram esta definição. A primeira é a natureza do domínio: o mercado de coaching e duo remunerado tem vocabulário próprio e uma fronteira delicada entre o que a plataforma pretende oferecer (coaching e duo, com cada jogador em sua própria conta) e o que ela precisa excluir (boosting por compartilhamento de conta). A segunda é a concentração de risco em decisões estruturais — a custódia dos créditos até a validação bilateral da sessão e a verificação do Elo por meio de APIs de terceiros.

Para mitigar esses riscos e garantir que o produto atenda às necessidades reais de quem consome e de quem presta o serviço, as técnicas de descoberta e validação foram concentradas nas fases iniciais, envolvendo múltiplas perspectivas de usuários antes do desenvolvimento. Além disso, como adaptação ao processo OpenUP, a equipe incorporou o papel de Product Owner (PO), centralizando a gestão do backlog e a ponte de comunicação entre os desenvolvedores, o idealizador e os usuários finais.

---

## 5.1 Atividades e Técnicas de ER

### Elicitação e Descoberta

* **Entrevistas com o idealizador:** entrevistas conduzidas com Ciro Vargas por Google Meet e Discord, nas reuniões quinzenais, para levantar as regras de negócio da custódia de créditos, os critérios de validação bilateral da sessão, as políticas de repasse e a fronteira técnica entre coaching, duo e boosting.
* **Entrevistas com representantes dos usuários:** levantamento com Yan Guimarães, consumidor que joga LoL, e Victor Camara, prestador que já alcançou o nível Global no CS. Também foram mapeadas as necessidades voltadas à segurança e prevenção contra toxicidade. Suas contribuições cobrem as jornadas correspondentes de consumo e prestação e apoiam a descoberta de funcionalidades antes do desenvolvimento.
* **Brainstorming interno:** sessões realizadas nas reuniões internas da equipe para gerar alternativas de solução para problemas ainda em aberto, como o mecanismo de comprovação de que a sessão contratada foi efetivamente prestada e o formato da avaliação cruzada entre consumidor e prestador.
* **Análise documental:** leitura da documentação pública das APIs de jogos utilizadas para verificação de credenciais, dos termos de serviço das desenvolvedoras (que delimitam o que a plataforma pode oferecer) e da documentação do gateway de pagamento com split, para identificar restrições que se tornam requisitos.
* **Análise competitiva (benchmarking):** exame das soluções já mapeadas na seção 2.5 — Metafy, ProGuides, E-Pal, LFCarry e Fiverr — para descobrir funcionalidades esperadas pelo mercado e identificar as lacunas que o GameDuo pretende preencher.

### Análise e Consenso

* **Priorização MoSCoW:** classificação dos requisitos em *Must have*, *Should have*, *Could have* e *Won't have*, em conjunto com os stakeholders (idealizador e representantes de usuários), para delimitar o MVP em torno da proposta de valor central — encontrar um prestador confiável, contratar uma sessão e concluir a transação com segurança.
* **Matriz valor de negócio × esforço:** avaliação de cada item quanto ao valor de negócio para os diferentes perfis de usuários e ao esforço técnico de implementação, gerando um índice de prioridade que apoia a decisão sobre o que entra no MVP.
* **Lista de Riscos de Requisitos:** registro e reavaliação periódica dos riscos de requisitos — dependência de APIs externas e mudanças nos termos de serviço das desenvolvedoras.
* **Negociação e consenso:** quando o esforço estimado de um requisito não se sustenta no prazo disponível, a equipe apresenta alternativas de escopo reduzido, e a decisão é registrada como acordo formal na documentação da reunião.

### Declaração de Requisitos

* **Declaração padronizada de requisitos funcionais:** cada RF é escrito no formato "verbo no infinitivo + objeto + complemento", com identificador único.
* **Classificação de requisitos não funcionais pelo modelo URPS+:** os RNFs são declarados e classificados em usabilidade, confiabilidade, desempenho, suportabilidade e restrições de projeto, incluindo as exigências de conformidade com a LGPD e a restrição de implementação.
* **Histórias de Usuário:** os requisitos funcionais são derivados em histórias de usuário. Os perfis refletem os atores da plataforma: consumidor, prestador, administrador e moderador, garantindo o foco no valor entregue a cada persona.
* **Critérios de aceitação em listas (tópicos):** para evitar ambiguidades sem forçar frameworks complexos que exigem construção compartilhada de cenários, cada história de usuário recebe critérios de aceitação estruturados em tópicos (bullet points). Estes critérios estabelecem as condições exatas e lógicas (ex: para liberação do repasse) que o requisito deve satisfazer.

### Representação de Requisitos e do Contexto

A representação é dividida em duas categorias: modelagem do contexto e modelagem da solução (requisitos em si).

* **Representação do Contexto (Apoio à ER):**
* **Rich Picture e Diagrama de Ishikawa:** representação do cenário atual, atores e causas raízes do problema central. Estes artefatos apoiam a compreensão e a elicitação, mas não constituem a representação de requisitos de software.


* **Representação de Requisitos (A Solução):**
* **Diagramas de Casos de Uso e Fluxos:** modelagem lógica das jornadas de consumo, prestação e administração.
* **Protótipos de baixa e alta fidelidade:** wireframes para validar a estrutura das telas e protótipos navegáveis no Figma para validar visualmente as interfaces antes da implementação.



### Verificação e Validação (V&V)

Nesta seção, diferencia-se a V&V dos requisitos (qualidade do artefato de ER) da V&V do incremento (testes do software já construído):

* **Verificação da Qualidade dos Requisitos:**
* **Inspeção com checklist:** revisão de cada requisito quanto a completude, ausência de ambiguidade, consistência e testabilidade, conduzida pelo Analista de Requisitos.
* **Cobertura e Rastreabilidade (Matriz):** verificação contínua de que todo requisito funcional e não funcional tem origem justificada e rastreável até os Objetivos Específicos (OE) e Características de Produto (CP).


* **Validação de Requisitos com Stakeholders (Antecipada):**
* **Validação por prototipação:** sessões de apresentação dos protótipos a Ciro (nas reuniões quinzenais) e aos representantes Yan e Victor, antes da implementação e quando houver alterações relevantes nos fluxos. As observações são registradas para ajuste, mantendo o aceite formal com Ciro.


* **Validação do Incremento (Testes de Software):**
* **Verificação de critérios e testes de aceitação:** durante a fase de Construção, o Analista de Qualidade aplica as métricas de *Definition of Done (DoD)* para assegurar que o software entregue satisfaz rigorosamente a lista de critérios de aceitação definidos para cada história.



### Organização e Atualização de Requisitos

* **Gestão do Product Backlog:** artefato central priorizado pelo Product Owner, associando os itens de trabalho às iterações de cada fase do projeto.
* **Refinamento contínuo (DEEP):** revisão periódica para manter o backlog Detalhado na medida certa, Emergente, Estimável e Priorizado.
* **Controle de versão e documentação:** todo o conteúdo é versionado em Git e publicado no GitPages, permitindo reconstituir quando e por que um requisito mudou, e mantendo a matriz de rastreabilidade atualizada.

---

## 5.2 Engenharia de Requisitos e o OpenUP

O OpenUP organiza o desenvolvimento em quatro fases. As atividades da ER se distribuem por todas elas, mudando de ênfase conforme o objetivo da fase.

Como adaptação deliberada dos papéis do OpenUP, conforme a Seção 4.1, **Pedro atua como Product Owner** ao longo dessas fases: consolida as propostas da equipe e o feedback de Ciro, Yan e Victor; organiza e prioriza o backlog segundo o valor de negócio acordado; e verifica preliminarmente as entregas com o Analista de Qualidade. O Analista de Requisitos conduz a elicitação e mantém a rastreabilidade, enquanto o Gerente de Projeto coordena a comunicação e o cronograma. Yan e Victor validam a adequação às necessidades de seus perfis; Ciro também avalia os fluxos administrativos e de moderação e mantém a decisão final sobre prioridades, regras de negócio e aceite formal.

**Iniciação.** O foco é entender o problema, delimitar o escopo e alcançar consenso sobre a visão. A ER realiza elicitação ampla com consumidores (Yan), prestadores (Victor) e o idealizador (Ciro). O marco de fase é o acordo sobre a Visão do Produto.

**Elaboração.** O foco é reduzir risco e fechar o escopo. A ER estrutura e estabiliza os requisitos (especialmente as integrações críticas) e os valida visualmente (protótipos) com os usuários e o idealizador de forma antecipada. O marco de fase é a estabilização da arquitetura e da linha-base de requisitos (MVP).

**Construção.** O foco é construir o produto por incrementos e refinar. A ER opera por iteração: o PO refina o backlog detalhando critérios de aceitação em listas, aplica a *Definition of Ready (DoR)*, e o time valida o incremento gerado através dos testes de aceitação do software.

**Transição.** O foco é entregar o produto ao usuário. A ER se volta à homologação final com o cliente e à coleta de feedback de uso real (testes Beta) para consolidar os requisitos remanescentes para evolução futura.

A tabela a seguir apresenta o mapeamento das atividades da ER a partir das fases do OpenUP.

| Fases do OpenUP | Atividades da ER | Prática / Técnica | Resultados Esperados |
| --- | --- | --- | --- |
| **Iniciação** | Elicitação e Descoberta | Entrevistas com Ciro (idealizador), Yan (consumidor) e Victor (prestador); Análise documental. | Dores e regras reais mapeadas, abrangendo custódia, usabilidade e segurança. |
|  | Análise, Consenso e Validação | Priorização MoSCoW, Validação da Visão com usuários. | Visão do produto validada e escopo inicial (MVP) delimitado. |
|  | Representação do Contexto | Rich Picture, Diagrama de Ishikawa. | Causas do problema e ecossistema compreendidos de forma visual. |
| **Elaboração** | Declaração e Representação | Histórias de Usuário (com critérios em tópicos), Protótipos navegáveis (Figma) e Diagramas. | Requisitos críticos documentados e fluxos visuais representados para validação. |
|  | Verificação e Validação | Validação antecipada de protótipos com Ciro, Yan e Victor; Inspeção de requisitos por checklist. | Requisitos sem ambiguidade e fluxos de interface validados antes da codificação. |
|  | Organização | Construção da matriz de rastreabilidade (OE → CP → RF/RNF). | Linha-base estruturada e pronta para o desenvolvimento seguro. |
| **Construção** | Refinamento e Organização | Refinamento contínuo (DEEP) pelo PO, aplicação da *Definition of Ready (DoR)*. | Backlog do produto priorizado e Histórias da Sprint com critérios claros. |
|  | Validação do Incremento | Testes de aceitação do software baseados na lista de critérios e na *Definition of Done (DoD)*. | Funcionalidades desenvolvidas, testadas e avaliadas nos ciclos incrementais. |
| **Transição** | Elicitação / Descoberta | Coleta de feedback em ambiente de homologação (uso assistido com usuários). | Identificação de novas necessidades ou melhorias de usabilidade para evolução. |
|  | Análise e Organização | Repriorização do Backlog remanescente (*Won't have* / *Could have*). | Escopo organizado e documentado para releases futuras da plataforma. |