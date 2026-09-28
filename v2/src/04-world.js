/* =========================================================
   WORLD: turns a MAPS entry (15x10 char grid) into a floating diorama,
   then handles walking, Luca, NPCs, hearts, doors and interaction.
   ========================================================= */
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const WALK = new Set(['.', 'h', '_', 'D']);
const WALL_H = 1.45, WALL_LOW = 0.26;
let W = null; // the live map

function clearWorld() {
  while (world.children.length) world.remove(world.children[0]);
  (W && W.dispose || []).forEach(o => o.dispose());
  MERGED.forEach(g => g.dispose()); MERGED = []; stopAmbient();
  clouds.length = 0; FX.clear();
  W = null;
}

/* ---------------- object builders per theme + legend char ---------------- */
function wallDecor(theme, ch, w) {
  if (WALL_BUILDERS[theme + ':' + ch]) return WALL_BUILDERS[theme + ':' + ch](w);
  const g = new THREE.Group();
  if (ch === 'o' || (theme === 'office' && ch === 'w')) { // window with curtains
    mk(G_BOX, '#ffffff', [w * 0.86, 0.8, 0.08], [0, 0.85, 0], g); mk(G_BOX, theme === 'office' ? '#bfe6ff' : '#cfeeff', [w * 0.74, 0.66, 0.06], [0, 0.85, 0.03], g, { noShadow: true });
    mk(G_BOX, '#ffffff', [0.05, 0.66, 0.08], [0, 0.85, 0.04], g);
    if (theme === 'office') for (let i = 0; i < 3; i++) mk(G_BOX, ['#9fb3cf', '#b8c7dc', '#8ea3c2'][i], [w * 0.16, 0.2 + i * 0.12, 0.02], [(i - 1) * w * 0.22, 0.6 + (0.2 + i * 0.12) / 2, 0.07], g, { noShadow: true });
    else [-1, 1].forEach(s => mk(G_BOX, '#ffb3cc', [0.16, 0.86, 0.06], [s * w * 0.42, 0.82, 0.08], g));
  } else if (ch === 'G') { // birthday bunting
    for (let i = 0; i < w * 3; i++) { const f = mk(G_CONE, CONFETTI[i % 5], [0.18, 0.28, 0.04], [-w / 2 + 0.2 + i * 0.33, 1.1 - Math.sin((i + 0.5) / (w * 3) * Math.PI) * 0.15, 0.06], g, { noShadow: true }); f.rotation.z = Math.PI; }
  } else if (ch === 'm') { // gym mirror
    mk(G_BOX, '#e8eef8', [w * 0.9, 1.0, 0.06], [0, 0.75, 0.02], g, { noShadow: true }); mk(G_BOX, '#ffffff', [w * 0.94, 0.06, 0.08], [0, 1.27, 0.02], g);
  } else if (ch === 'F') { // film night poster
    mk(G_BOX, '#2f2a4a', [0.7, 0.9, 0.05], [0, 0.8, 0.02], g); mk(G_BOX, '#ffd166', [0.56, 0.12, 0.02], [0, 1.1, 0.05], g, { noShadow: true });
    mk(G_STAR, '#fff4c9', [0.25, 0.25, 0.25], [0, 0.78, 0.06], g); mk(G_SPH, '#b9a3ff', [0.3, 0.08, 0.02], [0, 0.5, 0.05], g, { noShadow: true });
  }
  return g;
}
function buildObj(theme, ch, w, h) {
  if (OBJ_BUILDERS[theme + ':' + ch]) return OBJ_BUILDERS[theme + ':' + ch](w, h);
  const g = new THREE.Group();
  const B = (c, s, p, o) => mk(G_BOX, c, s, p, g, o), S = (c, s, p, o) => mk(G_SPH, c, s, p, g, o), C = (c, s, p, o) => mk(G_CYL, c, s, p, g, o);
  switch (theme + ':' + ch) {
    case 'bedroom:w': B('#c9b6f2', [w - 0.15, 1.35, 0.7], [0, 0.675, -0.1]); B('#b6a0e6', [0.03, 1.2, 0.02], [0, 0.7, 0.26]); [-0.12, 0.12].forEach(x => S('#ffd166', [0.07, 0.07, 0.07], [x, 0.72, 0.27])); B('#ffffff', [w - 0.05, 0.08, 0.76], [0, 1.39, -0.1]); break;
    case 'bedroom:k': B('#e0b48c', [w - 0.1, 1.3, 0.5], [0, 0.65, -0.2]);
      for (let r = 0; r < 3; r++) { B('#c8966c', [w - 0.2, 0.04, 0.44], [0, 0.18 + r * 0.4, -0.16]); for (let i = 0; i < 7; i++) { const hh = 0.22 + hsh(i, r) * 0.12; B(CONFETTI[(i + r) % 5], [0.2, hh, 0.32], [-w / 2 + 0.25 + i * 0.25, 0.2 + r * 0.4 + hh / 2, -0.12]); } } break;
    case 'bedroom:v': B('#fff0f5', [w - 0.3, 0.5, 0.5], [0, 0.25, -0.15]); S('#dff3ff', [0.7, 0.8, 0.06], [0, 0.95, -0.36]); mk(geo('ring', () => new THREE.TorusGeometry(0.5, 0.12, 6, 16)), '#ffd1e1', [0.74, 0.84, 0.5], [0, 0.95, -0.34], g);
      ['#ff9fc3', '#b9e1f5', '#ffd166'].forEach((c, i) => C(c, [0.1, 0.18 + i * 0.04, 0.1], [-0.4 + i * 0.25, 0.6 + i * 0.02, -0.1])); break;
    case 'bedroom:b': B('#ffffff', [w - 0.1, 0.35, h - 0.1], [0, 0.18, 0]); B('#fff7fb', [w - 0.2, 0.14, h - 0.2], [0, 0.42, 0]); B('#c9b6f2', [w - 0.16, 0.12, h * 0.6], [0, 0.5, h * 0.16]);
      for (let i = 0; i < 6; i++) S('#fff4c9', [0.12, 0.03, 0.12], [-0.6 + (i % 3) * 0.6, 0.57, 0.1 + Math.floor(i / 3) * 0.45], { noShadow: true });
      [-0.42, 0.42].forEach(x => S('#ffffff', [0.62, 0.2, 0.4], [x, 0.55, -h / 2 + 0.4])); B('#ffb3cc', [w - 0.1, 0.9, 0.12], [0, 0.45, -h / 2 + 0.08]); mk(G_HEART, '#ff7aa8', [0.4, 0.4, 0.4], [0, 0.72, -h / 2 + 0.16], g); break;
    case 'bedroom:x': { const k = Math.floor(Math.random() * 3); B(['#7fc8f8', '#ffd166', '#b9a3ff'][k], [0.4, 0.07, 0.3], [0, 0.04, 0]); S('#ff9fc3', [0.18, 0.1, 0.12], [0.1, 0.1, 0.1]); B('#ffffff', [0.22, 0.12, 0.16], [-0.12, 0.12, -0.05]); break; }
    case 'bedroom:S': B('#8a6a55', [0.5, 0.7, 0.42], [0, 0.35, -0.05]); C('#4a3b52', [0.28, 0.04, 0.28], [0, 0.48, 0.17]).rotation.x = Math.PI / 2; C('#4a3b52', [0.16, 0.04, 0.16], [0, 0.2, 0.17]).rotation.x = Math.PI / 2; S('#ff7aa8', [0.06, 0.06, 0.06], [0.16, 0.64, 0.17], { glow: true }); break;
    case 'gym:r': [-w / 2 + 0.2, w / 2 - 0.2].forEach(x => C('#5a5470', [0.1, 1.5, 0.1], [x, 0.75, -0.1])); { const b = C('#c7ccd6', [0.06, w - 0.1, 0.06], [0, 1.15, 0]); b.rotation.z = Math.PI / 2; [-1, 1].forEach(s => { C('#b9a3ff', [0.55, 0.1, 0.55], [s * (w / 2 - 0.35), 1.15, 0]).rotation.z = Math.PI / 2; C('#ff7aa8', [0.42, 0.08, 0.42], [s * (w / 2 - 0.25), 1.15, 0]).rotation.z = Math.PI / 2; }); } B('#d8f0e4', [w - 0.1, 0.04, 0.9], [0, 0.02, 0.1]); break;
    case 'gym:L': for (let i = 0; i < w * 2; i++) { B(i % 2 ? '#9fe0c9' : '#b5ead7', [0.46, 1.4, 0.5], [-w / 2 + 0.26 + i * 0.49, 0.7, -0.15]); for (let v = 0; v < 3; v++) B('#6fbf9f', [0.24, 0.03, 0.02], [-w / 2 + 0.26 + i * 0.49, 1.15 - v * 0.06, 0.11], { noShadow: true }); } break;
    case 'gym:S': B('#c89f7a', [w - 0.1, 1.5, 0.8], [0, 0.75, -0.05]); for (let i = 0; i < 6; i++) B('#b07a4a', [w - 0.12, 0.03, 0.02], [0, 0.2 + i * 0.22, 0.36], { noShadow: true }); B('#8a5a3b', [0.5, 1.05, 0.04], [0, 0.55, 0.37]); B('#ffd7a0', [0.26, 0.2, 0.02], [0, 0.85, 0.4], { glow: true }); C('#c7ccd6', [0.05, 0.05, 0.05], [0.18, 0.55, 0.4]); break;
    case 'gym:b': B('#ff9fc3', [w - 0.3, 0.14, 0.42], [0, 0.42, 0]); [-0.6, 0.6].forEach(x => B('#5a5470', [0.08, 0.35, 0.3], [x, 0.18, 0])); break;
    case 'office:p': case 'beach:p0': case 'shop:p': return makePlant(null, 0, 0, true);
    case 'office:d': B('#f3ead8', [w - 0.15, 0.07, 0.8], [0, 0.6, 0]); [-1, 1].forEach(s => B('#c9b49a', [0.07, 0.6, 0.7], [s * (w / 2 - 0.15), 0.3, 0])); B('#3a3148', [0.55, 0.36, 0.05], [0.25, 0.86, -0.2]); B('#9fd0ff', [0.48, 0.28, 0.02], [0.25, 0.86, -0.17], { glow: true }); C('#ffffff', [0.12, 0.14, 0.12], [-0.4, 0.71, 0.1]); break;
    case 'office:Y': B('#fff4e8', [0.9, 0.07, 0.8], [0, 0.6, 0]); B('#e8b8c8', [0.07, 0.6, 0.7], [-0.38, 0.3, 0]); B('#e8b8c8', [0.07, 0.6, 0.7], [0.38, 0.3, 0]);
      for (let i = 0; i < 4; i++) B(['#26457a', '#ffffff', '#ffd166', '#3fae7c'][i], [0.3, 0.04, 0.4], [-0.1, 0.66 + i * 0.04, 0], { noShadow: true });
      ['#ff7aa8', '#ffd166', '#7fc8f8'].forEach((c, i) => { const b = makeBalloon(g, 0.3 + (i - 1) * 0.12, 0.64, -0.2 + i * 0.05, c, 1 + i * 0.15); b.userData.bob = true; }); break;
    case 'office:Z': B('#f3ead8', [0.9, 0.07, 0.8], [0, 0.6, 0]); B('#c9b49a', [0.07, 0.6, 0.7], [-0.38, 0.3, 0]); B('#c9b49a', [0.07, 0.6, 0.7], [0.38, 0.3, 0]);
      B('#3a3148', [0.8, 0.55, 0.06], [0, 1.0, -0.2]); { const sc = B('#dbeaff', [0.7, 0.45, 0.02], [0, 1.0, -0.16], { glow: true }); } B('#ff5c7a', [0.2, 0.14, 0.02], [0.18, 1.08, -0.14], { glow: true }); B('#3a3148', [0.08, 0.2, 0.08], [0, 0.73, -0.2]); B('#ffffff', [0.5, 0.03, 0.18], [0, 0.65, 0.15]); break;
    case 'beach:u': C('#ffffff', [0.05, 1.4, 0.05], [0, 0.7, 0]); { const t = mk(G_CONE, '#ff9fc3', [1.5, 0.45, 1.5], [0, 1.45, 0], g); mk(G_CONE, '#ffffff', [0.7, 0.22, 0.7], [0, 1.6, 0], g); } B('#7fc8f8', [0.6, 0.03, 1.0], [0.5, 0.02, 0.3]); break;
    case 'beach:p': return makePalm(null, 0, 0);
    case 'beach:s': { const s = mk(G_CONE, '#ffc2d6', [0.3, 0.12, 0.26], [0, 0.07, 0], g); s.rotation.x = -0.4; S('#fff4c9', [0.08, 0.06, 0.08], [0.1, 0.05, 0.1]); break; }
    case 'beach:J': { const c = makeCar(); c.rotation.y = Math.PI / 2; g.add(c); g.userData.car = c; break; }
    case 'botanist:f': case 'park:f': return makePlant(null, 0, 0, true);
    case 'botanist:r': B('#2f5d4a', [w - 0.05, 0.85, 0.7], [0, 0.42, 0]); B('#c89f7a', [w + 0.05, 0.08, 0.8], [0, 0.88, 0]);
      for (let i = 0; i < w * 2; i++) C(['#ffd166', '#ff9fc3', '#9fe0c9', '#b9a3ff'][i % 4], [0.1, 0.28, 0.1], [-w / 2 + 0.3 + i * 0.5, 1.06, -0.2], { glow: i % 2 === 0 }); break;
    case 'botanist:t': C('#fff4e8', [0.95, 0.06, 0.95], [0, 0.62, 0]); C('#c89f7a', [0.1, 0.6, 0.1], [0, 0.3, 0]); C('#fff4c9', [0.07, 0.14, 0.07], [0.15, 0.72, 0]); S('#ffcf5c', [0.06, 0.09, 0.06], [0.15, 0.84, 0], { glow: true });
      mk(G_SPH, '#ff9fc3', [0.12, 0.12, 0.12], [-0.2, 0.7, 0.1], g); break;
    default: B('#e8d5c0', [w - 0.1, 0.5, h - 0.1], [0, 0.25, 0]);
  }
  return g;
}
const NPC_CHARS = { bedroom: 'M', gym: 'gn', office: 'c', botanist: 'nA', beach: '' };

/* ---------------- build a map ---------------- */
function buildMap(id) {
  clearWorld();
  const def = MAPS[id], rows = def.rows, H = rows.length, Wd = rows[0].length;
  const grid = rows.map(r => r.split(''));
  W = { id, def, grid, w: Wd, h: H, objs: [], npcs: [], hearts: [], walls: [], decor: [], markers: [], dispose: [], anim: [], outdoor: !!def.outdoor, props: {} };
  const cx = (Wd - 1) / 2, cz = (H - 1) / 2;
  makeIslandBase(world, Wd, H, def.edge || def.floor[0], cx, cz);
  fitSun(cx, cz, 12);

  // floor: one InstancedMesh, tinted per tile (checker, wet sand, water)
  const floorGeo = new THREE.BoxGeometry(1, 0.2, 1); floorGeo.translate(0, -0.1, 0); W.dispose.push(floorGeo);
  const floor = IM(floorGeo, '#ffffff', Wd * H); floor.receiveShadow = true;
  const water = IM(floorGeo, '#8fd3f0', Wd * H, { alpha: 0.85 }); water.receiveShadow = true;
  const dm = new THREE.Object3D(), col = new THREE.Color();
  let nf = 0, nw = 0;
  for (let z = 0; z < H; z++) for (let x = 0; x < Wd; x++) {
    const ch = grid[z][x];
    const isWall = !W.outdoor && (z === 0 || x === 0 || x === Wd - 1 || z === H - 1) && ch !== 'D';
    if (ch === '~') { dm.position.set(x, -0.12, z); dm.scale.set(1, 1, 1); dm.updateMatrix(); water.setMatrixAt(nw, dm.matrix); water.setColorAt(nw++, col.set(def.water ? def.water[(x + z) % 2] : (x + z) % 2 ? '#8fd3f0' : '#9fdcf5')); continue; }
    dm.position.set(x, 0, z); dm.scale.set(1, 1, 1); dm.updateMatrix(); floor.setMatrixAt(nf, dm.matrix);
    const c = ch === '_' ? def.wet : (isWall ? def.floor[1] : def.floor[(x + z) % 2]);
    floor.setColorAt(nf++, col.set(c));
    if (isWall) W.walls.push({ x, z, ch });
  }
  floor.count = nf; water.count = nw; W.dispose.push(floor.userData.ownMat, water.userData.ownMat); world.add(floor); if (nw) { world.add(water); W.water = water; }
  // walls: instanced blocks + a trim layer; front walls drop low so the camera sees in (dollhouse cutaway)
  if (W.walls.length) {
    const wg = new THREE.BoxGeometry(1, 1, 1); wg.translate(0, 0.5, 0); W.dispose.push(wg);
    W.wallMesh = IM(wg, '#ffffff', W.walls.length); W.wallMesh.castShadow = true; W.wallMesh.receiveShadow = true;
    W.trimMesh = IM(wg, def.trim || '#ffffff', W.walls.length);
    W.walls.forEach((wl, i) => W.wallMesh.setColorAt(i, col.set(def.wall[(wl.x + wl.z) % 2])));
    world.add(W.wallMesh, W.trimMesh); W.dispose.push(W.wallMesh.userData.ownMat, W.trimMesh.userData.ownMat);
  }
  // objects (multi-tile ones built once from their top-left origin)
  const npcSet = NPC_CHARS[def.theme] || '';
  for (let z = 0; z < H; z++) for (let x = 0; x < Wd; x++) {
    const ch = grid[z][x];
    if (WALK.has(ch) || ch === '#' || ch === '~') {
      if (ch === 'h' && !G.hearts[id + ':' + x + ',' + z]) { const hm = makeHeart(world, x, 0.55, z, '#ff5c7a', 0.45); W.hearts.push({ x, z, m: hm }); }
      if (ch === 'D') buildDoor(x, z);
      continue;
    }
    if (npcSet.includes(ch)) { addNpc(ch, x, z); continue; }
    const left = x > 0 && grid[z][x - 1] === ch, up = z > 0 && grid[z - 1][x] === ch;
    if (left || up) continue;
    let w = 1, h = 1; while (x + w < Wd && grid[z][x + w] === ch) w++; while (z + h < H && grid[z + h][x] === ch) h++;
    const onWall = !W.outdoor && z === 0;
    const o = { ch, x, z, w, h, onWall };
    if (onWall) { o.g = wallDecor(def.theme, ch, w); o.g.position.set(x + (w - 1) / 2, 0, z + 0.5); world.add(o.g); W.decor.push(o); }
    else { o.g = buildObj(def.theme, ch, w, h); if (!Object.keys(o.g.userData).some(k => k !== 'sway')) mergeStatic(o.g); o.g.position.set(x + (w - 1) / 2, 0, z + (h - 1) / 2); world.add(o.g); popIn(o.g, 0.02 * (x + z)); }
    W.objs.push(o);
  }
  if (def.decorate) def.decorate(world);
  // outdoor edge flowers, clouds and balloons tied to the island
  for (let i = 0; i < 26; i++) { const t = hsh(i, 9) * (2 * (Wd + H)); let x, z; if (t < Wd) { x = t - 0.5; z = H - 0.45; } else if (t < Wd + H) { x = Wd - 0.45; z = t - Wd - 0.5; } else if (t < 2 * Wd + H) { x = t - Wd - H - 0.5; z = -0.55; } else { x = -0.55; z = t - 2 * Wd - H - 0.5; } if (W.outdoor || hsh(i, 3) < 0.4) makeFlower(world, x, z, CONFETTI[i % 5]).position.y = W.outdoor ? 0 : -0.02; }
  [[-1.4, -0.8], [Wd + 0.4, -0.8], [-1.4, H + 0.2], [Wd + 0.4, H + 0.2]].forEach(([x, z], i) => { const b = makeBalloon(world, x, -0.3, z, CONFETTI[i], 2.2 + i * 0.3); b.userData.bob = true; W.anim.push(b); });
  for (let i = 0; i < 7; i++) makeCloud(world, -20 + i * 7, -5.5 + hsh(i, 1) * 1.5, -8 + hsh(i, 2) * 22, 1.2 + hsh(i, 3) * 1.4);
  mergeStatic(world, new Set(W.hearts.map(h => h.m)), true, true); // static scenery meshes on the root, per material
  layoutWalls();

  // Annette + Luca
  const st = def.start;
  W.player = { x: st.x, z: st.z, tx: st.x, tz: st.z, t: 1, moving: false, dir: st.dir || 'up', path: [], g: makeAnnette(G.wearing) };
  world.add(W.player.g);
  if (def.luca) { W.luca = { x: def.luca.x, z: def.luca.z, tx: def.luca.x, tz: def.luca.z, t: 1, moving: false, dir: 'down', g: makeLuca(), trail: [] }; world.add(W.luca.g); }
  placeEntity(W.player, 1); if (W.luca) placeEntity(W.luca, 1);
  cam.goal.set(st.x, 0.5, st.z); cam.target.copy(cam.goal); cam.zoomGoal = 1; cam.zoom = 1; cam.orbit = 0; cam.pitch = MAP_PITCH; cam.base = MAP_BASE;
  setSky(def.sky); refreshHints();
}
function buildDoor(x, z) {
  const g = grp(world, x, 0, z);
  mk(G_CYL, '#ff9fc3', [0.8, 0.03, 0.55], [0, 0.015, -0.05], g, { noShadow: true });
  const arch = grp(g, 0, 0, 0.25);
  [-0.42, 0.42].forEach(s => mk(G_BOX, '#fff4e8', [0.14, 1.35, 0.3], [s, 0.675, 0], arch));
  mk(G_BOX, '#fff4e8', [0.98, 0.16, 0.3], [0, 1.35, 0], arch);
  mk(G_HEART, '#ff7aa8', [0.3, 0.3, 0.3], [0, 1.52, 0.05], arch);
  W.doorArch = W.doorArch || []; W.doorArch.push({ g: arch, x, z });
}
function popIn(g, delay) { g.userData.pop = -(delay || 0); g.scale.setScalar(0.001); W.anim.push(g); }
function addNpc(ch, x, z) {
  const look = W.def.npcs && W.def.npcs(ch, x, z);
  if (!look) return;
  const g = look === 'luca' ? makeLuca() : makePerson(look);
  const n = { ch, x, z, g, face: Math.PI * (z === 0 ? 0 : 1) * 0, want: 0 };
  g.position.set(x, 0, z); world.add(g); popIn(g, 0.03 * (x + z)); W.npcs.push(n);
  const o = { ch, x, z, w: 1, h: 1, npc: n, g }; W.objs.push(o);
}
function layoutWalls() {
  if (!W || !W.wallMesh) return;
  const q = yawQuadrant(), dm = new THREE.Object3D();
  const low = (x, z) => (q === 0 && z === W.h - 1) || (q === 1 && x === W.w - 1) || (q === 2 && z === 0) || (q === 3 && x === 0);
  W.walls.forEach((wl, i) => {
    const hgt = low(wl.x, wl.z) ? WALL_LOW : WALL_H;
    dm.position.set(wl.x, 0, wl.z); dm.scale.set(1, hgt, 1); dm.updateMatrix(); W.wallMesh.setMatrixAt(i, dm.matrix);
    dm.position.set(wl.x, hgt, wl.z); dm.scale.set(1.04, 0.08, 1.04); dm.updateMatrix(); W.trimMesh.setMatrixAt(i, dm.matrix);
  });
  W.wallMesh.instanceMatrix.needsUpdate = true; W.trimMesh.instanceMatrix.needsUpdate = true;
  if (W.wallMesh.instanceColor) W.wallMesh.instanceColor.needsUpdate = true;
  W.decor.forEach(o => o.g.visible = !low(o.x, o.z));
  (W.doorArch || []).forEach(d => d.g.visible = !low(d.x, d.z));
}
function onRotate() { setTimeout(layoutWalls, 120); }

/* ---------------- queries ---------------- */
const inMap = (x, z) => W && x >= 0 && z >= 0 && x < W.w && z < W.h;
const charAt = (x, z) => inMap(x, z) ? W.grid[z][x] : '#';
function walkable(x, z) { return inMap(x, z) && WALK.has(W.grid[z][x]); }
function objAt(x, z) { return W.objs.find(o => x >= o.x && x < o.x + o.w && z >= o.z && z < o.z + o.h); }

/* ---------------- camera-relative controls ---------------- */
function screenDir(d) {
  const y = yawQuadrant() * Math.PI / 2;
  const up = [Math.round(-Math.sin(y)), Math.round(-Math.cos(y))], right = [Math.round(Math.cos(y)), Math.round(-Math.sin(y))];
  return d === 'up' ? up : d === 'down' ? [-up[0], -up[1]] : d === 'right' ? right : [-right[0], -right[1]];
}
const vecToDir = (dx, dz) => dx > 0 ? 'right' : dx < 0 ? 'left' : dz > 0 ? 'down' : 'up';

/* ---------------- movement ---------------- */
function placeEntity(e, t) {
  const x = lerp(e.x, e.tx, t), z = lerp(e.z, e.tz, t);
  e.g.position.set(x, 0, z);
}
function startMove(e, nx, nz) { e.tx = nx; e.tz = nz; e.t = 0; e.moving = true; e.dir = vecToDir(nx - e.x, nz - e.z); }
function tryStep(dx, dz) {
  const p = W.player;
  p.dir = vecToDir(dx, dz);
  const nx = p.x + dx, nz = p.z + dz;
  if (!walkable(nx, nz)) { return false; }
  if (W.luca && !W.luca.moving) startMove(W.luca, p.x, p.z);
  else if (W.luca) W.luca.queue = [p.x, p.z];
  startMove(p, nx, nz); if (Math.random() < 0.5) sfx('step');
  return true;
}
function updateWalker(e, dt, speed) {
  if (!e.moving) return false;
  e.t = Math.min(1, e.t + dt * speed);
  placeEntity(e, e.t);
  if (e.t >= 1) { e.x = e.tx; e.z = e.tz; e.moving = false; if (e.queue) { const q = e.queue; e.queue = null; if (q[0] !== e.x || q[1] !== e.z) startMove(e, q[0], q[1]); } return true; }
  return false;
}
function updatePlayer(dt) {
  const p = W.player;
  if (updateWalker(p, dt, TUNE.walkSpeed)) onArrive();
  if (W.luca) updateWalker(W.luca, dt, TUNE.walkSpeed * 1.05);
  if (!p.moving && G.mode === 'map') {
    const d = heldDir();
    if (d) { p.path = []; p.pending = null; const v = screenDir(d); tryStep(v[0], v[1]); }
    else if (p.path.length) { const [nx, nz] = p.path.shift(); if (!tryStep(nx - p.x, nz - p.z)) p.path = []; }
    else if (p.pending) { const t = p.pending; p.pending = null; p.dir = vecToDir(Math.sign(t.x - p.x), Math.sign(t.z - p.z)); interactAt(t.x, t.z); }
  }
}
function onArrive() {
  const p = W.player, ch = charAt(p.x, p.z);
  const hi = W.hearts.findIndex(h => h.x === p.x && h.z === p.z);
  if (hi >= 0) collectHeart(hi);
  if (ch === 'D') {
    p.path = []; p.pending = null;
    if (W.def.doorOpen && W.def.doorOpen()) { sfx('door'); W.def.onDoor(); }
    else { const back = screenDir('up'); const dx = walkable(p.x + back[0], p.z + back[1]) ? back : [0, -1]; say(W.def.doorLocked ? W.def.doorLocked() : "Not yet!", () => { tryStep(dx[0], dx[1]); }); }
  }
}
function collectHeart(i) {
  const h = W.hearts[i]; G.hearts[W.id + ':' + h.x + ',' + h.z] = true;
  confetti(h.x, 0.7, h.z, 30); sfx('heart'); world.remove(h.m); W.hearts.splice(i, 1);
  stat('happy', 5); toast('Heart found! ' + heartsFound() + ' of ' + HEARTS_TOTAL, true);
}

/* ---------------- BFS pathing for tap-to-walk ---------------- */
function pathTo(goals) {
  const p = W.player, key = (x, z) => z * W.w + x, prev = new Map([[key(p.x, p.z), null]]), q = [[p.x, p.z]];
  const isGoal = new Set(goals.map(([x, z]) => key(x, z)));
  if (isGoal.has(key(p.x, p.z))) return [];
  while (q.length) {
    const [x, z] = q.shift();
    for (const [dx, dz] of Object.values(DIRS)) {
      const nx = x + dx, nz = z + dz, k = key(nx, nz);
      if (prev.has(k) || !walkable(nx, nz)) continue;
      prev.set(k, [x, z]);
      if (isGoal.has(k)) { const out = [[nx, nz]]; let c = [x, z]; while (c && !(c[0] === p.x && c[1] === p.z)) { out.unshift(c); c = prev.get(key(c[0], c[1])); } return out; }
      q.push([nx, nz]);
    }
  }
  return null;
}
function tapTile(x, z) {
  if (!inMap(x, z) || G.mode !== 'map') return;
  const p = W.player;
  if (W.luca && W.luca.x === x && W.luca.z === z && !W.luca.moving) return walkToInteract([[x, z]], { x, z });
  if (walkable(x, z)) { const path = pathTo([[x, z]]); if (path) { p.path = path; p.pending = null; ringAt(x, z); } return; }
  const o = objAt(x, z);
  if (o) {
    const cells = []; for (let i = 0; i < o.w; i++) for (let j = 0; j < o.h; j++) cells.push([o.x + i, o.z + j]);
    walkToInteract(cells, null);
  }
}
function walkToInteract(cells, target) {
  const p = W.player, goals = [];
  cells.forEach(([x, z]) => Object.values(DIRS).forEach(([dx, dz]) => { if (walkable(x + dx, z + dz)) goals.push([x + dx, z + dz, x, z]); }));
  if (!goals.length) return;
  const adj = goals.find(g => g[0] === p.x && g[1] === p.z);
  if (adj) { p.path = []; p.pending = target || { x: adj[2], z: adj[3] }; return; }
  const path = pathTo(goals.map(g => [g[0], g[1]]));
  if (!path) return;
  const end = path.length ? path[path.length - 1] : [p.x, p.z];
  const g = goals.find(g => g[0] === end[0] && g[1] === end[1]);
  p.path = path; p.pending = target || { x: g[2], z: g[3] };
}
let ring = null;
function ringAt(x, z) {
  if (!ring) { ring = new THREE.Mesh(geo('tapring', () => new THREE.RingGeometry(0.3, 0.42, 24)), M('#ffffff', { glow: true, alpha: 0.8 })); ring.rotation.x = -Math.PI / 2; }
  world.add(ring); ring.position.set(x, 0.02, z); ring.userData.t = 0;
}

/* ---------------- interaction ---------------- */
function interact() {
  if (G.mode !== 'map' || !W || W.player.moving) return;
  const p = W.player, [dx, dz] = DIRS[p.dir];
  interactAt(p.x + dx, p.z + dz);
}
function interactAt(x, z) {
  const p = W.player; p.dir = vecToDir(Math.sign(x - p.x), Math.sign(z - p.z));
  if (W.luca && W.luca.x === x && W.luca.z === z) { lucaTalk(); return; }
  const o = objAt(x, z), ch = o ? o.ch : charAt(x, z);
  const fn = W.def.act && W.def.act[ch];
  if (o && o.npc) o.npc.want = 3; // turn to face Annette
  if (fn) { sfx('blip'); fn(x, z, o); }
}
function refreshHints() {
  if (!W) return;
  W.markers.forEach(m => world.remove(m)); W.markers = [];
  const want = (W.def.hints ? W.def.hints() : []).filter(Boolean);
  want.forEach(ch => {
    let o = W.objs.find(o => o.ch === ch), x, z, y = 1.9;
    if (o) { x = o.x + (o.w - 1) / 2; z = o.z + (o.h - 1) / 2 + (o.onWall ? 0.6 : 0); }
    else if (ch === 'D') { for (let zz = 0; zz < W.h; zz++) for (let xx = 0; xx < W.w; xx++) if (W.grid[zz][xx] === 'D') { x = xx; z = zz; } y = 1.9; }
    else if (ch === 'L' && W.luca) { x = W.luca.x; z = W.luca.z; y = 1.3; }
    if (x == null) return;
    const s = mk(G_STAR, '#ffd166', [0.42, 0.42, 0.42], [x, y, z], world, { noShadow: true }); s.userData.base = y; s.userData.follow = ch === 'L';
    W.markers.push(s);
  });
}

/* ---------------- per-frame animation of the living diorama ---------------- */
function animatePerson(g, moving, dt, t) {
  const u = g.userData; if (!u || !u.body) return;
  u.walk = moving ? u.walk + dt * 14 : u.walk * 0.8;
  const s = Math.sin(u.walk);
  if (u.kind === 'person') {
    u.legL.rotation.x = s * 0.6; u.legR.rotation.x = -s * 0.6; u.armL.rotation.x = -s * 0.5; u.armR.rotation.x = s * 0.5;
    u.body.position.y = moving ? Math.abs(Math.cos(u.walk)) * 0.07 : Math.sin(t * 2.2 + g.id) * 0.012;
    u.head.rotation.z = moving ? 0 : Math.sin(t * 1.3 + g.id) * 0.05;
    const sq = moving ? 1 : 1 + Math.sin(t * 2.2 + g.id) * 0.015; u.body.scale.set(2 - sq, sq, 2 - sq);
  } else if (u.kind === 'dog') {
    u.legs.forEach((L, i) => L.rotation.x = (i % 2 ? 1 : -1) * (i < 2 ? 1 : -1) * s * 0.7);
    u.tail.rotation.z = Math.sin(t * (moving ? 18 : 12)) * 0.6;
    u.body.position.y = moving ? Math.abs(Math.cos(u.walk)) * 0.08 : (SET.calm ? 0 : Math.max(0, Math.sin(t * 3)) * 0.05);
    u.ears.forEach((e, i) => e.rotation.z = (i ? 1 : -1) * (0.25 + Math.sin(t * 5 + i) * 0.1));
    u.tongue.scale.z = 0.07 + Math.abs(Math.sin(t * 6)) * 0.02;
  }
}
function faceTo(g, dir, dt, k) {
  const v = typeof dir === 'string' ? DIRS[dir] : dir;
  const target = Math.atan2(v[0], v[1]);
  let d = target - g.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d));
  g.rotation.y += d * Math.min(1, dt * (k || 14));
}
function updateWorld(dt, t) {
  if (!W) return;
  if (W.player) { animatePerson(W.player.g, W.player.moving, dt, t); faceTo(W.player.g, W.player.dir, dt); }
  if (W.luca && !PET) { animatePerson(W.luca.g, W.luca.moving, dt, t); faceTo(W.luca.g, W.luca.moving ? W.luca.dir : [W.player.x - W.luca.x || 0.001, W.player.z - W.luca.z], dt, 6); }
  W.npcs.forEach(n => {
    animatePerson(n.g, false, dt, t);
    const p = W.player; const dx = p.x - n.x, dz = p.z - n.z;
    if (n.want > 0 || Math.abs(dx) + Math.abs(dz) <= 2) faceTo(n.g, [dx || 0.001, dz], dt, 5);
    else faceTo(n.g, [Math.sin(n.x + t * 0.2) * 0.3, 1], dt, 2);
  });
  W.hearts.forEach(h => { h.m.rotation.y += dt * 2; h.m.position.y = 0.55 + Math.sin(t * 3 + h.x) * 0.08; });
  W.markers.forEach(m => { m.rotation.y += dt * 2.5; if (m.userData.follow && W.luca) { m.position.x = W.luca.g.position.x; m.position.z = W.luca.g.position.z; } m.position.y = m.userData.base + Math.sin(t * 4) * 0.12; });
  W.anim = W.anim.filter(g => {
    if (g.userData.pop != null) { g.userData.pop += dt * 2.6; const k = clamp(g.userData.pop, 0, 1); g.scale.setScalar(Math.max(0.001, easeOutBack(k))); if (g.userData.pop >= 1) { g.scale.setScalar(1); g.userData.pop = null; return !!g.userData.bob; } return true; }
    if (g.userData.bob) { g.position.y = (g.userData.baseY != null ? g.userData.baseY : (g.userData.baseY = g.position.y)) + Math.sin(t * 1.6 + g.userData.phase) * 0.15; g.rotation.z = Math.sin(t + g.userData.phase) * 0.06; }
    return true;
  });
  world.traverse(o => { if (o.userData.sway != null) o.rotation.z = SET.calm ? 0 : Math.sin(t * 1.5 + o.userData.sway) * 0.04; if (o.userData.fairy) o.children.forEach(b => b.scale.setScalar(0.09 * (0.8 + 0.35 * Math.sin(t * 4 + b.userData.tw)))); if (o.userData.bob && o.userData.phase != null && !W.anim.includes(o)) o.children[0] && (o.rotation.z = Math.sin(t * 1.4 + o.userData.phase) * 0.08); });
  if (ring && ring.parent) { ring.userData.t += dt; const k = ring.userData.t; ring.scale.setScalar(1 + k * 1.5); ring.material.opacity = Math.max(0, 0.8 - k * 1.6); if (k > 0.6) world.remove(ring); }
  if (W.water && !SET.calm && Math.random() < dt * 6) { const i = Math.floor(Math.random() * W.water.count); const m = new THREE.Matrix4(); W.water.getMatrixAt(i, m); const v = new THREE.Vector3().setFromMatrixPosition(m); sparkle(v.x + Math.random() - 0.5, 0.05, v.z + Math.random() - 0.5, 2); }
  driftClouds(dt, 30);
}
