// Interatividade das páginas de requisitos geradas por main.py:
// filtros e densidade do catálogo, abas, tabelas ordenáveis, grafos Mermaid,
// botão de copiar link e destaque do registro de destino (#rf01, #cp3...).
// Usa document$ do Material, como modais.js.
(function () {
  var MERMAID_URL = "https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js";
  var CHAVE_VISAO = "gd-req-visao";

  function lerPreferencia(chave) {
    try {
      return localStorage.getItem(chave);
    } catch (e) {
      return null;
    }
  }

  function salvarPreferencia(chave, valor) {
    try {
      localStorage.setItem(chave, valor);
    } catch (e) {}
  }

  // ------------------------------------------------------------ catálogo

  function iniciarCatalogo() {
    var controles = document.querySelector(".req-controles");
    if (!controles || controles.dataset.pronto) return;
    controles.dataset.pronto = "1";

    var cards = Array.prototype.slice.call(document.querySelectorAll(".req-card"));
    var listas = document.querySelectorAll(".req-lista");
    var busca = controles.querySelector(".req-busca input");
    var contador = controles.querySelector(".req-contador");
    // Os filtros ficam fora da barra fixa e rolam junto com a página.
    var painel = document.querySelector(".req-filtros");
    var filtros = {};

    function aplicar() {
      var termo = busca.value.trim().toLowerCase();
      var visiveis = 0;
      cards.forEach(function (card) {
        var ok = !termo || card.dataset.busca.indexOf(termo) !== -1;
        Object.keys(filtros).forEach(function (grupo) {
          var valores = filtros[grupo];
          if (!ok || !valores.length) return;
          // data-cp separa por espaço e data-status por "|"; os demais têm valor único.
          var bruto = card.dataset[grupo] || "";
          var dado = grupo === "cp" ? bruto.split(" ") : grupo === "status" ? bruto.split("|") : [bruto];
          ok = valores.some(function (v) {
            return dado.indexOf(v) !== -1;
          });
        });
        card.hidden = !ok;
        if (ok) visiveis++;
      });
      listas.forEach(function (lista) {
        var algum = lista.querySelector(".req-card:not([hidden])");
        lista.querySelector(".req-lista__vazia").hidden = !!algum;
      });
      contador.textContent = visiveis === cards.length
        ? cards.length + " requisitos"
        : "mostrando " + visiveis + " de " + cards.length;
    }

    painel.querySelectorAll(".pilula").forEach(function (pilula) {
      pilula.addEventListener("click", function () {
        var grupo = pilula.dataset.grupo;
        var valor = pilula.dataset.valor;
        var lista = filtros[grupo] || [];
        if (valor === "") {
          lista = [];
        } else if (lista.indexOf(valor) === -1) {
          lista.push(valor);
        } else {
          lista.splice(lista.indexOf(valor), 1);
        }
        filtros[grupo] = lista;
        painel.querySelectorAll('.pilula[data-grupo="' + grupo + '"]').forEach(function (p) {
          var ativo = p.dataset.valor === "" ? !lista.length : lista.indexOf(p.dataset.valor) !== -1;
          p.setAttribute("aria-pressed", String(ativo));
        });
        aplicar();
      });
    });

    painel.querySelector(".req-limpar").addEventListener("click", function (evento) {
      evento.preventDefault();
      limparFiltros();
    });

    function limparFiltros() {
      filtros = {};
      busca.value = "";
      painel.querySelectorAll(".pilula").forEach(function (p) {
        p.setAttribute("aria-pressed", String(p.dataset.valor === ""));
      });
      aplicar();
    }
    controles.limparFiltros = limparFiltros;

    busca.addEventListener("input", aplicar);

    function definirVisao(visao) {
      listas.forEach(function (lista) {
        lista.classList.remove("req-lista--grid", "req-lista--compacta");
        if (visao !== "cards") lista.classList.add("req-lista--" + visao);
      });
      controles.querySelectorAll(".req-visao__btn").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.visao === visao));
      });
    }

    controles.querySelectorAll(".req-visao__btn").forEach(function (botao) {
      botao.addEventListener("click", function () {
        definirVisao(botao.dataset.visao);
        salvarPreferencia(CHAVE_VISAO, botao.dataset.visao);
      });
    });
    definirVisao(lerPreferencia(CHAVE_VISAO) || "cards");

    var expandir = controles.querySelector(".req-expandir");
    expandir.addEventListener("click", function () {
      var abrir = expandir.getAttribute("aria-pressed") !== "true";
      document.querySelectorAll(".req-lista details").forEach(function (d) {
        d.open = abrir;
      });
      expandir.setAttribute("aria-pressed", String(abrir));
      expandir.textContent = abrir ? "Recolher detalhes" : "Expandir detalhes";
    });

    // Altura da barra fixa, usada no scroll-margin dos cards (ver CSS).
    var medir = function () {
      document.documentElement.style.setProperty("--req-controles-altura", controles.offsetHeight + "px");
    };
    if (window.ResizeObserver) new ResizeObserver(medir).observe(controles);
    medir();

    aplicar();
  }

  // ----------------------------------------------------------- copiar link

  function iniciarCopiar() {
    document.querySelectorAll(".req-copiar:not([data-pronto])").forEach(function (botao) {
      botao.dataset.pronto = "1";
      botao.addEventListener("click", function () {
        var url = location.origin + location.pathname + "#" + botao.dataset.ancora;
        var ok = function () {
          botao.textContent = "Copiado";
          botao.classList.add("req-copiar--ok");
          setTimeout(function () {
            botao.textContent = "#";
            botao.classList.remove("req-copiar--ok");
          }, 1500);
        };
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(ok, function () {
            location.hash = botao.dataset.ancora;
          });
        } else {
          location.hash = botao.dataset.ancora;
        }
      });
    });
  }

  // ----------------------------------------------------------------- abas

  function ativarAba(botao) {
    var abas = botao.closest(".gd-tabs");
    abas.querySelectorAll(":scope > .gd-tabs__lista > .gd-tabs__btn").forEach(function (b) {
      var ativo = b === botao;
      b.setAttribute("aria-selected", String(ativo));
      document.getElementById(b.dataset.aba).hidden = !ativo;
    });
    renderizarMermaid(document.getElementById(botao.dataset.aba));
  }

  function iniciarAbas() {
    document.querySelectorAll(".gd-tabs__btn:not([data-pronto])").forEach(function (botao) {
      botao.dataset.pronto = "1";
      botao.addEventListener("click", function () {
        ativarAba(botao);
      });
    });
  }

  // ------------------------------------------------------ tabelas ordenáveis

  function valorCelula(td) {
    var bruto = td.dataset.ordem !== undefined ? td.dataset.ordem : td.textContent.trim();
    var numero = parseFloat(bruto.replace(",", "."));
    return isNaN(numero) || !/^[\d.,]+$/.test(bruto) ? bruto.toLowerCase() : numero;
  }

  function iniciarOrdenacao() {
    document.querySelectorAll(".gd-ordenavel table:not([data-pronto])").forEach(function (tabela) {
      tabela.dataset.pronto = "1";
      tabela.querySelectorAll("th").forEach(function (th, coluna) {
        th.tabIndex = 0;
        th.setAttribute("aria-sort", "none");
        var ordenar = function () {
          var asc = th.getAttribute("aria-sort") !== "ascending";
          tabela.querySelectorAll("th").forEach(function (outro) {
            outro.setAttribute("aria-sort", "none");
          });
          th.setAttribute("aria-sort", asc ? "ascending" : "descending");
          var corpo = tabela.tBodies[0];
          Array.prototype.slice.call(corpo.rows)
            .sort(function (a, b) {
              var x = valorCelula(a.cells[coluna]);
              var y = valorCelula(b.cells[coluna]);
              var r = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), "pt-BR");
              return asc ? r : -r;
            })
            .forEach(function (linha) {
              corpo.appendChild(linha);
            });
        };
        th.addEventListener("click", ordenar);
        th.addEventListener("keydown", function (evento) {
          if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            ordenar();
          }
        });
      });
    });
  }

  // -------------------------------------------------------------- Mermaid

  var carregandoMermaid = null;

  function carregarMermaid() {
    if (window.mermaid) return Promise.resolve(window.mermaid);
    if (!carregandoMermaid) {
      carregandoMermaid = new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        script.src = MERMAID_URL;
        script.onload = function () {
          var escuro = document.body.getAttribute("data-md-color-scheme") === "slate";
          window.mermaid.initialize({
            startOnLoad: false,
            securityLevel: "loose",
            theme: escuro ? "dark" : "default",
            flowchart: { useMaxWidth: true, htmlLabels: true }
          });
          resolve(window.mermaid);
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    return carregandoMermaid;
  }

  function renderizarMermaid(raiz) {
    var pendentes = Array.prototype.filter.call(
      (raiz || document).querySelectorAll(".gd-mermaid:not([data-processed])"),
      function (el) {
        return el.offsetParent !== null;
      }
    );
    if (!pendentes.length) return;
    carregarMermaid().then(function (mermaid) {
      mermaid.run({ nodes: pendentes });
    });
  }

  // ------------------------------------------------- destaque do destino

  function destacar(hash) {
    if (!hash || hash.length < 2) return;
    var alvo = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!alvo) return;

    // Revela o alvo se estiver escondido por filtro, aba ou acordeão.
    if (alvo.classList.contains("req-card")) {
      var controles = document.querySelector(".req-controles");
      if (controles && alvo.hidden && controles.limparFiltros) controles.limparFiltros();
    }
    var painel = alvo.closest(".gd-tabs__painel");
    if (painel && painel.hidden) {
      var botao = document.querySelector('.gd-tabs__btn[data-aba="' + painel.id + '"]');
      if (botao) ativarAba(botao);
    }
    var detalhe = alvo.closest("details");
    if (detalhe) detalhe.open = true;
    if (alvo.tagName === "DETAILS") alvo.open = true;

    var bloco = alvo.matches(".req-card, details, tr, li") ? alvo : alvo.closest(".req-card, tr, li, details") || alvo;
    document.querySelectorAll(".gd-alvo").forEach(function (el) {
      el.classList.remove("gd-alvo");
    });
    void bloco.offsetWidth;
    bloco.classList.add("gd-alvo");
    var suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    bloco.scrollIntoView({ behavior: suave ? "smooth" : "auto", block: "start" });
  }

  function iniciarDestaque() {
    if (document.body.dataset.gdDestaque) return;
    document.body.dataset.gdDestaque = "1";
    window.addEventListener("hashchange", function () {
      destacar(location.hash);
    });
    // Clicar de novo no mesmo link não dispara hashchange; trata aqui.
    document.addEventListener("click", function (evento) {
      var link = evento.target.closest('a[href^="#"]');
      if (link && link.getAttribute("href") === location.hash) {
        destacar(location.hash);
      }
    });
  }

  document$.subscribe(function () {
    iniciarCatalogo();
    iniciarCopiar();
    iniciarAbas();
    iniciarOrdenacao();
    iniciarDestaque();
    renderizarMermaid(document);
    if (location.hash) {
      setTimeout(function () {
        destacar(location.hash);
      }, 60);
    }
  });
})();
