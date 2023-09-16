import { fileURLToPath } from 'url';
import { basename, dirname, extname, resolve } from 'path';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';

const RegExes = {
  BLANK_LINS: /\n\s*\n/gm,
  CMP_COMMENTS: /^#.*$/gm,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function convertCpmToDefinitionsJs() {
  // eslint-disable-next-line no-console
  console.info('begin prebuild task convertCpmToDefinitionsJs');

  let count = 0;
  const sourceDir = resolve(__dirname, '../src/cpm/');
  const outDir = resolve(__dirname, '../src/js/.built/');

  mkdirSync(outDir, { recursive: true });

  const fileList = readdirSync(sourceDir);
  fileList.forEach((fileName) => {
    const ext = extname(fileName);
    if (ext !== '.cpm') {
      return;
    }
    count++;
    const cpmFileName = basename(fileName, ext);
    // eslint-disable-next-line no-console
    console.info(`Converting ${cpmFileName}.cpm`);
    const contents = readFileSync(`${sourceDir}/${cpmFileName}.cpm`, { encoding: 'utf-8' });
    writeFileSync(`${outDir}/${cpmFileName}.js`, `
/**
 * ${cpmFileName}
 * Instrument Name, Tuning, and chord definitions (string names)
 */
export default \`${
  contents
    .replace(RegExes.CMP_COMMENTS, '')
    .replace(RegExes.BLANK_LINS, '\n')
}\`;
  `);
  });

  // eslint-disable-next-line no-console
  console.info(`convertCpmToDefinitionsJs complete. ${count} conversions`);
}

convertCpmToDefinitionsJs();
