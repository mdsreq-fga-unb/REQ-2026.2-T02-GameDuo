

# 7 Interação entre Equipe e Cliente

##  7.1 Composição da Equipe

A equipe responsável pelo desenvolvimento do GameDuo é composta por cinco integrantes, que acumulam mais de um papel ao longo do projeto. A tabela a seguir apresenta os papéis definidos, suas responsabilidades e os membros alocados em cada um.

| Papel | Descrição | Líder  | Demais participantes |
| --- | --- | --- | --- |
| **Gerente de Projeto** | Coordena o projeto, conduz a comunicação entre a equipe e o cliente, acompanha o cronograma e o andamento das entregas previstas para cada Unidade da disciplina. | Ricardo | — |
| **Product Owner** | Representa a visão do produto junto à equipe, mantém e prioriza o backlog e valida se as entregas atendem aos objetivos específicos definidos para a solução. | Pedro | — |
| **Analista de Requisitos** | Conduz a elicitação, a análise, a declaração e a validação dos requisitos junto ao cliente, mantendo a rastreabilidade entre objetivos, características de produto e requisitos. | Pedro |  Ricardo, Rodrigo, Guilherme, Paulo |
| **Analista de Qualidade (QA)** | Garante a qualidade do produto por meio da verificação dos critérios de aceitação, da execução de testes funcionais e da aplicação da Definition of Done. | Ricardo | — |
| **Desenvolvimento Frontend** | Responsável pela construção das interfaces da plataforma e pela implementação das funcionalidades no lado do cliente. | Rodrigo | Pedro, Guilherme |
| **Desenvolvimento Backend** | Responsável pela lógica de negócio, pelos serviços da aplicação e pelas integrações externas, incluindo meios de pagamento e verificação de credenciais. | Guilherme | Paulo, Rodrigo |
| **Banco de Dados** | Responsável pela modelagem, pela implementação e pela manutenção da base de dados que sustenta o catálogo de prestadores, as sessões contratadas e as transações. | Ricardo | Paulo |




!!! note "Sobre a atuação em múltiplos papéis"
    A atividade de Engenharia de Requisitos é conduzida por todos os integrantes, de modo que a equipe compartilhe o entendimento do domínio e das necessidades do cliente. Os papéis de desenvolvimento contam com um líder técnico responsável por coordenar as decisões de sua frente e por integrar o trabalho às demais.



## 7.2 Comunicação

Ferramentas de comunicação:

- Whatsapp: Comunicação entre a equipe e da equipe entre o cliente, com foco em conversas pontuais

- Meet/Discord: Comunicação entre a equipe para resolver questões pendentes previstas, e para comunicar com o cliente no período de reunião

- Git Pages: Guardar o backlog do projeto como um todo, desde o documento inicial, até reuniões chave com o cliente e documentações de reunião importantes.

Métodos e frequências de reunião:

- Reunião a cada 15 dias: Revisar o progresso do produto com o cliente, e ver aonde pode ter melhorias

- Reunião da equipe: Reuniões segundas e quartas as 20:30, para definição de projetos. Reuniões terças e quintas logo após as aulas, para decisões rápidas.

Frequência de comunicação com o cliente:

- Reunião quinzenal: a reunião será diretamente dos participantes da equipe de desenvolvimento e o cliente, para validação

- Whatsapp: será usado pontualmente para tirar dúvidas rápidas.

## 7.3 Processos de Validação

A validação do GameDuo será contínua, antes, durante e após a implementação de cada incremento, conforme as atividades de Engenharia de Requisitos descritas na [Seção 5](engenharia-requisitos.md). Os momentos de validação acompanharão as fases e iterações do OpenUP: alinhamento da visão na Iniciação, avaliação dos requisitos e redução de riscos na Elaboração, avaliação dos incrementos na Construção e homologação na Transição. A revisão de requisitos, a prototipação e a coleta de feedback serão retomadas sempre que surgirem dúvidas ou mudanças, sem aguardar a conclusão de um módulo inteiro.

### Alinhamento da visão do produto

Na Iniciação, a equipe realizará um **walkthrough da visão do produto** com Ciro Vargas: uma revisão orientada do problema, dos objetivos, das características da solução e do escopo, registrando concordâncias, dúvidas e ajustes necessários.

### Verificação dos requisitos e preparação para desenvolvimento

Na Elaboração e no refinamento de cada iteração, os requisitos passarão por **inspeção com checklist e revisão por pares**, verificando clareza, completude, consistência, viabilidade e testabilidade. As histórias de usuário deverão estar vinculadas aos requisitos e possuir critérios de aceitação em formato Dado/Quando/Então. A **Definition of Ready (DoR)** será aplicada antes de iniciar o desenvolvimento, verificando se o item está suficientemente definido, com critérios de aceitação estabelecidos e dependências ou impedimentos relevantes resolvidos.

### Validação das jornadas e redução dos riscos técnicos

Na Elaboração e sempre que uma alteração de fluxo exigir nova avaliação, os fluxos serão validados com **wireframes e protótipos navegáveis no Figma**, envolvendo o cliente e representantes dos dois perfis de usuários: consumidores e prestadores de coaching e duo. Os participantes percorrerão tarefas como encontrar um serviço, avaliar o perfil de um prestador, contratar uma sessão e informar sua conclusão ou uma divergência. Serão observadas a compreensão das informações, as dificuldades de navegação e a adequação das regras às necessidades de cada perfil, permitindo ajustes antes da codificação.

As hipóteses técnicas de maior risco serão avaliadas por **provas de conceito**, especialmente a consulta de Elo por API oficial, quando disponível, e a retenção e o repasse de créditos pelo gateway de pagamento. Os resultados e as limitações encontrados serão registrados e usados para revisar os requisitos e a arquitetura antes da implementação das funcionalidades dependentes.

### Verificação e validação a cada iteração

Durante a Construção, cada incremento passará por revisão da equipe e testes unitários, de integração e de aceitação aplicáveis às histórias implementadas. A **Definition of Done (DoD)** orientará a verificação de conclusão, considerando o atendimento aos requisitos funcionais e não funcionais envolvidos, aos critérios de aceitação, à revisão do código e à atualização da documentação e dos testes.

O Analista de Qualidade verificará os resultados com apoio dos desenvolvedores. No fluxo de conclusão da sessão, por exemplo, os testes deverão conferir o repasse após a confirmação de ambas as partes e o tratamento de divergências conforme as regras acordadas com o cliente. Regras ainda indefinidas deverão retornar ao refinamento, sem serem consideradas atendidas. Falhas identificadas serão registradas e corrigidas antes de o item ser considerado concluído.

Ao final de cada iteração de Construção, nas reuniões quinzenais previstas na Seção 7.2, a equipe demonstrará o incremento verificado a Ciro Vargas. O cliente avaliará os fluxos com base nos critérios de aceitação definidos antes do desenvolvimento, registrando o resultado da validação e os ajustes necessários. Essas demonstrações permitirão revisar entregas parciais e orientar a próxima iteração.

Consumidores e prestadores também participarão da avaliação dos incrementos relacionados às suas jornadas, por meio de execução de tarefas e coleta de feedback, dando continuidade à validação iniciada com os protótipos. A seleção dos participantes e o agendamento das sessões com usuários serão acordados pela equipe com o cliente, tanto para os protótipos quanto para os incrementos e a homologação.

### Homologação do produto

Na Transição, serão realizados testes de aceitação com o cliente e uso assistido com representantes dos dois perfis, avaliando a jornada integrada de oferta, busca, contratação e conclusão de uma sessão, incluindo o tratamento de disputas. Os resultados serão confrontados com os requisitos e critérios de aceitação do escopo acordado. O registro da homologação reunirá as evidências dos testes, o resultado da avaliação do cliente e as pendências identificadas, com os encaminhamentos acordados para correção ou evolução futura.

### Registro e acompanhamento do feedback

Em todos os momentos de validação, o **feedback será registrado e rastreado** em atas e itens de trabalho no GitHub, indicando data, participante ou perfil, artefato e versão avaliados, requisito ou história relacionada, observação, encaminhamento, responsável pelo acompanhamento e situação. Os ajustes serão vinculados ao backlog e à matriz de rastreabilidade, com atualização do histórico de revisão. Cada pendência será acompanhada até sua correção e nova validação, ou até o registro de uma decisão justificada sobre seu tratamento.
