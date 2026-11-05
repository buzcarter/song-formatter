# Changelog

## 1.0.0-beta.1 (2026-11)

First beta, published under the npm `beta` tag. The UkeGeeks Songbook renders with this version.

- Renders the same as the old UkeGeeks Scriptasaurus library: parity tests run all the Songbook's
  sample songs through both and compare the results (#32, #33).
- `renderSong()` turns ChordPro text into HTML strings with no DOM, for Node and bundlers, with
  typed ESM and CommonJS entries. The browser bundle still puts the old API on `window.ukeGeeks` (#34).
- All output is HTML-escaped. `scriptasaurus.run(markup)` renders the given text (#33).
- No `@ts-ignore`, stricter TypeScript settings (#35).
- Node 24, TypeScript 5.9, ESLint 10, Jest 30 (#36).
- `dist/css/` has the song stylesheets on their own, for pages with their own layout.
- The demo site is deployed with GitHub Actions instead of the `gh-pages` branch.

## 0.0.3-alpha

Earlier alpha releases.
