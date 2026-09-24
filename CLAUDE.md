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
- `assets/screenshots/`: reference shots of each scene, `00-title.png` to `11-credits.png` (regenerate after visual changes)
- `Claude outputs/`: before/after comparison images from polish passes
- `PROMPT.md`: the kickoff prompt for Claude Code

## How index.html is organised (search for these banners)
- `EDIT ME` / `CONFIG`: all personal content (names, car, company, drinks, dishes, inside jokes, secrets, finale speech)
- `sprites`: pixel sprites as string rows. Each char maps to a palette key, `.` is transparent. Annette is built from `HEAD_F`/`HEAD_B` plus a `LOWER` style (`pants`, `crop`, `dress`). Lower-case keys are shades: when an override recolours `T`, `P`, `H`, `D` or `M`, the matching lower-case key is darkened automatically, so shading follows every outfit and NPC
- Luca: `luca`, `luca_walk`, `luca_wag` (side view, faces right, flip to face left). Use `lucaSpr(moving)` to pick the frame
- `state`, `HUD` (needs-style bars coloured by level via `needColour`, in-game clock via `SCENE_TIME` / `setClock`), `audio` (WebAudio SFX + tiny chiptune sequencer), `input` (keyboard + on-screen D-pad/A/B)
- `UI primitives`: `say()` dialogue with typewriter, `setMenu()` keyboard/touch menus, `fade()`
- `maps`: `MAPS` object. Each map is 15x10 tiles of 16px on a 240x160 canvas
- Chapter logic: bedroom, drive, gym + lift mini-game, battles, office report sprint, beach, The Botanist, finale, credits
- `tile art`: `drawFloor`, `drawWall`, `drawObject` per theme, plus `mapDecor(theme, 'under'|'over')` for rugs (drawn before furniture) and lighting overlays (fairy lights, golden hour)
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
Title (party stage with Annette, Mum, Paulo and Luca) > Bedroom (outfit, skincare, tidy, Mum; Luca says goodbye at the door) > Drive > One Playground (lift mini-game, battle The Last Set, lockers) > Drive > National Intermodal (report sprint, battle Inbox Overload) > Lunch café > Drive > Beach (golden hour, Joanne) > The Botanist, Kirribilli (drink, dinner with Paulo, cake, speech) > Fireworks finale > Credits.

## Rules
- Keep it one self-contained `index.html` unless Paulo explicitly asks for a build setup. It must stay easy to share as a single file or link.
- Original art only. No real Pokemon, Nintendo or other franchise characters, logos or names. No song lyrics or copyrighted audio (artist names on the radio are fine).
- Never show Annette's age anywhere in the game.
- In-game text: warm, short, playful. No em dashes.
- Art direction: cozy and rounded. Outlines are never flat ink: `sprite()` turns `K` pixels into a darker shade of the colour they border, the `box()` helper in `drawObject` draws rounded corners with shaded edges and a top highlight, and `oval(..., INK)` strokes in the fill's own shade. Keep new art in that system rather than adding hard black lines. UI corners use `--r`.
- Must work on mobile Safari and desktop Chrome. Keep touch controls working.
- No external network calls. Pixelify Sans and Figtree (SIL OFL) are embedded as base64 `@font-face` rules.
- Life-sim touches: speech bubbles over whoever is talking (drawn in `renderMap`), furniture with a front face and lit top edge from `box()`, and a clock that pauses during dialogue and menus.
- Luca only appears in the morning (bedroom), on the title screen and in the credits. He stays home with Mum for the rest of the day.
- Keep in-screen text readable on phones: use `max(<px>, <n>cqw)` font sizes, never below about 10px.
- After any change, play through start to finish (or script it with Playwright) and check the console for errors.
