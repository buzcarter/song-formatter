const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const { author, description, homepage, license, name, version } = require('./package.json');
const preamble = `/**!
* @name ${name}
* @version ${version} (built ${new Date().toUTCString()})
* @description ${description}
* @author ${author}
* @license ${license}
* @link ${homepage}
* @copyright Copyright (C) 2012-2023 ${name}
*
* This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
*
* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/`;

module.exports = [{
  entry: {
    'song-formatter': './src/js/index.ts',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
      terserOptions: {
        format: {
          preamble,
        },
      },
    })],
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
}, {
  entry: {
    'song-formatter': [
      './src/css/index.css',
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {},
        },
        'css-loader',
        ],
        sideEffects: true,
      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {},
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
    }),
  ],
  devtool: 'source-map',
}];
