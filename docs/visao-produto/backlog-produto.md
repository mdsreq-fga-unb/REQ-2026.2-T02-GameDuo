# 10 Backlog de Produto

O backlog do GameDuo reúne as funcionalidades previstas para o produto e explicita o recorte selecionado para o Produto Mínimo Viável (MVP). Esta seção consolida os **54 requisitos funcionais e 16 requisitos não funcionais** da [seção 8](requisitos-software.md), a avaliação de valor de negócio, a estimativa técnica da equipe e a seleção registrada no quadro “MVP Definido”.

O MVP registrado contém **24 RFs e nove RNFs**, sendo dois RNFs aplicados parcialmente às funcionalidades selecionadas. A inclusão no backlog ou no MVP representa escopo planejado; não indica implementação concluída nem substitui os critérios de [DoR e DoD](dordod.md).

## 10.1 Backlog Geral

O backlog geral contempla a jornada completa: acesso e perfil, catálogo, oferta e contratação de coaching e duo, conteúdos digitais, créditos e pagamentos, conclusão de sessões, reputação, moderação e administração. A coluna **MVP** identifica o recorte atual; os demais itens permanecem no backlog para evolução do produto.

Os códigos e nomes seguem a seção 8. O link de cada requisito leva à sua descrição e rastreabilidade. As características de produto (CP) conectam o backlog aos [objetivos e valores de negócio](solucao-proposta.md#23-caracteristicas-de-produto-cp). As classificações de valor e esforço são detalhadas em [10.2](#102-priorizacao-do-backlog-geral-e-mvp).

### 10.1.1 Fluxograma completo

O quadro abaixo apresenta o fluxo completo do produto. A incorporação está direcionada à seção **“Fluxograma”** do FigJam; o fluxo específico do MVP aparece em 10.2.

<iframe src="https://embed.figma.com/board/LH2mEi8MRBysizoEl4KS4D/Untitled?node-id=2-13&amp;viewport-controls=true&amp;embed-host=share" title="Fluxograma completo do GameDuo" width="100%" height="600" style="border: 0;" allowfullscreen loading="lazy"></iframe>

[Abrir fluxograma completo do GameDuo no Figma](https://www.figma.com/board/LH2mEi8MRBysizoEl4KS4D/Untitled?node-id=2-13){ target="_blank" rel="noopener" }

### 10.1.2 Itens do backlog geral

**Legenda:** VB = valor de negócio (1 a 4); ET = esforço técnico consolidado (1 a 4). “Sim” indica seleção no quadro do MVP, observados os limites descritos em 10.2.4. A ordem por código facilita a consulta; a prioridade é expressa pela classificação de valor, pelo esforço e pelo recorte selecionado, sem presumir uma ordem de implementação.

| Requisito | Funcionalidade | CP | Valor de negócio (VB) | ET | MVP |
| --- | --- | --- | --- | --- | --- |
| [RF01](requisitos-software.md#rf01) | Cadastrar usuários | CP7 | Must Have (4) | 2 | Sim |
| [RF02](requisitos-software.md#rf02) | Autenticar usuários | CP7 | Must Have (4) | 2 | Sim |
| [RF03](requisitos-software.md#rf03) | Recuperar senha | CP7 | Should Have (3) | 2 | Sim |
| [RF04](requisitos-software.md#rf04) | Configurar perfil de prestação | CP2 | Must Have (4) | 2 | Sim |
| [RF05](requisitos-software.md#rf05) | Manter dados de recebimento | CP4 | Must Have (4) | 2 | Sim |
| [RF06](requisitos-software.md#rf06) | Verificar credencial de jogo | CP1 | Won’t Have (1) | 3 | Não |
| [RF07](requisitos-software.md#rf07) | Consultar perfil de prestador | CP1, CP2 | Must Have (4) | 2 | Sim |
| [RF08](requisitos-software.md#rf08) | Calcular indicadores de atendimento | CP2 | Could Have (2) | 3 | Não |
| [RF09](requisitos-software.md#rf09) | Filtrar ofertas do catálogo | CP3 | Could Have (2) | 1 | Sim |
| [RF10](requisitos-software.md#rf10) | Consultar detalhes de oferta | CP3 | Must Have (4) | 2 | Sim |
| [RF11](requisitos-software.md#rf11) | Manter ofertas | CP3 | Must Have (4) | 3 | Sim |
| [RF12](requisitos-software.md#rf12) | Pausar oferta | CP3 | Won’t Have (1) | 3 | Não |
| [RF13](requisitos-software.md#rf13) | Encerrar oferta | CP3 | Must Have (4) | 1 | Sim |
| [RF14](requisitos-software.md#rf14) | Configurar agenda semanal | CP2 | Must Have (4) | 4 | Sim |
| [RF15](requisitos-software.md#rf15) | Consultar disponibilidade de atendimento | CP2, CP3 | Must Have (4) | 2 | Sim |
| [RF16](requisitos-software.md#rf16) | Agendar serviço | CP3, CP5 | Must Have (4) | 2 | Sim |
| [RF17](requisitos-software.md#rf17) | Reagendar serviço | CP5 | Won’t Have (1) | 4 | Não |
| [RF18](requisitos-software.md#rf18) | Cancelar contratação | CP5 | Must Have (4) | 1 | Sim |
| [RF19](requisitos-software.md#rf19) | Publicar solicitação de serviço | CP3 | Won’t Have (1) | 3 | Não |
| [RF20](requisitos-software.md#rf20) | Oferecer atendimento a solicitações de serviço | CP3 | Won’t Have (1) | 3 | Não |
| [RF21](requisitos-software.md#rf21) | Selecionar prestador para solicitações | CP3, CP5 | Won’t Have (1) | 2 | Não |
| [RF22](requisitos-software.md#rf22) | Comprar combo de créditos | CP4 | Must Have (4) | 3 | Sim |
| [RF23](requisitos-software.md#rf23) | Consultar carteira | CP4 | Must Have (4) | 4 | Sim |
| [RF24](requisitos-software.md#rf24) | Consultar histórico de prestação | CP2, CP4 | Must Have (4) | 3 | Não |
| [RF25](requisitos-software.md#rf25) | Reservar créditos | CP4 | Must Have (4) | 2 | Sim |
| [RF26](requisitos-software.md#rf26) | Liberar valores retidos | CP4, CP5 | Must Have (4) | 4 | Sim |
| [RF27](requisitos-software.md#rf27) | Processar divisão de receita | CP4 | Must Have (4) | 2 | Sim |
| [RF28](requisitos-software.md#rf28) | Processar saques | CP4 | Must Have (4) | 4 | Sim |
| [RF29](requisitos-software.md#rf29) | Comprar conteúdo | CP3, CP4 | Won’t Have (1) | 4 | Não |
| [RF30](requisitos-software.md#rf30) | Acessar conteúdo adquirido | CP3 | Won’t Have (1) | 1 | Não |
| [RF31](requisitos-software.md#rf31) | Registrar resultado da sessão | CP5 | Could Have (2) | 2 | Sim |
| [RF32](requisitos-software.md#rf32) | Avaliar participante | CP6 | Could Have (2) | 2 | Não |
| [RF33](requisitos-software.md#rf33) | Avaliar conteúdo | CP6 | Won’t Have (1) | 2 | Não |
| [RF34](requisitos-software.md#rf34) | Calcular reputação | CP6 | Could Have (2) | 2 | Não |
| [RF35](requisitos-software.md#rf35) | Publicar avaliações | CP6 | Could Have (2) | 2 | Não |
| [RF36](requisitos-software.md#rf36) | Registrar denúncia | CP5, CP6 | Should Have (3) | 4 | Não |
| [RF37](requisitos-software.md#rf37) | Apresentar relatos e evidências | CP5, CP6 | Should Have (3) | 3 | Não |
| [RF38](requisitos-software.md#rf38) | Consultar denúncias e disputas | CP7 | Should Have (3) | 2 | Sim |
| [RF39](requisitos-software.md#rf39) | Registrar decisão de ocorrência | CP5, CP7 | Could Have (2) | 2 | Não |
| [RF40](requisitos-software.md#rf40) | Executar decisão financeira | CP4, CP5, CP7 | Should Have (3) | 3 | Não |
| [RF41](requisitos-software.md#rf41) | Aplicar sanção a usuário | CP6, CP7 | Should Have (3) | 3 | Não |
| [RF42](requisitos-software.md#rf42) | Encerrar ocorrência | CP5, CP7 | Could Have (2) | 2 | Não |
| [RF43](requisitos-software.md#rf43) | Notificar participantes | CP5, CP6, CP7 | Could Have (2) | 2 | Não |
| [RF44](requisitos-software.md#rf44) | Consultar usuários | CP7 | Should Have (3) | 2 | Sim |
| [RF45](requisitos-software.md#rf45) | Consultar contratações e transações | CP7 | Should Have (3) | 3 | Não |
| [RF46](requisitos-software.md#rf46) | Acompanhar movimentações financeiras | CP4, CP7 | Should Have (3) | 3 | Não |
| [RF47](requisitos-software.md#rf47) | Configurar comissões | CP4, CP7 | Could Have (2) | 2 | Não |
| [RF48](requisitos-software.md#rf48) | Configurar penalidades de cancelamento | CP4, CP5, CP7 | Won’t Have (1) | 2 | Não |
| [RF49](requisitos-software.md#rf49) | Gerenciar permissões administrativas | CP7 | Won’t Have (1) | 3 | Não |
| [RF50](requisitos-software.md#rf50) | Manter jogos do catálogo | CP3, CP7 | Must Have (4) | 3 | Sim |
| [RF51](requisitos-software.md#rf51) | Atualizar informações institucionais | CP7 | Won’t Have (1) | 1 | Não |
| [RF52](requisitos-software.md#rf52) | Consultar solicitações de serviço | CP3 | Won’t Have (1) | 3 | Não |
| [RF53](requisitos-software.md#rf53) | Consultar ofertas de atendimento | CP3 | Won’t Have (1) | 3 | Não |
| [RF54](requisitos-software.md#rf54) | Consultar histórico de compras | CP3, CP4, CP5 | Won’t Have (1) | 4 | Não |

## 10.2 Priorização do Backlog Geral e MVP

### 10.2.1 Valor de negócio

A [avaliação de valor de negócio](https://docs.google.com/document/d/1HhDgSDIEJp5t9xpYDn8xLkNaL_4tb1luNdroymRgHyE/edit) utiliza MoSCoW com quatro níveis:

| Classificação | Valor | Interpretação |
| --- | --- | --- |
| Must Have | 4 | Muito importante para resolver o problema ou viabilizar o produto. |
| Should Have | 3 | Muito importante, mas o fluxo central ainda funciona temporariamente sem o requisito. |
| Could Have | 2 | Agrega valor e pode ser adiado sem comprometer o objetivo principal. |
| Won’t Have | 1 | Não prioritário para a versão atual; permanece registrado para evolução. |

Essa classificação registra a avaliação de negócio. A seleção do MVP também considera esforço técnico, dependências e o recorte documentado pela equipe. Por isso, **MoSCoW e pertencimento ao MVP são informações distintas**.

### 10.2.2 Esforço técnico

A [avaliação de esforço técnico](https://docs.google.com/document/d/1Hxlh8ZO2rxC6jZqPk88HC0XBVaTiWfxHmDVx5BruZbI/edit) atribui notas de 1 a 4 a três dimensões:

| Nota | Esforço estimado (E) | Complexidade (C) | Necessidade de capacitação da equipe (CE) |
| --- | --- | --- | --- |
| 1 | Até 2 horas | Solução conhecida, com poucas dependências | Domínio pleno dos conhecimentos necessários |
| 2 | Entre 2 e 6 horas | Alguma investigação ou integração | Conhecimento suficiente, com pouca aprendizagem adicional |
| 3 | Entre 6 e 12 horas | Várias dependências ou incertezas técnicas | Necessidade de desenvolver conhecimentos relevantes |
| 4 | Mais de 12 horas | Incerteza elevada, integração crítica ou tecnologia não dominada | Conhecimentos ou recursos necessários ainda indisponíveis |

**ET = arredondamento de (E + C + CE) / 3.** Uma parte decimal a partir de 0,5 arredonda para cima; abaixo de 0,5, para baixo. Quanto maior a nota de CE, maior a lacuna de conhecimento ou recursos, e maior sua contribuição para o esforço técnico.

As faixas de horas reproduzem a estimativa relativa do documento e não constituem compromisso de prazo. O documento repete o rótulo “Esforço Moderado” na nota 4; foi preservado seu significado numérico e a faixa “mais de 12 horas”.

<details markdown="1">
<summary>Consultar as notas de esforço, complexidade e capacidade por requisito</summary>

| Requisito | E | C | CE | ET arredondado |
| --- | --- | --- | --- | --- |
| [RF01](requisitos-software.md#rf01) | 1 | 2 | 2 | 2 |
| [RF02](requisitos-software.md#rf02) | 2 | 2 | 2 | 2 |
| [RF03](requisitos-software.md#rf03) | 2 | 3 | 2 | 2 |
| [RF04](requisitos-software.md#rf04) | 3 | 2 | 1 | 2 |
| [RF05](requisitos-software.md#rf05) | 2 | 2 | 3 | 2 |
| [RF06](requisitos-software.md#rf06) | 3 | 3 | 2 | 3 |
| [RF07](requisitos-software.md#rf07) | 3 | 3 | 1 | 2 |
| [RF08](requisitos-software.md#rf08) | 4 | 2 | 3 | 3 |
| [RF09](requisitos-software.md#rf09) | 1 | 1 | 1 | 1 |
| [RF10](requisitos-software.md#rf10) | 2 | 2 | 2 | 2 |
| [RF11](requisitos-software.md#rf11) | 3 | 2 | 3 | 3 |
| [RF12](requisitos-software.md#rf12) | 3 | 3 | 3 | 3 |
| [RF13](requisitos-software.md#rf13) | 1 | 1 | 1 | 1 |
| [RF14](requisitos-software.md#rf14) | 4 | 3 | 4 | 4 |
| [RF15](requisitos-software.md#rf15) | 2 | 2 | 2 | 2 |
| [RF16](requisitos-software.md#rf16) | 2 | 2 | 2 | 2 |
| [RF17](requisitos-software.md#rf17) | 4 | 3 | 4 | 4 |
| [RF18](requisitos-software.md#rf18) | 1 | 2 | 1 | 1 |
| [RF19](requisitos-software.md#rf19) | 3 | 3 | 3 | 3 |
| [RF20](requisitos-software.md#rf20) | 4 | 3 | 3 | 3 |
| [RF21](requisitos-software.md#rf21) | 3 | 2 | 2 | 2 |
| [RF22](requisitos-software.md#rf22) | 3 | 3 | 3 | 3 |
| [RF23](requisitos-software.md#rf23) | 4 | 4 | 4 | 4 |
| [RF24](requisitos-software.md#rf24) | 3 | 3 | 4 | 3 |
| [RF25](requisitos-software.md#rf25) | 2 | 2 | 2 | 2 |
| [RF26](requisitos-software.md#rf26) | 4 | 4 | 4 | 4 |
| [RF27](requisitos-software.md#rf27) | 2 | 2 | 2 | 2 |
| [RF28](requisitos-software.md#rf28) | 4 | 4 | 4 | 4 |
| [RF29](requisitos-software.md#rf29) | 4 | 4 | 4 | 4 |
| [RF30](requisitos-software.md#rf30) | 1 | 1 | 1 | 1 |
| [RF31](requisitos-software.md#rf31) | 2 | 2 | 2 | 2 |
| [RF32](requisitos-software.md#rf32) | 3 | 2 | 2 | 2 |
| [RF33](requisitos-software.md#rf33) | 3 | 2 | 2 | 2 |
| [RF34](requisitos-software.md#rf34) | 2 | 2 | 2 | 2 |
| [RF35](requisitos-software.md#rf35) | 2 | 1 | 2 | 2 |
| [RF36](requisitos-software.md#rf36) | 4 | 3 | 4 | 4 |
| [RF37](requisitos-software.md#rf37) | 3 | 3 | 3 | 3 |
| [RF38](requisitos-software.md#rf38) | 3 | 2 | 2 | 2 |
| [RF39](requisitos-software.md#rf39) | 2 | 2 | 2 | 2 |
| [RF40](requisitos-software.md#rf40) | 4 | 3 | 3 | 3 |
| [RF41](requisitos-software.md#rf41) | 4 | 3 | 3 | 3 |
| [RF42](requisitos-software.md#rf42) | 2 | 2 | 2 | 2 |
| [RF43](requisitos-software.md#rf43) | 3 | 2 | 2 | 2 |
| [RF44](requisitos-software.md#rf44) | 2 | 2 | 2 | 2 |
| [RF45](requisitos-software.md#rf45) | 4 | 2 | 2 | 3 |
| [RF46](requisitos-software.md#rf46) | 4 | 2 | 2 | 3 |
| [RF47](requisitos-software.md#rf47) | 3 | 2 | 2 | 2 |
| [RF48](requisitos-software.md#rf48) | 3 | 2 | 2 | 2 |
| [RF49](requisitos-software.md#rf49) | 3 | 3 | 3 | 3 |
| [RF50](requisitos-software.md#rf50) | 4 | 2 | 3 | 3 |
| [RF51](requisitos-software.md#rf51) | 1 | 1 | 1 | 1 |
| [RF52](requisitos-software.md#rf52) | 3 | 3 | 3 | 3 |
| [RF53](requisitos-software.md#rf53) | 3 | 3 | 3 | 3 |
| [RF54](requisitos-software.md#rf54) | 4 | 4 | 4 | 4 |

</details>

### 10.2.3 Matriz valor × esforço e decisão de escopo

A [matriz 4x4](https://www.figma.com/board/ossWEDtUAnf3qn1bXPwJLl/Matriz-4x4--?node-id=3-2) cruza **valor de negócio** com **esforço técnico**. Ela permite comparar o benefício de cada funcionalidade com a dificuldade estimada de implementá-la. As notas da tabela geral correspondem aos 54 códigos com comportamento compatível entre os documentos e a seção 8. O resultado da seleção está no [quadro “MVP Definido”](https://www.figma.com/board/ossWEDtUAnf3qn1bXPwJLl/Matriz-4x4--?node-id=17-909).

<iframe src="https://embed.figma.com/board/ossWEDtUAnf3qn1bXPwJLl/Matriz-4x4--?node-id=3-2&amp;embed-host=share" title="Matriz 4x4 de valor de negócio e esforço técnico do GameDuo" width="100%" height="550" style="border: 0;" allowfullscreen loading="lazy"></iframe>

A seleção registrada preserva funcionalidades de alto esforço necessárias ao fluxo financeiro, como carteira (RF23), liberação de valores (RF26) e saques (RF28), todas com ET 4. Inclui também itens com valor de negócio menor, como filtros (RF09) e registro do resultado da sessão (RF31), classificados como Could Have. Já RF24, classificado como Must Have, **não consta no conjunto selecionado**. Não foi aplicada uma regra automática de corte por nota nem criado um ranking numérico ausente nos materiais.

Esses exemplos descrevem o resultado observado nos artefatos. A justificativa individual de cada inclusão ou exclusão deve ser registrada no refinamento, sem atribuir à equipe decisões não documentadas. O registro da [Reunião 5](evidencias.md#reuniao-5) ainda indica que o resultado da validação com o cliente precisa ser documentado.

### 10.2.4 Backlog do MVP

O recorte concentra-se na hipótese de que consumidores e prestadores conseguem **encontrar uma oferta de coaching ou duo, contratar um horário, realizar a sessão e concluir a movimentação dos créditos** em um fluxo estruturado. Os 24 RFs selecionados são organizados abaixo pela jornada que apoiam.

| Parte da jornada | Requisitos selecionados | Alcance no MVP |
| --- | --- | --- |
| Conta e acesso | [RF01](requisitos-software.md#rf01), [RF02](requisitos-software.md#rf02), [RF03](requisitos-software.md#rf03) | Cadastro, autenticação e recuperação de senha. |
| Perfil de prestação | [RF04](requisitos-software.md#rf04), [RF05](requisitos-software.md#rf05), [RF07](requisitos-software.md#rf07) | Apresentação do prestador, dados de recebimento e consulta de perfil; o nível de jogo é declarado, sem verificação por API. |
| Catálogo e ofertas | [RF09](requisitos-software.md#rf09), [RF10](requisitos-software.md#rf10), [RF11](requisitos-software.md#rf11), [RF13](requisitos-software.md#rf13), [RF50](requisitos-software.md#rf50) | Busca e consulta de ofertas, manutenção e encerramento de anúncios de coaching e duo e manutenção administrativa dos jogos. |
| Agenda e contratação | [RF14](requisitos-software.md#rf14), [RF15](requisitos-software.md#rf15), [RF16](requisitos-software.md#rf16), [RF18](requisitos-software.md#rf18) | Agenda semanal, consulta de disponibilidade, contratação automática e cancelamento com devolução integral dos créditos reservados. |
| Créditos e recebimentos | [RF22](requisitos-software.md#rf22), [RF23](requisitos-software.md#rf23), [RF25](requisitos-software.md#rf25), [RF26](requisitos-software.md#rf26), [RF27](requisitos-software.md#rf27), [RF28](requisitos-software.md#rf28) | Compra de combos, consulta de carteira, reserva e liberação de créditos, divisão da receita e saque do saldo elegível. |
| Resultado e atendimento | [RF31](requisitos-software.md#rf31), [RF38](requisitos-software.md#rf38) | Registro do resultado da sessão e consulta autorizada de ocorrências; relatos complementares e evidências pelo canal de atendimento. |
| Consulta administrativa | [RF44](requisitos-software.md#rf44) | Consulta dos usuários e de seus dados autorizados. |

O alcance dos RFs selecionados respeita as [regras de negócio do MVP](regras-negocio.md):

- **Perfil e busca:** RF07 e RF09 utilizam as informações disponíveis no recorte. Credenciais verificadas, selo, reputação calculada e indicadores automáticos dependem de RF06, RF08 e RF32–RF35, que não foram selecionados.
- **Ofertas:** RF11 é limitado a coaching e duo. Publicação, compra e acesso a conteúdos gravados permanecem na visão completa do produto.
- **Contratação:** o horário é reservado sem aceite adicional do prestador, deve respeitar sua disponibilidade e não pode gerar sobreposição entre ofertas. A contratação exige créditos suficientes e fornece às partes a forma de contato prevista na oferta.
- **Conclusão e pagamento:** o resultado pode ser informado em até 48 horas; registro de problema suspende a liberação automática. Sem esse registro, ao fim do prazo a sessão segue para liberação. A divisão é fixa em 70% para o prestador e 30% para a plataforma, com carência financeira de 30 dias para saque, conforme as regras RN28–RN33 e RN40.
- **Atendimento e moderação:** o fluxograma do MVP prevê contato por e-mail de SAC. RF38 e RF44 não implicam incluir automaticamente registro de decisão, execução financeira de decisão ou aplicação de sanções, que são RFs distintos fora do recorte.

#### Fluxograma do MVP

<iframe src="https://embed.figma.com/board/LH2mEi8MRBysizoEl4KS4D/Untitled?node-id=174-1159&amp;viewport-controls=true&amp;embed-host=share" title="Fluxograma do MVP do GameDuo" width="100%" height="600" style="border: 0;" allowfullscreen loading="lazy"></iframe>

[Abrir fluxograma do MVP do GameDuo no Figma](https://www.figma.com/board/LH2mEi8MRBysizoEl4KS4D/Untitled?node-id=174-1159){ target="_blank" rel="noopener" }

### 10.2.5 Requisitos não funcionais e alcance no MVP

Os RNFs são restrições de qualidade e implementação aplicáveis às funcionalidades, e não etapas independentes da jornada. A tabela mantém a classificação de valor do documento de negócio e, separadamente, o grupo registrado no quadro “MVP Definido”.

| Requisito | Nome | Valor de negócio | Tratamento no quadro do MVP |
| --- | --- | --- | --- |
| [RNF01](requisitos-software.md#rnf01) | Autenticação em dois fatores | Could Have (2) | Não aplicável ao recorte |
| [RNF02](requisitos-software.md#rnf02) | Restrição de acesso | Must Have (4) | Obrigatório |
| [RNF03](requisitos-software.md#rnf03) | Auditabilidade administrativa e financeira | Could Have (2) | Evolutivo |
| [RNF04](requisitos-software.md#rnf04) | Configurabilidade de taxas | Won’t Have (1) | Não aplicável ao recorte |
| [RNF05](requisitos-software.md#rnf05) | Periodicidade do cálculo de reputação | Won’t Have (1) | Não aplicável ao recorte |
| [RNF06](requisitos-software.md#rnf06) | Tecnologias de implementação | Won’t Have (1) | Obrigatório |
| [RNF07](requisitos-software.md#rnf07) | Proteção de dados pessoais | Should Have (3) | Obrigatório |
| [RNF08](requisitos-software.md#rnf08) | Clareza das mensagens de validação | Should Have (3) | Evolutivo |
| [RNF09](requisitos-software.md#rnf09) | Consistência da agenda | Should Have (3) | Obrigatório |
| [RNF10](requisitos-software.md#rnf10) | Identificação do usuário logado | Must Have (4) | Obrigatório |
| [RNF11](requisitos-software.md#rnf11) | Prevenção de ações involuntárias | Should Have (3) | Associado aos RFs selecionados (parcial) |
| [RNF12](requisitos-software.md#rnf12) | Consistência visual entre telas | Should Have (3) | Evolutivo |
| [RNF13](requisitos-software.md#rnf13) | Integridade financeira | Must Have (4) | Obrigatório |
| [RNF14](requisitos-software.md#rnf14) | Proteção de credenciais e comunicação | Must Have (4) | Obrigatório |
| [RNF15](requisitos-software.md#rnf15) | Tolerância a falhas de integração | Should Have (3) | Associado aos RFs selecionados (parcial) |
| [RNF16](requisitos-software.md#rnf16) | Responsividade de interface | Must Have (4) | Evolutivo |

Os **sete obrigatórios** e os **dois associados** totalizam os nove RNFs selecionados. Para RNF11, o recorte abrange confirmação de cancelamento de contratação e encerramento de oferta; a aplicação de sanções está fora do MVP. Para RNF15, o recorte abrange as integrações de pagamento utilizadas; a verificação de credenciais por API de jogo está fora do MVP.

RNF06 aparece como Won’t Have na avaliação de negócio, mas foi selecionado como obrigatório no quadro do MVP; a tecnologia prevista na seção 8 permanece React no frontend e PHP no backend. RNF16 aparece como Must Have na avaliação de negócio e como evolutivo no quadro. Essas diferenças são preservadas para distinguir as fontes.

A categoria “evolutivo” não revoga os critérios mínimos de qualidade já exigidos pelo [DoR e DoD](dordod.md). O nível inicial de atendimento e os aprimoramentos futuros de RNF03, RNF08, RNF12 e RNF16 precisam ser explicitados nas histórias antes do compromisso com a iteração.

### 10.2.6 Fontes e rastreabilidade

- [Avaliação do valor de negócio — GameDuo](https://docs.google.com/document/d/1HhDgSDIEJp5t9xpYDn8xLkNaL_4tb1luNdroymRgHyE/edit): classificação MoSCoW de RFs e RNFs e escala de valor.
- [Avaliação de esforço técnico — GameDuo](https://docs.google.com/document/d/1Hxlh8ZO2rxC6jZqPk88HC0XBVaTiWfxHmDVx5BruZbI/edit): notas de esforço, complexidade, capacidade da equipe e cálculo consolidado dos RFs na versão avaliada.
- [Matriz 4x4 e quadro “MVP Definido”](https://www.figma.com/board/ossWEDtUAnf3qn1bXPwJLl/Matriz-4x4--?node-id=17-909): recorte funcional e classificação dos RNFs.
- [Fluxograma completo](https://www.figma.com/board/LH2mEi8MRBysizoEl4KS4D/Untitled?node-id=2-13) e [fluxograma do MVP](https://www.figma.com/board/LH2mEi8MRBysizoEl4KS4D/Untitled?node-id=174-1159): representação das jornadas nos respectivos quadros.
- [Requisitos de software](requisitos-software.md), [regras de negócio](regras-negocio.md) e [evidências das reuniões](evidencias.md): descrições atuais, restrições do MVP e registros de discussão e validação.

Consolidação dos materiais consultados em **12/10/2026**, organizada conforme as subseções 10.1 e 10.2 do template de Visão do Produto e Projeto, versão 8.
