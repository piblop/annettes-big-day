/* =========================================================
   MINI-GAMES: drive, squat rack, battles, report sprint, cuddles with Luca
   ========================================================= */

/* ---------------- drive: Joanne cruises a floating road. Catch balloons, dodge cones, honk at slow drivers ---------------- */
const DRIVE_THEMES = {
  suburb:  { sky: 'morning', ground: '#a6dc8f', side: 'house', label: 'North Ryde streets' },
  city:    { sky: 'day', ground: '#c9d7e8', side: 'tower', label: 'Into the CBD' },
  coast:   { sky: 'golden', ground: '#ffe3aa', side: 'palm', label: 'The coast road' },
  country: { sky: 'day', ground: '#a6dc8f', side: 'gum', label: 'Leafy back streets' },
  night:   { sky: 'evening', ground: '#9fb0c9', side: 'tower', label: 'City lights' }
};
const LANE_X = [-0.7, 0.55], ROAD_LEN = 38;
let D = null;
function startDrive(theme, next, dest) { fade(() => buildDrive(theme, next, dest)); }
function makeStreetLamp(parent, x, z) {
  const g = grp(parent, x, 0, z);
  mk(G_CYL, '#6b6f82', [0.06, 1.5, 0.06], [0, 0.75, 0], g);
  mk(G_BOX, '#6b6f82', [0.36, 0.04, 0.05], [x < 0 ? 0.16 : -0.16, 1.48, 0], g);
  mk(G_SPH, '#fff4c9', [0.14, 0.08, 0.1], [x < 0 ? 0.32 : -0.32, 1.44, 0], g, { glow: true });
  return g;
}
function makeHouse(parent, x, z, i) {
  const g = grp(parent, x, 0, z), wall = ['#fff4e8', '#ffe3ec', '#e8f4ff', '#fff0c2'][i % 4], roof = ['#ff9fb2', '#b9a3ff', '#7fc8f8', '#ffa94d'][i % 4];
  mk(G_BOX, wall, [1.2, 0.8, 1], [0, 0.4, 0], g);
  const r = mk(G_CONE, roof, [1.35, 0.6, 1.25], [0, 1.1, 0], g); r.rotation.y = Math.PI / 4; r.scale.set(1.25, 0.6, 1.2);
  mk(G_BOX, '#c89f7a', [0.24, 0.42, 0.02], [0, 0.21, 0.51], g, { noShadow: true });
  [-0.36, 0.36].forEach(wx => { mk(G_BOX, '#bfe6ff', [0.22, 0.2, 0.02], [wx, 0.5, 0.51], g, { noShadow: true }); mk(G_BOX, '#ffffff', [0.26, 0.03, 0.03], [wx, 0.38, 0.52], g, { noShadow: true }); });
  mk(G_BOX, '#ffffff', [0.12, 0.3, 0.12], [0.3, 1.2, -0.15], g);
  for (let k = 0; k < 5; k++) mk(G_BOX, '#ffffff', [0.05, 0.22, 0.04], [-0.55 + k * 0.27, 0.11, 0.78], g, { noShadow: true });
  mk(G_BOX, '#ffffff', [1.2, 0.03, 0.03], [0, 0.18, 0.78], g, { noShadow: true });
  makeFlower(g, -0.45, 0.62, CONFETTI[i % 5]); makeFlower(g, 0.45, 0.62, CONFETTI[(i + 2) % 5]);
  return g;
}
function makeTower(parent, x, z, i) {
  const g = grp(parent, x, 0, z), h = 2.4 + hsh(i, 2) * 3.4, col = ['#b9c7ff', '#ffd1e1', '#c7f0e0', '#fff0c2', '#e2d8ff'][i % 5];
  mk(G_BOX, col, [1.3, h, 1.2], [0, h / 2, 0], g);
  for (let k = 0; k < Math.floor(h / 0.42); k++) for (let c = 0; c < 3; c++) mk(G_BOX, (k + c + i) % 4 ? '#fff8e0' : '#9fd0ff', [0.26, 0.2, 0.02], [-0.38 + c * 0.38, 0.35 + k * 0.42, 0.61], g, { noShadow: true, glow: true, alpha: 0.85 });
  mk(G_BOX, '#ffffff', [1.4, 0.1, 1.3], [0, h + 0.05, 0], g);
  if (i % 3 === 0) { mk(G_CYL, '#8a8fa0', [0.03, 0.6, 0.03], [0.3, h + 0.35, 0], g); mk(G_SPH, '#ff5c7a', [0.08, 0.08, 0.08], [0.3, h + 0.66, 0], g, { glow: true }); }
  return g;
}
function makeGum(parent, x, z, s) {
  const g = grp(parent, x, 0, z); s = s || 1;
  const t = mk(G_CYL, '#e8dccb', [0.16 * s, 1.3 * s, 0.16 * s], [0, 0.65 * s, 0], g); t.rotation.z = 0.08;
  [[0, 1.45, 0, 0.9], [0.35, 1.25, 0.1, 0.6], [-0.3, 1.3, -0.1, 0.65], [0.1, 1.75, -0.05, 0.55]].forEach(([a, b, c, r], i) => mk(G_SPH, i % 2 ? '#8fb59a' : '#7aa88a', [r * s, r * 0.7 * s, r * s], [a * s, b * s, c * s], g));
  g.userData.sway = Math.random() * TAU; return g;
}
function buildDrive(theme, next, dest) {
  clearWorld(); clearUI(); G.scene = 'drive'; G.mode = 'drive'; showHUD(true);
  const T = DRIVE_THEMES[theme] || DRIVE_THEMES.suburb; setSky(T.sky); setChapter(dest === CONFIG.dinnerSpot ? 'Driving to date night' : 'On the road to ' + dest); fitSun(0, -8, 16);
  W = { id: 'drive', objs: [], npcs: [], hearts: [], markers: [], anim: [], dispose: [], walls: [], decor: [] };
  const zc = -ROAD_LEN / 2 + 6;
  makeIslandBase(world, 11, ROAD_LEN + 8, T.ground, 0, zc);
  mk(G_BOX, T.ground, [11, 0.2, ROAD_LEN + 8], [0, -0.1, zc], world);
  if (theme === 'coast') { mk(G_BOX, '#8fd3f0', [4.5, 0.25, ROAD_LEN + 8], [3.6, -0.08, zc], world, { alpha: 0.9 }); mk(G_BOX, '#ffe9b8', [1.2, 0.05, ROAD_LEN + 8], [1.9, 0.01, zc], world); }
  mk(G_BOX, '#8a8ea3', [2.8, 0.05, ROAD_LEN + 8], [-0.08, 0.02, zc], world);
  [-1.6, 1.44].forEach(x => { mk(G_BOX, '#e8e2d8', [0.36, 0.08, ROAD_LEN + 8], [x, 0.04, zc], world); mk(G_BOX, '#ffffff', [0.04, 0.02, ROAD_LEN + 8], [x > 0 ? 1.24 : -1.4, 0.052, zc], world, { noShadow: true }); });
  const moving = [];
  for (let i = 0; i < 19; i++) moving.push(mk(G_BOX, '#ffffff', [0.07, 0.02, 0.9], [-0.08, 0.055, 6 - i * 2], world, { noShadow: true }));
  for (let i = 0; i < 8; i++) moving.push(makeStreetLamp(world, i % 2 ? 1.62 : -1.8, 5 - i * 4.75));
  for (let i = 0; i < 16; i++) {
    const side = theme === 'coast' ? -1 : (i % 2 ? 1 : -1), x = side * (2.7 + hsh(i, 1) * 1.3), z = 6 - i * 2.4;
    let g;
    if (T.side === 'palm') g = i % 3 ? makePalm(world, x, z) : makeHouse(world, x - 0.3, z, i);
    else if (T.side === 'tower') g = makeTower(world, x + side * 0.3, z, i);
    else if (T.side === 'gum') g = i % 2 ? makeGum(world, x, z, 0.9 + hsh(i, 4) * 0.3) : makeTree(world, x, z, 1, '#8fcf7f');
    else g = i % 3 === 0 ? makeTree(world, x, z, 1, ['#7cc576', '#9fd98a', '#ffb3cc'][i % 3]) : makeHouse(world, x, z, i);
    moving.push(g);
  }
  const car = makeCar(); car.position.set(LANE_X[0], 0, 3); car.rotation.y = Math.PI; world.add(car);
  for (let i = 0; i < 8; i++) makeCloud(world, -20 + i * 6, 4 + hsh(i, 1) * 3, -34 + hsh(i, 2) * 30, 1.3);
  D = { theme, next, dest, T, t: 0, dur: TUNE.driveTime, speed: 7, lane: 0, laneX: LANE_X[0], car, moving, items: [], spawn: 0.9, slowSpawn: 3, caught: 0, hits: 0, done: false, paused: false, st: G.radio ? Math.max(0, CONFIG.radio.indexOf(G.radio)) : Math.floor(Math.random() * CONFIG.radio.length), song: 0 };
  cam.goal.set(0, 0.3, -0.6); cam.target.copy(cam.goal); cam.zoomGoal = 1.55; cam.zoom = 1.55; cam.yawGoal = 0; cam.yaw = 0; cam.pitch = 0.32; cam.base = 11; cam.orbit = 0;
  const dock = el('div', 'dock drv', `<div style="display:flex;gap:10px;align-items:center"><div style="flex:1;min-width:0"><h3 style="margin:0">${esc(CONFIG.car)}'s radio</h3><p class="sub" id="drvRadio" style="margin:2px 0 6px;font-size:14px"></p></div></div><div class="meter"><b id="drvBar"></b></div><p class="sub" style="margin:6px 0 0;font-size:13px"><span id="drvCnt">Balloons: 0</span> &middot; Left and right to switch lanes. Dodge cones, honk at slow drivers!</p>`);
  const nb = makeBtn('Next station', () => { if (D) { D.st = (D.st + 1) % CONFIG.radio.length; D.song = 0; drvRadio(); sfx('blip'); } }, 'opt'); nb.style.padding = '8px 12px'; dock.firstChild.append(nb);
  ui.append(dock); drvRadio();
  toast(T.label);
}
function drvRadio() { const r = $('#drvRadio'); if (!r || !D) return; const a = CONFIG.radio[D.st], bars = CONFIG.radioBars[a] || []; r.textContent = 'Now playing: ' + a + (bars.length ? ', ' + bars[Math.floor(D.song) % bars.length] : ''); }
function driveLane(d) { if (typeof SB !== 'undefined' && SB) { sbLane(d); return; } if (!D || D.done || D.paused) return; const l = clamp(D.lane + d, 0, 1); if (l !== D.lane) { D.lane = l; sfx('whoosh'); } }
function makeSlowCar(lane) {
  const c = makeCar(['#ffffff', '#c9b6f2', '#ffd166', '#9fe0c9'][Math.floor(Math.random() * 4)]); c.userData.flower.visible = false;
  c.position.set(LANE_X[lane], 0, -26); c.rotation.y = Math.PI; world.add(c); return c;
}
function honkPrompt(it) {
  D.paused = true; G.mode = 'menu'; sfx('honk');
  const p = el('div', 'panel low', '<h2>Slow driver ahead!</h2><p class="sub">Give them a honk. What does ' + esc(CONFIG.name) + ' yell?</p><div class="grid3"></div>');
  ui.append(p);
  const btns = CONFIG.honks.map(h => makeBtn('<span>' + esc(h) + '</span>', () => {
    p.remove(); MENU = null; it.honked = true; it.rel = -5;
    stat('happy', 4, true); sfx('honk'); sfx('good'); toast(h, true);
    FX.emit(D.car.position.x, 1.2, D.car.position.z - 1, ['#ffd166', '#ff7aa8', '#ffffff'], 18, 2.5, { g: 1, life: 1 });
    D.paused = false; G.mode = 'drive';
  }));
  btns.forEach(b => b.style.alignItems = 'center');
  p.querySelector('.grid3').append(...btns);
  setMenu(btns, { cols: 3 });
}
function updateDrive(dt) {
  if (!D || G.scene !== 'drive') return;
  const wheelSpin = D.paused ? 0 : dt * D.speed * 6;
  (D.car.userData.wheels || []).forEach(w => w.rotation.x -= wheelSpin);
  D.car.userData.flower.rotation.z = Math.sin(G.t * 8) * 0.4;
  driftClouds(dt, 30);
  if (D.paused) return;
  D.t += dt; const mv = D.speed * dt;
  D.laneX = lerp(D.laneX, LANE_X[D.lane], 1 - Math.pow(0.0005, dt));
  D.car.position.x = D.laneX; D.car.rotation.y = Math.PI + (D.laneX - LANE_X[D.lane]) * 0.35;
  D.car.userData.body.position.y = Math.abs(Math.sin(D.t * 11)) * 0.02;
  D.moving.forEach(p => { p.position.z += mv; if (p.position.z > 8) p.position.z -= ROAD_LEN; });
  D.spawn -= dt; D.slowSpawn -= dt;
  if (D.spawn <= 0 && D.t < D.dur - 2) {
    D.spawn = 0.75 + Math.random() * 0.6;
    const lane = Math.random() < 0.5 ? 0 : 1, kind = Math.random() < 0.7 ? 'balloon' : 'cone';
    const g = kind === 'balloon' ? makeBalloon(world, LANE_X[lane], 0.1, -26, CONFETTI[Math.floor(Math.random() * 5)], 0.5) : grp(world, LANE_X[lane], 0, -26);
    if (kind === 'cone') { mk(G_CONE, '#ffa94d', [0.35, 0.5, 0.35], [0, 0.25, 0], g); mk(G_CYL, '#ffffff', [0.26, 0.07, 0.26], [0, 0.25, 0], g); mk(G_BOX, '#ffa94d', [0.42, 0.04, 0.42], [0, 0.02, 0], g); }
    D.items.push({ g, lane, kind, phase: Math.random() * TAU });
  }
  if (D.slowSpawn <= 0 && D.t > 1 && D.t < D.dur - 4) { D.slowSpawn = 5 + Math.random() * 2; const lane = D.lane; D.items.push({ g: makeSlowCar(lane), lane, kind: 'slow', rel: 3.2, honked: false }); }
  D.items = D.items.filter(it => {
    if (it.kind === 'slow') {
      it.g.position.z += it.rel * dt; (it.g.userData.wheels || []).forEach(w => w.rotation.x -= dt * 20);
      if (!it.honked && it.g.position.z > D.car.position.z - 2.8) {
        if (it.lane !== D.lane) { it.honked = true; it.rel = -3; }
        else { honkPrompt(it); }
      }
      if (it.g.position.z < -30) { world.remove(it.g); return false; }
      return true;
    }
    it.g.position.z += mv; if (it.kind === 'balloon') it.g.position.y = 0.1 + Math.sin(D.t * 3 + it.phase) * 0.12;
    if (Math.abs(it.g.position.z - D.car.position.z) < 0.7 && it.lane === D.lane) {
      world.remove(it.g);
      if (it.kind === 'balloon') { D.caught++; G.balloons++; sfx('pop'); confetti(D.car.position.x, 1.2, D.car.position.z, 20); if (G.balloons >= TUNE.balloonsForBadge) earn('balloons'); }
      else { D.hits++; sfx('bad'); cam.shake = SET.calm ? 0 : 0.2; FX.emit(D.car.position.x, 0.4, D.car.position.z - 0.8, '#ffa94d', 10, 2); }
      $('#drvCnt').textContent = 'Balloons: ' + D.caught;
      return false;
    }
    if (it.g.position.z > 8) { world.remove(it.g); return false; }
    return true;
  });
  D.song += dt / 5; if (Math.floor(D.song) !== Math.floor(D.song - dt / 5)) drvRadio();
  const bar = $('#drvBar'); if (bar) bar.style.width = Math.min(100, D.t / D.dur * 100) + '%';
  if (D.t >= D.dur && !D.done) {
    D.done = true; G.mode = 'busy'; sfx('honk');
    if (D.caught) stat('happy', Math.min(10, D.caught * 2), true);
    if (!D.hits) stat('energy', 5, true);
    const lines = D.hits === 0 ? ["Clean drive, zero cones!", CONFIG.car + " made it to " + D.dest + "."] : [CONFIG.car + " made it to " + D.dest + ".", "Only bumped " + D.hits + " cone" + (D.hits > 1 ? "s" : "") + ". " + CONFIG.car + " forgives you."];
    if (D.caught) lines.push(D.caught + " balloon" + (D.caught === 1 ? "" : "s") + " caught on the way.");
    const next = D.next;
    say(lines, () => fade(() => { D = null; loadMap(next); }));
  }
}

/* ---------------- squat rack: timing bar ---------------- */
function liftGame() {
  const L = G.lift = { rep: 0, pos: 0, dir: 1, speed: 0.95, zc: 0.5, zw: 0.2, res: [], lock: 0, end: 0 };
  const p = panel('Squat rack', 'Press A (or tap Lift!) when the marker is in the pink zone. The darker middle is a perfect rep.');
  p.insertAdjacentHTML('beforeend', '<div class="bar"><div class="zone"></div><div class="mark"></div></div><p class="sub" id="liftRes" style="text-align:center;margin:4px 0">Rep 1 of 3</p><div class="reps">' + '<span class="rep"></span>'.repeat(3) + '</div>');
  const tap = makeBtn('Lift!', liftPress, 'big'); tap.style.width = '100%'; p.append(tap);
  p.classList.add('low'); L.el = p; G.mode = 'lift'; placeZone();
  const r = W.objs.find(o => o.ch === 'r' && Math.abs(o.x - W.player.x) + Math.abs(o.z - W.player.z) < 4) || W.objs.find(o => o.ch === 'r');
  if (r) { cam.goal.set(r.x + 0.5, 0.6, r.z + 1); cam.zoomGoal = 1.8; }
}
function placeZone() { const L = G.lift, z = L.el.querySelector('.zone'); z.style.left = ((L.zc - L.zw / 2) * 100) + '%'; z.style.width = (L.zw * 100) + '%'; }
function updateLift(dt) {
  const L = G.lift; if (!L || G.mode !== 'lift') return;
  if (L.end) { L.end -= dt; if (L.end <= 0) finishLift(); return; }
  if (L.lock > 0) { L.lock -= dt; if (W.player) W.player.g.userData.body.scale.y = lerp(W.player.g.userData.body.scale.y, 1, 0.2); return; }
  L.pos += L.dir * L.speed * dt; if (L.pos > 1) { L.pos = 1; L.dir = -1; } if (L.pos < 0) { L.pos = 0; L.dir = 1; }
  L.el.querySelector('.mark').style.left = (L.pos * 100) + '%';
}
function liftPress() {
  const L = G.lift; if (!L || L.lock > 0 || L.end) return;
  const d = Math.abs(L.pos - L.zc), res = d < L.zw * 0.15 ? 'perfect' : d < L.zw / 2 ? 'good' : 'miss';
  L.res.push(res); L.el.querySelectorAll('.rep')[L.rep].classList.add(res);
  $('#liftRes').textContent = res === 'perfect' ? 'PERFECT rep!' : res === 'good' ? 'Good rep!' : 'Wobbly one. Shake it off!';
  sfx(res === 'miss' ? 'bad' : 'good');
  if (W.player) { W.player.g.userData.body.scale.y = 0.72; if (res !== 'miss') sparkle(W.player.g.position.x, 1.2, W.player.g.position.z, res === 'perfect' ? 26 : 12); }
  L.rep++; L.lock = 0.6; L.speed += 0.25; L.zw = Math.max(0.12, L.zw - 0.03); L.zc = 0.25 + Math.random() * 0.5; placeZone();
  if (L.rep >= 3) L.end = 0.9;
}
function finishLift() {
  const L = G.lift; G.lift = null; clearUI(); cam.zoomGoal = 1;
  const perf = L.res.filter(r => r === 'perfect').length, good = L.res.filter(r => r !== 'miss').length;
  F.lifted = true; stat('gains', 8 + good * 4); stat('energy', -10, true);
  if (perf >= 2) { F.pr = true; toast('New PR!', true); confetti(W.player.g.position.x, 1.4, W.player.g.position.z, 60); }
  G.mode = 'map';
  say([perf >= 2 ? "NEW PR! " + CONFIG.name + " just lifted her heaviest ever. The whole gym turns around." : good >= 2 ? "Solid set. Strong and steady." : "Tough set, but she finished it.", "Wait... something clanks behind the rack.", "The Last Set appears!"], () => startBattle('lastset'));
}

/* ---------------- battles: silly foes, can't really lose ---------------- */
const ENEMIES = {
  lastset: {
    name: 'The Last Set', lv: '99', hp: 100, intro: "It dares " + CONFIG.name + " to do one more rep.",
    attacks: [["Burning quads", 12], ["Shaky arms", 10], ["One more rep?", 8]],
    moves: [
      { n: 'Deadlift', d: 'Big damage', f: b => hit(b, 30) },
      { n: 'Chalk up', d: 'Damage, next hit +10', f: b => { const m = hit(b, 18); b.bonus += 10; return m + ' Grip secured.'; } },
      { n: 'Deep breath', d: 'Restore HP', f: b => heal(b, 25) },
      { n: 'Pre-workout', d: 'Next hit doubles', f: b => { b.mult = 2; sfx('good'); return 'Pre-workout kicks in. Next hit doubles!'; } }
    ],
    win() { F.gymBattle = true; stat('gains', 10); if (F.pr) earn('gains'); say(["The Last Set has been conquered!", "Head to the lockers to change for work."], refreshHints); }
  },
  inbox: {
    name: 'Inbox Overload', lv: '99', hp: 120, intro: "Four hundred unread emails. All marked urgent.",
    attacks: [["Reply-all storm", 12], ["Meeting invite", 10], ["Per my last email", 14]],
    moves: [
      { n: 'Filter rules', d: 'Big damage', f: b => hit(b, 30) },
      { n: 'Quick reply', d: 'Damage, next hit +10', f: b => { const m = hit(b, 18); b.bonus += 10; return m + ' Momentum!'; } },
      { n: 'Coffee break', d: 'Restore HP', f: b => heal(b, 25) },
      { n: 'Focus mode', d: 'Next hit doubles', f: b => { b.mult = 2; sfx('good'); return 'Notifications off. Next hit doubles!'; } }
    ],
    win() { F.officeBattle = true; stat('happy', 8); say(["Inbox Overload was defeated!", "Inbox zero. The office applauds.", F.sorted ? "Everything is done. Lunch time!" : "Now file those reports at your desk."], refreshHints); }
  }
};
function startBattle(kind) {
  const E = ENEMIES[kind];
  G.b = { kind, E, ehp: E.hp, php: 100, mult: 1, bonus: 0 };
  clearUI(); G.mode = 'busy'; sfx('whoosh');
  const p = W.player, [dx, dz] = DIRS[p.dir];
  let fx = p.x + dx * 2, fz = p.z + dz * 2; if (!inMap(fx, fz)) { fx = p.x; fz = p.z - 2; }
  const foe = makeFoe(kind); foe.userData.body.rotation.x = -0.6; foe.position.set(fx, 1.1, fz); foe.rotation.y = Math.atan2(p.x - fx, p.z - fz); world.add(foe); popIn(foe); G.b.foe = foe;
  cam.goal.set((p.x + fx) / 2, 0.6, (p.z + fz) / 2); cam.zoomGoal = 1.7;
  ui.append(el('div', 'hpbox ebox', `<div class="n"><span>${E.name}</span><span>Lv ${E.lv}</span></div><div class="hp"><b class="ehp" style="background:#ff7aa8"></b></div>`));
  ui.append(el('div', 'hpbox pbox', `<div class="n"><span>${esc(CONFIG.name)}</span><span>Glow ${G.stats.glow}</span></div><div class="hp"><b class="php"></b></div>`));
  const dock = el('div', 'dock', '<h3 class="bmsg"></h3><div class="grid2 bmoves"></div>'); ui.append(dock);
  dock.addEventListener('pointerdown', e => { if (G.mode === 'bmsg' && !e.target.closest('button')) { e.preventDefault(); bAdvance(); } });
  battleUI(); bMsg(E.name + ' blocks the way!', () => bMsg(E.intro, bMoves));
}
function battleUI() { const b = G.b; if (!b) return; const e = ui.querySelector('.ehp'), p = ui.querySelector('.php'); if (e) e.style.width = Math.max(0, b.ehp / b.E.hp * 100) + '%'; if (p) p.style.width = b.php + '%'; }
function bMsg(text, next) { const m = ui.querySelector('.bmsg'), mv = ui.querySelector('.bmoves'); if (!m) return; mv.style.display = 'none'; mv.innerHTML = ''; m.textContent = text; MENU = null; G.mode = 'bmsg'; G.bnext = next; }
function bAdvance() { if (G.mode !== 'bmsg') return; sfx('blip'); const n = G.bnext; G.bnext = null; n && n(); }
function bMoves() {
  const b = G.b, m = ui.querySelector('.bmsg'), mv = ui.querySelector('.bmoves');
  m.textContent = 'What will ' + CONFIG.name + ' do?'; mv.style.display = 'grid';
  const btns = b.E.moves.map(mo => makeBtn(`<span>${mo.n}</span><small>${mo.d}</small>`, () => { const res = mo.f(b); battleUI(); bMsg(CONFIG.name + ' used ' + mo.n + '!', () => bMsg(res, () => b.ehp <= 0 ? bWin() : bEnemy())); }));
  mv.append(...btns); setMenu(btns, { cols: 2, keepMode: true }); G.mode = 'bmenu';
}
function hit(b, base) {
  const crit = Math.random() < G.stats.glow / 250, dmg = Math.round((base + b.bonus) * b.mult * (crit ? 1.5 : 1)); b.bonus = 0; b.mult = 1;
  b.ehp -= dmg; sfx('hit'); cam.shake = SET.calm ? 0 : 0.18;
  const f = b.foe; if (f) { f.userData.hitT = 0.4; confetti(f.position.x, f.position.y, f.position.z, 24); }
  return (crit ? 'A glowing critical hit! ' : '') + dmg + ' damage!' + (b.ehp <= 0 ? '' : dmg >= 30 ? " It's super effective!" : '');
}
function heal(b, n) { b.php = Math.min(100, b.php + n); sfx('good'); if (W.player) sparkle(W.player.g.position.x, 1, W.player.g.position.z, 18); return CONFIG.name + ' feels refreshed. +' + n + ' HP.'; }
function bEnemy() {
  const b = G.b, a = b.E.attacks[Math.floor(Math.random() * b.E.attacks.length)];
  b.php = Math.max(0, b.php - a[1]); battleUI(); sfx('bad');
  if (W.player) W.player.g.userData.body.scale.set(1.2, 0.8, 1.2);
  bMsg(b.E.name + ' used ' + a[0] + '!', () => {
    if (b.php <= 0) { b.php = 45; battleUI(); bMsg(CONFIG.name + ' thinks of Luca and gets right back up!', bMoves); }
    else bMoves();
  });
}
function bWin() {
  const b = G.b; sfx('badge'); battleUI();
  if (b.foe) { b.foe.userData.dying = 1; confetti(b.foe.position.x, b.foe.position.y, b.foe.position.z, 80); }
  bMsg(b.E.name + ' poofs into confetti!', () => { clearUI(); if (b.foe) world.remove(b.foe); G.b = null; cam.zoomGoal = 1; G.mode = 'map'; b.E.win(); });
}
function updateBattle(dt, t) {
  const b = G.b; if (!b || !b.foe) return; const f = b.foe, u = f.userData;
  f.position.y = 1.1 + Math.sin(t * 2.5) * 0.15;
  u.body.rotation.z = Math.sin(t * 1.7) * 0.12;
  if (u.hitT > 0) { u.hitT -= dt; f.position.x += Math.sin(t * 80) * 0.04; u.body.scale.setScalar(1 - u.hitT * 0.4); } else u.body.scale.setScalar(1);
  if (u.dying) { u.dying -= dt * 2; f.scale.setScalar(Math.max(0.001, u.dying)); f.rotation.y += dt * 12; }
}

/* ---------------- report sprint ---------------- */
function sortGame() {
  const items = shuffle(SORT_ITEMS.slice()).slice(0, 4); let idx = 0, correct = 0;
  const p = panel('Report sprint', 'File each item in the right tray. Left, down and right work too.');
  p.insertAdjacentHTML('beforeend', '<p style="text-align:center"><span class="chip"><i></i><span class="it"></span></span></p><p class="sub cnt" style="text-align:center"></p><div class="grid3"></div>');
  const show = () => { const it = items[idx]; p.querySelector('.chip i').style.background = it[2]; p.querySelector('.it').textContent = it[0]; p.querySelector('.cnt').textContent = 'Item ' + (idx + 1) + ' of ' + items.length; };
  show();
  const btns = TRAYS.map((t, ti) => makeBtn(t, () => {
    if (items[idx][1] === ti) { correct++; sfx('good'); } else { sfx('bad'); p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake'); }
    idx++;
    if (idx >= items.length) {
      clearUI(); F.sorted = true; G.mode = 'map'; stat('happy', correct * 3);
      const lines = [correct + ' of ' + items.length + ' sorted correctly.'];
      if (correct >= 4) { lines.push("Award unlocked: Project Coordinator of the Year."); if (G.tidied >= 3) earn('tidy'); else lines.push("Tidy the bedroom too next time for the Tidy badge."); confetti(W.player.g.position.x, 1.3, W.player.g.position.z, 50); }
      else lines.push("Close enough. Nobody will find that muesli bar in the board pack.");
      say(lines, refreshHints);
    } else show();
  }));
  btns.forEach(b => b.style.alignItems = 'center');
  p.querySelector('.grid3').append(...btns);
  setMenu(btns, { cols: 3, start: 1 });
}

/* ---------------- cuddles with Luca: stroke him with the cursor or a finger ---------------- */
const PET_SPOTS = { ears: [0.19, 0.56, 0.3], head: [0, 0.88, 0.3], belly: [0, 0.24, 0.12], chin: [0, 0.52, 0.52] };
let PET = null;
function petGame() {
  if (!W || !W.luca) return;
  const L = W.luca;
  PET = { love: 0, spot: 'head', spotT: 3, done: 0, last: null, star: mk(G_STAR, '#ffd166', [0.14, 0.14, 0.14], [0, 0, 0], L.g, { noShadow: true, glow: true }) };
  G.mode = 'pet'; clearUI(); sfx('woof');
  cam.goal.set(L.g.position.x, 0.45, L.g.position.z); cam.zoomGoal = 3.3;
  const d = el('div', 'dock', `<h3>Cuddles with Luca</h3><p class="sub" style="margin:0 0 8px">Stroke him with your cursor or finger. His sparkly favourite spot fills the meter faster.</p><div class="meter"><b id="love"></b></div>`);
  const b = makeBtn('All done', () => endPet(false), 'opt'); b.style.marginTop = '10px'; d.append(b);
  ui.append(d); setMenu([b], { keepMode: true, onBack: () => endPet(false) });
  view.style.cursor = 'grab';
}
function petStroke(cx, cy, moved) {
  if (!PET || PET.done || !W || !W.luca) return;
  const g = W.luca.g, v = new THREE.Vector3(0, 0.4, 0); g.localToWorld(v);
  const scr = toScreen(v), edge = toScreen(g.localToWorld(new THREE.Vector3(0.5, 0.4, 0)));
  const R = Math.max(40, Math.hypot(edge.x - scr.x, edge.y - scr.y) * 1.15);
  if (Math.hypot(cx - scr.x, cy - scr.y) > R) return;
  const sp = g.localToWorld(new THREE.Vector3(...PET_SPOTS[PET.spot])), ss = toScreen(sp);
  const onSpot = Math.hypot(cx - ss.x, cy - ss.y) < R * 0.35;
  PET.love = Math.min(100, PET.love + moved * (onSpot ? 0.16 : 0.05));
  if (Math.random() < 0.25) FX.emit(sp.x, sp.y + 0.1, sp.z, onSpot ? ['#ffd166', '#ff7aa8'] : ['#ffb3cc'], onSpot ? 3 : 1, 0.8, { g: -1.5, life: 0.9 });
  g.userData.body.rotation.z = Math.sin(G.t * 10) * 0.05;
  if (onSpot && Math.random() < 0.05) sfx('blip');
  if (PET.love >= 100) cuddleDone();
}
function petPat() { if (!PET || PET.done) return; PET.love = Math.min(100, PET.love + 9); sfx('blip'); const p = W.luca.g.position; FX.emit(p.x, 0.9, p.z, '#ff7aa8', 6, 1, { g: -1.5 }); if (PET.love >= 100) cuddleDone(); }
function cuddleDone() {
  PET.done = 1; sfx('woof'); setTimeout(() => sfx('heart'), 300);
  const p = W.luca.g.position; for (let i = 0; i < 4; i++) setTimeout(() => FX.emit(p.x, 1.3, p.z, ['#ff7aa8', '#ff5c7a', '#ffd1e1'], 20, 2.2, { g: 1.5, life: 1.8 }), i * 250);
  setTimeout(() => endPet(true), 2400);
}
function updatePet(dt, t) {
  if (!PET) return;
  const bar = $('#love'); if (bar) bar.style.width = PET.love + '%';
  const g = W.luca.g;
  faceTo(g, [Math.sin(cam.yaw), Math.cos(cam.yaw)], dt, 8);
  PET.spotT -= dt; if (PET.spotT <= 0) { const ks = Object.keys(PET_SPOTS).filter(k => k !== PET.spot); PET.spot = ks[Math.floor(Math.random() * ks.length)]; PET.spotT = 3.5; }
  PET.star.position.set(...PET_SPOTS[PET.spot]); PET.star.position.z += 0.1; PET.star.rotation.z += dt * 3; PET.star.scale.setScalar(0.12 + Math.sin(t * 8) * 0.03);
  const u = g.userData; u.tail.rotation.z = Math.sin(t * (10 + PET.love * 0.2)) * 0.8;
  if (PET.done) { PET.done += dt; u.body.rotation.z = lerp(u.body.rotation.z, Math.PI / 2.3, 0.1); u.body.position.y = 0.12; u.legs.forEach((l, i) => l.rotation.x = Math.sin(t * 16 + i) * 0.6); }
}
function endPet(full) {
  if (!PET) return;
  const g = W.luca.g; g.remove(PET.star); g.userData.body.rotation.z = 0; g.userData.body.position.y = 0;
  PET = null; clearUI(); view.style.cursor = ''; cam.zoomGoal = 1; G.mode = 'map';
  if (full) {
    const first = !G.lucaPat[W.id]; G.lucaPat[W.id] = true;
    if (first) stat('happy', 10); else stat('happy', 2);
    earn('cuddle');
    say(["Luca melts into a puddle of cuddles.", { n: 'Luca', t: "Woof! (Translation: best birthday ever.)" }]);
  }
}
function toScreen(v) { const p = v.clone().project(camera); return { x: (p.x + 1) / 2 * innerWidth, y: (1 - p.y) / 2 * innerHeight }; }

/* ---------------- the locker secret: a little electric buddy pops out holding the card ---------------- */
function cardBuddy() {
  if (!W || W.id !== 'gym' || W.buddy) return;
  const L = W.objs.find(o => o.ch === 'L'); if (!L) return;
  const b = makePikachu(); b.position.set(L.x + L.w + 0.1, 0, L.z + 0.55); b.rotation.y = -0.3; b.userData.s = 1.3; world.add(b); popIn(b);
  const card = makeHoloCard(b); card.position.set(0, 0.62, 0.3); card.rotation.x = -0.2; card.scale.setScalar(0.8);
  W.buddy = b; sfx('secret'); sparkle(b.position.x, 1, b.position.z, 30);
}
function updateBuddy(dt, t) {
  const b = W && W.buddy; if (!b) return; const u = b.userData; if (b.userData.pop == null) b.scale.setScalar(1.3);
  b.position.y = SET.calm ? 0 : Math.max(0, Math.sin(t * 5)) * 0.18;
  u.ears.forEach((e, i) => e.rotation.z = (i ? 1 : -1) * (0.45 + Math.sin(t * 6 + i) * 0.08));
  u.tail.rotation.z = -0.25 + Math.sin(t * 4) * 0.15; u.head.rotation.z = Math.sin(t * 2) * 0.08;
  if (Math.random() < dt * 3) FX.emit(b.position.x + (Math.random() - 0.5) * 0.4, 1.1, b.position.z, ['#fff4b0', '#ffd83d'], 2, 1.5, { g: 0, life: 0.4 });
}
