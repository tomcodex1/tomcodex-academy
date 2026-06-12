/**
 * TomCodeX Theme Toggle
 * Manages dark / light mode across the entire site.
 * Uses data-theme="dark"|"light" on <html>.
 * Preference is persisted in localStorage under "tomcodex.theme".
 */
(function () {
  const STORAGE_KEY = "tomcodex.theme";
  const HTML = document.documentElement;

  function getSystemPreference() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function getSavedTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }

  function saveTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }

  function applyTheme(theme) {
    HTML.dataset.theme = theme;
    // Update all toggle buttons on the page
    document.querySelectorAll(".tc-theme-toggle").forEach((btn) => {
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      btn.setAttribute("title", theme === "dark" ? "Light mode" : "Dark mode");
      btn.textContent = theme === "dark" ? "☀️" : "🌙";
    });
  }

  function toggleTheme() {
    const current = HTML.dataset.theme || "dark";
    const next = current === "dark" ? "light" : "dark";
    saveTheme(next);
    applyTheme(next);
  }

  function init() {
    const saved = getSavedTheme();
    const theme = saved || getSystemPreference();
    applyTheme(theme);
    // Wire up any buttons already in the DOM
    document.querySelectorAll(".tc-theme-toggle").forEach((btn) => {
      btn.addEventListener("click", toggleTheme);
    });
    // Watch for future buttons added to DOM (e.g. by site-nav.js)
    const observer = new MutationObserver(() => {
      document.querySelectorAll(".tc-theme-toggle:not([data-wired])").forEach((btn) => {
        btn.setAttribute("data-wired", "1");
        btn.addEventListener("click", toggleTheme);
        applyTheme(HTML.dataset.theme || theme); // refresh icon
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Apply theme immediately (before paint) to prevent flash
  const immediateTheme = getSavedTheme() || getSystemPreference();
  HTML.dataset.theme = immediateTheme;

  // Expose global
  window.tcTheme = { init, toggle: toggleTheme, get: () => HTML.dataset.theme };

  // Auto-init when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
