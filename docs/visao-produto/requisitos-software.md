# 8 Requisitos de Software

Esta seção apresenta os requisitos funcionais e não funcionais do GameDuo e sua rastreabilidade com os objetivos específicos, as características de produto e o valor de negócio definidos na [seção 2 — Solução Proposta](solucao-proposta.md#22-objetivos-especificos-oe-do-produto).

## 8.1 Lista de Requisitos Funcionais 

Os requisitos abaixo descrevem as funcionalidades que o sistema busca atender para viabilizar, com segurança e transparência, a contratação de coaching e duo entre jogadores. Do cadastro e verificação de credenciais dos prestadores até a intermediação de pagamentos, o agendamento das sessões e a moderação de ocorrências. Cada requisito mantém seu identificador e o vínculo com a característica de produto (CP) de origem.

| Código | Nome | Descrição | Rastreabilidade |
| --- | --- | --- | --- |
| <a id="rf01"></a>RF01 | Cadastrar usuários | O sistema deve permitir o cadastro de usuários com e-mail, telefone, senha e nickname público, permitindo corrigir os dados informados. | CP7 |
| <a id="rf02"></a>RF02 | Autenticar usuários | O usuário deve conseguir acessar o sistema após a validação das credenciais informadas. | CP7 |
| <a id="rf03"></a>RF03 | Recuperar senha | O sistema deve permitir solicitar a recuperação de senha e definir uma nova senha após a validação da solicitação. | CP7 |
| <a id="rf04"></a>RF04 | Configurar perfil de prestação | O sistema deve permitir ao prestador configurar sua apresentação, jogos, nível declarado, modalidades, formatos de atendimento e idiomas. | CP2 |
| <a id="rf05"></a>RF05 | Manter dados de recebimento | O sistema deve permitir ao prestador cadastrar e atualizar os dados bancários utilizados para recebimento. | CP4 |
| <a id="rf06"></a>RF06 | Verificar credencial de jogo | O sistema deve permitir vincular a conta de jogo, consultar a integração disponível e apresentar o resultado da verificação. | CP1 |
| <a id="rf07"></a>RF07 | Consultar perfil de prestador | O usuário deve conseguir consultar a apresentação, os jogos, as modalidades, as credenciais verificadas, a reputação e os indicadores do prestador. | CP1, CP2 |
| <a id="rf08"></a>RF08 | Calcular indicadores de atendimento | O sistema deve calcular a quantidade de sessões concluídas e a taxa de comparecimento do prestador a partir dos registros de atendimento. | CP2 |
| <a id="rf09"></a>RF09 | Filtrar ofertas do catálogo | O usuário deve conseguir buscar ofertas no catálogo, aplicando filtros de modalidade, jogo, elo, preço, idioma, disponibilidade, reputação e selo. | CP3 |
| <a id="rf10"></a>RF10 | Consultar detalhes de oferta | O usuário deve conseguir consultar os detalhes de uma oferta, incluindo prestador, preço, duração, condições e forma de comunicação. | CP3 |
| <a id="rf11"></a>RF11 | Publicar ofertas | O prestador deve conseguir cadastrar, editar e publicar suas ofertas de coaching, duo e conteúdos. | CP3 |
| <a id="rf12"></a>RF12 | Pausar oferta | O sistema deve permitir ao prestador pausar uma oferta, retirando-a do catálogo e mantendo seus dados no painel do prestador. | CP3 |
| <a id="rf13"></a>RF13 | Encerrar oferta | O prestador deve conseguir encerrar uma oferta, retirando-a do catálogo e de sua lista de ofertas. | CP3 |
| <a id="rf14"></a>RF14 | Configurar agenda semanal | O sistema deve permitir ao prestador cadastrar e atualizar os dias e intervalos de horário disponíveis para atendimento de cada serviço cadastrado como Coach ou Duo. | CP2 |
| <a id="rf15"></a>RF15 | Consultar disponibilidade de atendimento | O sistema deve permitir ao consumidor consultar os horários disponíveis do prestador em cada oferta. | CP2, CP3 |
| <a id="rf16"></a>RF16 | Agendar serviço | O sistema deve registrar automaticamente a contratação de coaching ou duo para o horário disponível selecionado pelo consumidor. | CP3, CP5 |
| <a id="rf17"></a>RF17 | Reagendar serviço | Qualquer participante deve conseguir solicitar o reagendamento, e a outra parte pode aceitar, recusar ou propor outro horário. | CP5 |
| <a id="rf18"></a>RF18 | Cancelar contratação | O consumidor ou o prestador deve conseguir cancelar uma contratação. | CP5 |
| <a id="rf19"></a>RF19 | Publicar solicitação de serviço | O sistema deve permitir ao consumidor publicar uma solicitação de duo ou coach, com jogo, data, horário, elo mínimo e preço. | CP3 |
| <a id="rf20"></a>RF20 | Oferecer atendimento a solicitações de serviço | O sistema deve permitir ao prestador consultar solicitações de duo ou coach e apresentar uma oferta de atendimento. | CP3 |
| <a id="rf21"></a>RF21 | Selecionar prestador para solicitações | O sistema deve permitir ao consumidor consultar as ofertas recebidas, escolher um prestador e registrar a contratação correspondente. | CP3, CP5 |
| <a id="rf22"></a>RF22 | Comprar combo de créditos | O consumidor deve conseguir comprar um combo de créditos e acompanhar o resultado do pagamento. | CP4 |
| <a id="rf23"></a>RF23 | Consultar carteira | O sistema deve apresentar os saldos disponíveis, retidos e pendentes do usuário. | CP4 |
| <a id="rf24"></a>RF24 | Consultar histórico de prestação | O sistema deve permitir ao prestador consultar os serviços realizados e a situação dos recebimentos correspondentes. | CP2, CP4 |
| <a id="rf25"></a>RF25 | Reservar créditos | O sistema deve reservar o valor de uma contratação, tornando-o indisponível para outros usos. | CP4 |
| <a id="rf26"></a>RF26 | Liberar valores retidos | O sistema deve liberar os valores retidos de uma contratação encerrada para distribuição. | CP4, CP5 |
| <a id="rf27"></a>RF27 | Processar divisão de receita | O sistema deve dividir a receita de uma contratação entre prestador e plataforma. | CP4 |
| <a id="rf28"></a>RF28 | Processar saques | O sistema deve permitir ao prestador solicitar a transferência do saldo elegível para sua conta bancária e acompanhar o resultado do processamento. | CP4 |
| <a id="rf29"></a>RF29 | Comprar conteúdo | O sistema deve permitir ao consumidor adquirir guias ou tutoriais com créditos e registrar a compra. | CP3, CP4 |
| <a id="rf30"></a>RF30 | Acessar conteúdo adquirido | O sistema deve permitir ao comprador acessar os vídeos ou documentos correspondentes ao conteúdo adquirido. | CP3 |
| <a id="rf31"></a>RF31 | Registrar resultado da sessão | O sistema deve permitir que cada participante informe se a sessão ocorreu, não ocorreu ou apresentou problemas, incluindo justificativa quando aplicável. | CP5 |
| <a id="rf32"></a>RF32 | Avaliar participante | O sistema deve permitir ao consumidor avaliar o prestador e ao prestador avaliar o consumidor, registrando nota e comentário relativos à sessão. | CP6 |
| <a id="rf33"></a>RF33 | Avaliar conteúdo | O sistema deve permitir ao comprador registrar uma avaliação do guia ou tutorial adquirido. | CP6 |
| <a id="rf34"></a>RF34 | Calcular reputação | O sistema deve calcular a reputação do prestador a partir das avaliações válidas. | CP6 |
| <a id="rf35"></a>RF35 | Publicar avaliações | O sistema deve exibir as avaliações aos usuários conforme a política de publicação. | CP6 |
| <a id="rf36"></a>RF36 | Registrar denúncia | O sistema deve permitir registrar uma denúncia relacionada a usuário, contratação ou conteúdo, informando seu motivo. | CP5, CP6 |
| <a id="rf37"></a>RF37 | Apresentar relatos e evidências | O sistema deve permitir aos participantes de uma ocorrência apresentar relatos e evidências associados ao caso. | CP5, CP6 |
| <a id="rf38"></a>RF38 | Consultar denúncias e disputas | O sistema deve permitir à moderação consultar as ocorrências, os participantes e as evidências para as quais possui autorização. | CP7 |
| <a id="rf39"></a>RF39 | Registrar decisão de ocorrência | O sistema deve permitir à moderação registrar a decisão de uma ocorrência e as providências determinadas. | CP5, CP7 |
| <a id="rf40"></a>RF40 | Executar decisão financeira | O sistema deve executar a devolução, a liberação ou a divisão parcial dos valores determinada na decisão, registrando os valores e seus destinatários. | CP4, CP5, CP7 |
| <a id="rf41"></a>RF41 | Aplicar sanção a usuário | O sistema deve permitir à moderação aplicar sanções a consumidores e prestadores, incluindo banimento, registrando o motivo e o responsável. | CP6, CP7 |
| <a id="rf42"></a>RF42 | Encerrar ocorrência | O sistema deve permitir à moderação encerrar uma ocorrência, mantendo o registro de sua decisão. | CP5, CP7 |
| <a id="rf43"></a>RF43 | Notificar participantes | O sistema deve notificar os envolvidos sobre contratações, solicitações e respostas de reagendamento, cancelamentos, liberações automáticas e decisões de ocorrências. | CP5, CP6, CP7 |
| <a id="rf44"></a>RF44 | Consultar usuários | O sistema deve permitir à administração localizar usuários e consultar seus dados autorizados e suas sanções. | CP7 |
| <a id="rf45"></a>RF45 | Consultar contratações e transações | A administração deve conseguir consultar contratações e transações individuais, identificando participantes, valores e situações. | CP7 |
| <a id="rf46"></a>RF46 | Acompanhar movimentações financeiras | A administração deve conseguir acompanhar, de forma agregada, os repasses, as devoluções, os saques e as falhas de processamento. | CP4, CP7 |
| <a id="rf47"></a>RF47 | Configurar comissões | O sistema deve permitir à administração configurar a comissão padrão e as comissões específicas por modalidade e perfil de prestador. | CP4, CP7 |
| <a id="rf48"></a>RF48 | Configurar penalidades de cancelamento | A administração deve conseguir configurar as penalidades de cancelamento e os valores aplicados a elas. | CP4, CP5, CP7 |
| <a id="rf49"></a>RF49 | Gerenciar permissões administrativas | O sistema deve permitir ao responsável autorizado conceder e revogar permissões de administração e moderação. | CP7 |
| <a id="rf50"></a>RF50 | Cadastrar jogos do catálogo | A administração deve conseguir cadastrar e manter os jogos disponíveis no catálogo. | CP3, CP7 |
| <a id="rf51"></a>RF51 | Manter informações do site | O sistema deve permitir à administração atualizar as informações institucionais e básicas do site. | CP7 |

## 8.2 Lista de Requisitos Não Funcionais

Os requisitos não funcionais descrevem propriedades de qualidade e restrições do sistema. A classificação utiliza URPS+ e, para segurança e restrições organizacionais ou legislativas, a taxonomia de Sommerville. Cada requisito mantém seu identificador e a rastreabilidade com as características de produto (CP) às quais se aplica.

| Código | Nome | Descrição | Classificação | Critério verificável | Rastreabilidade |
| --- | --- | --- | --- | --- | --- |
| <a id="rnf01"></a>RNF01 | Autenticação em dois fatores | O sistema deve exigir um segundo fator nas operações definidas pela política de autenticação, utilizando os canais previstos de e-mail e telefone. | Sommerville — requisito de produto: segurança | Uma operação protegida não deve ser concluída sem a validação do segundo fator. | CP4, CP7 |
| <a id="rnf02"></a>RNF02 | Restrição de acesso | O sistema deve restringir o acesso a dados pessoais, dados bancários, denúncias e avaliações ainda não publicadas conforme o papel do usuário e a situação do registro. | Sommerville — requisito de produto: segurança | Tentativas de acesso sem autorização, inclusive diretamente pela API, devem ser recusadas. | CP1, CP2, CP3, CP4, CP5, CP6, CP7 |
| <a id="rnf03"></a>RNF03 | Auditabilidade administrativa | As alterações administrativas devem manter registros que identifiquem o responsável, o registro afetado e a alteração realizada. | Sommerville — requisito de produto: segurança e auditabilidade | Uma alteração administrativa registrada deve permitir identificar esses três elementos. | CP4, CP5, CP6, CP7 |
| <a id="rnf04"></a>RNF04 | Configurabilidade de taxas | O sistema deve permitir alterar taxas e comissões diretamente pelo painel administrativo, sem necessidade de modificar o código-fonte. | URPS+ — suportabilidade | Uma alteração autorizada no painel deve persistir e produzir efeito conforme as regras de vigência, sem alteração de código. | CP4, CP5, CP7 |
| <a id="rnf05"></a>RNF05 | Periodicidade do cálculo de reputação | O processamento de atualização da reputação deve ocorrer diariamente. | Sommerville — requisito organizacional: operacional | Deve ser possível verificar a execução do processamento em cada dia. | CP6 |
| <a id="rnf06"></a>RNF06 | Tecnologias de implementação | O sistema deve utilizar React no frontend e PHP no backend. | URPS+ — restrição de implementação | A implementação deve utilizar essas tecnologias nas respectivas camadas. | CP1, CP2, CP3, CP4, CP5, CP6, CP7 |
| <a id="rnf07"></a>RNF07 | Proteção de dados pessoais | O tratamento de dados pessoais deve observar os requisitos aplicáveis da LGPD. | Sommerville — requisito externo: legislativo | Os critérios específicos de verificação devem ser definidos a partir dos dados e tratamentos efetivamente adotados. | CP1, CP2, CP3, CP4, CP5, CP6, CP7 |
| <a id="rnf08"></a>RNF08 | Clareza das mensagens de validação | As mensagens de validação devem identificar o campo ou a operação com problema e indicar como corrigir a informação, em linguagem compreensível ao usuário. | URPS+ — usabilidade | Em uma entrada inválida, a mensagem deve permitir identificar o problema e a correção necessária. | CP1, CP2, CP3, CP4, CP5, CP6, CP7 |
| <a id="rnf09"></a>RNF09 | Consistência de reservas e transações | O sistema deve preservar a consistência das reservas e dos saldos diante de solicitações simultâneas ou repetidas. | URPS+ — confiabilidade | Solicitações concorrentes para o mesmo horário não devem gerar reserva dupla, e a repetição de uma mesma confirmação de pagamento não deve duplicar créditos. | CP2, CP3, CP4, CP5 |
| <a id="rnf10"></a>RNF10 | Identificação do usuário logado | O sistema deve exibir de forma visível, em todas as telas autenticadas, qual usuário está logado e seu papel (consumidor, prestador ou administração). | URPS+ — usabilidade | Em qualquer tela acessada após autenticação, deve ser possível identificar o usuário logado e seu papel. | CP1, CP2, CP3, CP4, CP5, CP6, CP7 |
| <a id="rnf11"></a>RNF11 | Confirmação em ações irreversíveis | O sistema deve solicitar confirmação explícita do usuário antes de executar ações irreversíveis, como cancelar uma contratação, encerrar uma oferta ou aplicar sanção a um usuário. | URPS+ — usabilidade | Uma ação irreversível não deve ser concluída sem uma etapa de confirmação explícita do usuário. | CP3, CP5, CP6, CP7 |
| <a id="rnf12"></a>RNF12 | Consistência visual entre telas | O sistema deve manter um padrão visual consistente de cores, tipografia, botões e espaçamentos em todas as telas, seguindo um guia de estilo definido. | URPS+ — usabilidade | As telas do sistema devem seguir o mesmo guia de estilo, sem divergências de padrão entre elas. | CP1, CP2, CP3, CP4, CP5, CP6, CP7 |

## 8.3 Matriz-síntese de rastreabilidade

A matriz relaciona as contribuições principal e secundária para os objetivos específicos (OE), as características de produto (CP), seu valor de negócio (VN), os requisitos funcionais e os não funcionais relacionados. Os objetivos e os valores de negócio estão definidos na [seção 2.3](solucao-proposta.md#23-caracteristicas-de-produto-cp).

| Contribuição principal | Contribuição secundária | CP | Valor de negócio (VN) | RFs relacionados | RNFs relacionados |
| --- | --- | --- | --- | --- | --- |
| OE3 | OE1 | CP1 | Redução de anúncio falso de nível técnico | [RF06](#rf06), [RF07](#rf07) | [RNF02](#rnf02), [RNF06](#rnf06), [RNF07](#rnf07), [RNF08](#rnf08), [RNF10](#rnf10), [RNF12](#rnf12) |
| OE4 | OE1 | CP2 | Permite ao consumidor escolher por adequação, não só por ranque | [RF04](#rf04), [RF07](#rf07), [RF08](#rf08), [RF14](#rf14), [RF15](#rf15), [RF24](#rf24) | [RNF02](#rnf02), [RNF06](#rnf06), [RNF07](#rnf07), [RNF08](#rnf08), [RNF09](#rnf09), [RNF10](#rnf10), [RNF12](#rnf12) |
| OE1 | OE6 | CP3 | Conecta oferta e demanda de forma estruturada | [RF09](#rf09), [RF10](#rf10), [RF11](#rf11), [RF12](#rf12), [RF13](#rf13), [RF15](#rf15), [RF16](#rf16), [RF19](#rf19), [RF20](#rf20), [RF21](#rf21), [RF29](#rf29), [RF30](#rf30), [RF50](#rf50) | [RNF02](#rnf02), [RNF06](#rnf06), [RNF07](#rnf07), [RNF08](#rnf08), [RNF09](#rnf09), [RNF10](#rnf10), [RNF11](#rnf11), [RNF12](#rnf12) |
| OE2 | OE1 | CP4 | Redução de inadimplência e quebra de acordo | [RF05](#rf05), [RF22](#rf22), [RF23](#rf23), [RF24](#rf24), [RF25](#rf25), [RF26](#rf26), [RF27](#rf27), [RF28](#rf28), [RF29](#rf29), [RF40](#rf40), [RF46](#rf46), [RF47](#rf47), [RF48](#rf48) | [RNF01](#rnf01), [RNF02](#rnf02), [RNF03](#rnf03), [RNF04](#rnf04), [RNF06](#rnf06), [RNF07](#rnf07), [RNF08](#rnf08), [RNF09](#rnf09), [RNF10](#rnf10), [RNF12](#rnf12) |
| OE2 | OE5 | CP5 | Torna a custódia operável na prática | [RF16](#rf16), [RF17](#rf17), [RF18](#rf18), [RF21](#rf21), [RF26](#rf26), [RF31](#rf31), [RF36](#rf36), [RF37](#rf37), [RF39](#rf39), [RF40](#rf40), [RF42](#rf42), [RF43](#rf43), [RF48](#rf48) | [RNF02](#rnf02), [RNF03](#rnf03), [RNF04](#rnf04), [RNF06](#rnf06), [RNF07](#rnf07), [RNF08](#rnf08), [RNF09](#rnf09), [RNF10](#rnf10), [RNF11](#rnf11), [RNF12](#rnf12) |
| OE5 | OE4 | CP6 | Qualidade do serviço com risco de abuso controlado | [RF32](#rf32), [RF33](#rf33), [RF34](#rf34), [RF35](#rf35), [RF36](#rf36), [RF37](#rf37), [RF41](#rf41), [RF43](#rf43) | [RNF02](#rnf02), [RNF03](#rnf03), [RNF05](#rnf05), [RNF06](#rnf06), [RNF07](#rnf07), [RNF08](#rnf08), [RNF10](#rnf10), [RNF11](#rnf11), [RNF12](#rnf12) |
| OE6 | OE2 | CP7 | Operação segura e escalável | [RF01](#rf01), [RF02](#rf02), [RF03](#rf03), [RF38](#rf38), [RF39](#rf39), [RF40](#rf40), [RF41](#rf41), [RF42](#rf42), [RF43](#rf43), [RF44](#rf44), [RF45](#rf45), [RF46](#rf46), [RF47](#rf47), [RF48](#rf48), [RF49](#rf49), [RF50](#rf50), [RF51](#rf51) | [RNF01](#rnf01), [RNF02](#rnf02), [RNF03](#rnf03), [RNF04](#rnf04), [RNF06](#rnf06), [RNF07](#rnf07), [RNF08](#rnf08), [RNF10](#rnf10), [RNF11](#rnf11), [RNF12](#rnf12) |

