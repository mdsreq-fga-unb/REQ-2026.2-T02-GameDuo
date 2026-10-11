# 13 Regras de Negócio

Esta seção apresenta as regras de negócio já estabelecidas para o MVP do GameDuo, organizadas por área e relacionadas aos [requisitos de software](requisitos-software.md). Os códigos RN01 a RN42 identificam as condições, permissões, restrições e cálculos aplicáveis ao recorte da entrega.

## 13.1 Conta, acesso e prestação

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn01"></a>RN01 | Uma mesma conta pode atuar como consumidora e prestadora de serviços, sem exigir um segundo cadastro. | RF01, RF04. |
| <a id="rn02"></a>RN02 | Visitantes podem consultar o catálogo sem autenticação, mas precisam estar autenticados para contratar um serviço. | RF02, RF07, RF09, RF10, RF16. |
| <a id="rn03"></a>RN03 | O cadastro de usuário exige nickname, e-mail, senha e telefone. O nickname é a identificação pública prevista no requisito. | RF01. |
| <a id="rn04"></a>RN04 | A definição de uma nova senha por recuperação depende da validação da solicitação de recuperação. | RF03. |
| <a id="rn05"></a>RN05 | Para atuar como prestador, o usuário deve configurar seu perfil de prestação, informando apresentação, jogos e respectivos níveis declarados, modalidades, formatos de atendimento e idiomas. | RF04. |
| <a id="rn06"></a>RN06 | O prestador deve fornecer dados de recebimento. Para realizar saque por Pix, deve possuir chave Pix e CPF cadastrados. | RF05. |
| <a id="rn07"></a>RN07 | Configurar o perfil de prestação não retira da conta a possibilidade de contratar serviços como consumidora. | RF04, RF16. |

## 13.2 Ofertas e catálogo

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn08"></a>RN08 | As ofertas de serviços desta entrega são das modalidades coaching e duo. | RF11 e recorte do MVP. |
| <a id="rn09"></a>RN09 | A oferta deve identificar jogo, modalidade, descrição, duração, preço, disponibilidade, forma de comunicação e condições aplicáveis ao serviço. | RF10, RF11. |
| <a id="rn10"></a>RN10 | A oferta passa a integrar o catálogo após sua publicação. | RF11. |
| <a id="rn11"></a>RN11 | O encerramento de uma oferta retira essa oferta do catálogo, impedindo novas contratações por esse anúncio. | RF13. |
| <a id="rn12"></a>RN12 | Uma alteração no preço anunciado não modifica o preço de uma contratação já realizada; o prestador deve honrar o valor contratado. | RF11, RF16. |
| <a id="rn13"></a>RN13 | O nível de jogo informado pelo prestador é declarado por ele. A entrega selecionada não inclui sua verificação por integração com o jogo. | RF04, RF07 e exclusão de RF06. |
| <a id="rn14"></a>RN14 | A manutenção dos jogos disponíveis no catálogo é uma atribuição administrativa. | RF50. |

## 13.3 Agenda e contratação

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn15"></a>RN15 | A disponibilidade de atendimento é definida pelo prestador em uma agenda semanal com dias e intervalos de horário, por serviço. | RF14. |
| <a id="rn16"></a>RN16 | O consumidor só pode contratar um horário compatível com a disponibilidade publicada pelo prestador. | RF15, RF16. |
| <a id="rn17"></a>RN17 | A contratação é registrada automaticamente a partir da seleção de um horário disponível e do atendimento das condições de contratação, sem uma etapa adicional de aceite do prestador. | RF16. |
| <a id="rn18"></a>RN18 | O consumidor precisa possuir créditos disponíveis suficientes para cobrir o preço do serviço antes de concluir a contratação. | RF16, RF23, RF25. |
| <a id="rn19"></a>RN19 | A contratação deve reservar o valor correspondente ao serviço. Os créditos reservados ficam indisponíveis para outros usos. | RF25. |
| <a id="rn20"></a>RN20 | Um mesmo horário não pode gerar reservas conflitantes de atendimento. | RF14, RF16, [RNF09](requisitos-software.md#rnf09). |
| <a id="rn21"></a>RN21 | Após a contratação, consumidor e prestador recebem uma forma de contato entre si para viabilizar o atendimento, preferencialmente um servidor do Discord da GameDuo. | Fluxograma; RF10, RF16. |

## 13.4 Créditos e carteira

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn22"></a>RN22 | A aquisição de créditos pelo consumidor ocorre por meio de combos. | RF22. |
| <a id="rn23"></a>RN23 | Créditos comprados só ficam disponíveis após a confirmação do pagamento. | RF22, RF23. |
| <a id="rn24"></a>RN24 | Saldos disponíveis, retidos e pendentes possuem situações distintas; valores retidos ou pendentes não são saldo disponível para nova contratação. A carteira do prestador distingue saldo disponível para saque, saldo em carência e saldo comprometido em saques em andamento. | RF23, RF25. |
| <a id="rn25"></a>RN25 | Uma mesma operação financeira não pode produzir créditos, débitos ou repasses duplicados. Uma mesma confirmação de pagamento não pode creditar duas vezes e uma mesma sessão não pode gerar dois pagamentos ao prestador. | [RNF13](requisitos-software.md#rnf13). |
| <a id="rn26"></a>RN26 | O valor recebido pelo prestador permanece como saldo na plataforma, podendo ser destinado a saque ou utilizado pelo próprio prestador no site. | RF23, RF28 e anotação validada. |
| Observação | Limite da RN26: o direito de reutilizar o saldo está registrado. A equivalência entre saldo de recebimento, créditos de consumo e dinheiro ainda precisa ser definida. | — |

## 13.5 Cancelamento, resultado e atendimento

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn27"></a>RN27 | Tanto o consumidor quanto o prestador podem cancelar uma contratação. | RF18. |
| <a id="rn28"></a>RN28 | Cada participante pode informar o resultado da sessão: ocorreu, não ocorreu ou apresentou problemas, com justificativa quando aplicável. | RF31. |
| <a id="rn29"></a>RN29 | Os participantes dispõem de 48 horas para confirmar a realização da sessão. | RF31 e fluxograma. |
| <a id="rn30"></a>RN30 | Quando apenas uma das partes confirma ou nenhuma confirma, o fluxo prevê aguardar 48 horas e, após o prazo, considerar a sessão realizada e prosseguir com a liberação financeira, desde que não exista disputa ou contestação aplicável. O mecanismo de bloqueio por reclamação no SAC precisa ser definido para o MVP. | RF26, RF31. |
| <a id="rn31"></a>RN31 | Quando o serviço não ocorre, o participante deve recorrer ao e-mail de SAC indicado para atendimento. | Fluxograma; relação com RF31 e RF38. |
| <a id="rn32"></a>RN32 | A conclusão da contratação permite liberar os valores retidos para distribuição e reconhecer o valor devido ao prestador. Isso não implica disponibilidade imediata para saque: aplica-se a carência financeira de 30 dias, conforme [RN40](#rn40). | RF26. |

## 13.6 Divisão de receita e saque

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn33"></a>RN33 | A divisão padrão da receita da contratação é de 70% para o prestador e 30% para a plataforma. | RF27 e fluxograma. |
| <a id="rn34"></a>RN34 | Alterações posteriores na comissão padrão não modificam as condições de divisão das contratações anteriores. | Anotação validada; RF27. |
| <a id="rn35"></a>RN35 | O prestador solicita o saque do saldo disponível para a chave Pix cadastrada, respeitando os dados exigidos, o valor mínimo e a reserva do valor solicitado. | RF05, RF28. |

## 13.7 Administração e autorização

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn36"></a>RN36 | O acesso à área administrativa depende de autorização administrativa, além da autenticação. | RF02, RF38, RF44, RF50, [RNF02](requisitos-software.md#rnf02). |
| <a id="rn37"></a>RN37 | A administração e a moderação só podem consultar dados de usuários, ocorrências, participantes e evidências para os quais possuam autorização. | RF38, RF44, [RNF02](requisitos-software.md#rnf02). |
| <a id="rn38"></a>RN38 | O cliente responsável pelo negócio também exercerá inicialmente a função de moderador, conforme a anotação do fluxo. | RF38 e anotação validada. |

## 13.8 Regras financeiras complementares — evidências de pagamentos

| Código | Regra de negócio | Rastreabilidade |
| --- | --- | --- |
| <a id="rn39"></a>RN39 | A compra de combos de créditos pode ser paga por Pix ou cartão. | RF22; PDF de pagamentos, p. 2. |
| <a id="rn40"></a>RN40 | Os valores devidos ao prestador ficam sujeitos a uma carência de 30 dias antes de se tornarem disponíveis para saque. | RF23, RF28; PDF, pp. 2 e 4. Alinhar o início da contagem nos casos de confirmação antecipada e conclusão automática. |
| <a id="rn41"></a>RN41 | Ao solicitar um saque, o valor solicitado deve ser reservado e deixar de compor o saldo disponível, impedindo que seja comprometido novamente em outro saque. | RF23, RF28; [RNF13](requisitos-software.md#rnf13); PDF, pp. 2 e 4. |
| <a id="rn42"></a>RN42 | A solicitação de saque deve respeitar um valor mínimo permitido. | RF28; PDF, pp. 2 e 4. O valor mínimo não está informado e permanece pendente. |


