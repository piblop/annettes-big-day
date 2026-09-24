# Claude Code kickoff prompt

Open a terminal in this folder, run `claude`, and paste everything below the line.

---

You're helping me finish a birthday gift: a pixel-art RPG called "Annette's Big Day" for my girlfriend Annette. Read `CLAUDE.md` first. It explains the project, file layout, map legend and rules. The whole game lives in `index.html`. Sprites and reference screenshots are in `assets/`.

Work in the phases below. Stop at the end of each phase, summarise what you did in a few bullets, and wait for my go-ahead before starting the next one.

## Phase 1: Get oriented and running
1. Read `CLAUDE.md`, skim `index.html`, and look at `assets/sprite-sheet.png` and `assets/screenshots/`.
2. Initialise a git repo and make a first commit so we can roll back any change.
3. Serve the game locally and give me the URL.
4. Write a Playwright smoke test (`tests/playthrough.spec.js` or Python, your call) that plays title to credits using the game's own functions and fails on any console error. Run it and report the result.

## Phase 2: Personalise
Ask me for these one at a time, then update the `CONFIG` block:
1. My finale speech (replaces `[WRITE YOUR PERSONAL MESSAGE HERE]`)
2. Three inside jokes (gym-goer, coworker, beach shell)
3. What she'd actually order for dinner at The Botanist
4. Anything I want to change in the drinks list
Re-run the smoke test after.

## Phase 3: Polish (propose first, then build what I approve)
Give me a short list of ideas ranked by impact vs effort. Starting points:
- Walking animation frames for Annette and Luca (currently a bob)
- A side-view sprite for Annette when walking left and right
- Save progress to localStorage so a refresh doesn't restart the day
- A skip-dialogue button and a chapter select after first completion
- Screen shake and sparkle effects on PRs and battle hits
- Accessibility: a larger-text option and reduced-motion support
Keep the single-file setup and every rule in `CLAUDE.md`.

## Phase 4: Share it
Help me deploy it so she can open it from a text message:
1. Recommend the simplest free option (GitHub Pages or Netlify Drop) and walk me through it step by step.
2. Make sure it looks good as a link preview (title, description, a favicon using the heart sprite, and an Open Graph image built from `assets/screenshots/10-finale.png`).
3. Test on a mobile viewport before we call it done.

## Definition of done
- Plays title to credits on phone and desktop with no console errors
- All personal content filled in, no placeholders left
- Age never appears
- Live link works and I've tested it on my phone
