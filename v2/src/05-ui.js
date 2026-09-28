/* =========================================================
   UI: HUD, dialogue, menus, toasts, fades, settings, collection log
   ========================================================= */
const ui = $('#ui');
function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function clearUI() { ui.innerHTML = ''; MENU = null; }

/* ---------------- game state (pure data) ---------------- */
const G = {
  scene: 'title', mode: 'title', t: 0,
  stats: { happy: 60, glow: 40, energy: 70, gains: 30 },
  F: {}, secrets: {}, badges: {}, hearts: {}, lucaPat: {},
  outfit: 'office', wearing: 'pj', radio: null, tidied: 0, balloons: 0, clock: 7 * 60 + 30
};
const F = G.F;
const STAT_INFO = { happy: ['Happy', '#ff7aa8'], glow: ['Glow', '#ffd166'], energy: ['Energy', '#7cc576'], gains: ['Gains', '#b9a3ff'] };
function stat(k, d, quiet) {
  G.stats[k] = clamp(G.stats[k] + d, 0, 100); updateHUD();
  if (!quiet && d > 0 && W && W.player) FX.emit(W.player.g.position.x, 1.3, W.player.g.position.z, STAT_INFO[k][1], 8, 1.4, { g: -1, life: 0.9 });
}
function earn(id) { if (G.badges[id]) return; G.badges[id] = true; if (BADGES[id].pack) savePackBadge(id); sfx('badge'); toast(BADGES[id].n + ' earned!', true); }
function secret(id) {
  const first = !G.secrets[id]; G.secrets[id] = true;
  say(CONFIG.secrets[id].slice(), () => { if (first) { sfx('secret'); toast('Secret found: ' + SECRET_NAMES[id] + ' (' + Object.keys(G.secrets).length + ' of 4)', true); if (W && W.player) confetti(W.player.g.position.x, 1.2, W.player.g.position.z, 30); } });
}
let HEARTS_TOTAL = 0;
const heartsFound = () => Object.keys(G.hearts).length;

/* ---------------- HUD ---------------- */
const needsEl = $('#needs');
Object.keys(STAT_INFO).forEach(k => needsEl.append(el('div', 'need', `<span>${STAT_INFO[k][0]}</span><i><b id="st-${k}" style="background:${STAT_INFO[k][1]}"></b></i>`)));
function updateHUD() { for (const k in G.stats) { const b = $('#st-' + k); if (b) b.style.width = G.stats[k] + '%'; } }
function setChapter(t) { $('#chapter').textContent = t; }
function fmtClock(m) { m = Math.floor(m) % 1440; let h = Math.floor(m / 60); const mm = ('0' + (m % 60)).slice(-2), ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return h + ':' + mm + ' ' + ap; }
function showHUD(on) { $('#hud').classList.toggle('hidden', !on); $('#pad').classList.toggle('hidden', !(on && TOUCH)); }
function chapterCard(t) { const c = $('#card'); c.innerHTML = ''; c.append(el('span', '', esc(t))); }
function toast(msg, gold) { const t = el('div', 'toast' + (gold ? ' gold' : ''), esc(msg)); $('#toasts').append(t); setTimeout(() => t.remove(), 2700); }
function fade(mid) { const f = $('#fade'); f.classList.add('on'); G.mode = 'busy'; setTimeout(() => { try { mid(); } finally { setTimeout(() => f.classList.remove('on'), 60); } }, 480); }

/* ---------------- dialogue with typewriter ---------------- */
let DLG = null;
const WHO_COL = { Annette: '#ff7aa8', Paulo: '#5b8def', Mum: '#7cc576', Bartender: '#2f5d4a', Coach: '#ffa94d', Luca: '#d7a76e' };
function say(lines, done) {
  if (!Array.isArray(lines)) lines = [lines];
  const ret = G.mode === 'dialog' && DLG ? DLG.ret : (G.mode === 'menu' ? 'map' : G.mode);
  if (DLG && DLG.box) DLG.box.remove();
  DLG = { q: lines.slice(), done, ret, box: null, full: '', shown: 0, typing: false };
  G.mode = 'dialog'; nextLine();
}
function nextLine() {
  if (!DLG) return;
  if (DLG.box) DLG.box.remove();
  if (!DLG.q.length) { const d = DLG; DLG = null; G.mode = d.ret === 'dialog' ? 'map' : d.ret; if (d.done) d.done(); return; }
  const L = DLG.q.shift(), who = typeof L === 'string' ? null : L.n, text = typeof L === 'string' ? L : L.t;
  const box = el('div', who === CONFIG.name ? 'her' : '', (who ? `<span class="who" style="background:${WHO_COL[who] || '#8a6a55'}">${esc(who)}</span>` : '') + '<div class="txt"></div><span class="more">&#9660;</span>');
  box.id = 'dlg'; box.addEventListener('pointerdown', e => { e.preventDefault(); advance(); });
  document.body.append(box);
  Object.assign(DLG, { box, full: text, shown: SET.calm ? text.length : 0, typing: true });
  if (who) talkBlip(who);
  renderDlg();
}
function renderDlg() { if (!DLG || !DLG.box) return; DLG.box.querySelector('.txt').textContent = DLG.full.slice(0, Math.floor(DLG.shown)); DLG.box.querySelector('.more').style.visibility = DLG.shown >= DLG.full.length ? 'visible' : 'hidden'; }
function updateDlg(dt) { if (!DLG || !DLG.typing) return; DLG.shown = Math.min(DLG.full.length, DLG.shown + dt * 55); if (DLG.shown >= DLG.full.length) DLG.typing = false; renderDlg(); }
function advance() { if (!DLG) return; if (DLG.typing) { DLG.shown = DLG.full.length; DLG.typing = false; renderDlg(); } else { sfx('blip'); nextLine(); } }
function talkBlip(who) {
  if (!W) return; let g = null;
  if (who === CONFIG.name && W.player) g = W.player.g;
  else if (who === 'Luca' && W.luca) g = W.luca.g;
  else { const n = W.npcs.find(n => (who === 'Mum' && n.ch === 'M') || (who === CONFIG.boyfriend && n.ch === 'A') || ((who === 'Bartender' || who === 'Coach') && n.ch === 'n') || (/Coworker/.test(who) && n.ch === 'c') || (/Gym/.test(who) && n.ch === 'g')); if (n) { g = n.g; n.want = 4; } }
  if (g) { const p = g.position; FX.emit(p.x, 1.35, p.z, '#ffffff', 5, 1, { g: -0.5, life: 0.6 }); if (g.userData.body) g.userData.body.scale.set(1.08, 0.9, 1.08); }
}

/* ---------------- menus with keyboard focus ---------------- */
let MENU = null;
function makeBtn(html, fn, cls) {
  // every plain option gets a little picture tile, looked up from its name (drawn via CSS so button text stays clean)
  let ic = null;
  if (!cls || cls === 'opt') { const m = /<span>(.*?)<\/span>/.exec(html); ic = iconFor(m ? m[1] : html.replace(/<[^>]+>/g, '')); if (ic) { html = `<i class="pic" aria-hidden="true" data-e="${ic.e}"></i><div class="txt">${html}</div>`; cls = 'opt has-pic'; } }
  const b = el('button', cls || 'opt', html); b.type = 'button'; if (ic) b.dataset.kind = ic.k;
  b.addEventListener('click', e => { e.preventDefault(); audioInit(); if (!b.disabled) { b.classList.remove('tap'); void b.offsetWidth; b.classList.add('tap'); fn(b); } });
  return b;
}
function setMenu(btns, o) { btns.forEach((b, i) => b.style.setProperty('--i', i)); MENU = { b: btns, i: 0, cols: (o && o.cols) || 1, onBack: o && o.onBack }; if (G.mode !== 'title' && G.mode !== 'credits' && !(o && o.keepMode)) G.mode = 'menu'; focusMenu((o && o.start) || 0); }
function focusMenu(i) { if (!MENU) return; MENU.i = clamp(i, 0, MENU.b.length - 1); MENU.b.forEach((b, j) => b.classList.toggle('focus', j === MENU.i)); }
function menuMove(d) {
  if (!MENU) return; const c = MENU.cols, n = MENU.b.length; let i = MENU.i;
  if (d === 'left') i -= 1; if (d === 'right') i += 1; if (d === 'up') i -= c; if (d === 'down') i += c;
  i = (i + n) % n; let k = 0; while (MENU.b[i].disabled && k++ < n) i = (i + (d === 'left' || d === 'up' ? -1 : 1) + n) % n;
  focusMenu(i); sfx('blip');
}
function menuPick() { if (MENU && MENU.b[MENU.i] && !MENU.b[MENU.i].disabled) MENU.b[MENU.i].click(); }
function menuBack() { if (MENU && MENU.onBack) { const f = MENU.onBack; MENU = null; f(); } }
function panel(title, sub, gridCls) { clearUI(); const p = el('div', 'panel', `<h2>${title}</h2>${sub ? `<p class="sub">${sub}</p>` : ''}${gridCls ? `<div class="${gridCls}"></div>` : ''}`); ui.append(p); return p; }
function pickMenu(title, sub, items, onPick, back) {
  const p = panel(esc(title), esc(sub), 'grid2');
  const btns = items.map(d => makeBtn(`<span>${esc(d.n)}</span>${d.d ? `<small>${esc(d.d)}</small>` : ''}`, () => { clearUI(); if (d.quick) { G.mode = 'map'; onPick(d); return; } G.mode = 'busy'; moment(d.n, null, () => { G.mode = 'map'; onPick(d); }); }));
  p.querySelector('.grid2').append(...btns);
  setMenu(btns, { cols: innerWidth > 460 ? 2 : 1, onBack: back === false ? null : () => { clearUI(); G.mode = 'map'; } });
}

/* ---------------- the memories album: every ending saves a page, the title can flip through them ---------------- */
const ALBUM_KEY = 'abd2-album-v1';
function loadAlbum() { try { return JSON.parse(localStorage.getItem(ALBUM_KEY) || '{}') || {}; } catch (e) { return {}; } }
function saveAlbumPage(key, page) { const a = loadAlbum(); a[key] = Object.assign({ at: Date.now() }, page); try { localStorage.setItem(ALBUM_KEY, JSON.stringify(a)); } catch (e) {} }
function pageHTML(p) { return `<h2>${esc(p.head || 'Memories')}</h2><div class="logs">` + p.rows.map(([k, v]) => `<div class="got"><b>${esc(k)}</b>${esc(v)}</div>`).join('') + '</div>'; }
// the shared ending: a big title, one album page and buttons (plus Save photo)
function memoriesCard(key, page, buttons) {
  saveAlbumPage(key, page);
  const t = el('div', 'title', `<div class="logo"><h1>${esc(page.title)}</h1><span class="v2">${esc(page.sub || '')}</span></div>`);
  const card = el('div', 'panel album', pageHTML(page)); card.style.animationDelay = '.4s'; card.style.maxHeight = '46vh';
  const w = el('div', 'tbtns'), all = buttons.concat(makeBtn('Save photo', savePhoto, 'big sky'));
  w.append(...all); t.append(card, w); ui.append(t);
  setMenu(all, { cols: all.length, keepMode: true });
}
function openAlbum(back) {
  const a = loadAlbum(), keys = ['day', 'weekend', 'holiday-qt', 'holiday-hv'].filter(k => a[k]);
  if (!keys.length) return;
  let i = 0;
  const show = () => {
    const p = a[keys[i]], pn = panel('Our album', `Page ${i + 1} of ${keys.length} · ${esc(p.title)}`);
    const body = el('div', 'album', pageHTML(p)); pn.append(body);
    const row = el('div', 'tbtns'); row.style.marginTop = '14px';
    const bs = [];
    if (keys.length > 1) bs.push(makeBtn('Next page', () => { i = (i + 1) % keys.length; sfx('whoosh'); show(); }, 'big alt'));
    bs.push(makeBtn('Close', () => { clearUI(); back(); }, 'big'));
    row.append(...bs); pn.append(row); setMenu(bs, { cols: bs.length, keepMode: true, onBack: () => { clearUI(); back(); } });
  };
  show();
}
// snapshot the 3D scene as a keepsake photo (long-press to save on phones)
function savePhoto() {
  let url; try { renderer.render(scene, camera); url = renderer.domElement.toDataURL('image/png'); } catch (e) { toast('Could not take the photo.'); return; }
  sfx('pop'); buzz(20);
  const o = el('div', 'photo', `<div class="snap"><img alt="A memory" src="${url}"><p>Tap and hold to save on a phone</p></div>`);
  const row = el('div', 'tbtns'), dl = el('a', 'big alt', 'Download'); dl.href = url; dl.download = 'annette-memory.png';
  const close = makeBtn('Close', () => o.remove(), 'big'); row.append(dl, close); o.firstChild.append(row); document.body.append(o);
  o.addEventListener('pointerdown', e => { if (e.target === o) o.remove(); });
}

/* ---------------- pack badges persist across playthroughs ---------------- */
const PACK_BADGE_KEY = 'abd2-badges-v1';
function restorePackBadges() { try { Object.assign(G.badges, JSON.parse(localStorage.getItem(PACK_BADGE_KEY) || '{}')); } catch (e) {} }
function savePackBadge(id) { try { const b = JSON.parse(localStorage.getItem(PACK_BADGE_KEY) || '{}'); b[id] = true; localStorage.setItem(PACK_BADGE_KEY, JSON.stringify(b)); } catch (e) {} }

/* ---------------- pictures for options + little animated moments when you pick ---------------- */
// [pattern, emoji, kind]. First match wins, so specific names go before general ones.
const ICONS = [
  [/espresso machine/i, '☕', 'special'], [/espresso martini/i, '🍸', 'drink'], [/margarita/i, '🍹', 'drink'], [/aperol|spritz/i, '🍊', 'drink'], [/pina colada/i, '🍍', 'drink'],
  [/pizza/i, '🍕', 'dine'], [/squid/i, '🦑', 'dine'], [/fries|frites/i, '🍟', 'dine'], [/charcuterie/i, '🧀', 'dine'], [/pasta/i, '🍝', 'dine'], [/steak/i, '🥩', 'dine'], [/dumpling/i, '🥟', 'dine'],
  [/ramen/i, '🍜', 'food'], [/banh mi/i, '🥖', 'food'], [/food from home/i, '🍱', 'food'], [/kobo|read/i, '📖', 'read'],
  [/flat white|iced coffee/i, '☕', 'drink'], [/hug/i, '🤗', 'hug'], [/see you|bye/i, '👋', 'hug'],
  [/city office/i, '💼', 'outfit'], [/all black/i, '🖤', 'outfit'], [/sunny day/i, '🌻', 'outfit'], [/dress/i, '👗', 'outfit'],
  [/tupac|cole|kendrick/i, '🎧', 'music'],
  [/cleanser/i, '🧼', 'glow'], [/serum/i, '💧', 'glow'], [/moisturiser/i, '🧴', 'glow'], [/spf/i, '🌞', 'glow'],
  [/exec reports/i, '📊', 'plain'], [/project updates/i, '📋', 'plain'], [/snacks/i, '🍪', 'plain'],
  [/banana/i, '🍌', 'cart'], [/sourdough/i, '🍞', 'cart'], [/oat milk/i, '🥛', 'cart'], [/chocolate/i, '🍫', 'cart'], [/dishwasher/i, '🧽', 'cart'], [/sparkling/i, '💦', 'cart'], [/avocado/i, '🥑', 'cart'], [/party pies/i, '🥧', 'cart'], [/dog treats/i, '🦴', 'cart'], [/candle/i, '🕯️', 'cart'],
  [/go-kart/i, '🏎️', 'special'], [/tv/i, '📺', 'special'], [/chainsaw/i, '🪓', 'special'], [/spa/i, '🛁', 'special'], [/ski/i, '⛷️', 'special'], [/welding/i, '🥽', 'special'], [/kayak/i, '🛶', 'special'], [/robot/i, '🤖', 'special'], [/snowboard/i, '🏂', 'special'], [/beekeeping/i, '🐝', 'special'], [/scooter/i, '🛴', 'special'],
  [/scorsese/i, '🎬', 'movie'], [/nolan/i, '⏳', 'movie'], [/godfather/i, '🌹', 'movie'],
  [/knight/i, '♞', 'chess'], [/queen/i, '♛', 'chess'], [/castle/i, '🏰', 'chess'],
  [/cheese/i, '🧀', 'picnic'], [/strawberr/i, '🍓', 'picnic'],
  [/sauvignon/i, '🥂', 'wine'], [/pinot/i, '🍷', 'wine'], [/rose/i, '🌸', 'wine'], [/prosecco/i, '🍾', 'wine'],
  [/dinner out/i, '🍽️', 'plain'], [/wine bar/i, '🍷', 'plain']
];
function iconFor(name) { const t = String(name).replace(/&amp;/g, '&'); const r = ICONS.find(([re]) => re.test(t)); return r ? { e: r[1], k: r[2] } : null; }
const MOMENT_LINES = { dine: 'Dinner is served', drink: 'Cheers!', wine: 'Cheers to the weekend', food: 'Tuck in', read: 'Just one more chapter', hug: 'Right back at you', outfit: 'Looking good', music: 'Turn it up', glow: 'Glowing', movie: 'Lights down, film on', chess: 'Your move', picnic: 'Picnic time', cart: 'Into the trolley', special: 'Absolutely not on the list' };
// props that join the main picture on the little stage, per kind
const MOMENT_PROPS = { dine: ['🕯️', '🕯️'], wine: ['🧀', '🍇'], drink: [], food: [], movie: ['🍿'], music: ['🎵', '🎶', '🎵'], outfit: ['✨', '✨', '✨'], hug: ['💞', '💗', '💖'], glow: ['✨', '✨'], chess: ['👑'], picnic: ['🧺'], read: ['☕'], cart: ['🛒'], special: ['⭐'] };
let MOMENT = null;
function moment(name, o, cb) {
  o = o || {};
  const ic = o.e ? { e: o.e, k: o.k || 'plain' } : iconFor(name);
  if (!ic || ic.k === 'plain') { cb && cb(); return; }
  endMoment();
  const k = ic.k, props = o.props || MOMENT_PROPS[k] || [];
  const wrap = el('div', 'moment k-' + k + (SET.calm ? ' still' : ''));
  let stage = '';
  if (k === 'dine' || k === 'drink' || k === 'wine') stage += `<i class="glass l" data-e="${k === 'drink' ? ic.e : '🍷'}"></i><i class="glass r" data-e="${k === 'drink' ? ic.e : '🍷'}"></i>`;
  if (k === 'dine') stage += '<i class="steam s1"></i><i class="steam s2"></i><i class="steam s3"></i>';
  props.forEach((p, i) => { stage += `<i class="prop p${i}" data-e="${p}" style="--i:${i}"></i>`; });
  if (k === 'movie') for (let i = 0; i < 7; i++) stage += `<i class="pop" data-e="🍿" style="--dx:${Math.round((i - 3) * 34)}px;--dy:${-60 - (i % 3) * 22}px;--d:${(0.35 + i * 0.07).toFixed(2)}s"></i>`;
  if (k === 'cart' && o.items) o.items.forEach((e, i) => { stage += `<i class="drop" data-e="${e}" style="--x:${Math.round((i - (o.items.length - 1) / 2) * 26)}px;--d:${(0.3 + i * 0.12).toFixed(2)}s"></i>`; });
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; stage += `<i class="spark" style="--dx:${Math.round(Math.cos(a) * 110)}px;--dy:${Math.round(Math.sin(a) * 90)}px;--d:${(0.45 + (i % 3) * 0.05).toFixed(2)}s"></i>`; }
  stage += `<i class="hero" data-e="${ic.e}"></i>`;
  wrap.innerHTML = `<div class="stage">${stage}</div><div class="cap"><b>${esc(o.title || name)}</b><small>${esc(o.line || MOMENT_LINES[k] || '')}</small></div>`;
  document.body.append(wrap);
  const done = () => { if (MOMENT !== m) return; endMoment(); cb && cb(); };
  const m = MOMENT = { wrap, done, skip: done, timer: setTimeout(done, SET.calm ? 900 : (o.ms || 1700)) };
  wrap.addEventListener('pointerdown', e => { e.preventDefault(); done(); });
  sfx(k === 'special' || k === 'cart' ? 'pop' : 'good'); buzz(12);
}
function endMoment() { if (!MOMENT) return; const m = MOMENT; MOMENT = null; clearTimeout(m.timer); m.wrap.classList.add('out'); setTimeout(() => m.wrap.remove(), 260); }
// a picked picture flies from its button to a target element (the trolley counter, say)
function flyPic(btn, target) {
  const pic = btn.querySelector('.pic'); if (!pic || !target || SET.calm) return;
  const a = pic.getBoundingClientRect(), b = target.getBoundingClientRect();
  const f = el('i', 'flypic'); f.dataset.e = pic.dataset.e; f.style.left = a.left + 'px'; f.style.top = a.top + 'px'; document.body.append(f);
  const dx = b.left + 20 - a.left, dy = b.top - 6 - a.top;
  f.animate([{ transform: 'translate(0,0) scale(1) rotate(0)' }, { transform: `translate(${dx * 0.5}px,${dy * 0.5 - 70}px) scale(1.35) rotate(-20deg)`, offset: 0.45 }, { transform: `translate(${dx}px,${dy}px) scale(.5) rotate(10deg)`, opacity: 0.2 }], { duration: 650, easing: 'cubic-bezier(.4,0,.6,1)' }).onfinish = () => { f.remove(); target.classList.remove('bump'); void target.offsetWidth; target.classList.add('bump'); };
}

/* ---------------- settings + collection log ---------------- */
function openSettings() {
  if (G.mode !== 'map' && G.mode !== 'title') return;
  const ret = G.mode, p = panel('Settings', 'Saved on this device.');
  const rows = [['sfx', 'Sound effects'], ['buzz', 'Vibration'], ['calm', 'Reduced motion']];
  const btns = rows.map(([k, n]) => { const r = el('div', 'row', `<span>${n}</span>`); const t = makeBtn('', () => { SET[k] = !SET[k]; t.classList.toggle('on', SET[k]); saveSettings(); if (k === 'sfx' && !SET.sfx) stopAmbient(); }, 'tog' + (SET[k] ? ' on' : '')); t.setAttribute('aria-label', n); r.append(t); p.append(r); return t; });
  const done = makeBtn('Done', () => { clearUI(); G.mode = ret; }, 'big'); done.style.marginTop = '14px'; p.append(done);
  setMenu(btns.concat(done), { onBack: () => { clearUI(); G.mode = ret; }, keepMode: ret === 'title' });
  if (ret !== 'title') G.mode = 'menu';
}
function openLog() {
  if (G.mode !== 'map') return;
  const p = panel('Collection log', `Hearts ${heartsFound()} of ${HEARTS_TOTAL} &middot; Secrets ${Object.keys(G.secrets).length} of 4 &middot; Balloons ${G.balloons}`);
  const g = el('div', 'logs');
  SECRET_IDS.forEach(id => g.append(el('div', G.secrets[id] ? 'got' : '', `<b>${G.secrets[id] ? SECRET_NAMES[id] : 'Secret ???'}</b>${G.secrets[id] ? 'Found!' : 'Keep poking around.'}`)));
  Object.keys(BADGES).forEach(id => g.append(el('div', G.badges[id] ? 'got' : '', `<b>${BADGES[id].n}</b>${esc(BADGES[id].how)}`)));
  p.append(g);
  const done = makeBtn('Close', () => { clearUI(); G.mode = 'map'; }, 'big'); done.style.marginTop = '14px'; p.append(done);
  setMenu([done], { onBack: () => { clearUI(); G.mode = 'map'; } });
}
$('#setBtn').onclick = () => { audioInit(); openSettings(); };
$('#logBtn').onclick = () => { audioInit(); openLog(); };
$('#rotL').onclick = () => rotateView(1);
$('#rotR').onclick = () => rotateView(-1);

/* ---------------- save / checkpoint ---------------- */
const SAVE_KEY = 'abd2-save-v1';
// one save slot per campaign, so a weekend or holiday never overwrites the birthday day
const CAMPAIGNS = { day: 'The birthday', weekend: 'The weekend', holiday: 'The holiday' };
const slotKey = c => SAVE_KEY + (c && c !== 'day' ? '-' + c : '');
const CAMPAIGN_STATE = {}; // campaign -> { save(): extra state, load(s) }
function saveCheckpoint(mapId) {
  const c = G.campaign || 'day', extra = CAMPAIGN_STATE[c] ? CAMPAIGN_STATE[c].save() : {};
  try { localStorage.setItem(slotKey(c), JSON.stringify({ v: 1, campaign: c, extra, map: mapId, stats: G.stats, F: G.F, secrets: G.secrets, badges: G.badges, hearts: G.hearts, outfit: G.outfit, radio: G.radio, tidied: G.tidied, balloons: G.balloons, lucaPat: G.lucaPat })); } catch (e) {}
}
function loadCheckpoint(c) { try { const s = JSON.parse(localStorage.getItem(slotKey(c)) || 'null'); return s && s.v === 1 && MAPS[s.map] ? Object.assign({ campaign: c || 'day' }, s) : null; } catch (e) { return null; } }
function allCheckpoints() { return Object.keys(CAMPAIGNS).map(loadCheckpoint).filter(Boolean); }
function clearCheckpoint(c) { try { localStorage.removeItem(slotKey(c || G.campaign || 'day')); } catch (e) {} }
