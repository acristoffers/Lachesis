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

pkg="yarn"

if [ "$1" = "npm" ]; then
    pkg="npm"
fi

# Remove old files
touch desktop/www desktop/build desktop/dist desktop/node_modules
rm -r desktop/www desktop/build desktop/dist desktop/node_modules
mkdir -p desktop/www desktop/build

# Install build deps
echo ""
echo "Installing build dependencies"
echo ""
$pkg install
pushd Lachesis
$pkg install
popd
cp -r src/desktop/* desktop/www/
pushd desktop
$pkg install
pushd www
$pkg install
popd
popd

# Copy files
echo ""
echo "Building root and copying dependencies"
echo ""
pushd desktop/www
node_modules/.bin/tsc
rm -r node_modules yarn.lock package-lock.json ../yarn.lock \
      ../package-lock.json index.ts tsconfig.json
$pkg install --production
popd

bash build-fast.sh $pkg "$2"

# Generate icons
node gen-icons.js
