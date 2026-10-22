/* Paysage illustré en couches (SVG généré) avec effet parallax.
   Création originale : ciel violet → rose → pêche, nuages, montagnes, forêts de sapins. */

const W = 1600, H = 900;

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

// Crête de montagne par déplacement du point milieu
function ridge(r, base, amp, rough, peaks = []) {
  let pts = [[0, base], [W, base]];
  let a = amp;
  for (let it = 0; it < 7; it++) {
    const next = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
      next.push(pts[i], [(x1 + x2) / 2, (y1 + y2) / 2 + (r() - .5) * a]);
    }
    next.push(pts[pts.length - 1]); pts = next; a *= rough;
  }
  pts = pts.map(([x, y]) => {
    let lift = 0;
    for (const [px, ph, pw] of peaks) lift += ph * Math.max(0, 1 - Math.abs(x - px) / pw) ** 1.6;
    return [x, y - lift];
  });
  return pts;
}
const pathFrom = (pts, bottom = H + 400) => `M0 ${bottom} L${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} L${W} ${bottom}Z`;

function pine(x, y, h, w = h * .32) {
  const tiers = 5; let d = "";
  for (let i = 0; i < tiers; i++) {
    const t0 = i / tiers, ty = y - h * .1 - h * .9 * t0, tw = w * (1 - t0 * .78) / 2, th = h * .9 / tiers * 1.7;
    d += `M${x} ${ty - th} L${x + tw} ${ty} L${x + tw * .35} ${ty - th * .12} L${x - tw * .35} ${ty - th * .12} L${x - tw} ${ty}Z`;
  }
  return d;
}

function forest(r, pts, density, hMin, hMax, avoidCenter = 0) {
  let d = "";
  for (let i = 0; i < density; i++) {
    const x = r() * W;
    if (avoidCenter && Math.abs(x - W / 2) < avoidCenter) continue;
    const j = Math.min(pts.length - 1, Math.round(x / W * (pts.length - 1)));
    d += pine(x, pts[j][1] + 6, hMin + r() * (hMax - hMin));
  }
  return d;
}

function cloud(x, y, s, base, light) {
  const bumps = [[0, 0, 40], [45, -22, 52], [100, -10, 46], [148, 4, 34], [-40, 8, 30]];
  const c = bumps.map(([dx, dy, rr]) => `<circle cx="${x + dx * s}" cy="${y + dy * s}" r="${rr * s}"/>`).join("");
  const hl = bumps.slice(0, 4).map(([dx, dy, rr]) => `<circle cx="${x + dx * s - 6 * s}" cy="${y + dy * s - 8 * s}" r="${rr * s * .78}"/>`).join("");
  return `<g fill="${base}">${c}<rect x="${x - 70 * s}" y="${y}" width="${250 * s}" height="${36 * s}" rx="${18 * s}"/></g><g fill="${light}" opacity=".9">${hl}</g>`;
}

const svg = (inner, cls, speed, depth) => `<div class="scene__layer ${cls}" data-sp="${speed}" data-depth="${depth}"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${inner}</svg></div>`;

export function sceneHTML({ seed = 7, night = false, overlay = "" } = {}) {
  const r = rng(seed);
  const P = night
    ? { far: "#2f2f6e", mid: "#242458", hill: "#1a1a45", front: "#111334", cloud: "#3a3a80", cloudL: "#5a54a6" }
    : { far: "#9b78bf", mid: "#5e5299", hill: "#353a7a", front: "#171a44", cloud: "#f39bbd", cloudL: "#ffd2b0" };

  const stars = Array.from({ length: night ? 70 : 18 }, () => `<circle cx="${(r() * W).toFixed(0)}" cy="${(r() * H * .45).toFixed(0)}" r="${(r() * 1.6 + .4).toFixed(1)}" style="animation-delay:${(r() * 4).toFixed(1)}s"/>`).join("");
  const clouds = night ? cloud(260, 210, .9, P.cloud, P.cloudL) + cloud(1180, 150, 1.1, P.cloud, P.cloudL)
    : cloud(180, 170, 1.25, P.cloud, P.cloudL) + cloud(620, 300, .8, P.cloud, P.cloudL) + cloud(1060, 120, 1.5, P.cloud, P.cloudL) + cloud(1350, 330, .9, P.cloud, P.cloudL) + cloud(860, 420, .55, P.cloud, P.cloudL);

  const farPts = ridge(r, 560, 120, .55, [[1180, 230, 260], [420, 120, 220]]);
  const midPts = ridge(r, 640, 110, .5, [[300, 120, 260], [1350, 90, 240]]);
  const hillPts = ridge(r, 730, 60, .5);
  const frontPts = ridge(r, 830, 40, .5, [[0, 90, 380], [W, 110, 380]]);

  return `<div class="scene ${night ? "scene--night" : ""}" aria-hidden="true">
    <div class="scene__sky" data-sp=".7"><div class="scene__sun"></div><svg class="scene__stars" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${stars}</svg></div>
    ${svg(`<g class="drift">${clouds}</g>`, "l-clouds", .6, 8)}
    ${svg(`<path d="${pathFrom(farPts)}" fill="${P.far}"/>`, "l-far", .48, 12)}
    ${svg(`<path d="${pathFrom(midPts)}" fill="${P.mid}"/>${`<path d="${forest(r, midPts, 90, 14, 28, 200)}" fill="${P.mid}"/>`}`, "l-mid", .34, 18)}
    ${svg(`<path d="${pathFrom(hillPts)}" fill="${P.hill}"/><path d="${forest(r, hillPts, 120, 22, 55, 240)}" fill="${P.hill}"/>`, "l-hill", .2, 26)}
    ${svg(`<path d="${pathFrom(frontPts)}" fill="${P.front}"/><path d="${forest(r, frontPts, 40, 150, 380, 430)}" fill="${P.front}"/>`, "l-front", .08, 38)}
    <div class="scene__ground"></div>
    ${overlay ? `<div class="scene__overlay" data-sp=".25">${overlay}</div>` : ""}
  </div>`;
}

export function initScenes() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scenes = [...document.querySelectorAll(".scene")];
  if (!scenes.length || reduced) return;
  let mx = 0, tx = 0;
  addEventListener("pointermove", e => { tx = e.clientX / innerWidth - .5; }, { passive: true });
  const tick = () => {
    mx += (tx - mx) * .06;
    for (const sc of scenes) {
      const rect = sc.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) continue;
      const off = -rect.top; // défilement à l'intérieur de la scène
      for (const l of sc.querySelectorAll("[data-sp]")) {
        const sp = +l.dataset.sp, dp = +(l.dataset.depth || 0);
        l.style.transform = `translate3d(${(-mx * dp).toFixed(2)}px, ${(off * sp).toFixed(1)}px, 0)`;
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
