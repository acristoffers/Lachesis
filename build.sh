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

# Remove old files
touch desktop/www desktop/build desktop/dist desktop/node_modules
rm -r desktop/www desktop/build desktop/dist desktop/node_modules
mkdir -p desktop/www/js desktop/www/css desktop/build

# Install build deps
echo ""
echo "Installing build dependencies"
echo ""
yarn install
yarn install -D
pushd src/typescript
yarn install
yarn install -D
popd
cp -r src/desktop/* desktop/www/
pushd desktop
yarn install
yarn install -D
pushd www
yarn install
yarn install -D
popd
popd

# Copy files
echo ""
echo "Building root and copying dependencies"
echo ""
pushd desktop/www
yarn run tsc
rm -r node_modules yarn.lock ../yarn.lock
yarn --prod
popd
rm -r desktop/www/index.ts desktop/www/tsconfig.json
cp -r src/imgs desktop/www/
cp -r src/fonts desktop/www/
touch src/typescript/dist
rm -r src/typescript/dist

bash build-fast.sh

# Generate icons
node gen-icons.js
