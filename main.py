"""Macros do mkdocs-macros-plugin que geram as visões dos requisitos.

Os dados ficam em data/*.yaml (fonte única). As páginas chamam estas macros
em vez de manter tabelas digitadas à mão: catálogo, backlog, priorização, MVP,
rastreabilidade e as listas de requisitos do cronograma.

As macros devolvem HTML pronto (cards, chips, abas, acordeões e tabelas
ordenáveis). O comportamento interativo está em docs/javascripts/requisitos.js
e o visual em docs/stylesheets/requisitos.css.
"""

import html
import re
from pathlib import Path

import yaml
from mkdocs.utils import get_relative_url

RAIZ = Path(__file__).parent
DATA = RAIZ / "data"

PAGINA = {
    "catalogo": "visao-produto/8.1requisitos-software.md",
    "produto": "visao-produto/2.solucao-proposta.md",
    "cronograma": "visao-produto/6.cronograma-entregas.md",
    "regras": "visao-produto/8.4regras-negocio.md",
    "evidencias": "visao-produto/evidencias.md",
}

ATENDIMENTO = ["Integral", "Parcial", "Adiado"]
# Âncoras da página Evidências aceitas em origem_levantamento.
EVIDENCIAS = {
    "reuniao-1": "Reunião 1",
    "reuniao-2": "Reunião 2",
    "validacao-pagamentos": "Validação do fluxo de pagamentos",
    "reuniao-3": "Reunião 3",
    "reuniao-4": "Reunião 4",
    "reuniao-5": "Reunião 5",
}

MOSCOW = ["Must Have", "Should Have", "Could Have", "Won't Have"]
VALOR = {m: 4 - i for i, m in enumerate(MOSCOW)}
STATUS = ["Executada", "Em andamento", "Planejada"]
ESFORCO_ROTULO = {"e": "Esforço estimado", "c": "Complexidade", "ce": "Capacitação da equipe"}
# Critérios dos RNFs: só as linhas preenchidas aparecem no card.
CRITERIOS = [("criterio_mvp", "Verificável no MVP"), ("parametro_pendente", "Parâmetro pendente"),
             ("melhoria_futura", "Melhoria futura")]


def _carregar(nome):
    return yaml.safe_load((DATA / nome).read_text(encoding="utf-8"))


def _regras():
    """RN → requisitos citados na coluna de rastreabilidade da seção 8.4."""
    texto = (RAIZ / "docs" / PAGINA["regras"]).read_text(encoding="utf-8")
    regras = {}
    for linha in texto.splitlines():
        m = re.match(r'\| <a id="(rn\d\d)"></a>RN\d\d \| (.+) \| (.+) \|$', linha)
        if m:
            regras[m.group(1).upper()] = re.findall(r"\b(?:RNF|RF)\d\d\b", m.group(3))
    return regras


def _valor(req):
    return VALOR[req["priorizacao"]["moscow"]]


def _soma(req):
    e = req["priorizacao"]["esforco"]
    return e["e"] + e["c"] + e["ce"]


def _et(req):
    # Arredondamento comercial: parte decimal a partir de 0,5 sobe.
    return (2 * _soma(req) + 3) // 6


def _decimal(x):
    return f"{x:.2f}".replace(".", ",")


def _mvp(req):
    return req["entrega"]["escopo"] == "MVP"


def _parcial(req):
    """RF no MVP com alcance parcial (campo entrega.alcance_mvp)."""
    return _mvp(req) and bool(req["entrega"].get("alcance_mvp"))


def _validar(req, prod):
    for item in prod["objetivos"] + prod["caracteristicas"]:
        a = item.get("mvp", {}).get("atendimento")
        if a not in ATENDIMENTO:
            raise ValueError(f'{item["id"]}: mvp.atendimento inválido "{a}" (use {", ".join(ATENDIMENTO)})')
    for r in req["rf"]:
        for o in r.get("origem_levantamento", []):
            if o["evidencia"] not in EVIDENCIAS:
                raise ValueError(f'{r["id"]}: evidência desconhecida "{o["evidencia"]}" em origem_levantamento')


def _slug(texto):
    return re.sub(r"[^a-z0-9]+", "-", texto.lower()).strip("-")


e = html.escape


def define_env(env):
    def dados():
        # Relido a cada página para refletir edições durante o mkdocs serve.
        req = _carregar("requisitos.yaml")
        prod = _carregar("produto.yaml")
        cron = _carregar("cronograma.yaml")
        _validar(req, prod)
        return {
            "rf": req["rf"],
            "rnf": req["rnf"],
            "req": {r["id"]: r for r in req["rf"] + req["rnf"]},
            "cp": {c["id"]: c for c in prod["caracteristicas"]},
            "oe": {o["id"]: o for o in prod["objetivos"]},
            "it": {i["numero"]: i for i in cron["iteracoes"]},
            "rn": _regras(),
        }

    # ------------------------------------------------------------ links

    def href(pagina, ancora):
        src = PAGINA[pagina]
        if env.page.file.src_uri == src:
            return f"#{ancora}"
        destino = src[:-3] + "/" if env.conf["use_directory_urls"] else src[:-3] + ".html"
        return f"{get_relative_url(destino, env.page.url)}#{ancora}"

    def chip(d, rid, fraco=False):
        """Chip clicável para RF, RNF, RN, CP, OE ou iteração (int)."""
        if isinstance(rid, int):
            it = d["it"][rid]
            return (f'<a class="ref-chip ref-chip--it" href="{href("cronograma", f"iteracao-{rid}")}" '
                    f'title="{e(it["fase"])}: {it["inicio"]} a {it["fim"]}">Iteração {rid}</a>')
        tipo = re.match(r"[A-Z]+", rid).group(0).lower()
        if tipo in ("rf", "rnf"):
            alvo, titulo = href("catalogo", rid.lower()), d["req"][rid]["nome"]
        elif tipo == "rn":
            alvo, titulo = href("regras", rid.lower()), "Regra de negócio"
        elif tipo == "cp":
            alvo, titulo = href("produto", rid.lower()), d["cp"][rid]["nome"]
        else:
            o = d["oe"][rid]
            alvo, titulo = href("produto", rid.lower()), o["nome"] or o["descricao"]
        classe = f"ref-chip ref-chip--{tipo}" + (" ref-chip--fraco" if fraco else "")
        return f'<a class="{classe}" href="{alvo}" title="{e(titulo)}">{rid}</a>'

    def chips(d, ids, vazio="—"):
        return " ".join(chip(d, i) for i in ids) or f'<span class="req-vazio">{vazio}</span>'

    # ----------------------------------------------------------- selos

    def selo_escopo(req):
        return '<span class="selo selo--mvp">MVP</span>' if _mvp(req) else \
            '<span class="selo selo--backlog">Backlog</span>'

    def selo_moscow(req):
        m = req["priorizacao"]["moscow"]
        return f'<span class="selo selo--{_slug(m)}" title="Valor de negócio {VALOR[m]}">{m}</span>'

    def selo_status(status):
        return f'<span class="selo selo--{_slug(status)}">{status}</span>'

    def selo_atendimento(item):
        a = item["mvp"]["atendimento"]
        return f'<span class="selo selo--{_slug(a)}" title="Atendimento no MVP">{a}</span>'

    def selo_parcial(req):
        return ('<span class="selo selo--parcial" title="No MVP com alcance parcial">MVP parcial</span>'
                if _parcial(req) else "")

    def evidencia(o):
        """Link para a reunião ou validação seguido da decisão registrada."""
        return (f'<a class="req-evidencia" href="{href("evidencias", o["evidencia"])}">{EVIDENCIAS[o["evidencia"]]}</a>: '
                f'{e(o["decisao"])}')

    def contagem_mvp(rfs):
        """Barra e texto 'X de N no MVP', com '(Y parcial)' quando houver RF parcial."""
        dentro = sum(1 for r in rfs if _mvp(r))
        parcial = sum(1 for r in rfs if _parcial(r))
        texto = f"{dentro} de {len(rfs)} no MVP" + (f" ({parcial} parcial)" if parcial else "")
        partes = f'<span class="contagem">{dentro} de {len(rfs)} no MVP</span>' + (
            f' <span class="contagem">({parcial} parcial)</span>' if parcial else "")
        return f"{barra(dentro, len(rfs) or 1, texto)} {partes}", dentro / (len(rfs) or 1)

    def barra(n, maximo=4, rotulo=""):
        return (f'<span class="barra" style="--n:{n};--max:{maximo}" title="{e(rotulo)}">'
                f'<span class="barra__fill"></span></span>')

    def status_req(d, req):
        # Status informado no registro substitui o calculado a partir das iterações.
        if req["entrega"].get("status"):
            if req["entrega"]["status"] not in STATUS:
                raise ValueError(f'{req["id"]}: status inválido "{req["entrega"]["status"]}"')
            return [req["entrega"]["status"]]
        if req["id"].startswith("RNF"):
            return sorted({d["it"][n]["status"] for n in req["entrega"].get("iteracoes", [])}, key=STATUS.index)
        n = req["entrega"].get("iteracao")
        return [d["it"][n]["status"]] if n else []

    def tabs(grupo, abas):
        """Abas: lista de (rótulo HTML, conteúdo HTML)."""
        botoes = "".join(
            f'<button type="button" class="gd-tabs__btn" role="tab" data-aba="{grupo}-{i}"'
            f' aria-selected="{"true" if i == 0 else "false"}">{rotulo}</button>'
            for i, (rotulo, _) in enumerate(abas))
        paineis = "".join(
            f'<div class="gd-tabs__painel" role="tabpanel" id="{grupo}-{i}"{"" if i == 0 else " hidden"}>{conteudo}</div>'
            for i, (_, conteudo) in enumerate(abas))
        return f'<div class="gd-tabs"><div class="gd-tabs__lista" role="tablist">{botoes}</div>{paineis}</div>'

    def tabela(cabecalho, linhas, ordenavel=True, extra=""):
        """Tabela HTML; células podem ser (html, valor_de_ordenacao[, title])."""
        th = "".join(f"<th>{c}</th>" for c in cabecalho)
        corpo = []
        for linha in linhas:
            tds = []
            for c in linha:
                if isinstance(c, tuple):
                    titulo = f' title="{e(c[2])}"' if len(c) > 2 else ""
                    tds.append(f'<td data-ordem="{e(str(c[1]))}"{titulo}>{c[0]}</td>')
                else:
                    tds.append(f"<td>{c}</td>")
            corpo.append("<tr>" + "".join(tds) + "</tr>")
        classe = ("gd-tabela gd-ordenavel" if ordenavel else "gd-tabela") + (f" {extra}" if extra else "")
        return (f'<div class="{classe}"><table><thead><tr>{th}</tr></thead>'
                f'<tbody>{"".join(corpo)}</tbody></table></div>')

    # ---------------------------------------------------------- gerais

    @env.macro
    def req_link(rid):
        """Chip clicável para um requisito, regra, CP, OE ou iteração."""
        return chip(dados(), rid)

    @env.macro
    def contagem(tipo, escopo=None):
        """Quantidade de RFs ou RNFs, opcionalmente filtrada por escopo."""
        d = dados()
        return sum(1 for r in d[tipo] if escopo is None or r["entrega"]["escopo"] == escopo)

    @env.macro
    def status_iteracao(n):
        """Selo de status de uma iteração, conforme cronograma.yaml."""
        return f'<a id="iteracao-{n}"></a>' + selo_status(dados()["it"][n]["status"])

    @env.macro
    def requisitos_iteracao(n):
        """RFs e RNFs planejados para uma iteração (usado no cronograma)."""
        d = dados()
        rfs = [r["id"] for r in d["rf"] if r["entrega"].get("iteracao") == n]
        rnfs = [r["id"] for r in d["rnf"] if n in r["entrega"].get("iteracoes", [])]
        partes = [f'<span class="req-chips">{chips(d, ids)}</span>' for ids in (rfs, rnfs) if ids]
        return "<br>".join(partes)

    # -------------------------------------------------------- catálogo

    @env.macro
    def catalogo_controles():
        """Barra de busca, filtros e alternador de visão do catálogo."""
        d = dados()
        todos = d["rf"] + d["rnf"]

        def pilula(grupo, valor, rotulo, n=None):
            qtd = f' <span class="pilula__n">{n}</span>' if n is not None else ""
            ativo = ' aria-pressed="true"' if valor == "" else ' aria-pressed="false"'
            return (f'<button type="button" class="pilula" data-grupo="{grupo}" data-valor="{e(valor)}"{ativo}>'
                    f"{rotulo}{qtd}</button>")

        def grupo(nome, rotulo, opcoes):
            return (f'<div class="req-filtros__grupo" data-grupo="{nome}"><span class="req-filtros__rotulo">{rotulo}</span>'
                    + pilula(nome, "", "Todos") + "".join(pilula(nome, v, r, n) for v, r, n in opcoes) + "</div>")

        contar = lambda f: sum(1 for r in todos if f(r))
        status_de = {r["id"]: status_req(d, r) for r in todos}
        grupos = [
            grupo("tipo", "Tipo", [("RF", "RF", len(d["rf"])), ("RNF", "RNF", len(d["rnf"]))]),
            grupo("escopo", "Escopo", [("MVP", "Apenas MVP", contar(_mvp)),
                                      ("Backlog", "Backlog", contar(lambda r: not _mvp(r)))]),
            grupo("moscow", "Prioridade", [(m, m, contar(lambda r, m=m: r["priorizacao"]["moscow"] == m)) for m in MOSCOW]),
            grupo("cp", "Característica", [(c, c, contar(lambda r, c=c: c in r["origem"])) for c in sorted(d["cp"])]),
            grupo("status", "Status", [(s, s, contar(lambda r, s=s: s in status_de[r["id"]])) for s in STATUS]),
        ]
        visoes = "".join(
            f'<button type="button" class="req-visao__btn" data-visao="{v}" aria-pressed="{"true" if v == "cards" else "false"}" title="{t}">{r}</button>'
            for v, r, t in (("cards", "Cards", "Visão em cards (detalhada)"),
                            ("grid", "2 colunas", "Visão em grid de 2 colunas"),
                            ("compacta", "Compacta", "Visão compacta (tabela enxuta)")))
        return (
            '<div class="req-controles" data-total="' + str(len(todos)) + '">'
            '<div class="req-controles__topo">'
            '<label class="req-busca">'
            '<input type="search" placeholder="Buscar por ID, nome ou palavra-chave…" aria-label="Buscar requisitos"></label>'
            f'<div class="req-visao" role="group" aria-label="Densidade da visualização">{visoes}</div>'
            '<button type="button" class="req-expandir" aria-pressed="false">Expandir detalhes</button>'
            '<span class="req-contador" aria-live="polite"></span>'
            '</div></div>'
            # Fora da barra fixa: os filtros rolam com a página e não cobrem os cards.
            '<details class="req-filtros" open><summary>Filtros'
            '<button type="button" class="req-limpar">Limpar filtros</button></summary>'
            + "".join(grupos) + "</details>"
        )

    @env.macro
    def catalogo(tipo):
        """Cards com o registro completo de cada RF ou RNF."""
        d = dados()
        aplicado_em = {}
        for r in d["rf"]:
            for n in r["rnfs_associados"]:
                aplicado_em.setdefault(n, []).append(r["id"])
        regras_de = {}
        for rn, ids in d["rn"].items():
            for i in ids:
                regras_de.setdefault(i, []).append(rn)

        cards = []
        for r in d[tipo]:
            rid, ancora = r["id"], r["id"].lower()
            status = status_req(d, r)

            origem = "".join(
                f'<div class="req-origem">{chip(d, c)}<span class="req-seta">→</span>'
                f'{chip(d, d["cp"][c]["oe_principal"])}{chip(d, d["cp"][c]["oe_secundario"], fraco=True)}'
                f'<span class="req-origem__nome">{e(d["cp"][c]["nome"])}</span></div>'
                for c in r["origem"])
            if r.get("origem_levantamento"):
                origem += (f'<div class="req-linha"><span class="req-rotulo">Levantamento</span>'
                           f'<span>{"<br>".join(evidencia(o) for o in r["origem_levantamento"])}</span></div>')

            if tipo == "rf":
                esf = r["priorizacao"]["esforco"]
                pilulas = "".join(
                    f'<span class="esforco" title="{ESFORCO_ROTULO[k]}: {esf[k]} de 4"><b>{k.upper()}</b>'
                    f'{barra(esf[k])}<span>{esf[k]}</span></span>' for k in ("e", "c", "ce"))
                prioridade = (f'{selo_moscow(r)}<div class="esforcos">{pilulas}</div>'
                              f'<div class="req-et">ET <strong>{_et(r)}</strong> <small>média {_decimal(_soma(r) / 3)}</small></div>')
                n = r["entrega"].get("iteracao")
                entrega = (f'<div class="req-linha"><span class="req-rotulo">Módulo</span>'
                           f'{e(r["entrega"].get("jornada", "Fora do MVP"))}</div>')
                if n:
                    entrega += f'<div class="req-linha">{chip(d, n)} {selo_status(d["it"][n]["status"])}</div>'
                if _parcial(r):
                    entrega += (f'<div class="req-linha"><span class="req-rotulo">Alcance no MVP</span>'
                                f'<span class="req-texto">{e(r["entrega"]["alcance_mvp"])}</span></div>')
                entrega += (f'<div class="req-linha"><span class="req-rotulo">Depende de</span>{chips(d, r.get("depende_de", []))}</div>'
                            f'<div class="req-linha"><span class="req-rotulo">RNFs</span>{chips(d, r["rnfs_associados"])}</div>'
                            f'<div class="req-linha"><span class="req-rotulo">Regras</span>{chips(d, regras_de.get(rid, []))}</div>')
                narr = r["narrativa_descritiva"]
                if narr["texto"]:
                    rodape = (f'<details class="req-detalhe"><summary>Narrativa descritiva'
                              f' <small>{e(narr["tecnica"])}</small></summary><p>{e(narr["texto"])}</p></details>')
                else:
                    rodape = '<span class="selo selo--pendente" title="A narrativa descritiva ainda será escrita">Narrativa pendente</span>'
                titulo_meta = ("Origem", "Priorização &amp; esforço", "Entrega &amp; vínculos")
            else:
                iters = r["entrega"].get("iteracoes", [])
                prioridade = (f'{selo_moscow(r)}<div class="req-linha req-classificacao">{e(r["classificacao"])}</div>')
                entrega = (f'<div class="req-linha"><span class="req-rotulo">MVP</span>{e(r["entrega"]["tratamento"])}</div>'
                           f'<div class="req-linha"><span class="req-rotulo">Iterações</span>{chips(d, iters)}</div>'
                           f'<div class="req-linha"><span class="req-rotulo">Aplicado em</span>{chips(d, aplicado_em.get(rid, []), "nenhum RF vinculado")}</div>'
                           f'<div class="req-linha"><span class="req-rotulo">Regras</span>{chips(d, regras_de.get(rid, []))}</div>')
                criterios = "".join(
                    f'<div class="req-linha"><span class="req-rotulo">{rotulo}</span>{e(r[campo])}</div>'
                    for campo, rotulo in CRITERIOS if r.get(campo))
                rodape = f'<details class="req-detalhe"><summary>Critérios</summary>{criterios}</details>'
                titulo_meta = ("Origem", "Priorização &amp; classificação", "Entrega &amp; vínculos")

            meta = "".join(
                f'<section class="req-meta"><h4 class="req-meta__titulo">{t}</h4>{c}</section>'
                for t, c in zip(titulo_meta, (origem, prioridade, entrega)))
            busca = " ".join([rid, r["nome"], r["descricao"], " ".join(r["origem"]),
                              *(r.get(c, "") for c, _ in CRITERIOS), r["entrega"].get("jornada", ""),
                              r["entrega"].get("alcance_mvp", "")]).lower()
            selos_status = "".join(selo_status(s) for s in status)
            cards.append(
                f'<article class="req-card req-card--{tipo}" id="{ancora}" data-tipo="{rid[:-2]}"'
                f' data-escopo="{r["entrega"]["escopo"]}" data-moscow="{r["priorizacao"]["moscow"]}"'
                f' data-cp="{" ".join(r["origem"])}" data-status="{"|".join(status)}" data-busca="{e(busca)}">'
                f'<header class="req-card__cab">'
                f'<a class="req-id" href="#{ancora}">{rid}</a>'
                f'<button type="button" class="req-copiar" data-ancora="{ancora}" title="Copiar link para {rid}" aria-label="Copiar link para {rid}">#</button>'
                f'<p class="req-card__titulo">{e(r["nome"])}</p>'
                f'<div class="req-card__selos">{selo_escopo(r)}{selo_parcial(r)}{selo_moscow(r)}{selos_status}</div>'
                f'</header>'
                f'<div class="req-card__corpo"><p class="req-card__descricao">{e(r["descricao"])}</p>'
                f'<div class="req-card__meta">{meta}</div>'
                f'<footer class="req-card__rodape">{rodape}</footer></div>'
                f'</article>'
            )
        return (f'<div class="req-lista" data-lista="{tipo}">{"".join(cards)}'
                f'<p class="req-lista__vazia" hidden>Nenhum requisito corresponde aos filtros.</p></div>')

    # --------------------------------------------------------- backlog

    @env.macro
    def backlog_geral():
        """RFs agrupados em abas por iteração; o restante do backlog numa aba própria."""
        d = dados()
        cab = ["Requisito", "Funcionalidade", "CP", "MoSCoW", "ET", "Status"]

        def linhas(reqs):
            return [[
                (chip(d, r["id"]), r["id"]), r["nome"], chips(d, r["origem"]),
                (selo_moscow(r), _valor(r)), (f"{barra(_et(r), rotulo=f'ET {_et(r)}')} {_et(r)}", _et(r)),
                (" ".join(selo_status(s) for s in status_req(d, r)) or '<span class="req-vazio">—</span>',
                 "".join(status_req(d, r)) or "~"),
            ] for r in sorted(reqs, key=lambda r: (-_valor(r), _et(r), r["id"]))]

        abas = []
        for n, it in sorted(d["it"].items()):
            reqs = [r for r in d["rf"] if r["entrega"].get("iteracao") == n]
            if reqs:
                rotulo = f'Iteração {n} <span class="pilula__n">{len(reqs)}</span> {selo_status(it["status"])}'
                abas.append((rotulo, tabela(cab, linhas(reqs))))
        fora = [r for r in d["rf"] if not _mvp(r)]
        abas.append((f'Fora do MVP <span class="pilula__n">{len(fora)}</span>', tabela(cab, linhas(fora))))
        return tabs("backlog", abas)

    @env.macro
    def backlog_rnf():
        """Relação vigente dos RNFs: escopo, tratamento no recorte e iterações."""
        d = dados()
        linhas = [[(chip(d, r["id"]), r["id"]), r["nome"],
                   (f'{selo_escopo(r)} {e(r["entrega"]["tratamento"])}', r["entrega"]["tratamento"]),
                   chips(d, r["entrega"].get("iteracoes", []))]
                  for r in sorted(d["rnf"], key=lambda r: (not _mvp(r), r["entrega"]["tratamento"], r["id"]))]
        return tabela(["Requisito", "Nome", "Tratamento no recorte", "Iterações"], linhas)

    @env.macro
    def tabela_priorizacao():
        """RFs em abas por classificação MoSCoW, ordenados por esforço."""
        d = dados()
        cab = ["Requisito", "Funcionalidade", "CP", "E", "C", "CE", "Média", "ET"]
        abas = []
        for m in MOSCOW:
            reqs = sorted((r for r in d["rf"] if r["priorizacao"]["moscow"] == m), key=lambda r: (_et(r), r["id"]))
            linhas = []
            for r in reqs:
                esf = r["priorizacao"]["esforco"]
                linhas.append([
                    (chip(d, r["id"]), r["id"]), r["nome"], chips(d, r["origem"]),
                    *[(str(esf[k]), esf[k]) for k in ("e", "c", "ce")],
                    (_decimal(_soma(r) / 3), _soma(r)),
                    (f"{barra(_et(r), rotulo=f'ET {_et(r)}')} {_et(r)}", _et(r)),
                ])
            rotulo = f'{selo_moscow(reqs[0]) if reqs else m} <span class="pilula__n">{len(reqs)}</span>'
            abas.append((rotulo, tabela(cab, linhas)))
        return tabs("priorizacao", abas)

    @env.macro
    def tabela_priorizacao_rnf():
        """RNFs com valor de negócio (o tratamento no recorte fica no backlog geral)."""
        d = dados()
        linhas = [[(chip(d, r["id"]), r["id"]), r["nome"], (selo_moscow(r), _valor(r))]
                  for r in sorted(d["rnf"], key=lambda r: (-_valor(r), r["id"]))]
        return tabela(["Requisito", "Nome", "MoSCoW (VB)"], linhas)

    # ------------------------------------------------------------- MVP

    @env.macro
    def mvp_jornada(alcance):
        """RFs do MVP agrupados pela parte da jornada que apoiam.

        `alcance` mapeia cada parte da jornada ao texto que descreve seu alcance;
        a lista de requisitos de cada linha é gerada a partir dos dados.
        """
        d = dados()
        linhas = []
        for parte, texto in alcance.items():
            ids = [r["id"] for r in d["rf"] if _mvp(r) and r["entrega"].get("jornada") == parte]
            linhas.append([f"<strong>{e(parte)}</strong>", f'<span class="req-chips">{chips(d, ids)}</span>', e(texto)])
        sem_parte = [r["id"] for r in d["rf"] if _mvp(r) and r["entrega"].get("jornada") not in alcance]
        if sem_parte:
            linhas.append(["<em>Sem parte da jornada definida</em>", chips(d, sem_parte), "—"])
        return tabela(["Parte da jornada", "Requisitos selecionados", "Alcance no MVP"], linhas, ordenavel=False)

    @env.macro
    def mvp_rnfs():
        """RNFs selecionados para o MVP e seu tratamento."""
        d = dados()
        linhas = [[(chip(d, r["id"]), r["id"]), r["nome"], e(r["entrega"]["tratamento"]),
                   chips(d, r["entrega"].get("iteracoes", []))]
                  for r in d["rnf"] if _mvp(r)]
        return tabela(["Requisito", "Nome", "Tratamento", "Iterações"], linhas)

    # ------------------------------------------------- rastreabilidade

    @env.macro
    def matriz_rastreabilidade():
        """Acordeões por CP: OE → CP → RFs (MVP, MVP parcial, backlog) e RNFs."""
        d = dados()
        blocos = []
        for cid, c in sorted(d["cp"].items()):
            rfs = [r for r in d["rf"] if cid in r["origem"]]
            integral = [r["id"] for r in rfs if _mvp(r) and not _parcial(r)]
            parcial = [r["id"] for r in rfs if _parcial(r)]
            fora = [r["id"] for r in rfs if not _mvp(r)]
            rnfs = [r["id"] for r in d["rnf"] if cid in r["origem"]]
            cobertura, _ = contagem_mvp(rfs)
            linha_parcial = (f'<div class="req-linha"><span class="req-rotulo">RFs no MVP com alcance parcial</span>'
                             f'<span class="req-chips">{chips(d, parcial)}</span></div>') if parcial else ""
            blocos.append(
                f'<details class="gd-acordeao" id="rastro-{cid.lower()}">'
                f'<summary>{chip(d, cid)} <span class="gd-acordeao__titulo">{e(c["nome"])}</span>'
                f'{selo_atendimento(c)}'
                f'<span class="cobertura" title="RFs da característica no MVP">{cobertura}</span></summary>'
                f'<div class="gd-acordeao__corpo">'
                f'<div class="req-linha"><span class="req-rotulo">Objetivos</span>{chip(d, c["oe_principal"])} principal · {chip(d, c["oe_secundario"], fraco=True)} secundário</div>'
                f'<div class="req-linha"><span class="req-rotulo">Valor de negócio</span>{e(c["valor_negocio"])}</div>'
                f'<div class="req-linha"><span class="req-rotulo">Alcance no MVP</span><span class="req-texto">{e(c["mvp"]["alcance"])}</span></div>'
                f'<div class="req-linha"><span class="req-rotulo">RFs no MVP</span><span class="req-chips">{chips(d, integral)}</span></div>'
                f'{linha_parcial}'
                f'<div class="req-linha"><span class="req-rotulo">RFs fora do MVP</span><span class="req-chips">{chips(d, fora)}</span></div>'
                f'<div class="req-linha"><span class="req-rotulo">RNFs</span><span class="req-chips">{chips(d, rnfs)}</span></div>'
                f"</div></details>"
            )
        return f'<div class="gd-acordeoes">{"".join(blocos)}</div>'

    @env.macro
    def cobertura_objetivos():
        """Atendimento de cada OE no MVP e RFs das CPs em que ele é a contribuição principal."""
        d = dados()
        linhas = []
        for oid, o in d["oe"].items():
            cps = [c for c, v in d["cp"].items() if v["oe_principal"] == oid]
            rfs = [r for r in d["rf"] if set(r["origem"]) & set(cps)]
            cobertura, pct = contagem_mvp(rfs)
            nome = o["nome"] or o["descricao"][:48] + "…"
            linhas.append([
                (f'{chip(d, oid)} {e(nome)}', oid, o["descricao"]),
                (selo_atendimento(o), ATENDIMENTO.index(o["mvp"]["atendimento"])),
                e(o["mvp"]["alcance"]),
                chips(d, cps),
                (cobertura, pct),
            ])
        return tabela(["Objetivo específico", "Atendimento no MVP", "Alcance",
                       "CPs (contribuição principal)", "RFs no MVP"], linhas, extra="gd-tabela--texto")

    @env.macro
    def origem_requisitos():
        """RFs do MVP com a reunião ou validação em que a necessidade ou decisão foi registrada."""
        d = dados()
        linhas = [[
            (chip(d, r["id"]), r["id"]), e(r["nome"]),
            "<br>".join(evidencia(o) for o in r.get("origem_levantamento", [])) or '<span class="req-vazio">—</span>',
            chips(d, r["origem"]),
        ] for r in d["rf"] if _mvp(r)]
        return tabela(["Requisito", "Nome", "Origem no levantamento", "CP"], linhas)

    @env.macro
    def diagrama_rastreabilidade():
        """Abas com grafos Mermaid OE → CP → RF, com cliques para os registros."""
        d = dados()

        def no(nid, rotulo, classe, alvo):
            rotulo = rotulo.replace('"', "'")
            return [f'{nid}["{rotulo}"]:::{classe}', f'click {nid} href "{alvo}"']

        estilos = [
            "classDef oe fill:#0f766e,stroke:#0f766e,color:#fff",
            "classDef cp fill:#1d4ed8,stroke:#1d4ed8,color:#fff",
            "classDef mvp fill:#10b981,stroke:#047857,color:#fff",
            "classDef mvpParcial fill:#6ee7b7,stroke:#047857,stroke-width:3px,stroke-dasharray:6 4,color:#064e3b",
            "classDef backlog fill:#e2e8f0,stroke:#94a3b8,color:#334155",
        ]

        def oe_no(oid):
            o = d["oe"][oid]
            return no(oid, f"{oid} · {o['nome'] or o['descricao'][:48] + '…'}", "oe", href("produto", oid.lower()))

        def cp_no(cid):
            return no(cid, f"{cid} · {d['cp'][cid]['nome']}", "cp", href("produto", cid.lower()))

        geral = ["flowchart LR"]
        for oid in d["oe"]:
            geral += oe_no(oid)
        for cid, c in sorted(d["cp"].items()):
            geral += cp_no(cid)
            geral += [f"{c['oe_principal']} --> {cid}", f"{c['oe_secundario']} -.-> {cid}"]
        abas = [("Visão geral OE → CP", geral)]

        for cid, c in sorted(d["cp"].items()):
            g = ["flowchart LR"] + oe_no(c["oe_principal"]) + cp_no(cid) + [f"{c['oe_principal']} --> {cid}"]
            for r in d["rf"]:
                if cid in r["origem"]:
                    g += no(r["id"], f"{r['id']} · {r['nome']}", "mvpParcial" if _parcial(r) else "mvp" if _mvp(r) else "backlog",
                            href("catalogo", r["id"].lower()))
                    g.append(f"{cid} --> {r['id']}")
            abas.append((f"{cid}", g))

        return tabs("grafo", [
            (rotulo, f'<pre class="gd-mermaid">{e(chr(10).join(linhas + estilos))}</pre>')
            for rotulo, linhas in abas
        ])
