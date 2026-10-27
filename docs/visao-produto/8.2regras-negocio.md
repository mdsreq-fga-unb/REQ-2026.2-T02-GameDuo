# 8.4 Regras de Negócio

Esta seção apresenta as regras de negócio já estabelecidas para o MVP do GameDuo, organizadas por área e relacionadas aos [requisitos de software](requisitos-software.md). Os códigos RN01 a RN43 identificam as condições, permissões, restrições e cálculos do produto. As subseções 8.4.1 a 8.4.8 reúnem as regras aplicáveis ao recorte da entrega, e a [subseção 8.4.9](#849-regras-previstas-para-versoes-futuras) reúne as regras previstas para versões futuras.

## 8.4.1 Conta, acesso e prestação

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn01"></a>RN01 | Uma mesma conta pode atuar como consumidora e prestadora de serviços, sem exigir um segundo cadastro. | RF01, RF04. |
| <a id="rn02"></a>RN02 | Visitantes podem consultar o catálogo sem autenticação, mas precisam estar autenticados para contratar um serviço. | RF02, RF07, RF09, RF10, RF16. |
| <a id="rn03"></a>RN03 | O cadastro de usuário exige nickname, e-mail, senha e telefone. O nickname é a identificação pública prevista no requisito. | RF01. |
| <a id="rn04"></a>RN04 | A redefinição de senha só é concluída por meio de código ou link enviado ao e-mail ou telefone já cadastrado na conta. O código é de uso único e expira após 30 minutos; após a redefinição, a senha anterior deixa de ser aceita. | RF03. |
| <a id="rn05"></a>RN05 | Para atuar como prestador, o usuário deve configurar seu perfil de prestação, informando apresentação, jogos e respectivos níveis declarados, modalidades, formatos de atendimento e idiomas. | RF04. |
| <a id="rn06"></a>RN06 | O prestador deve fornecer dados de recebimento. Para realizar saque por Pix, deve possuir chave Pix e CPF cadastrados. | RF05. |
| <a id="rn07"></a>RN07 | Configurar o perfil de prestação não retira da conta a possibilidade de contratar serviços como consumidora. | RF04, RF16. |

## 8.4.2 Ofertas e catálogo

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn08"></a>RN08 | As ofertas de serviços desta entrega são das modalidades coaching e duo. | RF11 e recorte do MVP. |
| <a id="rn09"></a>RN09 | A oferta deve identificar jogo, modalidade, descrição, duração, preço, disponibilidade, forma de comunicação e condições aplicáveis ao serviço. | RF10, RF11. |
| <a id="rn10"></a>RN10 | A oferta passa a integrar o catálogo após sua publicação. | RF11. |
| <a id="rn11"></a>RN11 | O encerramento de uma oferta retira essa oferta do catálogo, impedindo novas contratações por esse anúncio. | RF13. |
| <a id="rn12"></a>RN12 | Uma alteração no preço anunciado não modifica o preço de uma contratação já realizada; o prestador deve honrar o valor contratado. | RF11, RF16. |
| <a id="rn13"></a>RN13 | O nível de jogo informado pelo prestador é declarado por ele. A entrega selecionada não inclui sua verificação por integração com o jogo. | RF04, RF07 e exclusão de RF06. |
| <a id="rn14"></a>RN14 | A manutenção dos jogos disponíveis no catálogo é uma atribuição administrativa. | RF50. |

## 8.4.3 Agenda e contratação

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn15"></a>RN15 | A disponibilidade de atendimento é definida pelo prestador em uma agenda semanal com dias e intervalos de horário, por serviço. | RF14. |
| <a id="rn16"></a>RN16 | O consumidor só pode contratar um horário compatível com a disponibilidade publicada pelo prestador. | RF15, RF16. |
| <a id="rn17"></a>RN17 | A contratação é registrada automaticamente a partir da seleção de um horário disponível e do atendimento das condições de contratação, sem uma etapa adicional de aceite do prestador. | RF16. |
| <a id="rn18"></a>RN18 | O consumidor precisa possuir créditos disponíveis suficientes para cobrir o preço do serviço antes de concluir a contratação. | RF16, RF23, RF25. |
| <a id="rn19"></a>RN19 | A contratação deve reservar o valor correspondente ao serviço. Os créditos reservados ficam indisponíveis para outros usos. | RF25. |
| <a id="rn20"></a>RN20 | Um prestador não pode ter duas contratações com horários sobrepostos, ainda que pertençam a ofertas diferentes. Ao ser contratado, o horário deixa de estar disponível em todas as ofertas do prestador. | RF14, RF15, RF16, [RNF09](requisitos-software.md#rnf09). |
| <a id="rn21"></a>RN21 | Após a contratação, consumidor e prestador recebem uma forma de contato entre si para viabilizar o atendimento, conforme a forma de comunicação informada na oferta. | RF10, RF16. |

## 8.4.4 Créditos e carteira

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn22"></a>RN22 | A aquisição de créditos pelo consumidor ocorre por meio de combos. | RF22. |
| <a id="rn23"></a>RN23 | Créditos comprados só ficam disponíveis após a confirmação do pagamento. | RF22, RF23. |
| <a id="rn24"></a>RN24 | Saldos disponíveis, retidos e pendentes possuem situações distintas; valores retidos ou pendentes não são saldo disponível para nova contratação. A carteira do prestador distingue saldo disponível para saque, saldo em carência e saldo comprometido em saques em andamento. | RF23, RF25. |
| <a id="rn25"></a>RN25 | Uma mesma operação financeira não pode produzir créditos, débitos ou repasses duplicados. Uma mesma confirmação de pagamento não pode creditar duas vezes e uma mesma sessão não pode gerar dois pagamentos ao prestador. | [RNF13](requisitos-software.md#rnf13). |
| <a id="rn26"></a>RN26 | O valor recebido pelo prestador permanece como saldo na plataforma e pode ser destinado a saque. | RF23, RF28 e anotação validada. |

## 8.4.5 Cancelamento, resultado e atendimento

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn27"></a>RN27 | Tanto o consumidor quanto o prestador podem cancelar uma contratação. No MVP, o cancelamento devolve integralmente ao consumidor os créditos reservados. | RF18, RF25. |
| <a id="rn28"></a>RN28 | Cada participante pode informar o resultado da sessão: ocorreu, não ocorreu ou apresentou problemas, com justificativa quando aplicável. | RF31. |
| <a id="rn29"></a>RN29 | Os participantes dispõem de 48 horas para confirmar a realização da sessão. | RF31 e fluxograma. |
| <a id="rn30"></a>RN30 | Se qualquer participante registrar que a sessão não ocorreu ou apresentou problemas, a liberação automática é suspensa e o valor permanece retido até a análise da administração. Sem esse registro, encerrado o prazo de 48 horas, a sessão é considerada realizada e segue para a liberação financeira. | RF26, RF31, RF38. |
| <a id="rn31"></a>RN31 | Além do registro no resultado da sessão, o participante pode detalhar o ocorrido e enviar evidências pelo canal de atendimento informado pela plataforma. | Fluxograma; RF31, RF38. |
| <a id="rn32"></a>RN32 | A conclusão da contratação permite liberar os valores retidos para distribuição e reconhecer o valor devido ao prestador. Isso não implica disponibilidade imediata para saque: aplica-se a carência financeira de 30 dias, conforme [RN40](#rn40). | RF26. |

## 8.4.6 Divisão de receita e saque

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn33"></a>RN33 | No MVP, a divisão da receita da contratação é fixa: 70% para o prestador e 30% para a plataforma. | RF27 e fluxograma. |
| <a id="rn35"></a>RN35 | O prestador solicita o saque do saldo disponível para a chave Pix cadastrada, respeitando os dados exigidos, o valor mínimo e a reserva do valor solicitado. | RF05, RF28. |

## 8.4.7 Administração e autorização

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn36"></a>RN36 | O acesso à área administrativa depende de autorização administrativa, além da autenticação. | RF02, RF38, RF44, RF50, [RNF02](requisitos-software.md#rnf02). |
| <a id="rn37"></a>RN37 | A administração e a moderação só podem consultar dados de usuários, ocorrências, participantes e evidências para os quais possuam autorização. | RF38, RF44, [RNF02](requisitos-software.md#rnf02). |
| <a id="rn38"></a>RN38 | O cliente responsável pelo negócio também exercerá inicialmente a função de moderador, conforme a anotação do fluxo. | RF38 e anotação validada. |

## 8.4.8 Regras financeiras complementares — evidências de pagamentos

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn39"></a>RN39 | A compra de combos de créditos pode ser paga por Pix ou cartão. | RF22; PDF de pagamentos, p. 2. |
| <a id="rn40"></a>RN40 | Os valores devidos ao prestador ficam sujeitos a uma carência de 30 dias antes de se tornarem disponíveis para saque. | RF23, RF28; PDF, pp. 2 e 4. Alinhar o início da contagem nos casos de confirmação antecipada e conclusão automática. |
| <a id="rn41"></a>RN41 | Ao solicitar um saque, o valor solicitado deve ser reservado e deixar de compor o saldo disponível, impedindo que seja comprometido novamente em outro saque. | RF23, RF28; [RNF13](requisitos-software.md#rnf13); PDF, pp. 2 e 4. |
| <a id="rn42"></a>RN42 | A solicitação de saque deve respeitar um valor mínimo permitido. | RF28; PDF, pp. 2 e 4. O valor mínimo não está informado e permanece pendente. |

## 8.4.9 Regras previstas para versões futuras

As regras abaixo foram validadas com o cliente, mas dependem de funcionalidades que não fazem parte do MVP. Elas permanecem registradas para orientar as próximas versões do produto.

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn34"></a>RN34 | Alterações posteriores na comissão não modificam as condições de divisão das contratações anteriores; aplica-se a comissão vigente na data da contratação. | Anotação validada; RF27, RF47. |
| <a id="rn43"></a>RN43 | O prestador pode utilizar o saldo recebido para contratar serviços na plataforma, conforme regra de equivalência entre saldo de recebimento e créditos de consumo a ser definida com o cliente. | Anotação validada; RF16, RF23, RF25. |


