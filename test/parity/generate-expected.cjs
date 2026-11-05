#!/usr/bin/env node
/**
 * Writes the parity tests' expected results by running the OLD library, UkeGeeks'
 * `js/ukeGeeks.scriptasaurus.merged.js`, over every song in `songs/`.
 *
 * You only need this when the reference changes; the output in `expected/` is committed.
 *
 *   node test/parity/generate-expected.cjs [path/to/UkeGeeks]   (default: ../UkeGeeks)
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { JSDOM } = require('jsdom');

const { installCanvasRecorder } = require('./lib/canvasRecorder.cjs');
const {
  CONFIGS, EXPECTED_DIR, collect, listSongs, mountSong, readSong, toDefinition,
} = require('./lib/dom.cjs');

const ugsDir = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', '..', 'UkeGeeks'));
const LIBRARY = 'js/ukeGeeks.scriptasaurus.merged.js';
const libraryPath = path.join(ugsDir, LIBRARY);

/** Transposing is checked for every chord name over two octaves, down and up. */
const SHIFT_STEPS = Array.from({ length: 25 }, (_, i) => i - 12);

function describeSource() {
  const git = (...args) => execFileSync('git', ['-C', ugsDir, ...args], { encoding: 'utf8' }).trim();
  const { version } = JSON.parse(fs.readFileSync(path.join(ugsDir, 'package.json'), 'utf8'));
  return `UkeGeeks ${version} (${git('log', '-1', '--format=%h', '--', LIBRARY)}) ${LIBRARY}`;
}

function loadOldLibrary() {
  const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>', { runScripts: 'outside-only' });
  const readCanvas = installCanvasRecorder(window);
  const alerts = [];
  window.alert = (msg) => alerts.push(String(msg));
  window.eval(fs.readFileSync(libraryPath, 'utf8'));
  return { window, readCanvas, alerts, ugs: window.ukeGeeks };
}

/** Like `JSON.stringify(data, null, 1)`, but anything that fits on one short line stays on one line. */
function stringify(data, indent = '') {
  const flat = JSON.stringify(data);
  if (flat.length <= 120 || data === null || typeof data !== 'object') {
    return flat;
  }
  const inner = `${indent} `;
  if (Array.isArray(data)) {
    return `[\n${data.map((item) => inner + stringify(item, inner)).join(',\n')}\n${indent}]`;
  }
  const entries = Object.entries(data).map(([key, value]) => `${inner}${JSON.stringify(key)}: ${stringify(value, inner)}`);
  return `{\n${entries.join(',\n')}\n${indent}}`;
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${stringify(data)}\n`);
}

function main() {
  const source = describeSource();
  const { window, readCanvas, alerts, ugs } = loadOldLibrary();
  const { document } = window;
  const songNames = listSongs();
  const results = Object.fromEntries(songNames.map((name) => [name, { source, configs: {} }]));

  const runOne = (text, markup) => {
    mountSong(document, markup === undefined ? text : '');
    alerts.length = 0;
    const song = markup === undefined ? ugs.scriptasaurus.run() : ugs.scriptasaurus.run(markup);
    return collect({ document, song, alerts, imageSelector: 'canvas', readImage: readCanvas });
  };

  ugs.scriptasaurus.init(false);
  CONFIGS.forEach(({ id, tuning, inline }) => {
    ugs.settings.inlineDiagrams = inline;
    ugs.scriptasaurus.setTuningOffset(tuning);
    songNames.forEach((name) => {
      results[name].configs[id] = runOne(readSong(name));
    });
  });

  // The editor's path: run(markup) with the song text, instead of reading the page
  ugs.settings.inlineDiagrams = false;
  ugs.scriptasaurus.setTuningOffset(0);
  songNames.forEach((name) => {
    results[name].runMarkup = runOne(null, readSong(name));
  });

  songNames.forEach((name) => {
    writeJson(path.join(EXPECTED_DIR, 'songs', `${name.replace(/\.cpm\.txt$/, '')}.json`), results[name]);
  });

  // The chord dictionary: every built-in chord (plus its sharp/flat spelling) in each tuning
  ugs.definitions.replace([]);
  ugs.scriptasaurus.setTuningOffset(0);
  const builtIn = ugs.definitions.getChords().map((c) => c.name);
  const aliases = { Bb: 'A#', 'C#': 'Db', Eb: 'D#', 'F#': 'Gb', 'G#': 'Ab' };
  const dictionaryNames = builtIn.reduce((acc, name) => {
    const alias = aliases[name.substr(0, 2)];
    return alias ? [...acc, name, alias + name.substr(2)] : [...acc, name];
  }, []);
  const dictionary = { source, tunings: {} };
  [0, 5, -2].forEach((tuning) => {
    ugs.scriptasaurus.setTuningOffset(tuning);
    dictionary.tunings[tuning] = Object.fromEntries(dictionaryNames.map((name) => [name, toDefinition(ugs.definitions.get(name))]));
  });
  writeJson(path.join(EXPECTED_DIR, 'dictionary.json'), dictionary);

  // Transposing: every chord name found in the songs or the dictionary
  const songChords = Object.values(results).flatMap((r) => r.configs.soprano.song.chords);
  const allNames = [...new Set([...dictionaryNames, ...songChords])].sort();
  writeJson(path.join(EXPECTED_DIR, 'transpose.json'), {
    source,
    steps: SHIFT_STEPS,
    shift: Object.fromEntries(allNames.map((name) => [name, SHIFT_STEPS.map((s) => ugs.transpose.shift(name, s))])),
  });

  // eslint-disable-next-line no-console
  console.log(`Wrote expected results for ${songNames.length} songs, ${dictionaryNames.length} dictionary chords, ${allNames.length} transposed names from ${source}`);
}

main();
