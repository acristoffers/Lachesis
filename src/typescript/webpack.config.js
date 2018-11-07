/*
Copyright (c) 2016 Álan Crístoffer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

const webpack = require('webpack')
const path = require('path')
const ClosureCompilerPlugin = require('webpack-closure-compiler')
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin

module.exports = {
  mode: 'production',
  entry: {
    index: './main.ts'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.html'],
    alias: {
      jquery: 'jquery/src/jquery'
    }
  },
  externals: {
    "electron-settings": "commonjs electron-settings",
    "electron": "commonjs electron"
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new AngularCompilerPlugin({
      tsConfigPath: 'tsconfig.json',
      entryModule: 'app.module#AppModule'
    }),
    new ClosureCompilerPlugin({
      compiler: {
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT5_STRICT',
        compilation_level: 'SIMPLE_OPTIMIZATIONS'
      },
      concurrency: 8
    })
  ],
  module: {
    rules: [{
      test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
      use: '@ngtools/webpack'
    }, {
      test: /\.html?$/,
      use: 'html-loader?minimize=false'
    }, {
      test: /\.(css|scss)$/,
      use: ['to-string-loader', 'css-loader', 'postcss-loader']
    }, {
      test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
      use: 'file-loader?name=assets/[name].[hash].[ext]'
    }]
  }
}