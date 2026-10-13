# 9. DoR e DoD

---

O DoR e o DoD são as listas de conferência aplicadas a cada item do [backlog de produto](backlog-produto.md). O DoR indica quando um item pode entrar em uma iteração e o DoD indica quando ele pode ser apresentado ao Ciro. Os dois seguem o OpenUP, adotado na [seção 4](estrategias.md), e fazem parte das práticas de verificação e validação da [seção 5](engenharia-requisitos.md).

---

## 9.1 Definition of Ready (DoR)

Um item só entra em uma iteração da fase de Construção quando atende a todos os critérios abaixo. Se faltar algum, ele volta para o refinamento do backlog.

| Critério | Como é verificado |
| -------- | ----------------- |
| O item tem objetivo, dados de entrada e resultado esperado descritos. | Os três pontos estão preenchidos na task. Perguntas que dependem do Ciro são levadas à reunião de validação e a resposta é anotada nas evidências da iteração. |
| Os integrantes concordam com o que o item deve cobrir. | O escopo é discutido na reunião de planejamento da iteração. O que fica de fora é anotado na task. |
| As regras de negócio do item estão identificadas. | As regras da [seção 13](regras-negocio.md) que se aplicam ao item estão listadas na task, e nenhuma aguarda decisão do Ciro. |
| O item tem critérios de aceitação escritos. | Cada critério descreve uma ação e o resultado esperado, que pode ser marcado como atendido ou não atendido. Os critérios cobrem o fluxo principal e as exceções e servem de base para os testes de aceitação do DoD. Palavras como "rápido", "fácil" ou "intuitivo" não são usadas. |
| Os requisitos não funcionais do item estão identificados. | Os RNFs da [seção 8](requisitos-software.md) que afetam o item estão listados na task. |
| O item faz parte do escopo priorizado. | O item consta no MVP da [seção 10](backlog-produto.md), ou o Ciro aprovou a sua inclusão e a decisão está registrada nas evidências. |
| As telas do item estão no protótipo. | As telas estão no Figma e foram revisadas por pelo menos dois integrantes. Itens sem tela têm os dados de entrada e saída descritos na task. |
| O Ciro validou o entendimento do item. | O Ciro confirmou o que o item deve fazer e que ele atende à necessidade de consumidores e prestadores, em reunião ou por mensagem, com registro nas evidências. |
| O item cabe em uma iteração. | A estimativa de esforço do backlog cabe na duração da iteração. Itens maiores são divididos antes de entrar. |
| As dependências do item estão resolvidas. | Os itens dos quais ele depende já foram concluídos ou estão planejados antes dele, na mesma iteração. |
| O responsável e o revisor estão definidos. | A task tem um responsável pela implementação e um revisor atribuídos, e o revisor não é quem implementa. |

---

## 9.2 Definition of Done (DoD)

Um item só é apresentado ao Ciro na demonstração do incremento quando atende a todos os critérios abaixo. Se algum critério de aceitação não for atendido, o item continua em andamento.

| Critério | Como é verificado |
| -------- | ----------------- |
| O código está integrado à branch principal. | O merge foi feito e a funcionalidade roda no ambiente usado na demonstração da iteração. |
| Todos os critérios de aceitação foram atendidos. | Cada critério escrito no DoR foi conferido e marcado como atendido. |
| A implementação segue as regras de negócio e o protótipo. | As regras listadas na task foram implementadas e as telas correspondem ao Figma. Se houver diferença, o código é corrigido ou o protótipo é atualizado e validado de novo com o Ciro. |
| Os testes de aceitação foram aprovados. | O Analista de Qualidade executou os testes do fluxo principal e das exceções e anotou o resultado nas evidências da iteração. |
| O saldo continua correto em operações repetidas ou simultâneas. | Repetir a mesma operação não gera lançamento duplicado, duas operações ao mesmo tempo sobre o mesmo saldo não geram diferença, e o saldo exibido é igual à soma dos lançamentos. |
| As falhas de serviços externos e os pedidos simultâneos são tratados. | Com o serviço de pagamento indisponível, a operação não fica pela metade e o usuário recebe um aviso. Dois pedidos para o mesmo horário não geram duas contratações. |
| O acesso respeita o perfil do usuário. | Consumidor, prestador e administrador acessam apenas as telas e rotas permitidas ao seu perfil, e os dados pessoais de um usuário não aparecem para outro fora do fluxo previsto. |
| A interface atende aos critérios de usabilidade. | As telas autenticadas mostram o usuário e o seu perfil, e ações como cancelar uma contratação ou encerrar uma oferta pedem confirmação. |
| O item foi revisado. | O revisor, que não é quem implementou, aprovou o código e a parte visual, e não há defeito de severidade alta ou crítica em aberto. |
| O Ciro aprovou o item. | A funcionalidade foi demonstrada na reunião de fim da iteração, e o aceite ou os ajustes pedidos estão anotados nas evidências. |
| A documentação está atualizada. | A situação do item no backlog, as evidências da iteração e o histórico de revisão estão atualizados no GitPages. |

---

## 9.3 Uso nas tasks

Ao criar a task de um item do backlog, as duas listas abaixo são copiadas para a descrição dela. O DoR é marcado no planejamento da iteração e o DoD é marcado durante o desenvolvimento, até o fechamento do item.

<div class="grid cards gd-checklist" markdown>

-   **Checklist do DoR**

    ---

    - [ ] Objetivo, entradas e resultado esperado descritos
    - [ ] Escopo acordado entre os integrantes
    - [ ] Regras de negócio listadas
    - [ ] Critérios de aceitação escritos
    - [ ] RNFs listados
    - [ ] Item no escopo priorizado
    - [ ] Telas no protótipo
    - [ ] Entendimento validado pelo Ciro
    - [ ] Item cabe em uma iteração
    - [ ] Dependências resolvidas
    - [ ] Responsável e revisor definidos

-   **Checklist do DoD**

    ---

    - [ ] Código integrado à branch principal
    - [ ] Critérios de aceitação atendidos
    - [ ] Regras de negócio e protótipo seguidos
    - [ ] Testes de aceitação aprovados
    - [ ] Saldo correto em operações repetidas ou simultâneas, se aplicável
    - [ ] Falhas e pedidos simultâneos tratados
    - [ ] Acesso por perfil respeitado
    - [ ] Critérios de usabilidade atendidos
    - [ ] Revisão aprovada
    - [ ] Item aprovado pelo Ciro
    - [ ] Documentação atualizada

</div>
