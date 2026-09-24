# Annette's Big Day: project guide for Claude Code

A birthday gift game for Annette, built by Paulo. A top-down, handheld-style pixel RPG covering one day in her life. Everything runs from a single self-contained `index.html` (no build step, no dependencies).

## Run it
- `python3 -m http.server 8000` then open http://localhost:8000
- or `npx serve .`
- Opening `index.html` directly also works.

## File map
- `index.html`: the whole game (HTML, CSS, JS in one file)
- `assets/sprites/`: every sprite exported at 1x (PNG, transparent)
- `assets/sprites-8x/`: same sprites at 8x for previews and docs
- `assets/sprites.json`: sprite source data (rows + palettes) and outfit colours
- `assets/sprite-sheet.png`: all sprites on one sheet
- `assets/screenshots/`: reference shots of each scene
- `PROMPT.md`: the kickoff prompt for Claude Code

## How index.html is organised (search for these banners)
- `EDIT ME` / `CONFIG`: all personal content (names, car, company, drinks, dishes, inside jokes, secrets, finale speech)
- `sprites`: pixel sprites as string rows. Each char maps to a palette key, `.` is transparent. Annette is built from `HEAD_F`/`HEAD_B` plus a `LOWER` style (`pants`, `crop`, `dress`)
- `state`, `HUD`, `audio` (WebAudio SFX + tiny chiptune sequencer), `input` (keyboard + on-screen D-pad/A/B)
- `UI primitives`: `say()` dialogue with typewriter, `setMenu()` keyboard/touch menus, `fade()`
- `maps`: `MAPS` object. Each map is 15x10 tiles of 16px on a 240x160 canvas
- Chapter logic: bedroom, drive, gym + lift mini-game, battles, office report sprint, beach, The Botanist, finale, credits
- `tile art`: `drawFloor`, `drawWall`, `drawObject` per theme
- `loop`: update + render per `G.scene`

## Map legend (per theme)
- Shared: `#` wall, `.` floor, `D` door (walk onto it), `h` heart pickup, `_` wet sand (walkable)
- bedroom: `o` window (owl secret), `w` wardrobe, `k` bookshelf (secret), `v` vanity, `b` bed, `x` clutter, `M` Mum
- gym: `m` mirror, `r` squat rack, `L` lockers (card secret), `b` bench, `g` gym-goer, `n` coach
- office: `w` window, `p` plant, `d` desk, `Y` Annette's desk, `Z` computer (battle), `c` coworker
- beach: `~` water, `u` umbrella, `p` palm, `s` shell, `J` Joanne the Corolla (exit)
- botanist: `F` film poster (secret), `f` fern, `r` bar counter, `t` table, `n` bartender, `A` Paulo

Multi-tile objects are drawn once from their top-left tile (`isOrigin` + `extent`).

## Game flow
Title > Bedroom (outfit, skincare, tidy, Mum) > Drive > One Playground (lift mini-game, battle The Last Set, lockers) > Drive > National Intermodal (report sprint, battle Inbox Overload) > Beach (golden hour, Joanne) > The Botanist, Kirribilli (drink, dinner with Paulo, cake, speech) > Fireworks finale > Credits.

## Rules
- Keep it one self-contained `index.html` unless Paulo explicitly asks for a build setup. It must stay easy to share as a single file or link.
- Original art only. No real Pokemon, Nintendo or other franchise characters, logos or names. No song lyrics or copyrighted audio (artist names on the radio are fine).
- Never show Annette's age anywhere in the game.
- In-game text: warm, short, playful. No em dashes.
- Must work on mobile Safari and desktop Chrome. Keep touch controls working.
- No external network calls except Google Fonts (with fallbacks).
- After any change, play through start to finish (or script it with Playwright) and check the console for errors.
