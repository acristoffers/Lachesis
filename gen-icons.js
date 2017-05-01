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

const exec = require('child_process').execSync
const fs = require('fs-extra')
const _ = require('lodash')

function execute(cmd) {
  return exec(cmd, function (error, stdout, stderr) {
    return null
  })
}

gen_desktop_icons = function () {
  var cmd, i, input, input2, j, len, len1, name, opts, out1x, out2x, output, outputs, ref, ref1, size, sizes, x
  console.log('Generating desktop icons')
  input = 'desktop/www/imgs/icon.svg'
  if (process.platform === 'darwin') {
    fs.mkdirsSync('desktop/build/icon.iconset')
    sizes = [16, 32, 128, 256, 512]
    out1x = (function () {
      var i, len, results
      results = []
      for (i = 0, len = sizes.length; i < len; i++) {
        size = sizes[i]
        results.push([size, 'icon_' + size + 'x' + size + '.png'])
      }
      return results
    })()
    out2x = (function () {
      var i, len, results
      results = []
      for (i = 0, len = sizes.length; i < len; i++) {
        size = sizes[i]
        results.push([size * 2, 'icon_' + size + 'x' + size + '@2x.png'])
      }
      return results
    })()
    outputs = out1x.concat(out2x)
    input2 = 'desktop/www/imgs/icon.png'
    execute('convert -background none -resize 1024x1024 ' + input + ' ' + input2)
    for (i = 0, len = outputs.length; i < len; i++) {
      ref = outputs[i], size = ref[0], name = ref[1]
      output = 'desktop/build/icon.iconset/' + name
      execute('convert -resize ' + size + 'x' + size + ' ' + input2 + ' ' + output)
    }
    execute('iconutil -c icns desktop/build/icon.iconset')
    const rm = ['desktop/build/icon.iconset', input2]
    _.map(rm, fs.removeSync)
  }
  execute('convert -background none -resize 1024x1024 ' + input + ' ' + input2)
  output = 'desktop/build/icon.png'
  execute('convert -background none -resize 1024x1024 ' + input + ' ' + output)
  sizes = [16, 24, 32, 48, 64, 128, 256].join(',')
  output = 'desktop/build/icon.ico'
  opts = '-define icon:auto-resize=' + sizes + ' -compress zip'
  cmd = 'convert ' + input2 + ' ' + opts + ' ' + output
  execute(cmd)
}

gen_desktop_icons()