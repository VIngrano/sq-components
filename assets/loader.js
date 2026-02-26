(() => {
  const RAW_BASE =
    "https://raw.githubusercontent.com/VIngrano/sq-components/refs/heads/main/components/";

  async function inject(el) {
    const name = el.getAttribute("data-component");
    if (!name) return;

    // prevent double-load
    if (el.getAttribute("data-igr-loaded") === "1") return;
    el.setAttribute("data-igr-loaded", "1");

    const url = `${RAW_BASE}${name}.html`;

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      el.innerHTML = await res.text();
    } catch (e) {
      console.error("[IGR] failed:", name, url, e);
      el.innerHTML = `<div style="padding:1rem;border:1px solid #ddd;border-radius:12px">
        Failed to load component: <b>${name}</b>
      </div>`;
    }
  }

  function run() {
    document
      .querySelectorAll(".igr-component[data-component]")
      .forEach(inject);
  }

  function start() {
    run();

    // Squarespace can render blocks slightly delayed — retry briefly
    let n = 0;
    const t = setInterval(() => {
      run();
      n += 1;
      if (n >= 20) clearInterval(t); // ~6 seconds
    }, 300);

    // also react to DOM changes
    const obs = new MutationObserver(() => run());
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
