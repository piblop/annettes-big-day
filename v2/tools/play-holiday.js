// Scripted Holiday Pack playthrough in headless Chrome: Queenstown then Hunter Valley. Fails on console errors.
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
  const waitFor = async (fn, ms) => { for (let i = 0; i < (ms || 8000) / 100; i++) { if (fn()) return true; await sleep(100); } return false; };
  step('qt-start'); startHoliday(); await sleep(1500); await pick(/Queenstown/); await sleep(300); await flush(12); await waitFor(() => G.mapId === 'qtown'); await sleep(1000); await flush(12);
  step('qtown'); if (G.mapId !== 'qtown') throw new Error('no qtown, at ' + G.scene);
  W.def.act.G(); await sleep(200); await pick(/Macpac/); await sleep(200); await flush(); await pick(/^Skis/); await sleep(200); await flush();
  if (!F.qtGear || G.ride !== 'ski') throw new Error('no gear');
  W.def.act.B(); await sleep(200); await pick(/Remarkables/); await sleep(200); await flush(); await pick(/Alta Blue/); await sleep(200); await flush(12);
  await waitFor(() => G.scene === 'snow'); step('snow'); if (G.scene !== 'snow') throw new Error('no snow run, at ' + G.scene);
  await sleep(1500); sbLane(-1); await sleep(400); sbLane(1); SB.t = SB.dur; await sleep(500); await flush(12);
  await waitFor(() => G.mapId === 'qtown' && G.scene === 'map'); await sleep(1000); await flush(12);
  step('qt-evening'); if (!F.qtSki) throw new Error('ski not done');
  W.def.act.A(); await sleep(200); await pick(/luge/i); await sleep(200); await flush(12); await waitFor(() => G.scene === 'snow'); step('luge'); await sleep(1200); SB.t = SB.dur; await sleep(500); await flush(12); await waitFor(() => G.mapId === 'qtown' && G.scene === 'map'); await sleep(1000); await flush(12); if (!F.qtLuge) throw new Error('luge not done'); W.def.act.A(); await sleep(200); await pick(/Botswana/); await sleep(200); await flush(12);
  await waitFor(() => G.scene === 'hend'); step('qt-end'); if (G.scene !== 'hend') throw new Error('no qt end, at ' + G.scene);
  window.__qt = JSON.stringify(HLOG);
  step('hv-start'); await sleep(800); await pick(/Another holiday/); await sleep(1500); await pick(/Hunter Valley/); await sleep(300); await flush(12); await waitFor(() => G.scene === 'drive'); step('hv-drive'); await sleep(800); if (D) { D.paused = false; D.t = D.dur; } await sleep(600); await flush(12); await waitFor(() => G.mapId === 'hunter' && G.scene === 'map'); await sleep(1000); await flush(12);
  step('hunter'); if (G.mapId !== 'hunter') throw new Error('no hunter, at ' + G.scene);
  W.def.act.C(); for (let r = 0; r < 4; r++) { await sleep(150); const b = [...document.querySelectorAll('#ui button')][r % 4]; b.click(); await sleep(900); }
  await flush(12); await pick(/Shiraz/); await sleep(200); await flush(); if (!F.hvTaste || HLOG.fav !== 'Shiraz') throw new Error('tasting not done');
  W.def.act.c(); await sleep(200); await pick(/brie/i); await sleep(200); await flush();
  W.def.act.A(); await sleep(200); await pick(/balloon/i); await sleep(200); await flush(); await pick(/Degustation/); await sleep(200); await flush(12);
  await waitFor(() => G.scene === 'hend'); step('hv-end'); if (G.scene !== 'hend') throw new Error('no hv end, at ' + G.scene);
  await sleep(1200);
  return JSON.stringify({ log, qt: JSON.parse(window.__qt), hv: HLOG });
})()`;
(async () => {
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'abd2h-'));
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
  const shot = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, 'play-holiday-end.png'), Buffer.from(shot.result.data, 'base64'));
  if (r.result.exceptionDetails) { const st = await send('Runtime.evaluate', { expression: 'window.__step + " " + G.scene + "/" + G.mode', returnByValue: true }); console.log('FAIL at', st.result.result.value, '\n', r.result.exceptionDetails.exception?.description); }
  else console.log('PASS', r.result.result.value);
  console.log(errs.length ? 'CONSOLE ERRORS:\n' + errs.join('\n').slice(0, 3000) : 'no console errors');
  ws.close(); ch.kill(); process.exit(errs.length || r.result.exceptionDetails ? 1 : 0);
})();
