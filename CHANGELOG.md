# Changelog

## v2: whimsy, drama and side quests (2026-11-12)

Everything here is in `v2/` (the 3D diorama edition). The original pixel game at the repo root is unchanged.

### Smoother animation
- About half the triangles per scene (for example 536k to 210k on the Edmondson St block) from size-based detail levels; shadow-pass triangles roughly halved too. No visible change at normal or close-up zoom.
- Adaptive resolution: slow devices step the pixel ratio down until frames are smooth, without bouncing back and forth.
- Map builds about twice as fast, so the pause behind each fade is shorter.
- No more per-frame scene searches or garbage from water sparkles.

### Fast skip
- A Skip button in the top bar (or Tab): skips a whole conversation, finishes a mini-game, battle or drive, or opens a section list to jump to any section still ahead. Every conversation box has its own Skip too.

### Holiday Pack: Port Macquarie, and more to do on the other trips
- **Port Macquarie** is a fourth holiday: count five koalas hiding in the gums for the Koala Hospital, catch whale breaches from Tacking Point Lighthouse, paint a rock for the breakwall, then pick an arvo and a dinner. New memories card and two badges (Koala counter, Whale spotter).
- **Hunter Valley**: the sunrise hot air balloon is now a playable flight (badge: Balloon pilot).
- **Queenstown, New Zealand**: a Milford Sound day trip joins the rest day options.

### Holiday Pack: Thirroul beach trip
- A third holiday: the Grand Pacific Drive down to Thirroul, hire a board and catch three waves, defend lunch from The Chip Thief, build a sandcastle, explore the rock pool, dip in the ocean pool, then pick an arvo (Sea Cliff Bridge, Sublime Point or stargazing) and a dinner. New memories card, two new badges (Surf's up, Chip defender).
- Content lives in `CONFIG.holiday.bt` in `v2/src/09-holiday.js`.

### Characters redrawn from scratch
- People are clean vinyl-toy figures: one smooth head, a single hair shell with a tidy hairline, two glossy eyes, soft cheeks and a small smile. Noses, brows, ears and hair-shine patches are gone.
- Each hairstyle is the shell plus a few big shapes (Annette's long hair and side fringe, Mum's bob, Paulo's wavy top, buns, beanies). Annette keeps her blue eyes, lashes and pink bow.
- Luca is rebuilt from a dozen rounded shapes instead of hundreds of fur tufts: caramel body, cream bib, muzzle and paws, a fluffy topknot, long floppy ears and a plume tail. The other park dogs follow.

### Smoother shading and shapes
- People are no longer stacked cylinders: torsos and dresses are turned from smooth curves, limbs are rounded capsules, and heads and hair use a finer sphere.
- Characters, the cat and the birds are shaded on a soft ramp instead of hard toon bands, and no longer get shadow lines across their faces.
- Round props (rugs, tables, cakes, cones) have more sides, so their edges read as curves.

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
