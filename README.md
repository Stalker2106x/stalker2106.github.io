# Portfolio Website

This repository contains a static website holding my projects
It uses a template system, so dist folder has to be built using NodeJS.

## Build website

Create dist folder and pages by running

    npm run build
    or
    yarn build

## Upload to gh-pages

Since dist folder is in a subfolder and gh-pages requires pages to be at root,
we create a branch called "gh-pages" to host pages only.
We delete and recreate branch when we need to update the website using:

    git push origin --delete gh-pages
    git subtree push --prefix dist origin gh-pages