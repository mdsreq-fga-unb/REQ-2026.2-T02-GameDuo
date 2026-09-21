# 8 Requisitos de Software

Esta seção apresenta os requisitos funcionais e não funcionais do GameDuo e sua rastreabilidade com os objetivos específicos, as características de produto e o valor de negócio definidos na [seção 2 — Solução Proposta](solucao-proposta.md#22-objetivos-especificos-oe-do-produto).

A especificação incorpora a revisão do [documento de requisitos](https://docs.google.com/document/d/1N4kywDXcI1_ONN4ulAbYZn21Mf2062dHjyn1VSL1RkU/edit), elaborado a partir do fluxograma e das discussões com o cliente. As regras de negócio permanecem nesse documento de apoio, separadas das listas de RFs e RNFs. A publicação desta versão não representa validação integral dos pontos ainda pendentes.

## 8.1 Lista de Requisitos Funcionais

Os requisitos funcionais descrevem os comportamentos do sistema, incluindo ações dos usuários, integrações e processos automáticos. Cada requisito mantém seu identificador e o vínculo com as características de produto (CP).

### RF01 — Cadastrar usuários {#rf01}

O sistema deve permitir o cadastro de usuários com e-mail, telefone, senha e nickname público, permitindo corrigir os dados informados.

**Rastreabilidade:** CP7.

### RF02 — Autenticar usuários {#rf02}

O sistema deve validar as credenciais fornecidas e identificar o usuário autenticado.

**Rastreabilidade:** CP7.

### RF03 — Recuperar senha {#rf03}

O sistema deve permitir solicitar a recuperação de senha e definir uma nova senha após a validação da solicitação.

**Rastreabilidade:** CP7.

### RF04 — Configurar perfil de prestação {#rf04}

O sistema deve permitir ao prestador configurar sua apresentação, jogos, nível declarado, modalidades, formatos de atendimento e idiomas.

**Rastreabilidade:** CP2.

### RF05 — Manter dados de recebimento {#rf05}

O sistema deve permitir ao prestador cadastrar e atualizar os dados bancários utilizados para recebimento.

**Rastreabilidade:** CP4.

### RF06 — Verificar credencial de jogo {#rf06}

O sistema deve permitir vincular a conta de jogo, consultar a integração disponível e apresentar o resultado da verificação, incluindo selo e data quando aplicáveis.

**Rastreabilidade:** CP1.

### RF07 — Consultar perfil de prestador {#rf07}

O sistema deve permitir consultar a apresentação, os jogos, as modalidades, as credenciais verificadas, a reputação e os indicadores do prestador.

**Rastreabilidade:** CP1, CP2.

### RF08 — Calcular indicadores de prestação {#rf08}

O sistema deve calcular a quantidade de sessões concluídas e a taxa de comparecimento do prestador a partir dos registros de atendimento. A fórmula e o tratamento de sessões contestadas permanecem pendentes.

**Rastreabilidade:** CP2.

### RF09 — Consultar catálogo {#rf09}

O sistema deve permitir consultar ofertas e aplicar filtros de modalidade, jogo, elo, preço, idioma, disponibilidade, reputação e selo, conforme os dados aplicáveis ao jogo.

**Rastreabilidade:** CP3.

### RF10 — Consultar detalhes de oferta {#rf10}

O sistema deve apresentar o prestador, a modalidade, o jogo, a descrição, o preço, a duração, as condições e a forma de comunicação da oferta.

**Rastreabilidade:** CP3.

### RF11 — Manter dados de ofertas {#rf11}

O sistema deve permitir ao prestador cadastrar, publicar e editar ofertas de coaching, duo e conteúdos.

**Rastreabilidade:** CP3.

### RF12 — Pausar oferta {#rf12}

O sistema deve permitir ao prestador pausar uma oferta, retirando-a do catálogo e mantendo seus dados no painel do prestador.

**Rastreabilidade:** CP3.

### RF13 — Encerrar oferta {#rf13}

O sistema deve permitir ao prestador encerrar uma oferta, retirando-a do catálogo e de sua lista de ofertas. Esse comportamento não determina a exclusão do histórico de contratações.

**Rastreabilidade:** CP3.

### RF14 — Configurar agenda semanal {#rf14}

O sistema deve permitir ao prestador cadastrar e atualizar os dias e intervalos de horário disponíveis para atendimento de cada serviço cadastrado como Coach ou Duo.

**Rastreabilidade:** CP2.

### RF15 — Consultar disponibilidade de atendimento {#rf15}

O sistema deve permitir ao consumidor consultar os horários disponíveis do prestador em cada oferta.

**Rastreabilidade:** CP2, CP3.

### RF16 — Agendar serviço {#rf16}

O sistema deve registrar automaticamente a contratação de coaching ou duo para o horário disponível selecionado pelo consumidor.

**Rastreabilidade:** CP3, CP5.

### RF17 — Reagendar serviço {#rf17}

O sistema deve permitir que qualquer participante solicite o reagendamento e que a outra parte aceite, recuse ou proponha outro horário, registrando o resultado da negociação.

**Rastreabilidade:** CP5.

### RF18 — Cancelar contratação {#rf18}

O sistema deve permitir ao consumidor ou ao prestador cancelar uma contratação, registrando o responsável pelo cancelamento e atualizando sua situação.

**Rastreabilidade:** CP5.

### RF19 — Publicar solicitação de serviço {#rf19}

O sistema deve permitir ao consumidor publicar uma solicitação de duo ou coach, com jogo, data, horário, elo mínimo e preço.

**Rastreabilidade:** CP3.

### RF20 — Oferecer atendimento a solicitações de serviço {#rf20}

O sistema deve permitir ao prestador consultar solicitações de duo ou coach e apresentar uma oferta de atendimento.

**Rastreabilidade:** CP3.

### RF21 — Selecionar prestador para solicitações {#rf21}

O sistema deve permitir ao consumidor consultar as ofertas recebidas, escolher um prestador e registrar a contratação correspondente.

**Rastreabilidade:** CP3, CP5.

### RF22 — Comprar combo de créditos {#rf22}

O sistema deve permitir solicitar a compra de um combo de créditos e acompanhar o resultado do pagamento informado pelo gateway.

**Rastreabilidade:** CP4.

### RF23 — Consultar carteira {#rf23}

O sistema deve apresentar os saldos disponíveis, retidos e pendentes do usuário.

**Rastreabilidade:** CP4.

### RF24 — Consultar histórico de prestação {#rf24}

O sistema deve permitir ao prestador consultar os serviços realizados e a situação dos recebimentos correspondentes.

**Rastreabilidade:** CP2, CP4.

### RF25 — Reservar créditos {#rf25}

O sistema deve verificar o saldo, registrar a reserva de créditos vinculada à contratação e atualizar o saldo disponível.

**Rastreabilidade:** CP4.

### RF26 — Liberar valores retidos {#rf26}

O sistema deve identificar o encerramento da retenção, encaminhar os valores para distribuição e registrar o resultado da liberação.

**Rastreabilidade:** CP4, CP5.

### RF27 — Processar divisão de receita {#rf27}

O sistema deve calcular as parcelas do prestador e da plataforma, solicitar seu processamento pelo gateway e registrar o resultado.

**Rastreabilidade:** CP4.

### RF28 — Processar saques {#rf28}

O sistema deve permitir ao prestador solicitar a transferência do saldo elegível para sua conta bancária e acompanhar o resultado do processamento.

**Rastreabilidade:** CP4.

### RF29 — Comprar conteúdo {#rf29}

O sistema deve permitir ao consumidor adquirir guias ou tutoriais com créditos e registrar a compra.

**Rastreabilidade:** CP3, CP4.

### RF30 — Acessar conteúdo adquirido {#rf30}

O sistema deve permitir ao comprador acessar os vídeos ou documentos correspondentes ao conteúdo adquirido.

**Rastreabilidade:** CP3.

### RF31 — Registrar resultado da sessão {#rf31}

O sistema deve permitir que cada participante informe se a sessão ocorreu, não ocorreu ou apresentou problemas, incluindo justificativa quando aplicável.

**Rastreabilidade:** CP5.

### RF32 — Avaliar participante {#rf32}

O sistema deve permitir ao consumidor avaliar o prestador e ao prestador avaliar o consumidor, registrando nota e comentário relativos à sessão.

**Rastreabilidade:** CP6.

### RF33 — Avaliar conteúdo {#rf33}

O sistema deve permitir ao comprador registrar uma avaliação do guia ou tutorial adquirido.

**Rastreabilidade:** CP6.

### RF34 — Calcular reputação {#rf34}

O sistema deve calcular a reputação a partir das avaliações consideradas válidas pela política definida.

**Rastreabilidade:** CP6.

### RF35 — Publicar avaliações {#rf35}

O sistema deve disponibilizar as avaliações aos usuários autorizados conforme a política de publicação e visibilidade.

**Rastreabilidade:** CP6.

### RF36 — Registrar denúncia {#rf36}

O sistema deve permitir registrar uma denúncia relacionada a usuário, contratação ou conteúdo, informando seu motivo.

**Rastreabilidade:** CP5, CP6.

### RF37 — Apresentar relatos e evidências {#rf37}

O sistema deve permitir aos participantes de uma ocorrência apresentar relatos e evidências associados ao caso.

**Rastreabilidade:** CP5, CP6.

### RF38 — Consultar denúncias e disputas {#rf38}

O sistema deve permitir à moderação consultar as ocorrências, os participantes e as evidências para as quais possui autorização.

**Rastreabilidade:** CP7.

### RF39 — Registrar decisão de ocorrência {#rf39}

O sistema deve permitir à moderação registrar a decisão de uma ocorrência e as providências determinadas.

**Rastreabilidade:** CP5, CP7.

### RF40 — Executar decisão financeira {#rf40}

O sistema deve executar a devolução, a liberação ou a divisão parcial dos valores determinada na decisão, registrando os valores e seus destinatários.

**Rastreabilidade:** CP4, CP5, CP7.

### RF41 — Aplicar sanção a usuário {#rf41}

O sistema deve permitir à moderação aplicar sanções a consumidores e prestadores, incluindo banimento, registrando o motivo e o responsável.

**Rastreabilidade:** CP6, CP7.

### RF42 — Encerrar ocorrência {#rf42}

O sistema deve permitir à moderação encerrar uma ocorrência, mantendo o registro de sua decisão.

**Rastreabilidade:** CP5, CP7.

### RF43 — Notificar participantes {#rf43}

O sistema deve notificar os envolvidos sobre contratações, solicitações e respostas de reagendamento, cancelamentos, liberações automáticas e decisões de ocorrências.

**Rastreabilidade:** CP5, CP6, CP7.

### RF44 — Consultar usuários {#rf44}

O sistema deve permitir à administração localizar usuários e consultar seus dados autorizados e suas sanções.

**Rastreabilidade:** CP7.

### RF45 — Consultar contratações e transações {#rf45}

O sistema deve permitir à administração consultar contratações e transações, identificando participantes, valores e situações.

**Rastreabilidade:** CP7.

### RF46 — Acompanhar movimentações financeiras {#rf46}

O sistema deve permitir à administração acompanhar repasses, devoluções, saques e falhas de processamento.

**Rastreabilidade:** CP4, CP7.

### RF47 — Configurar comissões {#rf47}

O sistema deve permitir à administração configurar a comissão padrão e as comissões específicas por modalidade e perfil de prestador.

**Rastreabilidade:** CP4, CP7.

### RF48 — Configurar taxas e penalidades {#rf48}

O sistema deve permitir à administração configurar as taxas da plataforma e as penalidades de cancelamento.

**Rastreabilidade:** CP4, CP5, CP7.

### RF49 — Gerenciar permissões administrativas {#rf49}

O sistema deve permitir ao responsável autorizado conceder e revogar permissões de administração e moderação.

**Rastreabilidade:** CP7.

### RF50 — Manter jogos do catálogo {#rf50}

O sistema deve permitir à administração cadastrar e atualizar os jogos disponíveis no catálogo.

**Rastreabilidade:** CP3, CP7.

### RF51 — Manter informações do site {#rf51}

O sistema deve permitir à administração atualizar as informações institucionais e básicas do site.

**Rastreabilidade:** CP7.

!!! note "Definições pendentes que afetam os RFs"
    A seleção do gateway, as condições de saque e a base de cálculo das comissões ainda precisam ser definidas. Também permanecem pendentes os prazos de reagendamento e cancelamento, a validade das solicitações de serviço, as fórmulas dos indicadores e da reputação, a política de publicação das avaliações, o marco inicial das 48 horas de retenção e as condições de acesso aos conteúdos. Esses pontos estão detalhados no documento de apoio.

## 8.2 Lista de Requisitos Não Funcionais

Os requisitos não funcionais descrevem propriedades de qualidade e restrições do sistema. A classificação utiliza URPS+ e, para segurança e restrições organizacionais ou legislativas, a taxonomia de Sommerville, conforme o documento de origem.

!!! note "Estado da especificação"
    O documento de origem ainda identifica RNF08 e RNF09 como propostas a confirmar em sua introdução. Os demais detalhes não definidos são indicados em cada requisito; sua publicação não presume que essas pendências tenham sido resolvidas.

### RNF01 — Autenticação em dois fatores {#rnf01}

O sistema deve exigir um segundo fator nas operações definidas pela política de autenticação, utilizando os canais previstos de e-mail e telefone.

**Classificação:** Sommerville — requisito de produto: segurança.

**Critério verificável:** Uma operação protegida não deve ser concluída sem a validação do segundo fator.

**Observação:** As operações abrangidas e o uso de cada canal precisam ser definidos.

### RNF02 — Restrição de acesso {#rnf02}

O sistema deve restringir o acesso a dados pessoais, dados bancários, denúncias e avaliações ainda não publicadas conforme o papel do usuário e a situação do registro.

**Classificação:** Sommerville — requisito de produto: segurança.

**Critério verificável:** Tentativas de acesso sem autorização, inclusive diretamente pela API, devem ser recusadas.

**Observação:** A matriz detalhada de permissões precisa ser consolidada.

### RNF03 — Auditabilidade administrativa {#rnf03}

As alterações administrativas devem manter registros que identifiquem o responsável, o registro afetado e a alteração realizada.

**Classificação:** Sommerville — requisito de produto: segurança e auditabilidade.

**Critério verificável:** Uma alteração administrativa registrada deve permitir identificar esses três elementos.

**Observação:** Origem: fluxo administrativo.

### RNF04 — Configurabilidade de taxas {#rnf04}

As taxas e comissões previstas para configuração administrativa devem poder ser alteradas pelo painel, sem modificação do código-fonte.

**Classificação:** URPS+ — suportabilidade.

**Critério verificável:** Uma alteração autorizada no painel deve persistir e produzir efeito conforme as regras de vigência, sem alteração de código.

**Observação:** Complementa RF47 e RF48; não autoriza modificar taxas impostas pelo gateway.

### RNF05 — Periodicidade do cálculo de reputação {#rnf05}

O processamento de atualização da reputação deve ocorrer diariamente.

**Classificação:** Sommerville — requisito organizacional: operacional.

**Critério verificável:** Deve ser possível verificar a execução do processamento em cada dia.

**Observação:** O horário de execução permanece pendente.

### RNF06 — Tecnologias de implementação {#rnf06}

O sistema deve utilizar React no frontend e PHP no backend.

**Classificação:** URPS+ — restrição de implementação.

**Critério verificável:** A implementação deve utilizar essas tecnologias nas respectivas camadas.

**Observação:** React e PHP foram confirmados; a definição do banco de dados permanece pendente.

### RNF07 — Proteção de dados pessoais {#rnf07}

O tratamento de dados pessoais deve observar os requisitos aplicáveis da LGPD.

**Classificação:** Sommerville — requisito externo: legislativo.

**Critério verificável:** Os critérios específicos de verificação devem ser definidos a partir dos dados e tratamentos efetivamente adotados.

**Observação:** Origem: página de Engenharia de Requisitos. Este enunciado não comprova conformidade nem substitui seu detalhamento.

### RNF08 — Clareza das mensagens de validação {#rnf08}

As mensagens de validação devem identificar o campo ou a operação com problema e indicar como corrigir a informação, em linguagem compreensível ao usuário.

**Classificação:** URPS+ — usabilidade.

**Critério verificável:** Em uma entrada inválida, a mensagem deve permitir identificar o problema e a correção necessária.

### RNF09 — Consistência de reservas e transações {#rnf09}

O sistema deve preservar a consistência das reservas e dos saldos em solicitações simultâneas ou repetidas.

**Classificação:** URPS+ — confiabilidade.

**Critério verificável:** Solicitações concorrentes para o mesmo horário não devem gerar dupla reserva; a repetição de uma mesma confirmação de pagamento não deve duplicar créditos.

## 8.3 Matriz-síntese de rastreabilidade

A matriz relaciona as contribuições principal e secundária para os objetivos específicos (OE), as características de produto (CP), seu valor de negócio (VN), os requisitos funcionais e os não funcionais relacionados. Os objetivos e os valores de negócio reproduzem a [seção 2.3](solucao-proposta.md#23-caracteristicas-de-produto-cp); as associações com os requisitos representam a análise de rastreabilidade desta especificação.

| Contribuição principal | Contribuição secundária | CP | Valor de negócio (VN) | RFs relacionados | RNFs relacionados |
| --- | --- | --- | --- | --- | --- |
| OE3 | OE1 | CP1 | Redução de anúncio falso de nível técnico | [RF06](#rf06), [RF07](#rf07) | [RNF02](#rnf02), [RNF06](#rnf06), [RNF07](#rnf07), [RNF08](#rnf08) |
| OE4 | OE1 | CP2 | Permite ao consumidor escolher por adequação, não só por ranque | [RF04](#rf04), [RF07](#rf07), [RF08](#rf08), [RF14](#rf14), [RF15](#rf15), [RF24](#rf24) | [RNF02](#rnf02), [RNF06](#rnf06), [RNF07](#rnf07), [RNF08](#rnf08), [RNF09](#rnf09) |
| OE1 | OE6 | CP3 | Conecta oferta e demanda de forma estruturada | [RF09](#rf09), [RF10](#rf10), [RF11](#rf11), [RF12](#rf12), [RF13](#rf13), [RF15](#rf15), [RF16](#rf16), [RF19](#rf19), [RF20](#rf20), [RF21](#rf21), [RF29](#rf29), [RF30](#rf30), [RF50](#rf50) | [RNF02](#rnf02), [RNF06](#rnf06), [RNF07](#rnf07), [RNF08](#rnf08), [RNF09](#rnf09) |
| OE2 | OE1 | CP4 | Redução de inadimplência e quebra de acordo | [RF05](#rf05), [RF22](#rf22), [RF23](#rf23), [RF24](#rf24), [RF25](#rf25), [RF26](#rf26), [RF27](#rf27), [RF28](#rf28), [RF29](#rf29), [RF40](#rf40), [RF46](#rf46), [RF47](#rf47), [RF48](#rf48) | [RNF01](#rnf01), [RNF02](#rnf02), [RNF03](#rnf03), [RNF04](#rnf04), [RNF06](#rnf06), [RNF07](#rnf07), [RNF08](#rnf08), [RNF09](#rnf09) |
| OE2 | OE5 | CP5 | Torna a custódia operável na prática | [RF16](#rf16), [RF17](#rf17), [RF18](#rf18), [RF21](#rf21), [RF26](#rf26), [RF31](#rf31), [RF36](#rf36), [RF37](#rf37), [RF39](#rf39), [RF40](#rf40), [RF42](#rf42), [RF43](#rf43), [RF48](#rf48) | [RNF02](#rnf02), [RNF03](#rnf03), [RNF04](#rnf04), [RNF06](#rnf06), [RNF07](#rnf07), [RNF08](#rnf08), [RNF09](#rnf09) |
| OE5 | OE4 | CP6 | Qualidade do serviço com risco de abuso controlado | [RF32](#rf32), [RF33](#rf33), [RF34](#rf34), [RF35](#rf35), [RF36](#rf36), [RF37](#rf37), [RF41](#rf41), [RF43](#rf43) | [RNF02](#rnf02), [RNF03](#rnf03), [RNF05](#rnf05), [RNF06](#rnf06), [RNF07](#rnf07), [RNF08](#rnf08) |
| OE6 | OE2 | CP7 | Operação segura e escalável | [RF01](#rf01), [RF02](#rf02), [RF03](#rf03), [RF38](#rf38), [RF39](#rf39), [RF40](#rf40), [RF41](#rf41), [RF42](#rf42), [RF43](#rf43), [RF44](#rf44), [RF45](#rf45), [RF46](#rf46), [RF47](#rf47), [RF48](#rf48), [RF49](#rf49), [RF50](#rf50), [RF51](#rf51) | [RNF01](#rnf01), [RNF02](#rnf02), [RNF03](#rnf03), [RNF04](#rnf04), [RNF06](#rnf06), [RNF07](#rnf07), [RNF08](#rnf08) |

RNF06 aplica-se transversalmente à implementação do produto. RNF07 aplica-se ao tratamento de dados pessoais em cada característica, e RNF08 às mensagens de validação das operações correspondentes. RNF01 está associado às áreas de conta e movimentação financeira, mas as operações que exigirão o segundo fator ainda precisam ser definidas. RNF03 relaciona-se aos registros de intervenções administrativas; RNF04 às configurações de taxas, comissões e penalidades; RNF05 ao processamento de reputação; e RNF09 à consistência das agendas e dos saldos.

As relações com RNF08 e RNF09 indicam o alcance das propostas, sem convertê-las em requisitos já validados. A implementação do split em CP4 continua condicionada à análise de viabilidade com o gateway, e a política de publicação em CP6 permanece pendente.

