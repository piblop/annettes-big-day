/* =========================================================
   SIDE QUESTS: a morning lap around the block with Luca (Edmondson St, North Ryde),
   the office cake caper and a message in a bottle at the beach.
   The block is a stylised toy version of the real streets: Edmondson St meets Ryrie St
   at the corner, Blenheim Rd has the shops and Blenheim Park (with its dog park) is a short walk.
   ========================================================= */
CONFIG.block = {
  street: "Edmondson St", cross: "Ryrie St", shops: "Blenheim Rd", park: "Blenheim Park", cat: "Biscuit", catOwner: "Dot",
  // what Luca files in his sniff report, one per paw print
  sniffs: [
    "Luca's report: the lamp post. Seven dogs, one very confident cat. Fascinating.",
    "Luca's report: the bins. He needs a moment. This is his art gallery.",
    "Luca's report: one dropped chip. Gone before the paperwork could be filed.",
    "Luca's report: coffee grounds from the cart. Three stars. Would sniff again.",
    "Luca's report: the park gate. Smells like every good dog in North Ryde."
  ],
  // the whodunnit: who got into the office birthday cake? (culprit is the index into suspects)
  suspects: ["Dev", "Marco", "Sam", "Jo"], culprit: 2,
  bottleNote: ["If you're reading this, you're at the beach instead of answering my texts.", "Dinner at seven. Wear the blue dress. Don't be late.", "PS: look up."]
};
const BK = CONFIG.block;
Object.assign(QUESTS, {
  block:   { n: 'Around the block', how: 'Walk a full lap: all four corners', where: "Bedroom: Luca's lead by the door" },
  sniff:   { n: 'The sniff report', how: 'Let Luca sniff all five paw prints', where: 'On the block' },
  parcel:  { n: 'Special delivery', how: 'Get the parcel to the house with the lemon tree', where: 'On the block' },
  biscuit: { n: BK.cat + ' the cat', how: 'Coax ' + BK.cat + ' out of the jacaranda', where: 'On the block' },
  magpie:  { n: 'Swooping season', how: 'Face the magpie of ' + BK.cross, where: 'On the block' },
  caper:   { n: 'The cake caper', how: 'Ask around, then name the cake thief at the cake table', where: 'Office: the cake table' },
  bottle:  { n: 'Message in a bottle', how: 'Follow the glints along the wet sand', where: 'Beach: something glints by the water' }
});
const BLOCK_QUESTS = ['block', 'sniff', 'parcel', 'biscuit', 'magpie'];
BADGES.neighbour = { n: 'Good neighbour badge', how: 'Finish every quest around the block', quests: BLOCK_QUESTS };
BADGES.sleuth = { n: 'Sleuth badge', how: 'Crack the cake caper on the first guess' };
BADGES.hero = { n: 'Side quest badge', how: 'Finish all ' + Object.keys(QUESTS).length + ' side quests', quests: Object.keys(QUESTS) };
ICONS.push([/walk the block/i, '🐾', 'walk'], [/pspsps/i, '🐈', 'cat'], [/treat bag/i, '🦴', 'cat'], [/send luca/i, '🐶', 'cat'], [/back inside/i, '🏡', 'walk']);
Object.assign(MOMENT_LINES, { walk: 'Leads on!', cat: 'Here, kitty' });
Object.assign(MOMENT_PROPS, { walk: ['🌸', '🌸', '✨'], cat: ['❓'] });
SCENE_TIME.block = 7 * 60 + 50;
NPC_CHARS.block = 'ng';
Object.assign(WHO_COL, { [BK.catOwner]: '#a78bfa', Neighbour: '#3fae7c', Dev: '#7f93b3', Marco: '#7f93b3', Sam: '#c55a6c', Jo: '#7f93b3' });

/* ---------------- art: jacarandas, signs with real lettering, a cat, a magpie ---------------- */
function makeJacaranda(parent, x, z, s) {
  const g = grp(parent, x, 0, z); s = s || 1;
  mk(G_CYL, '#8a6a55', [0.17 * s, 1.1 * s, 0.17 * s], [0, 0.55 * s, 0], g).rotation.z = -0.06;
  mk(G_CYL, '#7a5c49', [0.09 * s, 0.5 * s, 0.09 * s], [-0.18 * s, 1.05 * s, 0], g).rotation.z = 0.7;
  [[0, 1.5, 0, 1.0], [0.48, 1.32, 0.1, 0.72], [-0.45, 1.36, -0.1, 0.74], [0.1, 1.86, -0.05, 0.62], [-0.12, 1.24, 0.36, 0.52]].forEach(([a, b, c, r], i) => mk(G_SPH, ['#b9a3ff', '#c9b6f2', '#a890f0'][i % 3], [r * s, r * 0.72 * s, r * s], [a * s, b * s, c * s], g));
  for (let i = 0; i < 7; i++) mk(G_CYL, i % 2 ? '#c9b6f2' : '#b9a3ff', [0.13, 0.012, 0.11], [Math.cos(i * 2.4) * (0.5 + hsh(i, 51) * 0.5) * s, 0.008, Math.sin(i * 2.4) * (0.5 + hsh(i, 52) * 0.5) * s], g, { noShadow: true });
  g.userData.sway = Math.random() * TAU; return g;
}
const SIGNS = {}, G_PLANE = geo('plane', () => new THREE.PlaneGeometry(1, 1));
function signMat(text, bg, fg) {
  const key = text + bg; if (SIGNS[key]) return SIGNS[key].mat;
  const c = document.createElement('canvas'); c.width = 320; c.height = 80;
  const tex = new THREE.CanvasTexture(c), mat = new THREE.MeshBasicMaterial({ map: tex });
  const draw = () => { const x = c.getContext('2d'); x.fillStyle = bg; x.fillRect(0, 0, 320, 80); x.strokeStyle = fg; x.lineWidth = 5; x.strokeRect(6, 6, 308, 68); x.fillStyle = fg; x.font = "700 40px Fredoka, 'Trebuchet MS', sans-serif"; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 160, 43, 284); tex.needsUpdate = true; };
  draw(); SIGNS[key] = { mat, draw }; return mat;
}
try { document.fonts.load("700 40px Fredoka").then(() => Object.values(SIGNS).forEach(s => s.draw())); document.fonts.ready.then(() => Object.values(SIGNS).forEach(s => s.draw())); } catch (e) {}
function signPlate(parent, text, bg, fg, w, h, y, rot) {
  const g = grp(parent, 0, y, 0); g.rotation.y = rot || 0;
  mk(G_BOX, bg, [w + 0.04, h + 0.04, 0.04], [0, 0, 0], g);
  [0, Math.PI].forEach(r => { const m = new THREE.Mesh(G_PLANE, signMat(text, bg, fg)); m.scale.set(w, h, 1); m.position.z = r ? -0.025 : 0.025; m.rotation.y = r; g.add(m); });
  return g;
}
function makeCat() {
  const g = new THREE.Group(), body = grp(g), O = '#f4a259', o2 = '#ffe1bd', dk = '#d9833a';
  mk(G_SPH, O, [0.3, 0.27, 0.44], [0, 0.2, 0], body); mk(G_SPH, o2, [0.2, 0.2, 0.2], [0, 0.17, 0.15], body);
  [-0.08, 0.02, 0.12].forEach(z => mk(G_BOX, dk, [0.24, 0.02, 0.05], [0, 0.325, z - 0.06], body, { noShadow: true }));
  [[-0.09, 0.14], [0.09, 0.14], [-0.09, -0.13], [0.09, -0.13]].forEach(([x, z]) => { mk(G_CYL, O, [0.08, 0.12, 0.08], [x, 0.06, z], body); mk(G_SPH, o2, [0.09, 0.05, 0.1], [x, 0.02, z + 0.02], body); });
  const head = grp(body, 0, 0.42, 0.2);
  mk(G_SPH, O, [0.32, 0.28, 0.28], [0, 0, 0], head); mk(G_SPH, o2, [0.17, 0.12, 0.1], [0, -0.05, 0.1], head);
  [-1, 1].forEach(s => {
    const e = mk(G_CONE, O, [0.12, 0.14, 0.07], [s * 0.1, 0.15, 0], head); e.rotation.z = s * -0.25; mk(G_CONE, '#ffb3cc', [0.06, 0.08, 0.03], [s * 0.1, 0.14, 0.025], head, { noShadow: true }).rotation.z = s * -0.25;
    mk(G_SPH, '#8fd06a', [0.07, 0.08, 0.03], [s * 0.075, 0.02, 0.125], head, { noShadow: true }); mk(G_SPH, INK, [0.022, 0.065, 0.02], [s * 0.075, 0.02, 0.138], head, { noShadow: true });
    mk(G_SPH, '#ffffff', [0.02, 0.02, 0.01], [s * 0.075 + 0.015, 0.045, 0.143], head, { noShadow: true, glow: true });
    [-1, 1].forEach(k => { const wk = mk(G_BOX, '#ffffff', [0.14, 0.006, 0.006], [s * 0.13, -0.05 + k * 0.012, 0.12], head, { noShadow: true }); wk.rotation.z = s * k * 0.14; });
  });
  mk(G_SPH, '#ff8fa3', [0.03, 0.022, 0.02], [0, -0.035, 0.15], head, { noShadow: true });
  const tail = grp(body, 0, 0.26, -0.2); mk(G_CYL, O, [0.06, 0.34, 0.06], [0, 0.17, 0], tail); mk(G_SPH, o2, [0.075, 0.09, 0.075], [0, 0.35, 0], tail);
  g.userData = { kind: 'cat', body, head, tail };
  return softSkin(mergeStatic(g));
}
function makeMagpie(foe, pal) {
  pal = pal || {}; const g = new THREE.Group(), outer = grp(g), body = grp(outer), K = pal.body || '#2b2733', Wt = pal.patch || '#ffffff'; body.scale.setScalar(foe ? 2.1 : 1);
  mk(G_SPH, K, [0.34, 0.32, 0.46], [0, 0, 0], body); mk(G_SPH, Wt, [0.26, 0.14, 0.24], [0, 0.11, -0.06], body, { noShadow: true }); mk(G_SPH, Wt, [0.2, 0.1, 0.16], [0, 0.02, -0.19], body, { noShadow: true });
  mk(G_SPH, K, [0.26, 0.24, 0.26], [0, 0.2, 0.2], body);
  const beak = mk(G_CONE, pal.beak || '#cfd6e6', [0.08, 0.22, 0.08], [0, 0.17, 0.4], body); beak.rotation.x = Math.PI / 2; mk(G_SPH, pal.tip || K, [0.05, 0.05, 0.05], [0, 0.17, 0.5], body, { noShadow: true });
  const wings = [-1, 1].map(s => { const w = grp(body, s * 0.15, 0.06, -0.02); mk(G_SPH, K, [0.09, 0.22, 0.42], [s * 0.04, -0.04, -0.02], w); mk(G_SPH, Wt, [0.06, 0.1, 0.2], [s * 0.075, -0.02, 0.02], w, { noShadow: true }); return w; });
  mk(G_BOX, K, [0.14, 0.03, 0.26], [0, -0.03, -0.32], body); [-0.06, 0.06].forEach(x => mk(G_CYL, pal.legs || '#6b6f82', [0.02, 0.14, 0.02], [x, -0.2, 0.02], body, { noShadow: true }));
  if (foe) googly(body, 0, 0.25, 0.31, 0.62);
  else [-1, 1].forEach(s => { mk(G_SPH, '#c2553a', [0.05, 0.05, 0.03], [s * 0.09, 0.23, 0.3], body, { noShadow: true }); mk(G_SPH, Wt, [0.018, 0.018, 0.01], [s * 0.09 + 0.01, 0.245, 0.315], body, { noShadow: true, glow: true }); });
  g.userData = { kind: 'foe', body: outer, wings };
  return softSkin(g);
}
// battles build their foe through makeFoe: teach it the magpie
const makeFoeBase = makeFoe;
makeFoe = function (kind) { return kind === 'magpie' ? makeMagpie(true) : makeFoeBase(kind); };

let HOUSE_N = 0;
// what makes each house on the street its own: in build order (north row west to east, then the south row)
const HOUSE_FEAT = ['surf', 'pots', 'chimes', '', 'roses', 'hoop', ''];
function blockHouse(home) {
  const g = new THREE.Group(), n = home ? -1 : HOUSE_N++, i = home ? 1 : n + 2, feat = HOUSE_FEAT[n], h = makeHouse(g, 0, -0.12, i);
  h.scale.setScalar(1.5);
  if (home) {
    ['#ff7aa8', '#ffd166', '#7fc8f8'].forEach((c, k) => { const b = makeBalloon(g, -0.8 + k * 0.16, 0.2, 0.95, c, 1.1 + k * 0.2); b.userData.bob = true; });
    for (let k = 0; k < 7; k++) { const f = mk(G_CONE, CONFETTI[k % 5], [0.14, 0.2, 0.03], [-0.72 + k * 0.24, 1.12 - Math.sin((k + 0.5) / 7 * Math.PI) * 0.1, 0.66], g, { noShadow: true }); f.rotation.z = Math.PI; }
    mk(G_HEART, '#ff7aa8', [0.3, 0.3, 0.3], [0, 1.02, 0.67], g);
  } else if (feat === 'surf') { const sb = mk(G_SPH, '#7fc8f8', [0.26, 1.1, 0.06], [0.72, 0.56, 0.7], g); sb.rotation.z = 0.12; mk(G_BOX, '#ffffff', [0.03, 0.9, 0.065], [0.72, 0.56, 0.7], g, { noShadow: true }).rotation.z = 0.12; }
  else if (feat === 'pots') [0, 1, 2].forEach(k => { mk(G_CYL, ['#e8916b', '#d97a55'][k % 2], [0.2, 0.2, 0.2], [-0.7 + k * 0.26, 0.1, 1.0], g); mk(G_SPH, '#5fae63', [0.2, 0.18, 0.2], [-0.7 + k * 0.26, 0.26, 1.0], g); });
  else if (feat === 'chimes') { mk(G_BOX, '#c89f7a', [0.3, 0.03, 0.03], [0.6, 1.02, 0.68], g); [0, 1, 2, 3].forEach(k => mk(G_CYL, '#c7ccd6', [0.025, 0.16 + (k % 2) * 0.06, 0.025], [0.5 + k * 0.07, 0.9 - (k % 2) * 0.03, 0.68], g, { noShadow: true })); }
  else if (feat === 'roses') [0, 1, 2, 3].forEach(k => { mk(G_SPH, '#5fae63', [0.3, 0.3, 0.3], [-0.75 + k * 0.5, 0.18, 1.0], g); [[-0.07, 0.1], [0.08, 0.06], [0, 0.14]].forEach(([a, b], q) => mk(G_SPH, (k + q) % 2 ? '#ff7aa8' : '#e2554f', [0.1, 0.1, 0.1], [-0.75 + k * 0.5 + a, 0.24 + b, 1.1], g, { noShadow: true })); });
  else if (feat === 'hoop') { mk(G_CYL, '#8a8fa0', [0.06, 1.5, 0.06], [0.8, 0.75, 0.9], g); mk(G_BOX, '#ffffff', [0.44, 0.32, 0.04], [0.8, 1.5, 0.94], g); mk(geo('ring', () => new THREE.TorusGeometry(0.5, 0.12, 6, 16)), '#ff9f6b', [0.2, 0.2, 0.2], [0.8, 1.38, 1.08], g).rotation.x = Math.PI / 2; mk(G_SPH, '#ff9f6b', [0.2, 0.2, 0.2], [0.5, 0.1, 1.05], g); }
  return g;
}
const BO = OBJ_BUILDERS;
BO['block:H'] = BO['block:N'] = () => blockHouse(); BO['block:O'] = () => blockHouse(true);
BO['block:C'] = () => { const g = new THREE.Group(), c = makeCar(); c.rotation.y = Math.PI / 2; g.add(c); g.userData.car = c; return g; };
BO['block:J'] = () => makeJacaranda(null, 0, 0, 1.25);
BO['block:L'] = () => { const g = new THREE.Group(); mk(G_CYL, '#8a6a55', [0.12, 0.7, 0.12], [0, 0.35, 0], g); [[0, 0.95, 0, 0.75], [0.22, 1.15, 0.05, 0.5], [-0.2, 1.1, -0.05, 0.5]].forEach(([a, b, c, r]) => mk(G_SPH, '#5fae63', [r, r * 0.8, r], [a, b, c], g)); for (let i = 0; i < 7; i++) mk(G_SPH, '#ffe14d', [0.11, 0.13, 0.11], [Math.cos(i * 0.9) * 0.3, 0.8 + (i % 3) * 0.16, Math.sin(i * 0.9) * 0.3 + 0.05], g, { noShadow: true }); mk(G_SPH, '#ffe14d', [0.11, 0.1, 0.13], [0.3, 0.06, 0.3], g); g.userData.sway = 1; return g; };
BO['block:i'] = () => { const g = new THREE.Group(); mk(G_CYL, '#8a6a55', [0.07, 0.6, 0.07], [0, 0.3, 0], g); mk(G_BOX, '#fffaf0', [0.34, 0.24, 0.26], [0, 0.7, 0], g); mk(G_CYL, '#ff9fb2', [0.36, 0.27, 0.26], [0, 0.82, 0], g).rotation.z = Math.PI / 2; mk(G_BOX, '#e2554f', [0.03, 0.16, 0.08], [0.2, 0.8, 0], g); makeFlower(g, 0.28, 0.12, '#ffd166'); makeFlower(g, -0.28, -0.1, '#ff7aa8'); return g; };
BO['block:p'] = () => { const g = new THREE.Group(); mk(G_CYL, '#e2554f', [0.5, 0.95, 0.5], [0, 0.48, 0], g); mk(G_SPH, '#e2554f', [0.5, 0.3, 0.5], [0, 0.95, 0], g); mk(G_BOX, '#3a2f4a', [0.28, 0.05, 0.02], [0, 0.72, 0.25], g, { noShadow: true }); mk(G_BOX, '#ffffff', [0.26, 0.18, 0.02], [0, 0.48, 0.25], g, { noShadow: true }); mk(G_CYL, '#c94a45', [0.56, 0.08, 0.56], [0, 0.05, 0], g); return g; };
BO['block:q'] = () => { const g = new THREE.Group(); mk(G_BOX, '#d9b382', [0.5, 0.34, 0.4], [0, 0.17, 0], g).rotation.y = 0.3; const r = mk(G_BOX, '#ff7aa8', [0.52, 0.06, 0.08], [0, 0.35, 0], g, { noShadow: true }); r.rotation.y = 0.3; const r2 = mk(G_BOX, '#ff7aa8', [0.08, 0.06, 0.42], [0, 0.35, 0], g, { noShadow: true }); r2.rotation.y = 0.3; mk(G_BOX, '#ffffff', [0.2, 0.12, 0.01], [0.06, 0.2, 0.2], g, { noShadow: true }).rotation.y = 0.3; g.userData.keep = true; return g; };
BO['block:r'] = () => { const g = new THREE.Group(); ['#e2554f', '#ffd166', '#5fae63'].forEach((c, i) => { const b = grp(g, -0.3 + i * 0.3, 0, (i % 2) * 0.06); b.rotation.y = (i - 1) * 0.15; mk(G_BOX, '#4a6a52', [0.26, 0.5, 0.3], [0, 0.27, 0], b); mk(G_BOX, c, [0.3, 0.06, 0.34], [0, 0.55, 0], b); mk(G_CYL, '#3a3148', [0.1, 0.04, 0.1], [0.11, 0.05, -0.14], b).rotation.z = Math.PI / 2; }); return g; };
BO['block:u'] = () => { const g = new THREE.Group(); [[-0.25, 0.1, 0], [0.05, -0.05, 0.5], [0.3, 0.12, Math.PI]].forEach(([x, z, r], i) => { const n = grp(g, x, 0, z); n.rotation.y = r; mk(G_CYL, ['#7fc8f8', '#7cc576', '#ffd166'][i], [0.16, 0.2, 0.16], [0, 0.1, 0], n); mk(G_SPH, '#f9d1b0', [0.15, 0.14, 0.14], [0, 0.26, 0], n); mk(G_SPH, '#ffffff', [0.13, 0.12, 0.06], [0, 0.2, 0.06], n, { noShadow: true }); mk(G_CONE, '#e2554f', [0.17, 0.24, 0.17], [0, 0.43, 0], n); }); mk(G_SPH, '#ff7aa8', [0.2, 0.14, 0.2], [-0.02, 0.07, -0.3], g); mk(G_CYL, '#fff4e8', [0.06, 0.14, 0.06], [-0.02, 0.0, -0.3], g); return g; };
BO['block:K'] = () => {
  const g = new THREE.Group(), c = grp(g, 0, 0, 0.1); c.rotation.y = Math.PI;
  mk(G_BOX, '#2f5d4a', [0.9, 0.7, 0.5], [0, 0.45, 0], c); mk(G_BOX, '#fffaf0', [1.0, 0.06, 0.6], [0, 0.82, 0], c);
  [-0.3, 0.3].forEach(x => { mk(G_CYL, '#3a3148', [0.22, 0.06, 0.22], [x, 0.11, 0.26], c).rotation.x = Math.PI / 2; mk(G_CYL, '#c7ccd6', [0.03, 0.45, 0.03], [x * 1.3, 1.05, -0.1], c, { noShadow: true }); });
  for (let i = 0; i < 4; i++) mk(G_BOX, i % 2 ? '#fffaf0' : '#ff9fb2', [0.26, 0.04, 0.5], [-0.39 + i * 0.26, 1.27, 0.08], c).rotation.x = 0.3;
  makeMug(c, 0.2, 0.85, 0.05, '#fffaf0', '#c8955e'); makeMug(c, -0.15, 0.85, 0.1, '#ffd1e1', '#c8955e'); mk(G_BOX, '#c7ccd6', [0.3, 0.26, 0.24], [-0.02, 0.98, -0.12], c);
  return g;
};
BO['block:G'] = () => { const g = new THREE.Group(); [-0.42, 0.42].forEach(s => { mk(G_CYL, '#8a6a55', [0.12, 1.5, 0.12], [0, 0.75, s], g); mk(G_SPH, '#7cc576', [0.24, 0.24, 0.24], [0, 1.55, s], g); }); for (let i = 0; i < 4; i++) mk(G_BOX, '#fffaf0', [0.05, 0.6, 0.12], [0, 0.34, -0.27 + i * 0.18], g); mk(G_BOX, '#f1e4d2', [0.04, 0.05, 0.8], [0, 0.5, 0], g, { noShadow: true }); signPlate(g, BK.park, '#3fae7c', '#ffffff', 0.86, 0.24, 1.38, -Math.PI / 2); g.userData.keep = true; return g; };
BO['block:w'] = () => { const g = new THREE.Group(), b = grp(g); b.rotation.y = -Math.PI / 2; for (let i = 0; i < 3; i++) mk(G_BOX, '#b07a4a', [0.86, 0.05, 0.12], [0, 0.42, -0.12 + i * 0.13], b); mk(G_BOX, '#b07a4a', [0.86, 0.34, 0.05], [0, 0.66, -0.2], b); [-0.36, 0.36].forEach(x => mk(G_BOX, '#8a5a3b', [0.07, 0.42, 0.36], [x, 0.21, 0], b)); return g; };
const streetSign = (a, b, extra) => () => { const g = new THREE.Group(); mk(G_CYL, '#8a8fa0', [0.07, 1.75, 0.07], [0, 0.875, 0], g); mk(G_SPH, '#c7ccd6', [0.12, 0.12, 0.12], [0, 1.78, 0], g); signPlate(g, a, '#3f7fbf', '#ffffff', 1.1, 0.26, 1.56, 0); if (b) signPlate(g, b, '#3f7fbf', '#ffffff', 0.9, 0.26, 1.26, Math.PI / 2); if (extra) extra(g); g.userData.keep = true; return g; };
BO['block:e'] = streetSign(BK.street, BK.cross);
BO['block:b'] = streetSign(BK.shops);
BO['block:m'] = () => { const g = new THREE.Group(); mk(G_CYL, '#8a8fa0', [0.07, 1.5, 0.07], [0, 0.75, 0], g); const d = mk(G_BOX, '#ffd166', [0.62, 0.62, 0.05], [0, 1.3, 0], g); d.rotation.z = Math.PI / 4; signPlate(g, 'SWOOPING', '#ffd166', '#3a2f4a', 0.6, 0.16, 1.3, 0); g.userData.keep = true; return g; };
OBJ_BUILDERS['bedroom:l'] = () => { const g = new THREE.Group(); mk(G_CYL, '#c89f7a', [0.4, 0.05, 0.4], [0, 0.025, 0], g); mk(G_CYL, '#c89f7a', [0.07, 1.2, 0.07], [0, 0.6, 0], g); mk(G_SPH, '#ffd166', [0.12, 0.12, 0.12], [0, 1.22, 0], g); [-1, 1].forEach(s => mk(G_BOX, '#c89f7a', [0.2, 0.04, 0.04], [s * 0.1, 1.05, 0], g).rotation.z = s * 0.5); const lead = mk(geo('ring', () => new THREE.TorusGeometry(0.5, 0.12, 6, 16)), '#ff7aa8', [0.22, 0.42, 0.22], [0.2, 0.86, 0.02], g); lead.rotation.y = 0.5; mk(G_BOX, '#c7ccd6', [0.04, 0.1, 0.04], [0.2, 0.62, 0.02], g); const b = makeTennisBall(g); b.position.set(-0.16, 0.13, 0.14); return g; };
OBJ_BUILDERS['office:K'] = () => {
  const g = new THREE.Group();
  mk(G_BOX, '#fff4e8', [0.9, 0.07, 0.8], [0, 0.6, 0], g); [-1, 1].forEach(s => mk(G_BOX, '#c9b49a', [0.07, 0.6, 0.7], [s * 0.38, 0.3, 0], g));
  mk(G_CYL, '#ffffff', [0.62, 0.04, 0.62], [0, 0.66, 0], g);
  const slice = geo('cakecut', () => new THREE.CylinderGeometry(0.5, 0.5, 1, 20, 1, false, 0.5, TAU - 0.9));
  mk(slice, '#f7a8c4', [0.5, 0.22, 0.5], [0, 0.79, 0], g); mk(slice, '#fff0f6', [0.52, 0.04, 0.52], [0, 0.91, 0], g);
  [0.5, -0.4].forEach(th => { const f = mk(G_BOX, '#ffe9b8', [0.25, 0.22, 0.012], [Math.sin(th) * 0.125, 0.79, Math.cos(th) * 0.125], g, { noShadow: true }); f.rotation.y = th - Math.PI / 2; });
  for (let i = 0; i < 5; i++) mk(G_SPH, CONFETTI[i % 5], [0.05, 0.05, 0.05], [Math.cos(1.8 + i * 0.9) * 0.18, 0.95, Math.sin(1.8 + i * 0.9) * 0.18], g, { noShadow: true });
  [[0.34, 0.1], [0.4, 0.22], [0.3, 0.3], [0.42, 0.02]].forEach(([x, z]) => mk(G_SPH, '#f7a8c4', [0.04, 0.02, 0.04], [x, 0.65, z], g, { noShadow: true }));
  mk(G_BOX, '#c7ccd6', [0.03, 0.01, 0.3], [-0.36, 0.645, 0.2], g, { noShadow: true });
  return g;
};

/* ---------------- the block ---------------- */
const BLOCK_CORNERS = [[2, 3], [18, 3], [18, 12], [2, 12]];
const SNIFF_SPOTS = [[6, 12], [11, 12], [18, 9], [12, 3], [2, 6]];
MAPS.block = {
  theme: 'block', title: 'Around the block', sky: 'morning', outdoor: true, edge: '#a6dc8f', ambient: 'cicada',
  floor: ['#fff1dc', '#ffe8cc'], wet: '#cfc6dd', wall: ['#fff', '#fff'],
  tint: (ch, x, z) => ch === '_' || ch === '.' || ch === 'h' || ch === 'D' ? null : ['#a6dc8f', '#9bd483'][(x + z) % 2],
  rows: [
    "#_##NN##NN##NN#NN##_#",
    "#_##NN##NN##NN#NN##_#",
    "#_#b#i#L#iK#i#n#im#_#",
    "#_..............h.._#",
    "#_.###############._#",
    "#_.###############._#",
    "#_.G#############J._#",
    "#_h##############g._#",
    "#_.w##############._#",
    "#_.#HH##OO##HH#HH#._#",
    "#_.#HH##OO##HH#HH#._#",
    "#_.pqi##Dir#i#u#ie._#",
    "#_...........h....._#",
    "#_________CC________#",
    "#####################"
  ],
  start: { x: 8, z: 12, dir: 'down' }, luca: { x: 9, z: 12 },
  npcs: c => c === 'n' ? { skin: '#cf9b6f', hair: '#3a2f2a', top: '#3fae7c', bottom: '#d9c7a8', glasses: true } : c === 'g' ? { skin: '#f5cfae', hair: '#d8d3dc', hairStyle: 'bun', top: '#c9b6f2', bottom: '#8a7fa0', glasses: true } : null,
  hints: () => [!questState('parcel') && 'q', questState('biscuit') !== 2 && 'J', blockAllDone() && 'D'],
  decorate(g) {
    HOUSE_N = 0;
    // back gardens: a Hills hoist, a paddling pool, veggie beds and shade trees
    const hoist = grp(g, 7, 0, 6.3); mk(G_CYL, '#c7ccd6', [0.06, 1.4, 0.06], [0, 0.7, 0], hoist);
    for (let i = 0; i < 4; i++) { const a = grp(hoist, 0, 1.38, 0); a.rotation.y = i * Math.PI / 2 + 0.4; mk(G_BOX, '#c7ccd6', [0.03, 0.03, 0.9], [0, 0, 0.45], a); mk(G_BOX, CONFETTI[i], [0.02, 0.3, 0.26], [0, -0.17, 0.5 + (i % 2) * 0.2], a); mk(G_BOX, '#ffffff', [0.02, 0.24, 0.2], [0, -0.14, 0.25], a); }
    mk(G_CYL, '#7fc8f8', [1.3, 0.16, 1.3], [11, 0.08, 6], g); mk(G_CYL, '#bfe9ff', [1.1, 0.17, 1.1], [11, 0.085, 6], g, { noShadow: true }); mk(G_SPH, '#ffd166', [0.3, 0.24, 0.3], [11.2, 0.25, 5.9], g); mk(G_SPH, '#ff9f6b', [0.1, 0.06, 0.12], [11.2, 0.3, 6.08], g, { noShadow: true });
    for (let i = 0; i < 2; i++) { mk(G_BOX, '#b07a4a', [1.2, 0.18, 0.6], [14.6, 0.09, 5.4 + i * 0.9], g); for (let k = 0; k < 4; k++) mk(G_SPH, k % 2 ? '#5fae63' : '#e2554f', [0.2, 0.2, 0.2], [14.2 + k * 0.28, 0.24, 5.4 + i * 0.9], g, { noShadow: true }); }
    makeTree(g, 5, 7, 0.8); makeJacaranda(g, 9, 7.2, 0.7); makeGum(g, 13, 7.4, 0.65); makeTree(g, 15.6, 7.2, 0.75, '#ffb3cc'); makeTree(g, 5, 5, 0.6, '#ffb3cc');
    for (let i = 0; i < 14; i++) makeFlower(g, 4.2 + hsh(i, 81) * 12, 4.4 + hsh(i, 82) * 3.4, CONFETTI[i % 5]).scale.setScalar(0.8);
    // the verge: jacarandas, gums and street lamps around the outside
    [[0, 14], [20, 14], [0, 7.5], [20, 10], [0, 3], [20, 4.5], [2.2, 0.6], [17.8, 0.4]].forEach(([x, z], i) => (i % 3 === 2 ? makeGum : makeJacaranda)(g, x, z, 0.95 + hsh(i, 61) * 0.25));
    makeStreetLamp(g, 6, 11); makeStreetLamp(g, 13.3, 2.2); makeStreetLamp(g, 20, 7); makeStreetLamp(g, 0, 10.5);
    // road paint: centre dashes and a zebra crossing to the house
    for (let x = 2; x <= 18; x += 2) if (x !== 10 && x !== 8) mk(G_BOX, '#ffffff', [0.5, 0.012, 0.07], [x, 0.006, 13], g, { noShadow: true });
    for (let z = 0; z <= 12; z += 2) [1, 19].forEach(x => mk(G_BOX, '#ffffff', [0.07, 0.012, 0.5], [x, 0.006, z], g, { noShadow: true }));
    for (let i = 0; i < 4; i++) mk(G_BOX, '#ffffff', [0.16, 0.012, 0.8], [7.64 + i * 0.24, 0.006, 13], g, { noShadow: true });
    for (let i = 0; i < 26; i++) { const t = hsh(i, 71); mk(G_CYL, i % 2 ? '#c9b6f2' : '#b9a3ff', [0.1, 0.01, 0.08], i % 3 ? [17.6 + hsh(i, 72) * 1.6, 0.007, 4.5 + t * 4.5] : [2 + t * 16, 0.007, 11.7 + hsh(i, 73) * 1.5], g, { noShadow: true }); }
    makeFairyLights(g, 7, 11.4, 10, 11.4, 1.75, 10);
    // the neighbour's watering can
    const n = W.npcs.find(n => n.ch === 'n'); if (n) { const can = grp(n.g, 0.26, 0.3, 0.14); mk(G_CYL, '#7fc8f8', [0.14, 0.14, 0.14], [0, 0, 0], can); mk(G_CYL, '#7fc8f8', [0.03, 0.2, 0.03], [0, 0.03, 0.14], can).rotation.x = 1.0; }
    // quest pieces
    const B = W.blk = { spots: [], sniff: null, t: 0 };
    SNIFF_SPOTS.forEach(([x, z], i) => { if (F['sn' + i]) return; const m = grp(world, x, 0.1, z); mk(G_SPH, '#ffd166', [0.3, 0.03, 0.26], [0, 0, 0.06], m, { glow: true }); [-0.15, -0.05, 0.05, 0.15].forEach((a, k) => mk(G_SPH, '#ffd166', [0.1, 0.03, 0.12], [a, 0, -0.14 + Math.abs(k - 1.5) * -0.03 + 0.03], m, { glow: true })); B.spots.push({ i, x, z, m }); });
    const tree = W.objs.find(o => o.ch === 'J'), cat = makeCat(); B.cat = cat; B.catHome = [tree.x - 0.05, 1.42, tree.z + 0.45]; B.catDown = [tree.x + 0.55, 0, tree.z + 1.3];
    cat.position.set(...(questState('biscuit') === 2 ? B.catDown : B.catHome)); cat.rotation.y = 0.5; world.add(cat);
    const sign = W.objs.find(o => o.ch === 'm'), mag = makeMagpie(false); B.mag = mag; mag.position.set(sign.x, 1.95, sign.z); mag.rotation.y = Math.PI / 2; world.add(mag);
    wkTicker(updateBlock);
  },
  onEnter() {
    if (!F.blockSeen) { F.blockSeen = true; stat('happy', 5, true);
      say([BK.street + ", North Ryde. Jacarandas out, sprinklers on, magpies plotting.", "Luca hits the footpath like he has been waiting all year.", F.outfit ? { n: CONFIG.name, t: "Quick lap, then the big day." } : { n: CONFIG.name, t: "Pyjamas in public. It's my birthday, I do what I want." }, "Walk a lap of the block and poke around. The neighbours always have something going on.", "Q and E (or the arrows up top) spin the street around."]);
    } else say("Back on " + BK.street + ". Luca picks up exactly where he left off.");
  },
  onStep: (x, z) => blockStep(x, z),
  doorOpen: () => true,
  onDoor() {
    G.mode = 'busy';
    const left = BLOCK_QUESTS.filter(q => questState(q) !== 2).length;
    const home = () => { F.walked = true; G.mode = 'busy'; say([left ? "Home again. The rest of the block can wait for another lap." : "Every corner sniffed, every neighbour sorted. What a lap.", { n: CONFIG.name, t: CONFIG.catchphrase }], () => fade(() => loadMap('bedroom'))); };
    pickMenu('The front gate', left ? left + ' block quest' + (left > 1 ? 's' : '') + ' still out there.' : 'The whole block, done and dusted.', [
      { n: 'Back inside', d: 'On with the birthday', k: 'in' }, { n: 'Keep walking', d: 'Luca votes for this one', k: 'stay', quick: true }
    ], d => { if (d.k === 'in') home(); else tryStep(0, 1); }, false);
  },
  act: {
    O: () => say(["Home. Mum has tied balloons to the letterbox.", "Luca would like it noted that he lives here."]),
    H: () => say("A neat brick house with a very proud front garden."),
    N: () => say("A weatherboard house. Someone is practising piano inside. Badly, but with feeling."),
    C: () => say([CONFIG.car + " the Corolla, parked out the front and gleaming.", "Later, old girl. Big day ahead."]),
    e: () => say(["The corner of " + BK.street + " and " + BK.cross + ".", "Home turf."]),
    b: () => say([BK.shops + ". The shops and the good coffee are just up there.", "Luca knows the word 'cafe'. It is a problem."]),
    m: () => say(questState('magpie') === 2 ? ["The swooping sign. The magpie sits on top of it now, looking smug but peaceful.", "Someone has drawn a tiny crown on the bird."] : ["A bright yellow sign: SWOOPING BIRD.", "Someone has drawn a tiny crown on the bird. Ominous."]),
    G: () => say(["The path to " + BK.park + ". The dog park is that way.", "Luca pulls hard. Not today, mate. Big day."]),
    w: () => { const first = !F.blockBench; F.blockBench = true; if (first) stat('energy', 4, true); say(["A bench under the jacaranda. Purple petals all over the seat.", first ? "Thirty seconds of sitting. Luca allows it." : "Still a very good bench."]); },
    p: () => say(["The red postbox on the corner.", "Luca has strong opinions about the postie."]),
    r: () => say(["Bin night. Red, yellow and green, lined up like a little parade.", "One lid is open. Luca investigates. Luca regrets nothing."]),
    u: () => say(["A garden gnome army.", "One has been turned to face the wall. Nobody on the street will say why."]),
    L: () => say(["A lemon tree, absolutely heaving.", "There is a bucket of free lemons by the gate. Very North Ryde."]),
    K: () => { const first = !F.blockCoffee; F.blockCoffee = true; if (first) { stat('energy', 8); if (W.luca) W.luca.g.userData.spin = 1; } say(first ? ["The coffee cart on the " + BK.shops + " corner.", "One flat white, and a puppuccino for the gentleman.", "Luca wears most of his."] : "The barista waves. Luca stares at the puppuccino cups."); },
    n: () => say([{ n: 'Neighbour', t: "Morning! Happy birthday! The street chat is feral today. Someone put a greasy pizza box in the yellow bin." }, { n: 'Neighbour', t: "Also, " + CONFIG.boyfriend + " was out here at six, sneaking around with a parcel. I've said too much." }, { n: CONFIG.name, t: "A parcel?" }]),
    g: () => talkDot(),
    J: () => catTree(),
    q: (x, z, o) => pickParcel(o),
    i: (x, z) => letterbox(x, z)
  }
};
HEARTS_TOTAL += MAPS.block.rows.join('').split('h').length - 1;
const blockAllDone = () => BLOCK_QUESTS.every(q => questState(q) === 2);

// the bedroom end: the lead on its stand, and coming home again
const BED_ROWS = MAPS.bedroom.rows.slice();
(() => {
  const bed = MAPS.bedroom, enter = bed.onEnter, hints = bed.hints;
  bed.onEnter = function () { if (!F.walked) return enter.call(this); G.clock = 8 * 60 + 15; if (!F.outfit) G.wearing = 'pj'; say(["Back home. Luca flops onto the rug, extremely pleased with himself.", { n: 'Mum', t: "Good walk? You two were gone long enough to meet the whole street." }]); };
  bed.hints = () => hints().concat([!F.walked && !questState('block') && 'l']);
  bed.act.l = () => {
    if (F.walked && blockAllDone()) return say("Luca's lead, back on its stand. He keeps looking at it anyway.");
    pickMenu("Luca's lead", F.walked ? 'Another lap? There is unfinished business out there.' : 'A quick lap of the block before the big day?', [{ n: 'Walk the block', d: BK.street + ', with Luca', k: 'go' }, { n: 'Not yet', d: 'Still getting ready', k: 'no', quick: true }], d => {
      if (d.k !== 'go') return;
      G.mode = 'busy'; questStart('block'); if (W.luca) W.luca.g.userData.spin = 1; sfx('woof');
      say(["Luca hears the clip of the lead and loses his entire mind.", { n: 'Mum', t: "Go on, you two. I'll put the kettle on." }], () => { MAPS.bedroom.rows = W.grid.map(r => r.join('')); fade(() => loadMap('block')); });
    });
  };
})();
function addBandana(g) {
  if (!g || g.userData.bandana) return; const u = g.userData;
  const b = grp(u.body, 0, 0.47, 0.2); b.rotation.x = 0.5;
  mk(G_CONE, '#ff7aa8', [0.3, 0.2, 0.1], [0, -0.06, 0.03], b, { noShadow: true }).rotation.z = Math.PI; mk(G_CYL, '#ff7aa8', [0.3, 0.05, 0.26], [0, 0.05, -0.04], b, { noShadow: true }); mk(G_STAR, '#fff4c9', [0.07, 0.07, 0.07], [0, -0.06, 0.09], b, { noShadow: true });
  u.bandana = b;
}
MAP_HOOKS.push((def, id) => {
  if (F.bandana && W.luca && (G.campaign || 'day') === 'day') addBandana(W.luca.g);
  if (id !== 'block' || !F.parcel) return;
  const o = W.objs.find(o => o.ch === 'q'); if (o) { W.objs.splice(W.objs.indexOf(o), 1); world.remove(o.g); }
  if (F.parcel === 1) carryParcel(true);
});

/* ---------------- block quests ---------------- */
function carryParcel(on) {
  const B = W.blk; if (!B) return;
  if (B.parcel) { W.player.g.remove(B.parcel); B.parcel = null; }
  if (on) { const p = grp(W.player.g, 0, 0.36, 0.28); mk(G_BOX, '#d9b382', [0.3, 0.2, 0.22], [0, 0, 0], p); mk(G_BOX, '#ff7aa8', [0.31, 0.04, 0.05], [0, 0.11, 0], p, { noShadow: true }); mk(G_BOX, '#ff7aa8', [0.05, 0.04, 0.23], [0, 0.11, 0], p, { noShadow: true }); B.parcel = p; }
}
function pickParcel(o) {
  if (F.parcel) return;
  F.parcel = 1; questStart('parcel');
  if (o) { W.objs.splice(W.objs.indexOf(o), 1); world.remove(o.g); sparkle(o.x, 0.4, o.z, 16); }
  carryParcel(true); sfx('pop');
  say(["A parcel, left beside the postbox. One corner is soggy from the sprinklers.", "The label has run: '...ette. Hide at the house with the lemon tree.'", { n: CONFIG.name, t: "Hide? Okay, weird. Let's find that lemon tree." }]);
}
const BOX_NOTES = { '5,2': "No. 14. A surfboard leans on the porch. No lemon tree.", '12,2': "No. 18. Wind chimes and a cat flap. No lemon tree.", '16,2': "No. 20, right under the swooping sign. Brave people. No lemon tree.", '5,11': "No. 9. Roses, roses and more roses.", '12,11': "No. 13. A basketball hoop over the garage.", '16,11': "No. 15, the corner house, home of the gnome army." };
function letterbox(x, z) {
  const k = x + ',' + z;
  if (k === '9,11') return say(["Our letterbox. Already stuffed with birthday cards.", "One is from Luca. The handwriting looks a lot like Mum's."]);
  if (k !== '9,2') return say(F.parcel === 1 ? [BOX_NOTES[k] || "No lemon tree here.", "Not this one. Keep looking."] : (BOX_NOTES[k] || "A tidy little letterbox."));
  if (F.parcel !== 1) return say(questState('parcel') === 2 ? "The lemon tree house. Their secret-keeping days are over." : "No. 16, the house with the lemon tree. Free lemons in a bucket by the gate.");
  G.mode = 'busy';
  say(["No. 16: the house with the lemon tree. The front door opens before the knock.", { n: 'Neighbour', t: "Oh no. You found it early! That one's not for me, love." }, { n: 'Neighbour', t: "Wipe the label. Go on." }, "Under the smudge: 'For " + CONFIG.name + ". Hide at the lemon tree house till her birthday. P.'"], () =>
    sting('Plot twist', 'It was hers all along', () => {
      F.parcel = 2; F.bandana = true; carryParcel(false); if (W.luca) { addBandana(W.luca.g); W.luca.g.userData.spin = 1; confetti(W.luca.g.position.x, 0.9, W.luca.g.position.z, 40); }
      stat('happy', 8); sfx('woof');
      say(["Inside: a tiny pink bandana for Luca. It says BIRTHDAY SECURITY.", "And a note: 'He takes the job very seriously. See you tonight. P'", { n: CONFIG.name, t: CONFIG.boyfriend + ", you absolute sneak." }], () => questDone('parcel'));
    }));
}
function talkDot() {
  const s = questState('biscuit');
  if (s === 2) return say({ n: BK.catOwner, t: BK.cat + " has not stopped purring. Happy birthday, love. You're a good egg." });
  questStart('biscuit');
  say([{ n: BK.catOwner, t: "Oh, thank goodness. " + BK.cat + " has been up that jacaranda since the magpie had a go at her." }, { n: BK.catOwner, t: "She won't come down for me. She's a drama queen. Would you try, love?" }]);
}
function catTree() {
  if (questState('biscuit') === 2) return say("The jacaranda, minus one cat. The branch looks relieved.");
  if (!questState('biscuit')) { questStart('biscuit'); return say(["A big jacaranda in full bloom.", "Halfway up, two green eyes and an orange tail. A cat, very stuck and very offended."], catTree); }
  pickMenu(BK.cat + ' the cat', 'She is not coming down on her own. Ideas?', [
    { n: 'Pspsps', d: 'The classic', k: 'p' }, { n: 'Shake the treat bag', d: "Borrowed from Luca's stash", k: 't' }, { n: 'Send Luca up', d: 'Bold strategy', k: 'l' }
  ], d => {
    if (d.k === 'p') { sfx('meow'); return say([BK.cat + " looks down. Blinks slowly. Looks away.", "Devastating."]); }
    if (d.k === 'l') { sfx('woof'); if (W.luca) W.luca.g.userData.spin = 1; return say(["Luca puts two paws on the trunk and gives one polite woof.", BK.cat + " is unimpressed. Luca is thrilled with himself."]); }
    G.mode = 'busy';
    say(["One shake of the treat bag.", BK.cat + "'s ears swivel like satellite dishes."], () => sting('She leaps!', 'Four paws, zero fear', () => {
      W.blk.jump = 0; sfx('meow'); G.mode = 'busy';
      setTimeout(() => say([BK.cat + " lands, boops Luca on the nose and struts off like nothing happened.", { n: BK.catOwner, t: BK.cat + "! You little drama queen. Thank you, love!" }, { n: BK.catOwner, t: "Lamington for the road. Birthday rules." }], () => { stat('energy', 6); questDone('biscuit'); }), 1100);
    }, { ms: 1400 }));
  });
}
ENEMIES.magpie = {
  name: 'The ' + BK.cross + ' Magpie', lv: 'Spring', hp: 90, intro: "Swooping season. It has chosen " + CONFIG.name + ".",
  attacks: [["Swoop", 12], ["Beak clack", 8], ["Menacing warble", 10]],
  moves: [
    { n: 'Umbrella up', d: 'Big damage', f: b => hit(b, 30) },
    { n: 'Zip-tie helmet', d: 'Damage, next hit +10', f: b => { const m = hit(b, 18); b.bonus += 10; return m + ' Spiky and proud.'; } },
    { n: 'Cuddle Luca', d: 'Restore HP', f: b => heal(b, 25) },
    { n: 'Stare it down', d: 'Next hit doubles', f: b => { b.mult = 2; sfx('good'); return 'Unbroken eye contact. Next hit doubles!'; } }
  ],
  win() {
    const B = W.blk; if (B && B.mag) { B.mag.visible = true; popIn(B.mag); sparkle(B.mag.position.x, 2.1, B.mag.position.z, 24); }
    stat('gains', 4); sfx('caw');
    say(["The magpie lands on its sign and warbles what is clearly an apology.", "Peace treaty signed: safe passage for one blonde and one cavoodle.", { n: CONFIG.name, t: CONFIG.catchphrase }], () => questDone('magpie'));
  }
};
function magpieSwoop() {
  questStart('magpie'); W.player.dir = 'up'; // it drops in from the north, facing the camera
  if (W.blk.mag) W.blk.mag.visible = false; sfx('caw');
  sting('Swoop!', 'The ' + BK.cross + ' magpie has entered the chat', () => startBattle('magpie'));
}
function updateBlock(dt, t) {
  const B = W && W.blk; if (!B) return;
  const p = W.player, L = W.luca;
  B.spots.forEach(s => { s.m.position.y = 0.1 + Math.sin(t * 3 + s.i) * 0.04; s.m.rotation.y = Math.sin(t * 1.2 + s.i) * 0.4; });
  // the cat: tail flicks, and one heroic leap
  const c = B.cat, cu = c.userData; cu.tail.rotation.x = -0.3 + Math.sin(t * 2.2) * 0.25; cu.tail.rotation.z = Math.sin(t * 1.4) * 0.4; cu.head.rotation.z = Math.sin(t * 0.9) * 0.12;
  if (B.jump != null) { B.jump = Math.min(1, B.jump + dt * 1.3); const k = B.jump, a = B.catHome, b = B.catDown; c.position.set(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + Math.sin(k * Math.PI) * 1.1, lerp(a[2], b[2], k)); c.rotation.x = Math.sin(k * Math.PI) * 0.6; if (k >= 1) { B.jump = null; c.rotation.x = 0; confetti(b[0], 0.4, b[2], 24); } }
  // the magpie: glaring from its sign, or flapping in a battle
  if (B.mag.visible) { const calm = questState('magpie') === 2; B.mag.position.y = 1.95 + Math.abs(Math.sin(t * (calm ? 2 : 5))) * (calm ? 0.02 : 0.05); B.mag.userData.body.rotation.z = Math.sin(t * 1.8) * (calm ? 0.06 : 0.16); }
  if (G.b && G.b.kind === 'magpie' && G.b.foe) G.b.foe.userData.wings.forEach((w, i) => w.rotation.z = (i ? 1 : -1) * (0.5 + Math.sin(t * 14) * 0.6));
  // the neighbour waters the garden
  if (!SET.calm && Math.random() < dt * 9) FX.emit(14.3, 0.55, 2.4, ['#bfe9ff', '#ffffff'], 1, 0.9, { g: 4, life: 0.5 });
  // Luca files a sniff report
  if (B.sniff) {
    const s = B.sniff; s.t -= dt;
    if (L) { L.g.userData.body.rotation.x = 0.32 + Math.sin(t * 22) * 0.05; if (Math.random() < dt * 10) FX.emit(L.g.position.x, 0.15, L.g.position.z, ['#ffffff', '#ffd166'], 1, 0.7, { g: -0.8, life: 0.5 }); }
    if (s.t <= 0) {
      B.sniff = null; if (L) L.g.userData.body.rotation.x = 0;
      F['sn' + s.i] = 1; const n = SNIFF_SPOTS.filter((q, i) => F['sn' + i]).length; G.mode = 'map'; stat('happy', 2, true);
      toast('Sniff report ' + n + ' of ' + SNIFF_SPOTS.length);
      say(BK.sniffs[s.i], () => { if (n >= SNIFF_SPOTS.length) questDone('sniff'); });
    }
    return;
  }
}
// walk-on triggers: corners of the lap, Luca's paw prints, and one territorial magpie
function blockStep(x, z) {
  const B = W.blk; if (!B) return false;
  const ci = BLOCK_CORNERS.findIndex(([cx, cz]) => Math.abs(x - cx) + Math.abs(z - cz) <= 1);
  if (ci >= 0 && !F['bc' + ci]) {
    F['bc' + ci] = 1; const n = BLOCK_CORNERS.filter((q, i) => F['bc' + i]).length; questStart('block');
    if (n >= 4) { questDone('block'); return true; }
    toast('Corner ' + n + ' of 4'); sfx('good');
  }
  const si = B.spots.findIndex(s => s.x === x && s.z === z);
  if (si >= 0) {
    const s = B.spots.splice(si, 1)[0]; world.remove(s.m); questStart('sniff');
    G.mode = 'busy'; B.sniff = { i: s.i, t: 1.2 }; sfx('sniff'); sparkle(s.x, 0.3, s.z, 16); return true;
  }
  if (x === 18 && (z === 4 || z === 5) && questState('magpie') !== 2) { magpieSwoop(); return true; }
  return false;
}

/* ---------------- office: the cake caper ---------------- */
const CAPER_AT = { '3,4': 0, '7,4': 1, '3,7': 2, '10,7': 3 };
const CAPER_CLUES = [
  [{ n: 'Dev', t: "The cake? Not me, I'm off sugar till Friday. But I did see pink icing on a keyboard over on the door side." }],
  [{ n: 'Marco', t: "I was in stand-up till ten. Sam skipped it. Said there was 'a thing' to take care of." }],
  [{ n: 'Sam', t: "Me? No. Never. Ask Jo. There's a fork on Jo's desk." }, "There is pink icing on Sam's sleeve."],
  [{ n: 'Jo', t: "The fork is for my salad! And for the record, Sam's 'thing' this morning was in the kitchen." }]
];
(() => {
  const off = MAPS.office, talk = off.act.c;
  off.act.K = () => {
    const s = questState('caper');
    if (s === 2) return say("The birthday cake, safe at last. Minus one slice of evidence.");
    if (!s) { G.mode = 'busy'; return say(["The birthday cake for three o'clock. Pink icing, rainbow sprinkles.", "One slice is already missing. A trail of crumbs leads off across the carpet."], () => sting('The cake caper', 'Somebody in this office knows something', () => { G.mode = 'map'; questStart('caper'); say("Ask around the desks, then come back to the cake to name the culprit."); })); }
    pickMenu('The cake caper', 'Who got into the birthday cake?', BK.suspects.map((n, i) => ({ n, d: ['Off sugar till Friday', 'In stand-up till ten', "Had 'a thing' this morning", 'Has a fork on the desk'][i], k: i, quick: true })), d => {
      if (d.k !== BK.culprit) { F.caperMiss = true; sfx('bad'); return say([d.n + " gasps across the office.", { n: d.n, t: "Excuse me? I would NEVER. Check your notes, detective." }]); }
      G.mode = 'busy';
      sting('Case closed', 'The icing never lies', () => say([{ n: 'Sam', t: "Okay! Okay. It was a quality check. For YOU. You deserve a cake that has been tested." }, { n: CONFIG.name, t: "And?" }, { n: 'Sam', t: "Ten out of ten. Coffees are on me for a month." }], () => { if (!F.caperMiss) earn('sleuth'); stat('happy', 6); questDone('caper'); }));
    });
  };
  off.act.c = (x, z, o) => { const i = CAPER_AT[x + ',' + z]; if (questState('caper') !== 1 || i == null) return talk(x, z, o); F['cc' + i] = 1; say(CAPER_CLUES[i]); };
})();

/* ---------------- beach: a message in a bottle ---------------- */
const GLINTS = [[3, 2], [12, 2], [8, 2]];
MAPS.beach.decorate = function (g) {
  const B = W.blk2 = { g: null, i: -1 };
  const place = () => { if (B.g) { world.remove(B.g); B.g = null; } const n = F.glint || 0; if (questState('bottle') === 2 || n >= GLINTS.length) return; const m = grp(world, GLINTS[n][0], 0.3, GLINTS[n][1]); mk(G_STAR, '#ffffff', [0.26, 0.26, 0.1], [0, 0, 0], m, { glow: true }); mk(G_SPH, '#bfe9ff', [0.14, 0.14, 0.14], [0, -0.2, 0], m, { glow: true, alpha: 0.7 }); B.g = m; B.i = n; };
  place();
  wkTicker((dt, t) => {
    if (B.g) { B.g.rotation.y += dt * 3; B.g.position.y = 0.32 + Math.sin(t * 4) * 0.06; B.g.scale.setScalar(0.8 + Math.abs(Math.sin(t * 2.5)) * 0.5); }
  });
  MAPS.beach.onStep = (x, z) => {
    const p = W.player; if (!B.g || x !== GLINTS[B.i][0] || z !== GLINTS[B.i][1]) return false;
    F.glint = B.i + 1; sparkle(p.x, 0.4, p.z, 20); sfx('pop'); questStart('bottle');
    if (B.i === 0) say(["Just a piece of sea glass, worn smooth. Pretty, though. Into the pocket.", "Further along the wet sand, something else catches the light."], place);
    else if (B.i === 1) say(["A bottle cap. Glamorous.", "But there, half buried near the water line: a whole bottle. With paper inside."], place);
    else { place(); G.mode = 'busy'; say(["A glass bottle, corked, with a rolled-up note."], () => sting('A message', 'In an actual bottle', () => say(BK.bottleNote.map(t => ({ n: CONFIG.boyfriend, t: '(Note) ' + t })), () => { heartBurst(p.x, 2.3, 0.5, '#ff7aa8', 0.11); sfx('heart'); G.mode = 'busy'; setTimeout(() => say(["A heart of sea spray hangs over the water for a second, then drifts off.", { n: CONFIG.name, t: "How did he even. Okay. That's very good." }], () => { stat('happy', 8); questDone('bottle'); }), 900); }))); }
    return true;
  };
};

/* ---------------- QA jumps ---------------- */
const qaAfter = fn => setTimeout(() => { if (DLG) { DLG.q = []; nextLine(); } fn(); }, 950);
Object.assign(QA_EXTRA, {
  block: () => { G.campaign = 'day'; loadMap('block'); },
  blockcat: () => { G.campaign = 'day'; loadMap('block'); qaAfter(() => { Object.assign(W.player, { x: 18, z: 7, tx: 18, tz: 7, dir: 'left' }); placeEntity(W.player, 1); Object.assign(W.luca, { x: 18, z: 8, tx: 18, tz: 8 }); placeEntity(W.luca, 1); F.q_magpie = 2; }); },
  magpie: () => { G.campaign = 'day'; loadMap('block'); qaAfter(() => { Object.assign(W.player, { x: 18, z: 7, tx: 18, tz: 7, dir: 'up' }); placeEntity(W.player, 1); W.blk.mag.visible = false; F.q_magpie = 1; startBattle('magpie'); }); },
  sting: () => { G.campaign = 'day'; loadMap('block'); qaAfter(() => sting('Swoop!', 'The ' + BK.cross + ' magpie has entered the chat', null, { ms: 60000 })); },
  caper: () => { loadMap('office'); qaAfter(() => { F.q_caper = 1; Object.assign(W.player, { x: 11, z: 2, tx: 11, tz: 2, dir: 'up' }); placeEntity(W.player, 1); MAPS.office.act.K(); }); },
  bottle: () => { loadMap('beach'); qaAfter(() => { Object.assign(W.player, { x: 4, z: 3, tx: 4, tz: 3, dir: 'up' }); placeEntity(W.player, 1); }); }
});
