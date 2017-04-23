#!/usr/bin/env node

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

const fs = require('fs')
const _ = require('lodash')
const rimraf = require('rimraf')
const spawn = require('child_process').spawn
const mkdirp = require('mkdirp')
const ncp = require('ncp').ncp
const path = require('path')
const Observable = require('rxjs/Observable').Observable
require('rxjs/add/observable/bindNodeCallback')
require('rxjs/add/observable/zip')
require('rxjs/add/operator/mergeMap')
require('rxjs/add/operator/finally')

const omkdirp = Observable.bindNodeCallback(mkdirp)
const oncp = Observable.bindNodeCallback(ncp)
const orimraf = Observable.bindNodeCallback(rimraf)
const orm = Observable.bindNodeCallback(fs.unlink)
const omv = Observable.bindNodeCallback(fs.rename)

function ospawn(cmd, args = [], options = {}) {
  return Observable.create((observer) => {
    options = _.merge({
      shell: true
    }, options)
    const p = spawn(cmd, args, options)

    p.stdout.on('data', function (data) {
      console.log(data.toString())
    })

    p.on('exit', function (code) {
      observer.next(null)
      observer.complete()
    })
  })
}

let ds = ['desktop/www', 'desktop/build', 'desktop/dist', 'desktop/node_modules']

ds = _.map(ds, (dir) => {
  return fs.existsSync(dir) ? orimraf(dir) : null
})

ds = _.filter(ds, (d) => !!d)

Observable.zip.apply(null, ds).finally(() => {
  omkdirp('desktop/www/js')
    .flatMap(() => {
      return omkdirp('desktop/www/css')
    }).flatMap(() => {
      return omkdirp('desktop/build')
    }).flatMap(() => {
      return oncp('src/desktop', 'desktop/www')
    }).flatMap(() => {
      const yarnDirectories = ['src/typescript', 'desktop', 'desktop/www']
      const oyarn = _.map(yarnDirectories, (dir) => {
        return ospawn('yarn', [], {
          cwd: path.join(__dirname, dir)
        })
      })
      return Observable.zip.apply(null, oyarn)
    }).flatMap(() => {
      return ospawn('yarn', ['run', 'tsc'], {
        cwd: path.join(__dirname, 'desktop/www')
      })
    }).flatMap(() => {
      return orimraf('desktop/www/node_modules')
    }).flatMap(() => {
      return ospawn('yarn', ['--prod'], {
        cwd: path.join(__dirname, 'desktop/www')
      })
    }).flatMap(() => {
      const fis = ['desktop/www/yarn.lock', 'desktop/yarn.lock', 'desktop/www/index.ts', 'desktop/www/tsconfig.json']
      let ofs = _.map(fis, f => fs.existsSync(f) ? orm(f) : null)
      ofs = _.filter(ofs, f => !!f)
      return Observable.zip.apply(null, ofs)
    }).flatMap(() => {
      return oncp('src/imgs', 'desktop/www/imgs')
    }).flatMap(() => {
      return oncp('src/fonts', 'desktop/www/fonts')
    }).flatMap(() => {
      return ospawn('yarn', ['run',
        'node-sass',
        '--', 'src/scss/app.scss',
        'desktop/www/css/app.css',
        '--output-style',
        'compressed'
      ])
    }).flatMap(() => {
      return ospawn('node', ['html-minifier.js'])
    }).flatMap(() => {
      return ospawn('node', ['gen-icons.js'])
    }).flatMap(() => {
      return ospawn('yarn', ['run', 'ngc'], {
        cwd: path.join(__dirname, 'src/typescript')
      })
    }).flatMap(() => {
      return ospawn('yarn', ['run', 'webpack'], {
        cwd: path.join(__dirname, 'src/typescript')
      })
    }).flatMap(() => {
      return omv('src/typescript/dist/index.js', 'desktop/www/js/app.js')
    }).subscribe()
}).subscribe()