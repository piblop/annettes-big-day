/* =========================================================
   ART: low-poly toy builders. Everything faces +z.
   Palette stays soft and candy-bright; outlines come from the toon ramp.
   ========================================================= */
const INK = '#4a3b52';
const heartShape = (() => { const s = new THREE.Shape(); s.moveTo(0, -0.5); s.bezierCurveTo(-0.1, -0.35, -0.55, -0.1, -0.5, 0.18); s.bezierCurveTo(-0.45, 0.45, -0.1, 0.5, 0, 0.25); s.bezierCurveTo(0.1, 0.5, 0.45, 0.45, 0.5, 0.18); s.bezierCurveTo(0.55, -0.1, 0.1, -0.35, 0, -0.5); return s; })();
const G_HEART = geo('heart', () => { const g = new THREE.ExtrudeGeometry(heartShape, { depth: 0.18, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 3, curveSegments: 12 }); g.center(); return g; });
const starShape = (() => { const s = new THREE.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.22 : 0.5, a = i / 10 * TAU + Math.PI / 2; const x = Math.cos(a) * r, y = Math.sin(a) * r; i ? s.lineTo(x, y) : s.moveTo(x, y); } return s; })();
const G_STAR = geo('star', () => { const g = new THREE.ExtrudeGeometry(starShape, { depth: 0.12, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2 }); g.center(); return g; });
const G_TORSO = geo('torso', () => new THREE.CylinderGeometry(0.13, 0.17, 0.3, 16));
const G_SKIRT = geo('skirt', () => new THREE.CylinderGeometry(0.12, 0.25, 0.36, 18));

/* ---------------- people: chibi proportions, big head, tiny body ---------------- */
function makePerson(o) {
  const g = new THREE.Group(), body = grp(g);
  const skin = o.skin || '#f9d1b0', hair = o.hair || '#6b4a32', top = o.top || '#7f93b3', bot = o.bottom || top, shoe = o.shoe || '#fdfdfd';
  const legL = grp(body, -0.075, 0.24, 0), legR = grp(body, 0.075, 0.24, 0);
  [legL, legR].forEach(L => { mk(G_CYL, o.style === 'dress' ? skin : bot, [0.1, 0.22, 0.1], [0, -0.11, 0], L); mk(G_SPH, shoe, [0.13, 0.08, 0.17], [0, -0.21, 0.025], L); });
  if (o.style === 'dress') mk(G_SKIRT, top, [1, 1, 1], [0, 0.36, 0], body);
  else if (o.style === 'crop') { mk(G_CYL, skin, [0.27, 0.08, 0.26], [0, 0.32, 0], body); mk(G_TORSO, top, [1, 0.62, 1], [0, 0.42, 0], body); mk(G_CYL, bot, [0.32, 0.1, 0.3], [0, 0.25, 0], body); }
  else { mk(G_TORSO, top, [1, 1, 1], [0, 0.38, 0], body); mk(G_CYL, bot, [0.33, 0.07, 0.3], [0, 0.245, 0], body); }
  const armL = grp(body, -0.2, 0.49, 0), armR = grp(body, 0.2, 0.49, 0);
  [armL, armR].forEach(A => { mk(G_SPH, o.style === 'dress' || o.style === 'crop' ? skin : top, [0.09, 0.2, 0.09], [0, -0.08, 0], A); mk(G_SPH, skin, [0.08, 0.08, 0.08], [0, -0.18, 0.01], A); });
  const head = grp(body, 0, 0.78, 0);
  mk(G_SPH, skin, [0.5, 0.47, 0.47], [0, 0, 0], head);
  [-1, 1].forEach(s => {
    mk(G_SPH, o.eye || INK, [0.055, 0.08, 0.03], [s * 0.085, -0.005, 0.222], head, { noShadow: true });
    mk(G_SPH, '#ffffff', [0.022, 0.022, 0.012], [s * 0.085 + 0.013, 0.02, 0.236], head, { noShadow: true });
    mk(G_SPH, '#ff9fb2', [0.075, 0.035, 0.02], [s * 0.145, -0.065, 0.2], head, { noShadow: true });
  });
  mk(G_SPH, '#c2566e', [0.045, 0.018, 0.012], [0, -0.085, 0.228], head, { noShadow: true });
  // little details the low camera now shows: nose, brows, ears, lashes, hair shine
  mk(G_SPH, skin, [0.035, 0.028, 0.03], [0, -0.04, 0.232], head, { noShadow: true });
  [-1, 1].forEach(s => {
    const br = mk(G_BOX, o.brow || hair, [0.06, 0.012, 0.012], [s * 0.088, 0.075, 0.222], head, { noShadow: true }); br.rotation.z = s * -0.18;
    mk(G_SPH, skin, [0.06, 0.09, 0.05], [s * 0.235, -0.02, 0.01], head, { noShadow: true });
    if (o.lashes) { const l = mk(G_BOX, INK, [0.03, 0.01, 0.01], [s * 0.125, 0.035, 0.224], head, { noShadow: true }); l.rotation.z = s * -0.6; }
  });
  mk(G_SPH, '#ffffff', [0.16, 0.05, 0.08], [-0.1, 0.24, 0.12], head, { noShadow: true, glow: true, alpha: 0.35 });
  // hair: cap + fringe + style extras
  mk(G_SPH, hair, [0.53, 0.52, 0.53], [0, 0.06, -0.05], head);
  mk(G_SPH, hair, [0.44, 0.15, 0.22], [0, 0.14, 0.12], head);
  if (o.hairStyle === 'long') { mk(G_SPH, hair, [0.5, 0.62, 0.32], [0, -0.13, -0.11], head); [-1, 1].forEach(s => mk(G_SPH, hair, [0.13, 0.36, 0.15], [s * 0.2, -0.13, 0.03], head)); }
  if (o.hairStyle === 'bun') mk(G_SPH, hair, [0.2, 0.2, 0.2], [0, 0.29, -0.06], head);
  if (o.hairStyle === 'bob') [-1, 1].forEach(s => mk(G_SPH, hair, [0.16, 0.3, 0.3], [s * 0.19, -0.07, -0.01], head));
  if (o.hairStyle === 'fluffy') [[-0.1, 0.25, 0.02], [0.08, 0.27, -0.04], [0.16, 0.2, 0.06], [-0.18, 0.18, -0.02]].forEach(p => mk(G_SPH, hair, [0.16, 0.14, 0.16], p, head));
  if (o.bow) { const b = grp(head, 0.17, 0.22, 0.02); b.rotation.z = -0.4; [-1, 1].forEach(s => { const c = mk(G_CONE, o.bow, [0.09, 0.12, 0.06], [s * 0.06, 0, 0], b); c.rotation.z = s * Math.PI / 2; }); mk(G_SPH, o.bow, [0.05, 0.05, 0.05], [0, 0, 0], b); }
  if (o.glasses) [-1, 1].forEach(s => { const r = mk(geo('ring', () => new THREE.TorusGeometry(0.5, 0.12, 6, 16)), INK, [0.09, 0.09, 0.09], [s * 0.085, 0, 0.235], head, { noShadow: true }); });
  if (o.apron) mk(G_BOX, o.apron, [0.24, 0.26, 0.02], [0, 0.34, 0.16], body);
  g.userData = { kind: 'person', body, head, legL, legR, armL, armR, walk: 0, bounce: 0 };
  return g;
}
const LOOK = {
  annette: o => ({ skin: '#f9d1b0', hair: '#f5d271', brow: '#d9a94a', lashes: true, hairStyle: 'long', eye: '#3d7be0', bow: '#ff7aa8', top: o.top, bottom: o.bottom, style: o.style, shoe: '#ffffff' }),
  paulo: { skin: '#b57848', hair: '#2a1d12', hairStyle: 'fluffy', eye: '#3a2414', top: '#1f1a24', bottom: '#3f6fb0', shoe: '#f4f6fb' },
  mum: { skin: '#f5cfae', hair: '#4a3226', hairStyle: 'bob', eye: '#6b4a32', top: '#7fa383', bottom: '#5b5566' }
};
function makeAnnette(outfitKey) { return makePerson(LOOK.annette(OUTFITS[outfitKey] || OUTFITS.office)); }

/* ---------------- Luca the cavoodle: apricot curls all over, long curly ears, teddy face, plume tail ---------------- */
const G_CURL = geo('curl', () => new THREE.SphereGeometry(0.5, 10, 8));
// evenly spread points over a unit sphere (fibonacci), used to cover a shape in curls
function fibPts(n) { const o = [], ga = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < n; i++) { const y = 1 - (i + 0.5) / n * 2, r = Math.sqrt(1 - y * y), a = i * ga; o.push([Math.cos(a) * r, y, Math.sin(a) * r]); } return o; }
function curls(parent, c, r, n, cols, size, skip) {
  fibPts(n).forEach((p, i) => {
    if (skip && skip(p)) return;
    const s = size * (0.85 + hsh(i, n, 7) * 0.35), col = cols[Math.floor(hsh(i, n, 3) * cols.length)];
    mk(G_CURL, col, [s, s * 0.92, s], [c[0] + p[0] * r[0], c[1] + p[1] * r[1], c[2] + p[2] * r[2]], parent, { noShadow: true });
  });
}
// Luca the cavoodle: golden caramel shag, a cream bib and beard, a fringe over the eyes and long feathered ears
const UP = new THREE.Vector3(0, 1, 0), WISP_D = new THREE.Vector3();
// long soft strands that point outward and droop with gravity, so the coat reads shaggy rather than curly
function wisps(parent, c, r, n, cols, size, droop, skip, seed) {
  fibPts(n).forEach((p, i) => {
    if (skip && skip(p)) return;
    const h = hsh(i, n, seed || 5), s = size * (0.8 + h * 0.45), col = cols[Math.floor(hsh(i, n, 3) * cols.length)];
    WISP_D.set(p[0] + (hsh(i, n, 9) - 0.5) * 0.5, p[1] - droop, p[2] + (hsh(i, n, 11) - 0.5) * 0.5).normalize();
    const t = mk(G_CURL, col, [s * 0.78, s * 1.25, s * 0.8], [c[0] + p[0] * r[0] + WISP_D.x * s * 0.35, c[1] + p[1] * r[1] + WISP_D.y * s * 0.35, c[2] + p[2] * r[2] + WISP_D.z * s * 0.35], parent, { noShadow: true });
    t.quaternion.setFromUnitVectors(UP, WISP_D);
  });
}
function strand(parent, col, pos, dir, len, w) {
  WISP_D.set(dir[0], dir[1], dir[2]).normalize();
  const t = mk(G_CURL, col, [Math.max(w, len * 0.55), len, Math.max(w, len * 0.55) * 1.1], [pos[0] + WISP_D.x * len * 0.4, pos[1] + WISP_D.y * len * 0.4, pos[2] + WISP_D.z * len * 0.4], parent, { noShadow: true });
  t.quaternion.setFromUnitVectors(UP, WISP_D); return t;
}
function makeLuca() {
  const g = new THREE.Group(), body = grp(g);
  const A = '#d9a066', a = '#e8bb84', b = '#f7ecdc', d = '#cc9156', r = '#bd7f45', C = [A, A, a, '#cf955a'];
  // compact torso under a shaggy coat, with a cream bib down the chest
  mk(G_SPH, A, [0.42, 0.36, 0.52], [0, 0.32, -0.02], body);
  wisps(body, [0, 0.34, -0.02], [0.19, 0.16, 0.24], 52, C, 0.13, 0.7);
  wisps(body, [0, 0.3, 0.2], [0.11, 0.13, 0.06], 18, [b, b, '#efdcc2'], 0.12, 1.3, p => p[2] < -0.3, 6);
  const legs = [];
  [[-0.12, 0.15], [0.12, 0.15], [-0.12, -0.17], [0.12, -0.17]].forEach(([x, z], k) => {
    const L = grp(body, x, 0.2, z);
    mk(G_CYL, a, [0.13, 0.18, 0.13], [0, -0.07, 0], L);
    for (let i = 0; i < 6; i++) { const an = i / 6 * TAU + k; strand(L, i % 2 ? a : (k < 2 ? b : A), [Math.cos(an) * 0.05, -0.02 - (i % 3) * 0.04, Math.sin(an) * 0.05], [Math.cos(an) * 0.4, -1, Math.sin(an) * 0.4], 0.14, 0.07); }
    mk(G_SPH, a, [0.14, 0.07, 0.16], [0, -0.17, 0.03], L);
    legs.push(L);
  });
  // head: a round dome under a mop of shaggy hair
  const head = grp(body, 0, 0.64, 0.28);
  mk(G_SPH, A, [0.44, 0.4, 0.4], [0, 0, 0], head);
  wisps(head, [0, 0.02, -0.02], [0.2, 0.18, 0.17], 40, C, 0.12, 0.3, p => p[2] > 0.3 && p[1] < 0.55);
  wisps(head, [0, 0.19, 0.03], [0.1, 0.04, 0.08], 12, [a, A, '#f0cf9f'], 0.1, -0.9, null, 7);
  // short cream muzzle with a long scruffy beard
  mk(G_SPH, b, [0.25, 0.16, 0.17], [0, -0.08, 0.16], head);
  mk(G_SPH, b, [0.16, 0.1, 0.1], [0, 0.0, 0.18], head);
  wisps(head, [0, -0.15, 0.15], [0.1, 0.04, 0.06], 16, [b, b, '#efdcc2'], 0.09, 1.4, p => p[2] < -0.3, 8);
  mk(G_SPH, '#1b1513', [0.105, 0.085, 0.075], [0, -0.035, 0.265], head, { noShadow: true });
  mk(G_SPH, '#6a5a58', [0.03, 0.02, 0.01], [0.025, -0.015, 0.3], head, { noShadow: true });
  mk(G_SPH, '#4a2e28', [0.05, 0.012, 0.02], [0, -0.11, 0.245], head, { noShadow: true });
  const tongue = mk(G_SPH, '#ff8fa3', [0.05, 0.024, 0.06], [0, -0.14, 0.23], head, { noShadow: true });
  [-1, 1].forEach(s => {
    // soft dark brown eyes peeking out under the fringe
    mk(G_SPH, '#2a1a12', [0.09, 0.09, 0.05], [s * 0.1, 0.035, 0.18], head, { noShadow: true });
    mk(G_SPH, '#5a3a26', [0.05, 0.03, 0.01], [s * 0.1, 0.015, 0.2], head, { noShadow: true });
    mk(G_SPH, '#ffffff', [0.026, 0.026, 0.01], [s * 0.1 + 0.02, 0.058, 0.205], head, { noShadow: true, glow: true });
    mk(G_SPH, '#e8a58a', [0.06, 0.028, 0.02], [s * 0.15, -0.05, 0.13], head, { noShadow: true, alpha: 0.45 });
    // caramel cheeks and brows framing the cream muzzle
    for (let i = 0; i < 2; i++) strand(head, i % 2 ? A : a, [s * (0.17 + i * 0.02), -0.04 - i * 0.04, 0.12], [s * 0.4, -1, 0.3], 0.1, 0.06);
  });
  // the fringe: wispy strands falling over the brow
  for (let i = 0; i < 7; i++) { const x = -0.15 + i * 0.05; strand(head, [a, A, '#f0cf9f'][i % 3], [x, 0.2 - Math.abs(x) * 0.25, 0.14], [x * 1.5, -0.7, 1], 0.09 + (i % 2) * 0.02, 0.06); }
  // long feathered Cavalier ears that blend into the head fluff
  const ears = [-1, 1].map(s => {
    const e = grp(head, s * 0.2, 0.12, 0.0); e.rotation.z = s * 0.15;
    mk(G_SPH, d, [0.1, 0.42, 0.22], [s * 0.02, -0.18, 0.01], e);
    for (let i = 0; i < 14; i++) {
      const y = -0.02 - (i % 7) * 0.055, z = (i < 7 ? 0.05 : -0.05) + (hsh(i, s + 3, 2) - 0.5) * 0.04;
      strand(e, [d, r, A, a][i % 4], [s * 0.02, y, z], [s * 0.25, -1, (i < 7 ? 0.2 : -0.2)], 0.13, 0.08);
    }
    for (let i = 0; i < 4; i++) strand(e, [r, d][i % 2], [s * 0.03, -0.38, -0.06 + i * 0.04], [s * 0.2, -1, -0.15 + i * 0.1], 0.13, 0.06);
    return e;
  });
  // feathered plume tail, carried high and flaring at the tip
  const tail = grp(body, 0, 0.44, -0.27); tail.rotation.x = -0.35;
  [[0, 0.02, 0], [0, 0.09, -0.01], [0, 0.16, 0.02], [0, 0.21, 0.08], [0, 0.23, 0.15], [0, 0.22, 0.21]].forEach((p, i) => {
    mk(G_CURL, i % 2 ? a : A, [0.1, 0.1, 0.1], p, tail, { noShadow: true });
    [-1, 1].forEach(s => strand(tail, i > 3 ? b : i % 2 ? A : a, p, [s * 0.9, -0.3, 0.2], 0.12 + i * 0.015, 0.05));
  });
  g.userData = { kind: 'dog', body, head, ears, tail, legs, tongue, walk: 0 };
  return g;
}

/* ---------------- Joanne the blue Corolla: sedan profile extruded across the width ---------------- */
const CAR_PROFILE = [[-0.93, 0.14], [-0.96, 0.3], [-0.92, 0.45], [-0.64, 0.49], [-0.4, 0.71], [0.1, 0.735], [0.43, 0.5], [0.84, 0.43], [0.96, 0.31], [0.93, 0.14]];
const G_CARBODY = geo('carbody', () => {
  const s = new THREE.Shape(); CAR_PROFILE.forEach(([u, v], i) => i ? s.lineTo(u, v) : s.moveTo(u, v));
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.7, bevelEnabled: true, bevelSize: 0.045, bevelThickness: 0.045, bevelSegments: 4, curveSegments: 8 });
  g.translate(0, 0, -0.35); g.rotateY(-Math.PI / 2); return g;
});
const G_CARGLASS = geo('carglass', () => {
  const s = new THREE.Shape(); [[-0.58, 0.5], [-0.39, 0.69], [0.09, 0.71], [0.39, 0.51]].forEach(([u, v], i) => i ? s.lineTo(u, v) : s.moveTo(u, v));
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.8, bevelEnabled: false }); g.translate(0, 0, -0.4); g.rotateY(-Math.PI / 2); return g;
});
let PLATE_TEX = null;
function plateTex() {
  if (PLATE_TEX) return PLATE_TEX;
  const c = document.createElement('canvas'); c.width = 128; c.height = 40; const x = c.getContext('2d');
  x.fillStyle = '#fffdf6'; x.fillRect(0, 0, 128, 40); x.strokeStyle = '#26457a'; x.lineWidth = 4; x.strokeRect(2, 2, 124, 36);
  x.fillStyle = '#26457a'; x.font = 'bold 24px Fredoka, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(CONFIG.car.toUpperCase(), 64, 22);
  return (PLATE_TEX = new THREE.CanvasTexture(c));
}
function makeCar(color) {
  const g = new THREE.Group(), body = grp(g), c = color || '#2f6fd1', DARK = '#26272f', CHROME = '#d7dce6';
  mk(G_CARBODY, c, [1, 1, 1], [0, 0, 0], body);
  mk(G_CARGLASS, '#2c3e5c', [1, 1, 1], [0, 0, 0], body, { noShadow: true });
  // windscreen + rear window laid along the roof slopes, with a sky reflection stripe
  const ws = mk(G_BOX, '#355077', [0.66, 0.012, 0.37], [0, 0.628, 0.278], body, { noShadow: true }); ws.rotation.x = 0.66;
  const wr = mk(G_BOX, '#9fd0ff', [0.12, 0.014, 0.3], [-0.16, 0.634, 0.284], body, { noShadow: true, glow: true, alpha: 0.35 }); wr.rotation.x = 0.66;
  const rw = mk(G_BOX, '#355077', [0.62, 0.012, 0.32], [0, 0.61, -0.514], body, { noShadow: true }); rw.rotation.x = -0.73;
  // B-pillar and side trim
  [-1, 1].forEach(s => {
    mk(G_BOX, c, [0.03, 0.2, 0.06], [s * 0.401, 0.6, -0.1], body, { noShadow: true });
    mk(G_BOX, CHROME, [0.01, 0.015, 0.95], [s * 0.401, 0.495, -0.1], body, { noShadow: true });
    mk(G_BOX, '#1f5bb3', [0.01, 0.28, 0.006], [s * 0.4, 0.33, 0.13], body, { noShadow: true });
    mk(G_BOX, '#1f5bb3', [0.01, 0.28, 0.006], [s * 0.4, 0.33, -0.36], body, { noShadow: true });
    [0.02, -0.46].forEach(z => mk(G_BOX, CHROME, [0.02, 0.02, 0.08], [s * 0.405, 0.43, z], body, { noShadow: true }));
    mk(G_BOX, c, [0.1, 0.06, 0.05], [s * 0.44, 0.53, 0.3], body); mk(G_BOX, '#9fb8d8', [0.005, 0.04, 0.035], [s * 0.492, 0.53, 0.3], body, { noShadow: true });
  });
  // front: swept headlights, slim upper grille, big lower trapezoid grille, fog lights
  [-1, 1].forEach(s => {
    const h = mk(G_BOX, '#eaf6ff', [0.22, 0.05, 0.03], [s * 0.26, 0.4, 0.915], body, { glow: true }); h.rotation.z = s * -0.12; h.rotation.y = s * 0.25;
    mk(G_BOX, '#8fd0ff', [0.06, 0.02, 0.02], [s * 0.19, 0.39, 0.935], body, { glow: true, noShadow: true });
    mk(G_SPH, '#fff4c9', [0.05, 0.03, 0.02], [s * 0.3, 0.2, 0.975], body, { glow: true, noShadow: true });
  });
  mk(G_BOX, DARK, [0.34, 0.03, 0.03], [0, 0.375, 0.93], body, { noShadow: true });
  mk(G_BOX, DARK, [0.46, 0.11, 0.03], [0, 0.22, 0.972], body, { noShadow: true });
  mk(G_BOX, '#3a3c48', [0.4, 0.012, 0.035], [0, 0.22, 0.975], body, { noShadow: true });
  mk(G_BOX, '#ffffff', [0.22, 0.068, 0.012], [0, 0.285, 0.992], body, { noShadow: true }).material = new THREE.MeshBasicMaterial({ map: plateTex() });
  // back: wraparound tail lights, plate, bumper line
  [-1, 1].forEach(s => { mk(G_BOX, '#e2344f', [0.24, 0.06, 0.03], [s * 0.26, 0.43, -0.935], body, { glow: true }); mk(G_BOX, '#e2344f', [0.03, 0.05, 0.12], [s * 0.39, 0.43, -0.88], body, { glow: true }); });
  mk(G_BOX, '#ffffff', [0.22, 0.068, 0.012], [0, 0.32, -0.995], body, { noShadow: true }).material = new THREE.MeshBasicMaterial({ map: plateTex() });
  mk(G_BOX, DARK, [0.7, 0.05, 0.03], [0, 0.19, -0.965], body, { noShadow: true });
  // wheels: tyre, alloy rim, five spokes, hub
  const wheels = [];
  [[-0.38, 0.55], [0.38, 0.55], [-0.38, -0.58], [0.38, -0.58]].forEach(([x, z]) => {
    const w = grp(g, x, 0.17, z), s = Math.sign(x);
    mk(G_CYL, DARK, [0.34, 0.15, 0.34], [0, 0, 0], w).rotation.z = Math.PI / 2;
    mk(G_CYL, '#c7ccd6', [0.22, 0.155, 0.22], [0, 0, 0], w, { noShadow: true }).rotation.z = Math.PI / 2;
    const sp = grp(w, s * 0.08, 0, 0); for (let i = 0; i < 5; i++) { const b = mk(G_BOX, '#8f96a6', [0.012, 0.19, 0.035], [0, 0, 0], sp, { noShadow: true }); b.rotation.x = i / 5 * TAU; }
    mk(G_CYL, '#6b7282', [0.06, 0.02, 0.06], [s * 0.085, 0, 0], w, { noShadow: true }).rotation.z = Math.PI / 2;
    wheels.push(sp);
  });
  // Paulo's little flower still rides on the aerial
  mk(G_CYL, '#8a8fa0', [0.012, 0.3, 0.012], [0.22, 0.86, -0.28], body, { noShadow: true });
  const fl = grp(body, 0.22, 1.02, -0.28); for (let i = 0; i < 5; i++) mk(G_SPH, '#ff9fc3', [0.07, 0.07, 0.04], [Math.cos(i / 5 * TAU) * 0.05, Math.sin(i / 5 * TAU) * 0.05, 0], fl, { noShadow: true }); mk(G_SPH, '#ffd166', [0.05, 0.05, 0.05], [0, 0, 0.01], fl);
  g.userData = { kind: 'car', body, flower: fl, wheels };
  return g;
}

/* ---------------- the lucky trading-card buddy from the gym locker ---------------- */
const G_BOLT = geo('bolt', () => {
  const s = new THREE.Shape(); [[0, 0], [0.12, 0.02], [0.08, 0.2], [0.26, 0.2], [0.2, 0.42], [0.46, 0.4], [0.34, 0.72], [0.1, 0.62], [0.16, 0.44], [-0.04, 0.44], [0.02, 0.24], [-0.1, 0.22]].forEach(([u, v], i) => i ? s.lineTo(u, v) : s.moveTo(u, v));
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 }); g.translate(-0.1, 0, -0.03); return g;
});
function makePikachu() {
  const g = new THREE.Group(), body = grp(g), Y = '#ffd83d', BR = '#b5773d', INKP = '#2a1f1d';
  mk(G_SPH, Y, [0.5, 0.5, 0.44], [0, 0.3, 0], body);
  [-1, 1].forEach(s => { mk(G_SPH, Y, [0.16, 0.1, 0.22], [s * 0.13, 0.05, 0.05], body); mk(G_SPH, Y, [0.09, 0.15, 0.09], [s * 0.2, 0.36, 0.14], body).rotation.z = s * 0.6; });
  [0.34, 0.24].forEach(y => mk(G_BOX, BR, [0.3, 0.05, 0.02], [0, y, -0.215], body, { noShadow: true }));
  const head = grp(body, 0, 0.72, 0.02);
  mk(G_SPH, Y, [0.56, 0.48, 0.48], [0, 0, 0], head);
  const ears = [-1, 1].map(s => {
    const e = grp(head, s * 0.16, 0.18, -0.02); e.rotation.z = s * -0.45;
    mk(G_CONE, Y, [0.13, 0.52, 0.1], [0, 0.26, 0], e); mk(G_CONE, INKP, [0.075, 0.16, 0.06], [0, 0.46, 0], e, { noShadow: true });
    return e;
  });
  [-1, 1].forEach(s => {
    mk(G_SPH, INKP, [0.08, 0.09, 0.04], [s * 0.12, 0.04, 0.215], head, { noShadow: true });
    mk(G_SPH, '#ffffff', [0.03, 0.03, 0.015], [s * 0.12 + 0.017, 0.065, 0.236], head, { noShadow: true, glow: true });
    mk(G_SPH, '#ff4d4d', [0.13, 0.12, 0.04], [s * 0.2, -0.08, 0.17], head, { noShadow: true });
  });
  mk(G_SPH, INKP, [0.03, 0.02, 0.02], [0, -0.02, 0.24], head, { noShadow: true });
  [-1, 1].forEach(s => { const m = mk(G_BOX, INKP, [0.05, 0.012, 0.012], [s * 0.022, -0.065, 0.232], head, { noShadow: true }); m.rotation.z = s * -0.5; });
  mk(G_SPH, '#e8546a', [0.05, 0.03, 0.02], [0, -0.085, 0.225], head, { noShadow: true });
  const tail = grp(body, 0.1, 0.18, -0.2); tail.rotation.set(-0.35, Math.PI / 2, -0.25);
  mk(G_BOLT, Y, [1, 1, 1], [0, 0, 0], tail); mk(G_BOX, BR, [0.12, 0.08, 0.07], [0, 0.03, 0], tail);
  g.userData = { kind: 'buddy', body, head, ears, tail };
  return g;
}
function makeHoloCard(parent) {
  const c = grp(parent);
  mk(G_BOX, '#ffe27a', [0.34, 0.47, 0.015], [0, 0, 0], c);
  const f = mk(G_BOX, '#bfe6ff', [0.28, 0.2, 0.02], [0, 0.07, 0], c, { noShadow: true, glow: true }); f.userData.holo = true;
  mk(G_STAR, '#ffd83d', [0.12, 0.12, 0.12], [0, 0.07, 0.02], c, { noShadow: true });
  for (let i = 0; i < 3; i++) mk(G_BOX, '#b58a3d', [0.22, 0.02, 0.02], [0, -0.1 - i * 0.05, 0.005], c, { noShadow: true });
  return c;
}

/* ---------------- props ---------------- */
function makeHeart(parent, x, y, z, color, s) { const h = mk(G_HEART, color || '#ff5c7a', [s || 0.5, s || 0.5, s || 0.5], [x, y, z], parent); return h; }
function makeBalloon(parent, x, y, z, color, len) {
  const g = grp(parent, x, y, z);
  mk(G_SPH, color, [0.42, 0.5, 0.42], [0, (len || 1.2) + 0.25, 0], g, { noShadow: true });
  mk(G_CONE, color, [0.1, 0.08, 0.1], [0, (len || 1.2), 0], g).rotation.x = Math.PI;
  mk(G_SPH, '#ffffff', [0.1, 0.14, 0.05], [-0.1, (len || 1.2) + 0.38, 0.17], g, { noShadow: true, glow: true, alpha: 0.7 });
  mk(G_CYL, '#ffffff', [0.012, len || 1.2, 0.012], [0, (len || 1.2) / 2, 0], g, { noShadow: true });
  g.userData.phase = Math.random() * TAU; return g;
}
function makeCake(parent, x, y, z, candles) {
  const g = grp(parent, x, y, z);
  mk(G_CYL, '#ffffff', [0.9, 0.05, 0.9], [0, 0.025, 0], g);
  mk(G_CYL, '#f7a8c4', [0.7, 0.24, 0.7], [0, 0.17, 0], g);
  mk(G_CYL, '#fff0f6', [0.72, 0.05, 0.72], [0, 0.29, 0], g);
  mk(G_CYL, '#b9e1f5', [0.5, 0.2, 0.5], [0, 0.41, 0], g);
  mk(G_CYL, '#fff0f6', [0.52, 0.04, 0.52], [0, 0.51, 0], g);
  for (let i = 0; i < 10; i++) mk(G_SPH, CONFETTI[i % 5], [0.05, 0.05, 0.05], [Math.cos(i / 10 * TAU) * 0.35, 0.28, Math.sin(i / 10 * TAU) * 0.35], g, { noShadow: true });
  const flames = [];
  for (let i = 0; i < (candles || 3); i++) {
    const a = i / (candles || 3) * TAU; const cx = Math.cos(a) * 0.14, cz = Math.sin(a) * 0.14;
    mk(G_CYL, ['#7fc8f8', '#ffd166', '#b9a3ff'][i % 3], [0.04, 0.2, 0.04], [cx, 0.62, cz], g);
    flames.push(mk(G_SPH, '#ffcf5c', [0.06, 0.1, 0.06], [cx, 0.77, cz], g, { glow: true }));
  }
  g.userData.flames = flames; return g;
}
function makeTree(parent, x, z, s, col) {
  const g = grp(parent, x, 0, z); s = s || 1;
  mk(G_CYL, '#a8744f', [0.14 * s, 0.6 * s, 0.14 * s], [0, 0.3 * s, 0], g);
  const c = col || '#7cc576';
  mk(G_SPH, c, [0.8 * s, 0.7 * s, 0.8 * s], [0, 0.85 * s, 0], g); mk(G_SPH, c, [0.55 * s, 0.5 * s, 0.55 * s], [0.18 * s, 1.18 * s, 0.05 * s], g);
  g.userData.sway = Math.random() * TAU; return g;
}
function makePalm(parent, x, z) {
  const g = grp(parent, x, 0, z);
  for (let i = 0; i < 6; i++) mk(G_CYL, i % 2 ? '#c9975f' : '#b5844f', [0.16 - i * 0.01, 0.26, 0.16 - i * 0.01], [Math.sin(i * 0.4) * 0.08, 0.13 + i * 0.24, 0], g);
  const top = grp(g, 0.12, 1.5, 0);
  for (let i = 0; i < 6; i++) { const l = grp(top); l.rotation.y = i / 6 * TAU; const leaf = mk(G_SPH, i % 2 ? '#5fbf73' : '#7cd08a', [0.24, 0.07, 0.95], [0, -0.05, 0.42], l); leaf.rotation.x = 0.35; }
  mk(G_SPH, '#8a5a36', [0.14, 0.14, 0.14], [0.08, -0.08, 0.05], top); mk(G_SPH, '#8a5a36', [0.14, 0.14, 0.14], [-0.06, -0.1, -0.04], top);
  g.userData.sway = Math.random() * TAU; return g;
}
function makeFlower(parent, x, z, c) {
  const g = grp(parent, x, 0, z);
  mk(G_CYL, '#5fae63', [0.03, 0.22, 0.03], [0, 0.11, 0], g, { noShadow: true });
  for (let i = 0; i < 5; i++) mk(G_SPH, c, [0.09, 0.05, 0.09], [Math.cos(i / 5 * TAU) * 0.07, 0.24, Math.sin(i / 5 * TAU) * 0.07], g, { noShadow: true });
  mk(G_SPH, '#ffd166', [0.07, 0.06, 0.07], [0, 0.26, 0], g, { noShadow: true });
  return g;
}
function makeFairyLights(parent, x0, z0, x1, z1, y, n) {
  const g = grp(parent), cols = ['#fff4b0', '#ffc2d6', '#c2e8ff', '#ffe08a'];
  for (let i = 0; i <= n; i++) { const t = i / n; const sag = Math.sin(t * Math.PI) * 0.35; const b = mk(G_SPH, cols[i % 4], [0.09, 0.11, 0.09], [lerp(x0, x1, t), y - sag, lerp(z0, z1, t)], g, { glow: true }); b.userData.tw = Math.random() * TAU; }
  g.userData.fairy = true; return g;
}
function makePlant(parent, x, z, big) {
  const g = grp(parent, x, 0, z), s = big ? 1.3 : 1;
  mk(G_CYL, '#e8916b', [0.32 * s, 0.3 * s, 0.32 * s], [0, 0.15 * s, 0], g); mk(G_CYL, '#d97a55', [0.36 * s, 0.06, 0.36 * s], [0, 0.3 * s, 0], g);
  for (let i = 0; i < 7; i++) { const l = grp(g, 0, 0.3 * s, 0); l.rotation.y = i / 7 * TAU; const f = mk(G_SPH, i % 2 ? '#5fbf73' : '#7cd08a', [0.14 * s, 0.5 * s, 0.1 * s], [0, 0.22 * s, 0.1 * s], l); f.rotation.x = 0.5; }
  g.userData.sway = Math.random() * TAU; return g;
}

/* ---------------- battle foes: silly, not scary ---------------- */
function googly(parent, x, y, z, s) { [-1, 1].forEach(k => { mk(G_SPH, '#ffffff', [0.22 * s, 0.26 * s, 0.1 * s], [x + k * 0.14 * s, y, z], parent, { noShadow: true }); mk(G_SPH, INK, [0.1 * s, 0.12 * s, 0.06 * s], [x + k * 0.14 * s, y - 0.03 * s, z + 0.05 * s], parent, { noShadow: true }); }); mk(G_SPH, INK, [0.2 * s, 0.05 * s, 0.03 * s], [x, y - 0.24 * s, z], parent, { noShadow: true }); }
function makeFoe(kind) {
  const g = new THREE.Group(), body = grp(g);
  if (kind === 'lastset') {
    const bar = mk(G_CYL, '#b8bfcc', [0.12, 2.1, 0.12], [0, 0, 0], body); bar.rotation.z = Math.PI / 2;
    [-1, 1].forEach(s => { mk(G_CYL, '#b9a3ff', [0.9, 0.18, 0.9], [s * 0.72, 0, 0], body).rotation.z = Math.PI / 2; mk(G_CYL, '#ff7aa8', [0.7, 0.14, 0.7], [s * 0.88, 0, 0], body).rotation.z = Math.PI / 2; });
    googly(body, 0, 0.12, 0.08, 1.2);
    [-1, 1].forEach(s => mk(G_SPH, '#ff9fb2', [0.2, 0.08, 0.04], [s * 0.33, -0.12, 0.08], body, { noShadow: true }));
  } else {
    mk(G_BOX, '#ffffff', [1.3, 0.9, 0.18], [0, 0, 0], body);
    const flap = mk(G_CONE, '#e8eef8', [0.92, 0.5, 0.2], [0, 0.2, 0.1], body); flap.rotation.set(Math.PI / 2, 0, Math.PI); flap.scale.set(1.3, 0.2, 0.55);
    for (let i = 0; i < 3; i++) mk(G_BOX, ['#dbe7ff', '#ffe3ec', '#e4ffe0'][i], [1.25, 0.85, 0.12], [0.08 * (i + 1), -0.06 * (i + 1), -0.14 * (i + 1)], body);
    const badge = mk(G_SPH, '#ff5c7a', [0.34, 0.34, 0.1], [0.55, 0.42, 0.12], body); googly(body, 0, 0, 0.12, 1.05);
  }
  g.userData = { kind: 'foe', body };
  return g;
}

/* ---------------- floating island base: layered like a cake ---------------- */
function makeIslandBase(parent, w, d, top, cx, cz) {
  const g = grp(parent, cx, 0, cz);
  mk(G_BOX, top, [w + 0.3, 0.3, d + 0.3], [0, -0.25, 0], g);
  mk(G_BOX, '#e8c9a0', [w + 0.1, 0.35, d + 0.1], [0, -0.55, 0], g);
  mk(G_BOX, '#d4a77e', [w - 0.3, 0.4, d - 0.3], [0, -0.9, 0], g);
  // drippy icing edge
  for (let i = 0; i < Math.floor((w + d) * 1.3); i++) {
    const t = i / Math.floor((w + d) * 1.3), per = 2 * (w + d), p = t * per;
    let x, z; if (p < w) { x = -w / 2 + p; z = d / 2 + 0.16; } else if (p < w + d) { x = w / 2 + 0.16; z = d / 2 - (p - w); } else if (p < 2 * w + d) { x = w / 2 - (p - w - d); z = -d / 2 - 0.16; } else { x = -w / 2 - 0.16; z = -d / 2 + (p - 2 * w - d); }
    mk(G_SPH, top, [0.3, 0.3 + hsh(i, 1) * 0.35, 0.3], [x, -0.42 - hsh(i, 2) * 0.12, z], g, { noShadow: true });
  }
  // hanging rocks underneath
  for (let i = 0; i < 7; i++) { const c = mk(G_CONE, i % 2 ? '#c89b74' : '#b98a64', [1.4 + hsh(i, 3) * 1.4, 1.6 + hsh(i, 4) * 2, 1.4 + hsh(i, 5) * 1.2], [(hsh(i, 6) - 0.5) * (w - 2), -1.6 - hsh(i, 7), (hsh(i, 8) - 0.5) * (d - 2)], g, { noShadow: true }); c.rotation.x = Math.PI; }
  return g;
}
