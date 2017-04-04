#!/usr/bin/env bash

# Copyright (c) 2016 Álan Crístoffer
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

cwd=$(pwd)

# Compile TypeScript
echo ""
echo "Compiling TypeScript"
echo ""
cd src/typescript
yarn run webpack
cd $cwd
mv src/typescript/dist/index.js desktop/www/js/app.js

# Compile SASS
echo ""
echo "Compiling SASS"
echo ""
yarn run node-sass --output-style compressed src/scss/app.scss desktop/www/css/app.css

# Minify HTML
node html-minifier.js

# Copy files
echo ""
echo "Building root and copying dependencies"
echo ""
cp -r src/imgs desktop/www/imgs
cp -r src/fonts desktop/www/fonts
cp -r src/typescript/dist desktop/www/css
touch src/typescript/dist
rm -r src/typescript/dist
