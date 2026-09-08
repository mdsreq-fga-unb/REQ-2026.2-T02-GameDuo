(function () {
  var KEY = "gd-nav-collapsed";

  function stored() {
    try {
      return localStorage.getItem(KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function apply(collapsed, persist) {
    document.body.classList.toggle("gd-nav-collapsed", collapsed);

    var button = document.querySelector(".gd-sidebar-btn");
    if (button) {
      var label = collapsed ? "Mostrar o menu lateral" : "Recolher o menu lateral";
      button.setAttribute("aria-expanded", String(!collapsed));
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    }

    if (persist) {
      try {
        localStorage.setItem(KEY, collapsed ? "1" : "0");
      } catch (e) {}
    }
  }

  function init() {
    if (!document.querySelector(".md-sidebar--primary") || document.querySelector(".gd-sidebar-btn")) {
      return;
    }

    var button = document.createElement("button");
    button.type = "button";
    button.className = "gd-sidebar-btn";
    button.textContent = "\u2630";
    button.addEventListener("click", function () {
      apply(!document.body.classList.contains("gd-nav-collapsed"), true);
    });

    document.body.appendChild(button);
    apply(stored(), false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
