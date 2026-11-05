/**
 * Builds the demo site that GitHub Pages publishes (see .github/workflows/publishDemo.yml):
 * demo/index.html plus the browser bundle, all in one folder, `.site/`.
 *
 * In the repo the demo loads the bundle from `../dist/`; on the site they sit side by side.
 * (The workflow used to publish only `dist/`, which has no page, so the site was a 404.)
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const site = path.join(root, '.site');
const dist = path.join(root, 'dist');

fs.rmSync(site, { recursive: true, force: true });
fs.mkdirSync(site);

const html = fs.readFileSync(path.join(root, 'demo', 'index.html'), 'utf8').replace(/\.\.\/dist\//g, './');
fs.writeFileSync(path.join(site, 'index.html'), html);
fs.copyFileSync(path.join(root, 'demo', 'favicon.png'), path.join(site, 'favicon.png'));

fs.readdirSync(dist)
  .filter((name) => name.startsWith('song-formatter.bundle.'))
  .forEach((name) => fs.copyFileSync(path.join(dist, name), path.join(site, name)));

// eslint-disable-next-line no-console
console.log(`Demo site written to ${path.relative(root, site)}/`);
