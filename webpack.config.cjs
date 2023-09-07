const path = require('path');

module.exports = {
  entry: {
    'song-formatter': './src/js/index.ts',
  },
  output: {
    clean: true,
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    noParse: /vendor/,
    rules: [{
      exclude: [
        /node_modules/,
        /vendor/,
      ],
      test: /\.tsx?$/,
      use: 'ts-loader',
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
