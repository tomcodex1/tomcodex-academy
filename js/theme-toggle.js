/**
 * TomCodeX Theme Toggle - Locked to Light Mode
 */
(function () {
  const HTML = document.documentElement;
  HTML.dataset.theme = "light";
  
  function init() {
    HTML.dataset.theme = "light";
    try {
      localStorage.setItem("tomcodex.theme", "light");
    } catch (e) {}
    // Hide any theme toggle elements
    document.querySelectorAll(".tc-theme-toggle").forEach(btn => {
      btn.style.display = "none";
    });
  }

  window.tcTheme = { init, toggle: () => {}, get: () => "light" };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
