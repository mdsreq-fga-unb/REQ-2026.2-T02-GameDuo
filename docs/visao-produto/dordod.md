# 9. DoR e DoD

---

A equipe GoHorse adota o **OpenUP**, no qual cada iteração se encerra com um ponto de validação com o cliente. O **Definition of Ready (DoR)** e o **Definition of Done (DoD)** são os portões de entrada e de saída dessas iterações, conforme definido na seção 4 — Estratégias de Engenharia de Software — e listados entre as técnicas de Verificação e Validação da seção 5.

Os dois acordos existem porque o GameDuo movimenta dinheiro de terceiros e media conflitos entre pessoas. Uma história mal definida não gera apenas retrabalho: pode gerar saldo divergente, repasse indevido ou exposição de dado pessoal. O DoR impede que a equipe comece a construir sobre ambiguidade; o DoD estabelece o patamar técnico, legal e financeiro abaixo do qual nada é apresentado ao cliente.

---

## 9.1 Definition of Ready (DoR)

O DoR é o acordo entre a equipe GoHorse e Ciro Vargas, atuando como Product Owner externo, que define quando uma História de Usuário está pronta para entrar em uma iteração da fase de Construção.

Se qualquer condição não for atendida, a história retorna ao refinamento contínuo do backlog e não é comprometida com a iteração.

### A história tem a informação necessária para ser trabalhada?

A história deve ser compreensível sem perguntas em aberto. Isso inclui as regras de negócio que a governam, os dados de entrada e saída, e as credenciais ou acessos externos de que depende — chave de API do jogo para a verificação de credencial, credenciais de sandbox do gateway para o fluxo de pagamento.

As dúvidas que dependem do cliente são levadas à reunião quinzenal com Ciro e a resposta fica registrada na página de evidências da iteração. Uma história cuja regra ainda depende de decisão do cliente não entra na iteração.

### O requisito está expresso como história de usuário?

A história segue o formato orientado a valor: *Como [consumidor, prestador ou administrador], quero [capacidade], para [benefício]*. O ator precisa ser um dos três perfis reais da plataforma, e o benefício precisa ser verificável — não basta repetir a funcionalidade com outras palavras.

### Os critérios de aceitação estão definidos em BDD?

Cada história traz critérios no formato **Dado / Quando / Então**, conforme a técnica de declaração adotada na seção 5. Os critérios devem cobrir o fluxo nominal e as exceções previstas, e são a base dos testes de aceitação executados no DoD.

São proibidos adjetivos vagos como "interface amigável", "resposta rápida" ou "fácil de usar". Um critério que não permite dizer objetivamente se passou ou falhou não é um critério de aceitação.

### A história está rastreada?

A história está vinculada na matriz de rastreabilidade seguindo a cadeia **OE → CP → VN → RF → RNF**, conforme a seção 8. Uma história que não se conecta a nenhum requisito funcional declarado é um indício de escopo não acordado e deve voltar para análise com o cliente antes de ser desenvolvida.

### A história está dentro do escopo priorizado?

A história pertence ao conjunto priorizado por MoSCoW e posicionado na matriz valor × esforço, conforme a seção 5. Itens fora desse conjunto só entram se Ciro os repriorizar formalmente, já que a decisão final sobre prioridade e escopo é dele.

### As regras financeiras estão explicitadas?

Quando a história movimenta créditos, é obrigatório declarar o comportamento esperado em **todos os caminhos**, não apenas no caminho feliz:

- o que acontece com o saldo na reserva de créditos (RF25);
- em que condição os valores retidos são liberados (RF26);
- como a divisão de receita é aplicada (RF27);
- qual é o comportamento do saque (RF28);
- o que ocorre quando a decisão de uma disputa determina devolução, liberação ou divisão parcial (RF40);
- e o que acontece se a operação falhar no meio.

Este é o critério mais específico do GameDuo. Uma história de pagamento sem o caminho de falha descrito não está pronta, porque o caminho de falha é justamente onde o saldo diverge.

### Os RNFs aplicáveis foram identificados?

A história identifica os requisitos não funcionais que a afetam. Os transversais, que valem de CP1 a CP7, são considerados por padrão: restrição de acesso (RNF02), proteção de dados pessoais (RNF07), clareza das mensagens de validação (RNF08), identificação do usuário logado (RNF10), consistência visual (RNF12) e responsividade (RNF16).

Os específicos são declarados caso a caso — integridade financeira (RNF13) em histórias de carteira, consistência da agenda (RNF09) em histórias de agendamento, auditabilidade (RNF03) em histórias administrativas.

### A história está representada no protótipo e validada?

As telas e os fluxos estão desenhados no protótipo navegável no Figma e revisados pela equipe. Quando a história afeta uma jornada de usuário, há evidência de validação com Ciro e, conforme o perfil envolvido, com Yan Guimarães (consumidor) ou Victor Camara (prestador).

Histórias puramente de backend, sem interface, estão dispensadas deste critério, mas devem ter o contrato de dados definido em seu lugar.

### A história cabe em uma iteração?

A história foi estimada pela equipe, conforme a característica *Estimated* do DEEP adotado na seção 5, e o esforço estimado cabe em uma única iteração. Histórias maiores são quebradas antes do desenvolvimento — uma história que atravessa duas iterações não produz incremento demonstrável ao fim da primeira.

### As dependências e os responsáveis estão definidos?

As dependências técnicas e funcionais estão resolvidas ou planejadas para a mesma iteração. As recorrentes no GameDuo são: autenticação (RF02) antes de agendar serviço (RF16); dados de recebimento cadastrados (RF05) antes de processar saque (RF28); registro do resultado da sessão (RF31) antes de liberar valores retidos (RF26).

Há pelo menos um implementador e um revisor definidos, e o revisor não é quem implementou.

---

## 9.2 Definition of Done (DoD)

O DoD é o acordo que evidencia a qualidade da história produzida: o que foi construído corresponde ao que foi especificado.

Uma história que não está *Done* não é apresentada a Ciro na demonstração do incremento nem submetida ao aceite formal.

### A história entrega um incremento do produto?

A funcionalidade está integrada à branch principal e disponível como incremento executável, utilizável na demonstração ao fim da iteração. Código que funciona apenas na máquina de quem desenvolveu não caracteriza incremento.

### Os critérios de aceitação foram atendidos?

Todos os critérios em BDD definidos no DoR foram satisfeitos e verificados pelo Analista de Qualidade. **Não há entrega parcial**: uma história com três critérios e dois atendidos permanece em andamento, não é dividida retroativamente para fechar a iteração.

### O desenvolvimento está completo?

A funcionalidade implementa as regras de negócio e todos os fluxos previstos, sem dependências pendentes, e é coerente com o protótipo navegável no Figma. Divergências entre a implementação e o protótipo são resolvidas antes do fechamento — ou o código se ajusta ao protótipo, ou o protótipo é atualizado e revalidado.

### Os testes foram executados e aprovados?

Os testes de aceitação derivados dos critérios em BDD foram executados pelo Analista de Qualidade, com resultado registrado nas evidências da iteração. As histórias que movimentam saldo exigem, além do fluxo nominal, a execução dos cenários de falha descritos no DoR.

### A integridade financeira foi preservada?

Atende ao **RNF13**, que exige saldos e lançamentos íntegros em operações simultâneas ou repetidas. Na prática, três verificações:

- o mesmo evento processado duas vezes não gera lançamento duplicado;
- duas operações concorrentes sobre o mesmo saldo não produzem resultado divergente;
- nenhum lançamento existente é apagado ou alterado — correções entram como novo lançamento de estorno, preservando o histórico.

Nenhuma história que movimenta créditos é considerada pronta sem essas três verificações registradas.

### As falhas de integração e de concorrência são tratadas?

Atende ao **RNF15**: diante de indisponibilidade da API do jogo ou do gateway de pagamento, o sistema mantém estado consistente e avisa o usuário, sem deixar a operação em situação indefinida.

Atende ao **RNF09**: solicitações simultâneas para o mesmo horário não geram conflito de agenda.

### As ações sensíveis geram registro auditável?

Atende ao **RNF03**. As alterações administrativas e as movimentações financeiras gravam quem executou, quando, qual valor e qual evidência, de forma recuperável. Isso cobre as decisões de moderação (RF39), a execução de decisão financeira (RF40), a aplicação de sanção (RF41) e a configuração de comissões (RF47) e de penalidades (RF48).

### O acesso e os dados pessoais estão protegidos?

Atende ao **RNF02**, com acesso restrito por papel, titularidade e situação do registro, aplicado também em rotas e endpoints — não apenas ocultando elementos na interface. Atende ao **RNF01**, exigindo segundo fator nas operações protegidas.

Atende ao **RNF07** e ao **RNF14**: nenhum dado pessoal é exposto fora do fluxo previsto. Os dados de recebimento (RF05) e as evidências de denúncia (RF37) só são visíveis a quem tem autorização, as senhas são armazenadas com hash e a comunicação trafega criptografada.

### Os critérios de usabilidade foram atendidos?

As mensagens de validação indicam como corrigir o erro (RNF08). O usuário e seu papel estão identificados nas telas autenticadas (RNF10). As ações destrutivas — cancelar contratação, encerrar oferta, aplicar sanção — exigem confirmação explícita (RNF11). O padrão visual segue o guia de estilo (RNF12) e a interface se adapta a desktop, tablet e celular (RNF16).

A implementação respeita a restrição de tecnologia do **RNF06**: React no frontend e PHP no backend.

### A equipe revisou e a documentação está atualizada?

A funcionalidade passou por walkthrough com os responsáveis de frontend, backend e banco de dados, conforme a prática de revisão por pares da seção 5, incluindo revisão visual da interface, antes da validação com o cliente.

Não existem defeitos conhecidos de severidade alta ou crítica vinculados à história.

O backlog, a matriz de rastreabilidade e as evidências da iteração no GitPages estão atualizados, com o histórico de revisão preenchido.

---

## 9.3 Modelos de aplicação

As tabelas abaixo são o instrumento de inspeção usado no fechamento de cada iteração, conforme a prática de inspeção por checklist descrita na seção 5.

### Checklist do DoR

| Verificado | Pergunta |
| :--------: | -------- |
| ☐ | A história tem a informação necessária para ser trabalhada? |
| ☐ | O requisito está expresso como história de usuário? |
| ☐ | Os critérios de aceitação estão definidos em BDD? |
| ☐ | A história está rastreada na cadeia OE → CP → VN → RF → RNF? |
| ☐ | A história está dentro do escopo priorizado? |
| ☐ | As regras financeiras estão explicitadas, inclusive o caminho de falha? |
| ☐ | Os RNFs aplicáveis foram identificados? |
| ☐ | A história está representada no protótipo e validada? |
| ☐ | A história cabe em uma iteração? |
| ☐ | As dependências e os responsáveis estão definidos? |

---

### Checklist do DoD

| Verificado | Pergunta |
| :--------: | -------- |
| ☐ | A história entrega um incremento do produto? |
| ☐ | Os critérios de aceitação foram integralmente atendidos? |
| ☐ | O desenvolvimento está completo e coerente com o protótipo? |
| ☐ | Os testes de aceitação foram executados e aprovados? |
| ☐ | A integridade financeira foi preservada (RNF13)? |
| ☐ | As falhas de integração e de concorrência são tratadas (RNF09, RNF15)? |
| ☐ | As ações sensíveis geram registro auditável (RNF03)? |
| ☐ | O acesso e os dados pessoais estão protegidos (RNF01, RNF02, RNF07, RNF14)? |
| ☐ | Os critérios de usabilidade foram atendidos (RNF06, RNF08, RNF10, RNF11, RNF12, RNF16)? |
| ☐ | A equipe revisou a funcionalidade e a documentação está atualizada? |

---
