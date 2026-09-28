// Scripted Weekend Adventure playthrough in headless Chrome: startWeekend() > end card. Fails on console errors.
// Usage: node v2/tools/play-weekend.js   (PORT defaults to 9402; W/H for viewport)
const { spawn } = require('child_process'), fs = require('fs'), path = require('path'), os = require('os');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const root = path.join(__dirname, '..'), out = path.join(root, 'screenshots'); fs.mkdirSync(out, { recursive: true });
const url = 'file:///' + path.join(root, 'index.html').split(path.sep).join('/');
const Wd = +process.env.W || 1280, Ht = +process.env.H || 800;
const PORT = +process.env.PORT || 9402;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SCRIPT = `(async () => {
  const log = [], sleep = ms => new Promise(r => setTimeout(r, ms)), step = s => { log.push(s); window.__step = s; };
  const flush = async (n) => { let idle = 0; for (let i = 0; i < 400 && idle < (n || 6); i++) { if (typeof MOMENT !== 'undefined' && MOMENT) { idle = 0; MOMENT.skip(); } else if (DLG) { idle = 0; DLG.q.length = 0; DLG.typing = false; nextLine(); } else idle++; await sleep(60); } };
  const btn = re => [...document.querySelectorAll('#ui button')].find(b => re.test(b.textContent));
  const pick = async re => { const b = btn(re); if (!b) throw new Error('no button ' + re + ' in ' + G.scene + '/' + G.mode); b.click(); await sleep(60); };
  const drive = async () => { await sleep(900); if (G.scene !== 'drive') throw new Error('expected drive, got ' + G.scene); await sleep(1500); D.t = D.dur; await sleep(2200); await flush(12); };
  step('start'); startWeekend(); await sleep(1600); await flush(12);
  step('baths'); if (G.mapId !== 'baths') throw new Error('no baths');
  W.def.act['~'](); await sleep(1500); await flush(); await sleep(900);
  if (!F.wkBaths) throw new Error('no swim');
  W.def.act.J(); await flush(); await drive();
  step('aldi'); if (G.mapId !== 'aldi') throw new Error('no aldi, at ' + G.scene);
  if (W.luca) throw new Error('Luca should wait in the car');
  groceryGame(); await sleep(200);
  const sp = [...document.querySelectorAll('#ui button')].find(b => /Centre aisle/.test(b.textContent)); if (sp) { sp.click(); await sleep(100); }
  for (const n of CONFIG.weekend.shopList) await pick(new RegExp('^' + n));
  await flush(); if (!F.wkGroceries) throw new Error('groceries not done');
  W.def.onDoor(); await flush(); await drive();
  step('park'); if (G.mapId !== 'park') throw new Error('no park');
  fetchGame(); await sleep(300);
  for (let r = 0; r < 3; r++) { for (let i = 0; i < 80 && FT && FT.phase !== 'aim'; i++) await sleep(100); if (!FT) break; FT.power = 0.9; await pick(/Throw/); await sleep(400); }
  for (let i = 0; i < 200 && FT; i++) await sleep(100);
  await flush(); if (!F.wkFetch) throw new Error('fetch not done');
  W.def.onDoor(); await flush(); await sleep(1500); await flush(12);
  step('home'); if (G.mapId !== 'home') throw new Error('no home, at ' + G.scene);
  movieMenu(); await pick(/Godfather/); await flush();
  chessGame(); await pick(/Knight/); await sleep(800); await flush();
  W.def.onDoor(); await flush(); await sleep(1500);
  step('night'); if (G.scene !== 'wnight') throw new Error('no night, at ' + G.scene);
  await pick(/Dinner out/); await sleep(200); await pick(/pizza/i); await sleep(2900); await flush(12); await sleep(1500);
  step('end'); if (G.scene !== 'wend') throw new Error('no end card, at ' + G.scene);
  await sleep(1500);
  return JSON.stringify({ log, log2: WKLOG, happy: G.stats.happy });
})()`;
(async () => {
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'abd2w-'));
  const ch = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--user-data-dir=' + prof, '--use-angle=swiftshader', '--enable-unsafe-swiftshader', `--window-size=${Wd},${Ht}`, 'about:blank'], { stdio: 'ignore' });
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
  const r = await send('Runtime.evaluate', { expression: SCRIPT, awaitPromise: true, returnByValue: true, timeout: 240000 });
  const shot = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, 'play-weekend-end.png'), Buffer.from(shot.result.data, 'base64'));
  if (r.result.exceptionDetails) { const st = await send('Runtime.evaluate', { expression: 'window.__step + " " + G.scene + "/" + G.mode', returnByValue: true }); console.log('FAIL at', st.result.result.value, '\n', r.result.exceptionDetails.exception?.description); }
  else console.log('PASS', r.result.result.value);
  console.log(errs.length ? 'CONSOLE ERRORS:\n' + errs.join('\n').slice(0, 3000) : 'no console errors');
  ws.close(); ch.kill(); process.exit(errs.length || r.result.exceptionDetails ? 1 : 0);
})();
