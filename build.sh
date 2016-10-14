#!/usr/bin/env bash

npm run build -- keep

cd desktop
export CSC_IDENTITY_AUTO_DISCOVERY=false
npm run dist
