#!/usr/bin/env bash
set -o errexit

corepack enable
corepack prepare yarn@4.9.2 --activate

yarn install --immutable
yarn build
