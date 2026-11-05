/**
 * Runs after dts-bundle-generator has written dist/song-formatter.d.ts:
 * - adds `/// <reference lib="dom" />`, because the `ukeGeeks` object's browser methods
 *   mention DOM types (HTMLElement...), and a Node project may not include the DOM lib;
 * - copies it to song-formatter.d.cts, the types for `require()` (CommonJS) users. The
 *   package is "type": "module", so TypeScript reads a plain .d.ts here as ES module types.
 */
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const file = path.join(dist, 'song-formatter.d.ts');
const types = `/// <reference lib="dom" />\n${fs.readFileSync(file, 'utf8')}`;

fs.writeFileSync(file, types);
fs.writeFileSync(path.join(dist, 'song-formatter.d.cts'), types);
