/* =========================================================
   HOLIDAY PACK: go on holiday with Paulo. Pick a trip:
   Queenstown ski trip (NZ, from our real Aug 2026 itinerary) or a Hunter Valley wine weekend.
   Queenstown: lake town > Greentoad gear > ski bus > snowboard run > rest day > farewell dinner > memories.
   Hunter Valley: vineyard > blind tasting at the cellar door > cheese > morning adventure > dinner > memories.
   Luca stays home with Mum for these (he is having a sleepover).
   ========================================================= */

// EDIT ME: holiday content
CONFIG.holiday = {
  qt: {
    dates: "Sun 30 Aug to Sat 5 Sep 2026",
    flight: "Virgin, SYD 8:30am to ZQN 1:30pm",
    stay: "Lomond Lodge",
    fields: [
      { n: "Cardrona", d: "Wide and mellow. Lesson day!", k: 'cardrona' },
      { n: "The Remarkables", d: "Sunny bowls, rocky lines", k: 'remarks' },
      { n: "Coronet Peak night ski", d: "Under the lights till 9pm", k: 'coronet' }
    ],
    // winter clothing: which jacket made the suitcase
    jackets: [
      { n: "Arc'teryx shell", d: "The fancy one. Waterproof to the soul.", c: '#b9a3ff' },
      { n: "Patagonia puffer", d: "Toasty, and it'll last forever", c: '#ff8a5c' },
      { n: "ALDI snow jacket", d: "Centre aisle special buy. Iconic.", c: '#7fc8f8' },
      { n: "Kathmandu parka", d: "Bought on sale, obviously", c: '#ff7aa8' },
      { n: "Macpac jacket", d: "Kiwi made for kiwi snow", c: '#7fd6b4' }
    ],
    gear: [
      { n: "Snowboard", d: "Sideways and stylish", k: 'board' },
      { n: "Skis", d: "Two planks, poles and pizza", k: 'ski' }
    ],
    // runs from The Remarkables trail map (NZ maps have no reds, so Shadow Basin plays the red)
    runs: {
      remarks: [
        { n: "Homeward Run", d: "Green. A 1.5 km cruise home", g: 'green', lift: "the Sugar Bowl Express" },
        { n: "Alta Blue", d: "Blue. Rolling, with huge views", g: 'blue', lift: "the Alta Chair" },
        { n: "Shadow Basin", d: "Red. Steeper, off the big chair", g: 'red', lift: "the Shadow Basin Chair" },
        { n: "Alta Chutes", d: "Black. The famous chutes. Deep breath.", g: 'black', lift: "the Alta Chair and a little hike" }
      ],
      other: [
        { n: "Green run", d: "Wide and gentle", g: 'green', lift: "the beginner chair" },
        { n: "Blue run", d: "Cruisy groomers", g: 'blue', lift: "the main chair" },
        { n: "Red run", d: "Getting spicy", g: 'red', lift: "the express chair" },
        { n: "Black run", d: "Steep and bumpy", g: 'black', lift: "the top chair" }
      ]
    },
    ferg: [
      { n: "Big Al burger", d: "The post-ski hunger killer" },
      { n: "Little Lamby burger", d: "Lamb, mint and aioli" },
      { n: "Fergbaker venison pie", d: "Cheap, famous, perfect" },
      { n: "Mrs Ferg gelato", d: "Yes, even in winter" }
    ],
    rest: [
      { n: "Onsen Hot Pools", d: "Cedar tubs over the canyon" },
      { n: "Skyline gondola and luge", d: "Right behind the lodge" },
      { n: "Shotover Jet", d: "Spins through the canyons" },
      { n: "Arrowtown", d: "Gold-rush village and cosy pubs" },
      { n: "Glenorchy drive", d: "Red shed, big mountains" }
    ],
    dinner: [
      { n: "Botswana Butchery", d: "Lamb shoulder by the fire" },
      { n: "Fergburger by the lake", d: "The queue is part of it" },
      { n: "Pedro's House of Lamb", d: "Slow roast at the lodge" },
      { n: "Winnies pizza", d: "The roof opens. Apres-ski!" },
      { n: "Patagonia hot chocolate", d: "With churros, obviously" }
    ]
  },
  hv: {
    wines: [
      { n: "Semillon", note: "Crisp and zesty, all lemon and lime. The Hunter's signature white." },
      { n: "Shiraz", note: "Earthy, peppery and warm. A classic Hunter red." },
      { n: "Chardonnay", note: "Round and creamy with a little kiss of oak." },
      { n: "Verdelho", note: "Tropical fruit salad in a glass." }
    ],
    cheese: [
      { n: "Triple cream brie", d: "Gooey, obviously" },
      { n: "Smoked cheddar", d: "Pairs with the Shiraz" },
      { n: "Blue cheese", d: "For the brave" },
      { n: "Chocolate fudge", d: "Next door. It counts." }
    ],
    morning: [
      { n: "Hot air balloon at sunrise", d: "Mist over the vines" },
      { n: "Hunter Valley Gardens", d: "A slow wander, coffee in hand" },
      { n: "Spa morning", d: "Robes on, phones off" }
    ],
    dinner: [
      { n: "Degustation at a winery", d: "Seven courses, matched wines" },
      { n: "Wood-fired pizza among the vines", d: "Fairy lights and a bottle of red" },
      { n: "Long lunch cheese board", d: "Stretched all the way to dinner" }
    ]
  }
};
const HOL = CONFIG.holiday;
let HLOG = {};
Object.assign(SCENE_TIME, { qtown: 13 * 60 + 50, hunter: 11 * 60, hstart: 7 * 60, snow: 9 * 60 + 15, hend: 22 * 60 });
Object.assign(NPC_CHARS, { qtown: 'A', hunter: 'A' });
OUTFITS.winter = { name: "Cosy knit", style: "pants", note: "Cream knit, jeans and a beanie", top: '#f3e2c7', bottom: '#3f6fb0', beanie: '#ff7aa8' };
OUTFITS.snow = { name: "Snow gear", style: "pants", note: "Greentoad jacket, pants and a helmet", top: '#ff7aa8', bottom: '#3a3148', beanie: '#ffffff' };
LOOK.pauloSnow = Object.assign({}, LOOK.paulo, { top: '#3f6fb0', bottom: '#2b2d42', beanie: '#ffd166' });
Object.assign(BADGES, {
  powder: { n: 'Powder hound', how: 'Ride a green, blue, red and black run', pack: true },
  black: { n: 'Black diamond', how: 'Make it down a black run', pack: true },
  somm: { n: 'Sommelier', how: 'Guess all four wines at the cellar door', pack: true },
  luge: { n: 'Luge legend', how: 'Beat Paulo down the Skyline luge', pack: true }
});
DRIVE_THEMES.hunter = { sky: 'golden', ground: '#b8d98a', side: 'gum', label: 'Up the M1 to the Hunter' };
const HOL_FLAGS = ['qtGear', 'qtSki', 'qtRest', 'qtLuge', 'hvTaste', 'hvCheese', 'hvMorning'];

// pictures and moments for the holiday choices (checked before the everyday ones)
ICONS.unshift(
  [/queenstown/i, '🏂', 'trip'], [/hunter valley gardens/i, '🌷', 'adventure'], [/hunter valley/i, '🍇', 'trip'],
  [/^snowboard$/i, '🏂', 'snow'], [/^skis$/i, '⛷️', 'snow'], [/shell|puffer|parka|snow jacket|macpac/i, '🧥', 'outfit'],
  [/homeward|green run/i, '🟢', 'snow'], [/alta blue|blue run/i, '🔵', 'snow'], [/shadow basin|red run/i, '🔴', 'snow'], [/alta chutes|black run/i, '⚫', 'snow'],
  [/cardrona/i, '☀️', 'snow'], [/remarkables/i, '🏔️', 'snow'], [/coronet/i, '🌙', 'snow'], [/jacket/i, '🧥', 'outfit'],
  [/big al|little lamby|fergburger/i, '🍔', 'dine'], [/venison pie/i, '🥧', 'dine'], [/gelato/i, '🍨', 'dine'],
  [/onsen/i, '♨️', 'adventure'], [/skyline|gondola/i, '🚡', 'adventure'], [/shotover/i, '🚤', 'adventure'], [/arrowtown/i, '🍂', 'adventure'], [/glenorchy/i, '🏞️', 'adventure'],
  [/botswana/i, '🥩', 'dine'], [/pedro/i, '🍖', 'dine'], [/winnies/i, '🍕', 'dine'], [/patagonia/i, '☕', 'drink'],
  [/semillon|verdelho|chardonnay/i, '🥂', 'wine'], [/shiraz/i, '🍷', 'wine'],
  [/hot air balloon/i, '🎈', 'adventure'], [/spa morning/i, '🧖', 'adventure'], [/fudge/i, '🍫', 'picnic'],
  [/degustation/i, '🍽️', 'dine'], [/brie|cheddar|blue cheese|cheese board/i, '🧀', 'picnic']
);
Object.assign(MOMENT_LINES, { trip: 'Bags packed, off we go', snow: 'Send it!', adventure: 'Best rest day ever' });
Object.assign(MOMENT_PROPS, { trip: ['☁️', '✈️', '☁️'], snow: ['❄️', '❄️', '❄️'], adventure: ['✨', '🎉', '✨'] });

/* ---------------- holiday art ---------------- */
function makePine(parent, x, z, s, snowy) {
  const g = grp(parent, x, 0, z); s = s || 1;
  mk(G_CYL, '#8a5a3b', [0.14 * s, 0.4 * s, 0.14 * s], [0, 0.2 * s, 0], g);
  [[0.95, 0.55, 0.5], [0.75, 0.5, 0.85], [0.52, 0.45, 1.18]].forEach(([r, h, y], i) => {
    mk(G_CONE, ['#3f8f6b', '#4a9e76', '#57ad82'][i], [r * s, h * s, r * s], [0, y * s, 0], g);
    if (snowy) mk(G_CONE, '#ffffff', [r * 0.62 * s, h * 0.4 * s, r * 0.62 * s], [0, (y + h * 0.3) * s, 0], g, { noShadow: true });
  });
  g.userData.sway = Math.random() * TAU; return g;
}
function makeMountain(parent, x, z, r, h, rock) {
  const g = grp(parent, x, 0, z);
  const m = mk(G_CONE, rock || '#8e95a8', [r, h, r], [0, h / 2, 0], g, { noShadow: true }); m.rotation.y = hsh(x, z) * 3;
  const cap = mk(G_CONE, '#ffffff', [r * 0.46, h * 0.46, r * 0.46], [0, h * 0.77, 0], g, { noShadow: true }); cap.rotation.y = m.rotation.y;
  return g;
}
function makeSnowman(parent, x, z) {
  const g = grp(parent, x, 0, z);
  mk(G_SPH, '#ffffff', [0.6, 0.55, 0.6], [0, 0.27, 0], g); mk(G_SPH, '#ffffff', [0.42, 0.4, 0.42], [0, 0.7, 0], g); mk(G_SPH, '#ffffff', [0.3, 0.3, 0.3], [0, 1.02, 0], g);
  mk(G_CONE, '#ffa94d', [0.06, 0.2, 0.06], [0, 1.02, 0.2], g).rotation.x = Math.PI / 2;
  [-1, 1].forEach(s => mk(G_SPH, '#2b2d42', [0.04, 0.04, 0.04], [s * 0.06, 1.07, 0.13], g, { noShadow: true }));
  mk(G_CYL, '#ff7aa8', [0.3, 0.12, 0.3], [0, 1.2, 0], g); mk(G_SPH, '#ffffff', [0.1, 0.1, 0.1], [0, 1.3, 0], g);
  mk(G_BOX, '#7fc8f8', [0.4, 0.06, 0.1], [0, 0.88, 0.1], g);
  return g;
}
function makeKiwiBird(parent) {
  const g = grp(parent);
  mk(G_SPH, '#8a6a4a', [0.42, 0.36, 0.5], [0, 0.26, 0], g); mk(G_SPH, '#9c7a56', [0.24, 0.22, 0.24], [0, 0.38, 0.22], g);
  const b = mk(G_CYL, '#e8d0a0', [0.03, 0.3, 0.03], [0, 0.32, 0.45], g); b.rotation.x = Math.PI / 2 + 0.35;
  [-1, 1].forEach(s => { mk(G_SPH, '#1c1412', [0.04, 0.04, 0.04], [s * 0.07, 0.42, 0.31], g, { noShadow: true }); mk(G_CYL, '#e8d0a0', [0.03, 0.14, 0.03], [s * 0.08, 0.06, 0], g); });
  return g;
}

/* ---------------- Queenstown object builders ---------------- */
const HB = OBJ_BUILDERS;
function chalet(g, w, h, wall, roof) {
  mk(G_BOX, wall, [w - 0.15, 1.15, h - 0.2], [0, 0.575, 0], g);
  const gab = geo('gable', () => { const t = new THREE.CylinderGeometry(0.5, 0.5, 1, 3); t.rotateZ(Math.PI / 2); t.rotateX(-Math.PI / 2); return t; });
  mk(gab, wall, [w - 0.15, 0.6, (h - 0.2) * 1.15], [0, 1.3, 0], g);
  [-1, 1].forEach(s => { const r = mk(G_BOX, roof, [w + 0.1, 0.1, (h - 0.2) * 0.62], [0, 1.4, s * (h - 0.2) * 0.26], g); r.rotation.x = s * 0.62; const sn = mk(G_BOX, '#ffffff', [w + 0.12, 0.05, (h - 0.2) * 0.5], [0, 1.47, s * (h - 0.2) * 0.26], g, { noShadow: true }); sn.rotation.x = s * 0.62; });
}
HB['qtown:L'] = (w, h) => {
  const g = new THREE.Group(); chalet(g, w, h, '#f3e2c7', '#8a5a3b');
  for (let i = 0; i < 3; i++) { mk(G_BOX, '#ffe7a8', [0.4, 0.4, 0.03], [-0.9 + i * 0.9, 0.7, h / 2 - 0.09], g, { glow: true }); mk(G_BOX, '#8a5a3b', [0.46, 0.05, 0.05], [-0.9 + i * 0.9, 0.48, h / 2 - 0.08], g); }
  mk(G_BOX, '#5a3d2b', [0.45, 0.75, 0.04], [0.45, 0.38, h / 2 - 0.08], g);
  mk(G_BOX, '#2f5d4a', [1.3, 0.24, 0.04], [0, 1.02, h / 2 - 0.06], g); mk(G_BOX, '#fffaf0', [1.0, 0.05, 0.02], [0, 1.02, h / 2 - 0.03], g, { noShadow: true, glow: true });
  makePlant(g, -1.1, h / 2 + 0.1).scale.setScalar(0.7); return g;
};
HB['qtown:F'] = w => {
  const g = new THREE.Group();
  mk(G_BOX, '#2b2d42', [w - 0.1, 1.1, 0.8], [0, 0.55, -0.05], g); mk(G_BOX, '#ffd166', [w + 0.05, 0.1, 0.95], [0, 1.12, 0], g);
  mk(G_BOX, '#ffe7a8', [w - 0.5, 0.45, 0.03], [0, 0.6, 0.36], g, { glow: true });
  const b = grp(g, 0, 1.35, 0); mk(G_SPH, '#e8b86a', [0.5, 0.2, 0.5], [0, 0.12, 0], b); mk(G_CYL, '#5a3322', [0.52, 0.08, 0.52], [0, 0.0, 0], b); mk(G_CYL, '#7fc86f', [0.56, 0.03, 0.56], [0, 0.05, 0], b, { noShadow: true }); mk(G_SPH, '#e8b86a', [0.5, 0.12, 0.5], [0, -0.07, 0], b);
  g.userData.burger = b;
  for (let i = 0; i < 4; i++) { const p = makePerson({ top: CONFETTI[i], bottom: '#3a3148', hair: ['#2a1d12', '#f5d271', '#6b4a32', '#1c1412'][i], hairStyle: ['bob', 'long', 'fluffy', 'bun'][i] }); p.scale.setScalar(0.7); p.position.set(-0.7 + i * 0.35, 0, 0.75 + i * 0.12); p.rotation.y = Math.PI * 0.9; g.add(p); }
  return g;
};
HB['qtown:G'] = w => {
  const g = new THREE.Group();
  mk(G_BOX, '#7cc576', [w - 0.1, 1.1, 0.8], [0, 0.55, -0.05], g); mk(G_BOX, '#fffaf0', [w + 0.05, 0.1, 0.95], [0, 1.12, 0], g);
  mk(G_BOX, '#e8f7ff', [w - 0.6, 0.45, 0.03], [-0.15, 0.6, 0.36], g, { glow: true });
  for (let i = 0; i < 3; i++) { const b = mk(G_BOX, ['#ff7aa8', '#7fc8f8', '#ffd166'][i], [0.22, 1.0, 0.05], [w / 2 - 0.25 - i * 0.26, 0.55, 0.42], g); b.rotation.z = 0.12; }
  const frog = grp(g, 0, 1.3, 0.1); mk(G_SPH, '#5fae63', [0.5, 0.3, 0.4], [0, 0, 0], frog); [-1, 1].forEach(s => { mk(G_SPH, '#ffffff', [0.14, 0.14, 0.14], [s * 0.13, 0.15, 0.08], frog); mk(G_SPH, '#1c1412', [0.06, 0.06, 0.06], [s * 0.13, 0.16, 0.14], frog, { noShadow: true }); });
  return g;
};
HB['qtown:B'] = w => {
  const g = new THREE.Group();
  mk(G_BOX, '#3f6fb0', [w - 0.2, 0.06, 0.8], [0, 1.3, 0], g); [-1, 1].forEach(s => mk(G_CYL, '#c7ccd6', [0.05, 1.3, 0.05], [s * (w / 2 - 0.2), 0.65, -0.3], g));
  mk(G_BOX, '#e8f7ff', [w - 0.3, 0.9, 0.03], [0, 0.75, -0.33], g, { alpha: 0.6 }); mk(G_BOX, '#b07a4a', [w - 0.5, 0.06, 0.3], [0, 0.4, -0.15], g);
  mk(G_CYL, '#c7ccd6', [0.04, 1.6, 0.04], [w / 2 - 0.05, 0.8, 0.3], g); mk(G_CYL, '#ffd166', [0.34, 0.04, 0.34], [w / 2 - 0.05, 1.6, 0.3], g).rotation.x = Math.PI / 2;
  mk(G_BOX, '#3f6fb0', [0.22, 0.14, 0.02], [w / 2 - 0.05, 1.6, 0.33], g, { noShadow: true });
  return g;
};
HB['qtown:p'] = () => makePine(null, 0, 0, 1.1, true);
HB['qtown:n'] = () => makeSnowman(null, 0, 0);
// Hunter Valley
HB['hunter:v'] = w => {
  const g = new THREE.Group();
  for (let i = 0; i <= w; i++) mk(G_CYL, '#a8744f', [0.06, 0.8, 0.06], [-w / 2 + i, 0.4, 0], g);
  mk(G_BOX, '#dcd3c2', [w, 0.015, 0.015], [0, 0.72, 0], g, { noShadow: true });
  for (let i = 0; i < w * 3; i++) {
    const x = -w / 2 + 0.17 + i / 3;
    mk(G_SPH, ['#6fae5a', '#7fbf66', '#5f9f4f'][i % 3], [0.4, 0.42, 0.34], [x, 0.62 + hsh(i, w) * 0.08, 0], g);
    if (i % 2 === 0) { const c = grp(g, x + 0.05, 0.45, 0.16); for (let k = 0; k < 5; k++) mk(G_SPH, '#6b3a8a', [0.07, 0.07, 0.07], [(k % 2) * 0.05 - 0.025, -Math.floor(k / 2) * 0.05, 0], c, { noShadow: true }); }
  }
  return g;
};
HB['hunter:C'] = (w, h) => {
  const g = new THREE.Group(); chalet(g, w, h, '#ecd3ae', '#8a3b2f');
  mk(G_BOX, '#c89f7a', [w, 0.1, 0.6], [0, 0.95, h / 2 + 0.05], g); [-1, 0, 1].forEach(s => mk(G_CYL, '#fffaf0', [0.06, 0.95, 0.06], [s * (w / 2 - 0.2), 0.47, h / 2 + 0.3], g));
  mk(G_BOX, '#ffe7a8', [0.9, 0.45, 0.03], [-0.6, 0.6, h / 2 - 0.09], g, { glow: true }); mk(G_BOX, '#5a3d2b', [0.45, 0.75, 0.04], [0.6, 0.38, h / 2 - 0.08], g);
  mk(G_BOX, '#6b1e3a', [1.2, 0.24, 0.04], [0, 1.15, h / 2 - 0.06], g); mk(G_BOX, '#fffaf0', [0.9, 0.05, 0.02], [0, 1.15, h / 2 - 0.03], g, { noShadow: true });
  for (let i = 0; i < 2; i++) makeWineBottle(g, -1 + i * 0.3, 0, h / 2 + 0.4, ['#6b1e3a', '#e8e0a0'][i]);
  return g;
};
HB['hunter:c'] = w => {
  const g = new THREE.Group();
  mk(G_BOX, '#fff0c2', [w - 0.1, 1.0, 0.8], [0, 0.5, -0.05], g); mk(G_BOX, '#ffd166', [w + 0.05, 0.1, 0.95], [0, 1.02, 0], g);
  for (let i = 0; i < 6; i++) { const s = mk(G_BOX, i % 2 ? '#fffaf0' : '#ffa94d', [(w + 0.05) / 6, 0.05, 0.4], [-(w + 0.05) / 2 + (i + 0.5) * (w + 0.05) / 6, 0.85, 0.5], g); s.rotation.x = 0.4; }
  const ch = mk(G_CYL, '#ffd166', [0.5, 0.3, 0.5], [0, 1.25, 0], g); mk(G_BOX, '#fff0c2', [0.18, 0.31, 0.3], [0.18, 1.25, 0.12], g).rotation.y = 0.5;
  return g;
};
HB['hunter:b'] = w => { const g = new THREE.Group(); for (let i = 0; i < w; i++) { const b = mk(G_CYL, '#a0643a', [0.62, 0.8, 0.62], [-w / 2 + 0.5 + i, 0.4, 0], g); [0.15, 0.65].forEach(y => mk(G_CYL, '#4a3b52', [0.64, 0.05, 0.64], [-w / 2 + 0.5 + i, y, 0], g, { noShadow: true })); } return g; };
HB['hunter:t'] = () => makeGum(null, 0, 0, 1.1);

/* ---------------- maps ---------------- */
const npcPauloHol = c => c === 'A' ? (G.holiday === 'qt' ? LOOK.pauloSnow : LOOK.paulo) : null;
MAPS.qtown = {
  theme: 'qtown', title: 'Holiday: Queenstown', outdoor: true, edge: '#eef4fa',
  get sky() { return F.qtSki ? 'evening' : 'day'; },
  floor: ['#f4f8fc', '#e6eef6'], wet: '#d9dee6', wall: ['#fff', '#fff'], water: ['#3f9fd0', '#4aa8d8'],
  intro: { x: 7, z: -1.5, zoom: 0.62 }, ambient: 'water',
  rows: ["~~~~~~~~~~~~~~~", "~~~~~~~~~~~~~~~", "_______________", ".FF....p...GG..", "...............", "p......A.......", "............LLL", ".BB.........LLL", ".....n........p", "p.............."],
  start: { x: 5, z: 4, dir: 'up' },
  npcs: npcPauloHol,
  hints: () => [!F.qtGear && 'G', F.qtGear && !F.qtSki && 'B', F.qtSki && 'A'],
  decorate(g) {
    // Lake Wakatipu, The Remarkables, Ben Lomond, the gondola and the TSS Earnslaw
    mk(G_BOX, '#6fb8dc', [44, 0.3, 16], [7, -0.32, -8.5], g, { alpha: 0.95, noShadow: true });
    for (let i = 0; i < 26; i++) mk(G_BOX, '#e8f7ff', [0.4 + hsh(i, 2), 0.02, 0.05], [-8 + hsh(i, 3) * 30, -0.15, -14 + hsh(i, 4) * 13], g, { noShadow: true, glow: true, alpha: 0.7 });
    const far = grp(g, 7, -0.3, -16);
    for (let i = 0; i < 11; i++) { const x = -20 + i * 4 + hsh(i, 7) * 1.5; makeMountain(far, x, hsh(i, 8) * 2, 4 + hsh(i, 9) * 2.5, 5 + hsh(i, 10) * 5, ['#8e95a8', '#7f879c', '#9aa1b3'][i % 3]); }
    const boat = grp(g, 3, -0.12, -5.2);
    mk(G_BOX, '#fffaf0', [3, 0.4, 0.9], [0, 0.2, 0], boat); mk(G_BOX, '#2b2d42', [3.05, 0.1, 0.95], [0, 0.02, 0], boat);
    mk(G_BOX, '#fffaf0', [2, 0.4, 0.8], [0, 0.6, 0], boat); mk(G_CYL, '#e2554f', [0.28, 0.8, 0.28], [0.2, 1.2, 0], boat); mk(G_CYL, '#2b2d42', [0.3, 0.1, 0.3], [0.2, 1.6, 0], boat);
    for (let i = 0; i < 6; i++) mk(G_BOX, '#355077', [0.18, 0.14, 0.82], [-0.8 + i * 0.32, 0.64, 0], boat, { noShadow: true });
    const gond = grp(g, 15.5, 0, 4);
    mk(G_CYL, '#6b6f82', [0.05, 3.2, 0.05], [0, 1.6, 0], gond); const cab = grp(gond, 0, 2.3, 0.3); mk(G_BOX, '#e2554f', [0.4, 0.36, 0.36], [0, 0, 0], cab); mk(G_BOX, '#bfe6ff', [0.3, 0.14, 0.37], [0, 0.05, 0], cab, { noShadow: true });
    for (let i = 0; i < 16; i++) { const s = mk(G_SPH, '#ffffff', [0.14, 0.14, 0.14], [hsh(i, 1) * 14, 0.02, 3 + hsh(i, 2) * 6.5], g, { noShadow: true }); s.scale.y = 0.35; }
    W.hol = { boat, cab, burger: (W.objs.find(o => o.ch === 'F') || {}).g };
    wkTicker(updateQtown);
    if (F.qtSki) makeFairyLights(g, 0, 2.6, 14, 2.6, 1.8, 30);
  },
  onEnter() {
    if (F.qtLuge) { say([HLOG.lugeWin ? "Luge legend! Paulo demands a rematch." : "Paulo won the luge and will not stop talking about it.", { n: CONFIG.boyfriend, t: "Right. Farewell dinner?" }]); return; }
    if (F.qtSki) { say(["Back in town, legs like jelly and cheeks glowing.", { n: CONFIG.boyfriend, t: "Come chat. We need a plan for tomorrow." }]); return; }
    say(["HOLIDAY PACK: Queenstown!", HOL.qt.flight + ". Landed in the snow.", "Checked in at " + HOL.qt.stay + ", a studio with a garden patio.", "Luca is having a sleepover at Mum's. He will be spoiled rotten.", { n: CONFIG.boyfriend, t: "First stop Greentoad for gear, then the ski bus." }]);
  },
  act: {
    G: () => F.qtGear ? say("Greentoad: board, boots, jacket, pants and helmet. $244 each for four days.") : gearMenu(),
    F: () => pickMenu('Fergburger', 'The queue is part of the experience.', HOL.qt.ferg, d => { stat('energy', 10, true); HLOG.snack = d.n; say([{ n: CONFIG.name, t: d.n + ", please!" }, "Worth every minute of the queue."], refreshHints); }),
    L: () => say("Lomond Lodge. Our little studio, two minutes from the gondola."),
    n: () => say("A snowman wearing a pink beanie. Paulo swears it wasn't him."),
    p: () => say("A snowy pine. Very Christmas card."),
    '~': () => say("Lake Wakatipu, cold and impossibly blue. The TSS Earnslaw chugs past."),
    _: () => say("Lake Wakatipu, cold and impossibly blue. The TSS Earnslaw chugs past."),
    B: () => !F.qtGear ? say({ n: CONFIG.boyfriend, t: "Gear first! Greentoad is just over there." }) : F.qtSki ? say("The ski bus has finished for the day.") : fieldMenu(),
    A: () => !F.qtGear ? say({ n: CONFIG.boyfriend, t: "Greentoad first, then the bus from The Station on Duke St." }) : !F.qtSki ? say({ n: CONFIG.boyfriend, t: "Bus stop's over there. Let's go shred." }) : F.qtRest ? qtDinner() : qtEvening()
  }
};
MAPS.hunter = {
  theme: 'hunter', title: 'Holiday: Hunter Valley', sky: 'golden', outdoor: true, edge: '#b8d98a', intro: { x: 7, z: 2, zoom: 0.68 }, ambient: 'cicada',
  floor: ['#c5e39a', '#b8d98a'], wall: ['#fff', '#fff'],
  rows: ["t.............t", ".vvvvvv..vvvvv.", "...............", ".vvvvvv..vvvvv.", "...............", ".CCC....A...cc.", ".CCC...........", "......bb.......", ".vvvvvv..vvvvv.", "..............."],
  start: { x: 7, z: 9, dir: 'up' },
  npcs: npcPauloHol,
  hints: () => [!F.hvTaste && 'C', F.hvTaste && 'A'],
  decorate(g) {
    const far = grp(g, 7, -0.4, -9);
    for (let i = 0; i < 12; i++) mk(G_SPH, ['#9fcf7e', '#8fc26f', '#aad68a'][i % 3], [7 + hsh(i, 3) * 3, 2.5 + hsh(i, 4) * 2, 4], [-22 + i * 4, 0, hsh(i, 5) * 2], far, { noShadow: true });
    const balloons = [];
    [[-2, 4.5, -3, '#ff7aa8'], [9, 5.5, -5, '#ffd166'], [16, 4, -2, '#7fc8f8']].forEach(([x, y, z, c], i) => {
      const b = grp(g, x, y, z);
      mk(G_SPH, c, [1.2, 1.35, 1.2], [0, 0, 0], b); for (let k = 0; k < 4; k++) { const st = mk(G_SPH, '#ffffff', [1.22, 1.37, 0.12], [0, 0, 0], b, { noShadow: true }); st.rotation.y = k * Math.PI / 4; }
      mk(G_BOX, '#a8744f', [0.34, 0.26, 0.34], [0, -1.0, 0], b); b.userData.phase = i * 2; balloons.push(b);
    });
    W.hol = { balloons };
    wkTicker(updateHunter);
  },
  onEnter() {
    say(["HOLIDAY PACK: the Hunter Valley!", "Two hours up the M1 and the vines go on forever.", "Luca is having a sleepover at Mum's. He will be spoiled rotten.", { n: CONFIG.boyfriend, t: "Cellar door first. Blind tasting, loser buys lunch." }]);
  },
  act: {
    C: () => F.hvTaste ? say("The cellar door. We may have joined the wine club.") : tastingGame(),
    c: () => pickMenu('Cheese shop', 'A little something for the car ride.', HOL.hv.cheese, d => { F.hvCheese = true; HLOG.cheese = d.n; stat('happy', 5, true); say([{ n: CONFIG.name, t: d.n + ". Obviously." }, "Wrapped up and tucked in the esky."], refreshHints); }),
    v: () => say("Rows of vines, heavy with grapes."),
    b: () => say("Oak barrels. It smells like a very good idea."),
    t: () => say("A big old gum tree shading the vines."),
    A: () => !F.hvTaste ? say({ n: CONFIG.boyfriend, t: "Cellar door first! I reckon I'll win." }) : hvEvening()
  }
};

/* ---------------- start: pack the bags, pick a trip ---------------- */
function resetHoliday() {
  HOL_FLAGS.forEach(k => { delete F[k]; });
  G.holiday = null; G.weekend = false; G.ride = 'board'; G.grade = 'blue'; cam.orbit = 0;
  HLOG = { trip: null, field: null, flakes: 0, snack: null, rest: null, dinner: null, score: 0, fav: null, cheese: null, morning: null };
}
CAMPAIGN_STATE.holiday = {
  save: () => ({ holiday: G.holiday, log: HLOG, ride: G.ride, grade: G.grade, jacket: OUTFITS.snow.top }),
  load: x => { resetHoliday(); G.holiday = x.holiday; Object.assign(HLOG, x.log || {}); G.ride = x.ride || 'board'; G.grade = x.grade || 'blue'; if (x.jacket) OUTFITS.snow.top = x.jacket; }
};
function startHoliday() {
  G.campaign = 'holiday'; resetHoliday(); clearWorld(); clearUI(); G.scene = 'hstart'; G.mode = 'busy'; showHUD(false); setChapter('Holiday Pack');
  W = { id: 'hstart', objs: [], npcs: [], hearts: [], markers: [], anim: [], dispose: [], walls: [], decor: [] };
  setSky('morning'); fitSun(0, 0, 8);
  makeIslandBase(world, 8, 6, GRASS, 0, 0); mk(G_BOX, GRASS, [8, 0.2, 6], [0, -0.1, 0], world);
  const a = makeAnnette('sunny'), p = makePerson(LOOK.paulo), l = makeLuca();
  a.position.set(-0.6, 0, 0.4); p.position.set(0.5, 0, 0.3); l.position.set(-0.1, 0, 1.2); world.add(a, p, l); W.cast = [a, p, l];
  [[1.4, '#ff7aa8'], [1.95, '#7fc8f8']].forEach(([x, c]) => { const s = grp(world, x, 0, 0.8); mk(G_BOX, c, [0.5, 0.7, 0.3], [0, 0.4, 0], s); mk(G_BOX, '#ffffff', [0.52, 0.06, 0.32], [0, 0.4, 0], s, { noShadow: true }); mk(geo('ring', () => new THREE.TorusGeometry(0.5, 0.12, 6, 16)), '#3a3148', [0.2, 0.2, 0.2], [0, 0.82, 0], s); [-0.18, 0.18].forEach(w => mk(G_CYL, '#3a3148', [0.08, 0.06, 0.08], [w, 0.04, 0.1], s)); });
  makeTree(world, -3, -1.6, 1); makeTree(world, 3, -1.6, 0.9, '#ffb3cc'); makePlant(world, -3, 2, true);
  for (let i = 0; i < 9; i++) makeFlower(world, -3.6 + i * 0.9, 2.6, CONFETTI[i % 5]);
  for (let i = 0; i < 6; i++) makeCloud(world, -20 + i * 7, -5 + hsh(i, 1) * 1.5, -8 + hsh(i, 2) * 16, 1.3);
  cam.base = 11; cam.pitch = 0.5; cam.zoomGoal = 1.5; cam.zoom = 1.5; cam.goal.set(0.4, 0.8, 0.3); cam.target.copy(cam.goal); cam.orbit = SET.calm ? 0.02 : 0.05;
  wkTicker((dt, t) => { updateWorld(dt, t); W.cast.forEach((g, i) => animatePerson(g, false, dt, t + i)); });
  const pn = panel('Go on holiday', 'Bags are packed. Where are we off to?', 'grid2'); pn.classList.add('low');
  const trips = [{ n: 'Queenstown ski trip', d: 'New Zealand snow, ' + HOL.qt.dates, k: 'qt' }, { n: 'Hunter Valley', d: 'Wine, cheese and hot air balloons', k: 'hv' }];
  const btns = trips.map(tr => makeBtn(`<span>${esc(tr.n)}</span><small>${esc(tr.d)}</small>`, () => {
    clearUI(); moment(tr.n, { line: tr.k === 'qt' ? 'SYD to ZQN, window seat' : 'Road trip up the M1', ms: 1900 }, () => {
      G.holiday = tr.k; HLOG.trip = tr.n; G.outfit = tr.k === 'qt' ? 'winter' : 'sunny';
      say([{ n: 'Mum', t: "Go! Luca and I will be fine. Send photos." }, { n: CONFIG.name, t: CONFIG.catchphrase }], () => tr.k === 'qt' ? fade(flightScene) : startDrive('hunter', 'hunter', 'the Hunter Valley'));
    });
  }));
  pn.querySelector('.grid2').append(...btns);
  setMenu(btns, { cols: 2, keepMode: true, onBack: () => fade(titleScreen) }); G.mode = 'menu';
}

/* ---------------- Queenstown ---------------- */
function updateQtown(dt, t) {
  const k = W && W.hol; if (!k) return;
  k.boat.position.x = 3 + Math.sin(t * 0.08) * 6; k.boat.position.y = -0.12 + Math.sin(t * 1.4) * 0.03;
  k.cab.position.y = 2.3 + Math.sin(t * 0.4) * 0.6;
  if (k.burger && k.burger.userData.burger) { k.burger.userData.burger.rotation.y += dt * 1.5; k.burger.userData.burger.position.y = 1.35 + Math.sin(t * 3) * 0.05; }
  if (!SET.calm && Math.random() < dt * 14) FX.emit(-2 + Math.random() * 18, 5 + Math.random(), -1 + Math.random() * 12, ['#ffffff', '#eef6ff'], 1, 0.4, { g: 0.6, life: 5 });
}
function gearMenu() {
  pickMenu('Winter clothing', 'Which jacket made it into the suitcase?', HOL.qt.jackets, d => {
    OUTFITS.snow.top = d.c; G.outfit = 'snow'; HLOG.jacket = d.n; stat('glow', 8, true);
    const old = W.player.g, g = makeAnnette('snow'); g.position.copy(old.position); g.rotation.copy(old.rotation); world.remove(old); world.add(W.player.g = g); popIn(g); confetti(g.position.x, 0.8, g.position.z, 36); sfx('pop'); G.wearing = 'snow';
    say([{ n: CONFIG.name, t: "The " + d.n + ". " + d.d }, { n: 'Greentoad', t: "Now, board or skis today?" }], () => pickMenu('Greentoad rentals', 'Boots, pants and a helmet included.', HOL.qt.gear, e => {
      G.ride = e.k; HLOG.ride = e.n; F.qtGear = true;
      say([e.k === 'board' ? "A snowboard, boots and a helmet. $244 each for four days." : "Skis, poles, boots and a helmet. Pizza, French fries, pizza.", { n: CONFIG.boyfriend, t: "You look like a pro. Bus stop's by The Station." }], refreshHints);
    }, false));
  });
}
function fieldMenu() {
  pickMenu('Ski day', 'Which mountain are we riding?', HOL.qt.fields, d => {
    HLOG.field = d.n;
    const runs = HOL.qt.runs[d.k === 'remarks' ? 'remarks' : 'other'];
    pickMenu(d.n, d.k === 'remarks' ? 'Trail map out. Three sunny bowls to pick from.' : 'Which run are we dropping into?', runs, r => { HLOG.run = r.n; G.grade = r.g;
    say([d.k === 'coronet' ? "The night bus leaves The Station on the hour." : d.k === 'cardrona' ? "The shuttle climbs the Crown Range. About an hour to the top." : "Ski bus from The Station, about 40 minutes up.", "Up " + r.lift + " to the top of " + r.n + ".", { n: CONFIG.boyfriend, t: "Steer left and right. Grab the snowflakes, dodge everything else." }], () => fade(() => buildSnowRun(d.k)));
    }, false);
  });
}
function qtEvening() {
  pickMenu('Rest day tomorrow', 'Legs need a break. What are we doing?', HOL.qt.rest, r => {
    HLOG.rest = r.n; F.qtRest = true; stat('happy', 8, true);
    if (/luge/i.test(r.n)) { say([{ n: CONFIG.boyfriend, t: "Gondola up Bob's Peak, then a luge race. Loser buys hot chocolate." }, "Steer around the cones. Grab the stars for a speed boost."], () => fade(() => buildSnowRun('luge'))); return; }
    say([{ n: CONFIG.name, t: r.n + ". Done." }, { n: CONFIG.boyfriend, t: "And for the farewell dinner?" }], qtDinner);
  });
}
function qtDinner() {
  pickMenu('Farewell dinner', 'Last night in Queenstown.', HOL.qt.dinner, d => {
    HLOG.dinner = d.n; stat('energy', 15, true);
    say([{ n: CONFIG.boyfriend, t: d.n + ". Perfect way to finish." }, "Snow falling softly over the lake. What a trip.", { n: CONFIG.name, t: CONFIG.catchphrase }], () => fade(holidayEnd));
  }, false);
}
// tiny flight: SYD to ZQN over the clouds and the Southern Alps
function flightScene() {
  clearWorld(); clearUI(); G.scene = 'flight'; G.mode = 'busy'; showHUD(true); setChapter('Flying SYD to ZQN'); G.clock = 11 * 60;
  W = { id: 'flight', objs: [], npcs: [], hearts: [], markers: [], anim: [], dispose: [], walls: [], decor: [] };
  setSky('day'); fitSun(0, 0, 12);
  const plane = grp(world, 0, 1.2, 0);
  mk(G_CYL, '#fffaf0', [0.9, 3.6, 0.9], [0, 0, 0], plane).rotation.z = Math.PI / 2; mk(G_SPH, '#fffaf0', [0.9, 0.9, 0.9], [-1.8, 0, 0], plane);
  mk(G_CONE, '#fffaf0', [0.9, 0.7, 0.9], [2.1, 0, 0], plane).rotation.z = -Math.PI / 2;
  const tail = mk(G_BOX, '#e2554f', [0.7, 1.1, 0.08], [-1.7, 0.6, 0], plane); tail.rotation.z = 0.4;
  mk(G_BOX, '#e2554f', [0.9, 0.06, 1.3], [-1.6, 0.1, 0], plane);
  mk(G_BOX, '#e8ecf4', [1.2, 0.08, 4.2], [0.1, -0.12, 0], plane);
  [-1, 1].forEach(s => mk(G_CYL, '#c7ccd6', [0.3, 0.6, 0.3], [0.3, -0.35, s * 1.1], plane).rotation.z = Math.PI / 2);
  for (let i = 0; i < 7; i++) mk(G_SPH, '#9fd0ff', [0.18, 0.2, 0.05], [1.2 - i * 0.38, 0.12, 0.44], plane, { noShadow: true });
  // two little faces at the windows
  [[0.44, '#f9d1b0', '#f5d271'], [0.06, '#b57848', '#2a1d12']].forEach(([x, skin, hair]) => { mk(G_SPH, skin, [0.13, 0.13, 0.05], [x, 0.1, 0.46], plane, { noShadow: true }); mk(G_SPH, hair, [0.15, 0.08, 0.05], [x, 0.17, 0.455], plane, { noShadow: true }); });
  const below = grp(world, 0, -3, 0), scroll = [];
  for (let i = 0; i < 14; i++) scroll.push(makeMountain(below, -16 + i * 3.2, -4 + hsh(i, 2) * 3, 2.2, 2 + hsh(i, 3) * 2.5));
  for (let i = 0; i < 14; i++) scroll.push(makeCloud(world, -18 + i * 3, -0.4 + hsh(i, 4) * 1.2, -2 + hsh(i, 5) * 5, 1 + hsh(i, 6)));
  cam.base = 11; cam.pitch = 0.3; cam.zoomGoal = 1.25; cam.zoom = 1.25; cam.yawGoal = 0; cam.yaw = 0; cam.goal.set(0, 0.6, 0); cam.target.copy(cam.goal); cam.orbit = 0;
  ambient('engine');
  wkTicker((dt, t) => { plane.position.y = 1.2 + Math.sin(t * 1.4) * 0.12; plane.rotation.z = Math.sin(t * 0.9) * 0.04; scroll.forEach(o => { o.position.x -= dt * (o.parent === below ? 1.2 : 3); if (o.position.x < -20) o.position.x += 42; }); });
  setTimeout(() => say([HOL.qt.flight + ".", "Window seat. The Southern Alps slide by below.", "Paulo is asleep before the drinks trolley.", { n: CONFIG.name, t: "Wake up, we're landing! Look at the snow!" }], () => fade(() => loadMap('qtown'))), 700);
}

/* ---------------- snowboard run: a floating slope, three lanes ---------------- */
const SNOW_FIELDS = {
  cardrona: { sky: 'day', speed: 6, obst: 0.25, rock: false, label: 'Cardrona: wide and mellow', lights: false },
  remarks: { sky: 'day', speed: 7.4, obst: 0.4, rock: true, label: 'The Remarkables: sunny bowls, rocky lines', lights: false },
  coronet: { sky: 'night', speed: 8.2, obst: 0.35, rock: false, label: 'Coronet Peak: night ski under lights', lights: true },
  luge: { sky: 'day', speed: 7, obst: 0.3, rock: false, label: "Skyline luge: race Paulo down Bob's Peak", lights: false, luge: true }
};
const RUNS_KEY = 'abd2-runs-v1';
function runRecords() { try { return JSON.parse(localStorage.getItem(RUNS_KEY) || '{}') || {}; } catch (e) { return {}; } }
function saveRunRecords(r) { try { localStorage.setItem(RUNS_KEY, JSON.stringify(r)); } catch (e) {} }
const SPAWN_Z = -17;
const SB_LANES = [-1.1, 0, 1.1], SB_LEN = 40;
const GRADES = { green: { c: '#3fae7c', sp: 0.8, ob: 0.6 }, blue: { c: '#3f6fb0', sp: 1, ob: 1 }, red: { c: '#e2554f', sp: 1.15, ob: 1.3 }, black: { c: '#2b2d42', sp: 1.3, ob: 1.6 } };
let SB = null;
function buildSnowRun(k) {
  clearWorld(); clearUI(); G.scene = 'snow'; G.mode = 'drive'; showHUD(true);
  const base = SNOW_FIELDS[k] || SNOW_FIELDS.cardrona, GR = k === 'luge' ? GRADES.blue : (GRADES[G.grade] || GRADES.blue);
  const T = Object.assign({}, base, { speed: base.speed * GR.sp, obst: Math.min(0.7, base.obst * GR.ob), rock: base.rock || G.grade === 'black' }); setSky(T.sky); setChapter(base.luge ? 'Skyline luge' : (HLOG.run ? HLOG.run + ', ' : '') + (HLOG.field || 'Ski day')); fitSun(0, -8, 16); G.clock = k === 'coronet' ? 19 * 60 : SCENE_TIME.snow;
  W = { id: 'snow', objs: [], npcs: [], hearts: [], markers: [], anim: [], dispose: [], walls: [], decor: [] };
  const zc = -SB_LEN / 2 + 6;
  makeIslandBase(world, 11, SB_LEN + 8, '#dfe9f4', 0, zc); mk(G_BOX, '#dfe9f4', [11, 0.2, SB_LEN + 8], [0, -0.1, zc], world);
  mk(G_BOX, T.luge ? '#a9aebb' : '#f7fbff', [3.6, 0.03, SB_LEN + 8], [0, 0.01, zc], world, { noShadow: true });
  if (T.luge) [-1.85, 1.85].forEach(x => mk(G_BOX, '#e2554f', [0.14, 0.2, SB_LEN + 8], [x, 0.1, zc], world));
  [-0.55, 0.55].forEach(x => mk(G_BOX, '#e8f0f8', [0.06, 0.035, SB_LEN + 8], [x, 0.012, zc], world, { noShadow: true }));
  const moving = [];
  for (let i = 0; i < 24; i++) moving.push(mk(G_BOX, '#cddbeb', [0.05, 0.02, 0.9 + hsh(i, 3)], [-1.6 + hsh(i, 1) * 3.2, 0.03, 6 - i * 1.7], world, { noShadow: true }));
  for (let i = 0; i < 16; i++) { const pole = grp(world, i % 2 ? 1.9 : -1.9, 0, 6 - i * 2.5); mk(G_CYL, GR.c, [0.06, 0.9, 0.06], [0, 0.45, 0], pole); mk(G_CYL, '#ffffff', [0.065, 0.1, 0.065], [0, 0.5, 0], pole, { noShadow: true }); mk(G_CYL, '#2b2d42', [0.065, 0.12, 0.065], [0, 0.7, 0], pole, { noShadow: true }); moving.push(pole); }
  for (let i = 0; i < 18; i++) { const side = i % 2 ? 1 : -1, x = side * (2.4 + hsh(i, 1) * 1.6), z = 6 - i * 2.3; moving.push(T.rock && i % 3 === 0 ? makeMountain(world, x, z, 0.9, 0.8, '#9aa1b3') : makePine(world, x, z, 0.8 + hsh(i, 4) * 0.4, !T.luge)); }
  // a chairlift running up beside the piste
  const chairs = [];
  for (let i = 0; i < 8; i++) { const tw = grp(world, 3.6, 0, 5 - i * 5); mk(G_CYL, '#8a8fa0', [0.12, 2.6, 0.12], [0, 1.3, 0], tw); mk(G_BOX, '#8a8fa0', [0.9, 0.08, 0.08], [0, 2.6, 0], tw); moving.push(tw); }
  [3.25, 3.95].forEach(x => mk(G_BOX, '#4a4658', [0.02, 0.02, SB_LEN + 8], [x, 2.58, zc], world, { noShadow: true }));
  for (let i = 0; i < 12; i++) {
    const up = i % 2 === 0, c = grp(world, up ? 3.25 : 3.95, 2.1, 6 - i * 3.4);
    mk(G_CYL, '#4a4658', [0.02, 0.5, 0.02], [0, 0.25, 0], c, { noShadow: true });
    if (T.luge) { mk(G_BOX, '#e2554f', [0.5, 0.45, 0.5], [0, -0.05, 0], c); mk(G_BOX, '#bfe6ff', [0.51, 0.18, 0.4], [0, 0.02, 0], c, { noShadow: true }); }
    else { mk(G_BOX, ['#3f6fb0', '#e2554f', '#ffd166'][i % 3], [0.5, 0.08, 0.3], [0, 0, 0], c); mk(G_BOX, '#3a3148', [0.5, 0.3, 0.05], [0, 0.15, -0.14], c); }
    if (i % 3 === 0 && !T.luge) { const r = makePerson({ top: CONFETTI[i % 5], bottom: '#3a3148', hair: '#6b4a32', beanie: CONFETTI[(i + 2) % 5] }); r.scale.setScalar(0.55); r.position.set(0, -0.05, 0); c.add(r); }
    c.userData.up = up; chairs.push(c);
  }
  if (T.lights) for (let i = 0; i < 8; i++) moving.push(makeStreetLamp(world, i % 2 ? 2.1 : -2.3, 5 - i * 5));
  const far = grp(world, 0, -0.3, -SB_LEN - 4); for (let i = 0; i < 7; i++) makeMountain(far, -18 + i * 6, 0, 5, 6 + hsh(i, 2) * 5, T.sky === 'night' ? '#6a6f8c' : '#8e95a8');
  const rider = grp(world, SB_LANES[1], 0, 3);
  const ski = G.ride === 'ski' && !T.luge, a = makeAnnette(T.luge ? 'winter' : 'snow'); a.position.y = 0.07; rider.add(a);
  let board, rival = null;
  const lugeCart = (parent, col) => { const c = grp(parent); mk(G_BOX, col, [0.55, 0.14, 0.9], [0, 0.12, 0], c); mk(G_BOX, '#3a3148', [0.5, 0.25, 0.08], [0, 0.28, -0.4], c); [[-0.28, 0.3], [0.28, 0.3], [-0.28, -0.3], [0.28, -0.3]].forEach(([x, z]) => { const w = mk(G_CYL, '#2b2d42', [0.16, 0.08, 0.16], [x, 0.08, z], c); w.rotation.z = Math.PI / 2; }); return c; };
  if (T.luge) {
    board = lugeCart(rider, '#ffd166'); a.position.set(0, 0.12, -0.05); a.rotation.y = Math.PI; a.userData.legL.rotation.x = -1.4; a.userData.legR.rotation.x = -1.4; a.userData.armL.rotation.x = -0.9; a.userData.armR.rotation.x = -0.9;
    rival = grp(world, SB_LANES[2], 0, 3.2); lugeCart(rival, '#7fc8f8'); const p = makePerson(LOOK.pauloSnow); p.position.set(0, 0.12, -0.05); p.rotation.y = Math.PI; p.userData.legL.rotation.x = -1.4; p.userData.legR.rotation.x = -1.4; rival.add(p); rival.userData.lane = 2;
  } else if (ski) {
    board = grp(rider); [-0.1, 0.1].forEach(x => { mk(G_BOX, OUTFITS.snow.top, [0.09, 0.04, 1.05], [x, 0.03, -0.05], board); mk(G_BOX, OUTFITS.snow.top, [0.09, 0.04, 0.12], [x, 0.06, -0.58], board).rotation.x = 0.5; });
    a.rotation.y = Math.PI * 0.82; a.userData.armL.rotation.x = -0.6; a.userData.armR.rotation.x = -0.6;
    [-1, 1].forEach(s => { const p = mk(G_CYL, '#c7ccd6', [0.02, 0.7, 0.02], [s * 0.26, 0.3, 0.05], rider, { noShadow: true }); p.rotation.x = -0.5; p.rotation.z = s * -0.15; });
  } else {
    board = mk(G_BOX, OUTFITS.snow.top, [0.95, 0.06, 0.3], [0, 0.04, 0], rider); mk(G_BOX, '#ffffff', [0.8, 0.02, 0.1], [0, 0.075, 0], rider, { noShadow: true });
    a.rotation.y = Math.PI * 0.3; a.userData.armL.rotation.z = 1.0; a.userData.armR.rotation.z = -1.0; a.userData.legL.rotation.z = 0.2; a.userData.legR.rotation.z = -0.2;
  }
  for (let i = 0; i < 8; i++) makeCloud(world, -20 + i * 6, 4 + hsh(i, 1) * 3, -34 + hsh(i, 2) * 30, 1.3);
  SB = { chairs, rival, k, T, t: 0, dur: T.luge ? 16 : 18, lane: 1, x: SB_LANES[1], rider, a, board, moving, items: [], spawn: 0.3, flakes: 0, bumps: 0, done: false, kiwi: null, key: (HLOG.run || 'run') + ' @ ' + (HLOG.field || k) };
  if (T.luge) SB.key = 'Skyline luge';
  for (let i = 0; i < 4; i++) sbSpawn(-3 - i * 3.5, false);
  ambient(k === 'luge' ? 'wind' : 'lift');
  cam.goal.set(0, 0.3, -0.6); cam.target.copy(cam.goal); cam.zoomGoal = 1.45; cam.zoom = 1.45; cam.yawGoal = 0; cam.yaw = 0; cam.pitch = 0.36; cam.base = 11; cam.orbit = 0;
  const dock = el('div', 'dock drv', `<h3 style="margin:0">${esc(T.luge ? 'Skyline luge' : HLOG.field || 'Ski day')}</h3><p class="sub" style="margin:2px 0 6px;font-size:14px">${esc(!T.luge && HLOG.run ? HLOG.run + ' · ' : '')}${esc(T.label)}</p><div class="meter"><b id="sbBar"></b></div><p class="sub" style="margin:6px 0 0;font-size:13px"><span id="sbCnt">${T.luge ? 'Stars' : 'Snowflakes'}: 0</span> &middot; ${(b => b ? 'Best: ' + b + ' &middot; ' : '')(runRecords()[SB.key])}${T.luge ? 'Steer around the cones!' : 'Left and right to carve.'}</p>`);
  ui.append(dock); toast(T.label); sfx('whoosh');
}
function sbLane(d) { if (!SB || SB.done) return; const l = clamp(SB.lane + d, 0, 2); if (l !== SB.lane) { SB.lane = l; sfx('whoosh'); } }
function sbSpawn(z, allowBump) {
  const S = SB, lane = Math.floor(Math.random() * 3), obst = allowBump !== false && Math.random() < S.T.obst;
  let g;
  if (!obst) g = S.T.luge ? (() => { const s = grp(world, SB_LANES[lane], 0.5, z); mk(G_STAR, '#ffd166', [0.4, 0.4, 0.4], [0, 0, 0], s, { glow: true }); return s; })() : makeFlake(world, SB_LANES[lane], z);
  else if (S.T.luge) { g = grp(world, SB_LANES[lane], 0, z); mk(G_CONE, '#ffa94d', [0.35, 0.5, 0.35], [0, 0.25, 0], g); mk(G_CYL, '#ffffff', [0.26, 0.07, 0.26], [0, 0.25, 0], g); }
  else if (S.T.rock && Math.random() < 0.6) { g = grp(world, SB_LANES[lane], 0, z); mk(G_SPH, '#8e95a8', [0.7, 0.45, 0.6], [0, 0.18, 0], g); mk(G_SPH, '#ffffff', [0.5, 0.15, 0.45], [0, 0.36, 0], g, { noShadow: true }); }
  else if (Math.random() < 0.5) g = makeSnowman(world, SB_LANES[lane], z);
  else g = makePine(world, SB_LANES[lane], z, 0.6, true);
  S.items.push({ g, lane, kind: obst ? 'bump' : 'flake', ph: Math.random() * TAU });
}
function makeFlake(parent, x, z) {
  const g = grp(parent, x, 0.5, z);
  for (let i = 0; i < 3; i++) { const b = mk(G_BOX, '#dff4ff', [0.5, 0.07, 0.07], [0, 0, 0], g, { glow: true, noShadow: true }); b.rotation.z = i * Math.PI / 3; }
  mk(G_SPH, '#ffffff', [0.14, 0.14, 0.14], [0, 0, 0], g, { glow: true, noShadow: true });
  return g;
}
function updateSnow(dt) {
  if (!SB || G.scene !== 'snow') return;
  const S = SB, t = G.t; driftClouds(dt, 30); updateWorld(dt, t);
  if (S.done) return;
  S.t += dt; const mv = S.T.speed * dt;
  const px = S.x; S.x = lerp(S.x, SB_LANES[S.lane], 1 - Math.pow(0.0008, dt)); const vx = (S.x - px) / Math.max(dt, 0.001);
  S.rider.position.x = S.x; S.rider.rotation.z = clamp(-vx * 0.08, -0.35, 0.35); S.rider.position.y = Math.abs(Math.sin(S.t * 5)) * 0.03;
  S.moving.forEach(p => { p.position.z += mv; if (p.position.z > 8) p.position.z -= SB_LEN; });
  S.chairs.forEach(c => { c.position.z += mv + (c.userData.up ? -2.2 : 2.2) * dt; if (c.position.z > 8) c.position.z -= SB_LEN; if (c.position.z < 8 - SB_LEN) c.position.z += SB_LEN; c.rotation.z = Math.sin(S.t * 2 + c.position.z) * 0.05; });
  if (!SET.calm && Math.random() < dt * 30) FX.emit(S.x + (Math.random() - 0.5) * 0.6, 0.1, 3.4, ['#ffffff', '#eaf6ff'], 1, 1.2, { g: 2, life: 0.5 });
  S.spawn -= dt;
  if (S.spawn <= 0 && S.t < S.dur - 1.5) { S.spawn = 0.5 + Math.random() * 0.45; sbSpawn(SPAWN_Z); }
  if (S.rival) { const r = S.rival; if (Math.random() < dt * 0.6) r.userData.lane = S.lane === 2 ? Math.floor(Math.random() * 2) : 2; r.position.x = lerp(r.position.x, SB_LANES[r.userData.lane], dt * 2.5); r.position.z = 3.2 + Math.sin(S.t * 0.7) * 0.8; r.position.y = Math.abs(Math.sin(S.t * 6)) * 0.02; }
  S.items = S.items.filter(it => {
    it.g.position.z += mv;
    if (it.kind === 'flake') { it.g.rotation.y += dt * 3; it.g.position.y = 0.5 + Math.sin(S.t * 4 + it.ph) * 0.1; }
    if (Math.abs(it.g.position.z - 3) < 0.6 && it.lane === S.lane) {
      world.remove(it.g);
      if (it.kind === 'flake') { S.flakes++; sfx('pop'); sparkle(S.x, 0.9, 3, 12); }
      else { S.bumps++; sfx('bad'); cam.shake = SET.calm ? 0 : 0.2; FX.emit(S.x, 0.4, 2.6, ['#ffffff'], 16, 2.5, { g: 3, life: 0.8 }); toast(['Wipeout! Straight back up.', 'Face full of powder.', 'Butt pad: worth it.'][S.bumps % 3]); }
      const c = $('#sbCnt'); if (c) c.textContent = (S.T.luge ? 'Stars: ' : 'Snowflakes: ') + S.flakes;
      return false;
    }
    if (it.g.position.z > 8) { world.remove(it.g); return false; }
    return true;
  });
  // the cheeky kiwi who chases you down the maunga for the last stretch
  if (S.t > S.dur * 0.6 && !S.kiwi && !S.T.luge) { S.kiwi = makeKiwiBird(world); S.kiwi.position.set(SB_LANES[S.lane === 0 ? 1 : S.lane - 1], 0, 6); toast('Awww churrr bro!', true); sfx('honk'); }
  if (S.kiwi) { const kl = SB_LANES[S.lane === 0 ? 1 : S.lane - 1]; S.kiwi.position.x = lerp(S.kiwi.position.x, kl, dt * 3); S.kiwi.position.z = lerp(S.kiwi.position.z, 3.6, dt * 1.5); S.kiwi.position.y = Math.abs(Math.sin(S.t * 12)) * 0.15; }
  const bar = $('#sbBar'); if (bar) bar.style.width = Math.min(100, S.t / S.dur * 100) + '%';
  if (S.t >= S.dur && !S.done) {
    S.done = true; G.mode = 'busy'; stat('happy', Math.min(12, 4 + S.flakes), true);
    sfx('badge'); confetti(S.x, 1.2, 3, 50);
    const rec = runRecords(), bests = rec.bests || (rec.bests = {}), prev = bests[S.key] || 0, best = S.flakes > prev;
    if (best) bests[S.key] = S.flakes;
    let lines;
    if (S.T.luge) {
      const win = S.flakes - S.bumps * 2 >= 3; HLOG.lugeWin = win; F.qtLuge = true; if (win) earn('luge');
      lines = [win ? "Across the line first! Paulo is stunned." : "Paulo pips you at the line by a whisker.", S.flakes + " star" + (S.flakes === 1 ? "" : "s") + " grabbed, " + S.bumps + " cone" + (S.bumps === 1 ? "" : "s") + " clipped.", win ? { n: CONFIG.boyfriend, t: "Rematch. Tomorrow. I'm serious." } : { n: CONFIG.boyfriend, t: "Hot chocolate's on you!" }];
    } else {
      F.qtSki = true; HLOG.flakes = S.flakes; stat('gains', 10, true);
      const g = rec.grades || (rec.grades = {}); g[G.grade] = true;
      if (G.grade === 'black') earn('black');
      if (['green', 'blue', 'red', 'black'].every(k => g[k])) earn('powder');
      lines = [S.bumps === 0 ? "Top to bottom, not a single fall. Who even are you?!" : "Made it down. Only " + S.bumps + " tumble" + (S.bumps > 1 ? "s" : "") + ", all very stylish.", S.flakes + " snowflake" + (S.flakes === 1 ? "" : "s") + " caught on the way down.", { n: CONFIG.boyfriend, t: "That kiwi chased you the whole last run." }];
    }
    if (best && prev) lines.splice(1, 0, "New best on " + S.key + "! (was " + prev + ")");
    saveRunRecords(rec);
    say(lines, () => fade(() => { SB = null; loadMap('qtown'); }));
  }
}

/* ---------------- Hunter Valley ---------------- */
function updateHunter(dt, t) { const k = W && W.hol; if (!k) return; k.balloons.forEach((b, i) => { b.position.y += Math.sin(t * 0.6 + b.userData.phase) * dt * 0.2; b.position.x += dt * 0.08; b.rotation.y += dt * 0.1; }); }
function tastingGame() {
  const glasses = shuffle(HOL.hv.wines.slice()); let i = 0, score = 0;
  const round = () => {
    const w = glasses[i];
    const p = panel('Blind tasting', 'Glass ' + (i + 1) + ' of ' + glasses.length + ': "' + esc(w.note) + '"', 'grid2');
    const btns = HOL.hv.wines.map(o => makeBtn(`<span>${esc(o.n)}</span>`, b => {
      MENU.b.forEach(x => x.disabled = true);
      if (o.n === w.n) { score++; sfx('good'); b.classList.add('done'); toast('Spot on! ' + w.n + '.', true); if (W && W.player) sparkle(W.player.g.position.x, 1.2, W.player.g.position.z, 16); }
      else { sfx('bad'); p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake'); toast('Close! That one was the ' + w.n + '.'); }
      setTimeout(() => { i++; if (i < glasses.length) round(); else finish(); }, 750);
    }));
    p.querySelector('.grid2').append(...btns);
    setMenu(btns, { cols: innerWidth > 460 ? 2 : 1, onBack: null });
  };
  const finish = () => {
    clearUI(); G.mode = 'busy'; F.hvTaste = true; HLOG.score = score; stat('happy', 6 + score * 2, true); if (score === glasses.length) earn('somm');
    moment('Tasting done', { e: '🍇', k: 'wine', title: score + ' of ' + glasses.length + ' guessed', line: score >= 3 ? 'Paulo buys lunch!' : 'Paulo is insufferable about it', ms: 1900 }, () => {
      G.mode = 'map';
      say(score >= 3 ? { n: CONFIG.boyfriend, t: "How?! Fine. Lunch is on me." } : { n: CONFIG.boyfriend, t: "Ha! Lunch is on you." }, () => pickMenu('Favourite glass', 'Which one is coming home with us?', HOL.hv.wines.map(w => ({ n: w.n, d: w.note.split('.')[0] })), f => {
        HLOG.fav = f.n; say(["Two bottles of " + f.n + " go in the boot. Maybe three.", { n: CONFIG.name, t: CONFIG.catchphrase }], refreshHints);
      }, false));
    });
  };
  round();
}
function hvEvening() {
  pickMenu('Tomorrow morning', 'Early start or a lazy one?', HOL.hv.morning, m => {
    HLOG.morning = m.n; F.hvMorning = true; stat('happy', 8, true);
    say([{ n: CONFIG.name, t: m.n + "." }, { n: CONFIG.boyfriend, t: "Now, dinner tonight?" }], () => pickMenu('Dinner in the vines', 'The sun is going down over the vines.', HOL.hv.dinner, d => {
      HLOG.dinner = d.n; stat('energy', 15, true);
      say([{ n: CONFIG.boyfriend, t: d.n + ". Good call." }, "Golden light, a full glass, nowhere to be.", { n: CONFIG.name, t: CONFIG.catchphrase }], () => fade(holidayEnd));
    }, false));
  });
}

/* ---------------- memories card ---------------- */
function holidayEnd() {
  const qt = G.holiday === 'qt';
  clearWorld(); clearUI(); G.scene = 'hend'; G.mode = 'busy'; clearCheckpoint(); showHUD(false); setChapter('Holiday memories');
  W = { id: 'hend', objs: [], npcs: [], hearts: [], markers: [], anim: [], dispose: [], walls: [], decor: [] };
  setSky(qt ? 'night' : 'dusk'); fitSun(0, 0, 8); G.clock = SCENE_TIME.hend;
  const ground = qt ? '#f4f8fc' : '#b8d98a';
  makeIslandBase(world, 8, 6, ground, 0, 0); mk(G_BOX, ground, [8, 0.2, 6], [0, -0.1, 0], world);
  if (qt) { const far = grp(world, 0, -0.2, -6); for (let i = 0; i < 6; i++) makeMountain(far, -9 + i * 3.6, hsh(i, 3), 3.4, 3.5 + hsh(i, 4) * 3); makePine(world, -3.2, -1.5, 1.2, true); makePine(world, 3.2, -1.2, 1, true); makeSnowman(world, 2.6, 1.6); }
  else { for (let r = 0; r < 2; r++) { const v = HB['hunter:v'](6, 1); v.position.set(0, 0, -2.2 + r * 0.9); world.add(v); } makeGum(world, -3.3, 1.4, 1); makeWineBottle(world, 0.1, 0.62, 0.35, '#6b1e3a'); }
  const tbl = grp(world, 0, 0, 0.35); mk(G_CYL, '#c89f7a', [1.1, 0.06, 0.8], [0, 0.6, 0], tbl); mk(G_CYL, '#6b4a32', [0.08, 0.6, 0.08], [0, 0.3, 0], tbl);
  makeGlass(tbl, -0.25, 0.63, 0.1, qt ? '#8a4a2a' : '#6b1e3a'); makeGlass(tbl, 0.25, 0.63, 0.1, qt ? '#8a4a2a' : '#6b1e3a');
  makeFairyLights(world, -3, -2.8, 3, -2.8, 2.2, 22);
  const a = qt ? makeAnnette('snow') : makeAnnette('sunny'), p = qt ? makePerson(LOOK.pauloSnow) : makePerson(LOOK.paulo);
  a.position.set(-0.9, 0, 0.35); a.rotation.y = 0.7; p.position.set(0.9, 0, 0.35); p.rotation.y = -0.7; world.add(a, p); W.cast = [a, p];
  for (let i = 0; i < 6; i++) makeCloud(world, -20 + i * 7, -5 + hsh(i, 1) * 1.5, -8 + hsh(i, 2) * 16, 1.3);
  cam.base = 11; cam.pitch = 0.55; cam.zoomGoal = 1.4; cam.zoom = 1.4; cam.goal.set(0, 1.1, -0.2); cam.target.copy(cam.goal); cam.orbit = SET.calm ? 0.02 : 0.05;
  wkTicker((dt, t) => { updateWorld(dt, t); W.cast.forEach((g, i) => animatePerson(g, false, dt, t + i)); if (!SET.calm && Math.random() < dt * (qt ? 20 : 3)) FX.emit((Math.random() - 0.5) * 10, 5, (Math.random() - 0.5) * 6, qt ? ['#ffffff', '#eaf6ff'] : ['#fff4c9', '#ffd166'], 1, 0.3, { g: qt ? 0.5 : -0.2, life: 5 }); });
  sfx('badge'); confetti(0, 2, 0, 60);
  const rows = qt ? [
    ['The trip', 'Queenstown, ' + HOL.qt.dates],
    ['Home base', HOL.qt.stay + ', a studio by the gondola'],
    ['Ski day', (HLOG.run ? HLOG.run + ' at ' : '') + (HLOG.field || 'The mountain') + ', ' + HLOG.flakes + ' snowflakes'],
    ['Kit', (HLOG.jacket || 'A cosy jacket') + ' and ' + (HLOG.ride ? HLOG.ride.toLowerCase() : 'a snowboard')],
    ['Fuel', HLOG.snack || 'Fergburger, obviously'],
    ['Rest day', HLOG.rest || 'Sleeping in'],
    ['Farewell dinner', HLOG.dinner || 'Something delicious']
  ] : [
    ['The trip', 'The Hunter Valley'],
    ['Blind tasting', HLOG.score + ' of ' + HOL.hv.wines.length + ' guessed right'],
    ['In the boot', (HLOG.fav || 'Semillon') + ', a few bottles'],
    ['Cheese shop', HLOG.cheese || 'Next time!'],
    ['Morning', HLOG.morning || 'A lazy one'],
    ['Dinner', HLOG.dinner || 'Something delicious']
  ];
  if (qt && HLOG.lugeWin != null) rows.splice(5, 0, ['Skyline luge', HLOG.lugeWin ? 'Beat Paulo to the bottom' : 'Paulo won. Rematch pending']);
  memoriesCard(qt ? 'holiday-qt' : 'holiday-hv', { title: 'What a trip, ' + CONFIG.name + '!', sub: qt ? 'Snow, lakes and one cheeky kiwi' : 'Vines, wine and golden hour', head: qt ? 'Queenstown memories' : 'Hunter Valley memories', rows }, [makeBtn('Another holiday', () => fade(startHoliday), 'big alt'), makeBtn('Back to title', () => fade(titleScreen), 'big')]);
}

/* ---------------- QA jumps ---------------- */
function holQA(kind, map, fn) { G.campaign = 'holiday'; resetHoliday(); G.holiday = kind; G.outfit = kind === 'qt' ? 'winter' : 'sunny'; loadMap(map); if (fn) setTimeout(() => { if (DLG) { DLG.q = []; nextLine(); } fn(); }, 950); }
Object.assign(QA_EXTRA, {
  holiday: () => startHoliday(),
  qtown: () => holQA('qt', 'qtown'),
  qtgear: () => holQA('qt', 'qtown', () => { F.qtGear = true; G.outfit = 'snow'; loadMap('qtown'); }),
  snowrun: () => { resetHoliday(); G.holiday = 'qt'; G.ride = 'board'; G.grade = 'red'; Object.assign(HLOG, { field: 'The Remarkables', run: 'Shadow Basin' }); buildSnowRun('remarks'); },
  skirun: () => { resetHoliday(); G.holiday = 'qt'; G.ride = 'ski'; G.grade = 'green'; Object.assign(HLOG, { field: 'The Remarkables', run: 'Homeward Run' }); buildSnowRun('remarks'); },
  nightrun: () => { resetHoliday(); G.holiday = 'qt'; G.ride = 'board'; G.grade = 'blue'; Object.assign(HLOG, { field: 'Coronet Peak night ski', run: 'Blue run' }); buildSnowRun('coronet'); },
  qtfield: () => holQA('qt', 'qtown', () => { F.qtGear = true; fieldMenu(); setTimeout(() => MENU && MENU.b[1].click(), 300); }),
  qtjacket: () => holQA('qt', 'qtown', gearMenu),
  luge: () => { G.campaign = 'holiday'; resetHoliday(); G.holiday = 'qt'; buildSnowRun('luge'); },
  flight: () => { G.campaign = 'holiday'; resetHoliday(); G.holiday = 'qt'; flightScene(); },
  qtnight: () => { resetHoliday(); G.holiday = 'qt'; F.qtGear = true; F.qtSki = true; G.outfit = 'snow'; loadMap('qtown'); },
  hunter: () => holQA('hv', 'hunter'),
  tasting: () => holQA('hv', 'hunter', tastingGame),
  holend: () => { resetHoliday(); G.holiday = 'qt'; Object.assign(HLOG, { field: 'The Remarkables', run: 'Alta Blue', jacket: "Macpac jacket", ride: 'Skis', flakes: 14, snack: 'Big Al burger', rest: 'Onsen Hot Pools', dinner: 'Botswana Butchery' }); holidayEnd(); },
  hvend: () => { resetHoliday(); G.holiday = 'hv'; Object.assign(HLOG, { score: 3, fav: 'Semillon', cheese: 'Triple cream brie', morning: 'Hot air balloon at sunrise', dinner: 'Degustation at a winery' }); holidayEnd(); }
});
