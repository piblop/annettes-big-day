# Changelog

## v2: whimsy, drama and side quests (2026-11-12)

Everything here is in `v2/` (the 3D diorama edition). The original pixel game at the repo root is unchanged.

### Holiday Pack: Jervis Bay beach trip
- A third holiday: drive down the south coast, hire a board and catch three waves, defend lunch from The Chip Thief, build a sandcastle, explore the rock pool, then pick an arvo and a dinner. New memories card, two new badges (Surf's up, Chip defender).
- Content lives in `CONFIG.holiday.bt` in `v2/src/09-holiday.js`.

### Side quests
- **Around the block**: a morning lap of Edmondson St, North Ryde with Luca, started from his lead by the bedroom door. A new 21 by 15 street map with the Ryrie St corner, the Blenheim Rd coffee cart and the gate to Blenheim Park. Five quests: the lap, Luca's sniff report, the lemon tree parcel (plot twist included), Biscuit the cat, and a battle with the Ryrie St magpie. Luca keeps his BIRTHDAY SECURITY bandana afterwards.
- **The cake caper**: an office whodunnit with four suspects and one icing-covered sleeve.
- **Message in a bottle**: three glints on the wet sand at the beach.
- Side quests show in the Log, the credits and the album page. Three new badges, three more hearts.

### Drama
- Cinematic sting cards for the big beats, a CEO email cliffhanger, a booking scare that turns into a surprise at The Botanist, a blackout before the cake and heart-shaped fireworks in the finale.

### Whimsy
- Sky friends (sun, moon, rainbow, hot-air balloon), napping clouds, toadstools, vines, crystals and waterfalls on every island, butterflies, drifting petals and fireflies, footstep puffs, a soft edge glow.

### Fixes
- Water tiles were hidden under the island's top layer, so the sea at the beach and the pool at Greenwich Baths never showed. They do now.
- Maps now always open square-on after the title screen's slow orbit.
- A new day restores the bedroom clutter after a resumed save.
- Walk-on triggers fire as you pass, not only when you stop.
- Test scripts run on Linux and under slow software rendering.

## v1.0.0 — 2026-09-28

The first tagged release: the full birthday day plus the Weekend Adventure expansion.

### The day
- Title, bedroom morning (outfits, skincare, tidy, Mum, Luca goodbye), drives with radio, gym (lift mini-game + The Last Set battle), office (report sprint + Inbox Overload battle), lunch café, golden-hour beach, The Botanist dinner with cake and speech, fireworks finale, credits.
- Collection log: 4 secrets, badges, hearts hidden across every map.

### Weekend Adventure expansion
- Greenwich Baths swim, Top Ryde ALDI grocery-grab, dog park with a real throw-and-fetch mini-game and extra dogs, movie night with chess or a picnic, dinner or wine bar, weekend end card.

### Luca
- Detailed cavoodle sprite with a shiny eye, blush, tongue and fluffy topknot; three-position wagging tail; dance-and-jump idle animations.
- "Cuddles with Luca" petting mini-game: a zoomed-in Luca you stroke with cursor or finger, sparkling favourite spots, love meter, cuddle finale. Works everywhere Luca appears.

### Production polish (this release)
- Settings panel (persisted): sound FX, opt-in chiptune music, vibration, reduced motion (also respects the OS preference).
- Automatic checkpoint save each map; Continue on the title screen; finished days clear the save.
- Haptic feedback on phones mapped to game events.
- `?qa=` scene-jump hook for testing and screenshot capture; regenerated all reference screenshots (now 14, including the new mini-games).
- Favicon, theme colour and mobile meta polish.
- CI: parse + sprite validation on every push.
