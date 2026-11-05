/**
 * Copies the song stylesheets into dist/css/ on their own, next to the combined
 * song-formatter.bundle.css (which also has a CSS reset and a demo page layout).
 *
 * Pages that bring their own layout, like the UkeGeeks Songbook, load just these:
 *   @ukegeeks/song-formatter/css/ukeGeeks.music.css       (screen and print)
 *   @ukegeeks/song-formatter/css/ukeGeeks.musicPrint.css  (print only; wrapped in @media print)
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'dist', 'css');

fs.mkdirSync(out, { recursive: true });
['ukeGeeks.music.css', 'ukeGeeks.musicPrint.css'].forEach((name) => {
  fs.copyFileSync(path.join(root, 'src', 'css', name), path.join(out, name));
});
