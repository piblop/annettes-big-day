/* =========================================================
   ENGINE: renderer, diorama camera, lights, sky, caches, fx, audio
   Rendering reads game state, it never writes it.
   ========================================================= */
const $ = s => document.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const TAU = Math.PI * 2;
const easeOutBack = t => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function hsh(x, y, n) { let h = (x * 374761393 + y * 668265263 + (n || 0) * 982451653) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) % 1000 / 1000; }

// Extension registries: later modules add entries instead of editing the core files.
// OBJ_BUILDERS["theme:ch"] = (w, h) => Group   WALL_BUILDERS["theme:ch"] = w => Group   QA_EXTRA.name = () => {}
const OBJ_BUILDERS = {}, WALL_BUILDERS = {}, QA_EXTRA = {};

/* ---------------- settings (guarded localStorage) ---------------- */
const SET_KEY = 'abd2-settings-v1';
const SET = (() => {
  const d = { sfx: true, calm: !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches), buzz: true };
  try { return Object.assign(d, JSON.parse(localStorage.getItem(SET_KEY) || '{}')); } catch (e) { return d; }
})();
function saveSettings() { try { localStorage.setItem(SET_KEY, JSON.stringify(SET)); } catch (e) {} document.body.classList.toggle('calm', SET.calm); }
function buzz(ms) { if (SET.buzz && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) {} }

/* ---------------- renderer + scene ---------------- */
const view = $('#view');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: /[?&]qa=/.test(location.search) });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
view.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const world = new THREE.Group(); scene.add(world);

// Toon ramp: three soft bands, gives the painted-toy look
const TOON = (() => { const d = new Uint8Array([120, 200, 255]); const t = new THREE.DataTexture(d, 3, 1, THREE.LuminanceFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.generateMipmaps = false; t.needsUpdate = true; return t; })();

/* ---------------- geometry + material caches (never allocate per frame) ---------------- */
const GEO = {};
function geo(key, make) { return GEO[key] || (GEO[key] = make()); }
const G_BOX = geo('box', () => new THREE.BoxGeometry(1, 1, 1));
const G_SPH = geo('sph', () => new THREE.SphereGeometry(0.5, 20, 14));
const G_CYL = geo('cyl', () => new THREE.CylinderGeometry(0.5, 0.5, 1, 18));
const G_CONE = geo('cone', () => new THREE.ConeGeometry(0.5, 1, 18));
const MATS = {};
function M(color, o) {
  const k = color + (o ? JSON.stringify(o) : '');
  if (MATS[k]) return MATS[k];
  let m;
  if (o && o.glow) m = new THREE.MeshBasicMaterial({ color, transparent: !!o.alpha, opacity: o.alpha || 1 });
  else m = new THREE.MeshToonMaterial({ color, gradientMap: TOON, transparent: !!(o && o.alpha), opacity: (o && o.alpha) || 1 });
  return (MATS[k] = m);
}
// mk(geometry, colour, scale[x,y,z], pos[x,y,z], parent, opts)
function mk(g, color, s, p, parent, o) {
  const m = new THREE.Mesh(g, M(color, o && (o.glow || o.alpha) ? { glow: o.glow, alpha: o.alpha } : null));
  if (s) m.scale.set(s[0], s[1], s[2]);
  if (p) m.position.set(p[0], p[1], p[2]);
  m.castShadow = !(o && (o.noShadow || o.glow)); m.receiveShadow = true;
  if (parent) parent.add(m);
  return m;
}
function grp(parent, x, y, z) { const g = new THREE.Group(); g.position.set(x || 0, y || 0, z || 0); if (parent) parent.add(g); return g; }

/* ---------------- diorama camera: orthographic, fixed pitch, 90 degree yaw steps ---------------- */
// A low three-quarter view (about 34 degrees) so faces and furniture fronts read, not a top-down plan
const MAP_PITCH = 0.6, MAP_BASE = 8.2;
const cam = { target: new THREE.Vector3(7, 0, 5), goal: new THREE.Vector3(7, 0, 5), yaw: 0, yawGoal: 0, pitch: MAP_PITCH, zoom: 1, zoomGoal: 1, base: MAP_BASE, orbit: 0, shake: 0 };
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400);
function updateCamera(dt) {
  const k = 1 - Math.pow(0.001, dt);
  cam.yawGoal += cam.orbit * dt;
  cam.yaw += (cam.yawGoal - cam.yaw) * (cam.orbit ? 1 : k * 1.4);
  cam.target.lerp(cam.goal, k);
  cam.zoom += (cam.zoomGoal - cam.zoom) * k;
  const r = 60, sx = cam.shake > 0 ? (Math.random() - 0.5) * cam.shake : 0;
  if (cam.shake > 0) cam.shake = Math.max(0, cam.shake - dt * 1.5);
  camera.position.set(cam.target.x + r * Math.cos(cam.pitch) * Math.sin(cam.yaw) + sx, cam.target.y + r * Math.sin(cam.pitch), cam.target.z + r * Math.cos(cam.pitch) * Math.cos(cam.yaw));
  camera.lookAt(cam.target.x + sx, cam.target.y, cam.target.z);
  const a = innerWidth / innerHeight;
  const base = a < 1.1 ? Math.min(cam.base * 1.25 / a, cam.base * 2.1) : cam.base;
  const s = base / cam.zoom;
  camera.left = -s * a / 2; camera.right = s * a / 2; camera.top = s / 2; camera.bottom = -s / 2; camera.updateProjectionMatrix();
}
function yawQuadrant() { return ((Math.round(cam.yawGoal / (Math.PI / 2)) % 4) + 4) % 4; }
function rotateView(d) { cam.yawGoal = Math.round(cam.yawGoal / (Math.PI / 2)) * (Math.PI / 2) + d * Math.PI / 2; sfx('whoosh'); if (typeof onRotate === 'function') onRotate(); }

/* ---------------- lights ---------------- */
const hemi = new THREE.HemisphereLight(0xffffff, 0xb9a3c9, 0.5); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff1dc, 0.95);
sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.02;
Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 90 });
scene.add(sun, sun.target);
function fitSun(cx, cz, half) {
  sun.target.position.set(cx, 0, cz); sun.position.set(cx - 9, 30, cz + 14);
  Object.assign(sun.shadow.camera, { left: -half, right: half, top: half, bottom: -half }); sun.shadow.camera.updateProjectionMatrix();
}

/* ---------------- sky: gradient backdrop, stars, drifting clouds ---------------- */
const skyCanvas = document.createElement('canvas'); skyCanvas.width = 4; skyCanvas.height = 256;
const skyTex = new THREE.CanvasTexture(skyCanvas); scene.background = skyTex;
let skyNow = null;
function setSky(name) {
  const s = SKIES[name] || SKIES.day; skyNow = name;
  const c = skyCanvas.getContext('2d'), g = c.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, s.top); g.addColorStop(1, s.bot); c.fillStyle = g; c.fillRect(0, 0, 4, 256); skyTex.needsUpdate = true;
  sun.color.set(s.sun); sun.intensity = s.k * 0.6; hemi.color.set(s.hs); hemi.groundColor.set(s.hg);
  stars.visible = name === 'night' || name === 'dusk' || name === 'evening';
  document.body.style.background = `linear-gradient(${s.top}, ${s.bot})`;
}
const stars = (() => {
  const n = 220, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 120; pos[i * 3 + 1] = -30 + Math.random() * 10; pos[i * 3 + 2] = (Math.random() - 0.5) * 120; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xfff4c9, size: 2.2, sizeAttenuation: false }));
  p.visible = false; scene.add(p); return p;
})();
const clouds = [];
function makeCloud(parent, x, y, z, s) {
  const g = grp(parent, x, y, z);
  [[0, 0, 0, 1], [0.7, -0.1, 0.1, 0.75], [-0.7, -0.12, 0, 0.7], [0.25, 0.3, -0.1, 0.7], [-0.3, 0.2, 0.2, 0.6]].forEach(([a, b, c, r]) => mk(G_SPH, '#ffffff', [r * s, r * s * 0.8, r * s], [a * s, b * s, c * s], g, { noShadow: true }));
  g.userData.speed = 0.15 + Math.random() * 0.25; clouds.push(g); return g;
}
function driftClouds(dt, span) { clouds.forEach(c => { c.position.x += c.userData.speed * dt; if (c.position.x > span) c.position.x = -span + (c.position.x - span); }); }

/* ---------------- particles: one Points cloud, pooled ---------------- */
const FX = (() => {
  const N = 900, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const dot = document.createElement('canvas'); dot.width = dot.height = 32; const d = dot.getContext('2d');
  d.fillStyle = '#fff'; d.beginPath(); d.arc(16, 16, 14, 0, TAU); d.fill();
  const mat = new THREE.PointsMaterial({ size: 9, sizeAttenuation: false, vertexColors: true, map: new THREE.CanvasTexture(dot), transparent: true, alphaTest: 0.3, depthWrite: false });
  const pts = new THREE.Points(g, mat); pts.frustumCulled = false; scene.add(pts);
  const P = []; const c = new THREE.Color();
  return {
    pts, P,
    emit(x, y, z, color, n, speed, o) {
      o = o || {}; if (SET.calm) n = Math.ceil(n / 2);
      for (let i = 0; i < n && P.length < N; i++) {
        const a = Math.random() * TAU, e = o.up ? Math.random() * 0.6 + 0.8 : Math.random() * Math.PI - Math.PI / 2, s = speed * (0.5 + Math.random() * 0.6);
        const cc = Array.isArray(color) ? color[Math.floor(Math.random() * color.length)] : color;
        P.push({ x, y, z, vx: Math.cos(a) * Math.cos(e) * s, vy: Math.sin(e) * s + (o.lift || 0), vz: Math.sin(a) * Math.cos(e) * s, life: (o.life || 1) * (0.7 + Math.random() * 0.5), g: o.g == null ? 6 : o.g, c: c.set(cc).toArray() });
      }
    },
    update(dt) {
      let j = 0;
      for (let i = 0; i < P.length; i++) {
        const p = P[i]; p.life -= dt; if (p.life <= 0) continue;
        p.vy -= p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; p.vx *= 0.985; p.vz *= 0.985;
        pos[j * 3] = p.x; pos[j * 3 + 1] = p.y; pos[j * 3 + 2] = p.z;
        const f = Math.min(1, p.life * 2); col[j * 3] = p.c[0] * f + (1 - f); col[j * 3 + 1] = p.c[1] * f + (1 - f); col[j * 3 + 2] = p.c[2] * f + (1 - f);
        P[j++] = p;
      }
      P.length = j; g.setDrawRange(0, j); g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true;
    },
    clear() { P.length = 0; g.setDrawRange(0, 0); }
  };
})();
const CONFETTI = ['#ff7aa8', '#ffd166', '#7fc8f8', '#b9a3ff', '#7cc576', '#ffffff'];
function sparkle(x, y, z, n) { FX.emit(x, y, z, ['#fff4c9', '#ffd166', '#ffffff'], n || 14, 2.2, { g: 1, life: 0.8 }); }
function confetti(x, y, z, n) { FX.emit(x, y, z, CONFETTI, n || 40, 4.5, { g: 5, life: 1.6, lift: 2 }); }

/* ---------------- audio: tiny WebAudio synth, whimsical bell tones ---------------- */
let actx = null;
function audioInit() { if (!actx) try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} if (actx && actx.state === 'suspended') actx.resume(); }
function tone(f, d, type, v, when, slide) {
  if (!actx || !SET.sfx) return;
  const t = actx.currentTime + (when || 0), o = actx.createOscillator(), g = actx.createGain();
  o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v || 0.07, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + 0.02);
}
const SFX = {
  blip: () => tone(880, 0.05, 'triangle', 0.03),
  step: () => tone(300 + Math.random() * 60, 0.04, 'sine', 0.02),
  pop: () => tone(520, 0.12, 'sine', 0.07, 0, 1100),
  good: () => { tone(660, 0.1, 'triangle', 0.06); tone(990, 0.16, 'triangle', 0.06, 0.08); },
  bad: () => tone(200, 0.2, 'square', 0.035, 0, 120),
  heart: () => [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.18, 'sine', 0.06, i * 0.06)),
  secret: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.3, 'triangle', 0.05, i * 0.09)),
  badge: () => [659, 784, 988, 1319].forEach((f, i) => tone(f, 0.35, 'triangle', 0.06, i * 0.12)),
  whoosh: () => tone(300, 0.18, 'sine', 0.03, 0, 700),
  hit: () => { tone(160, 0.12, 'square', 0.05, 0, 80); tone(900, 0.08, 'triangle', 0.04, 0.02); },
  door: () => { tone(440, 0.1, 'sine', 0.05); tone(660, 0.14, 'sine', 0.05, 0.1); },
  honk: () => { tone(392, 0.16, 'square', 0.04); tone(392, 0.16, 'square', 0.04, 0.2); },
  boom: () => { tone(90, 0.5, 'sine', 0.09, 0, 40); tone(1400, 0.4, 'triangle', 0.02, 0.05, 600); },
  blow: () => tone(1200, 0.35, 'sine', 0.03, 0, 300),
  woof: () => { tone(420, 0.08, 'sawtooth', 0.04, 0, 260); tone(460, 0.09, 'sawtooth', 0.04, 0.14, 280); }
};
function sfx(n) { try { SFX[n] && SFX[n](); } catch (e) {} if (n === 'bad' || n === 'hit') buzz(30); if (n === 'heart' || n === 'badge') buzz([20, 40, 20]); }
// Instanced meshes get their own material (never the shared cache) and a pre-filled colour per
// instance: r128 binds instanceColor per program, so mixing coloured and uncoloured instanced
// meshes on one cached material crashes the renderer.
function IM(g, color, n, o) {
  const mat = new THREE.MeshToonMaterial({ color: '#ffffff', gradientMap: TOON, transparent: !!(o && o.alpha), opacity: (o && o.alpha) || 1 });
  const m = new THREE.InstancedMesh(g, mat, n), c = new THREE.Color(color);
  for (let i = 0; i < n; i++) m.setColorAt(i, c);
  m.receiveShadow = true; m.userData.ownMat = mat;
  return m;
}
