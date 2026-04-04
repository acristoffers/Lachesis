#!/usr/bin/env node

'use strict';

const { execSync, execFileSync } = require('child_process');
const os = require('os');

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', cwd: __dirname });
}

function hasCommand(name) {
  try {
    execFileSync('which', [name], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

if (os.platform() === 'darwin') {
  run('npx electron-builder --publish always --mac --x64 --arm64');
} else {
  run('umask 000 && npx electron-builder --publish always --linux --x64');

  if (hasCommand('wine')) {
    run('npx electron-builder --publish always --win --x64 --ia32');
  } else {
    console.log('wine not found — skipping Windows release');
  }
}
