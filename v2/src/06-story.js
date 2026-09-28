/* =========================================================
   STORY: the maps (same layouts as v1) and the day's chapter logic
   Legend: # wall . floor D door h heart _ wet sand ~ water
   ========================================================= */
const GRASS = '#a6dc8f';
const MAPS = {
  bedroom: {
    theme: 'bedroom', title: 'Chapter 1: Wake up', sky: 'morning', edge: GRASS,
    floor: ['#f6e3ff', '#efd8fb'], wall: ['#ffd1e1', '#ffc6da'],
    rows: ["#o######GGGG###", "#..ww.kk.vv.bb#", "#.........x.bb#", "#........S....#", "#..x..........#", "#.............#", "#.......x.....#", "#.....h.......#", "#..M..........#", "######D########"],
    start: { x: 7, z: 5, dir: 'down' }, luca: { x: 8, z: 5 },
    npcs: c => c === 'M' ? LOOK.mum : null,
    decorate(g) { mk(G_CYL, '#ffc2d6', [4.2, 0.03, 3], [6.5, 0.015, 5], g, { noShadow: true }); mk(G_CYL, '#fff0f6', [3.2, 0.035, 2.2], [6.5, 0.02, 5], g, { noShadow: true }); },
    hints: () => [!F.outfit && 'w', !F.skincare && 'v', !F.music && 'S', !F.mum && 'M', F.outfit && F.skincare && F.music && 'D'],
    onEnter() {
      G.wearing = 'pj';
      say(["It's the morning of " + CONFIG.name + "'s birthday!", "Her phone buzzes on the nightstand.", { n: CONFIG.boyfriend, t: "Good morning my Annette, have the best day!!!! I love you" }, { n: CONFIG.name, t: CONFIG.catchphrase }, "Pick an outfit, do skincare and put some tunes on. Tap things or walk up and press A."]);
    },
    doorOpen: () => F.outfit && F.skincare && F.music,
    doorLocked: () => ({ n: 'Mum', t: "Not so fast! Outfit, skincare and some tunes first, love." }),
    onDoor() { G.mode = 'busy'; say(["Luca sits by the door, tail going a mile a minute.", { n: 'Mum', t: "Luca's staying home with me today. Go have fun, love!" }, CONFIG.name + " gives Luca a big cuddle goodbye."], () => startDrive('suburb', 'gym', 'One Playground')); },
    act: {
      w: () => outfitMenu(),
      v: () => F.skincare ? say("Skin is already glowing. No notes.") : skincareGame(),
      S: () => musicMenu(),
      x: (x, z, o) => tidyItem(o),
      k: () => say(["Sooo many books! Thank goodness I have a Kobo."], () => secret('book')),
      o: () => secret('owl'),
      G: () => say("Birthday bunting. Mum was up early."),
      b: () => say("Tempting to crawl back in. But it's your birthday!"),
      M: () => talkMum()
    }
  },
  gym: {
    theme: 'gym', title: 'Chapter 2: Gym', sky: 'morning', edge: GRASS,
    floor: ['#d8f5ea', '#cdeee1'], wall: ['#e2d8ff', '#d8ccff'],
    rows: ["#########mm####", "#rr..rr..LL...#", "#.....h.......#", "#.g.......g...#", "#.............#", "#..bb....bb...#", "#.............#", "#.....n.......#", "#.............#", "######D########"],
    start: { x: 6, z: 8, dir: 'up' },
    npcs: (c, x) => c === 'g' ? (x < 6 ? { skin: '#f0c39a', hair: '#e07b39', hairStyle: 'bun', top: '#3fae7c', bottom: '#2b2d42' } : { skin: '#8a5a36', hair: '#2a1d12', hairStyle: 'fluffy', top: '#7f93b3', bottom: '#2b2d42' }) : c === 'n' ? { skin: '#e6b58f', hair: '#3a2f2a', top: '#ffa94d', bottom: '#4a4658' } : null,
    hints: () => [!F.lifted && 'r', F.lifted && !F.gymBattle && 'r', F.gymBattle && 'D'],
    onEnter() { G.wearing = 'gym'; say(["One Playground. " + CONFIG.name + " changes into her Lululemon set.", "Time to lift!"]); },
    doorOpen: () => F.gymBattle,
    doorLocked: () => "You just got here! Hit the squat rack first.",
    onDoor() { G.wearing = G.outfit; startDrive('city', 'office', CONFIG.company); },
    act: {
      r: () => F.gymBattle ? say("The rack is free, but those legs are cooked.") : F.lifted ? startBattle('lastset') : liftGame(),
      L: () => G.secrets.card ? say("Locker's empty now.") : secret('card'),
      m: () => say("Mirror check. Form looks strong, hair looks stronger."),
      b: () => say("A bench. For between sets, or for sitting on your phone."),
      g: (x) => say(x < 6 ? { n: 'Gym-goer', t: "Happy birthday! Want a spot on your next set?" } : { n: 'Gym-goer', t: CONFIG.insideJokes[0] }),
      n: () => say([{ n: 'Coach', t: "Breathe, brace, lift. And it's your birthday, so PR today." }, { n: CONFIG.name, t: CONFIG.catchphrase }])
    }
  },
  office: {
    theme: 'office', title: 'Chapter 3: Work', sky: 'day', edge: GRASS,
    floor: ['#e3f1ff', '#d8eaff'], wall: ['#fff4e0', '#fff0d6'],
    rows: ["#ww#ww#ww#ww###", "#............p#", "#.............#", "#.dd..dd..YZ..#", "#..c...c......#", "#.............#", "#.dd..dd..dd..#", "#..c......c...#", "#.........h...#", "######D########"],
    start: { x: 6, z: 8, dir: 'up' },
    npcs: (c, x, z) => c === 'c' ? ((x + z) % 2 ? { skin: '#cf9b6f', hair: '#6b4a32', top: '#7f93b3', bottom: '#4a4658', glasses: true } : { skin: '#f0c39a', hair: '#3a2f2a', hairStyle: 'bun', top: '#c55a6c', bottom: '#3a3d5c' }) : null,
    hints: () => [!F.sorted && 'Y', !F.officeBattle && 'Z', F.sorted && F.officeBattle && 'D'],
    onEnter() { G.wearing = G.outfit; say([CONFIG.company + ", Sydney CBD. Birthday balloons on the project coordinator's desk.", "File the reports at your desk, then battle that inbox on the computer."]); },
    doorOpen: () => F.sorted && F.officeBattle,
    doorLocked: () => "Not yet. File the reports and beat the inbox first.",
    onDoor() { G.mode = 'busy'; say(["Project updates sent. Exec reports signed off.", "Clock off for lunch! Everyone's starving."], () => fade(lunchScene)); },
    act: {
      Y: () => F.sorted ? say("Reports filed. Not a single stray page.") : sortGame(),
      Z: () => F.officeBattle ? say("Inbox zero. Beautiful.") : startBattle('inbox'),
      w: () => say("The harbour sparkles between the towers."),
      p: () => say("A desk plant, alive thanks to " + CONFIG.name + "'s watering reminders."),
      d: () => say("A coworker's desk. Messier than " + CONFIG.name + " would ever allow."),
      c: (x, z) => say({ n: 'Coworker', t: ({ '3,4': "Happy birthday! There's cake in the kitchen at three.", '7,4': CONFIG.insideJokes[1], '3,7': "Your project updates are the only ones the execs actually read." })[x + ',' + z] || "Happy birthday! Lunch is on us next week." })
    }
  },
  beach: {
    theme: 'beach', title: 'Chapter 5: Golden hour', sky: 'golden', outdoor: true, edge: '#ffe3aa',
    floor: ['#ffe9b8', '#ffe3aa'], wet: '#f3cf8e', wall: ['#fff', '#fff'],
    rows: ["~~~~~~~~~~~~~~~", "~~~~~~~~~~~~~~~", "_______________", ".....u...JJ....", "...............", "...s.......s...", "......h........", ".........h.....", "...p...........", "..............."],
    start: { x: 7, z: 9, dir: 'up' },
    hints: () => ['J'],
    onEnter() { G.wearing = G.outfit; say(["Golden hour at the beach.", "The sea breeze is perfect.", CONFIG.car + " is parked by the sand whenever you're ready for dinner."]); },
    act: {
      J: () => say([CONFIG.car + " the Corolla, parked and ready.", { n: CONFIG.boyfriend, t: "(Text message) Table's booked at The Botanist. Wear the blue dress?" }, { n: CONFIG.name, t: CONFIG.catchphrase }], () => { const c = W.objs.find(o => o.ch === 'J'); if (c) { sfx('honk'); confetti(c.x + 0.5, 1, c.z, 30); } fade(() => loadMap('botanist')); }),
      s: (x) => say(x < 6 ? CONFIG.insideJokes[2] : "Just a shell. Luca would have sniffed it suspiciously."),
      u: () => say("A beach umbrella. Shade for later."),
      p: () => say("A palm tree swaying in the breeze."),
      '~': () => say("The water looks perfect. Luca would love this."),
      _: () => say("Wet sand squishes between her toes.")
    }
  },
  botanist: {
    theme: 'botanist', title: 'Chapter 6: ' + CONFIG.dinnerSpot, sky: 'evening', edge: GRASS,
    floor: ['#f7d9c4', '#f2cdb4'], wall: ['#bfe3cf', '#b2dcc4'], trim: '#fff4e8',
    rows: ["######F########", "#f...n.....f.f#", "#..rrrrrr.....#", "#.............#", "#....f...f...h#", "#.............#", "#......At.....#", "#.............#", "#f...........f#", "######D########"],
    start: { x: 6, z: 8, dir: 'up' },
    npcs: c => c === 'n' ? { skin: '#8a5a36', hair: '#6b4a32', top: '#2f5d4a', bottom: INK, apron: '#fff4e8' } : c === 'A' ? LOOK.paulo : null,
    decorate(g) { for (let i = 0; i < 4; i++) makeFairyLights(g, 1, 1.5 + i * 2, 13, 1 + i * 2, 1.9, 22); },
    hints: () => [!F.drink && 'n', F.drink && !F.dinner && 'A'],
    onEnter() { G.wearing = 'dress'; say([CONFIG.dinnerSpot + ". Fairy lights, plants everywhere, harbour breeze.", CONFIG.name + "'s in her blue dress.", { n: CONFIG.boyfriend, t: "Wow! Look how beautiful your outfit is." }, "Grab a drink at the bar, then join " + CONFIG.boyfriend + " at the table."]); },
    doorOpen: () => false,
    doorLocked: () => "Leaving? The night's just getting started.",
    act: {
      n: () => F.drink ? say({ n: 'Bartender', t: "Another round? Just say the word." }) : drinkMenu(),
      r: () => F.drink ? say({ n: 'Bartender', t: "Another round? Just say the word." }) : drinkMenu(),
      A: () => F.dinner ? say({ n: CONFIG.boyfriend, t: "Best night ever." }) : F.drink ? dinnerMenu() : say({ n: CONFIG.boyfriend, t: "Let's get a drink first. We can get whateeeeeeeever you want! :D" }),
      F: () => secret('poster'),
      t: () => say("Candlelit tables. Very date night."),
      f: () => say("A giant fern. The Botanist takes the name seriously.")
    }
  }
};
const STORY_MAPS = ['bedroom', 'gym', 'office', 'beach', 'botanist'];
HEARTS_TOTAL = STORY_MAPS.reduce((n, id) => n + MAPS[id].rows.join('').split('h').length - 1, 0);

function loadMap(id) {
  clearUI(); G.scene = 'map'; G.mapId = id;
  const def = MAPS[id];
  if (id === 'gym') G.wearing = 'gym'; else if (id === 'botanist') G.wearing = 'dress'; else if (id === 'bedroom' && !F.outfit) G.wearing = 'pj'; else G.wearing = G.outfit;
  buildMap(id);
  showHUD(true); setChapter(def.title); chapterCard(def.title); G.clock = SCENE_TIME[id] || G.clock;
  saveCheckpoint(id);
  G.mode = 'map';
  setTimeout(() => { if (G.scene === 'map' && G.mapId === id && G.mode === 'map') def.onEnter && def.onEnter(); }, 900);
}
function reWear(key) {
  if (!W || !W.player) return; G.wearing = key;
  const old = W.player.g, g = makeAnnette(key); g.position.copy(old.position); g.rotation.copy(old.rotation);
  world.remove(old); world.add(W.player.g = g); popIn(g); confetti(g.position.x, 0.8, g.position.z, 36); sfx('pop');
}

/* ---------------- chapter 1: bedroom ---------------- */
function outfitMenu() {
  pickMenu('Wardrobe', 'What is the birthday girl wearing today?', DAY_OUTFITS.map(k => ({ n: OUTFITS[k].name, d: OUTFITS[k].note, k })), d => {
    G.outfit = d.k; const first = !F.outfit; F.outfit = true; reWear(d.k); if (first) stat('glow', 10);
    say(d.k === 'dinner' ? "All black. Sleek, sharp, boardroom-ready." : d.k === 'sunny' ? "Sunshine yellow. The day already looks brighter." : "Navy blazer on. The execs don't stand a chance.");
    refreshHints();
  });
}
function skincareGame() {
  let step = 0, miss = 0;
  const p = panel('Skincare routine', 'Tap the steps in the right order.', 'grid2');
  const prog = el('p', 'sub'); p.insertBefore(prog, p.querySelector('.grid2'));
  const upd = () => { prog.textContent = step ? 'Done: ' + STEPS.slice(0, step).map(s => s.split(':')[0]).join(', ') : 'Step 1 of ' + STEPS.length; };
  upd();
  const btns = shuffle(STEPS.slice()).map(s => makeBtn(`<span>${esc(s.split(':')[0])}</span><small>${esc(s.split(': ')[1])}</small>`, b => {
    if (s === STEPS[step]) {
      step++; b.disabled = true; b.classList.add('done'); sfx('good'); upd();
      if (W && W.player) sparkle(W.player.g.position.x, 1.1, W.player.g.position.z, 10);
      if (step === STEPS.length) {
        clearUI(); F.skincare = true; G.mode = 'map'; stat('glow', Math.max(10, 30 - miss * 5));
        if (miss <= 1) earn('glow');
        say(miss === 0 ? ["Flawless routine. Skin: glowing. Confidence: maxed."] : ["Routine complete. Skin: glowing.", miss <= 1 ? "Only one mix-up. Still flawless." : "A few mix-ups, but the glow is real."]);
        refreshHints();
      } else { const n = MENU.b.findIndex(x => !x.disabled); if (MENU.b[MENU.i].disabled && n >= 0) focusMenu(n); }
    } else { miss++; sfx('bad'); p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake'); }
  }));
  p.querySelector('.grid2').append(...btns);
  setMenu(btns, { cols: innerWidth > 460 ? 2 : 1, onBack: () => { clearUI(); G.mode = 'map'; } });
}
function musicMenu() {
  pickMenu('Morning tunes', 'Who is on the speaker?', CONFIG.radio.map(a => ({ n: a, d: 'Now playing: ' + CONFIG.radioBars[a][0] })), d => {
    G.radio = d.n; const first = !F.music; F.music = true; if (first) stat('happy', 8);
    const s = W.objs.find(o => o.ch === 'S'); if (s) { FX.emit(s.x, 1, s.z, ['#ff7aa8', '#b9a3ff', '#7fc8f8'], 24, 1.6, { g: -1.2, life: 1.8 }); }
    sfx('good'); toast('Now playing: ' + d.n + ', ' + CONFIG.radioBars[d.n][0]);
    say(d.n + " on the speaker. Luca does a little dance.", refreshHints);
    if (W.luca) W.luca.g.userData.spin = 1;
  });
}
function tidyItem(o) {
  if (!o) return;
  W.objs.splice(W.objs.indexOf(o), 1); W.grid[o.z][o.x] = '.';
  sparkle(o.x, 0.3, o.z, 20); sfx('pop'); world.remove(o.g);
  G.tidied++; stat('happy', 3, true);
  toast(G.tidied >= 3 ? 'Room tidy! Mum will be impressed.' : 'Tidied ' + G.tidied + ' of 3');
}
function talkMum() {
  const first = !F.mum;
  const menu = () => pickMenu('Mum', 'Anything before you head off?', [
    { n: 'Flat white by the window', d: 'A slow sip before the big day', k: 'coffee' },
    { n: 'Big birthday hug', d: 'The best kind', k: 'hug' },
    { n: 'See you tonight', d: 'Off we go', k: 'bye' }
  ], d => {
    if (d.k === 'coffee') { if (!F.coffee) { F.coffee = true; stat('energy', 15); } say(["The morning light pours in. Perfect flat white.", { n: CONFIG.name, t: "Okay. Now I'm ready." }], refreshHints); }
    else if (d.k === 'hug') { stat('happy', 5); const m = W.npcs.find(n => n.ch === 'M'); if (m) FX.emit(m.x, 1.2, m.z, '#ff7aa8', 12, 1.2, { g: -1, life: 1.2 }); say({ n: 'Mum', t: "Happy birthday, darling. Go shine." }, refreshHints); }
    else say({ n: 'Mum', t: "Have the best day, love!" }, refreshHints);
  });
  if (first) { F.mum = true; stat('happy', 10); say([{ n: 'Mum', t: "Happy birthday, love! I can't believe how grown up you are." }, { n: 'Mum', t: "Luca's been waiting by your door since six." }, { n: 'Mum', t: "Make yourself a flat white and relax by the big window before your big day." }, { n: CONFIG.name, t: CONFIG.catchphrase }], menu); }
  else menu();
}
function lucaTalk() { petGame(); }

/* ---------------- chapter 4: lunch (a tiny cafe island) ---------------- */
function lunchScene() {
  clearWorld(); clearUI(); G.scene = 'lunch'; G.mode = 'busy'; showHUD(true);
  setChapter('Chapter 4: Lunch break'); chapterCard('Chapter 4: Lunch break'); G.clock = SCENE_TIME.lunch; setSky('day');
  W = { id: 'lunch', objs: [], npcs: [], hearts: [], markers: [], anim: [], dispose: [], walls: [], decor: [] };
  makeIslandBase(world, 7, 5, GRASS, 3, 2); fitSun(3, 2, 7);
  mk(G_BOX, '#ffe3c2', [7, 0.2, 5], [3, -0.1, 2], world);
  for (let i = 0; i < 7; i++) mk(G_BOX, i % 2 ? '#ff9fb2' : '#ffffff', [1, 0.12, 0.7], [i, 1.9, -0.3], world);
  mk(G_BOX, '#fff4e8', [7, 1.8, 0.3], [3, 0.9, -0.35], world);
  mk(G_BOX, '#bfe6ff', [2.4, 1, 0.05], [1.3, 1, -0.18], world, { noShadow: true }); mk(G_BOX, '#2f3b36', [1.8, 1.1, 0.06], [4.6, 1.05, -0.17], world);
  for (let i = 0; i < 4; i++) mk(G_BOX, '#ffffff', [0.9 - (i % 2) * 0.3, 0.04, 0.02], [4.4, 1.35 - i * 0.2, -0.13], world, { noShadow: true });
  mk(G_CYL, '#ffffff', [2.2, 0.08, 1.5], [3, 0.62, 2], world); mk(G_CYL, '#c89f7a', [0.12, 0.6, 0.12], [3, 0.3, 2], world);
  for (let i = 0; i < 6; i++) mk(G_BOX, '#ff9fb2', [0.3, 0.01, 0.3], [2.25 + (i % 3) * 0.6 + (Math.floor(i / 3) ? 0.3 : 0), 0.665, 1.7 + Math.floor(i / 3) * 0.6], world, { noShadow: true });
  mk(G_SPH, '#e2554f', [0.7, 0.35, 0.7], [3, 0.8, 2], world); mk(G_CYL, '#fff4c9', [0.55, 0.04, 0.55], [3, 0.92, 2], world);
  const steam = grp(world, 3, 1, 2); W.steam = steam;
  makePlant(world, 0, 3.8, true); makePlant(world, 6, 3.8, true);
  const a = makeAnnette(G.outfit); a.position.set(3, 0, 3.4); a.rotation.y = Math.PI; world.add(a); W.player = { g: a, x: 3, z: 3, dir: 'up', moving: false, path: [] };
  for (let i = 0; i < 6; i++) makeCloud(world, -20 + i * 8, -5.5 + hsh(i, 1) * 1.5, -6 + hsh(i, 2) * 14, 1.3);
  cam.goal.set(3, 0.5, 2); cam.target.copy(cam.goal); cam.zoomGoal = 1.5; cam.pitch = 0.96; cam.orbit = 0; cam.base = 11; cam.yawGoal = Math.round(cam.yawGoal / (Math.PI / 2)) * (Math.PI / 2);
  setTimeout(() => {
    pickMenu('Lunch break', 'Midday hunger hits. What are we grabbing?', CONFIG.lunches, d => {
      G.mode = 'busy'; stat('energy', 20, true); stat('happy', 8, true); confetti(3, 1.2, 2, 30); sfx('good');
      say([{ n: CONFIG.name, t: "Lunch sorted: " + d.n + "." }, "Refuelled and ready. Golden hour at the beach next.", { n: CONFIG.name, t: CONFIG.catchphrase }], () => startDrive('coast', 'beach', 'the beach'));
    }, false);
  }, 1200);
}

/* ---------------- chapter 6: dinner, cake, speech ---------------- */
function drinkMenu() {
  pickMenu('Cocktail list', 'What are we drinking?', CONFIG.drinks, d => {
    F.drink = true; stat('happy', 10); G.drink = d.n;
    const n = W.npcs.find(n => n.ch === 'n'); if (n) sparkle(n.x, 1.3, n.z, 20);
    say([{ n: 'Bartender', t: "Coming right up. Happy birthday!" }, d.n + " in hand. Perfect.", CONFIG.boyfriend + " is waiting at the table."], refreshHints);
  });
}
function dinnerMenu() {
  pickMenu('Dinner with ' + CONFIG.boyfriend, 'Order anything. It is your night.', CONFIG.dishes, d => {
    F.dinner = true; stat('energy', 30); refreshHints();
    say([{ n: CONFIG.boyfriend, t: "Good choice. The " + d.n.toLowerCase() + " here is unreal." }, d.n + ". Absolutely delicious. Five stars.", { n: CONFIG.boyfriend, t: "Okay. One more thing." }, "The staff bring out a birthday cake, candles lit.", "The whole bar starts singing."], cakeTime);
  });
}
function cakeTime() {
  G.mode = 'busy';
  const t = W.objs.find(o => o.ch === 't');
  const cake = makeCake(world, t.x, 0.65, t.z, 3); popIn(cake); cake.scale.setScalar(0.001); sfx('pop');
  cam.goal.set(t.x - 0.4, 0.6, t.z); cam.zoomGoal = 2.2;
  const d = el('div', 'dock', '<h3>Make a wish!</h3><p class="sub" style="margin:0 0 10px">Blow out all three candles.</p>');
  const b = makeBtn('Blow', () => {
    const f = cake.userData.flames.find(f => f.visible); if (!f) return;
    f.visible = false; sfx('blow'); const wp = new THREE.Vector3(); f.getWorldPosition(wp); FX.emit(wp.x, wp.y, wp.z, ['#ffffff', '#e8e0f0'], 10, 0.8, { g: -1, life: 1.2 });
    if (!cake.userData.flames.some(f => f.visible)) {
      clearUI(); confetti(t.x, 1.4, t.z, 90); sfx('badge'); cam.shake = SET.calm ? 0 : 0.15;
      setTimeout(() => say(CONFIG.finaleMessage.map(t => ({ n: CONFIG.boyfriend, t })).concat([{ n: CONFIG.name, t: CONFIG.catchphrase }]), () => fade(finale)), 900);
    }
  }, 'big');
  d.append(b); ui.append(d); setMenu([b]);
}

/* ---------------- finale: fireworks over the harbour ---------------- */
function buildHarbour() {
  clearWorld(); setSky('night'); fitSun(0, 0, 16);
  W = { id: 'finale', objs: [], npcs: [], hearts: [], markers: [], anim: [], dispose: [], walls: [], decor: [] };
  const water = mk(G_BOX, '#4a5fb8', [26, 0.4, 18], [0, -0.35, 0], world); water.receiveShadow = true;
  for (let i = 0; i < 40; i++) mk(G_BOX, '#7f8fe0', [0.5 + hsh(i, 1), 0.02, 0.06], [(hsh(i, 2) - 0.5) * 24, -0.14, (hsh(i, 3) - 0.5) * 16], world, { noShadow: true, glow: true, alpha: 0.6 });
  makeIslandBase(world, 26, 18, '#6f86d6', 0, 0);
  // the bridge: arch, deck and pylons (simple shapes, not a model of anything)
  const br = grp(world, 0, 0, -4.5);
  const arch = mk(geo('arch', () => new THREE.TorusGeometry(6, 0.28, 8, 40, Math.PI)), '#9aa3c7', [1, 1, 1], [0, -0.6, 0], br); arch.scale.y = 0.62;
  mk(G_BOX, '#8a93b8', [15, 0.25, 1.1], [0, 1.5, 0], br);
  for (let i = -5; i <= 5; i++) mk(G_BOX, '#9aa3c7', [0.08, Math.max(0.1, 3.72 * Math.sqrt(Math.max(0, 1 - (i / 6) ** 2)) - 2.1), 0.08], [i, 1.62 + Math.max(0.1, 3.72 * Math.sqrt(Math.max(0, 1 - (i / 6) ** 2)) - 2.1) / 2, 0], br, { noShadow: true });
  [-7.2, 7.2].forEach(x => { mk(G_BOX, '#d8cdb8', [1, 2.6, 1.3], [x, 1.1, 0], br); mk(G_BOX, '#c9bda6', [1.1, 0.2, 1.4], [x, 2.45, 0], br); });
  for (let i = 0; i < 18; i++) mk(G_SPH, '#fff4b0', [0.1, 0.1, 0.1], [-6.8 + i * 0.8, 1.72, 0.56], br, { glow: true });
  // white sail roofs on a little point
  const pt = grp(world, 6.5, 0, 2.5);
  mk(G_BOX, '#e8d8c0', [4, 0.4, 2.6], [0, 0.1, 0], pt);
  [[-1.2, 1.3], [-0.2, 1.7], [0.8, 1.4], [1.6, 1.0]].forEach(([x, s], i) => { const c = mk(geo('sail', () => new THREE.SphereGeometry(0.5, 16, 10, 0, Math.PI, 0, Math.PI / 2)), '#fffaf2', [1.2 * s, 1.8 * s, 1.2 * s], [x, 0.3, 0], pt); c.rotation.y = -Math.PI / 2 + i * 0.1; c.rotation.z = -0.35; });
  // the pier with our stars
  mk(G_BOX, '#c89f7a', [3.4, 0.2, 1.8], [-2, 0.05, 3.5], world);
  for (let i = 0; i < 4; i++) mk(G_CYL, '#a8744f', [0.18, 0.7, 0.18], [-3.5 + i, -0.2, 4.3], world);
  const a = makeAnnette('dress'); a.position.set(-2.4, 0.15, 3.4); a.rotation.y = Math.PI; world.add(a);
  const p = makePerson(LOOK.paulo); p.position.set(-1.7, 0.15, 3.4); p.rotation.y = Math.PI; world.add(p);
  W.cast = [a, p];
  for (let i = 0; i < 5; i++) { const b = makeBalloon(world, -3.2 + i * 0.35, 0.15, 3.9, CONFETTI[i], 1.6 + (i % 2) * 0.3); b.userData.bob = true; W.anim.push(b); }
  for (let i = 0; i < 6; i++) makeCloud(world, -24 + i * 9, 5 + hsh(i, 4) * 3, -10 + hsh(i, 5) * 6, 1.4);
  cam.goal.set(0, 1.5, 0); cam.target.copy(cam.goal); cam.zoomGoal = 0.62; cam.pitch = 0.62; cam.orbit = SET.calm ? 0.02 : 0.06;
  G.fwT = 0;
}
function finale() {
  clearUI(); G.scene = 'finale'; G.mode = 'busy'; showHUD(false);
  buildHarbour(); G.clock = SCENE_TIME.finale; G.stats.happy = 100; updateHUD(); clearCheckpoint();
  setTimeout(() => earn('birthday'), 3200);
  const t = el('div', 'title', `<div class="logo"><h1>Happy birthday, ${esc(CONFIG.name)}!</h1></div>`);
  const b = makeBtn('Roll credits', credits, 'big'); const w = el('div', 'tbtns'); w.append(b); t.append(w);
  ui.append(t); setMenu([b], { keepMode: true });
}
function updateFireworks(dt) {
  G.fwT -= dt;
  if (G.fwT <= 0) {
    G.fwT = (SET.calm ? 1.2 : 0.55) + Math.random() * 0.5;
    const x = (Math.random() - 0.5) * 16, y = 5 + Math.random() * 4, z = -6 + Math.random() * 5, c = CONFETTI[Math.floor(Math.random() * 5)];
    FX.emit(x, y, z, [c, '#ffffff', c], SET.calm ? 26 : 60, 5, { g: 2.5, life: 1.6 }); sfx('boom');
  }
  if (W && W.cast) W.cast.forEach((g, i) => { animatePerson(g, false, dt, G.t + i); g.position.y = 0.15 + (SET.calm ? 0 : Math.max(0, Math.sin(G.t * 3 + i * 1.5)) * 0.12); });
}
function credits() {
  clearUI(); G.scene = 'credits'; G.mode = 'credits'; clearCheckpoint();
  const got = Object.keys(BADGES).filter(k => G.badges[k]).map(k => '<p>' + BADGES[k].n + '</p>').join('') || '<p>None yet. Play again!</p>';
  const c = el('div', 'credits', `<div class="roll"><h3>${esc(CONFIG.name)}'s Big Day</h3><p>v2, the whimsical edition</p><h3>Starring</h3><p>${esc(CONFIG.name)} as herself</p><p>Luca as the goodest boy</p><p>Mum as Mum</p><p>${esc(CONFIG.boyfriend)} as the boyfriend</p><p>${esc(CONFIG.car)} as the blue Corolla</p><h3>Filmed on location</h3><p>North Ryde</p><p>One Playground</p><p>${esc(CONFIG.company)}</p><p>The beach at golden hour</p><p>${esc(CONFIG.dinnerSpot)}</p><h3>Collection</h3><p>Hearts: ${heartsFound()} of ${HEARTS_TOTAL}</p><p>Secrets: ${Object.keys(G.secrets).length} of 4</p><p>Balloons caught: ${G.balloons}</p><h3>Badges</h3>${got}<h3>Made with love</h3><p>Design, code and cuddles: ${esc(CONFIG.boyfriend)}</p><p>Built with Claude Code and three.js</p><p>Fonts: Fredoka and Figtree (SIL OFL)</p><h3>Happy birthday, ${esc(CONFIG.name)}</h3></div>`);
  ui.append(c);
  const bw = el('div', 'cbtns');
  const b = makeBtn('Play again', () => fade(titleScreen), 'big');
  const btns = [b];
  if (typeof startWeekend === 'function') btns.push(makeBtn('Play the weekend', () => fade(startWeekend), 'big alt'));
  if (typeof startHoliday === 'function') btns.push(makeBtn('Go on holiday', () => fade(startHoliday), 'big sky'));
  bw.append(...btns); c.append(bw); setMenu(btns, { cols: btns.length, keepMode: true });
}
