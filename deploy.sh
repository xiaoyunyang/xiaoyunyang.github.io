#!/bin/bash

echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

# Build the site to the public submodule
hugo # if using a theme, replace with `hugo -t <YOURTHEME>`

cd public

# Add changes to git.
git add .

# Make sure we're on the master branch before committing compiled site

git commit -m "$msg"

# Push source and build repos.
git push origin master

cd ..
