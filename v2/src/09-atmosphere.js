/* =========================================================
   CHARM: the whimsy pass. Sky friends (a sleepy sun, a dozing moon, a rainbow, a hot-air
   balloon), butterflies, drifting petals and fireflies, plus the cinematic "sting" card
   used for dramatic beats and the side-quest registry.
   ========================================================= */

const G_DOT = geo('dot', () => new THREE.SphereGeometry(0.5, 10, 6)); // light sphere for small or far-away blobs

/* ---------------- sky friends: parented to the camera so they sit behind every island ---------------- */
scene.add(camera);
const SKYRIG = new THREE.Group(); SKYRIG.position.z = -220; camera.add(SKYRIG);
const SKY = (() => {
  const glow = (g, c, s, p, parent, a) => mk(g, c, s, p, parent, { glow: true, alpha: a });
  const halfRing = geo('halfring', () => new THREE.TorusGeometry(0.5, 0.035, 5, 14, Math.PI));
  // sleepy sun: soft halo, wobbly rays, closed happy eyes and blush
  const sunG = grp(SKYRIG), rays = grp(sunG);
  glow(G_SPH, '#fff6c9', [0.62, 0.62, 0.02], [0, 0, -0.02], sunG, 0.35);
  glow(G_SPH, '#ffe08a', [0.36, 0.36, 0.03], [0, 0, 0], sunG);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r = glow(G_DOT, i % 2 ? '#ffd166' : '#ffe9a8', [0.05, i % 2 ? 0.13 : 0.09, 0.02], [Math.cos(a) * 0.27, Math.sin(a) * 0.27, -0.01], rays); r.rotation.z = a - Math.PI / 2; }
  [-1, 1].forEach(s => { const e = glow(halfRing, '#c98a4a', [0.09, 0.07, 0.3], [s * 0.07, 0.015, 0.03], sunG); glow(G_DOT, '#ffb3a0', [0.07, 0.04, 0.01], [s * 0.12, -0.04, 0.03], sunG, 0.8); });
  glow(halfRing, '#c98a4a', [0.1, 0.08, 0.3], [0, -0.035, 0.03], sunG).rotation.z = Math.PI;
  // dozing moon with a nightcap
  const moonG = grp(SKYRIG);
  glow(G_SPH, '#fff8d6', [0.6, 0.6, 0.02], [0, 0, -0.02], moonG, 0.22);
  glow(G_SPH, '#fff8d6', [0.34, 0.34, 0.03], [0, 0, 0], moonG);
  [[-0.07, 0.07, 0.07], [0.09, -0.06, 0.05], [-0.02, -0.1, 0.04]].forEach(([x, y, r]) => glow(G_DOT, '#f1e6b4', [r, r, 0.01], [x, y, 0.02], moonG));
  [-1, 1].forEach(s => { glow(halfRing, '#b59a6a', [0.07, 0.05, 0.3], [s * 0.06, 0.0, 0.035], moonG).rotation.z = Math.PI; glow(G_DOT, '#ffc2d6', [0.06, 0.035, 0.01], [s * 0.1, -0.045, 0.035], moonG, 0.8); });
  glow(G_DOT, '#b59a6a', [0.03, 0.035, 0.01], [0, -0.06, 0.035], moonG);
  const cap = glow(G_CONE, '#b9a3ff', [0.26, 0.3, 0.02], [0.09, 0.2, 0.03], moonG); cap.rotation.z = -0.5;
  glow(G_DOT, '#ffffff', [0.07, 0.07, 0.02], [0.2, 0.3, 0.04], moonG);
  // rainbow with a puff of cloud at each foot
  const bowG = grp(SKYRIG), arc = geo('bowarc', () => new THREE.TorusGeometry(1, 0.03, 6, 48, Math.PI));
  ['#ff9fb8', '#ffc98a', '#fff1a8', '#b5ead7', '#a9d8ff', '#cdb8ff'].forEach((c, i) => glow(arc, c, [1 - i * 0.055, 1 - i * 0.055, 0.5], [0, 0, 0], bowG, 0.6));
  [-1, 1].forEach(s => [[0, 0, 0.24], [0.14, 0.03, 0.18], [-0.14, 0.02, 0.17], [0.03, 0.1, 0.16]].forEach(([x, y, r]) => glow(G_DOT, '#ffffff', [r, r * 0.8, 0.02], [s * 0.86 + x, y - 0.02, 0.02], bowG, 0.95)));
  // hot-air balloon drifting across the far sky
  const hotG = grp(SKYRIG), hot = grp(hotG);
  for (let i = 0; i < 6; i++) glow(G_DOT, ['#ff9fb8', '#fff1a8', '#a9d8ff'][i % 3], [0.075, 0.3 - Math.abs(i - 2.5) * 0.028, 0.02], [(i - 2.5) * 0.045, 0.1, 0.001 * i], hot);
  glow(G_SPH, '#ffffff', [0.3, 0.3, 0.015], [0, 0.1, -0.01], hot, 0.9);
  glow(G_BOX, '#c89f7a', [0.08, 0.06, 0.02], [0, -0.14, 0], hot); [-1, 1].forEach(s => glow(G_BOX, '#ffffff', [0.006, 0.12, 0.01], [s * 0.035, -0.08, 0], hot));
  [sunG, moonG, bowG, hotG].forEach(g => { mergeStatic(g, null, false); g.visible = false; });
  return { sunG, rays, moonG, bowG, hotG, hot, t: 0.3 };
})();
function skyFriends(name) {
  const dayish = name === 'morning' || name === 'day' || name === 'golden', calmSky = W && (W.id === 'wend' || W.id === 'finale');
  SKY.sunG.visible = dayish; SKY.moonG.visible = !dayish && !calmSky;
  SKY.bowG.visible = name === 'morning' || name === 'day'; SKY.hotG.visible = dayish;
}

/* ---------------- butterflies ---------------- */
function makeButterfly(col) {
  const g = new THREE.Group();
  mk(G_DOT, '#5a3d2b', [0.035, 0.035, 0.14], [0, 0, 0], g, { noShadow: true });
  const wings = [-1, 1].map(s => { const w = grp(g); mk(G_DOT, col, [0.16, 0.012, 0.14], [s * 0.08, 0, 0.03], w, { noShadow: true }); mk(G_DOT, '#ffffff', [0.1, 0.012, 0.09], [s * 0.065, 0.002, -0.05], w, { noShadow: true }); return w; });
  g.userData = { wings, ph: Math.random() * TAU, sp: 0.18 + Math.random() * 0.14 };
  return g;
}

/* ---------------- per-map charm: called at the end of buildMap and the little set pieces ---------------- */
const GRASSY = new Set(['#a6dc8f', '#9bd483']);
function charmIsland(w, h, cx, cz, n) {
  if (!W) return;
  W.flies = [];
  for (let i = 0; i < (n == null ? 4 : n); i++) { const b = makeButterfly(CONFETTI[i % 5]); b.userData.box = [cx, cz, w / 2 + 0.7, h / 2 + 0.7]; world.add(b); W.flies.push(b); }
}
MAP_HOOKS.push((def, id) => { if (GRASSY.has(def.edge) && G.campaign !== 'holiday') charmIsland(W.w, W.h, (W.w - 1) / 2, (W.h - 1) / 2, W.outdoor ? 6 : 4); });

const MOTES = {
  morning: [['#ffc2d6', '#ffe3ec', '#ffffff'], 0.25, 4],
  day: [['#ffffff', '#fff4c9', '#ffe3ec'], 0.12, 4],
  golden: [['#ffe08a', '#fff4c9', '#ffd1a8'], -0.12, 3.5],
  evening: [['#fff4b0', '#e4ffb0'], 0, 2.6], dusk: [['#fff4b0', '#e4ffb0'], 0, 2.6], night: [['#fff4b0', '#d8f0ff'], 0, 2.6]
};
let moteT = 0;
function updateCharm(dt, t) {
  // sky friends follow the frame, whatever the zoom or the screen shape
  const top = camera.top, a = camera.right / top, S = SKY;
  SKYRIG.scale.set(top, top, 1);
  S.sunG.position.set(a * 0.74, 0.66, 0); S.sunG.scale.setScalar(SET.calm ? 1 : 1 + Math.sin(t * 1.3) * 0.03); S.rays.rotation.z = SET.calm ? 0 : t * 0.15;
  S.moonG.position.set(a * 0.72, 0.64, 0); S.moonG.rotation.z = SET.calm ? 0 : Math.sin(t * 0.6) * 0.06;
  S.bowG.position.set(-a * 0.42, -0.2, -1); S.bowG.scale.setScalar(Math.min(1.05, a * 0.62));
  S.t += dt * (SET.calm ? 0.004 : 0.012); if (S.t > 1) S.t -= 1;
  S.hotG.position.set(lerp(-a - 0.4, a + 0.4, S.t), 0.28 + Math.sin(t * 0.5) * 0.04, -0.5); S.hot.rotation.z = Math.sin(t * 0.8) * 0.06;
  // butterflies loop lazily around the island edge
  if (W && W.flies) W.flies.forEach((b, i) => {
    const u = b.userData, [cx, cz, rx, rz] = u.box, k = t * u.sp + u.ph, px = b.position.x, pz = b.position.z;
    b.position.set(cx + Math.cos(k) * rx + Math.sin(k * 3.1 + i) * 0.5, 0.55 + Math.sin(k * 2.3 + i) * 0.3 + Math.abs(Math.sin(t * 5 + i)) * 0.08, cz + Math.sin(k) * rz + Math.cos(k * 2.7 + i) * 0.5);
    b.rotation.y = Math.atan2(b.position.x - px, b.position.z - pz);
    const f = SET.calm ? 0.5 : Math.sin(t * 16 + i * 2) * 0.9; u.wings[0].rotation.z = f; u.wings[1].rotation.z = -f;
  });
  // drifting motes: petals by day, gold dust at golden hour, fireflies at night
  if (SET.calm || !W || G.campaign === 'holiday' || !(G.scene === 'map' || G.scene === 'title' || G.scene === 'lunch')) return;
  moteT -= dt; if (moteT > 0) return; moteT = 0.3;
  const m = MOTES[skyNow] || MOTES.day, c = cam.target;
  FX.emit(c.x + (Math.random() - 0.5) * 16, 0.6 + Math.random() * 2.6, c.z + (Math.random() - 0.5) * 11, m[0], 1, 0.35, { g: m[1], life: m[2] });
}

/* ---------------- a heart-shaped firework ---------------- */
function heartBurst(x, y, z, col, k) {
  const n = SET.calm ? 36 : 84, c = new THREE.Color(); k = k || 0.17;
  for (let i = 0; i < n && FX.P.length < 880; i++) {
    const a = i / n * TAU, hx = 16 * Math.pow(Math.sin(a), 3), hy = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a);
    FX.P.push({ x, y, z, vx: hx * k, vy: hy * k + 0.8, vz: 0, life: 1.9 + Math.random() * 0.3, g: 0.6, c: c.set(i % 4 ? col : '#ffffff').toArray() });
  }
}

/* ---------------- the sting: letterbox bars, speed lines and a big tilted title for dramatic beats ---------------- */
SFX.sting = () => { tone(110, 0.55, 'sawtooth', 0.045, 0, 55); [392, 466, 587].forEach((f, i) => tone(f, 0.45, 'triangle', 0.05, 0.06 + i * 0.07)); };
SFX.fanfare = () => [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, 0.22, 'triangle', 0.055, i * 0.09));
SFX.sniff = () => [0, 0.12, 0.24].forEach(d => tone(900, 0.06, 'sine', 0.025, d, 500));
SFX.meow = () => { tone(700, 0.18, 'triangle', 0.05, 0, 1000); tone(1000, 0.25, 'triangle', 0.05, 0.16, 600); };
SFX.caw = () => [0, 0.16].forEach(d => { tone(1300, 0.1, 'sawtooth', 0.03, d, 800); tone(900, 0.12, 'square', 0.02, d + 0.05, 1400); });
function sting(title, sub, cb, o) {
  o = o || {}; endMoment();
  const wrap = el('div', 'sting' + (SET.calm ? ' still' : '') + (o.kind ? ' s-' + o.kind : ''), `<i class="burst"></i><i class="lb t"></i><i class="lb b"></i><div class="card"><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div>`);
  document.body.append(wrap);
  const prev = G.mode; if (!o.free) G.mode = 'busy';
  const done = () => { if (MOMENT !== m) return; endMoment(); if (!o.free && G.mode === 'busy') G.mode = prev === 'dialog' || prev === 'menu' ? 'map' : prev; cb && cb(); };
  const m = MOMENT = { wrap, done, skip: done, timer: setTimeout(done, SET.calm ? 1100 : (o.ms || 1900)) };
  wrap.addEventListener('pointerdown', e => { e.preventDefault(); done(); });
  sfx(o.sfx || 'sting'); buzz([30, 40, 60]); if (!SET.calm) cam.shake = o.shake == null ? 0.22 : o.shake;
}

/* ---------------- side quests: progress lives in the F flags (q_<id>: 1 started, 2 done) so saves just work ---------------- */
const QUESTS = {};
const questState = id => F['q_' + id] || 0;
const questsDone = () => Object.keys(QUESTS).filter(id => questState(id) === 2).length;
function questStart(id) { if (questState(id)) return false; F['q_' + id] = 1; sfx('secret'); toast('Side quest: ' + QUESTS[id].n, true); refreshHints(); return true; }
function questDone(id, cb) {
  if (questState(id) === 2) { cb && cb(); return; }
  F['q_' + id] = 2; stat('happy', 6, true);
  if (W && W.player) confetti(W.player.g.position.x, 1.3, W.player.g.position.z, 50);
  sting('Quest complete!', QUESTS[id].n, () => {
    toast('Side quests: ' + questsDone() + ' of ' + Object.keys(QUESTS).length, true);
    Object.keys(BADGES).forEach(b => { const need = BADGES[b].quests; if (need && need.every(q => questState(q) === 2)) earn(b); });
    if (G.mode === 'busy' && G.scene === 'map') G.mode = 'map'; // quests always hand control back
    refreshHints(); cb && cb();
  }, { kind: 'win', sfx: 'fanfare', shake: 0 });
}
