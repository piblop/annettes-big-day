'use strict';
/* =========================================================
   EDIT ME: personal details. Same content as v1, change freely.
   ========================================================= */
const CONFIG = {
  name: "Annette",
  boyfriend: "Paulo",
  car: "Joanne",                   // the blue Corolla
  company: "National Intermodal",
  dinnerSpot: "The Botanist, Kirribilli",
  catchphrase: "Say less.",
  radio: ["Tupac", "J. Cole", "Kendrick Lamar"],
  // Song titles shown as "now playing" (naming songs, not reproducing lyrics).
  radioBars: {
    "Tupac": ["California Love", "Changes", "Dear Mama", "Keep Ya Head Up"],
    "J. Cole": ["No Role Modelz", "Middle Child", "Work Out", "She Knows"],
    "Kendrick Lamar": ["HUMBLE.", "Alright", "DNA.", "Money Trees"]
  },
  drinks: [
    { n: "Espresso Martini", d: "Her night-out fuel" },
    { n: "Passionfruit Margarita", d: "Tequila, passionfruit, lime" },
    { n: "Aperol Spritz", d: "Aperol, prosecco, soda" },
    { n: "Pina Colada", d: "Her go-to. Extra pineapple." }
  ],
  dishes: [
    { n: "Wood-fired pizza", d: "Blistered and cheesy" },
    { n: "Salt and pepper squid", d: "Crispy, with aioli" },
    { n: "Truffle fries", d: "Extra parmesan" },
    { n: "Charcuterie board", d: "A bit of everything" }
  ],
  lunches: [
    { n: "Tonkotsu ramen", d: "That new ramen place everyone's on about." },
    { n: "Banh mi", d: "Crunchy, fresh and fast." },
    { n: "Food from home", d: "Portuguese chicken and rice. Cosy and packed with love." },
    { n: "Read my Kobo", d: "A cheeky chapter or two on the break." }
  ],
  insideJokes: [
    "Happy birthday! I heard your boyfriend still can't out-lift you.",
    "Is it true you have a spreadsheet for your spreadsheets?",
    "Scratched into the shell: 'Luca was here. Luca is always here.'"
  ],
  secrets: {
    owl: ["A snowy owl taps the window with a letter tied to its leg.", "It's a Hogwarts acceptance letter! Platform 9 3/4, here we come."],
    book: ["The full Harry Potter series, spines cracked from rereading.", "The bookmark sits at Philosopher's Stone again. Time for another reread."],
    card: ["Taped inside the locker: a shiny holographic Pokemon card.", "It's a Pikachu! Electric type, ultra rare, mint condition."],
    poster: ["A poster for the bar's rooftop film night.", "A wizarding double feature under the stars. Popcorn is booked."]
  },
  // What Annette yells at slow drivers on the drives
  honks: ["YALLAH!", "COME ON HABIBI YOU CAN DO IT", "THIS GUY!"],
  finaleMessage: [
    "A PR at the gym, exec reports smashed, a good lunch, and now cocktails by the harbour. What a day.",
    "You do so much! How lucky am I!!",
    "Happy birthday my Annette. I love you.",
    "Now let's ignore the Harbour Bridge again!"
  ]
};

const OUTFITS = {
  pj:     { name: "Pyjamas",       style: "pants", top: "#c9b6f2", bottom: "#c9b6f2" },
  gym:    { name: "Lululemon set", style: "crop",  top: "#ff6f91", bottom: "#2b2d42" },
  office: { name: "City office",   style: "pants", note: "Navy blazer, tailored pants", top: "#26457a", bottom: "#d9c7a8" },
  dinner: { name: "All black",     style: "pants", note: "Sleek and boardroom-ready", top: "#1f1a24", bottom: "#1f1a24" },
  sunny:  { name: "Sunny day",     style: "pants", note: "Yellow top, light blue jeans", top: "#ffd166", bottom: "#7fc8f8" },
  dress:  { name: "Blue dress",    style: "dress", top: "#5b8def", bottom: "#5b8def" }
};
const DAY_OUTFITS = ["office", "dinner", "sunny"];

const STEPS = ['Cleanser: La Roche-Posay', 'Serum: The Ordinary', 'Moisturiser: CeraVe', 'SPF: La Roche-Posay'];
const SORT_ITEMS = [
  ['Board pack', 0, '#26457a'], ['Exec summary', 0, '#ffffff'], ['Risk register', 0, '#e2554f'],
  ['Milestone tracker', 1, '#3fae7c'], ['Weekly status update', 1, '#ffd166'], ['Gantt chart', 1, '#9fd0ff'],
  ['Muesli bar', 2, '#c9a27a'], ['Mandarin', 2, '#ffa94d'], ['Rice crackers', 2, '#f3e2b3']
];
const TRAYS = ['Exec reports', 'Project updates', 'Snacks'];

const BADGES = {
  glow:     { n: 'Glow badge',     how: 'Nail the skincare routine' },
  gains:    { n: 'Gains badge',    how: 'Set a PR at the squat rack' },
  tidy:     { n: 'Tidy badge',     how: 'Tidy the bedroom and ace the report sprint' },
  balloons: { n: 'Balloon badge',  how: 'Catch 12 balloons on the drives' },
  cuddle:   { n: 'Cuddle badge',   how: 'Give Luca a full cuddle' },
  birthday: { n: 'Birthday badge', how: 'Reach the finale' }
};
const SECRET_IDS = ['owl', 'book', 'card', 'poster'];
const SECRET_NAMES = { owl: 'The owl post', book: 'The bookshelf', card: 'The locker card', poster: 'The film poster' };

// Time of day per scene, in minutes after midnight
const SCENE_TIME = { title: 9 * 60, bedroom: 7 * 60 + 30, gym: 8 * 60 + 45, office: 10 * 60 + 5, lunch: 12 * 60 + 30, beach: 17 * 60 + 20, botanist: 19 * 60 + 15, finale: 21 * 60, credits: 23 * 60 + 30 };

// Sky moods: gradient top, gradient bottom, sun colour, sun strength, hemisphere sky, hemisphere ground, fog
const SKIES = {
  morning: { top: '#ffd9e6', bot: '#bfe6ff', sun: '#fff1dc', k: 0.95, hs: '#ffffff', hg: '#b9a3c9' },
  day:     { top: '#9fd8ff', bot: '#e9f7ff', sun: '#ffffff', k: 1.0,  hs: '#ffffff', hg: '#a8c49a' },
  golden:  { top: '#ff9bb3', bot: '#ffd59a', sun: '#ffc98a', k: 1.0,  hs: '#ffe0c2', hg: '#b58a9a' },
  evening: { top: '#3a2f6b', bot: '#ff9fb8', sun: '#ffd9a8', k: 0.95, hs: '#ffe8d0', hg: '#8a6a8a' },
  dusk:    { top: '#6d5fb8', bot: '#ff9fb8', sun: '#ffb3a0', k: 0.7,  hs: '#d9c8ff', hg: '#6a5a8a' },
  night:   { top: '#1d1b4a', bot: '#5a4a8f', sun: '#b9c2ff', k: 0.45, hs: '#9fa8ff', hg: '#3a2f5a' }
};

// Tuning in one place
const TUNE = {
  tick: 0.25,          // real seconds per fixed sim tick
  minutesPerTick: 0.5, // in-game clock minutes per tick
  walkSpeed: 5.2,      // tiles per second
  driveTime: 16,       // seconds per drive
  balloonsForBadge: 12
};
