# UkeGeeks Song Formatter

[![npm](https://img.shields.io/npm/v/@ukegeeks/song-formatter)](https://www.npmjs.com/package/@ukegeeks/song-formatter)
[![Publish Demo Site](https://github.com/buzcarter/song-formatter/actions/workflows/publishDemo.yml/badge.svg)](https://github.com/buzcarter/song-formatter/actions/workflows/publishDemo.yml)

**Ukulele songsheets with chord diagrams, on your own website.** Song Formatter turns ChordPro text into clean HTML with SVG chord fingering diagrams and tablature, in the browser or in Node.

Want a whole songbook for your club instead (song list, editor, printing)? Use the [UkeGeeks Songbook](https://github.com/buzcarter/UkeGeeks), which is built on this library.

**Try it:** [live demo](https://buzcarter.github.io/song-formatter/)

![A formatted song: chord diagrams beside the lyrics, chord names above them](docs/images/ukulele-music-editor-grass-shack-sample.png)

**Status: 1.0.0 beta.** Song Formatter is the successor to the UkeGeeks Scriptasaurus library and renders the same songs the same way (its parity tests check this against the old library). The API may still change before 1.0.0.

## Install

```bash
npm install @ukegeeks/song-formatter
```

Or load it straight from a CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ukegeeks/song-formatter@1.0.0-beta.1/dist/song-formatter.bundle.css" />
<script src="https://cdn.jsdelivr.net/npm/@ukegeeks/song-formatter@1.0.0-beta.1/dist/song-formatter.bundle.js"></script>
```

## Usage

### In a web page

`dist/song-formatter.bundle.js` (also `@ukegeeks/song-formatter/browser`) puts the same API as the old UkeGeeks library on `window.ukeGeeks`:

```html
<link rel="stylesheet" href="song-formatter.bundle.css" />
<div id="ukeSongContainer">
  <aside id="ukeChordsCanvas"></aside>
  <article id="ukeSongText"><pre>{title: My Song}
[C]Hello [G7]there</pre></article>
</div>
<script src="song-formatter.bundle.js"></script>
<script>
  ukeGeeks.scriptasaurus.init();
  ukeGeeks.scriptasaurus.run();          // render the song on the page
  // ukeGeeks.scriptasaurus.run(text);   // or render this text instead (an editor, say)
</script>
```

`song-formatter.bundle.css` also has a CSS reset and a simple page layout. A page with its own layout can load just the song styles instead: `dist/css/ukeGeeks.music.css`, plus `dist/css/ukeGeeks.musicPrint.css` for printing (also `@ukegeeks/song-formatter/css/…`).

### In Node, or with a bundler

`renderSong()` turns ChordPro text into HTML strings, with SVG chord diagrams. It needs no browser, so it works on a server too.

```js
import { renderSong } from '@ukegeeks/song-formatter';

const { song, html, metaHtml, diagramsHtml, unknownChords } = renderSong(chordProText);
// song.title, song.key, song.chordNames ...
// html:         the lyrics with chords, comments and tabs
// metaHtml:     title, subtitle, artist, album
// diagramsHtml: the chord diagrams
```

- The text is treated as plain text and HTML-escaped first, so it can't add tags of its own. Pass `{ isHtml: true }` if it's already HTML.
- Pass `{ inlineDiagrams: true }` for mini-diagrams above the lyrics.
- Add the stylesheet, `@ukegeeks/song-formatter/css`, to the page that shows the result.
- CommonJS works too: `const { renderSong } = require('@ukegeeks/song-formatter');`. TypeScript types are included.
- Other tunings: `definitions.useInstrument(InstrumentTunings.baritoneUke)` (DGBE) or `InstrumentTunings.alternateUke` (ADF#B).
- The parser (`parseCPM`), the SVG drawing (`generateChordSvg`, `generateTabSvg`) and transposing (`shift`, `shiftChords`) are exported as well.

For the ChordPro markup itself, see the [ChordPro Markup Reference](https://ukegeeks.org/blog/users-guide/chordpro-markup-reference/) in the UkeGeeks User's Guide.

## Features

| **Fingering diagrams** | **Mini-diagrams** |
|---|---|
| ![Chord fingering diagrams](docs/images/chord-diagrams.png) | ![Mini-diagrams above lyrics](docs/images/chords-above-lyrics.png) |
| Easy-to-read chord diagrams, with over 180 optimized fingerings predefined. | Mini chord diagrams above the lyrics, for quick reading. |

| **Tablature** | **Easy markup** |
|---|---|
| ![Tablature](docs/images/tablature.png) | ![Easy markup using ChordPro syntax](docs/images/cpm-song-text.png) |
| Easy-on-the-eyes tabs for solo uke. | Intuitive ChordPro markup; plain text is converted on the fly. |

| **Define your own chords** | **Print power** |
|---|---|
| ![Define your own custom chords](docs/images/custom-chords.png) | ![Control how your songs print](docs/images/song-chord-diagrams-above.png) |
| Alternative voicings, power chords, or any chord shape you like. | Control how your songs print, with multiple columns. |

Also:

- Diagram colors and sizes you choose.
- Diagrams beside the lyrics or above them.
- Multiple songs per page.
- Transposing.
- Tablature, lyrics and fingering diagrams mixed in one song:

![Tablature, lyrics and chord diagrams in one song](docs/images/ukulele-tablature-editor-example.png)

## Development

Node 24 (see `.nvmrc`).

```bash
npm install
```

```bash
npm run build
```

Then open `demo/index.html`. Other scripts:

- `npm test`: unit tests (`npm run test:parity` for just the parity tests against the old library).
- `npm run lint` and `npm run typecheck`.
- `npm start`: rebuild on change.

Pull requests run lint, type-check, tests and build (`.github/workflows/runTests.yml`). The [demo site](https://buzcarter.github.io/song-formatter/) is published from `master` by `.github/workflows/publishDemo.yml`.

See the [Changelog](CHANGELOG.md) for what's in each release.

## Part of the UkeGeeks family

- **[ukegeeks.org](https://ukegeeks.org)**: edit a song online, the User's Guide, and the blog.
- **[UkeGeeks Songbook](https://github.com/buzcarter/UkeGeeks)**: your own songbook app, run with Node.js or PHP.
- **[Song Formatter](https://github.com/buzcarter/song-formatter)** (this repo): chord diagrams and songsheets on your own website.
- **[ACE ChordPro Extension](https://github.com/buzcarter/ace-chordpro-extension)**: ChordPro editing for the Ace code editor.

Not sure which one you need? See [which UkeGeeks tool is right for you](https://ukegeeks.org/projects/).

## License

[GPL-3.0-or-later](https://www.gnu.org/licenses/gpl-3.0.html). By [Buz Carter](https://ukegeeks.org) (buz@ukegeeks.org).
