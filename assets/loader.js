(() => {
  // ✅ Ersetze USERNAME/REPO
  const RAW_BASE = "https://raw.githubusercontent.com/VIngrano/sq-components/refs/heads/main/components/";

  async function loadComponent(el) {
    const name = el.getAttribute("data-component");
    const url = `${RAW_BASE}${name}.html`;

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      el.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
      el.innerHTML = `<div style="padding:1rem;border:1px solid #ddd;border-radius:12px">
        Component "${name}" failed to load.
      </div>`;
    }
  }

  function init() {
    document.querySelectorAll(".igr-component[data-component]").forEach(loadComponent);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
