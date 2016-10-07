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

clean_bower = (pkg) ->
    contents = fs.readdirSync ['bower_components', pkg].join('/')
    contents = contents.filter (e) -> e != 'dist'
    fs.removeSync ['bower_components/', pkg, e].join('/') for e in contents
    predicate = (name) -> name.includes('.map') || !( name.includes('.min.') || name.includes('font') )
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
    # bootstrap-material-design brings jquery and bootstrap
    components = ['bootstrap-material-design#0.5.10']
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

# Removes all contents from mobile/www
console.log 'Cleaning up'
fs.emptyDirSync dir for dir in ['mobile/www', 'desktop/www']

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

console.log ''
