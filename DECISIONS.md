# Decisions (production upgrade pass, 2026-09-28)

Applying the "one-shot game build" checklist to Annette's Big Day. Each line: decision, why.

- Keep single self-contained `index.html`; no Vite/React/TS rewrite. The project's own rule (CLAUDE.md) is that the game stays one shareable file; the checklist's scaffold section targets a different codebase (scoop-stack/cc-yb) that does not exist here.
- No Capacitor/Android APK, keystore, or emulator pass. No Android toolchain in this environment and the game is a web gift, already installable-ish via browser; logged as roadmap.
- Skip `cc-brand`/`sticker-game`/`sticker-assets`/`film-sound` skills and `packs/` import pipeline. Those skills/packs are not installed here; art is hand-built pixel data inside index.html.
- Repo stays `piblop/annettes-big-day` (public) instead of creating `tcf-jw/<slug>` (private). The repo already exists, is published via GitHub Pages, and the account in use has no tcf-jw access.
- Preview = existing GitHub Pages site (https://piblop.github.io/annettes-big-day/). Option (a) from the checklist, already live.
- Settings panel added behind the old sound button: Sound FX, Music, Vibration, Reduced motion; persisted via guarded versioned localStorage. Music defaults OFF because background music was previously removed at Paulo's request; the toggle makes it opt-in without breaking that decision.
- Reduced motion defaults to the OS `prefers-reduced-motion` setting; tones down fireworks and Luca's big jumps/spins, keeps gentle bounces.
- Haptics = `navigator.vibrate` mapped from existing SFX events; silently no-ops where unsupported (iOS Safari).
- Save = checkpoint at every map load (stats, story flags, badges, secrets, hearts incl. collected-heart positions, outfit, radio). Title shows Continue when a save exists; finishing the day (credits) or the weekend clears it. Mid-minigame/battle state is not saved; resuming puts you at the start of the map you were on.
- QA hook = `?qa=<map|drive|finale|credits|pet|fetch>` URL param to jump to scenes for screenshots/testing; battles and menus exercised interactively instead of a full autoplay bot (no Playwright available: npm registry blocked by corporate certificate).
- CI = tiny GitHub Actions workflow validating the inline script parses and sprite rows are well-formed (16 chars). No headless browser test in CI to keep it dependency-free; a broken-parse gate catches the worst regressions.
- Trailer skipped: no ffmpeg/Playwright video capture available in this environment; store-style screenshots shipped instead; logged in ROADMAP.
- Release = tag v1.0.0 + GitHub release with web zip (index.html + assets) and screenshots. Web zip plays offline (unzip, open index.html).
