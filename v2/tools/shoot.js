// Headless Chrome via CDP: shoots ?qa= scenes into v2/screenshots and reports console errors.
// Usage: node v2/tools/shoot.js [scene ...]   (optional: W=390 H=844 for phone)
const { spawn } = require('child_process'), fs = require('fs'), path = require('path'), os = require('os');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const root = path.join(__dirname, '..'), out = path.join(root, 'screenshots'); fs.mkdirSync(out, { recursive: true });
const url = 'file:///' + path.join(root, 'index.html').split(path.sep).join('/');
const scenes = process.argv.slice(2).length ? process.argv.slice(2) : ['title', 'map', 'drive', 'lift', 'battle', 'report', 'lunch', 'drinks', 'pet', 'finale', 'credits'];
const Wd = +process.env.W || 1280, Ht = +process.env.H || 800, wait = +process.env.WAIT || 2600, sfx = process.env.SUFFIX || '';
const PORT = +process.env.PORT || 9333;
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'abd2-'));
  const ch = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--user-data-dir=' + prof, '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files', `--window-size=${Wd},${Ht}`, 'about:blank'], { stdio: 'ignore' });
  let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch('http://127.0.0.1:' + PORT + '/json')).json(); if (tabs.find(t => t.type === 'page')) break; } catch (e) {} await sleep(200); }
  const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let id = 0; const pend = {}, errs = [];
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; }
    if (d.method === 'Runtime.exceptionThrown') errs.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
    if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errs.push(d.params.args.map(a => a.description || a.value).join(' ')); };
  const send = (method, params) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  global.cdp = send;
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: Wd, height: Ht, deviceScaleFactor: 1, mobile: Wd < 600 });
  for (const s of scenes) {
    const before = errs.length;
    await send('Page.navigate', { url: url + '?qa=' + s }); await sleep(wait);
    if (process.env.EVAL) await send('Runtime.evaluate', { expression: process.env.EVAL }), await sleep(1200);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const f = path.join(out, s + sfx + '.png'); fs.writeFileSync(f, Buffer.from(shot.result.data, 'base64'));
    console.log((errs.length > before ? 'ERR ' : 'ok  ') + s, errs.slice(before).join(' | ').slice(0, 600));
  }
  ws.close(); ch.kill();
})();
