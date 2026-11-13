/* =========================================================
   FAST SKIP: one button (HUD "Skip", or Tab) that always moves things along.
   - talking: skips the whole conversation, not just one line
   - a mini-game, battle or drive: finishes it with a decent result
   - walking around a place: opens the section list, to jump to any section still ahead
   ========================================================= */
// where each place skips to: [label for the prompt, what to set and load]
const SKIP_TO = {
  bedroom: ['the gym', () => { F.outfit = F.skincare = F.music = true; loadMap('gym'); }],
  block: ['back home', () => { F.walked = true; loadMap('bedroom'); }],
  gym: ['the office', () => { F.lifted = F.gymBattle = true; loadMap('office'); }],
  office: ['lunch', () => { F.sorted = F.officeBattle = true; lunchScene(); }],
  beach: ['dinner at The Botanist', () => loadMap('botanist')],
  botanist: ['the fireworks', () => { F.surprise = F.drink = F.dinner = true; finale(); }],
  baths: ['the ALDI run', () => { F.wkBaths = true; loadMap('aldi'); }],
  aldi: ['the dog park', () => { F.wkGroceries = true; loadMap('park'); }],
  park: ['home', () => { F.wkFetch = true; loadMap('home'); }],
  home: ['the night out', () => { F.wkMovie = F.wkActivity = true; weekendOut(); }],
  qtown: ['the memories card', () => holidayEnd()], hunter: ['the memories card', () => holidayEnd()],
  thirroul: ['the memories card', () => holidayEnd()], portmac: ['the memories card', () => holidayEnd()]
};
ICONS.unshift([/^skip ahead/i, '⏭️', 'walk'], [/^stay here/i, '🌼', 'walk']);
// The section list: Skip while walking around shows every section still ahead, so you can jump to any of them.
// Each entry: [map or scene id, label, blurb, done() marks this section finished, go() opens it]
const SECTIONS = {
  day: [
    ['bedroom', 'Wake up', 'The bedroom, with Luca', () => { F.outfit = F.skincare = F.music = true; }, () => loadMap('bedroom')],
    ['gym', 'Gym', 'One Playground', () => { F.lifted = F.gymBattle = true; }, () => loadMap('gym')],
    ['office', 'Work', CONFIG.company, () => { F.sorted = F.officeBattle = true; }, () => loadMap('office')],
    ['lunch', 'Lunch break', 'Pick a lunch', () => { G.lunch = G.lunch || CONFIG.lunches[0].n; }, () => lunchScene()],
    ['beach', 'Golden hour', 'The beach', () => {}, () => loadMap('beach')],
    ['botanist', 'Dinner', CONFIG.dinnerSpot, () => { F.surprise = F.drink = F.dinner = true; }, () => loadMap('botanist')],
    ['finale', 'Fireworks', 'The big finish', () => {}, () => finale()]
  ],
  weekend: [
    ['baths', 'Morning swim', 'Greenwich Baths', () => { F.wkBaths = true; }, () => loadMap('baths')],
    ['aldi', 'ALDI run', 'Top Ryde', () => { F.wkGroceries = true; }, () => loadMap('aldi')],
    ['park', 'Dog park', 'Fetch with Luca', () => { F.wkFetch = true; }, () => loadMap('park')],
    ['home', 'Home', 'Movie, chess or a picnic', () => { F.wkMovie = F.wkActivity = true; }, () => loadMap('home')],
    ['wnight', 'Night out', 'Dinner or the wine bar', () => {}, () => weekendOut()],
    ['wend', 'Weekend wrap', 'The memories card', () => {}, () => weekendEnd()]
  ]
};
ICONS.unshift([/^gym$/i, '🏋️', 'walk'], [/^work$/i, '💼', 'walk'], [/^lunch break$/i, '🍜', 'walk'], [/^golden hour$/i, '🌅', 'walk'], [/^dinner$/i, '🍽️', 'walk'], [/^fireworks$/i, '🎆', 'walk'],
  [/^aldi run$/i, '🛒', 'walk'], [/^dog park$/i, '🎾', 'walk'], [/^home$/i, '🏡', 'walk'], [/^night out$/i, '🌙', 'walk'], [/^weekend wrap$/i, '📸', 'walk']);
function sectionMenu() {
  const list = SECTIONS[G.campaign || 'day'], here = list ? list.findIndex(s => s[0] === G.mapId) : -1;
  if (here < 0) return false;
  const items = list.slice(here + 1).map((s, i) => ({ n: s[1], d: s[2], j: here + 1 + i, quick: true })).concat([{ n: 'Stay here', d: 'Keep exploring', quick: true }]);
  pickMenu('Skip to a section', 'Jump ahead to any part of the ' + (G.campaign === 'weekend' ? 'weekend' : 'day') + '.', items, d => {
    if (d.j == null) return;
    G.mode = 'busy'; sfx('whoosh');
    fade(() => { for (let i = here; i < d.j; i++) list[i][3](); list[d.j][4](); });
  });
  return true;
}
function skipTalk() {
  // conversations often chain into the next one: keep going until something other than talk is on screen
  for (let i = 0; i < 12 && DLG && !MOMENT; i++) { DLG.q.length = 0; DLG.typing = false; nextLine(); }
  sfx('whoosh');
}
function fastSkip() {
  audioInit();
  if ($('#fade').classList.contains('on')) return;
  if (MOMENT) return MOMENT.skip();
  if (DLG) return skipTalk();
  const good = n => Array(n).fill('good');
  if (G.b) { const b = G.b; if (b.done) return; b.done = true; b.ehp = 0; bWin(); return bAdvance(); }
  if (G.lift) { if (G.lift.res.length < 3) G.lift.res = good(3); return finishLift(); }
  if (typeof SURF !== 'undefined' && SURF) { SURF.res = good(3); SURF.n = 3; SURF.ride = null; return surfDone(); }
  if (typeof BAR !== 'undefined' && BAR) { const B = BAR; BAR = null; clearUI(); G.mode = 'map'; return B.o.onDone && B.o.onDone(good(B.n)); }
  if (PET) return endPet(false);
  if (G.scene === 'drive' && D && !D.done) { ui.querySelectorAll('.panel').forEach(p => p.remove()); MENU = null; D.paused = false; G.mode = 'drive'; D.t = D.dur; return sfx('whoosh'); }
  if (G.scene === 'snow' && typeof SB !== 'undefined' && SB && !SB.done) { SB.t = SB.dur; return sfx('whoosh'); }
  if (G.scene === 'lunch') { clearUI(); G.lunch = G.lunch || CONFIG.lunches[0].n; return fade(() => loadMap('beach')); }
  if (G.scene === 'wnight' && G.mode !== 'busy') { clearUI(); return fade(weekendEnd); }
  if (G.scene === 'map' && G.mode === 'map' && sectionMenu()) return;
  if (G.scene === 'map' && G.mode === 'map' && SKIP_TO[G.mapId]) {
    const [to, go] = SKIP_TO[G.mapId];
    return pickMenu('Skip ahead?', 'Jump straight to ' + to + '.', [{ n: 'Skip ahead', d: 'On to ' + to, k: 1, quick: true }, { n: 'Stay here', d: 'Keep exploring', quick: true }], d => { if (d.k) { G.mode = 'busy'; sfx('whoosh'); fade(go); } });
  }
  toast('Finish this bit first, then skip.');
}
$('#skipBtn').onclick = fastSkip;
addEventListener('keydown', e => { if (e.code === 'Tab' && !e.repeat && !$('#hud').classList.contains('hidden')) { e.preventDefault(); fastSkip(); } });
QA_EXTRA.skipmenu = () => { G.campaign = 'day'; loadMap('bedroom'); setTimeout(() => { skipTalk(); fastSkip(); }, 1100); };
