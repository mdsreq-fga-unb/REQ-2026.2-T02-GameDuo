"""Recolhe as tabelas do site para economizar espaço.

Roda depois da conversão do Markdown (on_page_content), em todas as páginas.
Cada tabela fica dentro de um <details> fechado, cujo resumo mostra as colunas
e a quantidade de linhas; o título da seção já aparece logo acima. Vale também
para as tabelas geradas pelas macros (div.gd-tabela).
"""

import html
import re

TABELA = re.compile(r"<table>.*?</table>", re.S)
LINHA = re.compile(r"<tr[\s>]")
CABECALHO = re.compile(r"<th[^>]*>(.*?)</th>", re.S)
TAG = re.compile(r"<[^>]+>")


def _texto(trecho):
    return html.unescape(TAG.sub("", trecho)).strip()


def on_page_content(html_pagina, page, config, files):
    def recolher(m):
        tabela = m.group(0)
        linhas = len(LINHA.findall(tabela)) - 1
        colunas = " · ".join(c for c in (_texto(c) for c in CABECALHO.findall(tabela)) if c)
        return (f'<details class="gd-recolhida"><summary>'
                f'<span class="gd-recolhida__acao"></span>'
                f'<span class="gd-recolhida__titulo">{html.escape(colunas)}</span>'
                f'<span class="gd-recolhida__linhas">{linhas} {"linha" if linhas == 1 else "linhas"}</span>'
                f"</summary>{tabela}</details>")

    return TABELA.sub(recolher, html_pagina)
