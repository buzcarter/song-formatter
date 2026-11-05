# Parity tests

These tests check that song-formatter renders songs the way the old UkeGeeks library
(Scriptasaurus, as shipped in the UkeGeeks Songbook) does, so the Songbook can switch
to song-formatter without anyone noticing.

## What's here

- `songs/`: the 16 example songs from the Songbook's `cpm/` folder.
- `expected/`: what the old library produced for them, written by `generate-expected.cjs`.
  Each file names the UkeGeeks version and commit it came from.
- `parity.test.js`: runs song-formatter the same way and compares.
- `snapshots.test.js`: Jest snapshots of song-formatter's own HTML and SVG, so any markup
  change shows up in review.
- `known-gaps.json`: differences that aren't fixed yet (see below).
- `lib/`: helpers shared by the generator and the tests.

## How it works

Both libraries run in [jsdom](https://github.com/jsdom/jsdom), a browser-like DOM for
Node. Each song is put on a copy of the Songbook's song page, escaped the way the
Songbook server escapes it, and then `ukeGeeks.scriptasaurus.run()` renders it.

jsdom can't draw on a `<canvas>`, so for the old library `lib/canvasRecorder.cjs`
records the drawing calls instead (`arc`, `lineTo`, `rect`, `fillText`...).
song-formatter draws SVG, which `lib/svgReader.cjs` reads back into the same shape. That
way a chord diagram or a tab staff can be compared dot by dot, line by line and label by
label, including position, size, colour and font.

Every song is rendered in six setups: soprano (GCEA), baritone (DGBE) and ADF#B tunings,
each with and without the inline mini-diagrams. It's also rendered once through
`run(markup)`, the way the Songbook's editor does it. For each of those, these parts are
compared as separate tests:

| Part | What's compared |
| --- | --- |
| `song` | The object `run()` returns: title, subtitle, artist, album, key, chords found, `{define}` chords |
| `alerts` | The "I don't know these chords" alert |
| `referenceDiagrams` | Each chord diagram drawn beside the song, and the "Also uses" list |
| `inlineDiagrams` | Which chords in the lyrics get a mini-diagram, and each mini-diagram |
| `tabs` | Each tablature staff |
| `html` | The song's HTML with the images taken out, and the classes on the song's wrapper |

There are also tests for the whole chord dictionary in each tuning
(`definitions.get()`) and for transposing every chord name up and down two octaves
(`transpose.shift()` and `shiftChords()`).

All the songs are rendered in one copy of the library, one after another. If one song
leaves something behind that changes the next one, that shows up as a difference.

What isn't compared: overlap fixing (`autoFixOverlaps`) and CSS, because they depend on
real layout that jsdom doesn't do.

## Known gaps

`known-gaps.json` lists the comparisons that still differ. Each one runs as a
`test.failing`: it passes while the difference is there, and fails as soon as it's
fixed. So when you fix something, the suite tells you which entries to take out. To
rewrite the list from the current results:

```sh
PARITY_WRITE_GAPS=1 npm run test:parity
```

The goal is an empty list.

## Common tasks

```sh
# run only these tests
npm run test:parity

# after an intended markup change, update the snapshots
npm run test:parity -- -u

# see exactly what song-formatter produced (same layout as expected/songs) to diff it
PARITY_DUMP=.tmp/actual npm run test:parity

# rebuild expected/ from the old library (needs a UkeGeeks checkout; default ../UkeGeeks)
npm run parity:generate -- /path/to/UkeGeeks
```
