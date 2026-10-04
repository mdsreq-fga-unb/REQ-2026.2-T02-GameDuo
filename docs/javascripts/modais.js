// Modais das iterações (cronograma). Usa document$ do Material para
// reaplicar os eventos a cada troca de página da navegação instantânea.
document$.subscribe(function () {
  document.querySelectorAll("dialog.modal-iteracao").forEach(function (dialog) {
    if (!dialog.querySelector(".modal-fechar")) {
      var fechar = document.createElement("button");
      fechar.type = "button";
      fechar.className = "modal-fechar";
      fechar.setAttribute("aria-label", "Fechar");
      fechar.setAttribute("title", "Fechar");
      fechar.textContent = "×";
      fechar.addEventListener("click", function () {
        dialog.close();
      });
      dialog.prepend(fechar);
    }

    // Clique fora da caixa (no ::backdrop) fecha o modal
    dialog.addEventListener("click", function (event) {
      var r = dialog.getBoundingClientRect();
      var dentro =
        event.clientX >= r.left && event.clientX <= r.right &&
        event.clientY >= r.top && event.clientY <= r.bottom;
      if (!dentro) {
        dialog.close();
      }
    });
  });

  document.querySelectorAll("[data-modal]").forEach(function (gatilho) {
    gatilho.addEventListener("click", function (event) {
      var dialog = document.getElementById(gatilho.getAttribute("data-modal"));
      if (dialog && typeof dialog.showModal === "function") {
        event.preventDefault();
        dialog.showModal();
      }
    });
  });
});
