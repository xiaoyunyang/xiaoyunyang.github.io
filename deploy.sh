#!/bin/bash

echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

# Build the project.
hugo # if using a theme, replace with `hugo -t <YOURTHEME>`

msg="rebuilding site `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi

# Commit to the sourcecode branch
rm -f .git/index.lock
git checkout sourcecode
git add .
git commit -m "$msg"
git push origin sourcecode

# Commit to the master branch
cd public

# If REAME.md is at the base of the folder,
# then it will get displayed instead of your actual website
rm README.md

git checkout master
# Add changes to git.
git add .
git commit -m "$msg"

# Push source and build repos.
git push origin master

# Come Back up to the Project Root
cd ..
