(function () {
  const LS_FAV = "aa-resident-desk-fav-v1";
  const data = window.__DESK__ || {};
  const views = ["home", "trash", "library", "parks", "links", "about"];

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
  }
  function loadFav() {
    try {
      const raw = localStorage.getItem(LS_FAV);
      if (!raw) return { branches: {}, parks: {} };
      const j = JSON.parse(raw);
      return { branches: j.branches || {}, parks: j.parks || {} };
    } catch (_) { return { branches: {}, parks: {} }; }
  }
  function saveFav(f) {
    try { localStorage.setItem(LS_FAV, JSON.stringify(f)); } catch (_) {}
  }
  let fav = loadFav();

  function showView(name) {
    if (!views.includes(name)) name = "home";
    $$(".tab").forEach((t) => {
      const on = t.dataset.view === name;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + name));
    if (location.hash.replace(/^#/, "") !== name) {
      history.replaceState(null, "", "#" + name);
    }
  }
  function fromHash() {
    const h = (location.hash || "#home").replace(/^#/, "") || "home";
    showView(h);
  }

  function renderHome() {
    const root = $("#quickGrid");
    if (!root) return;
    const items = [
      { view: "trash", b: "Trash & recycling", s: "EXAMPLE schedule + tips" },
      { view: "library", b: "AACPL library", s: "Severna Park · Broadneck…" },
      { view: "parks", b: "Parks", s: "Kinder Farm · Quiet Waters" },
      { view: "links", b: "Public links", s: "aacounty.org · aacpl.net" }
    ];
    root.innerHTML = items.map((it) =>
      `<button type="button" class="quick" data-view="${it.view}"><b>${escapeHtml(it.b)}</b><span>${escapeHtml(it.s)}</span></button>`
    ).join("");
    root.querySelectorAll(".quick").forEach((btn) => {
      btn.addEventListener("click", () => showView(btn.dataset.view));
    });
  }

  function renderTrash() {
    const trash = data.trash || {};
    const disc = $("#trashDisclaimer");
    if (disc) disc.textContent = trash.disclaimer || "";
    const sched = $("#schedRoot");
    if (sched) {
      sched.innerHTML = (trash.exampleSchedule || []).map((s) =>
        `<div class="sched-chip${s.example ? " ex" : ""}"><strong>${escapeHtml(s.day)}</strong> · ${escapeHtml(s.item)}${s.example ? " · EXAMPLE" : ""}</div>`
      ).join("");
    }
    const tips = $("#trashTips");
    if (tips) {
      tips.innerHTML = (trash.tips || []).map((t) =>
        `<div class="tip-card"><h4>${escapeHtml(t.title)}</h4><p>${escapeHtml(t.body)}</p></div>`
      ).join("");
    }
    const links = $("#trashLinks");
    if (links) {
      links.innerHTML = (trash.links || []).map((l) =>
        `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)} →</a>`
      ).join("");
    }
  }

  function renderLibrary() {
    const root = $("#libraryRoot");
    if (!root) return;
    const branches = (data.library && data.library.branches) || [];
    root.innerHTML = branches.map((b) => {
      const on = !!fav.branches[b.id];
      return `<div class="info-card">
        <button type="button" class="fav-btn${on ? " on" : ""}" data-kind="branches" data-id="${escapeHtml(b.id)}" title="Favorite">${on ? "★" : "☆"}</button>
        <h3>${escapeHtml(b.name)}</h3>
        <p class="addr">${escapeHtml(b.address || "")}</p>
        <p class="note">${escapeHtml(b.note || "")}</p>
        <a href="${escapeHtml(b.url)}" target="_blank" rel="noopener">Open branch page →</a>
      </div>`;
    }).join("");
    wireFav(root);
  }

  function renderParks() {
    const root = $("#parksRoot");
    if (!root) return;
    root.innerHTML = (data.parks || []).map((p) => {
      const on = !!fav.parks[p.id];
      return `<div class="info-card">
        <button type="button" class="fav-btn${on ? " on" : ""}" data-kind="parks" data-id="${escapeHtml(p.id)}" title="Favorite">${on ? "★" : "☆"}</button>
        <h3>${escapeHtml(p.name)}</h3>
        <p class="addr">${escapeHtml(p.address || "")}</p>
        <p class="note">${escapeHtml(p.note || "")}</p>
        <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener">County park page →</a>
      </div>`;
    }).join("");
    wireFav(root);
  }

  function wireFav(root) {
    root.querySelectorAll(".fav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const kind = btn.dataset.kind;
        const id = btn.dataset.id;
        fav[kind][id] = !fav[kind][id];
        saveFav(fav);
        if (kind === "branches") renderLibrary();
        else renderParks();
      });
    });
  }

  function renderLinks() {
    const root = $("#linksRoot");
    if (!root) return;
    const groups = {};
    (data.links || []).forEach((l) => {
      const g = l.group || "Other";
      if (!groups[g]) groups[g] = [];
      groups[g].push(l);
    });
    root.innerHTML = Object.keys(groups).map((g) => {
      const items = groups[g].map((l) =>
        `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)} →</a>`
      ).join("");
      return `<div class="group-title">${escapeHtml(g)}</div>${items}`;
    }).join("");
  }

  $$(".tab").forEach((t) => t.addEventListener("click", () => showView(t.dataset.view)));
  window.addEventListener("hashchange", fromHash);

  const btnClear = $("#btnClearFav");
  if (btnClear) btnClear.addEventListener("click", () => {
    fav = { branches: {}, parks: {} };
    saveFav(fav);
    renderLibrary();
    renderParks();
  });
  const btnPrint = $("#btnPrint");
  if (btnPrint) btnPrint.addEventListener("click", () => window.print());

  if ($("#placePill") && data.place) {
    $("#placePill").textContent = "Millersville MD";
  }

  renderHome();
  renderTrash();
  renderLibrary();
  renderParks();
  renderLinks();
  fromHash();
})();
