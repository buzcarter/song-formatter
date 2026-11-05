# UkeGeeks Song Formatter

[![Publish Demo Site](https://github.com/buzcarter/song-formatter/actions/workflows/publishDemo.yml/badge.svg)](https://github.com/buzcarter/song-formatter/actions/workflows/publishDemo.yml)

Convert ChordPro marked-up text to HTML, complete with chord fingering diagrams.

**Important:** *This is early stages of updating the UkeGeek's Scriptasaurus Song Editor, as such,
this is an alpha test release: the final API is likely to change greatly.*

##### Status Update

> *Currently converting dozens of manual tests to automated tests and adding support for other stringed instrument support (yup, finally guitars, not just ukuleles). On track to have full 1.0 release October 2023.*

##### Songsheets Perfect For Clubs 

![Typical Layout](docs/images/ukulele-music-editor-grass-shack-sample.png)

## Installation

With Node Package Manager (npm)

```
npm install @ukegeeks/song-formatter
```

## Features

| **Fingering Diagrams**                                                      | **Mini-Diagrams**                                                          |
|-----------------------------------------------------------------------------|----------------------------------------------------------------------------|
| ![Chord Fingering Diagrams](docs/images/chord-diagrams.png)                 | ![Mini-Diagrams Above Lyrics](docs/images/chords-above-lyrics.png)         |
| Easy to read chord diagrams with over 180 optimized fingerings pre-defined. | Mix mini-chord fingering diagrams above lyrics for quick reading.          |

| **Tablature**                                                               | **Easy Markup**                                                            |
|-----------------------------------------------------------------------------|----------------------------------------------------------------------------|
| ![Tablature](docs/images/tablature.png)                                     | ![Easy Markup using ChordPro Syntax](docs/images/cpm-song-text.png)        |
| Easy on the eyes tabs for solo uke.                                         | Leverages intuitive ChordPro Markup, converts plain text on-the-fly.       |

| **Define Your Own Chords**                                                  | **Print Power**                                                            |
|-----------------------------------------------------------------------------|----------------------------------------------------------------------------|
| ![Define your own custom chords](docs/images/custom-chords.png)             | ![Control how your songs print](docs/images/song-chord-diagrams-above.png) |
| Include alternative voicings, power-chords, or any chord shape you like.    | Control how your songs print with multiple columns.                        |

* Add your own custom chords and fingerings
* Specify diagram colors & sizes
* Choose whether to include diagrams to the side or above the lyrics
* Multiple songs per page
* Transposing

### Mix Tablature, Lyrics, & Fingering Diagrams

![Typical Layout](docs/images/ukulele-tablature-editor-example.png)


## Usage

### In Node, or with a bundler

`renderSong()` turns ChordPro text into HTML strings, with SVG chord diagrams. It needs no
browser, so it works on a server too.

```js
import { renderSong } from '@ukegeeks/song-formatter';

const { song, html, metaHtml, diagramsHtml, unknownChords } = renderSong(chordProText);
// song.title, song.key, song.chordNames ...
// html:         the lyrics with chords, comments and tabs
// metaHtml:     title, subtitle, artist, album
// diagramsHtml: the chord diagrams
```

The text is treated as plain text and HTML-escaped first, so it can't add tags of its own.
Pass `{ isHtml: true }` if it's already HTML, or `{ inlineDiagrams: true }` for
mini-diagrams above the lyrics. Add the stylesheet, `@ukegeeks/song-formatter/css`, to the
page that shows the result.

CommonJS works too: `const { renderSong } = require('@ukegeeks/song-formatter');`.
TypeScript types are included.

Other tuning: `definitions.useInstrument(InstrumentTunings.baritoneUke)` (DGBE) or
`InstrumentTunings.alternateUke` (ADF#B). The parser (`parseCPM`), the SVG drawing
(`generateChordSvg`, `generateTabSvg`) and transposing (`shift`, `shiftChords`) are exported
as well.

### In a web page

`dist/song-formatter.bundle.js` (also `@ukegeeks/song-formatter/browser`) puts the same API
as the old UkeGeeks library on `window.ukeGeeks`:

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

## Demo/Test

##### Coming Soon
