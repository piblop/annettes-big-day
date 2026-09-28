/* =========================================================
   MAIN: title party island, input (keys, D-pad, taps, strokes), loop, QA hook
   ========================================================= */
const TOUCH = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window;

/* ---------------- title: a party island with the whole cast ---------------- */
function titleScreen() {
  clearWorld(); clearUI(); G.scene = 'title'; G.mode = 'title'; showHUD(false);
  G.clock = SCENE_TIME.title; setSky('morning'); fitSun(0, 0, 8);
  W = { id: 'title', objs: [], npcs: [], hearts: [], markers: [], anim: [], dispose: [], walls: [], decor: [] };
  makeIslandBase(world, 8, 6, GRASS, 0, 0);
  mk(G_BOX, GRASS, [8, 0.2, 6], [0, -0.1, 0], world);
  mk(G_CYL, '#ffd1e1', [3.6, 0.08, 3.6], [0, 0.04, 0.3], world, { noShadow: true });
  mk(G_CYL, '#fff0f6', [2.8, 0.1, 2.8], [0, 0.05, 0.3], world, { noShadow: true });
  const cast = [[makeAnnette('office'), -0.3, 0.6], [makePerson(LOOK.mum), -1.4, 0.1], [makePerson(LOOK.paulo), 0.8, 0.1], [makeLuca(), 0.35, 1.3]];
  W.cast = cast.map(([g, x, z]) => { g.position.set(x, 0.1, z); world.add(g); popIn(g, 0.2 + x * 0.05); return g; });
  const cake = makeCake(world, -0.5, 0, -1.5, 3); cake.scale.setScalar(0.8); W.cake = cake;
  makeTree(world, -3, -1.8, 1.1); makeTree(world, 3.1, -1.6, 0.9, '#ffb3cc'); makePalm(world, 3.2, 1.9); makePlant(world, -3.1, 2, true);
  for (let i = 0; i < 9; i++) makeFlower(world, -3.6 + i * 0.9, 2.75, CONFETTI[i % 5]);
  for (let i = 0; i < 6; i++) { const b = makeBalloon(world, -2.6 + i * 1.05, 0, -2.4 + (i % 2) * 0.4, CONFETTI[i % 5], 1.6 + (i % 3) * 0.3); b.userData.bob = true; W.anim.push(b); }
  makeFairyLights(world, -3.5, -2.6, 3.5, -2.6, 2.2, 18);
  for (let i = 0; i < 7; i++) makeCloud(world, -22 + i * 7, -6 + hsh(i, 1) * 1.5, -10 + hsh(i, 2) * 18, 1.4);
  cam.base = 11; cam.pitch = 0.5; cam.zoomGoal = 1.35; cam.zoom = 1.35; cam.goal.set(0, 0.8, 0.2); cam.target.copy(cam.goal); cam.orbit = SET.calm ? 0.03 : 0.1;

  const t = el('div', 'title', `<div class="logo"><h1>${esc(CONFIG.name)}'s Big Day</h1><span class="v2">v2 &middot; the whimsical edition</span></div>`);
  const w = el('div', 'tbtns'), btns = [];
  const save = loadCheckpoint();
  if (save) btns.push(makeBtn('Continue', () => { audioInit(); fade(() => resumeGame(save)); }, 'big'));
  btns.push(makeBtn(save ? 'New day' : 'Start the day', () => { audioInit(); fade(startGame); }, save ? 'big sky' : 'big'));
  if (typeof startWeekend === 'function') btns.push(makeBtn('Weekend Adventure', () => { audioInit(); fade(startWeekend); }, 'big alt'));
  if (typeof startHoliday === 'function') btns.push(makeBtn('Go on holiday', () => { audioInit(); fade(startHoliday); }, 'big sky'));
  btns.push(makeBtn('Settings', () => { audioInit(); openSettings(); }, 'big sky'));
  w.append(...btns); t.append(w); ui.append(t);
  setMenu(btns, { cols: btns.length });
}
function resetDay() {
  Object.assign(G.stats, { happy: 60, glow: 40, energy: 70, gains: 30 }); updateHUD();
  [G.F, G.secrets, G.badges, G.hearts, G.lucaPat].forEach(o => Object.keys(o).forEach(k => delete o[k]));
  Object.assign(G, { outfit: 'office', wearing: 'pj', radio: null, tidied: 0, balloons: 0, b: null, lift: null });
}
function startGame() { cam.orbit = 0; resetDay(); loadMap('bedroom'); }
function resumeGame(s) {
  cam.orbit = 0; resetDay();
  Object.assign(G.stats, s.stats); Object.assign(G.F, s.F); Object.assign(G.secrets, s.secrets); Object.assign(G.badges, s.badges); Object.assign(G.hearts, s.hearts); Object.assign(G.lucaPat, s.lucaPat || {});
  Object.assign(G, { outfit: s.outfit || 'office', radio: s.radio, tidied: s.tidied || 0, balloons: s.balloons || 0 });
  if (s.map === 'bedroom' && G.tidied) MAPS.bedroom.rows = MAPS.bedroom.rows.map(r => r.replace(/x/g, () => '.'));
  loadMap(s.map); toast('Welcome back!');
}

/* ---------------- input: keys ---------------- */
const KEYDIR = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' };
const KEY_A = new Set(['Space', 'Enter', 'KeyZ', 'KeyJ']), KEY_B = new Set(['Escape', 'KeyX', 'KeyK', 'Backspace']);
const held = [];
function heldDir() { return held.length ? held[held.length - 1] : null; }
function press(k) {
  audioInit();
  if (DLG) { if (k === 'a' || k === 'b') advance(); return; }
  if (G.mode === 'bmsg') { if (k === 'a') bAdvance(); return; }
  if (G.mode === 'lift') { if (k === 'a') liftPress(); return; }
  if (G.mode === 'pet') { if (k === 'a') petPat(); else if (k === 'b') endPet(false); return; }
  if (G.mode === 'drive') { if (k === 'left') driveLane(-1); if (k === 'right') driveLane(1); return; }
  if (MENU && G.mode !== 'map') {
    if (MENU.cols === 3 && MENU.b.length === 3 && { left: 0, down: 1, right: 2 }[k] != null && ui.querySelector('.grid3')) { focusMenu({ left: 0, down: 1, right: 2 }[k]); menuPick(); return; }
    if (k === 'a') menuPick(); else if (k === 'b') menuBack(); else menuMove(k);
    return;
  }
  if (G.mode === 'map') { if (k === 'a') interact(); if (k === 'b') openLog(); }
}
addEventListener('keydown', e => {
  const d = KEYDIR[e.code];
  if (d) { e.preventDefault(); if (!e.repeat) { if (!held.includes(d)) held.push(d); if (G.mode !== 'map') press(d); } return; }
  if (e.repeat) return;
  if (KEY_A.has(e.code)) { e.preventDefault(); press('a'); }
  else if (KEY_B.has(e.code)) { e.preventDefault(); press('b'); }
  else if (G.mode === 'map' && (e.code === 'KeyQ' || e.code === 'KeyE')) rotateView(e.code === 'KeyQ' ? 1 : -1);
});
addEventListener('keyup', e => {
  const d = KEYDIR[e.code]; if (d) { const i = held.indexOf(d); if (i >= 0) held.splice(i, 1); }
});
addEventListener('blur', () => { held.length = 0; });

/* ---------------- input: on-screen D-pad + A/B ---------------- */
document.querySelectorAll('#pad button').forEach(b => {
  const k = b.dataset.k, isDir = !!DIRS[k];
  b.addEventListener('pointerdown', e => { e.preventDefault(); b.setPointerCapture(e.pointerId); buzz(8); if (isDir) { if (!held.includes(k)) held.push(k); if (G.mode !== 'map') press(k); } else press(k); });
  const up = () => { if (isDir) { const i = held.indexOf(k); if (i >= 0) held.splice(i, 1); } };
  b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
});

/* ---------------- input: pointer on the diorama ---------------- */
const RAY = new THREE.Raycaster(), NDC = new THREE.Vector2(), HIT = new THREE.Vector3();
function tileUnder(cx, cy, y) {
  NDC.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); RAY.setFromCamera(NDC, camera);
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -(y || 0));
  return RAY.ray.intersectPlane(plane, HIT) ? { x: Math.round(HIT.x), z: Math.round(HIT.z) } : null;
}
function mapTap(cx, cy) {
  // furniture and people stand tall, so try a mid-height plane first, then the floor
  for (const y of [0.9, 0.45]) { const t = tileUnder(cx, cy, y); if (t && inMap(t.x, t.z) && (objAt(t.x, t.z) || (W.luca && W.luca.x === t.x && W.luca.z === t.z))) return tapTile(t.x, t.z); }
  const t = tileUnder(cx, cy, 0); if (t) tapTile(t.x, t.z);
}
const PTR = new Map(); let pinch = null;
const cv = renderer.domElement;
cv.addEventListener('contextmenu', e => e.preventDefault());
cv.addEventListener('pointerdown', e => {
  audioInit(); try { cv.setPointerCapture(e.pointerId); } catch (x) {}
  PTR.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, button: e.button, moved: false, type: e.pointerType });
  if (G.mode === 'pet') { petPat(); view.style.cursor = 'grabbing'; }
  else if (G.mode === 'drive') driveLane(e.clientX < innerWidth / 2 ? -1 : 1);
  else if (DLG) advance();
  else if (G.mode === 'bmsg') bAdvance();
  else if (G.mode === 'lift') liftPress();
});
cv.addEventListener('pointermove', e => {
  const p = PTR.get(e.pointerId);
  if (G.mode === 'pet') { const last = PET && PET.last; if (PET) { if (last) petStroke(e.clientX, e.clientY, Math.min(60, Math.hypot(e.clientX - last.x, e.clientY - last.y))); PET.last = { x: e.clientX, y: e.clientY }; } return; }
  if (!p) return;
  p.x = e.clientX; p.y = e.clientY;
  if (Math.hypot(p.x - p.sx, p.y - p.sy) > 8) p.moved = true;
});
function ptrEnd(e) {
  const p = PTR.get(e.pointerId); PTR.delete(e.pointerId); if (PTR.size < 2) pinch = null;
  if (G.mode === 'pet') view.style.cursor = 'grab';
  if (!p || p.moved || p.button === 2) return;
  if (G.mode === 'map' && W && W.player) mapTap(e.clientX, e.clientY);
}
cv.addEventListener('pointerup', ptrEnd);
cv.addEventListener('pointercancel', e => { PTR.delete(e.pointerId); pinch = null; });
cv.addEventListener('pointerleave', () => { if (PET) PET.last = null; });

/* ---------------- loop: fixed-ish sim, render every frame ---------------- */
let last = performance.now(), clockShown = '';
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000); last = now; G.t += dt; const t = G.t;
  try {
    if (G.mode === 'map' && G.scene === 'map') G.clock += dt * TUNE.minutesPerTick / TUNE.tick;
    const c = fmtClock(G.clock); if (c !== clockShown) { clockShown = c; $('#clock').textContent = c; }
    if (G.scene === 'map') { updatePlayer(dt); updateWorld(dt, t); updateLift(dt); updateBattle(dt, t); updatePet(dt, t); if (W && W.player && !PET) { const p = W.player.g.position; if (!G.b && !G.lift) cam.goal.set(p.x, 0.5, p.z - 0.3); } updateBuddy(dt, t); }
    else if (G.scene === 'lunch') { updateWorld(dt, t); if (W && W.steam && Math.random() < dt * 8) FX.emit(3 + (Math.random() - 0.5) * 0.3, 1, 2, ['#ffffff', '#f5eef8'], 1, 0.4, { g: -0.8, life: 1.4 }); }
    else if (G.scene === 'drive') updateDrive(dt);
    else if (G.scene === 'snow') updateSnow(dt);
    else if (G.scene === 'finale' || G.scene === 'credits') { updateFireworks(dt); updateWorld(dt, t); }
    else if (G.scene === 'title') { updateWorld(dt, t); if (W && W.cast) W.cast.forEach((g, i) => { animatePerson(g, false, dt, t + i); g.position.y = 0.1 + (SET.calm ? 0 : Math.max(0, Math.sin(t * 2.4 + i * 1.3)) * 0.1); g.rotation.y = Math.sin(t * 0.7 + i) * 0.35; }); if (W && W.cake) W.cake.userData.flames.forEach((f, i) => f.scale.y = 0.1 * (0.85 + Math.sin(t * 14 + i) * 0.15)); }
    updateDlg(dt); FX.update(dt); updateCamera(dt);
    renderer.render(scene, camera);
  } catch (err) { console.error(err); }
  requestAnimationFrame(frame);
}
function resize() { renderer.setSize(innerWidth, innerHeight); updateCamera(0.016); }
addEventListener('resize', resize);
saveSettings(); updateHUD(); resize();

/* ---------------- QA hook: ?qa=<scene> jumps straight in (for screenshots and tests) ---------------- */
(function boot() {
  const qa = (location.search.match(/[?&]qa=([a-z]+)/) || [])[1];
  if (qa) { document.body.classList.add('qa'); const s = document.createElement('style'); s.textContent = '#fade{transition:none!important}.roll{animation-play-state:paused!important;top:6%!important}'; document.head.append(s); }
  const go = {
    map: () => loadMap((location.search.match(/[?&]map=([a-z]+)/) || [])[1] || 'bedroom'),
    drive: () => buildDrive('city', 'office', CONFIG.company),
    lift: () => { loadMap('gym'); setTimeout(() => { DLG && (DLG.q = [], nextLine()); Object.assign(W.player, { x: 2, z: 2, tx: 2, tz: 2, dir: 'up' }); placeEntity(W.player, 1); liftGame(); }, 950); },
    battle: () => { loadMap('office'); setTimeout(() => { DLG && (DLG.q = [], nextLine()); W.player.dir = 'up'; startBattle('inbox'); }, 950); },
    report: () => { loadMap('office'); setTimeout(() => { DLG && (DLG.q = [], nextLine()); sortGame(); }, 950); },
    drinks: () => { loadMap('botanist'); setTimeout(() => { DLG && (DLG.q = [], nextLine()); drinkMenu(); }, 950); },
    pet: () => { loadMap('bedroom'); setTimeout(() => { DLG && (DLG.q = [], nextLine()); petGame(); }, 950); },
    lunch: () => lunchScene(),
    finale: () => finale(),
    credits: () => { buildHarbour(); credits(); },
    title: () => titleScreen()
  };
  Object.assign(go, QA_EXTRA);
  (go[qa] || titleScreen)();
  requestAnimationFrame(frame);
})();
