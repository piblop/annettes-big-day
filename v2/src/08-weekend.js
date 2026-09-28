/* =========================================================
   WEEKEND ADVENTURE: a cozy Saturday with Paulo and Luca.
   Greenwich Baths > drive > Top Ryde ALDI > drive > dog park > home > a night out > end card.
   Luca comes along all day, except inside ALDI (he waits in the car).
   ========================================================= */

// EXPANSION PACK: a weekend with Paulo and Luca. Edit freely.
CONFIG.weekend = {
  baths: "Greenwich Baths",
  shops: "Top Ryde",
  grocer: "ALDI",
  // Movies named as references (like the radio artists). No copyrighted text.
  movies: [
    { n: "A Scorsese classic", d: "Wise guys, big city, three hours fly by." },
    { n: "A Nolan mind-bender", d: "Time folds. Nobody blinks." },
    { n: "The Godfather", d: "An offer you can't refuse." }
  ],
  shopList: ["Bananas", "Sourdough", "Oat milk", "Dark chocolate"],
  shopExtras: ["Dishwasher tabs", "Sparkling water", "Avocados", "Party pies", "Dog treats", "Scented candle"],
  // The famous ALDI centre aisle. Absolutely none of this is on the list. Add your own chaos.
  specialBuys: ["Go-kart", "85-inch TV", "Chainsaw", "Inflatable spa", "Ski helmet", "Welding mask", "Kayak", "Robot vacuum", "Snowboard", "Espresso machine", "Beekeeping suit", "Electric scooter"],
  wines: [
    { n: "Sauvignon Blanc", d: "Crisp and cold" },
    { n: "Pinot Noir", d: "Light and lovely" },
    { n: "Rose", d: "All day" },
    { n: "Prosecco", d: "Because weekend" }
  ],
  dinners: [
    { n: "Margherita pizza", d: "Simple and perfect" },
    { n: "Pasta special", d: "Whatever's fresh tonight" },
    { n: "Steak frites", d: "Medium, obviously" },
    { n: "Dumplings", d: "One more basket" }
  ],
  picnicTreats: [
    { n: "Cheese and crackers", d: "A little bit fancy" },
    { n: "Strawberries", d: "Straight from the punnet" },
    { n: "Iced coffee", d: "Two straws" }
  ]
};
const WK = CONFIG.weekend;
BADGES.aisle = { n: 'Centre aisle victim', how: 'Grab an ALDI special buy', pack: true };
const WK_FLAGS = ['wkBaths', 'wkGroceries', 'wkFetch', 'wkMovie', 'wkActivity'];
Object.assign(SCENE_TIME, { baths: 9 * 60 + 10, aldi: 11 * 60 + 20, park: 14 * 60, home: 16 * 60 + 30, wnight: 19 * 60, wend: 22 * 60 + 30 });
Object.assign(NPC_CHARS, { baths: 'A', shop: 'A', park: 'Ayko', home: 'A' });
let WKLOG = {};

/* ---------------- per-frame hook: a tiny invisible mesh whose onBeforeRender ticks weekend animation ---------------- */
const WK_TICK_MAT = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false });
function wkTicker(fn) {
  const m = new THREE.Mesh(G_BOX, WK_TICK_MAT); m.scale.setScalar(0.001); m.frustumCulled = false; m.castShadow = false;
  let last = performance.now();
  m.onBeforeRender = () => { const n = performance.now(), dt = Math.min(0.1, (n - last) / 1000); last = n; if (dt <= 0) return; try { fn(dt, G.t); } catch (e) { console.error(e); } };
  world.add(m); return m;
}
const V3 = new THREE.Vector3();

/* ---------------- shared weekend art ---------------- */
function recolorDog(g, kind) {
  const hsl = {}, c = new THREE.Color();
  const shift = () => { if (hsl.h < 0.04 || hsl.h > 0.16 || hsl.s < 0.3) return false; if (kind === 'y') c.setHSL(0.115, 0.72, Math.min(0.8, hsl.l * 0.98)); else if (kind === 'k') c.setHSL(0.07, 0.1, 0.1 + (hsl.l - 0.55) * 0.35); else c.setHSL(0.6, 0.05, Math.min(0.9, hsl.l + 0.12)); return true; };
  g.traverse(o => {
    if (!o.isMesh || !o.material || o.material.isMeshBasicMaterial) return;
    const ca = o.geometry.attributes.color;
    if (ca) { o.geometry = o.geometry.clone(); MERGED.push(o.geometry); const a = o.geometry.attributes.color; for (let i = 0; i < a.count; i++) { c.setRGB(a.getX(i), a.getY(i), a.getZ(i)).getHSL(hsl); if (shift()) a.setXYZ(i, c.r, c.g, c.b); } a.needsUpdate = true; return; }
    if (!o.material.color) return;
    o.material.color.getHSL(hsl); if (hsl.h < 0.04 || hsl.h > 0.16 || hsl.s < 0.3) return;
    if (kind === 'y') c.setHSL(0.115, 0.72, Math.min(0.8, hsl.l * 0.98));
    else if (kind === 'k') c.setHSL(0.07, 0.1, 0.1 + (hsl.l - 0.55) * 0.35);
    else c.setHSL(0.6, 0.05, Math.min(0.9, hsl.l + 0.12));
    o.material = M('#' + c.getHexString());
  });
}
function makeGum(parent, x, z, s) {
  const g = grp(parent, x, 0, z); s = s || 1;
  const t = mk(G_CYL, '#e8dfd2', [0.16 * s, 1.3 * s, 0.16 * s], [0, 0.65 * s, 0], g); t.rotation.z = 0.08;
  mk(G_CYL, '#cfc3b3', [0.1 * s, 0.5 * s, 0.1 * s], [0.18 * s, 1.2 * s, 0], g).rotation.z = -0.7;
  [[0, 1.55, 0, 0.85], [0.4, 1.35, 0.1, 0.6], [-0.35, 1.4, -0.1, 0.62], [0.1, 1.85, -0.1, 0.55]].forEach(([a, b, c, r], i) => mk(G_SPH, ['#8fb07a', '#7fa36c', '#9dbc86'][i % 3], [r * s, r * 0.7 * s, r * s], [a * s, b * s, c * s], g));
  g.userData.sway = Math.random() * TAU; return g;
}
function makeTennisBall(parent) {
  const g = grp(parent);
  mk(G_SPH, '#d8ef4a', [0.16, 0.16, 0.16], [0, 0, 0], g);
  const r = mk(geo('ring', () => new THREE.TorusGeometry(0.5, 0.12, 6, 16)), '#ffffff', [0.16, 0.16, 0.1], [0, 0, 0], g, { noShadow: true }); r.rotation.y = 0.6;
  return g;
}
function makeWineBottle(parent, x, y, z, col) {
  const g = grp(parent, x, y, z);
  mk(G_CYL, col, [0.12, 0.3, 0.12], [0, 0.15, 0], g); mk(G_CONE, col, [0.12, 0.08, 0.12], [0, 0.34, 0], g);
  mk(G_CYL, col, [0.045, 0.12, 0.045], [0, 0.42, 0], g); mk(G_CYL, '#fff4e8', [0.125, 0.1, 0.125], [0, 0.16, 0], g, { noShadow: true });
  return g;
}
function makeGlass(parent, x, y, z, wine) {
  const g = grp(parent, x, y, z);
  mk(G_CYL, '#eef6ff', [0.07, 0.01, 0.07], [0, 0.005, 0], g, { noShadow: true }); mk(G_CYL, '#eef6ff', [0.012, 0.1, 0.012], [0, 0.06, 0], g, { noShadow: true });
  mk(G_SPH, '#eef6ff', [0.11, 0.13, 0.11], [0, 0.17, 0], g, { alpha: 0.55, noShadow: true });
  if (wine) mk(G_SPH, wine, [0.09, 0.07, 0.09], [0, 0.15, 0], g, { noShadow: true });
  return g;
}
function makeCandle(parent, x, y, z) {
  const g = grp(parent, x, y, z);
  mk(G_CYL, '#fff4e0', [0.07, 0.14, 0.07], [0, 0.07, 0], g); const f = mk(G_SPH, '#ffcf5c', [0.05, 0.09, 0.05], [0, 0.19, 0], g, { glow: true });
  g.userData.flame = f; return g;
}
function makeRug(parent, x, z, w, d, cols) {
  const g = grp(parent, x, 0, z);
  mk(G_BOX, cols[0], [w, 0.03, d], [0, 0.015, 0], g, { noShadow: true });
  for (let i = 0; i < 4; i++) mk(G_BOX, cols[1], [w, 0.035, d / 9], [0, 0.017, -d / 2 + d / 8 + i * d / 4], g, { noShadow: true });
  return g;
}

/* ---------------- object builders per weekend theme ---------------- */
const OB = OBJ_BUILDERS;
// Greenwich Baths
OB['baths:u'] = () => { const g = new THREE.Group(); mk(G_CYL, '#ffffff', [0.05, 1.4, 0.05], [0, 0.7, 0], g); for (let i = 0; i < 8; i++) { const s = grp(g, 0, 1.42, 0); s.rotation.y = i / 8 * TAU; const c = mk(G_BOX, i % 2 ? '#ffffff' : '#ff7aa8', [0.22, 0.04, 0.72], [0, 0, 0.34], s); c.rotation.x = 0.28; } mk(G_SPH, '#ffffff', [0.08, 0.08, 0.08], [0, 1.52, 0], g); makeRug(g, 0.55, 0.3, 0.6, 1.0, ['#7fc8f8', '#ffffff']); makeRug(g, -0.5, 0.35, 0.6, 1.0, ['#ffd166', '#ff9fb2']); return g; };
OB['baths:p'] = () => makeGum(null, 0, 0, 1.1);
OB['baths:s'] = () => { const g = new THREE.Group(); const s = mk(G_CONE, '#ffc2d6', [0.3, 0.12, 0.26], [0, 0.07, 0], g); s.rotation.x = -0.4; mk(G_SPH, '#fff4c9', [0.08, 0.06, 0.08], [0.1, 0.05, 0.1], g); return g; };
OB['baths:J'] = () => { const g = new THREE.Group(), c = makeCar(); c.rotation.y = Math.PI / 2; g.add(c); g.userData.car = c; return g; };
OB['baths:K'] = w => {
  const g = new THREE.Group();
  mk(G_BOX, '#e6c79a', [w - 0.1, 0.9, 0.8], [0, 0.45, -0.05], g); mk(G_BOX, '#fffaf0', [w + 0.1, 0.08, 1.0], [0, 0.94, 0], g);
  for (let i = 0; i < 6; i++) mk(G_BOX, i % 2 ? '#ffffff' : '#7fc8f8', [(w + 0.1) / 6, 0.05, 0.36], [-(w + 0.1) / 2 + (i + 0.5) * (w + 0.1) / 6, 0.8, 0.46], g).rotation.x = 0.35;
  mk(G_BOX, '#3a2f4a', [w * 0.6, 0.35, 0.02], [0, 0.55, 0.36], g); mk(G_BOX, '#fff4b0', [w * 0.5, 0.06, 0.02], [0, 0.62, 0.375], g, { glow: true });
  mk(G_CYL, '#ffd166', [0.08, 0.12, 0.08], [-0.3, 1.04, 0.2], g); mk(G_CYL, '#ff7aa8', [0.08, 0.12, 0.08], [-0.15, 1.04, 0.2], g);
  return g;
};
// Top Ryde ALDI
const PRODUCT = ['#e2554f', '#ffd166', '#3fae7c', '#7fc8f8', '#ff9fb8', '#c9b6f2', '#ffa94d', '#fff4e8', '#26457a'];
OB['shop:S'] = w => {
  const g = new THREE.Group();
  mk(G_BOX, '#c9b18e', [w - 0.1, 1.4, 0.55], [0, 0.7, -0.12], g); mk(G_BOX, '#b39a76', [w - 0.2, 1.3, 0.04], [0, 0.72, -0.37], g);
  for (let r = 0; r < 4; r++) {
    const y = 0.12 + r * 0.33; mk(G_BOX, '#f2e6d0', [w - 0.12, 0.035, 0.52], [0, y, 0.02], g);
    mk(G_BOX, '#ffe27a', [w - 0.14, 0.05, 0.012], [0, y - 0.01, 0.285], g, { noShadow: true });
    for (let i = 0, x = -w / 2 + 0.14; x < w / 2 - 0.12; i++) {
      const bw = 0.12 + hsh(i, r, 11) * 0.1, bh = 0.14 + hsh(i, r, 12) * 0.13, c = PRODUCT[Math.floor(hsh(i, r, 13) * PRODUCT.length)];
      if (hsh(i, r, 14) < 0.3) mk(G_CYL, c, [bw * 0.8, bh, bw * 0.8], [x + bw / 2, y + bh / 2 + 0.02, 0.1], g, { noShadow: true });
      else { mk(G_BOX, c, [bw, bh, 0.22], [x + bw / 2, y + bh / 2 + 0.02, 0.1], g, { noShadow: true }); mk(G_BOX, '#ffffff', [bw * 0.7, bh * 0.25, 0.01], [x + bw / 2, y + bh * 0.55, 0.215], g, { noShadow: true }); }
      x += bw + 0.02;
    }
  }
  mk(G_BOX, '#26457a', [0.8, 0.26, 0.04], [0, 1.72, 0], g); mk(G_BOX, '#ffd166', [0.6, 0.06, 0.05], [0, 1.72, 0.01], g, { noShadow: true });
  mk(G_CYL, '#9aa3b5', [0.015, 0.3, 0.015], [-0.3, 1.5, 0], g, { noShadow: true }); mk(G_CYL, '#9aa3b5', [0.015, 0.3, 0.015], [0.3, 1.5, 0], g, { noShadow: true });
  return g;
};
OB['shop:z'] = w => {
  const g = new THREE.Group();
  mk(G_BOX, '#ffffff', [w - 0.1, 0.62, 0.85], [0, 0.31, 0], g); mk(G_BOX, '#9fb3cf', [w - 0.12, 0.06, 0.87], [0, 0.05, 0], g);
  for (let i = 0; i < w * 5; i++) { const c = ['#ff9fb8', '#fff4e8', '#c9a27a', '#7fc8f8', '#ffd166'][i % 5]; mk(G_CYL, c, [0.2, 0.12, 0.2], [-w / 2 + 0.25 + (i % (w * 2.5)) * 0.36, 0.64, i < w * 2.5 ? -0.18 : 0.18], g, { noShadow: true }); }
  mk(G_BOX, '#cfeeff', [w - 0.12, 0.03, 0.83], [0, 0.76, 0], g, { alpha: 0.45, noShadow: true });
  mk(G_BOX, '#eaf6ff', [w - 0.1, 0.05, 0.05], [0, 0.78, 0.42], g, { glow: true, noShadow: true });
  return g;
};
OB['shop:c'] = w => {
  const g = new THREE.Group();
  mk(G_BOX, '#b9c2cf', [w - 0.1, 0.72, 0.7], [0, 0.36, 0], g); mk(G_BOX, '#3a3148', [w - 0.3, 0.03, 0.4], [-0.15, 0.735, 0.05], g);
  for (let i = 0; i < 3; i++) mk(G_BOX, PRODUCT[i + 2], [0.18, 0.12, 0.14], [-0.6 + i * 0.3, 0.81, 0.05], g, { noShadow: true });
  mk(G_BOX, '#3f4258', [0.34, 0.28, 0.24], [w / 2 - 0.3, 0.9, -0.1], g); mk(G_BOX, '#7fb7e8', [0.26, 0.16, 0.02], [w / 2 - 0.3, 0.95, 0.03], g, { glow: true });
  mk(G_CYL, '#9aa3b5', [0.03, 0.9, 0.03], [w / 2 - 0.1, 1.2, -0.25], g, { noShadow: true }); mk(G_BOX, '#ffd166', [0.3, 0.2, 0.03], [w / 2 - 0.1, 1.7, -0.25], g); mk(G_BOX, '#26457a', [0.18, 0.1, 0.01], [w / 2 - 0.1, 1.7, -0.23], g, { noShadow: true });
  return g;
};
OB['shop:B'] = w => {
  const g = new THREE.Group();
  mk(G_BOX, '#ffd166', [w - 0.15, 0.45, 0.85], [0, 0.22, 0], g); mk(G_BOX, '#fff4e8', [w - 0.25, 0.04, 0.75], [0, 0.46, 0], g);
  // the famous centre aisle: a kayak, a TV box, a go-kart wheel, a snowboard, a spa box
  const k = mk(G_SPH, '#ff7a3d', [0.26, 0.16, 1.2], [-0.35, 0.62, 0], g); k.rotation.y = 0.3;
  mk(G_BOX, '#26457a', [0.6, 0.42, 0.12], [0.3, 0.72, -0.2], g); mk(G_BOX, '#9fd0ff', [0.5, 0.3, 0.02], [0.3, 0.72, -0.13], g, { noShadow: true });
  const sb = mk(G_BOX, '#b9a3ff', [0.2, 0.04, 0.9], [0.55, 0.62, 0.15], g); sb.rotation.z = 0.4;
  const wh = mk(G_CYL, '#2b2d42', [0.26, 0.1, 0.26], [0.05, 0.6, 0.28], g); wh.rotation.x = Math.PI / 2;
  mk(G_BOX, '#26457a', [0.5, 0.2, 0.05], [0, 1.25, 0], g); mk(G_STAR, '#ffd166', [0.22, 0.22, 0.22], [0, 1.25, 0.05], g, { noShadow: true });
  mk(G_CYL, '#9aa3b5', [0.015, 0.6, 0.015], [0, 0.92, -0.02], g, { noShadow: true });
  g.userData.spin = true; return g;
};
OB['shop:p'] = () => makePlant(null, 0, 0, true);
// dog park
OB['park:T'] = () => makeGum(null, 0, 0, 1.25);
OB['park:b'] = w => { const g = new THREE.Group(); for (let i = 0; i < 3; i++) mk(G_BOX, '#b07a4a', [w - 0.2, 0.05, 0.12], [0, 0.42, -0.12 + i * 0.13], g); for (let i = 0; i < 2; i++) mk(G_BOX, '#b07a4a', [w - 0.2, 0.1, 0.05], [0, 0.6 + i * 0.13, -0.22], g); [-1, 1].forEach(s => { mk(G_BOX, '#4a4658', [0.06, 0.42, 0.4], [s * (w / 2 - 0.2), 0.21, -0.02], g); mk(G_BOX, '#4a4658', [0.06, 0.4, 0.05], [s * (w / 2 - 0.2), 0.55, -0.24], g); }); return g; };
OB['park:g'] = () => { const g = new THREE.Group(); const b = makeTennisBall(g); b.position.set(0, 0.16, 0); mk(G_CYL, '#7fc8f8', [0.4, 0.08, 0.4], [0.35, 0.04, -0.25], g); mk(G_CYL, '#bfe6ff', [0.32, 0.02, 0.32], [0.35, 0.085, -0.25], g, { noShadow: true, glow: true }); g.userData.ball = b; return g; };
// home
OB['home:f'] = (w, h) => {
  const g = new THREE.Group();
  mk(G_BOX, '#7fa3c9', [w - 0.1, 0.36, h - 0.2], [0, 0.18, 0.05], g); mk(G_BOX, '#8fb3d6', [w - 0.2, 0.14, h - 0.35], [0, 0.42, 0.12], g);
  mk(G_BOX, '#6f93b9', [w - 0.1, 0.62, 0.26], [0, 0.4, -h / 2 + 0.2], g);
  [-1, 1].forEach(s => mk(G_BOX, '#6f93b9', [0.22, 0.52, h - 0.2], [s * (w / 2 - 0.12), 0.3, 0.05], g));
  mk(G_BOX, '#ffd1e1', [0.36, 0.3, 0.12], [-0.4, 0.62, -h / 2 + 0.38], g).rotation.z = 0.2; mk(G_BOX, '#fff0c2', [0.36, 0.3, 0.12], [0.4, 0.62, -h / 2 + 0.38], g).rotation.z = -0.2;
  mk(G_BOX, '#f5e6c8', [0.7, 0.04, 0.9], [0.25, 0.5, 0.3], g, { noShadow: true });
  return g;
};
OB['home:V'] = (w, h) => {
  const g = new THREE.Group();
  mk(G_BOX, '#c89f7a', [w - 0.2, 0.42, 0.6], [0, 0.21, -h / 2 + 0.4], g);
  mk(G_BOX, '#2b2d42', [w - 0.4, 1.0, 0.08], [0, 0.98, -h / 2 + 0.35], g);
  const scr = mk(G_BOX, '#3a3d5c', [w - 0.55, 0.85, 0.02], [0, 0.98, -h / 2 + 0.4], g, { noShadow: true });
  scr.material = new THREE.MeshBasicMaterial({ color: '#3a3d5c' });
  makePlant(g, w / 2 - 0.3, -h / 2 + 0.4).scale.setScalar(0.7);
  mk(G_BOX, '#ffd166', [0.2, 0.12, 0.2], [-w / 2 + 0.35, 0.48, -h / 2 + 0.4], g);
  makeRug(g, 0, 0.35, w - 0.3, 1.0, ['#ffe3ec', '#ffc2d6']);
  g.userData.screen = scr; return g;
};
OB['home:H'] = w => {
  const g = new THREE.Group();
  mk(G_BOX, '#8a5a3b', [w - 0.3, 0.06, 0.8], [0, 0.55, 0], g); [-1, 1].forEach(s => mk(G_BOX, '#a06d40', [0.08, 0.55, 0.6], [s * (w / 2 - 0.35), 0.27, 0], g));
  const board = grp(g, 0, 0.59, 0);
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) mk(G_BOX, (r + c) % 2 ? '#6b4a32' : '#f5e6c8', [0.075, 0.02, 0.075], [-0.2625 + c * 0.075, 0, -0.2625 + r * 0.075], board, { noShadow: true });
  const pieces = [];
  [[0, '#fffaf0'], [7, '#2b1d1a']].forEach(([r, col]) => {
    for (const c of [0, 1, 2, 3, 5, 6, 7]) { const p = mk(G_CYL, col, [0.045, 0.1, 0.045], [-0.2625 + c * 0.075, 0.06, -0.2625 + r * 0.075], board); pieces.push(p); }
    const k = grp(board, -0.2625 + 4 * 0.075, 0.02, -0.2625 + r * 0.075); mk(G_CYL, col, [0.055, 0.16, 0.055], [0, 0.08, 0], k); mk(G_BOX, col, [0.02, 0.06, 0.02], [0, 0.19, 0], k);
    if (r === 7) g.userData.king = k;
  });
  mk(G_BOX, '#ff9fb8', [0.4, 0.36, 0.4], [-w / 2 + 0.1, 0.18, 0.65], g); mk(G_BOX, '#7fc8f8', [0.4, 0.36, 0.4], [w / 2 - 0.1, 0.18, -0.65], g);
  return g;
};
OB['home:k'] = (w, h) => {
  const g = new THREE.Group();
  mk(G_BOX, '#e7ebf1', [0.7, 0.85, h - 0.1], [0.1, 0.42, 0], g); mk(G_BOX, '#fffaf0', [0.78, 0.06, h - 0.05], [0.1, 0.87, 0], g);
  mk(G_BOX, '#c9d3e0', [0.4, 0.04, 0.5], [0.1, 0.9, -h / 2 + 0.5], g, { noShadow: true });
  mk(G_CYL, '#e2554f', [0.16, 0.2, 0.16], [0.1, 1.0, 0.2], g); mk(G_SPH, '#ffffff', [0.06, 0.04, 0.06], [0.1, 1.12, 0.2], g);
  const bowl = grp(g, 0.15, 0.9, h / 2 - 0.4); mk(G_SPH, '#fffaf0', [0.34, 0.14, 0.34], [0, 0.04, 0], bowl); [['#ffd166', 0.06], ['#e2554f', -0.06], ['#3fae7c', 0]].forEach(([c, o], i) => mk(G_SPH, c, [0.12, 0.12, 0.12], [o, 0.12, i === 2 ? 0.06 : -0.03], bowl, { noShadow: true }));
  return g;
};
OB['home:p'] = () => makePlant(null, 0, 0, true);
WALL_BUILDERS['home:w'] = w => {
  const g = new THREE.Group();
  mk(G_BOX, '#ffffff', [w * 0.92, 0.95, 0.08], [0, 0.85, 0], g); mk(G_BOX, '#bfe6ff', [w * 0.84, 0.8, 0.05], [0, 0.85, 0.03], g, { noShadow: true });
  mk(G_BOX, '#a8dc86', [w * 0.84, 0.25, 0.04], [0, 0.57, 0.04], g, { noShadow: true });
  for (let i = 0; i < w; i++) mk(G_SPH, '#8fc86f', [0.4, 0.3, 0.04], [-w / 2 + 0.5 + i, 0.7, 0.045], g, { noShadow: true });
  for (let i = 1; i < w; i++) mk(G_BOX, '#ffffff', [0.05, 0.8, 0.07], [-w / 2 + i, 0.85, 0.05], g);
  [-1, 1].forEach(s => mk(G_BOX, '#ffd1e1', [0.2, 1.0, 0.06], [s * w * 0.47, 0.82, 0.1], g));
  return g;
};

/* ---------------- the maps ---------------- */
const npcPaulo = c => c === 'A' ? LOOK.paulo : null;
MAPS.baths = {
  theme: 'baths', title: 'Weekend Pack: ' + WK.baths, sky: 'day', outdoor: true, edge: '#a6dc8f',
  floor: ['#b5e39a', '#aadd8e'], wet: '#f3dca6', wall: ['#fff', '#fff'], water: ['#4fb3e0', '#5cbde6'], intro: { x: 7, z: 1, zoom: 0.7 }, ambient: 'water',
  rows: ["~~~~~~~~~~~~~~~", "~~~~~~~~~~~~~~~", "_______________", "...u.......p...", "......A........", "............KK.", "....s.....s....", "...............", "..........JJ...", "..............."],
  start: { x: 8, z: 4, dir: 'up' }, luca: { x: 5, z: 5 },
  npcs: npcPaulo,
  hints: () => [!F.wkBaths && '~', F.wkBaths && 'J'],
  decorate(g) {
    // the harbour beyond the island, the netted swim enclosure, sandstone, a ferry and a sailboat
    mk(G_BOX, '#6fc3e8', [40, 0.3, 14], [7, -0.32, -7.5], g, { alpha: 0.95, noShadow: true });
    for (let i = 0; i < 30; i++) mk(G_BOX, '#e8f7ff', [0.4 + hsh(i, 2), 0.02, 0.05], [-8 + hsh(i, 3) * 30, -0.15, -13 + hsh(i, 4) * 12], g, { noShadow: true, glow: true, alpha: 0.7 });
    for (let x = 0; x <= 14; x += 1) { mk(G_CYL, '#8a6a55', [0.1, 1.1, 0.1], [x, 0.2, -0.3], g); if (x < 14) { mk(G_BOX, '#fffaf0', [1, 0.03, 0.03], [x + 0.5, 0.62, -0.3], g, { noShadow: true }); for (let k = 0; k < 4; k++) mk(G_BOX, '#fffaf0', [0.015, 0.5, 0.015], [x + 0.2 + k * 0.2, 0.35, -0.3], g, { noShadow: true, alpha: 0.6 }); mk(G_SPH, x % 2 ? '#ff7aa8' : '#ffd166', [0.12, 0.12, 0.12], [x + 0.5, 0.64, -0.3], g, { noShadow: true }); } }
    [-0.62, 14.62].forEach(x => { for (let z = -0.4; z < 3; z += 0.7) mk(G_BOX, ['#e2b97f', '#d6a86c', '#ecc690'][Math.floor(hsh(x, z * 10) * 3)], [0.5, 0.5 + hsh(z * 7, x) * 0.4, 0.66], [x, 0.1, z], g); });
    mk(G_BOX, '#c89f7a', [3, 0.12, 0.9], [7, 0.02, 1.8], g); for (let i = 0; i < 6; i++) mk(G_BOX, '#b58a64', [0.04, 0.13, 0.88], [5.6 + i * 0.55, 0.025, 1.8], g, { noShadow: true });
    mk(G_BOX, '#fffaf0', [0.5, 0.06, 0.9], [7, 0.3, 1.2], g); mk(G_CYL, '#c7ccd6', [0.04, 0.5, 0.04], [6.8, 0.25, 1.6], g); mk(G_CYL, '#c7ccd6', [0.04, 0.5, 0.04], [7.2, 0.25, 1.6], g);
    const ferry = grp(g, -6, -0.1, -5.5);
    mk(G_BOX, '#2e7d4f', [3.2, 0.45, 1.1], [0, 0.22, 0], ferry); mk(G_BOX, '#ffe27a', [3.3, 0.12, 1.15], [0, 0.5, 0], ferry);
    mk(G_BOX, '#fffaf0', [2.4, 0.5, 0.9], [0, 0.8, 0], ferry); for (let i = 0; i < 6; i++) mk(G_BOX, '#355077', [0.28, 0.2, 0.92], [-1 + i * 0.4, 0.85, 0], ferry, { noShadow: true });
    mk(G_BOX, '#2e7d4f', [1.2, 0.3, 0.8], [0, 1.2, 0], ferry); mk(G_CYL, '#ffe27a', [0.18, 0.4, 0.18], [0.4, 1.5, 0], ferry);
    const boat = grp(g, 16, -0.12, -10); mk(G_BOX, '#ffffff', [1.1, 0.25, 0.4], [0, 0.12, 0], boat); mk(G_CYL, '#c7ccd6', [0.03, 1.5, 0.03], [0, 0.95, 0], boat); const sail = mk(G_CONE, '#ffffff', [0.6, 1.3, 0.05], [0.2, 0.95, 0], boat); sail.rotation.z = -0.05;
    const far = grp(g, 7, -0.3, -14.5); for (let i = 0; i < 14; i++) { const x = -18 + i * 2.8 + hsh(i, 5); mk(G_SPH, ['#8fc86f', '#7fb862', '#9fd07e'][i % 3], [3.4, 1.6 + hsh(i, 6) * 1.4, 2.2], [x, 0.3, 0], far, { noShadow: true }); mk(G_BOX, ['#fff4e8', '#ffd1e1', '#e8f4ff', '#fff0c2'][i % 4], [0.7, 0.5, 0.5], [x + 0.4, 0.9 + hsh(i, 6) * 0.6, 0.7], far, { noShadow: true }); mk(G_CONE, '#e2554f', [0.8, 0.35, 0.6], [x + 0.4, 1.33 + hsh(i, 6) * 0.6, 0.7], far, { noShadow: true }).rotation.y = Math.PI / 4; }
    // lap-lane ropes, sun loungers, a lifeguard chair, Cockatoo Island and the city skyline beyond
    for (let x = 0; x < 15; x += 0.35) mk(G_SPH, Math.round(x / 0.35) % 2 ? '#ffffff' : '#e2554f', [0.12, 0.08, 0.12], [x, -0.02, 0.5], g, { noShadow: true });
    [[0.2, 6.2], [0.2, 7.3], [14.8, 6.2], [14.8, 7.3]].forEach(([x, z], i) => { const l = grp(g, x, 0, z); mk(G_BOX, '#fffaf0', [0.5, 0.08, 0.95], [0, 0.22, 0], l); mk(G_BOX, i % 2 ? '#7fc8f8' : '#ff9fb8', [0.46, 0.05, 0.9], [0, 0.28, 0], l, { noShadow: true }); const bk = mk(G_BOX, '#fffaf0', [0.5, 0.06, 0.4], [0, 0.4, -0.4], l); bk.rotation.x = -0.9; });
    const lg = grp(g, 13.4, 0, 2.4); [-0.2, 0.2].forEach(x => mk(G_CYL, '#fffaf0', [0.05, 1.2, 0.05], [x, 0.6, 0], lg)); mk(G_BOX, '#ffd166', [0.55, 0.06, 0.45], [0, 1.2, 0], lg); mk(G_BOX, '#e2554f', [0.55, 0.3, 0.05], [0, 1.4, -0.2], lg);
    const ci = grp(g, 1, -0.3, -11); mk(G_SPH, '#b89a72', [6, 1.2, 2.6], [0, 0, 0], ci, { noShadow: true }); mk(G_SPH, '#8fb07a', [4, 1.3, 2], [0.5, 0.3, 0], ci, { noShadow: true }); [-1.5, 1.2].forEach(x => { mk(G_BOX, '#c9a36a', [0.12, 1.8, 0.12], [x, 1.2, 0.3], ci); const jib = mk(G_BOX, '#c9a36a', [1.4, 0.1, 0.1], [x + 0.5, 2.1, 0.3], ci); jib.rotation.z = 0.2; });
    const city = grp(g, 17, -0.3, -15); for (let i = 0; i < 9; i++) { const h = 1.5 + hsh(i, 7) * 3.5; mk(G_BOX, ['#b9c7ff', '#d8e2ff', '#c7f0e0', '#e2d8ff'][i % 4], [0.9, h, 0.9], [i * 1.05, h / 2, hsh(i, 8)], city, { noShadow: true }); }
    W.wk = { ferry, boat };
    wkTicker(updateBaths);
  },
  onEnter() { G.wearing = 'sunny'; say(["EXPANSION PACK: a weekend with Paulo.", "No alarms, no meetings. Just a slow Saturday.", WK.baths + ": a netted harbour pool on Greenwich Point.", "Across the water: Cockatoo Island and the city skyline.", "Luca sniffs every blade of grass on the lawn.", "Face the water and press A for a morning dip."]); },
  doorOpen: () => false,
  doorLocked: () => "The car's parked over on the sand.",
  act: {
    '~': () => F.wkBaths ? say("That water is perfect. One more dip later.") : swimBaths(),
    _: () => F.wkBaths ? say("That water is perfect. One more dip later.") : swimBaths(),
    J: () => F.wkBaths ? say([CONFIG.car + " is packed. Next stop: " + WK.shops + " for the ALDI run.", { n: CONFIG.name, t: CONFIG.catchphrase }], () => { const c = W.objs.find(o => o.ch === 'J'); if (c) { sfx('honk'); confetti(c.x + 0.5, 1, c.z, 24); } startDrive('suburb', 'aldi', WK.shops); }) : say({ n: CONFIG.boyfriend, t: "Leaving already? Let's have a dip first!" }),
    u: () => say("A stripy umbrella planted in the lawn."),
    p: () => say("A gum tree leaning over the baths."),
    s: () => say("A little shell. Luca sniffs it suspiciously."),
    K: () => say(["The kiosk: espresso, gelato and hot chips.", "Coffee on a sun lounger by the water, obviously."]),
    A: () => say(F.wkBaths ? { n: CONFIG.boyfriend, t: "Best swim of the year. Ready when you are." } : { n: CONFIG.boyfriend, t: "Greenwich Baths, all to ourselves. Race you in?" })
  }
};
MAPS.aldi = {
  theme: 'shop', title: 'Weekend Pack: ' + WK.grocer, sky: 'day', edge: '#a6dc8f',
  floor: ['#d8e0ea', '#cbd5e2'], wall: ['#dfe9f5', '#d4e2f2'], trim: '#ffffff',
  rows: ["###############", "#SS..SS..SS.p.#", "#.............#", "#SS..SS..zz...#", "#......A......#", "#SS..SS..BB...#", "#.............#", "#..cc.....cc..#", "#.............#", "######D########"],
  start: { x: 7, z: 8, dir: 'up' },
  npcs: npcPaulo,
  hints: () => [!F.wkGroceries && 'A', F.wkGroceries && 'D'],
  decorate(g) {
    for (let z = 2; z <= 8; z += 2) mk(G_BOX, '#fffaf0', [12, 0.02, 0.05], [7, 0.005, z + 0.5], g, { noShadow: true });
    const tr = grp(g, 8.2, 0, 4.6); tr.rotation.y = -0.3;
    mk(G_BOX, '#c7ccd6', [0.55, 0.36, 0.75], [0, 0.62, 0], tr, { alpha: 0.9 }); mk(G_BOX, '#ffffff', [0.5, 0.02, 0.7], [0, 0.46, 0], tr, { noShadow: true });
    mk(G_CYL, '#9aa3b5', [0.03, 0.4, 0.03], [-0.22, 0.22, 0.3], tr); mk(G_CYL, '#9aa3b5', [0.03, 0.4, 0.03], [0.22, 0.22, 0.3], tr); mk(G_CYL, '#9aa3b5', [0.03, 0.4, 0.03], [-0.22, 0.22, -0.3], tr); mk(G_CYL, '#9aa3b5', [0.03, 0.4, 0.03], [0.22, 0.22, -0.3], tr);
    [[-0.22, 0.3], [0.22, 0.3], [-0.22, -0.3], [0.22, -0.3]].forEach(([x, z]) => mk(G_SPH, '#3a3148', [0.08, 0.08, 0.08], [x, 0.04, z], tr));
    const h = mk(G_CYL, '#e2554f', [0.04, 0.6, 0.04], [0, 0.9, -0.42], tr); h.rotation.z = Math.PI / 2;
    W.wk = { trolley: tr, bag: 0 };
    wkTicker(updateAldi);
  },
  onEnter() { G.wearing = 'sunny'; say([WK.shops + " City on a Saturday. Down the escalators to LG2, right by Kmart.", WK.grocer + " first.", "Luca's snoozing in the car with the window cracked.", { n: CONFIG.boyfriend, t: "Here's the list. Divide and conquer?" }]); },
  doorOpen: () => F.wkGroceries,
  doorLocked: () => ({ n: CONFIG.boyfriend, t: "Not without the groceries! Grab the list off me." }),
  onDoor() { G.mode = 'busy'; say(["Bags loaded. Luca approves of the dog treats.", { n: CONFIG.name, t: CONFIG.catchphrase }], () => startDrive('suburb', 'park', 'the dog park')); },
  act: {
    A: () => F.wkGroceries ? say({ n: CONFIG.boyfriend, t: "Trolley's full. That was a solid run." }) : groceryGame(),
    c: () => F.wkGroceries ? say("Checkout cleared at record ALDI speed.") : say({ n: CONFIG.boyfriend, t: "Grab the list off me first!" }),
    S: () => say("Shelves stacked to the ceiling. Middle aisle is dangerous."),
    z: () => say("The freezer aisle. Someone say ice cream?"),
    B: () => say("The centre aisle of Special Buys. Absolutely none of this is on the list."),
    p: () => say("A shop plant. Surprisingly thriving under the fluoros.")
  }
};
MAPS.park = {
  theme: 'park', title: 'Weekend Pack: Ryde Park', sky: 'day', outdoor: true, edge: '#a6dc8f', ambient: 'cicada',
  floor: ['#a6dc8f', '#9bd483'], wall: ['#fff', '#fff'],
  rows: ["###############", "#T....T.....T.#", "#..........y..#", "#....g....k...#", "#.......A.....#", "#..o.......y..#", "#..b.......b..#", "#....k........#", "#.............#", "######D########"],
  start: { x: 7, z: 8, dir: 'up' }, luca: { x: 9, z: 8 },
  npcs: c => c === 'A' ? LOOK.paulo : 'yko'.includes(c) ? 'luca' : null,
  hints: () => [!F.wkFetch && 'g', F.wkFetch && 'D'],
  decorate(g) {
    // picket fence along the border, a sign, a water tap and a few extra flowers
    for (let z = 0; z < 10; z++) for (let x = 0; x < 15; x++) {
      if (!(z === 0 || z === 9 || x === 0 || x === 14) || W.grid[z][x] === 'D') continue;
      mk(G_BOX, '#fffaf0', [0.14, 0.7, 0.08], [x, 0.35, z], g); mk(G_CONE, '#fffaf0', [0.14, 0.14, 0.08], [x, 0.77, z], g, { noShadow: true });
      const horiz = z === 0 || z === 9; mk(G_BOX, '#f1e4d2', horiz ? [1, 0.06, 0.05] : [0.05, 0.06, 1], [x, 0.5, z], g, { noShadow: true }); mk(G_BOX, '#f1e4d2', horiz ? [1, 0.06, 0.05] : [0.05, 0.06, 1], [x, 0.25, z], g, { noShadow: true });
    }
    // a little coffee cart for the park cafe
    const cart = grp(g, 12.6, 0, 8.4); mk(G_BOX, '#2f5d4a', [0.9, 0.7, 0.5], [0, 0.45, 0], cart); mk(G_BOX, '#fffaf0', [1.0, 0.06, 0.6], [0, 0.82, 0], cart); [-0.3, 0.3].forEach(x => { const wh = mk(G_CYL, '#3a3148', [0.22, 0.06, 0.22], [x, 0.11, 0.26], cart); wh.rotation.x = Math.PI / 2; }); for (let i = 0; i < 4; i++) mk(G_BOX, i % 2 ? '#fffaf0' : '#e2554f', [0.26, 0.04, 0.4], [-0.39 + i * 0.26, 1.25, 0.1], cart).rotation.x = 0.3; [-0.4, 0.4].forEach(x => mk(G_CYL, '#c7ccd6', [0.03, 0.45, 0.03], [x, 1.05, -0.1], cart, { noShadow: true })); mk(G_CYL, '#fffaf0', [0.1, 0.12, 0.1], [0.2, 0.92, 0.05], cart);
    const sign = grp(g, 4.3, 0, 8.8); mk(G_CYL, '#8a6a55', [0.06, 0.9, 0.06], [0, 0.45, 0], sign); mk(G_BOX, '#3fae7c', [0.9, 0.4, 0.05], [0, 0.95, 0], sign); mk(G_BOX, '#fffaf0', [0.7, 0.05, 0.02], [0, 1.0, 0.03], sign, { noShadow: true }); mk(G_BOX, '#fffaf0', [0.5, 0.05, 0.02], [0, 0.9, 0.03], sign, { noShadow: true });
    for (let i = 0; i < 18; i++) makeFlower(g, 1 + hsh(i, 41) * 12.5, 1 + hsh(i, 42) * 7.5, CONFETTI[i % 5]).scale.setScalar(0.8);
    W.npcs.forEach(n => { if ('yko'.includes(n.ch)) { recolorDog(n.g, n.ch); n.g.scale.setScalar(n.ch === 'o' ? 0.8 : 1.12); n.phase = Math.random() * TAU; } });
    W.wk = {};
    wkTicker(updatePark);
  },
  onEnter() { G.wearing = 'sunny'; if (!G.lucaPat.park) { G.lucaPat.park = true; stat('happy', 5); } say(["Ryde Park's fenced dog park. Off-leash heaven, and it's full of happy dogs today.", "Luca does a lap of zoomies to say hello to everyone.", { n: CONFIG.boyfriend, t: "Grab the ball. He's already staring at it." }]); },
  doorOpen: () => F.wkFetch,
  doorLocked: () => "One round of fetch first, Luca's begging.",
  onDoor() { G.mode = 'busy'; say(["Luca trots home happy and worn out.", { n: CONFIG.name, t: CONFIG.catchphrase }], () => fade(() => loadMap('home'))); },
  act: {
    g: () => F.wkFetch ? say("The ball's thoroughly slobbered. Luca is content.") : fetchGame(),
    T: () => say("A big shady gum. Cicadas going nuts."),
    b: () => say(["A park bench. Prime dog-watching seat.", "Coffees from the Grounds Keeper Cafe, right here in the park."]),
    y: () => say("A golden retriever, utterly ball-obsessed."),
    k: () => say("A sleek black lab nailing every recall."),
    o: () => say("A fluffy grey pup, all bounce and zero chill."),
    A: () => say(F.wkFetch ? { n: CONFIG.boyfriend, t: "He's going to sleep the whole way home." } : { n: CONFIG.boyfriend, t: "Off the leash! Go on, Luca!" })
  }
};
MAPS.home = {
  theme: 'home', title: 'Weekend Pack: home', sky: 'golden', edge: '#a6dc8f',
  floor: ['#e9c9a0', '#e2bf94'], wall: ['#fff1e0', '#ffe9d2'], trim: '#ffffff',
  rows: ["###wwww###wwww#", "#............p#", "#..VV........k#", "#..VV........k#", "#..ff....HH...#", "#..ff.........#", "#......A......#", "#.............#", "#.............#", "######D########"],
  start: { x: 9, z: 8, dir: 'up' }, luca: { x: 6, z: 8 },
  npcs: npcPaulo,
  hints: () => [!F.wkMovie && 'V', F.wkMovie && !F.wkActivity && 'H', F.wkMovie && F.wkActivity && 'D'],
  decorate(g) {
    makeRug(g, 9.5, 6.5, 3, 2, ['#c9e7d8', '#9fd6bc']);
    mk(G_CYL, '#fff4b0', [0.35, 0.05, 0.35], [7, 1.9, 4], g, { glow: true, noShadow: true }); mk(G_CYL, '#c7ccd6', [0.01, 0.5, 0.01], [7, 2.15, 4], g, { noShadow: true });
    const bed = grp(g, 12.4, 0, 7.6); mk(G_CYL, '#ff9fb8', [0.9, 0.16, 0.7], [0, 0.08, 0], bed); mk(G_CYL, '#fff0f6', [0.7, 0.12, 0.52], [0, 0.12, 0], bed, { noShadow: true });
    for (let i = 0; i < 3; i++) mk(G_BOX, ['#ffd1e1', '#c9e7d8', '#fff0c2'][i], [0.5, 0.35, 0.03], [3 + i * 0.7 + (i ? 4 : 0), 1.1, 0.53], g);
    W.wk = {};
    wkTicker(updateHome);
  },
  onEnter() { G.wearing = 'sunny'; say(["Home again. Luca flops on his back instantly.", "A whole afternoon with nothing booked.", { n: CONFIG.boyfriend, t: "Movie first, then chess or a picnic. Dealer's choice." }]); },
  doorOpen: () => F.wkMovie && F.wkActivity,
  doorLocked: () => (!F.wkMovie ? "Watch a film first! It's a weekend." : "Chess or a picnic first, then we'll head out."),
  onDoor() { G.mode = 'busy'; say(["Shoes on, Luca settled with a chew.", { n: CONFIG.boyfriend, t: "Let's go out and finish the weekend right." }], () => fade(weekendOut)); },
  act: {
    V: () => F.wkMovie ? say("Credits already rolled. Great pick.") : movieMenu(),
    H: () => !F.wkMovie ? say({ n: CONFIG.boyfriend, t: "Movie first, then I'll lose at chess." }) : F.wkActivity ? say("Good game. Rematch after dinner.") : chessGame(),
    k: () => !F.wkMovie ? say("Snacks later, film's starting.") : F.wkActivity ? say("Picnic's already packed.") : picnicChoice(),
    f: () => say("The comfiest couch in Sydney. Luca's throne too."),
    w: () => say("Afternoon light pours in over the garden."),
    p: () => say("A happy little pot plant."),
    A: () => say(!F.wkMovie ? { n: CONFIG.boyfriend, t: "Home sweet home. Movie on the telly?" } : !F.wkActivity ? { n: CONFIG.boyfriend, t: "Chess board's out, or shall we pack a picnic?" } : { n: CONFIG.boyfriend, t: "What a day. Dinner out to finish it off?" })
  }
};

/* ---------------- start ---------------- */
function resetWeekend() {
  WK_FLAGS.forEach(k => { delete F[k]; });
  G.weekend = true; G.wearing = 'sunny'; G.outfit = 'sunny'; G.wkImpulse = null; cam.orbit = 0;
  WKLOG = { list: 0, impulse: [], fetch: [], movie: null, activity: null, night: null };
}
CAMPAIGN_STATE.weekend = {
  save: () => ({ log: WKLOG, impulse: G.wkImpulse }),
  load: x => { resetWeekend(); Object.assign(WKLOG, x.log || {}); G.wkImpulse = x.impulse || null; }
};
function startWeekend() { G.campaign = 'weekend'; resetWeekend(); clearUI(); fade(() => loadMap('baths')); }

/* ---------------- Greenwich Baths: the morning dip ---------------- */
function swimBaths() {
  F.wkBaths = true; stat('happy', 8); stat('energy', 6);
  const p = W.player, a = W.npcs.find(n => n.ch === 'A');
  W.wk.swim = { t: 0, x0: p.g.position.x, z0: p.g.position.z, px: a && a.g.position.x, pz: a && a.g.position.z, pa: a, done: false, back: 0 };
  say([{ n: CONFIG.name, t: "In we go!" }, "The harbour water is cool and clear.", "You float on your back and watch the ferries drift past.", { n: CONFIG.boyfriend, t: "Told you. Best spot in Sydney." }], () => { if (W.wk && W.wk.swim) W.wk.swim.done = true; });
  refreshHints();
}
function updateBaths(dt, t) {
  const k = W && W.wk; if (!k) return;
  k.ferry.position.x += dt * 0.9; if (k.ferry.position.x > 22) k.ferry.position.x = -10; k.ferry.position.y = -0.1 + Math.sin(t * 1.3) * 0.04; k.ferry.rotation.z = Math.sin(t * 0.9) * 0.02;
  k.boat.position.x -= dt * 0.4; if (k.boat.position.x < -12) k.boat.position.x = 24; k.boat.rotation.z = Math.sin(t * 1.1) * 0.08;
  const s = k.swim; if (!s) return;
  s.t += dt; const p = W.player, swimmers = [[p.g, s.x0, s.z0, 0]].concat(s.pa ? [[s.pa.g, s.px, s.pz, 1.3]] : []);
  swimmers.forEach(([g, x0, z0, off], i) => {
    const u = g.userData, wx = x0 + off + Math.sin(s.t * 0.7 + i) * 1.2, wz = 0.6;
    let ph = s.done ? 1 - Math.min(1, s.back / 0.6) : Math.min(1, s.t / 0.7);
    if (ph >= 1 && !s.done && !s['sp' + i]) { s['sp' + i] = true; FX.emit(wx, 0, wz, ['#bfe6ff', '#ffffff', '#8fd3f0'], 30, 3, { g: 7, life: 1, lift: 2 }); sfx('pop'); }
    const x = lerp(x0, wx, ph), z = lerp(z0, wz, ph), y = ph < 1 ? Math.sin(ph * Math.PI) * 0.9 - ph * 0.35 : -0.35 + Math.sin(t * 2.2 + i) * 0.05;
    g.position.set(x, y, z);
    if (ph >= 1) { g.rotation.y = Math.PI + Math.sin(s.t * 0.7 + i) * 0.6; u.armL.rotation.x = Math.sin(t * 5 + i) * 1.4 - 1.2; u.armR.rotation.x = -Math.sin(t * 5 + i) * 1.4 - 1.2; if (Math.random() < dt * 6) FX.emit(x + (Math.random() - 0.5) * 0.4, 0, z, ['#ffffff', '#bfe6ff'], 3, 1.2, { g: 5, life: 0.6, lift: 1 }); }
  });
  if (s.done) { s.back += dt; if (s.back >= 0.6) { placeEntity(p, 1); p.g.position.y = 0; if (s.pa) s.pa.g.position.set(s.px, 0, s.pz); FX.emit(p.g.position.x, 0.5, p.g.position.z, ['#bfe6ff', '#ffffff'], 16, 1.5, { g: 4 }); k.swim = null; } }
}

/* ---------------- Top Ryde ALDI: the grocery dash ---------------- */
function trolleyAdd(col, big) {
  const k = W && W.wk; if (!k || !k.trolley) return;
  const i = k.bag++, s = big ? 0.3 : 0.14;
  const b = mk(big ? G_SPH : G_BOX, col, [s * (big ? 1.4 : 1), s, s * (big ? 2.2 : 1)], [-0.15 + (i % 3) * 0.15, 0.55 + Math.floor(i / 3) * 0.13 + (big ? 0.2 : 0), -0.2 + (i % 2) * 0.25], k.trolley, { noShadow: true });
  b.userData.pop = 0; b.userData.to = b.scale.clone(); b.scale.setScalar(0.001); (k.pops = k.pops || []).push(b);
  const wp = k.trolley.localToWorld(V3.set(0, 0.8, 0)); sparkle(wp.x, wp.y, wp.z, big ? 30 : 12);
}
function updateAldi(dt, t) {
  const k = W && W.wk; if (!k) return;
  (k.pops || []).forEach(b => { if (b.userData.pop < 1) { b.userData.pop = Math.min(1, b.userData.pop + dt * 3); b.scale.copy(b.userData.to).multiplyScalar(Math.max(0.001, easeOutBack(b.userData.pop))); } });
  const bin = W.objs.find(o => o.ch === 'B'); if (bin && bin.g.children[0]) { const star = bin.g.children[bin.g.children.length - 2]; if (star) star.rotation.y += dt * 2; }
}
function groceryGame() {
  clearUI();
  const need = WK.shopList.slice();
  const extras = shuffle(WK.shopExtras.slice()).slice(0, 3);
  const specials = shuffle(WK.specialBuys.slice()).slice(0, 2);
  const items = shuffle(need.map(n => ({ n, k: 'need' })).concat(extras.map(n => ({ n, k: 'extra' })), specials.map(n => ({ n, k: 'special' }))));
  let got = 0, chaos = 0; const bag = [];
  const p = panel(esc(WK.grocer) + ' dash', 'Grab the list, and try to resist the centre aisle. List: ' + esc(need.join(', ')), 'grid2');
  const cnt = el('p', 'sub cnt'); cnt.style.margin = '10px 0 0'; p.append(cnt);
  const upd = () => { cnt.textContent = got + ' / ' + need.length + ' in the trolley' + (chaos ? '  ·  ' + chaos + ' impulse buy' + (chaos > 1 ? 's' : '') : ''); };
  const react = name => ['A ' + name + '?! Into the trolley it goes... no. NO.', 'We absolutely do not need a ' + name.toLowerCase() + '.', 'Ooh, ' + name + '. Paulo is already Googling reviews.', name + ' was NOT on the list. Classic centre aisle.'][Math.floor(Math.random() * 4)];
  const finish = () => {
    MENU = null; clearUI(); G.mode = 'busy'; F.wkGroceries = true; stat('energy', 6, true); stat('happy', 6 + chaos, true);
    WKLOG.list = got;
    const lines = [{ n: CONFIG.name, t: "Trolley sorted." }];
    if (chaos) lines.push({ n: CONFIG.boyfriend, t: "We came for four things and left with a " + G.wkImpulse + "." }, { n: CONFIG.name, t: "The centre aisle got us again." });
    else lines.push("Straight down the list, zero impulse buys. Iconic.");
    lines.push({ n: CONFIG.name, t: CONFIG.catchphrase });
    confetti(W.player.g.position.x, 1.2, W.player.g.position.z, 40); sfx('badge');
    moment('Trolley sorted', { e: '🛒', k: 'cart', props: [], items: bag.slice(0, 6), line: chaos ? 'Plus one very unnecessary ' + G.wkImpulse : 'Every single thing on the list', ms: 2000 }, () => { G.mode = 'map'; say(lines, refreshHints); });
  };
  const btns = items.map((it, i) => {
    const label = it.k === 'special' ? '<span>' + esc(it.n) + '</span><small>&#11088; Centre aisle special buy</small>' : '<span>' + esc(it.n) + '</span>';
    return makeBtn(label, b => {
      if (b.classList.contains('done')) return;
      if (it.k === 'need') {
        b.classList.add('done'); b.disabled = true; got++; sfx('good'); upd(); trolleyAdd(PRODUCT[i % PRODUCT.length]); flyPic(b, cnt); const ic = iconFor(it.n); if (ic) bag.push(ic.e);
        if (got >= need.length) finish();
        else { const n = MENU && MENU.b.findIndex(x => !x.disabled); if (MENU && MENU.b[MENU.i].disabled && n >= 0) focusMenu(n); }
      } else if (it.k === 'special') {
        b.classList.add('done'); chaos++; earn('aisle'); G.wkImpulse = it.n.toLowerCase(); WKLOG.impulse.push(it.n); sfx('pop'); toast(react(it.n)); upd(); trolleyAdd(CONFETTI[i % 5], true); flyPic(b, cnt); const ic = iconFor(it.n); if (ic && !bag.includes(ic.e)) bag.push(ic.e);
      } else { sfx('bad'); p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake'); toast('Not on the list!'); }
    });
  });
  p.querySelector('.grid2').append(...btns); upd();
  setMenu(btns, { cols: innerWidth > 460 ? 2 : 1, onBack: () => { clearUI(); G.mode = 'map'; } });
}

/* ---------------- dog park: fetch with a real thrown ball ---------------- */
let FT = null;
function fetchGame() {
  if (!W || !W.luca) return;
  clearUI(); G.mode = 'fetch'; G.lift = { hold: true };
  const p = W.player, L = W.luca, spot = W.objs.find(o => o.ch === 'g');
  if (spot) spot.g.userData.ball.visible = false;
  const dirZ = p.z > 4.5 ? -1 : 1, ball = makeTennisBall(world);
  FT = { round: 0, total: 3, res: [], phase: 'aim', power: 0, pdir: 1, last: 0, ball, b: { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, stopped: false }, dirZ, spot, lx: p.g.position.x + 0.7, lz: p.g.position.z + 0.1, leg: 0, end: 0 };
  L.moving = false; L.queue = null;
  cam.goal.set(7, 0, 4.5); cam.zoomGoal = 0.95;
  const d = el('div', 'dock', `<h3>Fetch with Luca</h3><p class="sub fhint" style="margin:0 0 8px">Throw 1 of 3, press A to throw. A bigger throw is a happier Luca!</p><div class="meter"><b id="fpow"></b></div><div class="reps">${'<span class="rep"></span>'.repeat(3)}</div>`);
  const b = makeBtn('Throw!', fetchThrow, 'big'); b.style.width = '100%'; d.append(b);
  ui.append(d); setMenu([b], { keepMode: true }); FT.dock = d;
  sfx('woof');
}
function fetchHint(s) { const h = FT && FT.dock && FT.dock.querySelector('.fhint'); if (h) h.textContent = s; }
function fetchTier(p) { return p >= 0.72 ? 'great' : p >= 0.42 ? 'good' : 'short'; }
function fetchThrow() {
  if (!FT || FT.phase !== 'aim') return;
  const P = FT.power, p = W.player.g.position, b = FT.b;
  FT.last = P; FT.phase = 'fly';
  Object.assign(b, { x: p.x + 0.25, y: 0.85, z: p.z, vx: (Math.random() - 0.5) * 1.2, vy: 3.4 + P * 2.6, vz: FT.dirZ * (2.6 + P * 5.2), stopped: false });
  if (W.player.g.userData.armR) W.player.g.userData.armR.rotation.x = -2.6;
  sfx('whoosh'); fetchHint('Go get it, Luca!'); buzz(15);
}
function updatePark(dt, t) {
  if (!W || !W.wk) return;
  // the other dogs bounce, wag and trot little circles
  W.npcs.forEach(n => { if (!n.phase) return; const u = n.g.userData, a = t * 0.9 + n.phase; n.g.position.x = n.x + Math.cos(a) * 0.25; n.g.position.z = n.z + Math.sin(a) * 0.2; n.g.position.y = Math.abs(Math.sin(t * 6 + n.phase)) * 0.06; u.tail.rotation.z = Math.sin(t * 16 + n.phase) * 0.7; u.legs.forEach((L, i) => L.rotation.x = Math.sin(t * 9 + n.phase + (i % 2) * Math.PI) * 0.5); });
  if (!FT) return;
  const L = W.luca.g, u = L.userData, b = FT.b, P = W.player.g.position;
  const run = (tx, tz, sp) => { const dx = tx - FT.lx, dz = tz - FT.lz, d = Math.hypot(dx, dz); if (d > 0.05) { const s = Math.min(d, sp * dt); FT.lx += dx / d * s; FT.lz += dz / d * s; L.rotation.y = Math.atan2(dx, dz); FT.leg += dt * 18; } return d; };
  let moving = false;
  if (FT.phase === 'aim') {
    FT.power += FT.pdir * 1.1 * dt; if (FT.power >= 1) { FT.power = 1; FT.pdir = -1; } if (FT.power <= 0) { FT.power = 0; FT.pdir = 1; }
    const bar = $('#fpow'); if (bar) bar.style.width = (FT.power * 100) + '%';
    FT.ball.position.set(P.x + 0.25, 0.8, P.z);
    L.rotation.y = Math.atan2(0, FT.dirZ) + Math.sin(t * 3) * 0.2;
  } else if (FT.phase === 'fly') {
    if (!b.stopped) {
      b.vy -= 9 * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt;
      if (b.y <= 0.08) { b.y = 0.08; if (b.vy < -1.4) { b.vy = -b.vy * 0.45; b.vx *= 0.75; b.vz *= 0.75; sfx('blip'); FX.emit(b.x, 0.1, b.z, ['#c9e7a8', '#ffffff'], 5, 1, { g: 5, life: 0.5 }); } else { b.vy = 0; const f = Math.max(0, 1 - 2.5 * dt); b.vx *= f; b.vz *= f; } }
      if (b.x < 0.9 || b.x > 13.1) { b.vx = -b.vx * 0.6; b.x = clamp(b.x, 0.9, 13.1); }
      if (b.z < 0.9 || b.z > 8.1) { b.vz = -b.vz * 0.6; b.z = clamp(b.z, 0.9, 8.1); }
      if (b.y <= 0.08 && Math.hypot(b.vx, b.vz) < 0.25) b.stopped = true;
      FT.ball.position.set(b.x, b.y + 0.08, b.z); FT.ball.rotation.x += dt * 12;
    }
    const d = run(b.x, b.z, 5.2); moving = d > 0.05;
    if (b.stopped && d < 0.35) { FT.phase = 'return'; sfx('woof'); fetchHint('Good boy! Bringing it back...'); }
    if (W.player.g.userData.armR) W.player.g.userData.armR.rotation.x = lerp(W.player.g.userData.armR.rotation.x, 0, dt * 4);
  } else if (FT.phase === 'return') {
    const d = run(P.x + 0.6, P.z + 0.15, 4.4); moving = d > 0.3;
    L.updateMatrixWorld(); const hp = L.localToWorld(V3.set(0, 0.55, 0.62)); FT.ball.position.copy(hp);
    if (d <= 0.3) fetchRoundDone();
  } else if (FT.phase === 'done') { FT.end -= dt; if (FT.end <= 0) finishFetch(); return; }
  L.position.set(FT.lx, moving ? Math.abs(Math.sin(FT.leg)) * 0.1 : 0, FT.lz);
  u.legs.forEach((l, i) => l.rotation.x = moving ? Math.sin(FT.leg + ((i === 0 || i === 3) ? 0 : Math.PI)) * 0.8 : 0);
  u.tail.rotation.z = Math.sin(t * (moving ? 20 : 12)) * 0.7;
  u.ears.forEach((e, i) => e.rotation.x = moving ? -0.3 - Math.abs(Math.sin(FT.leg)) * 0.3 : 0);
}
function fetchRoundDone() {
  const tier = fetchTier(FT.last); FT.res.push(tier); WKLOG.fetch.push(tier);
  const dot = FT.dock.querySelectorAll('.rep')[FT.round]; if (dot) dot.classList.add(tier === 'great' ? 'perfect' : tier === 'good' ? 'good' : 'miss');
  FT.round++; sfx(tier === 'great' ? 'good' : 'blip');
  const hp = W.luca.g.position; FX.emit(hp.x, 0.9, hp.z, ['#ff7aa8', '#ffd166'], tier === 'great' ? 20 : 8, 1.4, { g: -1.5, life: 1 });
  if (FT.round >= FT.total) { FT.phase = 'done'; FT.end = 0.8; fetchHint('What a team!'); return; }
  FT.phase = 'aim'; FT.power = 0; FT.pdir = 1; FT.b.stopped = false;
  fetchHint('Throw ' + (FT.round + 1) + ' of 3, press A to throw!');
}
function finishFetch() {
  const great = FT.res.filter(r => r === 'great').length, ok = FT.res.filter(r => r !== 'short').length;
  world.remove(FT.ball); if (FT.spot) FT.spot.g.userData.ball.visible = true;
  const L = W.luca, p = W.player;
  const spot = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dz]) => [p.x + dx, p.z + dz]).find(([x, z]) => walkable(x, z) && !objAt(x, z)) || [p.x, p.z];
  Object.assign(L, { x: spot[0], z: spot[1], tx: spot[0], tz: spot[1], moving: false, queue: null }); placeEntity(L, 1);
  L.g.userData.legs.forEach(l => l.rotation.x = 0); L.g.userData.ears.forEach(e => e.rotation.x = 0);
  FT = null; G.lift = null; clearUI(); F.wkFetch = true; G.mode = 'map'; cam.zoomGoal = 1;
  stat('happy', ok * 3 + great * 2 + 3);
  if (great >= 3) { sfx('badge'); confetti(L.g.position.x, 1, L.g.position.z, 60); say(["Three huge throws, three perfect fetches. Luca is BUZZING.", { n: CONFIG.boyfriend, t: "Olympic level, both of you." }], refreshHints); }
  else if (ok >= 2) say(["Great session. Luca chased down every one.", "Tongue out, tail spinning. Very good boy."], refreshHints);
  else say(["A few gentle lobs. Luca still had the time of his life.", "He flops down, thoroughly pleased."], refreshHints);
}

/* ---------------- home: movie, chess or a picnic ---------------- */
const MOVIE_TINT = ['#6fa8dc', '#b9a3ff', '#e2b97f'];
function updateHome(dt, t) {
  const k = W && W.wk; if (!k) return;
  const tv = W.objs.find(o => o.ch === 'V'), scr = tv && tv.g.userData.screen;
  if (scr && F.wkMovie) { const base = new THREE.Color(k.tint || '#6fa8dc'); scr.material.color.copy(base).multiplyScalar(0.75 + 0.25 * Math.sin(t * 3) + 0.15 * Math.sin(t * 11)); }
  if (k.topple && k.topple.t < 1) { k.topple.t = Math.min(1, k.topple.t + dt * 1.5); k.topple.k.rotation.z = easeOutBack(k.topple.t) * 1.45; }
  (k.picnic || []).forEach((g, i) => { if (g.userData.p < 1) { g.userData.p = Math.min(1, g.userData.p + dt * 2.5); g.scale.setScalar(Math.max(0.001, easeOutBack(g.userData.p))); } });
  if (k.popcorn) k.popcorn.children.forEach((c, i) => { if (i > 0) c.position.y = 0.14 + Math.abs(Math.sin(t * 3 + i)) * 0.03; });
}
function movieMenu() {
  pickMenu('Movie night', 'Paulo made popcorn. Your pick.', WK.movies, m => {
    F.wkMovie = true; stat('happy', 8); WKLOG.movie = m.n;
    W.wk.tint = MOVIE_TINT[WK.movies.indexOf(m) % 3];
    const sofa = W.objs.find(o => o.ch === 'f');
    if (sofa) { const pc = grp(world, sofa.x + 1.2, 0.5, sofa.z + 0.4); mk(G_CYL, '#ff7aa8', [0.3, 0.16, 0.3], [0, 0.08, 0], pc); mk(G_CYL, '#ffffff', [0.31, 0.04, 0.31], [0, 0.1, 0], pc, { noShadow: true }); for (let i = 0; i < 8; i++) mk(G_SPH, '#fff8e0', [0.08, 0.08, 0.08], [Math.cos(i) * 0.08, 0.14, Math.sin(i) * 0.08], pc, { noShadow: true }); W.wk.popcorn = pc; popIn(pc); }
    const tv = W.objs.find(o => o.ch === 'V'); if (tv) sparkle(tv.x + 0.5, 1.2, tv.z + 0.3, 24);
    say([{ n: CONFIG.name, t: "Tonight: " + m.n + "." }, "Lights off, popcorn ready, Luca curled up between you.", { n: CONFIG.boyfriend, t: "Best seat in the house is next to you." }], refreshHints);
  });
}
function chessGame() {
  pickMenu('Chess at home', 'White to move. Paulo swears checkmate in three.', [
    { n: 'Knight to f7', d: 'A bold fork' },
    { n: 'Queen takes h7', d: 'Sacrifice attack' },
    { n: 'Castle and wait', d: 'Play it safe' }
  ], m => {
    F.wkActivity = true; stat('happy', 6); WKLOG.activity = 'Chess: ' + m.n;
    const h = W.objs.find(o => o.ch === 'H'); if (h && h.g.userData.king) { W.wk.topple = { k: h.g.userData.king, t: 0 }; sparkle(h.x + 0.5, 1, h.z, 20); }
    sfx('good');
    say([{ n: CONFIG.name, t: m.n + "." }, { n: CONFIG.boyfriend, t: "...how did you even see that." }, { n: CONFIG.name, t: CONFIG.catchphrase }, "Checkmate. Reigning champion, still."], refreshHints);
  });
}
function picnicChoice() {
  pickMenu('Backyard picnic', 'Pack the rug and a little something.', WK.picnicTreats, m => {
    F.wkActivity = true; stat('happy', 7); stat('energy', 4); WKLOG.activity = 'Picnic: ' + m.n;
    const g = grp(world, 10, 0, 7.4), items = [g];
    makeRug(g, 0, 0, 1.8, 1.2, ['#ff9fb8', '#ffffff']);
    const bk = grp(g, -0.5, 0, -0.25); mk(G_BOX, '#c89f7a', [0.4, 0.26, 0.3], [0, 0.13, 0], bk); const hd = mk(geo('ring', () => new THREE.TorusGeometry(0.5, 0.12, 6, 16)), '#a8744f', [0.3, 0.3, 0.3], [0, 0.3, 0], bk);
    if (/Cheese/.test(m.n)) { mk(G_CYL, '#fff0c2', [0.5, 0.03, 0.5], [0.3, 0.05, 0.1], g); mk(G_CONE, '#ffd166', [0.2, 0.12, 0.2], [0.25, 0.12, 0.05], g); for (let i = 0; i < 5; i++) mk(G_BOX, '#e8c088', [0.1, 0.02, 0.1], [0.4 + Math.cos(i) * 0.1, 0.08, 0.15 + Math.sin(i) * 0.1], g, { noShadow: true }); }
    else if (/Straw/.test(m.n)) { mk(G_BOX, '#7fc8f8', [0.3, 0.12, 0.3], [0.3, 0.06, 0.1], g); for (let i = 0; i < 7; i++) { const s = mk(G_CONE, '#e2344f', [0.08, 0.1, 0.08], [0.22 + (i % 3) * 0.08, 0.15, 0.03 + Math.floor(i / 3) * 0.07], g, { noShadow: true }); s.rotation.x = Math.PI; } }
    else { [-1, 1].forEach(s => { mk(G_CYL, '#eef6ff', [0.12, 0.26, 0.12], [0.3 + s * 0.12, 0.13, 0.1], g, { alpha: 0.7 }); mk(G_CYL, '#c89f7a', [0.1, 0.18, 0.1], [0.3 + s * 0.12, 0.1, 0.1], g, { noShadow: true }); const st = mk(G_CYL, '#ff7aa8', [0.015, 0.3, 0.015], [0.3 + s * 0.12, 0.3, 0.1], g, { noShadow: true }); st.rotation.z = s * 0.2; }); }
    g.userData.p = 0; g.scale.setScalar(0.001); W.wk.picnic = items; sfx('pop'); confetti(10, 0.8, 7.4, 30);
    say([{ n: CONFIG.name, t: "Picnic packed: " + m.n + "." }, "You lay the rug out back. Luca supervises the snacks closely.", { n: CONFIG.boyfriend, t: "This. This is the good stuff." }], refreshHints);
  });
}

/* ---------------- a night out: a little street with two doors ---------------- */
function nightIsland() {
  clearWorld(); clearUI(); G.scene = 'wnight'; G.mode = 'busy'; showHUD(true);
  W = { id: 'wnight', objs: [], npcs: [], hearts: [], markers: [], anim: [], dispose: [], walls: [], decor: [] };
  setSky('night'); fitSun(4, 3, 8); G.clock = SCENE_TIME.wnight;
  makeIslandBase(world, 9, 7, '#8a93b8', 4, 3);
  mk(G_BOX, '#9aa3c7', [9, 0.2, 7], [4, -0.1, 3], world);
  for (let i = 0; i < 9; i++) mk(G_BOX, i % 2 ? '#b8bfd8' : '#a9b1cf', [1, 0.02, 2.2], [i, 0.01, 5.2], world, { noShadow: true });
  for (let i = 0; i < 7; i++) makeCloud(world, -20 + i * 7, -5 + hsh(i, 1) * 1.5, -8 + hsh(i, 2) * 20, 1.3);
  cam.base = 11; cam.pitch = 0.7; cam.orbit = 0; cam.zoomGoal = 1.35; cam.zoom = 1.35; cam.yawGoal = Math.round(cam.yawGoal / (Math.PI / 2)) * (Math.PI / 2); cam.goal.set(4, 0.8, 3); cam.target.copy(cam.goal);
  wkTicker((dt, t) => { updateWorld(dt, t); (W.flames || []).forEach((f, i) => f.scale.y = 0.09 * (0.8 + 0.25 * Math.sin(t * 13 + i))); (W.cast || []).forEach((g, i) => animatePerson(g, false, dt, t + i)); });
  W.flames = []; W.cast = [];
}
function storefront(x, z, wall, awn, sign, kind) {
  const g = grp(world, x, 0, z);
  mk(G_BOX, wall, [3.6, 2.2, 1.2], [0, 1.1, 0], g); mk(G_BOX, '#fffaf0', [3.8, 0.12, 1.3], [0, 2.26, 0], g);
  mk(G_BOX, '#ffe7a8', [2.2, 1.0, 0.03], [-0.4, 0.95, 0.61], g, { glow: true }); for (let i = 0; i < 3; i++) mk(G_BOX, '#fffaf0', [0.05, 1.0, 0.05], [-1.1 + i * 0.7, 0.95, 0.63], g, { noShadow: true });
  mk(G_BOX, '#5a3d2b', [0.7, 1.3, 0.05], [1.2, 0.65, 0.62], g); mk(G_SPH, '#ffd166', [0.06, 0.06, 0.06], [1.0, 0.65, 0.66], g, { glow: true });
  for (let i = 0; i < 8; i++) { const s = mk(G_BOX, i % 2 ? '#fffaf0' : awn, [0.45, 0.05, 0.7], [-1.575 + i * 0.45, 1.72, 0.9], g); s.rotation.x = 0.4; }
  mk(G_BOX, sign, [1.8, 0.35, 0.06], [0, 2.0, 0.65], g); mk(G_BOX, '#fffaf0', [1.4, 0.08, 0.02], [0, 2.0, 0.69], g, { noShadow: true, glow: true });
  if (kind === 'food') for (let i = 0; i < 3; i++) { mk(G_SPH, '#f3c27a', [0.2, 0.06, 0.2], [-1.1 + i * 0.6, 0.6, 0.6], g, { noShadow: true }); mk(G_SPH, '#e2554f', [0.16, 0.03, 0.16], [-1.1 + i * 0.6, 0.63, 0.61], g, { noShadow: true }); }
  else for (let i = 0; i < 9; i++) makeWineBottle(g, -1.3 + i * 0.22, 0.5 + (i % 3) * 0.05, 0.45, ['#6b1e3a', '#e8e0a0', '#ff9fb8'][i % 3]).scale.setScalar(0.7);
  for (let i = 0; i < 2; i++) { const pl = makePlant(g, i ? 1.75 : -1.75, 0.9); pl.scale.setScalar(0.8); }
  return g;
}
function weekendOut() {
  nightIsland(); setChapter('Weekend Pack: a night out'); chapterCard('A night out');
  storefront(1.9, 1.2, '#f7d9c4', '#e2554f', '#8a2f2f', 'food'); storefront(6.3, 1.2, '#cfe3d4', '#2f5d4a', '#2f5d4a', 'wine');
  makeFairyLights(world, 0, 3.1, 8, 3.1, 2.4, 26); for (let i = 0; i < 3; i++) { const l = grp(world, 0.5 + i * 3.5, 0, 5.8); mk(G_CYL, '#3a3148', [0.08, 2, 0.08], [0, 1, 0], l); mk(G_SPH, '#fff4b0', [0.3, 0.3, 0.3], [0, 2.05, 0], l, { glow: true }); }
  const a = makeAnnette('dress'), p = makePerson(LOOK.paulo); a.position.set(3.7, 0, 4.2); p.position.set(4.4, 0, 4.2); world.add(a, p); W.cast = [a, p];
  const pn = panel('Head out for the night', 'Dinner out, or a cosy wine bar?', 'grid2');
  const b1 = makeBtn('<span>Dinner out</span><small>Somewhere with good pasta</small>', () => dinnerOutMenu());
  const b2 = makeBtn('<span>Wine bar</span><small>A bottle and small plates</small>', () => wineBarMenu());
  pn.querySelector('.grid2').append(b1, b2); pn.classList.add('low');
  setMenu([b1, b2], { cols: 2, keepMode: true }); G.mode = 'menu';
}
function nightTable(kind, choice) {
  nightIsland(); setChapter(kind === 'food' ? 'Weekend Pack: dinner out' : 'Weekend Pack: the wine bar');
  const wall = kind === 'food' ? '#f7d9c4' : '#cfe3d4';
  mk(G_BOX, wall, [9, 2.4, 0.3], [4, 1.2, -0.35], world); mk(G_BOX, '#fffaf0', [9, 0.12, 0.4], [4, 2.45, -0.35], world);
  mk(G_BOX, kind === 'food' ? '#c89f7a' : '#6b4a32', [9, 0.2, 7], [4, 0.01, 3], world, { noShadow: true });
  for (let x = 0; x < 9; x++) for (let z = 0; z < 7; z++) if ((x + z) % 2) mk(G_BOX, kind === 'food' ? '#f3e2c7' : '#5a3d2b', [1, 0.02, 1], [x, 0.115, z], world, { noShadow: true });
  if (kind === 'food') { for (let i = 0; i < 5; i++) { mk(G_BOX, '#8a2f2f', [0.9, 0.7, 0.04], [0.5 + i * 1.8, 1.3, -0.18], world); mk(G_BOX, '#fff4e8', [0.7, 0.5, 0.02], [0.5 + i * 1.8, 1.3, -0.15], world, { noShadow: true }); } }
  else { const sh = grp(world, 4, 0, -0.1); for (let r = 0; r < 3; r++) { mk(G_BOX, '#3a2a20', [6, 0.05, 0.3], [0, 0.7 + r * 0.55, 0], sh); for (let i = 0; i < 16; i++) makeWineBottle(sh, -2.8 + i * 0.37, 0.72 + r * 0.55, 0, ['#6b1e3a', '#e8e0a0', '#ff9fb8', '#2f5d4a'][(i + r) % 4]).scale.setScalar(0.85); } }
  makeFairyLights(world, 0, 0.2, 8, 0.2, 2.2, 24);
  [0.6, 7.4].forEach(x => makePlant(world, x, 1, true));
  // our table
  const t = grp(world, 4, 0.12, 3);
  mk(G_CYL, kind === 'food' ? '#ffffff' : '#c89f7a', [1.5, 0.06, 1.1], [0, 0.62, 0], t); mk(G_CYL, '#6b4a32', [0.1, 0.6, 0.1], [0, 0.3, 0], t);
  if (kind === 'food') for (let i = 0; i < 6; i++) mk(G_BOX, '#e2554f', [0.2, 0.005, 1.0], [-0.6 + i * 0.24, 0.655, 0], t, { noShadow: true });
  const c = makeCandle(t, 0, 0.65, -0.3); W.flames.push(c.userData.flame);
  const dish = grp(t, 0, 0.66, 0.15), n = choice.n;
  if (kind === 'food') {
    mk(G_CYL, '#ffffff', [0.62, 0.03, 0.62], [0, 0.015, 0], dish);
    if (/pizza/i.test(n)) { mk(G_CYL, '#e8b86a', [0.56, 0.05, 0.56], [0, 0.05, 0], dish); mk(G_CYL, '#d9483b', [0.48, 0.02, 0.48], [0, 0.08, 0], dish, { noShadow: true }); for (let i = 0; i < 7; i++) mk(G_SPH, '#fffaf0', [0.08, 0.02, 0.08], [Math.cos(i * 0.9) * 0.14, 0.095, Math.sin(i * 0.9) * 0.14], dish, { noShadow: true }); for (let i = 0; i < 4; i++) mk(G_SPH, '#3fae7c', [0.05, 0.01, 0.03], [Math.cos(i * 1.6 + 0.4) * 0.08, 0.1, Math.sin(i * 1.6 + 0.4) * 0.08], dish, { noShadow: true }); }
    else if (/Pasta/i.test(n)) { mk(G_SPH, '#fffaf0', [0.5, 0.18, 0.5], [0, 0.05, 0], dish); for (let i = 0; i < 9; i++) { const tt = mk(geo('ring', () => new THREE.TorusGeometry(0.5, 0.12, 6, 16)), '#f3d27a', [0.14, 0.14, 0.14], [Math.cos(i) * 0.07, 0.12 + (i % 3) * 0.015, Math.sin(i) * 0.07], dish, { noShadow: true }); tt.rotation.x = Math.PI / 2 + i * 0.3; } mk(G_SPH, '#d9483b', [0.16, 0.05, 0.16], [0, 0.16, 0], dish, { noShadow: true }); mk(G_SPH, '#3fae7c', [0.05, 0.015, 0.03], [0.03, 0.19, 0], dish, { noShadow: true }); }
    else if (/Steak/i.test(n)) { mk(G_SPH, '#7a3e24', [0.3, 0.08, 0.22], [-0.08, 0.06, 0], dish); mk(G_SPH, '#9a5634', [0.26, 0.02, 0.18], [-0.08, 0.1, 0], dish, { noShadow: true }); for (let i = 0; i < 10; i++) { const f = mk(G_BOX, '#f3c24a', [0.03, 0.03, 0.18], [0.14 + (i % 3) * 0.04, 0.05 + Math.floor(i / 3) * 0.025, (i % 4) * 0.03 - 0.05], dish, { noShadow: true }); f.rotation.y = i * 0.5; } }
    else { for (let s = 0; s < 2; s++) { const st = grp(dish, -0.12 + s * 0.26, 0.02 + s * 0.12, 0); mk(G_CYL, '#d9b27a', [0.36, 0.14, 0.36], [0, 0.07, 0], st); if (!s) for (let i = 0; i < 4; i++) mk(G_SPH, '#fff8e8', [0.1, 0.07, 0.1], [Math.cos(i * 1.57) * 0.08, 0.16, Math.sin(i * 1.57) * 0.08], st, { noShadow: true }); else mk(G_CYL, '#c89f6a', [0.38, 0.03, 0.38], [0, 0.15, 0], st); } }
    makeGlass(t, -0.45, 0.65, 0.05, '#fff4e8'); makeGlass(t, 0.45, 0.65, 0.05, '#fff4e8');
  } else {
    const col = /Pinot/.test(n) ? '#6b1e3a' : /Rose/.test(n) ? '#ff9fb8' : '#e8e0a0';
    makeWineBottle(t, 0.1, 0.65, -0.1, /Pinot/.test(n) ? '#3a1522' : '#2f5d4a');
    makeGlass(t, -0.35, 0.65, 0.15, col); makeGlass(t, 0.4, 0.65, 0.15, col);
    const board = grp(t, -0.05, 0.66, 0.25); mk(G_BOX, '#c89f7a', [0.5, 0.03, 0.26], [0, 0.015, 0], board); mk(G_CONE, '#ffd166', [0.12, 0.08, 0.12], [-0.14, 0.07, 0], board); mk(G_SPH, '#c55a6c', [0.08, 0.05, 0.08], [0.02, 0.05, 0], board); for (let i = 0; i < 4; i++) mk(G_SPH, '#6b8a3a', [0.04, 0.04, 0.04], [0.13 + (i % 2) * 0.05, 0.05, -0.04 + Math.floor(i / 2) * 0.06], board, { noShadow: true });
    if (/Prosecco/.test(n)) W.bubbles = true;
  }
  const a = makeAnnette('dress'), p = makePerson(LOOK.paulo);
  a.position.set(3.1, 0.12, 3.2); a.rotation.y = Math.PI / 2; p.position.set(4.9, 0.12, 3.2); p.rotation.y = -Math.PI / 2; world.add(a, p); W.cast = [a, p];
  [3.05, 4.95].forEach(x => { const ch = grp(world, x, 0.12, 3.2); mk(G_BOX, '#6b4a32', [0.45, 0.06, 0.45], [0, 0.34, 0], ch); mk(G_BOX, '#6b4a32', [0.06, 0.5, 0.45], [x < 4 ? -0.2 : 0.2, 0.6, 0], ch); });
  for (let i = 0; i < 3; i++) { const o = grp(world, 1 + i * 3, 0.12, 5.6); mk(G_CYL, '#fff4e8', [0.8, 0.05, 0.8], [0, 0.62, 0], o); mk(G_CYL, '#6b4a32', [0.08, 0.6, 0.08], [0, 0.3, 0], o); const cc = makeCandle(o, 0, 0.64, 0); W.flames.push(cc.userData.flame); }
  cam.goal.set(4, 0.8, 3.1); cam.target.copy(cam.goal); cam.zoomGoal = 2.1; cam.zoom = 1.6;
  if (W.bubbles) wkTicker(() => { if (Math.random() < 0.2) FX.emit(3.65 + (Math.random() < 0.5 ? 0 : 0.75), 0.95, 3.15, ['#fff4c9', '#ffffff'], 1, 0.3, { g: -1.2, life: 0.8 }); });
  sparkle(4, 1.2, 3.1, 30);
}
function dinnerOutMenu() {
  const p = panel('Dinner out', 'Order anything. Weekend rules.', 'grid2'); p.classList.add('low');
  const btns = WK.dinners.map(d => makeBtn('<span>' + esc(d.n) + '</span><small>' + esc(d.d) + '</small>', () => {
    clearUI(); G.mode = 'busy'; moment(d.n, { title: 'Dinner out: ' + d.n, line: 'Candles lit, glasses up', ms: 2100 }, () => {
    WKLOG.night = 'Dinner out: ' + d.n; nightTable('food', d); G.mode = 'busy'; stat('energy', 20, true); stat('happy', 10, true); sfx('good');
    setTimeout(() => say([{ n: CONFIG.boyfriend, t: "Good call. The " + d.n.toLowerCase() + " here is unreal." }, d.n + ". Absolutely delicious.", { n: CONFIG.name, t: CONFIG.catchphrase }], weekendFinale), 700);
    });
  }));
  p.querySelector('.grid2').append(...btns);
  setMenu(btns, { cols: 2, keepMode: true, onBack: weekendOut }); G.mode = 'menu';
}
function wineBarMenu() {
  const p = panel('Wine bar', 'A bottle to share and a few small plates.', 'grid2'); p.classList.add('low');
  const btns = WK.wines.map(d => makeBtn('<span>' + esc(d.n) + '</span><small>' + esc(d.d) + '</small>', () => {
    clearUI(); G.mode = 'busy'; moment(d.n, { title: 'A bottle of ' + d.n, line: 'Small plates, candlelight, no rush', ms: 2100 }, () => {
    WKLOG.night = 'Wine bar: ' + d.n; nightTable('wine', d); G.mode = 'busy'; stat('happy', 14, true); sfx('good');
    setTimeout(() => say([{ n: CONFIG.boyfriend, t: "A bottle of " + d.n.toLowerCase() + ", please." }, "Candlelight, small plates, no rush at all.", { n: CONFIG.name, t: CONFIG.catchphrase }], weekendFinale), 700);
    });
  }));
  p.querySelector('.grid2').append(...btns);
  setMenu(btns, { cols: 2, keepMode: true, onBack: weekendOut }); G.mode = 'menu';
}
function weekendFinale() {
  G.mode = 'busy'; setChapter('Weekend Pack');
  say([{ n: CONFIG.boyfriend, t: "No big plans. Just you, me and Luca." }, { n: CONFIG.boyfriend, t: "My favourite kind of weekend." }, { n: CONFIG.name, t: "Say less." }], () => fade(weekendEnd));
}

/* ---------------- the end card: home porch under the stars ---------------- */
function weekendEnd() {
  clearWorld(); clearUI(); G.scene = 'wend'; G.mode = 'busy'; clearCheckpoint(); showHUD(false); setChapter('The best kind of ordinary');
  W = { id: 'wend', objs: [], npcs: [], hearts: [], markers: [], anim: [], dispose: [], walls: [], decor: [] };
  setSky('night'); fitSun(0, 0, 8); G.clock = SCENE_TIME.wend;
  makeIslandBase(world, 8, 6, GRASS, 0, 0); mk(G_BOX, GRASS, [8, 0.2, 6], [0, -0.1, 0], world);
  // the house with a glowing window, a porch and a bench
  mk(G_BOX, '#fff1e0', [5, 2.2, 1.6], [0, 1.1, -1.9], world);
  const gable = geo('gable', () => { const t = new THREE.CylinderGeometry(0.5, 0.5, 1, 3); t.rotateZ(Math.PI / 2); t.rotateX(-Math.PI / 2); return t; });
  mk(gable, '#fff1e0', [5, 0.93, 1.85], [0, 2.43, -1.9], world);
  [-1, 1].forEach(s => { const r = mk(G_BOX, '#e2554f', [5.5, 0.12, 1.3], [0, 2.6, -1.9 + s * 0.45], world); r.rotation.x = s * 0.72; });
  mk(G_BOX, '#c94a45', [5.6, 0.12, 0.16], [0, 2.95, -1.9], world);
  mk(G_BOX, '#d9c7b0', [0.4, 0.7, 0.4], [1.6, 3.0, -2.2], world);
  [-1.5, 1.5].forEach(x => { mk(G_BOX, '#ffe7a8', [0.9, 0.8, 0.03], [x, 1.3, -1.09], world, { glow: true }); mk(G_BOX, '#ffffff', [0.05, 0.8, 0.05], [x, 1.3, -1.07], world, { noShadow: true }); });
  mk(G_BOX, '#5a3d2b', [0.8, 1.5, 0.05], [0, 0.75, -1.08], world); mk(G_SPH, '#ffd166', [0.06, 0.06, 0.06], [0.25, 0.75, -1.04], world, { glow: true });
  mk(G_BOX, '#c89f7a', [5.4, 0.15, 1.2], [0, 0.08, -0.55], world);
  const bench = grp(world, 0, 0.15, -0.35); mk(G_BOX, '#b07a4a', [2.2, 0.08, 0.5], [0, 0.42, 0], bench); mk(G_BOX, '#b07a4a', [2.2, 0.5, 0.08], [0, 0.72, -0.22], bench); [-1, 1].forEach(s => mk(G_BOX, '#8a5a3b', [0.08, 0.42, 0.45], [s * 1, 0.21, 0], bench));
  makeFairyLights(world, -2.6, -1.05, 2.6, -1.05, 2.1, 22);
  makeTree(world, -3.2, 1.5, 1, '#7cc576'); makeTree(world, 3.2, 1.2, 0.9, '#ffb3cc'); makePlant(world, -2.1, 0.3); makePlant(world, 2.1, 0.3);
  for (let i = 0; i < 9; i++) makeFlower(world, -3.6 + i * 0.9, 2.6, CONFETTI[i % 5]);
  const moon = mk(G_SPH, '#fff8d6', [1.2, 1.2, 1.2], [4.5, 6, -8], world, { glow: true }); mk(G_SPH, '#fff8d6', [2.2, 2.2, 0.2], [4.5, 6, -8.6], world, { glow: true, alpha: 0.25 });
  const a = makeAnnette('sunny'), p = makePerson(LOOK.paulo), l = makeLuca();
  a.position.set(-0.4, 0.35, -0.3); p.position.set(0.4, 0.35, -0.3); l.position.set(0, 0.15, 0.7); l.scale.setScalar(1.1); world.add(a, p, l);
  W.cast = [a, p]; W.dog = l;
  for (let i = 0; i < 6; i++) makeCloud(world, -20 + i * 7, -5 + hsh(i, 1) * 1.5, -8 + hsh(i, 2) * 16, 1.3);
  cam.base = 11; cam.pitch = 0.55; cam.zoomGoal = 1.4; cam.zoom = 1.4; cam.goal.set(0, 1.1, -0.2); cam.target.copy(cam.goal); cam.orbit = SET.calm ? 0.02 : 0.05;
  wkTicker((dt, t) => { updateWorld(dt, t); W.cast.forEach((g, i) => { animatePerson(g, false, dt, t + i); g.rotation.y = (i ? -1 : 1) * 0.25; }); animatePerson(l, false, dt, t); if (!SET.calm && Math.random() < dt * 0.8) FX.emit((Math.random() - 0.5) * 12, 6 + Math.random() * 2, -6, ['#fff4c9', '#ffffff'], 1, 4, { g: 2, life: 1.2 }); });
  sfx('badge'); confetti(0, 2, 0, 60);
  const L = WKLOG, fetchGreat = (L.fetch || []).filter(r => r === 'great').length;
  const rows = [
    ['Morning dip', WK.baths],
    [WK.grocer + ' run', (L.list || WK.shopList.length) + ' of ' + WK.shopList.length + ' on the list' + (L.impulse && L.impulse.length ? ', plus a ' + L.impulse[L.impulse.length - 1].toLowerCase() : '')],
    ['Fetch', (L.fetch && L.fetch.length ? fetchGreat + ' of ' + L.fetch.length + ' huge throws' : 'Luca had a ball')],
    ['Movie', L.movie || 'Something great'],
    ['Afternoon', L.activity || 'Lazy and perfect'],
    ['Night out', L.night || 'Out on the town']
  ];
  memoriesCard('weekend', { title: 'What a weekend, ' + CONFIG.name + '!', sub: 'The best kind of ordinary', head: 'Weekend highlights', rows }, [makeBtn('Play again', () => fade(() => { G.campaign = 'weekend'; resetWeekend(); loadMap('baths'); }), 'big alt'), makeBtn('Back to title', () => fade(titleScreen), 'big')]);
}

/* ---------------- QA jumps: ?qa=<name> ---------------- */
function wkQA(map, fn) { G.campaign = 'weekend'; resetWeekend(); if (map === 'aldi' || map === 'park' || map === 'home') { F.wkBaths = true; } if (map === 'park' || map === 'home') F.wkGroceries = true; if (map === 'home') F.wkFetch = true; loadMap(map); if (fn) setTimeout(() => { if (DLG) { DLG.q = []; nextLine(); } fn(); }, 950); }
Object.assign(QA_EXTRA, {
  wkbaths: () => wkQA('baths'),
  wkshop: () => wkQA('aldi'),
  grocery: () => wkQA('aldi', groceryGame),
  wkpark: () => wkQA('park'),
  fetch: () => wkQA('park', () => { fetchGame(); FT.power = 0.8; }),
  wkhome: () => wkQA('home'),
  wknight: () => { resetWeekend(); weekendOut(); },
  wkend: () => { resetWeekend(); Object.assign(WKLOG, { list: 4, impulse: ['Kayak'], fetch: ['great', 'good', 'great'], movie: WK.movies[2].n, activity: 'Chess: Knight to f7', night: 'Dinner out: Margherita pizza' }); weekendEnd(); }
});
