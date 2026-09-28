# Annette's Big Day v2: the whimsical edition

A 3D remake of the birthday game: the same day (bedroom, gym, office, lunch, beach, The Botanist, fireworks) as floating toy-diorama islands in three.js, plus the **Weekend Adventure** expansion (a Saturday with Paulo and Luca), launched from the title screen or the credits.

## Play
Open `v2/index.html`. It is one self-contained file (fonts, three.js r128 and the game are all inlined, no network calls).

## Edit and build
- Source lives in `v2/src/` (`01-config.js` is the EDIT ME block, `CONFIG.weekend` is in `08-weekend.js`). `shell.html` holds the HTML and CSS.
- Build: `node v2/tools/build.js` writes `v2/index.html`.
- Test: `node v2/tools/play.js` plays title to credits, `node v2/tools/play-weekend.js` plays the weekend. Both run headless Chrome and fail on any console error (`W=390 H=844` for a phone).
- Screenshots: `node v2/tools/shoot.js [scene ...]` writes `v2/screenshots/`. Scenes: title, map, drive, lift, battle, report, lunch, drinks, pet, finale, credits, wkbaths, wkshop, grocery, wkpark, fetch, wkhome, wknight, wkend (same names as `?qa=`).

## Controls
Arrows/WASD walk, Space/Enter/Z = A, Esc/X = B, Q/E rotate the diorama, B opens the collection log. Tap a spot to walk there, or tap a thing to walk up and use it.

## Holiday Pack
"Go on holiday" on the title screen and credits. Pick a trip:
- **Queenstown ski trip** (from the real Aug 2026 itinerary): Lomond Lodge, Fergburger, a winter-jacket pick (Arc'teryx, Patagonia, ALDI, Kathmandu, Macpac), board or skis at Greentoad, then Cardrona, The Remarkables or a Coronet Peak night ski. Remarkables runs come from its trail map (Homeward Run, Alta Blue, Shadow Basin, Alta Chutes, graded green/blue/red/black). The snowboard run has a chairlift and a cheeky kiwi. Then a rest day, a farewell dinner and a memories card.
- **Hunter Valley**: blind tasting at the cellar door, cheese shop, a morning adventure and dinner in the vines.
Content lives in `CONFIG.holiday` in `src/09-holiday.js`. Test: `node v2/tools/play-holiday.js`. QA scenes: holiday, qtown, qtjacket, qtfield, snowrun, skirun, nightrun, qtnight, hunter, tasting, holend, hvend.

## Weekend Adventure
Greenwich Baths > ALDI grocery grab > dog park fetch > home (movie, then chess or a picnic) > night out > end card. Luca tags along everywhere except inside ALDI, where he waits in the car.
