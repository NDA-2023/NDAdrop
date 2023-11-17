#!/usr/bin/env sh

if [ $# -eq 0 ]; then
    cd frontend/ndadrop

    # abort on errors
    set -e

    # build
    echo "========== building frontend =========="
    npm run build

    # navigate into the build output directory
    echo "========== putting frontend in frontend repo =========="
    cp -r dist/* ../../../NDA-2023.github.io/
    cd ../../../NDA-2023.github.io/
    cp index.html error.html

    # if you are deploying to a custom domain
    # echo 'www.example.com' > CNAME

    echo "========== pushing to frontend repo =========="
    git add -A
    git commit -m "deploying"

    git push

    cd -
    cd ../../
else
    echo "Argument provided: $1"
    echo "only deploying backend"
fi

echo "========== putting backend in backend repo =========="
#cp -f backend/server.js ../NDAdrop-websocket-server/server.js
cd ../NDAdrop-websocket-server/

echo "========== pushing to backend repo =========="
git add -A
git commit -m "deploying"

platform push -f

cd -