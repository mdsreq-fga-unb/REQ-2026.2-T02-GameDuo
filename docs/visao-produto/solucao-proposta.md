# 2 Solução Proposta

## 2.1 Objetivo Geral do Produto

O objetivo do produto é estruturar e expandir a comercialização segura de serviços de expertise gamer, viabilizando um ambiente onde jogadores possam contratar sessões de *coaching* e companhia (*duo*) sob demanda para alcançar suas metas de progressão. A solução irá profissionalizar as transações financeiras desse nicho, reduzindo os riscos operacionais (como fraudes e quebras de acordo) e permitindo que o cliente consolide e escale suas operações no mercado brasileiro de entretenimento digital.

## 2.2 Objetivos Específicos (OE) do Produto

- **(OE1):** Disponibilizar uma jornada de contratação de serviços online (coaching e duos) que seja estável, padronizada e segura para os usuários.
- **(OE2):** Reduzir os riscos de fraudes, inadimplência e abandono de serviço nas transações entre jogadores.
- **(OE3):** Assegurar a veracidade técnica dos serviços oferecidos, garantindo que as credenciais e ranques (Elo) dos prestadores sejam compatíveis com o anunciado.
- **(OE4):** Fomentar a qualidade da prestação de serviços e mitigar comportamentos inadequados por meio do acompanhamento de métricas de reputação.
- **(OE5):** Criar uma base tecnológica flexível que suporte o aumento do volume de transações e a futura expansão do catálogo de jogos atendidos pela operação.

## 2.3 Características de Produto (mapeadas com os Objetivos Específicos do Produto)

Apresentamos a seguir as principais características que a solução GameDuo deve ter para atender às necessidades do cliente, alinhadas aos Objetivos Específicos (OE):

| ID | Característica de Produto (CP) | Descrição resumida | Valor de negócio (VN) principal | Contribuição principal | Contribuição secundária |
|:---|:---|:---|:---|:---|:---|
| **CP1** | Perfil e verificação de credenciais | A solução deverá permitir o cadastro de usuários com mecanismos de verificação técnica, garantindo que o nível (Elo) e as credenciais dos prestadores de serviço sejam comprovadamente reais. | Aumento da confiança na plataforma e garantia de veracidade na oferta de serviços especializados. | OE3 | OE4 |
| **CP2** | Catálogo e busca de serviços | A solução deverá disponibilizar uma busca estruturada onde os consumidores possam filtrar prestadores por jogo, nível, preço e tipo de serviço oferecido, englobando Coaching, Duo sob demanda, além do acesso a guias e tutoriais. | Melhoria da navegação, facilidade em conectar oferta e demanda de forma estruturada e disponibilização de material de apoio. | OE1 | OE5 |
| **CP3** | Intermediação segura de pagamentos e repasse | A solução deverá processar pagamentos retendo os créditos em custódia. Após a validação bilateral da sessão, a plataforma fará o repasse automático da fatia devida para a carteira do prestador por meio de um gateway com tecnologia de split de pagamento. | Redução drástica de fraudes, inadimplência e quebra de acordos, profissionalizando a transação financeira e garantindo as taxas da plataforma. | OE2 | OE1 |
| **CP4** | Sistema de avaliação, reputação e denúncias | A solução deverá permitir que os usuários avaliem uns aos outros após a partida (avaliação cruzada) e disponibilizará um canal seguro para denúncias, gerando indicadores visíveis de habilidade técnica e conduta. | Mitigação de toxicidade e assédio, fomentando um ambiente seguro e recompensando prestadores de qualidade. | OE4 | OE2 |
| **CP5** | Administração do canal digital | A solução deverá fornecer um painel administrativo para controle das transações, moderação de denúncias e disputas, gestão de usuários ativos e monitoramento financeiro da plataforma. | Apoio à operação segura e criação de condições para a escalabilidade e expansão do negócio. | OE5 | OE2 |
| **CP6** | Gestão da Sessão de Jogo e Comunicação | A solução deverá oferecer um ambiente para acompanhamento do serviço contratado, incluindo um chat integrado para comunicação direta entre as partes, facilitando o agendamento de horários e a confirmação da partida/aula. | Aumento da transparência, organização e confiabilidade operacional na prestação do serviço. | OE1 | OE3 |

## 2.4 Tecnologias a serem utilizadas

Para a construção do Gameduo, serão usados as seguintes tecnologias: Para o frontend, será usado React, devido ao conhecimento do grupo com a ferramenta e do cliente, para o backend, será usado PHP, e para salvar informações, será usado supabase, devido ao conhecimento.

Para realizar pagamentos, será usado a API (insira api de pagamento aqui), para desenvolvimento do produto e salvar progresso, será usado git e github, além das técnicas de desenvolvimento citadas. O projeto também manterá questões de segurança e proteção de dados de acordo com a LGPD.

## 2.5 Pesquisa de Mercado e Análise Competitiva

O mercado de serviços para jogos eletrônicos já conta com soluções consolidadas, mas nenhuma delas resolve o problema por completo no contexto brasileiro. Plataformas internacionais de coaching, como Metafy e ProGuides, oferecem sistema de coaching e instrução de alto nível, porém operam em dólar e em inglês, o que impõe barreiras cambiais e linguísticas ao público nacional.

Aplicativos de companhia, como o E-Pal, atendem à demanda por parceiros de jogo, mas priorizam o entretenimento social em detrimento da evolução técnica e não verificam o nível competitivo dos prestadores. Há ainda o mercado de boosting, hoje representado principalmente pela LFCarry (antiga Legionfarm), que entrega o objetivo mediante compartilhamento de conta. Essa prática viola os termos de serviço de praticamente todas as desenvolvedoras, sujeitando o contratante a banimento permanente e a risco de roubo de credenciais. Por fim, marketplaces generalistas como o Fiverr permitem anunciar esses serviços, mas não dispõem de validação de estatísticas, filtro por elo ou qualquer ferramenta específica do ecossistema gamer.

A solução proposta se diferencia ao operar exclusivamente com coaching e duo, modalidades em que cada jogador permanece na própria conta, mantendo conformidade integral com as regras das desenvolvedoras. Sobre essa base, agrega três elementos ausentes nas alternativas analisadas: operação em real com meios de pagamento nacionais, custódia dos créditos até a validação bilateral da sessão e verificação obrigatória do elo declarado pelo prestador. O escopo contempla tanto a progressão em modos ranqueados quanto o auxílio pontual em desafios de campanha, categoria pouco atendida pelas plataformas existentes.


##  2.6 Viabilidade da Proposta

A proposta é viável no contexto da disciplina. A equipe é composta por cinco integrantes com disponibilidade parcial ao longo de um semestre letivo, o que é suficiente para entregar um MVP funcional, desde que o escopo permaneça restrito às funcionalidades que sustentam a proposta de valor central: encontrar um prestador confiável, contratar uma sessão e concluir a transação com segurança para as duas partes.

O acesso ao cliente é um facilitador importante. Ciro Vargas é o idealizador do produto e o único tomador de decisão, acessível por WhatsApp, Discord e Google Meet. Não há cadeia de aprovação, o que reduz o tempo entre a dúvida da equipe e a resposta do cliente. Sua experiência como arquiteto de software também torna as conversas técnicas mais diretas.

Quanto ao conhecimento técnico, a equipe tem familiaridade com desenvolvimento web e domina as ferramentas de versionamento e documentação exigidas pelo projeto. As maiores incertezas estão nas integrações externas, especialmente a verificação de credenciais e o processamento de pagamentos, que serão tratadas por meio de provas de conceito antes de serem incorporadas ao produto.




## 2.7 Benefícios esperados

Para o cliente: Fornecer um serviço para jogadores com necessidade de ajuda, jogadores profissionais que potencialmente podem ganhar dinheiro com a plataforma, e o ganho financeiro com o projeto que terá, além de colocar o nome dele no mercado.

Para os usuários: Os jogadores que possuem dificuldade poderão ter uma forma de conversar com uma pessoa para conseguir a ajuda que precisava, sendo treinamento para ganho de elo/rank em jogos competitivos ou em chefões que não conseguem passar, e os coachs/jogadores profissionais podem conseguir ganhar dinheiro fornecendo seu conhecimento e experiência com o jogo.
