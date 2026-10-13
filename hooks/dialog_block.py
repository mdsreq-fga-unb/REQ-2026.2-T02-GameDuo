"""Registra <dialog> como elemento de bloco no Python-Markdown.

Sem isso o <dialog> é tratado como inline: vai parar dentro de um <p> e o
md_in_html ignora o atributo markdown="1" (o build passa, mas o HTML sai
quebrado). Usado pelos modais do cronograma.
"""

from markdown.extensions import Extension


class DialogBlockExtension(Extension):
    def extendMarkdown(self, md):
        if "dialog" not in md.block_level_elements:
            md.block_level_elements.append("dialog")


def on_config(config):
    config.markdown_extensions.append(DialogBlockExtension())
    return config
