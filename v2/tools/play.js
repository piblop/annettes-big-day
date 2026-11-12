// Scripted playthrough in headless Chrome: title > whole day (with every side quest) > credits. Fails on console errors.
// Usage: node v2/tools/play.js   (W=390 H=844 for a phone viewport)
const { spawn } = require('child_process'), fs = require('fs'), path = require('path'), os = require('os');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const root = path.join(__dirname, '..'), out = path.join(root, 'screenshots'); fs.mkdirSync(out, { recursive: true });
const url = 'file:///' + path.join(root, 'index.html').split(path.sep).join('/');
const Wd = +process.env.W || 1280, Ht = +process.env.H || 800;
const PORT = +process.env.PORT || 9334;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SCRIPT = `(async () => {
  const log = [], sleep = async ms => { const t = G.t + ms / 1100; await new Promise(r => setTimeout(r, ms)); for (let i = 0; i < 400 && G.t < t; i++) await new Promise(r => setTimeout(r, 50)); }, step = s => { log.push(s); window.__step = s; };
  const flush = async (n) => { let idle = 0; for (let i = 0; i < 400 && idle < (n || 6); i++) { if (typeof MOMENT !== 'undefined' && MOMENT) { idle = 0; MOMENT.skip(); } else if (DLG) { idle = 0; DLG.q.length = 0; DLG.typing = false; nextLine(); } else idle++; await sleep(60); } };
  const btn = re => [...document.querySelectorAll('#ui button')].find(b => re.test(b.textContent));
  const pick = async re => { const b = btn(re); if (!b) throw new Error('no button ' + re + ' in ' + G.scene + '/' + G.mode); b.click(); await sleep(60); };
  const battle = async () => { for (let i = 0; i < 300 && G.b; i++) { if (G.mode === 'bmsg') bAdvance(); else if (G.mode === 'bmenu') MENU.b[0].click(); await sleep(40); } await flush(); };
  const drive = async () => { await sleep(900); if (G.scene !== 'drive') throw new Error('expected drive, got ' + G.scene); for (let i = 0; i < 90; i++) { if (D && D.paused) { window.__honked = (window.__honked || 0) + 1; await pick(/YALLAH|HABIBI|THIS GUY/); } await sleep(100); } if (D) { D.paused = false; D.t = D.dur; } await sleep(1200); await flush(12); await sleep(900); await flush(12); };
  step('title'); if (G.scene !== 'title') throw new Error('no title');
  await pick(/Start the day|New day/); await sleep(1500); await flush(12);
  step('bedroom'); if (G.mapId !== 'bedroom') throw new Error('no bedroom');
  const warp = async (x, z) => { Object.assign(W.player, { x, z, tx: x, tz: z, moving: false, path: [], pending: null }); placeEntity(W.player, 1); onArrive(); await sleep(700); await flush(); };
  // side quest: a lap of the block with Luca
  W.def.act.l(); await pick(/Walk the block/); await flush(); await sleep(1500); await flush(12);
  step('block'); if (G.mapId !== 'block') throw new Error('no block, at ' + G.mapId);
  for (const [x, z] of BLOCK_CORNERS) await warp(x, z);
  for (const [x, z] of SNIFF_SPOTS) { await warp(x, z); await sleep(2200); await flush(); }
  pickParcel(W.objs.find(o => o.ch === 'q')); await flush(); letterbox(5, 2); await flush(); letterbox(9, 2); await flush(); await sleep(400); await flush();
  if (!W.luca.g.userData.bandana) throw new Error('no bandana on Luca');
  talkDot(); await flush(); catTree(); await pick(/Pspsps/); await flush(); catTree(); await pick(/treat bag/); await flush(); await sleep(2600); await flush();
  step('magpie'); await warp(18, 5); await sleep(600); await flush(); await battle(); await sleep(400); await flush();
  const left = BLOCK_QUESTS.filter(q => questState(q) !== 2); if (left.length) throw new Error('block quests left: ' + left);
  if (!G.badges.neighbour) throw new Error('no neighbour badge');
  W.def.onDoor(); await pick(/Back inside/); await flush(); await sleep(1600); await flush(12);
  step('bedroom again'); if (G.mapId !== 'bedroom' || !F.walked) throw new Error('not back home, at ' + G.mapId);
  if (!W.luca.g.userData.bandana) throw new Error('bandana lost at home');
  outfitMenu(); await pick(/City office/); await flush();
  skincareGame(); for (const s of STEPS) await pick(new RegExp(s.split(':')[0])); await flush();
  musicMenu(); await pick(/Tupac/); await flush();
  talkMum(); await flush(); await pick(/hug/i); await flush();
  W.def.act.o(); await flush(); W.def.act.k(); await flush();
  W.objs.filter(o => o.ch === 'x').slice().forEach(o => tidyItem(o));
  petGame(); PET.love = 95; petPat(); await sleep(2800); await flush();
  if (!G.badges.cuddle) throw new Error('no cuddle badge');
  tapTile(6, 7); await sleep(1500);
  W.def.onDoor(); await flush(); await drive();
  step('gym'); if (G.mapId !== 'gym') throw new Error('no gym, at ' + G.scene);
  liftGame(); for (let i = 0; i < 3; i++) { G.lift.pos = G.lift.zc; liftPress(); await sleep(700); } await sleep(1300); await flush(); await battle();
  if (!F.gymBattle) throw new Error('gym battle not won');
  W.def.act.L(); await flush();
  W.def.onDoor(); await drive();
  step('office'); if (G.mapId !== 'office') throw new Error('no office');
  sortGame(); for (let i = 0; i < 4; i++) { const it = document.querySelector('.it').textContent, tray = SORT_ITEMS.find(s => s[0] === it)[1]; await pick(new RegExp('^' + TRAYS[tray])); } await flush();
  startBattle('inbox'); await sleep(300); await battle();
  step('caper'); W.def.act.K(); await flush(); for (const k of Object.keys(CAPER_AT)) { const [x, z] = k.split(',').map(Number); W.def.act.c(x, z); await flush(); }
  W.def.act.K(); await pick(/^Sam/); await flush(); await sleep(300); await flush();
  if (questState('caper') !== 2 || !G.badges.sleuth) throw new Error('caper not solved');
  W.def.onDoor(); await flush(); await sleep(2200);
  step('lunch'); if (G.scene !== 'lunch') throw new Error('no lunch');
  await pick(/ramen/i); await flush(); await drive();
  step('beach'); if (G.mapId !== 'beach') throw new Error('no beach');
  for (const [x, z] of GLINTS) { await warp(x, z); await sleep(500); await flush(); } await sleep(2000); await flush(); await sleep(400); await flush();
  if (questState('bottle') !== 2) throw new Error('bottle quest not done');
  if (questsDone() !== Object.keys(QUESTS).length || !G.badges.hero) throw new Error('side quests: ' + questsDone());
  W.def.act.J(); await flush(); await sleep(1600); await flush(12);
  step('botanist'); if (G.mapId !== 'botanist') throw new Error('no botanist');
  W.def.act.F(); await flush();
  drinkMenu(); await pick(/Pina/); await flush(); dinnerMenu(); await pick(/pizza/i); await flush();
  step('cake'); for (let i = 0; i < 3; i++) await pick(/Blow/); await sleep(1200); await flush(); await sleep(1500);
  step('finale'); if (G.scene !== 'finale') throw new Error('no finale, at ' + G.scene);
  await sleep(3500); await pick(/Roll credits/); await sleep(800);
  step('credits'); if (G.scene !== 'credits') throw new Error('no credits');
  return JSON.stringify({ log, hearts: heartsFound(), secrets: Object.keys(G.secrets), badges: Object.keys(G.badges), balloons: G.balloons, honks: window.__honked || 0, quests: questsDone(), heartsTotal: HEARTS_TOTAL });
})()`;
(async () => {
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'abd2p-'));
  const ch = spawn(CHROME, ['--headless=new', ...(process.getuid && process.getuid() === 0 ? ['--no-sandbox'] : []), '--remote-debugging-port=' + PORT, '--user-data-dir=' + prof, '--use-angle=swiftshader', '--enable-unsafe-swiftshader', `--window-size=${Wd},${Ht}`, 'about:blank'], { stdio: 'ignore' });
  let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch('http://127.0.0.1:' + PORT + '/json')).json(); if (tabs.find(t => t.type === 'page')) break; } catch (e) {} await sleep(200); }
  const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let id = 0; const pend = {}, errs = [];
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; }
    if (d.method === 'Runtime.exceptionThrown') errs.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
    if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errs.push(d.params.args.map(a => a.description || a.value).join(' ')); };
  const send = (method, params) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: Wd, height: Ht, deviceScaleFactor: 1, mobile: Wd < 600 });
  await send('Page.navigate', { url }); await sleep(2500);
  const r = await send('Runtime.evaluate', { expression: SCRIPT, awaitPromise: true, returnByValue: true, timeout: 900000 });
  await sleep(600);
  const shot = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, 'play-end' + (Wd < 600 ? '-phone' : '') + '.png'), Buffer.from(shot.result.data, 'base64'));
  if (r.result.exceptionDetails) { const st = await send('Runtime.evaluate', { expression: 'window.__step + " " + G.scene + "/" + G.mode', returnByValue: true }); console.log('FAIL at', st.result.result.value, '\n', r.result.exceptionDetails.exception?.description); }
  else console.log('PASS', r.result.result.value);
  console.log(errs.length ? 'CONSOLE ERRORS:\n' + errs.join('\n').slice(0, 3000) : 'no console errors');
  ws.close(); ch.kill(); process.exit(errs.length || r.result.exceptionDetails ? 1 : 0);
})();
