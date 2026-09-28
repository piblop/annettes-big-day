# Roadmap

Ideas that didn't make v1.0.0, roughly in order of appeal.

- **Trailer**: 20-30 s gameplay MP4 (needs ffmpeg or Playwright video; neither available in the build environment).
- **Installable PWA**: manifest + service worker for offline install on phones (kept out to preserve the single-file rule; would add two small files).
- **Full mid-scene save**: resume inside battles/mini-games rather than at the start of the current map.
- **Gamepad support**: map a controller to D-pad/A/B.
- **Android APK**: Capacitor wrapper with signing + release CI (needs an Android toolchain).
- **More weekend content**: brunch spot, farmers market, a second chess difficulty.
- **Photo mode**: capture a decorated frame of the current scene to share.
- **Sprite sheet regeneration tool**: script to re-export `assets/sprites*` from the in-game data (currently exported by hand).
