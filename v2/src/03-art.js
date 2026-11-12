/* =========================================================
   ART: low-poly toy builders. Everything faces +z.
   Palette stays soft and candy-bright; outlines come from the toon ramp.
   ========================================================= */
const INK = '#4a3b52';
const heartShape = (() => { const s = new THREE.Shape(); s.moveTo(0, -0.5); s.bezierCurveTo(-0.1, -0.35, -0.55, -0.1, -0.5, 0.18); s.bezierCurveTo(-0.45, 0.45, -0.1, 0.5, 0, 0.25); s.bezierCurveTo(0.1, 0.5, 0.45, 0.45, 0.5, 0.18); s.bezierCurveTo(0.55, -0.1, 0.1, -0.35, 0, -0.5); return s; })();
const G_HEART = geo('heart', () => { const g = new THREE.ExtrudeGeometry(heartShape, { depth: 0.18, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 3, curveSegments: 12 }); g.center(); return g; });
const starShape = (() => { const s = new THREE.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.22 : 0.5, a = i / 10 * TAU + Math.PI / 2; const x = Math.cos(a) * r, y = Math.sin(a) * r; i ? s.lineTo(x, y) : s.moveTo(x, y); } return s; })();
const G_STAR = geo('star', () => { const g = new THREE.ExtrudeGeometry(starShape, { depth: 0.12, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2 }); g.center(); return g; });
// Character bodies are turned on a lathe from smooth curves, so there are no flat facets or hard rims
function lathe(key, pts, seg) {
  return geo(key, () => { const c = new THREE.SplineCurve(pts.map(p => new THREE.Vector2(p[0], p[1]))), g = new THREE.LatheGeometry(c.getPoints(pts.length * 5).map(v => (v.x = Math.max(0, v.x), v)), seg || 32); g.computeVertexNormals(); return g; });
}
function capsule(r, len) {
  return geo('cap' + r + ':' + len, () => { const p = [], h = len / 2 - r; for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + i / 8 * Math.PI / 2; p.push(new THREE.Vector2(Math.cos(a) * r, -h + Math.sin(a) * r)); } for (let i = 0; i <= 8; i++) { const a = i / 8 * Math.PI / 2; p.push(new THREE.Vector2(Math.cos(a) * r, h + Math.sin(a) * r)); } p[0].x = 0; p[p.length - 1].x = 0; return new THREE.LatheGeometry(p, 20); });
}
const G_TORSO = lathe('torso', [[0, -0.165], [0.09, -0.16], [0.15, -0.13], [0.172, -0.07], [0.165, 0], [0.148, 0.07], [0.12, 0.125], [0.07, 0.16], [0, 0.17]]);
const G_SKIRT = lathe('skirt', [[0, -0.17], [0.2, -0.185], [0.255, -0.165], [0.235, -0.1], [0.19, -0.02], [0.155, 0.06], [0.13, 0.12], [0.08, 0.17], [0, 0.185]]);
const G_HEAD = geo('head', () => new THREE.SphereGeometry(0.5, 32, 22)); // heads and hair get a finer sphere: they are the biggest silhouettes
// Characters are shaded on a smooth ramp and take no cast shadows, so faces and hair never get a hard band across them
const SOFT_RAMP = (() => { const d = new Uint8Array([150, 180, 206, 228, 244, 255]); const t = new THREE.DataTexture(d, 6, 1, THREE.LuminanceFormat); t.minFilter = t.magFilter = THREE.LinearFilter; t.generateMipmaps = false; t.needsUpdate = true; return t; })();
const SOFT = {};
function softSkin(g) {
  g.traverse(o => {
    if (!o.isMesh) return; o.receiveShadow = false; const m = o.material; if (!m.isMeshToonMaterial || m.gradientMap === SOFT_RAMP) return;
    const k = (m.vertexColors ? 'vc' : m.color.getHexString()) + ':' + m.opacity;
    o.material = SOFT[k] || (SOFT[k] = new THREE.MeshToonMaterial({ color: m.vertexColors ? '#ffffff' : m.color, vertexColors: m.vertexColors, gradientMap: SOFT_RAMP, transparent: m.transparent, opacity: m.opacity }));
  });
  return g;
}

/* ---------------- people: clean vinyl-toy figures. One smooth head, one hair shell, a simple face, a bean body ---------------- */
// the hair shell: a sphere cap tipped back, so it makes a tidy hairline across the forehead and reaches the nape
const G_CAP = geo('haircap', () => new THREE.SphereGeometry(0.5, 32, 14, 0, TAU, 0, Math.PI * 0.56));
const G_SMILE = geo('smile', () => new THREE.TorusGeometry(0.5, 0.11, 6, 14, Math.PI));
const G_BAND = geo('band', () => new THREE.TorusGeometry(0.5, 0.07, 8, 28));
function makePerson(o) {
  const g = new THREE.Group(), body = grp(g);
  const skin = o.skin || '#f9d1b0', hair = o.hair || '#6b4a32', top = o.top || '#7f93b3', bot = o.bottom || top, shoe = o.shoe || '#fdfdfd';
  const bare = o.style === 'dress' || o.style === 'crop';
  // legs and shoes
  const legL = grp(body, -0.075, 0.24, 0), legR = grp(body, 0.075, 0.24, 0);
  [legL, legR].forEach(L => { mk(capsule(0.054, 0.27), o.style === 'dress' ? skin : bot, null, [0, -0.1, 0], L); mk(G_SPH, shoe, [0.135, 0.09, 0.19], [0, -0.205, 0.03], L); });
  // body: a dress, a crop top over leggings, or a top over pants
  if (o.style === 'dress') mk(G_SKIRT, top, [1, 1, 1], [0, 0.36, 0], body);
  else if (o.style === 'crop') { mk(G_TORSO, skin, [0.78, 0.9, 0.78], [0, 0.37, 0], body); mk(G_TORSO, top, [0.95, 0.62, 0.95], [0, 0.44, 0], body); mk(G_HEAD, bot, [0.31, 0.18, 0.28], [0, 0.26, 0], body); }
  else { mk(G_TORSO, top, [0.95, 1, 0.95], [0, 0.385, 0], body); mk(G_HEAD, bot, [0.32, 0.17, 0.29], [0, 0.25, 0], body); }
  if (o.apron) mk(G_HEAD, o.apron, [0.24, 0.28, 0.08], [0, 0.35, 0.13], body);
  // arms end in little mitten hands
  const armL = grp(body, -0.178, 0.5, 0), armR = grp(body, 0.178, 0.5, 0);
  [armL, armR].forEach((A, i) => { const s = grp(A); s.rotation.z = (i ? 1 : -1) * 0.16; mk(capsule(0.045, 0.22), bare ? skin : top, null, [0, -0.075, 0], s); mk(G_SPH, skin, [0.086, 0.086, 0.086], [0, -0.19, 0.006], s); });
  // head and face: two glossy eyes, soft cheeks, a small smile. Nothing else
  const head = grp(body, 0, 0.78, 0), F = { noShadow: true };
  mk(G_HEAD, skin, [0.5, 0.47, 0.47], [0, 0, 0], head);
  [-1, 1].forEach(s => {
    mk(G_SPH, o.eye || INK, [0.066, 0.092, 0.03], [s * 0.09, -0.012, 0.217], head, F);
    mk(G_SPH, '#ffffff', [0.026, 0.026, 0.012], [s * 0.09 + 0.014, 0.014, 0.231], head, { noShadow: true, glow: true });
    mk(G_SPH, '#ff9fb2', [0.075, 0.042, 0.016], [s * 0.152, -0.072, 0.176], head, { noShadow: true, alpha: 0.75 });
    if (o.lashes) mk(G_SPH, INK, [0.04, 0.013, 0.012], [s * 0.128, 0.03, 0.2], head, F).rotation.z = s * 0.55;
  });
  const smile = mk(G_SMILE, '#b5566b', [0.052, 0.034, 0.05], [0, -0.078, 0.224], head, F); smile.rotation.z = Math.PI;
  // hair: one shell, plus a few big clean shapes per style
  const style = o.hairStyle, swept = style === 'long' || style === 'bob' || style === 'bun';
  const cap = mk(G_CAP, hair, [0.545, 0.525, 0.53], [0, 0.005, -0.005], head); cap.rotation.x = swept ? -0.5 : -0.72; // short cuts sit higher off the forehead
  if (swept) { const fr = mk(G_HEAD, hair, [0.4, 0.13, 0.15], [-0.03, 0.125, 0.172], head); fr.rotation.z = 0.2; }
  if (style === 'long') { mk(G_HEAD, hair, [0.5, 0.62, 0.3], [0, -0.14, -0.1], head); [-1, 1].forEach(s => mk(G_HEAD, hair, [0.11, 0.36, 0.14], [s * 0.218, -0.14, 0.035], head)); }
  if (style === 'bob') { mk(G_HEAD, hair, [0.5, 0.42, 0.3], [0, -0.07, -0.09], head); [-1, 1].forEach(s => mk(G_HEAD, hair, [0.13, 0.3, 0.3], [s * 0.21, -0.07, -0.01], head)); }
  if (style === 'bun' && !o.beanie) mk(G_HEAD, hair, [0.2, 0.2, 0.2], [0, 0.3, -0.07], head);
  if (style === 'fluffy' && !o.beanie) [[-0.12, 0.185, 0.1, 0.2], [0.02, 0.215, 0.11, 0.23], [0.15, 0.185, 0.09, 0.19]].forEach(([x, y, z, r]) => mk(G_HEAD, hair, [r, r * 0.55, r * 0.9], [x, y, z], head)); // a soft wavy top, not a quiff tower
  if (o.bow) { const b = grp(head, 0.165, 0.205, 0.085); b.rotation.set(-0.3, 0.3, -0.45); [-1, 1].forEach(s => mk(G_SPH, o.bow, [0.115, 0.09, 0.05], [s * 0.062, 0, 0], b)); mk(G_SPH, o.bow, [0.05, 0.055, 0.055], [0, 0, 0.012], b); }
  if (o.glasses) { [-1, 1].forEach(s => mk(G_BAND, INK, [0.115, 0.115, 0.06], [s * 0.09, -0.01, 0.238], head, F)); mk(G_SPH, INK, [0.07, 0.014, 0.014], [0, -0.005, 0.245], head, F); }
  if (o.beanie) { const b = grp(head, 0, 0.03, -0.01); b.rotation.x = -0.28; mk(G_CAP, o.beanie, [0.575, 0.56, 0.565], [0, 0, 0], b).scale.y = 0.5; mk(G_CAP, o.beanie, [0.575, 0.56, 0.565], [0, 0, 0], b); const band = mk(G_BAND, '#ffffff', [0.55, 0.555, 0.5], [0, 0.085, 0], b, F); band.rotation.x = Math.PI / 2; mk(G_SPH, '#ffffff', [0.14, 0.14, 0.14], [0, 0.3, 0], b); }
  g.userData = { kind: 'person', body, head, legL, legR, armL, armR, walk: 0, bounce: 0 };
  return softSkin(mergeStatic(g));
}
const LOOK = {
  annette: o => ({ skin: '#f9d1b0', hair: '#f5d271', brow: '#d9a94a', lashes: true, hairStyle: 'long', eye: '#3d7be0', bow: '#ff7aa8', top: o.top, bottom: o.bottom, style: o.style, shoe: '#ffffff', beanie: o.beanie }),
  paulo: { skin: '#b57848', hair: '#2a1d12', hairStyle: 'fluffy', eye: '#3a2414', top: '#1f1a24', bottom: '#3f6fb0', shoe: '#f4f6fb' },
  mum: { skin: '#f5cfae', hair: '#4a3226', hairStyle: 'bob', eye: '#6b4a32', top: '#7fa383', bottom: '#5b5566' }
};
function makeAnnette(outfitKey) { return makePerson(LOOK.annette(OUTFITS[outfitKey] || OUTFITS.office)); }

/* ---------------- Luca the cavoodle: a clean, rounded caramel pup with a cream bib and muzzle, a fluffy topknot, long floppy ears and a plume of a tail ---------------- */
function buildLuca() {
  const g = new THREE.Group(), body = grp(g); body.name = 'body';
  const A = '#e8bf8a', L = '#f3d6aa', C = '#fdf5e8', D = '#d6a46c', T = '#c48f5a', F = { noShadow: true };
  mk(G_HEAD, A, [0.46, 0.4, 0.6], [0, 0.31, -0.02], body);
  mk(G_HEAD, C, [0.31, 0.3, 0.24], [0, 0.29, 0.2], body);
  const legs = [[-0.12, 0.15], [0.12, 0.15], [-0.12, -0.17], [0.12, -0.17]].map(([x, z], k) => {
    const leg = grp(body, x, 0.2, z);
    mk(capsule(0.07, 0.24), A, null, [0, -0.07, 0], leg); mk(G_SPH, k < 2 ? C : L, [0.16, 0.09, 0.19], [0, -0.165, 0.03], leg);
    return leg;
  });
  const head = grp(body, 0, 0.64, 0.27);
  mk(G_HEAD, A, [0.5, 0.45, 0.45], [0, 0, 0], head);
  [[0, 0.2, 0.03, 0.22], [-0.11, 0.165, 0.02, 0.16], [0.11, 0.165, 0.02, 0.16]].forEach(([x, y, z, r]) => mk(G_HEAD, L, [r, r * 0.85, r], [x, y, z], head));
  [-1, 1].forEach(s => {
    mk(G_HEAD, L, [0.17, 0.16, 0.15], [s * 0.185, -0.095, 0.07], head);
    mk(G_SPH, '#2a1a12', [0.078, 0.088, 0.04], [s * 0.105, 0.035, 0.198], head, F);
    mk(G_SPH, '#ffffff', [0.026, 0.026, 0.012], [s * 0.105 + 0.017, 0.06, 0.218], head, { noShadow: true, glow: true });
  });
  mk(G_HEAD, C, [0.28, 0.19, 0.2], [0, -0.085, 0.16], head);
  mk(G_SPH, '#2a1f1c', [0.1, 0.075, 0.07], [0, -0.04, 0.262], head, F); mk(G_SPH, '#6a5a58', [0.03, 0.02, 0.01], [0.022, -0.02, 0.296], head, F);
  const tongue = mk(G_SPH, '#ff8fa3', [0.06, 0.028, 0.07], [0, -0.138, 0.232], head, F);
  const ears = [-1, 1].map(s => { const e = grp(head, s * 0.215, 0.1, 0); e.rotation.z = s * 0.15; mk(G_HEAD, D, [0.115, 0.38, 0.2], [s * 0.01, -0.17, 0], e); mk(G_HEAD, T, [0.125, 0.13, 0.185], [s * 0.015, -0.32, 0], e); return e; });
  const tail = grp(body, 0, 0.42, -0.28); tail.rotation.x = -0.75;
  [[A, 0.13, 0.02, 0], [L, 0.15, 0.1, 0.01], [C, 0.11, 0.17, 0.03]].forEach(([c, r, y, z]) => mk(G_HEAD, c, [r, r, r], [0, y, z], tail));
  head.name = 'head'; ears[0].name = 'earL'; ears[1].name = 'earR'; tail.name = 'tail'; legs.forEach((l, i) => l.name = 'leg' + i); tongue.name = 'tongue';
  return g;
}
// Luca is built once, merged down to a handful of draw calls, then cloned (clones share geometry)
let LUCA_T = null;
const FUR_RAMP = (() => { const d = new Uint8Array([178, 204, 226, 242, 255]); const t = new THREE.DataTexture(d, 5, 1, THREE.LuminanceFormat); t.minFilter = t.magFilter = THREE.LinearFilter; t.generateMipmaps = false; t.needsUpdate = true; return t; })();
function makeLuca() {
  if (!LUCA_T) {
    LUCA_T = buildLuca(); mergeStatic(LUCA_T, new Set([LUCA_T.getObjectByName('tongue')]), false);
    // fur gets a soft, bright light ramp so the coat reads as one fluffy shape
    const soft = {};
    LUCA_T.traverse(o => { if (o.isMesh) o.receiveShadow = false; if (o.isMesh && o.material.isMeshToonMaterial) { const m = o.material, k = (m.vertexColors ? 'vc' : m.color.getHexString()) + m.opacity; o.material = soft[k] || (soft[k] = new THREE.MeshToonMaterial({ color: m.vertexColors ? '#ffffff' : m.color, vertexColors: m.vertexColors, gradientMap: FUR_RAMP, transparent: m.transparent, opacity: m.opacity })); } });
  }
  const g = LUCA_T.clone(), f = n => g.getObjectByName(n);
  g.userData = { kind: 'dog', body: f('body'), head: f('head'), ears: [f('earL'), f('earR')], tail: f('tail'), legs: [0, 1, 2, 3].map(i => f('leg' + i)), tongue: f('tongue'), walk: 0 };
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
/* ---------------- little lived-in details: lollies, coffee, a rap poster ---------------- */
const LOLLY_COLS = ['#ff5c7a', '#ffd166', '#7fc8f8', '#7cc576', '#b9a3ff', '#ffa94d'];
// a wrapped lolly: a round sweet with twisted wrapper ends
function makeLolly(parent, x, y, z, col, rot) {
  const g = grp(parent, x, y, z); g.rotation.y = rot || 0;
  mk(G_SPH, col, [0.1, 0.08, 0.1], [0, 0.04, 0], g, { noShadow: true });
  [-1, 1].forEach(s => { const e = mk(G_CONE, col, [0.07, 0.07, 0.05], [s * 0.08, 0.04, 0], g, { noShadow: true }); e.rotation.z = s * Math.PI / 2; });
  return g;
}
// a jelly snake, curled in an S
function makeSnake(parent, x, y, z, col, rot) {
  const g = grp(parent, x, y, z); g.rotation.y = rot || 0;
  for (let i = 0; i < 6; i++) mk(G_SPH, i === 5 ? col : [col, '#fff4e0'][i % 2 && i > 3 ? 1 : 0], [0.07, 0.05, 0.07], [i * 0.05, 0.03, Math.sin(i * 1.3) * 0.05], g, { noShadow: true });
  return g;
}
function makeMug(parent, x, y, z, col, coffee) {
  const g = grp(parent, x, y, z);
  mk(G_CYL, col || '#fffaf0', [0.1, 0.11, 0.1], [0, 0.055, 0], g); mk(G_CYL, coffee || '#7a4a2a', [0.085, 0.01, 0.085], [0, 0.108, 0], g, { noShadow: true });
  const h = mk(geo('ring', () => new THREE.TorusGeometry(0.5, 0.12, 6, 16)), col || '#fffaf0', [0.06, 0.06, 0.06], [0.06, 0.06, 0], g, { noShadow: true }); h.rotation.y = Math.PI / 2;
  return g;
}
function makeLollyJar(parent, x, y, z) {
  const g = grp(parent, x, y, z);
  for (let i = 0; i < 14; i++) mk(G_SPH, LOLLY_COLS[i % 6], [0.07, 0.07, 0.07], [Math.cos(i * 2.1) * 0.06, 0.05 + Math.floor(i / 4) * 0.055, Math.sin(i * 2.1) * 0.06], g, { noShadow: true });
  mk(G_CYL, '#e8f7ff', [0.26, 0.3, 0.26], [0, 0.15, 0], g, { alpha: 0.35, noShadow: true });
  mk(G_CYL, '#ff7aa8', [0.2, 0.06, 0.2], [0, 0.32, 0], g); mk(G_SPH, '#ffd1e1', [0.08, 0.05, 0.08], [0, 0.36, 0], g);
  return g;
}
// an original rap poster: gold mic, crown, stars and title bars (no real artwork)
function makeRapPoster(w) {
  const g = new THREE.Group(), pw = Math.min(1.5, w * 0.8);
  mk(G_BOX, '#fffaf0', [pw + 0.08, 1.08, 0.05], [0, 0.85, 0.01], g);
  mk(G_BOX, '#2b2d42', [pw, 1.0, 0.06], [0, 0.85, 0.02], g);
  mk(G_BOX, '#ff5c7a', [pw, 0.12, 0.065], [0, 1.24, 0.02], g, { noShadow: true });
  const mic = grp(g, -pw * 0.2, 0.78, 0.07); mk(G_SPH, '#ffd166', [0.18, 0.2, 0.08], [0, 0.14, 0], mic, { glow: true }); mk(G_BOX, '#ffd166', [0.06, 0.26, 0.04], [0, -0.06, 0], mic, { glow: true }); mk(G_BOX, '#c9a24a', [0.2, 0.03, 0.04], [0, -0.2, 0], mic);
  const cr = grp(g, pw * 0.2, 0.98, 0.07); mk(G_BOX, '#ffd166', [0.3, 0.07, 0.03], [0, 0, 0], cr, { glow: true }); [-0.1, 0, 0.1].forEach(x => mk(G_CONE, '#ffd166', [0.07, 0.12, 0.03], [x, 0.09, 0], cr, { glow: true }));
  [[0.2, 0.72, 0.36, '#fffaf0'], [0.2, 0.62, 0.28, '#7fc8f8'], [0.2, 0.52, 0.32, '#fffaf0']].forEach(([x, y, l, c]) => mk(G_BOX, c, [l, 0.05, 0.02], [pw * x + 0.02, y, 0.07], g, { noShadow: true }));
  [[-0.5, 1.08], [0.45, 0.45], [-0.42, 0.45]].forEach(([x, y]) => mk(G_STAR, '#fff4b0', [0.1, 0.1, 0.1], [x * pw, y, 0.07], g, { noShadow: true, glow: true }));
  return g;
}
WALL_BUILDERS['bedroom:R'] = makeRapPoster;
WALL_BUILDERS['home:R'] = makeRapPoster;
// bedroom coffee station: a little cart with a pod machine, pods and mugs
OBJ_BUILDERS['bedroom:C'] = () => {
  const g = new THREE.Group();
  mk(G_BOX, '#ffe3ec', [0.8, 0.62, 0.55], [0, 0.31, 0], g); mk(G_BOX, '#fffaf0', [0.86, 0.05, 0.6], [0, 0.64, 0], g);
  mk(G_BOX, '#3a3148', [0.28, 0.36, 0.3], [-0.16, 0.84, -0.05], g); mk(G_BOX, '#ff9fb8', [0.2, 0.05, 0.02], [-0.16, 0.9, 0.11], g, { glow: true }); mk(G_CYL, '#c7ccd6', [0.05, 0.06, 0.05], [-0.16, 0.72, 0.07], g, { noShadow: true });
  for (let i = 0; i < 6; i++) mk(G_CYL, LOLLY_COLS[i], [0.06, 0.04, 0.06], [0.1 + (i % 3) * 0.08, 0.68, -0.1 + Math.floor(i / 3) * 0.08], g, { noShadow: true });
  makeMug(g, 0.25, 0.665, 0.14, '#ffd1e1'); makeMug(g, -0.16, 0.665, 0.12, '#fffaf0');
  return g;
};
OBJ_BUILDERS['bedroom:j'] = () => { const g = new THREE.Group(); mk(G_CYL, '#fff0f6', [0.55, 0.5, 0.55], [0, 0.25, 0], g); mk(G_CYL, '#ffd1e1', [0.6, 0.05, 0.6], [0, 0.52, 0], g); makeLollyJar(g, -0.08, 0.545, 0); makeMug(g, 0.17, 0.545, 0.1, '#b9a3ff'); return g; };
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
  // whimsy: toadstools on the cake layers, flowering vines, glowing crystals and a little waterfall off the front
  const n = Math.max(4, Math.floor(w / 2.4));
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + 0.7 + (i + hsh(i, 21) * 0.6) * (w - 1.4) / n, z = d / 2 + 0.1, s = 0.7 + hsh(i, 22) * 0.6;
    if (i % 3 === 1) { mk(G_CYL, '#fff4e8', [0.09 * s, 0.2 * s, 0.09 * s], [x, -0.62, z + 0.12], g, { noShadow: true }); mk(G_SPH, i % 2 ? '#ff7aa8' : '#ff9f6b', [0.3 * s, 0.2 * s, 0.3 * s], [x, -0.5, z + 0.12], g, { noShadow: true }); [[-0.07, 0.05], [0.06, 0.06], [0, 0.09]].forEach(([a, b]) => mk(G_SPH, '#ffffff', [0.06 * s, 0.03 * s, 0.06 * s], [x + a * s, -0.5 + b * s, z + 0.16 + Math.abs(a)], g, { noShadow: true })); }
    else { const len = 0.5 + hsh(i, 23) * 0.9; mk(G_CYL, '#6fbf73', [0.035, len, 0.035], [x, -0.45 - len / 2, z + 0.08], g, { noShadow: true }); for (let k = 0; k < 3; k++) mk(G_SPH, k === 2 ? CONFETTI[i % 4] : '#8fd08a', [0.11, 0.08, 0.06], [x + (k % 2 ? 0.07 : -0.07), -0.55 - k * len / 3.2, z + 0.1], g, { noShadow: true }); }
  }
  for (let i = 0; i < 5; i++) { const c = mk(G_CONE, ['#cdb8ff', '#a9d8ff', '#ffc2d6'][i % 3], [0.28, 0.6 + hsh(i, 24) * 0.5, 0.28], [(hsh(i, 25) - 0.5) * (w - 1), -1.35 - hsh(i, 26) * 0.4, d / 2 - 0.4 - hsh(i, 27) * 1.2], g, { glow: true, alpha: 0.85 }); c.rotation.x = Math.PI; }
  const fx = w / 2 - 1.6 - hsh(Math.round(w), 28) * 1.5;
  mk(G_BOX, '#bfe9ff', [0.6, 2.6, 0.06], [fx, -1.55, d / 2 + 0.2], g, { glow: true, alpha: 0.6 }); mk(G_BOX, '#ffffff', [0.16, 2.6, 0.07], [fx - 0.12, -1.55, d / 2 + 0.2], g, { glow: true, alpha: 0.6 });
  mk(G_SPH, '#9fdcf5', [0.8, 0.14, 0.4], [fx, -0.22, d / 2 + 0.08], g, { noShadow: true });
  [[-0.2, 0.3], [0.15, 0.36], [0, 0.26], [0.3, 0.24], [-0.32, 0.22]].forEach(([a, r]) => mk(G_SPH, '#ffffff', [r, r, r], [fx + a, -2.9, d / 2 + 0.2], g, { glow: true, alpha: 0.85 }));
  return mergeStatic(g);
}
