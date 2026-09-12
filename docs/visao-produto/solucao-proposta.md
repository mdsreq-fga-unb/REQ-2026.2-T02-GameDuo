# 2 Solução Proposta

## 2.1 Objetivo Geral do Produto

O objetivo do produto é apoiar a estruturação e a comercialização segura de serviços de expertise gamer, facilitando a conexão confiável entre quem precisa de orientação técnica e quem pode oferecê-la no ecossistema de jogos online. A solução busca criar um ambiente integrado que reduza a assimetria de informação entre as partes, ofereça aos prestadores um canal profissional de oferta e aos consumidores uma experiência transparente, com regras claras de contratação, conclusão e resolução de conflitos.

---

## 2.2 Objetivos Específicos (OE) do Produto



- **(OE1):** Disponibilizar uma jornada de contratação de serviços online (coaching e duo) estável, padronizada e rastreável para as duas partes.
- **(OE2):** Reduzir riscos de fraude, inadimplência e abandono de serviço nas transações, com regras explícitas de disputa e prazos definidos.
- **(OE3) — Credencial técnica:** Assegurar que o ranque (Elo) e as estatísticas declaradas pelo prestador correspondam à conta verificada, quando a API do jogo permitir essa verificação.
- **(OE4) — Capacidade de prestação:** Tornar observável para o consumidor a experiência de ensino do prestador — modalidades atendidas, formato da sessão, idioma, histórico de sessões concluídas — de modo independente do desempenho competitivo.
- **(OE5) — Reputação de serviço e conduta:** Acompanhar o cumprimento do que foi contratado (comparecimento, pontualidade, duração acordada, conduta) por meio de indicadores resistentes a retaliação e manipulação.
- **(OE6):** Criar uma base tecnológica que suporte o aumento do volume de transações e a futura expansão do catálogo de jogos.

---

## 2.3 Características de Produto (CP)

| ID | Característica | Descrição | Valor de negócio | Contribuição principal | Secundária |
|---|---|---|---|---|---|
| **CP1** | Verificação de credencial técnica | Vinculação da conta do jogo ao perfil e leitura do ranque/estatísticas via API oficial, quando disponível. O selo exibido indica **apenas** que o Elo declarado foi confirmado na data da verificação — não constitui atestado de qualidade do serviço. | Redução de anúncio falso de nível técnico | OE3 | OE1 |
| **CP2** | Perfil de prestação e capacidade de ensino | Campos estruturados e verificáveis por histórico: modalidades atendidas (ranqueado, campanha, mecânica específica), formato (sessão ao vivo, revisão de replay, duo), idioma, disponibilidade, número de sessões concluídas e taxa de comparecimento. Distingue-se de CP1: aqui não há verificação por API, e sim evidência acumulada de prestação. | Permite ao consumidor escolher por adequação, não só por ranque | OE4 | OE1 |
| **CP3** | Catálogo e busca de serviços | Busca estruturada com filtro por jogo, modalidade, faixa de preço, idioma, disponibilidade e indicadores de CP1/CP2. Inclui acesso a guias e tutoriais. | Conecta oferta e demanda de forma estruturada | OE1 | OE6 |
| **CP4** | Intermediação de pagamentos com custódia *(hipótese arquitetural — ver 2.4)* | Retenção do crédito no momento da contratação e liberação ao prestador após a conclusão da sessão, conforme as regras de CP5. O repasse por *split* automático é a arquitetura pretendida, **condicionada à prova de conceito com o gateway a ser selecionado**. | Redução de inadimplência e quebra de acordo | OE2 | OE1 |
| **CP5** | Regras de conclusão e disputa | Fluxo determinístico de encerramento da sessão, com prazos, evidências aceitas e autoridade de decisão definidos (detalhado em 2.3.1). Cobre não comparecimento, divergência entre as partes, silêncio de uma das partes, interrupção técnica e denúncia de conduta. | Torna a custódia operável na prática | OE2 | OE5 |
| **CP6** | Avaliação, reputação e denúncia | Avaliação bilateral com publicação simultânea, canal de denúncia separado e confidencial, e salvaguardas contra retaliação e manipulação (detalhado em 2.3.2). | Qualidade do serviço com risco de abuso controlado | OE5 | OE4 |
| **CP7** | Administração e moderação | Painel para controle de transações, fila de disputas e denúncias, gestão de usuários e monitoramento financeiro. É o ator que exerce a autoridade de decisão prevista em CP5. | Operação segura e escalável | OE6 | OE2 |

### 2.3.1 Regras de conclusão e disputa (detalhamento da CP5)

A validação bilateral resolve o caso feliz. Os casos abaixo precisam de regra própria, e a ausência delas inviabiliza a custódia descrita em CP4.

| Situação | Regra proposta | Evidência considerada |
|---|---|---|
| Ambas as partes confirmam a realização | Liberação automática do repasse | Confirmação dupla |
| Consumidor não responde dentro do prazo | Confirmação tácita após **[definir: 72h?]** do fim previsto, com aviso prévio | Ausência de contestação dentro do prazo |
| Prestador não responde | Liberação mediante confirmação do consumidor; ausência não bloqueia o repasse | Confirmação do consumidor |
| Consumidor afirma que não ocorreu / prestador afirma que ocorreu | Abertura de disputa; crédito permanece retido até decisão | Relato das partes, presença nos servidores do jogo quando a API expuser — **evidência ainda a definir com o cliente** |
| Nenhuma das partes confirma | Disputa aberta automaticamente após o prazo | Ausência de confirmação de ambas as partes |
| Sessão interrompida por falha técnica | Reagendamento sem custo dentro de **[definir]** dias, ou reembolso proporcional ao tempo não prestado | Relato das partes — **evidência ainda a definir com o cliente** |
| Atraso do prestador acima do tolerado | Cancelamento sem ônus para o consumidor e devolução integral | Relato do consumidor — **evidência ainda a definir com o cliente** |
| Denúncia de assédio ou conduta grave | Suspensão imediata do repasse e encaminhamento à moderação (CP7), fora do fluxo automático | Relato pelo canal confidencial |




---

## 2.4 Tecnologias a serem utilizadas

A tabela distingue o que já está decidido, o que é hipótese a validar e o que segue em aberto. Distingue também tecnologia do produto de ferramenta de projeto.

### Tecnologias do produto

| Camada | Decisão | Status | Observação |
|---|---|---|---|
| Frontend | React | Decidido | Domínio da equipe e do cliente |
| Backend | PHP | Decidido | Definir framework (Laravel? Slim?) e formato da API (REST/JSON) |
| Banco de dados |  *A definir* | Em Aberto ||
| Pagamentos | *A definir* | Em Aberto|  |


---

## 2.5 Pesquisa de Mercado e Análise Competitiva



O mercado de serviços para jogos eletrônicos já conta com soluções consolidadas, mas elas atendem o problema de forma parcial quando observadas no contexto brasileiro. A análise a seguir compara as alternativas segundo os mesmos critérios: modalidade atendida, moeda e meio de pagamento, verificação de credencial técnica, tratamento de conflitos e exigência de compartilhamento de conta.

Plataformas internacionais de coaching, como Metafy e ProGuides, oferecem instrução de alto nível e mantêm cada jogador em sua própria conta. Operam, porém, em dólar e em inglês, o que impõe barreira cambial e linguística ao público nacional e inviabiliza meios de pagamento locais.

Aplicativos de companhia, como o E-Pal, atendem à demanda por parceiros de jogo, mas posicionam-se no entretenimento social, e não na evolução técnica: o nível competitivo do prestador não é verificado contra a conta do jogo, de modo que o consumidor não tem como confirmar a expertise anunciada.

O mercado de boosting, hoje representado principalmente pela LFCarry (antiga Legionfarm), entrega o objetivo mediante compartilhamento de conta. Essa prática é vedada pelos termos de serviço dos títulos competitivos que compõem o recorte inicial do GameDuo, com risco de suspensão da conta para o contratante e exposição de credenciais. As cláusulas específicas de cada título estão referenciadas na seção 12.

Marketplaces generalistas como o Fiverr permitem anunciar esses serviços e dispõem de fluxo de disputa maduro, mas não oferecem verificação de estatísticas, filtro por elo ou qualquer recurso próprio do ecossistema gamer, o que transfere ao consumidor a tarefa de avaliar a competência do prestador.

A solução proposta se posiciona na interseção que nenhuma das alternativas analisadas cobre simultaneamente: operação em real com meios de pagamento nacionais, verificação do elo declarado pelo prestador e retenção do crédito até a conclusão da sessão — esta última condicionada à prova de conceito descrita na seção 2.4. Por trabalhar apenas com coaching e duo, o modelo não incorre na violação de compartilhamento de conta que caracteriza o boosting, embora a conformidade com as demais cláusulas de cada título (monetização de serviços e uso de API) precise ser verificada individualmente durante a fase de Elaboração. O escopo contempla tanto a progressão em modos ranqueados quanto o auxílio pontual em desafios de campanha, categoria pouco atendida pelas plataformas existentes.

**Diferenciais pretendidos**, a sustentar com o quadro acima: operação em real com meios de pagamento nacionais; custódia do crédito até a conclusão da sessão (condicionada a 2.4); verificação do Elo declarado; e atendimento a desafios de campanha, além da progressão em ranqueado.

**Sobre compartilhamento de conta:** o boosting por acesso à conta é vedado pelos termos de serviço dos principais títulos competitivos, com risco de suspensão para o contratante. A afirmação deve citar a cláusula específica de cada jogo dentro do recorte escolhido, em vez de generalizar para o mercado inteiro. Coaching e duo mantêm cada jogador na própria conta, o que evita esse risco — mas "conformidade integral" é forte demais, já que outras cláusulas (monetização, uso de API) seguem aplicáveis e precisam ser verificadas título a título.

---

## 2.6 Viabilidade da Proposta

A proposta é viável no contexto da disciplina, desde que o escopo permaneça restrito ao que sustenta a proposta de valor central: encontrar um prestador confiável, contratar uma sessão, concluí-la e resolver o caso em que as partes discordam.

Dois fatores favorecem a execução: cinco integrantes com disponibilidade parcial ao longo do semestre e acesso direto ao cliente — Ciro Vargas é o idealizador e único tomador de decisão, com experiência em arquitetura de software, o que encurta o ciclo entre dúvida e resposta. Esses fatores reduzem risco de comunicação e de escopo, mas não demonstram viabilidade sozinhos.

O risco determinante é o de pagamento: a retenção de crédito até a conclusão da sessão varia entre provedores e pode exigir habilitação regulatória fora do alcance da equipe. A seleção do gateway e a prova de conceito precisam ocorrer no início da Elaboração, antes que a arquitetura da CP4 seja assumida como certa. 

Há ainda riscos não técnicos, que tendem a ser subestimados: as regras de custódia e disputa precisam ser fechadas com o cliente na concepção, já que sem critério de liberação a custódia não opera; a moderação precisa de alguém que execute a fila de denúncia e etc.



---

## 2.7 Benefícios esperados

### Para o cliente

- **Validação do modelo de negócio:** evidência empírica de que existe demanda por coaching e duo estruturados no mercado brasileiro, com dados de conversão e de recorrência.
- **Canal estruturado de oferta:** substituição da intermediação informal por um fluxo padronizado de contratação, conclusão e resolução de conflito.
- **Modelo de receita por comissão:** a retenção da fatia da plataforma em cada transação concluída cria receita proporcional ao volume, sem custo fixo por prestador.
- **Redução do risco transacional:** a custódia e as regras de disputa diminuem calote e quebra de acordo, que hoje recaem inteiramente sobre as partes.
- **Base de dados para evolução:** histórico de sessões, motivos de disputa e padrões de avaliação orientam as decisões seguintes de produto.
- **Posicionamento:** presença antecipada em um nicho ainda pouco atendido por plataformas nacionais.

### Para o consumidor

- Acesso a prestadores com credencial técnica verificada e com perfil de ensino descrito, o que permite escolher por adequação à sua dificuldade — e não apenas por ranque.
- Pagamento retido até a conclusão da sessão, reduzindo o risco de pagar e não receber.
- Caminho definido de reclamação quando o serviço não ocorre como combinado.
- Atendimento tanto à progressão em ranqueado quanto a desafios pontuais de campanha.

### Para o prestador

- Canal de captação de clientes sem prospecção individual em redes sociais e servidores de Discord.
- Recebimento intermediado, com redução do risco de calote.
- Reputação acumulada e portátil dentro da plataforma, construída sobre sessões efetivamente realizadas.
- Alternativa ao boosting por compartilhamento de conta, prática que expõe o prestador e o contratante a suspensão.
