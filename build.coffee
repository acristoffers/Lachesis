#!/usr/bin/env coffee
###
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
###

minify = require('html-minifier').minify
exec = require('child_process').execSync
fs = require 'fs-extra'
Finder = require 'fs-finder'

html_minifier_options =
    removeAttributeQuotes: true
    collapseBooleanAttributes: true
    collapseInlineTagWhitespace: true
    collapseWhitespace: true
    conservativeCollapse: true
    decodeEntities: true
    html5: true
    removeAttributeQuotes: true
    removeComments: true
    removeEmptyAttributes: true
    removeRedundantAttributes: true
    sortAttributes: true
    sortClassName: true
    useShortDoctype: true

keep_bower = process.argv.includes 'keep'

execute = (cmd) ->
    exec cmd, (error, stdout, stderr) ->
        null

coffee = () ->
    console.log 'Compiling CoffeeScript'
    cmd = 'coffee src/coffee/concat.coffee'
    execute cmd
    cmd = 'coffee -o mobile/www/js src/coffee/app.coffee'
    execute cmd
    fs.removeSync 'src/coffee/app.coffee'

sass = () ->
    console.log 'Compiling SASS'
    cmd = 'sass -t compressed src/scss/app.scss mobile/www/css/app.css'
    execute cmd

minify_html = () ->
    console.log 'Minifying HTML'
    html = fs.readFileSync 'src/html/index.htm', 'utf8'
    html = minify html, html_minifier_options
    fs.writeFileSync 'mobile/www/index.htm', html

uglify = () ->
    console.log 'Minifying JS'
    cmd = 'uglifyjs -cm -o mobile/www/js/app.js mobile/www/js/app.js'
    execute cmd

copy_files_to_desktop = () ->
    console.log 'Copying files around'
    fs.copySync 'mobile/www',  'desktop/www'
    fs.copySync 'src/desktop', 'desktop/www'

clean_bower = (pkg) ->
    predicate = (name) -> name.includes('.map') || !( name.includes('.min.') || name.includes('font') )
    contents = fs.readdirSync ['bower_components', pkg].join('/')
    contents = contents.filter (e) -> e != 'dist' && predicate(e)
    fs.removeSync ['bower_components/', pkg, e].join('/') for e in contents
    files = Finder.from('bower_components').findFiles().filter predicate
    fs.removeSync file for file in files

exists = (path) ->
    try
        fs.lstatSync path
        return true
    catch error
        return false

install_dependencies = () ->
    console.log 'Installing dependencies'
    components = ['material-design-lite', 'mdl-themes', 'jquery']
    for component in components
        unless exists ['bower_components', component.split('#')[0]].join '/'
            console.log '... installing ' + component
            cmd = 'bower install ' + component
            execute cmd
    packages = fs.readdirSync 'bower_components'
    clean_bower pkg.split('#')[0] for pkg in packages
    fs.copySync 'bower_components',  'mobile/www/deps'
    fs.removeSync 'bower_components' unless keep_bower

copy_assets = () ->
    fs.copySync 'src/imgs',  'mobile/www/imgs'
    fs.copySync 'src/fonts',  'mobile/www/fonts'

gen_desktop_icons = () ->
    # ImageMagick must be installed and it's "convert" utility needs to be in
    # path
    console.log 'Generating desktop icons'
    if process.platform == 'darwin'
        # Creates macOS ICNS icon file
        fs.mkdirsSync 'desktop/build/icon.iconset'
        input = 'desktop/www/imgs/icon.svg'
        sizes = [16, 32, 128, 256, 512]
        out1x = ([size, "icon_#{size}x#{size}.png"] for size in sizes)
        out2x = ([size * 2, "icon_#{size}x#{size}@2x.png"] for size in sizes)
        outputs = out1x.concat out2x
        input2 = 'desktop/www/imgs/icon.png'
        execute "convert -background none -resize 1024x1024 #{input} #{input2}"
        for [size, name] in outputs
            output = "desktop/build/icon.iconset/#{name}"
            execute "convert -resize #{size}x#{size} #{input2} #{output}"
        execute 'iconutil -c icns desktop/build/icon.iconset'
        fs.removeSync x for x in ['desktop/build/icon.iconset', input2]
    # Creates Windows ICO icon file
    sizes = [16, 24, 32, 48, 64, 128, 256].join ','
    output = 'desktop/build/icon.ico'
    opts = "-define icon:auto-resize=#{sizes} -compress zip"
    cmd = "convert #{input} #{opts} #{output}"
    execute cmd

install_desktop_node = ->
    execute 'npm --prefix desktop/www install desktop/www'

execute 'npm install'

# Removes all contents from mobile/www
console.log 'Cleaning up'
fs.emptyDirSync dir for dir in ['mobile/www', 'desktop/www', 'desktop/build',
                                'desktop/dist']

# Create directories
fs.mkdirsSync dir for dir in ['mobile/www/js', 'mobile/www/css']

# Compiles coffee-script files
coffee()

# Compiles SASS files
sass()

# Minify html
minify_html()

# Minify javascript
uglify()

# Install runtime dependencies
install_dependencies()

# Install assets
copy_assets()

# Copy compiled files to desktop folder
copy_files_to_desktop()

# Generate desktop icons
gen_desktop_icons()

# Install node dependencies of desktop version
install_desktop_node()

console.log ''
