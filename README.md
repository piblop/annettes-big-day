# Annette's Big Day

A cozy handheld-style pixel RPG covering one big day in Annette's life, made with love by Paulo. One self-contained `index.html`: no build step, no dependencies, no network calls.

**Play it now:** https://piblop.github.io/annettes-big-day/

## The day

Wake up in North Ryde with Luca the cavoodle > gym (lift mini-game, battle The Last Set) > office (report sprint, battle Inbox Overload) > lunch > golden-hour beach > dinner and cake at The Botanist, Kirribilli > fireworks finale over the bridge.

Then unlock the **Weekend Adventure** expansion: Greenwich Baths, an ALDI grocery grab, fetch at the dog park, movie night, and a night out.

## How to play

- **Move:** arrow keys / WASD, or the on-screen D-pad on phones
- **A** (Space / Enter): interact, advance dialogue
- **B** (X / Esc): collection log, back
- Walk up to **Luca** and press A for the petting mini-game: stroke him with your cursor or finger, find his sparkling favourite spot, fill the love meter for a cuddle
- Find all the **hearts**, **secrets** and **badges** — the credits keep score
- **Settings** (top right): sound FX, opt-in chiptune music, vibration, reduced motion — saved on your device
- Your day is **checkpointed automatically**; the title screen offers Continue after a refresh

## Run it

- Double-click `index.html`, or
- `python3 -m http.server 8000` then open http://localhost:8000, or
- `npx serve .`

## Make it yours

All personal content (names, car, drinks, dishes, inside jokes, the finale speech) lives in the `CONFIG` block near the top of the script in `index.html` — search for `EDIT ME`.

## Architecture

Everything is in `index.html`: sprites as character-grid strings with palette maps, an EPX-upscaled renderer with soft shading for the leads, a 15x10-tile map system on a 240x160 logical canvas, a WebAudio SFX + chiptune sequencer, dialogue/menu UI primitives, and one update+render loop per scene. See `CLAUDE.md` for the full map.

- `assets/sprites/` and `assets/sprites-8x/`: exported sprite PNGs, plus `sprites.json` source data
- `assets/screenshots/`: reference captures of every scene (regenerate with the `?qa=` hook below)
- `PROMPT.md`: the original kickoff prompt

### QA hook

`index.html?qa=<target>` jumps straight to a scene for testing and screenshots:
maps (`bedroom`, `gym`, `office`, `botanist`, `beach`, `baths`, `aldi`, `park`, `home`) plus `drive`, `battle`, `wardrobe`, `lift`, `report`, `drinks`, `finale`, `credits`, `pet`, `fetch`.

Screenshots are captured headless: `chrome --headless=new --hide-scrollbars --window-size=760,1000 --screenshot=out.png --virtual-time-budget=7000 "http://localhost:8000/index.html?qa=beach"`.

## Releases

Tagged releases on GitHub include a zip that plays offline (unzip and open `index.html`). See [CHANGELOG.md](CHANGELOG.md).

## Credits

- Design, art, code and love: Paulo (with Claude Code)
- Starring Annette, Luca the goodest boy, Mum, and Joanne the Corolla
- Fonts: Pixelify Sans, Figtree, Fredoka (SIL OFL, embedded)
- All art is original pixel work
