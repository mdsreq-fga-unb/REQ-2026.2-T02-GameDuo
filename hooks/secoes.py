"""Recolhe as seções da página de Evidências.

Cada seção de segundo nível (uma iteração) vira um bloco <details> fechado,
com o título da seção no resumo. O conteúdo continua em texto corrido; os
links para uma reunião ou iteração abrem o bloco correspondente
(docs/javascripts/secoes.js).
"""

import re

PAGINAS = ("visao-produto/evidencias.md",)
TITULO = re.compile(r"<h2\b[^>]*>.*?</h2>", re.S)


def on_page_content(html_pagina, page, config, files):
    if page.file.src_uri not in PAGINAS:
        return html_pagina

    titulos = list(TITULO.finditer(html_pagina))
    if not titulos:
        return html_pagina

    partes = [html_pagina[:titulos[0].start()]]
    for i, titulo in enumerate(titulos):
        fim = titulos[i + 1].start() if i + 1 < len(titulos) else len(html_pagina)
        corpo = html_pagina[titulo.end():fim]
        partes.append(f'<details class="gd-secao"><summary>{titulo.group(0)}</summary>'
                      f'<div class="gd-secao__corpo">{corpo}</div></details>')
    return "".join(partes)
