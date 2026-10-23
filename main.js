/* Viet Hoang — Portfolio multi-pages
   Tout le contenu vient de content/site.json : pas besoin de toucher à ce fichier. */
import { sceneHTML, initScenes } from "./scene.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const HASH = !!window.HASH_ROUTER;   // mode « une seule page » (aperçu hébergé)
const NO_EMBEDS = !!window.NO_EMBEDS;

const PAGES = [
  { id: "home", href: "index.html", label: "Accueil" },
  { id: "entrepreneur", href: "entrepreneur.html", label: "Oomori" },
  { id: "design", href: "design.html", label: "Design" },
  { id: "vovinam", href: "vovinam.html", label: "Vovinam" },
  { id: "photo", href: "photo.html", label: "Photo/Vidéo" },
  { id: "contact", href: "contact.html", label: "Contact" }
];
if (HASH) PAGES.forEach(p => (p.href = "#" + p.id));
const hashPage = (location.hash || "").slice(1);
const PAGE = HASH ? (PAGES.some(p => p.id === hashPage) ? hashPage : "home") : (document.body.dataset.page || "home");
const H = id => PAGES.find(p => p.id === id).href;

/* ---------- Petits utilitaires d'affichage ---------- */
const media = (src, label = "", alt = "") => {
  if (!src) return `<div class="ph" role="img" aria-label="${esc(alt || label || "Image à venir")}"></div><span class="ph-label">${esc(label ? "Photo · " + label : "Votre photo ici")}</span>`;
  if (/\.(mp4|webm|mov)$/i.test(src)) return `<video class="media" src="${esc(src)}" autoplay muted loop playsinline></video>`;
  return `<img class="media" src="${esc(src)}" alt="${esc(alt || label)}" loading="lazy" decoding="async">`;
};
const frame = (src, label, alt, cls = "", speed = 0.12) => `<figure class="frame ${cls}"><div class="px" data-px="${speed}">${media(src, label, alt)}</div></figure>`;
const split = text => esc(text).split(/\s+/).map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(" ");
const list = (arr, cls) => (arr && arr.length) ? `<ul class="${cls} reveal">${arr.map(s => `<li>${esc(s)}</li>`).join("")}</ul>` : "";
const stats = (arr, cls = "") => (arr && arr.length) ? `<dl class="stats ${cls} reveal">${arr.map(s => `<div><dt data-count="${esc(s.value)}">${esc(s.value)}</dt><dd>${esc(s.label)}</dd></div>`).join("")}</dl>` : "";

const socials = (arr, cls = "") => (arr && arr.length) ? `<div class="socials reveal ${cls}">${arr.filter(l => l.url).map(l => `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.platform ? l.platform + " · " + l.label : l.label)}</a>`).join("")}</div>` : "";
const ytId = url => (String(url).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/) || [])[1];

const SEEDS = { home: 7, entrepreneur: 21, design: 3, vovinam: 42, photo: 11, contact: 5 };

function pageHero({ label, title, intro, period }) {
  return `<header class="hero-scene hero-scene--page">${sceneHTML({ seed: SEEDS[PAGE], overlay: `<p class="scene__title">${esc((PAGES.find(p => p.id === PAGE) || {}).label || "")}</p>` })}</header>
  <section class="intro wrap">
    <p class="eyebrow fade-up" style="--d:.1s">${esc(label || "")}</p>
    <h1 class="mega split">${split(title || "")}</h1>
    ${period ? `<p class="intro__period fade-up" style="--d:.5s">${esc(period)}</p>` : ""}
    ${intro ? `<p class="lead fade-up" style="--d:.65s">${esc(intro)}</p>` : ""}
  </section>`;
}

function closing(d) {
  const c = d.contact || {};
  return `<section class="hero-scene hero-scene--closing">${sceneHTML({ seed: 99, night: true, overlay: `
    <div class="closing">
      <h2>Disponible pour de nouveaux projets !</h2>
      <p>Product design, contenus, vidéo… parlons-en.</p>
      <a class="btn btn--primary" href="${PAGE === "contact" ? `mailto:${esc(c.email || "")}` : H("contact")}">Me contacter</a>
    </div>` })}</section>`;
}

function nextLink() {
  const i = PAGES.findIndex(p => p.id === PAGE), n = PAGES[(i + 1) % PAGES.length];
  return `<a class="next wrap" href="${n.href}"><small>Page suivante</small><strong>${esc(n.label)}</strong></a>`;
}

/* ---------- Pages ---------- */
const VIEWS = {
  home(d) {
    const id = d.identity || {}, m = d.manifesto || {};
    const tiles = [
      [H("entrepreneur"), "01", "Oomori", d.restaurants?.title],
      [H("design"), "02", "Product Design", d.design?.title],
      [H("vovinam"), "03", "Vovinam", d.vovinam?.title],
      [H("photo"), "04", "Photo/Vidéo", d.gallery?.intro]
    ];
    const headline = (id.headline || id.roles?.[0] || "").split(/\n/);
    return `
    <header class="hero-scene hero-scene--home">${sceneHTML({ seed: SEEDS.home, overlay: `
      <div class="monogram"><svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 7"/></svg>
        <span>${esc((id.firstName || "V")[0])}${esc((id.lastName || "H")[0])}</span></div>` })}
    </header>
    <section class="intro intro--home wrap">
      <div class="avatar fade-up" style="--d:.1s">${frame(m.portrait, "", `Portrait de ${id.firstName || ""}`, "", 0)}</div>
      <p class="eyebrow fade-up" style="--d:.2s">${esc(id.firstName || "")} ${esc(id.lastName || "")}</p>
      <h1 class="mega mega--xl split">${headline.map(l => split(l)).join("<br>")}</h1>
      <div class="intro__cols">
        <div class="reveal">
          <p class="intro__tagline">${esc(id.tagline || "")}</p>
          <p class="intro__text">${esc(m.text || "")}</p>
          <div class="actions">
            <a class="btn btn--primary" href="${H("design")}">Voir mes projets</a>
            ${id.cvPdf ? `<a class="btn" href="${esc(id.cvPdf)}" download>Télécharger le CV</a>` : ""}
          </div>
        </div>
        <div class="reveal" style="--d:.12s">
          ${(id.skills || []).length ? `<h3 class="tags__title">Compétences</h3><ul class="tags">${id.skills.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
          ${(id.tools || []).length ? `<h3 class="tags__title">Outils</h3><ul class="tags">${id.tools.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
          ${(id.roles || []).length ? `<h3 class="tags__title">Casquettes</h3><ul class="tags tags--soft">${id.roles.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        </div>
      </div>
    </section>
    ${d.about && d.about.facts ? `<section class="wrap section facts-wrap">
      <p class="kicker reveal">${esc(d.about.title || "En bref")}</p>
      <dl class="facts">${d.about.facts.map((f, i) => `<div class="reveal" style="--d:${i * .08}s"><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("")}</dl>
    </section>` : ""}
    <section class="explore wrap">
      ${tiles.map(([href, n, t, p], i) => `
        <div class="reveal" style="--d:${(i % 2) * .12}s">
          <a class="tile tilt" data-tilt="7" href="${href}">
            <span class="tile__glow"></span>
            <span class="tile__num">${n}</span>
            <span class="tile__arrow" aria-hidden="true">→</span>
            <h3>${t}</h3><p>${esc(p || "")}</p>
          </a>
        </div>`).join("")}
    </section>`;
  },

  entrepreneur(d) {
    const r = d.restaurants || {};
    const rImgs = (r.images || []).filter(Boolean).slice(0, 2);
    if (!rImgs.length) rImgs.push("");
    return pageHero(r) + `
    <section class="wrap section vovinam">
      <div class="vovinam__images ${rImgs.length > 1 ? "is-double" : ""}">
        ${rImgs.map((s, i) => `<div class="reveal" style="--d:${i * .15}s"><div class="tilt" data-tilt="5" style="border-radius:18px">${frame(s, "Oomori Ramen", "Oomori Ramen")}</div></div>`).join("")}
      </div>
      <div>
        ${stats(r.stats, "stats--2")}
        ${(r.missions || []).length ? `<h2 class="subhead reveal" style="margin:4rem 0 0">Mon rôle</h2>
        <ul class="awards missions">${r.missions.map((t, i) => `<li class="reveal" style="--d:${i * .05}s"><b aria-hidden="true">✦</b><span>${esc(t)}</span></li>`).join("")}</ul>` : ""}
      </div>
    </section>
    <section class="wrap section section--line">
      <h2 class="subhead reveal">Les restaurants</h2>
      <div class="venues">
        ${(r.items || []).map((v, i) => {
          const open = v.link ? `<a class="venue reveal" href="${esc(v.link)}" target="_blank" rel="noopener" style="--d:${i * .12}s">` : `<div class="venue reveal" style="--d:${i * .12}s">`;
          return `${open}<div class="tilt" data-tilt="4" style="border-radius:18px">${frame(v.image, v.name, v.name)}</div>
            <h3>${esc(v.name)}${v.link ? " ↗" : ""}</h3><p class="venue__place">${esc(v.place)}</p><p>${esc(v.description)}</p>${v.link ? "</a>" : "</div>"}`;
        }).join("")}
      </div>
      ${r.social ? `<h2 class="subhead reveal" style="margin-top:clamp(4rem,8vw,7rem)">Les contenus que je crée</h2>${socials(r.social)}` : ""}
    </section>
    <section class="wrap section section--line">
      <h2 class="subhead reveal">Compétences développées</h2>
      ${list(r.skills, "skills")}
    </section>` + nextLink();
  },

  design(d) {
    const g = d.design || {}, SHOW = 6;
    const cases = g.cases || [];
    return pageHero(g) + `
    <section class="wrap section">
      <h2 class="subhead reveal">Parcours</h2>
      <ol class="timeline">${(g.timeline || []).map((t, i) => `
        <li class="reveal" style="--d:${i * .08}s"><h3>${esc(t.company)}</h3>
          <div class="timeline__meta"><strong>${esc(t.role)}</strong>${esc(t.period)}</div>
          <p>${esc(t.description)}</p></li>`).join("")}</ol>
    </section>
    ${g.ai ? `<section class="wrap section">
      <div class="reveal"><div class="ai tilt" data-tilt="2">
        <div>
          <p class="kicker">${esc(g.ai.period || "")}</p>
          <h2>${esc(g.ai.title || "")}</h2>
          <p class="lead" style="margin-top:1.4rem">${esc(g.ai.intro || "")}</p>
          ${list(g.ai.tools, "skills ai__tools")}
        </div>
        <ul class="ai__list">${(g.ai.items || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      </div></div>
    </section>` : ""}
    <section class="wrap section">
      <h2 class="subhead reveal">Références</h2>
      <div class="cases" id="cases">${cases.map((c, i) => `
        <div class="reveal ${i >= SHOW ? "case-more" : ""}" style="--d:${(i % 2) * .12}s" ${i >= SHOW ? "hidden" : ""}>
          <article class="case tilt" data-tilt="4">
            <figure class="frame"><div class="px" data-px="0">${media(c.image, c.title, c.title)}</div></figure>
            <div class="case__body">
              <p class="case__client">${esc(c.client)}</p>
              <h4>${esc(c.title)}</h4>
              ${c.result ? `<p class="case__result">${esc(c.result)}</p>` : ""}
              ${c.approach ? `<details><summary>Contexte & solution</summary><p><b>Contexte.</b> ${esc(c.problem)}</p><p><b>Solution.</b> ${esc(c.approach)}</p></details>`
                : (c.problem ? `<p class="case__desc">${esc(c.problem)}</p>` : "")}
            </div>
          </article>
        </div>`).join("")}
      </div>
      ${cases.length > SHOW ? `<div class="more"><button class="btn" id="moreBtn">Voir toutes les références (${cases.length})</button></div>` : ""}
    </section>
    <section class="wrap section section--line">
      <h2 class="subhead reveal">Compétences & outils</h2>
      ${list(g.skills, "skills")}
    </section>
    ${(g.education || []).length ? `<section class="wrap section section--line">
      <h2 class="subhead reveal">Formation</h2>
      <ol class="timeline">${g.education.map(e => `<li class="reveal"><h3>${esc(e.school)}</h3><div class="timeline__meta"><strong>Diplôme d'ingénieur</strong>${esc(e.period)}</div><p>${esc(e.description)}</p></li>`).join("")}</ol>
    </section>` : ""}` + nextLink();
  },

  vovinam(d) {
    const v = d.vovinam || {};
    const imgs = (v.images || []).filter(Boolean);
    const shown = imgs.length ? imgs.slice(0, 2) : [""];
    const awards = (v.awards || []).map(a => { const m = a.match(/(\d{4})\s*:?\s*(.*)/); return m ? [m[1], a.slice(0, m.index).trim() + " · " + m[2]] : ["", a]; });
    return pageHero({ label: v.label, title: v.title, period: v.rank }) + `
    <section class="wrap section vovinam">
      <div class="vovinam__images ${shown.length > 1 ? "is-double" : ""}">
        ${shown.map((s, i) => `<div class="reveal" style="--d:${i * .15}s"><div class="tilt" data-tilt="5" style="border-radius:18px">${frame(s, "Vovinam", "Vovinam Viet Vo Dao")}</div></div>`).join("")}
      </div>
      <div>
        <p class="lead reveal">${esc(v.intro || "")}</p>
        <div style="margin-top:2.5rem">${stats(v.highlights, "stats--3")}</div>
        ${awards.length ? `<h2 class="subhead reveal" style="margin:4rem 0 0">Palmarès</h2>
        <ul class="awards">${awards.map(([y, t], i) => `<li class="reveal" style="--d:${i * .05}s"><b>${esc(y)}</b><span>${esc(t.trim())}</span></li>`).join("")}</ul>` : ""}
      </div>
    </section>` + nextLink();
  },

  photo(d) {
    const g = d.gallery || {}, items = g.items || [];
    const cols = [[], [], []];
    items.forEach((it, i) => cols[i % 3].push([it, i]));
    const speeds = [0.06, -0.08, 0.1];
    return pageHero(g) + `
    <section class="wrap section">
      <div class="gallery" id="gallery">
        ${cols.map((c, ci) => `<div class="gallery__col" data-speed="${speeds[ci]}">${c.map(([g, i]) => `
          <button class="${g.tall ? "g--tall" : ""} reveal" data-i="${i}" aria-label="Agrandir : ${esc(g.caption)}">
            ${frame(g.src, g.caption, g.caption, "", 0.1)}<span class="g__cap">${esc(g.caption)}</span>
          </button>`).join("")}</div>`).join("")}
      </div>
    </section>
    ${(g.videos || []).length ? `<section class="wrap section section--line">
      <h2 class="subhead reveal">Vidéos</h2>
      <div class="videos">${g.videos.map((v, i) => { const id = ytId(v.url); return id ? `
        <div class="reveal" style="--d:${(i % 3) * .1}s">${NO_EMBEDS ? `<a class="video tilt" data-tilt="4" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener" aria-label="Voir sur YouTube : ${esc(v.title)}">
          <span class="video__frame video__frame--ph"><span class="video__play" aria-hidden="true"></span></span>` : `<button class="video tilt" data-tilt="4" data-yt="${id}" aria-label="Lire : ${esc(v.title)}">
          <span class="video__frame"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy"><span class="video__play" aria-hidden="true"></span></span>`}
          <span class="video__title">${esc(v.title)}${NO_EMBEDS ? " ↗" : ""}</span>${NO_EMBEDS ? "</a>" : "</button>"}</div>` : ""; }).join("")}</div>
    </section>` : ""}
    ${(g.channels || []).length ? `<section class="wrap section section--line"><h2 class="subhead reveal">Mes chaînes</h2>${socials(g.channels)}</section>` : ""}
    <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Visionneuse" hidden>
      <button class="lightbox__close" aria-label="Fermer">✕</button>
      <button class="lightbox__prev" aria-label="Photo précédente">←</button>
      <figure><div class="lightbox__img" id="lbImg"></div><figcaption id="lbCap"></figcaption></figure>
      <button class="lightbox__next" aria-label="Photo suivante">→</button>
    </div>` + nextLink();
  },

  contact(d) {
    const c = d.contact || {}, id = d.identity || {};
    const cards = [
      ...(c.phone ? [["Téléphone", c.phone, `tel:${c.phone.replace(/\s/g, "")}`]] : []),
      ...(c.links || []).filter(l => l.url).map(l => { const [a, b] = l.label.split(" · "); return [a, (b || "Voir le profil") + " ↗", l.url]; }),
      ...(id.cvPdf ? [["CV", "Télécharger (PDF)", id.cvPdf]] : [])
    ];
    return pageHero({ label: "Contact", title: c.title, intro: c.text }) + `
    <section class="wrap section" style="padding-top:0">
      <a class="contact__mail grad reveal" href="mailto:${esc(c.email || "")}">${esc(c.email || "")}</a>
      <div class="contact__grid">${cards.map(([k, v, href], i) => `
        <div class="reveal" style="--d:${i * .08}s"><a class="contact__card tilt" data-tilt="6" href="${esc(href)}" ${/^http/.test(href) ? 'target="_blank" rel="noopener"' : ""} ${/\.pdf$/i.test(href) ? "download" : ""}>
          <small>${esc(k)}</small><span>${esc(v)}</span></a></div>`).join("")}
      </div>
    </section>` + nextLink();
  }
};

/* ---------- Coquille commune : navigation + pied de page ---------- */
function shell(d) {
  const id = d.identity || {};
  return `
  <a class="skip" href="#main">Aller au contenu</a>
  <header class="nav" id="nav">
    <a class="nav__brand" href="${H("home")}"><i>${esc((id.firstName || "V")[0])}</i>${esc(id.firstName || "")} ${esc(id.lastName || "")}</a>
    <button class="nav__toggle" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu"><span></span><span></span></button>
    <nav id="menu" class="nav__menu" aria-label="Navigation principale">
      ${PAGES.map(p => `<a href="${p.href}" ${p.id === PAGE ? 'aria-current="page"' : ""}>${p.label}</a>`).join("")}
    </nav>
  </header>
  <main id="main">${(VIEWS[PAGE] || VIEWS.home)(d)}${closing(d)}</main>
  <footer class="footer wrap"><span>© ${new Date().getFullYear()} ${esc(id.firstName || "")} ${esc(id.lastName || "")}</span><a href="mailto:${esc(d.contact?.email || "")}">${esc(d.contact?.email || "")}</a></footer>`;
}

/* ---------- Effets ---------- */
function effects(d) {
  // Navigation : fond flouté, masquage au défilement vers le bas, menu mobile
  const nav = $("#nav"), toggle = $(".nav__toggle");
  let lastY = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("is-solid", y > 40);
    nav.classList.toggle("is-hidden", y > 300 && y > lastY && !nav.classList.contains("is-open"));
    lastY = y;
  }, { passive: true });
  toggle.onclick = () => {
    const o = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", o); toggle.setAttribute("aria-label", o ? "Fermer le menu" : "Ouvrir le menu");
    document.body.style.overflow = o ? "hidden" : "";
  };

  if (HASH) addEventListener("hashchange", () => { document.body.classList.add("is-leaving"); setTimeout(() => { scrollTo(0, 0); location.reload(); }, 300); });

  // Transitions douces entre les pages
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || reduced || e.metaKey || e.ctrlKey || a.target === "_blank" || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname) || url.pathname === location.pathname) return;
    e.preventDefault();
    document.body.classList.add("is-leaving");
    setTimeout(() => (location.href = url.href), 380);
  });
  addEventListener("pageshow", e => { if (e.persisted) document.body.classList.remove("is-leaving"); });

  // Apparition au défilement
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); countUp(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  // Chiffres qui défilent
  function countUp(root) {
    if (reduced) return;
    $$("[data-count]", root).forEach(el => {
      const raw = el.dataset.count, m = raw.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
      if (!m || +m[2].replace(",", ".") > 500) return;
      const end = +m[2].replace(",", "."), dec = (m[2].split(/[.,]/)[1] || "").length, t0 = performance.now();
      const step = now => {
        const p = Math.min(1, (now - t0) / 1400), v = end * (1 - Math.pow(1 - p, 3));
        el.textContent = m[1] + v.toFixed(dec).replace(".", ",") + m[3];
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  // Inclinaison 3D au survol (souris uniquement)
  if (!reduced && matchMedia("(pointer: fine)").matches) {
    $$("[data-tilt]").forEach(el => {
      const max = +el.dataset.tilt || 6;
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.classList.add("is-tilting");
        el.style.setProperty("--ry", `${(x - .5) * max * 2}deg`); el.style.setProperty("--rx", `${(.5 - y) * max * 2}deg`);
        el.style.setProperty("--gx", `${x * 100}%`); el.style.setProperty("--gy", `${y * 100}%`);
      });
      el.addEventListener("pointerleave", () => { el.classList.remove("is-tilting"); el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); });
    });
  }

  // Parallax : images dans leurs cadres + éléments à vitesse propre
  if (!reduced) {
    const pxs = $$("[data-px]"), sp = $$("[data-speed]");
    const tick = () => {
      const vh = innerHeight;
      for (const el of pxs) {
        const s = +el.dataset.px; if (!s) continue;
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = `translate3d(0, ${(-p * s * 100).toFixed(2)}%, 0)`;
      }
      for (const el of sp) {
        const r = el.getBoundingClientRect();
        const p = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(p * +el.dataset.speed).toFixed(1)}px, 0)`;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Références : afficher tout
  const more = $("#moreBtn");
  if (more) more.onclick = () => { $$(".case-more").forEach(el => { el.hidden = false; io.observe(el); }); more.parentElement.remove(); };

  // Vidéos YouTube : chargées seulement au clic (page plus rapide)
  $$("[data-yt]").forEach(b => b.addEventListener("click", () => {
    const f = b.querySelector(".video__frame");
    f.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0" title="Vidéo YouTube" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    b.classList.remove("tilt"); b.style.transform = "none";
  }, { once: true }));

  // Visionneuse photo
  const lb = $("#lightbox");
  if (lb) {
    const items = d.gallery?.items || []; let cur = 0, lastFocus;
    const show = i => { cur = (i + items.length) % items.length; $("#lbImg").innerHTML = media(items[cur].src, items[cur].caption); $("#lbCap").textContent = items[cur].caption || ""; };
    const open = i => { lastFocus = document.activeElement; show(i); lb.hidden = false; document.body.style.overflow = "hidden"; $(".lightbox__close").focus(); };
    const close = () => { lb.hidden = true; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); };
    $("#gallery").addEventListener("click", e => { const b = e.target.closest("button[data-i]"); if (b) open(+b.dataset.i); });
    $(".lightbox__close").onclick = close; $(".lightbox__prev").onclick = () => show(cur - 1); $(".lightbox__next").onclick = () => show(cur + 1);
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    document.addEventListener("keydown", e => { if (lb.hidden) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); });
    let tx = 0; lb.addEventListener("touchstart", e => (tx = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); });
  }
}

/* ---------- Démarrage ---------- */
(async () => {
  let data = window.SITE_CONTENT;
  if (!data) {
    try { data = await (await fetch("content/site.json", { cache: "no-cache" })).json(); }
    catch (e) { $("#app").innerHTML = '<p style="padding:120px 24px">Impossible de charger content/site.json. Ouvrez le site via un serveur (GitHub Pages, Vercel ou « npx serve »).</p>'; return; }
  }
  const pageTitle = PAGES.find(p => p.id === PAGE);
  document.title = PAGE === "home" ? (data.meta?.title || document.title) : `${pageTitle.label} — ${data.identity?.firstName || ""} ${data.identity?.lastName || ""}`;
  const desc = $('meta[name="description"]'); if (desc && data.meta?.description) desc.content = data.meta.description;

  $("#app").innerHTML = shell(data);
  effects(data);
  initScenes();
  requestAnimationFrame(() => document.body.classList.remove("is-entering"));
})();
