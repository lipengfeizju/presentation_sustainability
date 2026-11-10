#!/bin/sh
# Builds the deck and force-pushes dist/ to the gh-pages branch of origin.
set -e
cd "$(dirname "$0")/.."
npm run build
touch dist/.nojekyll
REMOTE=$(git remote get-url origin)
REV=$(git rev-parse --short HEAD)
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -qm "Deploy $REV"
git push -f "$REMOTE" gh-pages
rm -rf .git
