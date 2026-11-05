/**
 * @jest-environment jsdom
 *
 * Parity: song-formatter must render the Songbook's songs the way the old UkeGeeks
 * library did. `expected/` was written by `generate-expected.cjs` from the old library;
 * this file runs song-formatter through the same steps and compares.
 *
 * Every song is run, in order, in ONE copy of the library (like a page that renders
 * several songs, or the editor re-rendering), so state leaking from one song into the
 * next shows up as a difference too.
 *
 * Differences that aren't fixed yet are listed in `known-gaps.json`; see README.md.
 */
const fs = require('fs');
const path = require('path');

const {
  CONFIGS, EXPECTED_DIR, collect, listSongs, mountSong, readSong, toDefinition,
} = require('./lib/dom.cjs');
const { readSvg } = require('./lib/svgReader.cjs');

const GAPS_FILE = path.join(__dirname, 'known-gaps.json');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

const alerts = [];
window.alert = (msg) => alerts.push(String(msg));

// importing the library sets `window.ukeGeeks`, as the browser bundle does
const ugs = require('../../src/js/index').default;

const songNames = listSongs();
const expectedFile = (name) => path.join(EXPECTED_DIR, 'songs', `${name.replace(/\.cpm\.txt$/, '')}.json`);

/** Same as the generator's `runOne`, but with song-formatter and its SVGs. */
function runOne(text, markup) {
  mountSong(document, markup === undefined ? text : '');
  alerts.length = 0;
  try {
    const song = markup === undefined ? ugs.scriptasaurus.run() : ugs.scriptasaurus.run(markup);
    return collect({ document, song, alerts, imageSelector: 'svg', readImage: readSvg });
  } catch (err) {
    return { error: err.stack };
  }
}

/**
 * The parts of a rendered song that are compared, each as its own test so a failure
 * says what broke.
 */
const ASPECTS = {
  song: (r) => r.song,
  alerts: (r) => r.alerts,
  referenceDiagrams: (r) => ({ diagrams: r.referenceDiagrams, ignoredChords: r.ignoredChords }),
  inlineDiagrams: (r) => ({ chords: r.inlineChords, images: r.inlineImages }),
  tabs: (r) => r.tabs,
  html: (r) => ({ bodyHtml: r.bodyHtml, wrapClasses: r.wrapClasses }),
};

/**
 * Every comparison, as [key, actual, expected]. Everything is rendered here, up front
 * and in the generator's order, before any test runs.
 */
function buildComparisons() {
  const comparisons = [];
  const actual = Object.fromEntries(songNames.map((name) => [name, { configs: {} }]));

  ugs.scriptasaurus.init(false);
  CONFIGS.forEach(({ id, tuning, inline }) => {
    ugs.settings.inlineDiagrams = inline;
    ugs.scriptasaurus.setTuningOffset(tuning);
    songNames.forEach((name) => {
      actual[name].configs[id] = runOne(readSong(name));
    });
  });

  // The editor's path: run(markup) with the song text, instead of reading the page
  ugs.settings.inlineDiagrams = false;
  ugs.scriptasaurus.setTuningOffset(0);
  songNames.forEach((name) => {
    actual[name].runMarkup = runOne(null, readSong(name));
  });

  songNames.forEach((name) => {
    const expected = readJson(expectedFile(name));
    const configs = [...CONFIGS.map(({ id }) => [id, actual[name].configs[id], expected.configs[id]]), ['runMarkup', actual[name].runMarkup, expected.runMarkup]];
    configs.forEach(([configId, act, exp]) => {
      Object.entries(ASPECTS).forEach(([aspect, pick]) => {
        comparisons.push([`${name}|${configId}|${aspect}`, act.error ? act : pick(act), pick(exp)]);
      });
    });
  });

  // The chord dictionary: every built-in chord in each tuning
  const { tunings } = readJson(path.join(EXPECTED_DIR, 'dictionary.json'));
  Object.entries(tunings).forEach(([tuning, expected]) => {
    ugs.definitions.replace([]);
    ugs.scriptasaurus.setTuningOffset(Number(tuning));
    const result = Object.fromEntries(Object.keys(expected).map((name) => [name, toDefinition(ugs.definitions.get(name))]));
    comparisons.push([`dictionary|${tuning}|definitions.get`, result, expected]);
  });

  // Transposing: every chord name, two octaves down and up
  const { steps, shift } = readJson(path.join(EXPECTED_DIR, 'transpose.json'));
  const names = Object.keys(shift);
  comparisons.push(['transpose|all|shift', Object.fromEntries(names.map((name) => [name, steps.map((s) => ugs.transpose.shift(name, s))])), shift]);
  comparisons.push(['transpose|all|shiftChords', steps.map((s) => ugs.transpose.shiftChords(names, s)), steps.map((s, i) => names.map((name) => shift[name][i]))]);

  return comparisons;
}

const isEqual = (a, b) => {
  try {
    expect(a).toEqual(b);
    return true;
  } catch (err) {
    return false;
  }
};

const comparisons = buildComparisons();

// `PARITY_WRITE_GAPS=1 npx jest test/parity` rewrites known-gaps.json from today's results
if (process.env.PARITY_WRITE_GAPS) {
  const gaps = comparisons
    .filter(([, act, exp]) => !isEqual(act, exp))
    .map(([key]) => key);
  fs.writeFileSync(GAPS_FILE, `${JSON.stringify(gaps, null, 2)}\n`);
}

const knownGaps = new Set(fs.existsSync(GAPS_FILE) ? readJson(GAPS_FILE) : []);

describe('parity with the old UkeGeeks library', () => {
  comparisons.forEach(([key, act, exp]) => {
    // A known gap runs as `test.failing`: it passes while the difference is still there
    // and fails once it's fixed, so the list has to shrink as fixes land.
    const run = knownGaps.has(key) ? test.failing : test;
    run(key, () => {
      expect(act).toEqual(exp);
    });
  });
});
