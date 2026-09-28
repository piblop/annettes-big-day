// Builds v2/index.html: one self-contained file (fonts, three.js r128 and game code inlined).
// Usage: node v2/tools/build.js
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), src = path.join(root, 'src');
const js = fs.readdirSync(src).filter(f => /^\d\d-.*\.js$/.test(f)).sort().map(f => `/* ===== ${f} ===== */\n` + fs.readFileSync(path.join(src, f), 'utf8')).join('\n');
new Function(js); // throws on a syntax error before we write anything
let html = fs.readFileSync(path.join(src, 'shell.html'), 'utf8');
html = html.replace('/*FONTS*/', () => fs.readFileSync(path.join(root, 'vendor/fonts.css'), 'utf8'));
html = html.replace('/*THREE*/', () => fs.readFileSync(path.join(root, 'vendor/three.r128.min.js'), 'utf8'));
html = html.replace('/*GAME*/', () => js);
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log('v2/index.html', (html.length / 1024).toFixed(0) + ' KB');
