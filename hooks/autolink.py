"""Transforma menções a RF, RNF, RN, CP, OE e "Iteração N" em chips clicáveis.

Roda depois da conversão do Markdown (on_page_content), em todas as páginas.
Só altera texto solto: não mexe em links já existentes, títulos, código,
blocos <pre> (Mermaid) nem atributos. Links já escritos à mão cujo texto é
exatamente um ID (ex.: [RF01](...)) recebem a classe de chip.

Só vira link o ID que existe nos dados (data/*.yaml) ou nas âncoras da
página de regras de negócio, para que nenhum chip leve a um destino vazio.
"""

import html
import re
from pathlib import Path

import yaml
from mkdocs.utils import get_relative_url

RAIZ = Path(__file__).parent.parent
PAGINA = {
    "rf": "visao-produto/8.1requisitos-software.md",
    "rnf": "visao-produto/8.1requisitos-software.md",
    "rn": "visao-produto/8.4regras-negocio.md",
    "cp": "visao-produto/2.solucao-proposta.md",
    "oe": "visao-produto/2.solucao-proposta.md",
    "it": "visao-produto/6.cronograma-entregas.md",
}

PADRAO = re.compile(r"\b(RNF\d{2}|RF\d{2}|RN\d{2}|CP\d|OE\d)\b|\bItera[çc][ãa]o (\d{1,2})\b")
# Elementos cujo texto não deve virar link.
IGNORAR = {"a", "code", "pre", "script", "style", "h1", "h2", "h3", "h4", "h5", "h6",
           "button", "summary", "textarea", "title", "svg"}
TAG = re.compile(r"(<!--.*?-->|<[^>]+>)", re.S)
NOME_TAG = re.compile(r"<\s*(/)?\s*([a-zA-Z0-9]+)")
LINK_ID = re.compile(r'<a href="([^"]*)">((?:RNF|RF|RN)\d{2}|CP\d|OE\d)</a>')

_titulos = {}


def _carregar():
    titulos = {}
    req = yaml.safe_load((RAIZ / "data" / "requisitos.yaml").read_text(encoding="utf-8"))
    for r in req["rf"] + req["rnf"]:
        titulos[r["id"]] = r["nome"]
    prod = yaml.safe_load((RAIZ / "data" / "produto.yaml").read_text(encoding="utf-8"))
    for c in prod["caracteristicas"]:
        titulos[c["id"]] = c["nome"]
    for o in prod["objetivos"]:
        titulos[o["id"]] = o["nome"] or o["descricao"]
    regras = (RAIZ / "docs" / PAGINA["rn"]).read_text(encoding="utf-8")
    for rn in re.findall(r'<a id="(rn\d\d)"></a>', regras):
        titulos[rn.upper()] = "Regra de negócio"
    cron = yaml.safe_load((RAIZ / "data" / "cronograma.yaml").read_text(encoding="utf-8"))
    for it in cron["iteracoes"]:
        titulos[f"IT{it['numero']}"] = f"{it['fase']}: {it['inicio']} a {it['fim']} ({it['status']})"
    return titulos


def on_pre_build(config):
    _titulos.clear()
    _titulos.update(_carregar())


def _url(page, files, tipo, ancora):
    src = PAGINA[tipo]
    if page.file.src_uri == src:
        return f"#{ancora}"
    destino = files.get_file_from_path(src)
    return f"{get_relative_url(destino.url, page.url)}#{ancora}"


def _linkar(texto, page, files):
    def troca(m):
        if m.group(1):
            rid = m.group(1)
            tipo = re.match(r"[A-Z]+", rid).group(0).lower()
            ancora = rid.lower()
            chave = rid
        else:
            n = int(m.group(2))
            tipo, ancora, chave = "it", f"iteracao-{n}", f"IT{n}"
        if chave not in _titulos:
            return m.group(0)
        titulo = html.escape(_titulos[chave])
        return (f'<a class="ref-chip ref-chip--{tipo}" href="{_url(page, files, tipo, ancora)}" '
                f'title="{titulo}">{m.group(0)}</a>')

    return PADRAO.sub(troca, texto)


def on_page_content(html_pagina, page, config, files):
    partes = TAG.split(html_pagina)
    pilha = []
    for i, parte in enumerate(partes):
        if not parte:
            continue
        if parte.startswith("<"):
            m = NOME_TAG.match(parte)
            if not m or parte.startswith("<!--"):
                continue
            fechando, nome = m.group(1), m.group(2).lower()
            if nome in IGNORAR and not parte.endswith("/>"):
                if fechando:
                    if nome in pilha:
                        del pilha[len(pilha) - 1 - pilha[::-1].index(nome)]
                else:
                    pilha.append(nome)
        elif not pilha:
            partes[i] = _linkar(parte, page, files)
    resultado = "".join(partes)

    # Links já escritos no Markdown cujo texto é só um ID ganham o visual de chip.
    def estilizar(m):
        tipo = re.match(r"[A-Z]+", m.group(2)).group(0).lower()
        titulo = html.escape(_titulos.get(m.group(2), ""))
        return f'<a class="ref-chip ref-chip--{tipo}" href="{m.group(1)}" title="{titulo}">{m.group(2)}</a>'

    return LINK_ID.sub(estilizar, resultado)
