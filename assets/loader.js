<script>
(() => {
  const RAW_BASE =
    "https://raw.githubusercontent.com/VIngrano/sq-components/refs/heads/main/components/";

  function runScripts(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach(oldScript => {
      const s = document.createElement("script");

      // copy attributes
      for (const attr of oldScript.attributes) {
        s.setAttribute(attr.name, attr.value);
      }

      // inline code
      if (oldScript.textContent && oldScript.textContent.trim()) {
        s.textContent = oldScript.textContent;
      }

      // replace so it executes
      oldScript.replaceWith(s);
    });
  }

  async function inject(el) {
    const name = el.getAttribute("data-component");
    if (!name) return;

    // allow re-run if needed
    if (el.getAttribute("data-igr-loaded") === "1") return;
    el.setAttribute("data-igr-loaded", "1");

    const url = `${RAW_BASE}${name}.html`;

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);

      const html = await res.text();
      el.innerHTML = html;

      // ✅ IMPORTANT: execute scripts inside injected HTML
      runScripts(el);

    } catch (e) {
      console.error("[IGR] component failed:", name, url, e);
      el.innerHTML = `<div style="padding:1rem;border:1px solid #ddd;border-radius:12px">
        Failed to load component: <b>${name}</b>
      </div>`;
    }
  }

  function run() {
    document.querySelectorAll(".igr-component[data-component]").forEach(inject);
  }

  function start() {
    run();
    let n = 0;
    const t = setInterval(() => {
      run();
      n += 1;
      if (n >= 20) clearInterval(t);
    }, 300);

    const obs = new MutationObserver(run);
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
</script>
