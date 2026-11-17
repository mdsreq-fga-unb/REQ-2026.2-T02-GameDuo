// Seções recolhíveis (hooks/secoes.py): abre o bloco que contém o destino do
// link (#reuniao-5, #iteracao-7...) e rola até ele.
(function () {
  function abrirDestino() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var alvo = document.getElementById(id);
    if (!alvo) return;
    var bloco = alvo.closest("details.gd-secao");
    if (!bloco) return;
    var estavaFechado = !bloco.open;
    bloco.open = true;
    if (estavaFechado) alvo.scrollIntoView();
  }

  function iniciar() {
    abrirDestino();
  }

  window.addEventListener("hashchange", abrirDestino);
  if (window.document$ && window.document$.subscribe) {
    window.document$.subscribe(iniciar);
  } else {
    document.addEventListener("DOMContentLoaded", iniciar);
  }
})();
