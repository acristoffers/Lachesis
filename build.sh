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
mkdir -p desktop/www desktop/build
cp -r src/desktop/* desktop/www/

# Install build deps
echo ""
echo "Installing build dependencies"
echo ""

yarn install
yarn install --cwd Lachesis
yarn install --cwd desktop
yarn install --cwd desktop/www

# Copy files
echo ""
echo "Building root and copying dependencies"
echo ""
pushd desktop/www || exit
node_modules/.bin/tsc
rm -r node_modules index.ts tsconfig.json
yarn install --omit=dev
popd || exit

if [ -z "$1" ]; then
    bash build-fast.sh
else
    bash build-fast.sh "$1"
fi

# Copy icons
cp -r src/icons/* desktop/build/
