const path = require('path');

const shared = {
  module: {
    noParse: /vendor/,
    rules: [{
      exclude: [
        /node_modules/,
        /vendor/,
      ],
      test: /\.tsx?$/,
      use: {
        loader: 'ts-loader',
        // Hand webpack ES modules (tsconfig says CommonJS, for Jest and Node). Webpack needs
        // `import`/`export` to build the .mjs file's exports, and to drop unused code.
        options: { compilerOptions: { module: 'es2020' } },
      },
    }],
  },
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
      '.js',
    ],
  },
  devtool: 'source-map',
};

const dist = path.resolve(__dirname, 'dist');

module.exports = [{
  // Browser: <script src="song-formatter.bundle.js"> sets window.ukeGeeks
  ...shared,
  name: 'browser',
  entry: { 'song-formatter': './src/js/browser.ts' },
  output: {
    filename: '[name].bundle.js',
    path: dist,
  },
}, {
  // Node & bundlers, ES module: import { renderSong } from '@ukegeeks/song-formatter'
  ...shared,
  name: 'esm',
  target: 'es2020',
  entry: { 'song-formatter': './src/js/index.ts' },
  experiments: { outputModule: true },
  output: {
    filename: '[name].mjs',
    path: dist,
    chunkFormat: 'module',
    library: { type: 'module' },
  },
}, {
  // Node, CommonJS: const { renderSong } = require('@ukegeeks/song-formatter')
  ...shared,
  name: 'cjs',
  target: 'es2020',
  entry: { 'song-formatter': './src/js/index.ts' },
  output: {
    filename: '[name].cjs',
    path: dist,
    chunkFormat: 'commonjs',
    library: { type: 'commonjs2' },
  },
}];
