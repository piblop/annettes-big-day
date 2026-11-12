# Annette's Big Day v2: the whimsical edition

A 3D remake of the birthday game: the same day (bedroom, gym, office, lunch, beach, The Botanist, fireworks) as floating toy-diorama islands in three.js, plus the **Weekend Adventure** expansion (a Saturday with Paulo and Luca), launched from the title screen or the credits.

## Play
Open `v2/index.html`. It is one self-contained file (fonts, three.js r128 and the game are all inlined, no network calls).

## Edit and build
- Source lives in `v2/src/` (`01-config.js` is the EDIT ME block, `CONFIG.weekend` is in `08-weekend.js`, `CONFIG.block` in `09-block.js`). `shell.html` holds the HTML and CSS. Files are joined in name order, and `09-main.js` boots the game, so new modules must sort before it.
- Extension points: `OBJ_BUILDERS['theme:ch']`, `WALL_BUILDERS`, `QA_EXTRA`, `MAP_HOOKS` (run after every map build), and per-map `tint(ch, x, z)` for floor colours and `onStep(x, z)` for walk-on triggers.
- Build: `node v2/tools/build.js` writes `v2/index.html`.
- Test: `node v2/tools/play.js` plays title to credits including every side quest, `node v2/tools/play-weekend.js` plays the weekend. Both run headless Chrome and fail on any console error (`W=390 H=844` for a phone). Set `CHROME=/path/to/chrome` if Chrome is not in the default Windows location. Waits follow game time, so the scripts also pass on slow software rendering.
- Screenshots: `node v2/tools/shoot.js [scene ...]` writes `v2/screenshots/`. Scenes: title, map, drive, lift, battle, report, lunch, drinks, pet, finale, credits, block, blockcat, magpie, sting, caper, bottle, wkbaths, wkshop, grocery, wkpark, fetch, wkhome, wknight, wkend (same names as `?qa=`).

## Side quests
Optional detours on the birthday day, tracked in the Log (B) and counted in the credits. Finishing them earns the Good neighbour, Sleuth and Side quest badges.
- **Around the block** (bedroom: Luca's lead by the door). A morning lap of Edmondson St, North Ryde with Luca, in pyjamas if you have not dressed yet. It is a stylised toy version of the real streets: Edmondson St meets Ryrie St at the corner, Blenheim Rd has the shops, and the gate leads to Blenheim Park and its dog park. Five quests live here: walk all four corners, Luca's five-stop sniff report, a stray parcel for "the house with the lemon tree" (with a twist), Biscuit the cat stuck up a jacaranda, and a swooping-season showdown with the Ryrie St magpie. Three hearts are hidden on the block too.
- **The cake caper** (office: the cake table). Someone got into the birthday cake. Ask the four coworkers, then name the culprit at the cake.
- **Message in a bottle** (beach). Follow three glints along the wet sand.

Content lives in `CONFIG.block` at the top of `src/09-block.js` (street names, the cat, sniff reports, suspects, the bottle note).

## Drama
`sting(title, sub, cb)` in `src/09-atmosphere.js` is the cinematic beat: letterbox bars, speed lines, a tilted title and a camera shake (toned down by Reduced motion). The day uses it for The Last Set, Inbox Overload, the CEO's 4:59 email, the booking wobble at the beach, the dark-windows surprise at The Botanist and every quest ending. The cake arrives in a blackout and the finale throws heart-shaped fireworks.

## Whimsy pass
A sleepy sun, a dozing moon, a rainbow and a hot-air balloon live behind every island (parented to the camera, so they frame any zoom or rotation). Half the clouds are napping. Islands grow toadstools, flowering vines, crystals and a little waterfall. Butterflies loop the grassy islands, petals drift by day, gold dust at golden hour and fireflies at night. Footsteps puff, hearts pulse and the screen has a soft pink edge glow.

## Controls
Arrows/WASD walk, Space/Enter/Z = A, Esc/X = B, Q/E rotate the diorama, B opens the collection log. Tap a spot to walk there, or tap a thing to walk up and use it.

## Holiday Pack
"Go on holiday" on the title screen and credits. Pick a trip:
- **Queenstown ski trip** (from the real Aug 2026 itinerary): Lomond Lodge, Fergburger, a winter-jacket pick (Arc'teryx, Patagonia, ALDI, Kathmandu, Macpac), board or skis at Greentoad, then Cardrona, The Remarkables or a Coronet Peak night ski. Remarkables runs come from its trail map (Homeward Run, Alta Blue, Shadow Basin, Alta Chutes, graded green/blue/red/black). The snowboard run has a chairlift and a cheeky kiwi. Then a rest day, a farewell dinner and a memories card.
- **Hunter Valley**: blind tasting at the cellar door, cheese shop, a morning adventure and dinner in the vines.
- **Thirroul beach trip**: the Grand Pacific Drive down to Thirroul, 80 minutes south of Sydney, with the Illawarra escarpment behind the sand. Hire a board at the surf shack and catch three waves on a timing bar, then lunch from the kiosk (a seagull has other ideas), a sandcastle, a rock pool, base camp under the umbrella (including a dip in the ocean pool), an arvo out (Sea Cliff Bridge, Sublime Point lookout or stargazing) and dinner as the escarpment turns pink. Dolphins jump in the shallows and a pelican keeps watch from its post.
Travel scenes: a flight over the Southern Alps to Queenstown, a drive up the M1 to the Hunter. The Queenstown rest day can be a playable Skyline luge race against Paulo. Best scores per run are kept on the device. Content lives in `CONFIG.holiday` in `src/09-holiday.js`. Test: `node v2/tools/play-holiday.js`. QA scenes: holiday, flight, luge, qtown, qtjacket, qtfield, snowrun, skirun, nightrun, qtnight, hunter, tasting, thirroul, surf, gull, holend, hvend, btend.

## Weekend Adventure
Greenwich Baths > ALDI grocery grab > dog park fetch > home (movie, then chess or a picnic) > night out > end card. Luca tags along everywhere except inside ALDI, where he waits in the car.

## Saves, album and badges
- Each campaign (birthday, weekend, holiday) has its own save slot; Continue asks which one when there are several.
- Every ending saves a page to the memories album (title screen: Album). Endings also offer Save photo, a snapshot of the 3D scene.
- Pack badges (Powder hound, Black diamond, Sommelier, Luge legend, Surf's up, Chip defender, Centre aisle victim) persist across playthroughs.

## Performance
Characters and static props are merged per material with vertex colours (`mergeStatic` in `src/02-engine.js`); Luca is built once and cloned. Keep animated parts in their own groups so they survive merging.
