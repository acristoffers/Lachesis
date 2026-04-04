#!/usr/bin/env node

'use strict';

const { cpSync, mkdirSync, rmSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const www = path.join(__dirname, 'www');
const build = path.join(__dirname, 'build');

// Clean and recreate staging directory
rmSync(www, { recursive: true, force: true });
mkdirSync(www, { recursive: true });

// Stage the compiled Electron main-process files
const mainSrc = path.join(root, 'src', 'desktop');
cpSync(path.join(mainSrc, 'dist', 'index.js'), path.join(www, 'index.js'));
cpSync(path.join(mainSrc, 'package.json'), path.join(www, 'package.json'));
cpSync(path.join(mainSrc, 'package-lock.json'), path.join(www, 'package-lock.json'));

// Install production-only dependencies for the main process
execSync('npm install --omit=dev', { cwd: www, stdio: 'inherit' });

// Stage the Angular renderer app
cpSync(
  path.join(root, 'Lachesis', 'dist', 'Lachesis'),
  path.join(www, 'Lachesis'),
  { recursive: true },
);

// Stage icons for electron-builder
mkdirSync(build, { recursive: true });
cpSync(path.join(root, 'src', 'icons'), build, { recursive: true });

console.log('Staging complete.');
