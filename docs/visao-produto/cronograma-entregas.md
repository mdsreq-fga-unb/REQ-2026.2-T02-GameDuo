# 6 Cronograma e Entregas


---

##  Visão geral das fases

| Fase do OpenUP | Período | Iterações | Marco de encerramento | Unidade da disciplina |
| -------------- | ------- | --------- | --------------------- | --------------------- |
| **Iniciação** | 11/08/2026 – 08/09/2026 | 1 e 2 | **Objetivos do Ciclo de Vida** — problema, escopo e visão do produto acordados com o cliente | Unidade 1 |
| **Elaboração** | 09/09/2026 – 13/10/2026 | 3, 4 e 5| **Arquitetura do Ciclo de Vida** — requisitos estabilizados, riscos estruturais reduzidos por provas de conceito e MVP definido | Unidade 2 |
| **Construção** | 14/10/2026 – 17/11/2026 |  6, 7 e 8 | **Capacidade Operacional Inicial** — MVP funcional, integrado e testado | Unidades 3 e 4 |
| **Transição** | 18/11/2026 – 01/12/2026 | 9 e 10 | **Release do Produto** — produto homologado e aceito pelo cliente | Unidade 4 |
---

##  Detalhamento das iterações

| Iteração | Fase | Início | Fim | Objetivo principal | Entregas esperadas | Validação do cliente |
| -------- | ---- | ------ | --- | ------------------ | ------------------ | -------------------- |
| **1** | Iniciação | 11/08/2026 | 27/08/2026 | Formação da equipe e definição do domínio do projeto | - Definição dos papéis da equipe GoHorse<br>- Repositório e site do projeto (GitPages) configurados<br>- Prospecção e primeiro contato com o cliente | Alinhamento inicial sobre disponibilidade, forma de contato e interesse no projeto |
| **2** | Iniciação | 01/09/2026 | 08/09/2026 | Compreensão do problema e construção da visão do produto | - **Entrega da Unidade 1:** documento de Visão do Produto e Projeto (seções 1 a 7)<br>- Rich picture, diagrama de Ishikawa e mapa de stakeholders<br>- Objetivos específicos (OE1–OE5) e características de produto (CP1–CP6)<br>- Estratégia de engenharia de software e plano de ER definidos | Primeira reunião com o cliente: validação do problema central, do modelo de negócio e do escopo pretendido |
| **3** | Elaboração | 09/09/2026 | 22/09/2026 | Elicitação, análise e declaração em tabela<br>- Prova de conceito da verificação de Elo via API de terceiros | Validação dos requisitos declarados e do que é tecnicamente verificável na integração de credenciais |
| **4** | Elaboração | 23/10/2026 | 06/10/2026 | Definição do backlog, do MVP e redução do risco de pagamento | - Matriz de rastreabilidade (OE → CP → VN → RF → RNF)<br>- Prova de conceito da custódia e do split de pagamento- Validação de funcionalidades com os clientes finais do projeto, tanto o prestador, o usuário e o Ciro | Homologação do backlog priorizado e do recorte do MVP |
| **5** | Elaboração | 07/10/2026 | 13/10/2026 | Finalização da unidade 2 e finalizar qualquer pendência | - **Entrega da Unidade 2:** backlog do produto priorizado, MVP definido, DoR e DoD<br> | Homologação do backlog priorizado e do recorte do MVP | 
| **6** | Construção | 14/10/2026 | 28/10/2026 | Primeiro incremento: identidade e descoberta de prestadores | - Cadastro e perfil de usuário com verificação de credenciais (CP1)<br>- Catálogo e busca de serviços por jogo, nível, preço e tipo (CP2)<br>- Protótipos e diagramas de caso de uso da jornada de contratação | Demonstração do incremento: o consumidor consegue encontrar e avaliar um prestador verificado |
| **7** | Construção | 27/10/2026 | 17/11/2026 | Segundo incremento: contratação e custódia | - Fluxo de contratação com retenção de créditos em custódia (CP3)<br>- Gestão da sessão e chat integrado entre as partes (CP6)<br>- Verificação e validação dos requisitos implementados- Validação de funcionalidades com os clientes finais do projeto, tanto o prestador, o usuário e o Ciro | Validação do fluxo de contratação de ponta a ponta, incluindo os caminhos de exceção<br>- Avaliação cruzada, reputação e canal de denúncias (CP4)<br> |
| **8** | Construção | 10/11/2026 | 17/11/2026 | Segundo incremento: contratação e custódia | - **Entrega da Unidade 3**<br>- Fluxo de contratação com retenção de créditos em custódia (CP3)<br>| Validação do fluxo de contratação de ponta a ponta, incluindo os caminhos de exceção |
| **9** | Construção | 24/11/2026 | 01/12/2026 | Terceiro incremento: validação bilateral, repasse e confiança | - Validação bilateral da sessão e repasse automático ao prestador (CP3)<br>- Painel administrativo de transações, disputas e usuários (CP5)<br>- Backlog e matriz de rastreabilidade atualizados | Validação do ciclo completo da transação e das regras de moderação |
| **10** | Transição | 02/12/2026 | 10/12/2026 | Homologação, entrega e encerramento | - **Entrega final (Unidade 4):** MVP integrado, corrigido e testado<br>- Testes de aceitação com usuários dos dois perfis (consumidor e prestador)<br>- Documentação consolidada e lições aprendidas<br>- Apresentação final do produto | Homologação e aceite formal do produto pelo cliente |

---



---

##  Considerações importantes

1. **Duração das iterações.** As iterações têm uma ou duas semanas. As de duas semanas abrem cada bloco da disciplina e concentram o trabalho de descoberta e construção, ou são finalizadores de conteúdo para fazer a validação de fim de conteúdo com o cliente; as de uma semana fecham o bloco e coincidem com a semana de entrega da Unidade. As iterações de uma semana podem ser usadas como finalização de iteração de produção de projeto, mas será apenas pra terminar o que deveria ter sido terminado nas iterações anteriores.

2. **Validação ao final de cada iteração.** Toda iteração de duas semanas encerra com uma reunião de validação com Ciro Vargas, por Google Meet ou Discord. Dúvidas pontuais entre as reuniões seguem por WhatsApp.

3. **Riscos estruturais tratados antes da Construção.** As provas de conceito da verificação de Elo (Iteração 3) e da custódia com split de pagamento (Iteração 4) foram deliberadamente posicionadas na fase de Elaboração. São as duas decisões mais caras de reverter, e o marco de Arquitetura do Ciclo de Vida só é considerado atingido quando ambas estiverem resolvidas.

4. **Entregas incrementais alinhadas ao MVP.** As Iterações 5, 6 e 7 constroem, nessa ordem, os três passos da proposta de valor central: encontrar um prestador confiável, contratar a sessão e concluir a transação com segurança para as duas partes. Cada incremento é utilizável e validado antes que o seguinte comece.

5. **Folga concentrada no fim do semestre.** A Unidade 4 é a mais curta do calendário. Por isso, o MVP é fechado ao final da Iteração 7, em (arrumando), e a última semana fica reservada para correções, homologação e apresentação — sem funcionalidade nova prevista.

6. **Atualização sucessiva do planejamento.** Ao final de cada iteração, o cronograma é revisado à luz do que foi efetivamente entregue e das mudanças de prioridade acordadas com o cliente. As alterações são registradas no histórico de revisão do documento, no GitPages.

7. **Retrospectiva por Unidade.** Ao final de cada Unidade, a equipe realiza uma retrospectiva cujos resultados são registrados na seção de Lições Aprendidas, incluindo as dificuldades enfrentadas e as ações de melhoria adotadas. Ela será realizada durante a semana de realização de documento.
