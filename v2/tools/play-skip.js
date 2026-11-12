// Skip test in headless Chrome: presses the Skip button through the birthday, the weekend and all four holidays. Fails on console errors.
// Usage: node v2/tools/play-skip.js   (W=390 H=844 for a phone viewport)
const { spawn } = require('child_process'), fs = require('fs'), path = require('path'), os = require('os');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const root = path.join(__dirname, '..'), out = path.join(root, 'screenshots'); fs.mkdirSync(out, { recursive: true });
const url = 'file:///' + path.join(root, 'index.html').split(path.sep).join('/');
const Wd = +process.env.W || 1280, Ht = +process.env.H || 800;
const PORT = +process.env.PORT || 9334;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SCRIPT = `(async () => {
  const log = [], sleep = async ms => { const t = G.t + ms / 1100; await new Promise(r => setTimeout(r, ms)); for (let i = 0; i < 400 && G.t < t; i++) await new Promise(r => setTimeout(r, 50)); }, step = s => { log.push(s); window.__step = s; };
  const btn = re => [...document.querySelectorAll('#ui button')].find(b => re.test(b.textContent));
  const waitFor = async (fn, ms) => { for (let i = 0; i < (ms || 30000) / 100; i++) { if (fn()) return true; await sleep(100); } return false; };
  const fading = () => document.querySelector('#fade').classList.contains('on');
  // press Skip (the real HUD button) until we reach the wanted place, answering "Skip ahead" when asked
  const skipTo = async (name, fn) => { for (let i = 0; i < 300 && !fn(); i++) { const b = btn(/^Skip ahead/); if (b) b.click(); else if (!fading()) document.querySelector('#skipBtn').click(); await sleep(250); } if (!fn()) throw new Error('skip never reached ' + name + ' (at ' + G.scene + '/' + G.mapId + '/' + G.mode + ')'); step(name); };
  const at = id => () => G.scene === 'map' && G.mapId === id && G.mode !== 'busy' && !fading();
  step('title'); btn(/Start the day|New day/).click(); await waitFor(at('bedroom'));
  // a conversation skips in one press
  await waitFor(() => !!DLG); document.querySelector('#dlg .skip').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); await sleep(200); if (DLG) throw new Error('conversation not skipped');
  // mini-games finish on Skip
  await skipTo('gym', at('gym')); for (let i = 0; i < 60 && !btn(/Stay here/); i++) { document.querySelector('#skipBtn').click(); await sleep(250); } if (!btn(/Stay here/)) throw new Error('no skip prompt'); btn(/Stay here/).click(); await sleep(200); if (G.mapId !== 'gym' || G.mode !== 'map') throw new Error('Stay here did not stay');
  liftGame(); await sleep(300); await skipTo('lift and battle skipped', () => F.gymBattle && !G.b && !G.lift);
  for (const [n, f] of [['office', at('office')], ['lunch', () => G.scene === 'lunch'], ['beach', at('beach')], ['botanist', at('botanist')], ['finale', () => G.scene === 'finale']]) await skipTo(n, f);
  await sleep(600); btn(/Roll credits/).click(); await sleep(600); if (G.scene !== 'credits') throw new Error('no credits');
  step('weekend'); btn(/Play the weekend/).click(); await waitFor(at('baths'));
  for (const [n, f] of [['aldi', at('aldi')], ['park', at('park')], ['home', at('home')], ['night', () => G.scene === 'wnight'], ['weekend end', () => G.scene === 'wend']]) await skipTo(n, f);
  for (const trip of ['Queenstown', 'Hunter Valley', 'Thirroul', 'Port Macquarie']) {
    await sleep(600); fade(startHoliday); await waitFor(() => G.scene === 'hstart' && !!btn(new RegExp(trip))); btn(new RegExp(trip)).click();
    await skipTo(trip + ' end', () => G.scene === 'hend');
  }
  return JSON.stringify({ log });
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
  const shot = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, 'play-skip-end' + (Wd < 600 ? '-phone' : '') + '.png'), Buffer.from(shot.result.data, 'base64'));
  if (r.result.exceptionDetails) { const st = await send('Runtime.evaluate', { expression: 'window.__step + " " + G.scene + "/" + G.mode', returnByValue: true }); console.log('FAIL at', st.result.result.value, '\n', r.result.exceptionDetails.exception?.description); }
  else console.log('PASS', r.result.result.value);
  console.log(errs.length ? 'CONSOLE ERRORS:\n' + errs.join('\n').slice(0, 3000) : 'no console errors');
  ws.close(); ch.kill(); process.exit(errs.length || r.result.exceptionDetails ? 1 : 0);
})();
