#!/usr/bin/env sh

cd frontend/ndadrop

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cp -r dist/* ../../../NDA-2023.github.io/
cd ../../../NDA-2023.github.io/
cp index.html error.html

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git add -A
git commit -m "deploying"

git push

cd -