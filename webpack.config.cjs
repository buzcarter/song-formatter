const path = require('path');

module.exports = {
  entry: {
    'song-formatter': './src/js/index.ts',
  },
  output: {
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
    }, {
      test: /\.css$/,
      use: [
        'css-loader',
      ],
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
