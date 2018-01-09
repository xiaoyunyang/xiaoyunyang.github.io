# Github / Git Tutorial

#### This is a tutorial for Unix and Git newbies.

### Assume: 
* userA, userB, and userC all setup their computers with a Github account.

### Suppose: 
* userA wants to create an original repo called `ProjectName`.
* userB wants to fork the `ProjectName` repo from usernameB.
* userC wants to fork the `ProjectName` repo from userB.

## Git Tutorial For userA
Go to https://<span></span>github.com/`userA`/ and click the "New" button. Name the new repo `ProjectName`.

On your computer, in Finder, make a new folder called `ProjectName`. Copy all the files you want to the `ProjectName` folder.

In the Terminal, do the following:

1. Type `cd` into the terminal then drag the `ProjectName` folder  into the terminal. You’ll see `directoryPath` being auto-completed in Terminal.

	$`cd directoryPath` 

3. Initialize the `ProjectName` folder as a git repo. This essentially makes this folder a "local git repo".

	$`git init`

4. Link your "local git repo" to a "remote git repo" that you own. Call this remote git repo `origin`.

	$`git remote add origin ssh://git@github.com/userA/ProjectName.git`

5. Make sure `origin` is an available remote.

	$`git remote`

5. Sync your local repo to your remote repo.

	```
	$ git fetch origin
	$ git add --all
	$ git commit -m ‘Initial Commit!'
	$ git push origin master
	```

7. Now open a file within `ProjectName` in [Atom](https://atom.io/) or another text editor. Make some changes to the code. To sync your local repo with your remote repo, do this:
	
	```
	$ git fetch origin
	$ git add --all
	$ git commit -m ‘I made some changes!'
	$ git push origin master
	```

6. After you accept a pull request from userB, your remote repo is updated. Now you want to sync your local repo with your remote repo:

	$`git pull origin master`
	

<br>

## Git Tutorial For userC
Go to https://<span></span>github.com/``userB``/``ProjectName`` and click the "Fork" button.

In the Terminal, do the following:

1. Type `cd` into the terminal and drag and drop the folder where you want to create the project folder from Finder into Terminal. You’ll see directoryPath being auto-completed in Terminal.

	$`cd directoryPath` 

2. Make a new folder called `ProjectName`.

	$`mkdir ProjectName`

3. Go into the `ProjectName` folder

	$`cd ProjectName`

4. Initialize the `ProjectName` folder as a git repo. This essentially makes this folder a "local git repo".

	$`git init`

5. Link your "local git repo" to a "remote git repo" that you own. Call this remote git repo `origin`.

	$`git remote add origin ssh://git@github.com/userC/ProjectName.git`

6. Populate the `ProjectName` folder on your computer (i.e., local repo) with the files from the remote repo's master branch.


	$`git pull origin master`

7. List the files in your `ProjectName` folder to make sure the pull was successful. You should see this folder populated with files downloaded from the remote repo

	$`ls`

8. Link your "local git repo" to another remote git repo that userB owns. Recall you forked the `ProjectName` repo from userB. The upstream user's (i.e., userB) repo. Call this `upstream`.
	
	$`git remote add upstream https://github.com/userB/ProjectName`

9. Make sure `origin` and `upstream` are both available remote.

	$`git remote`
	
10. Now open a file within `ProjectName` in [Atom](https://atom.io/) or another text editor. Make some changes to the code. To sync your local repo with your remote repo, do this:

	```
	$ git fetch origin
	$ git add --all
	$ git commit -m ‘I made some changes!'
	$ git push origin master
	```
	
11. To sync your local repo with userB's repo, do the following:

	$`git pull upstream master` 
	
	

## Other Useful Commands
Some useful things you can do when things go haywire or just to get the most usefulness out of git:

1. Revert your local repo to the previously committed version when everything still worked:

	```
	$ git log
	
	# git will display the following:
	# commit: <commitID>
	# ...
	
	$ git reset --hard <commitID>
	
	```

2. Switching between branches:
	
	```
	# checkout the alias of the remote e.g., origin
	$ git remote -v 
	
	# switch to a new branch called boilerplate
	$ git checkout -b boilerplate 
	
	# look at all your branches
	$ git branch 
	# you should see git display the following branches for origin:
	# b1 = master and b2 = boilerplate

	# push local repo to boilerplate branch
	$ git push origin boilerplate  
	
	```
3. Your local repo should never go out of sync with your remote repo. Git prevents you from pushing changes from your local repo to your remote repo if there are changes in your remote repo that you don't have locally. If you don't want to sync with your local repo with the remote and you just want to overwrite the remote repo with whatever you have locally, this is a useful command:

	```
	$ git push origin master --force
	```
 

4. f you accidentally initiated a directory as a git repo, this undos the `git init`:

	```
	$ rm -rf .git #i
	```
	

## Notes on .gitignore
The `.gitignore` file should be included in your local repo folder, which tells git to not add files and folders that you don't want to share publically on Github to your remote repo. What kind of files are these?

* `DS_Store` and other metadata files that macOS create
* `.env` files which includes configuration for your application that may include secret keys that you don't want people to know about.
* Transient files from your working directory that aren't useful to other collaborators, such as compilation products, temporary files IDEs create, etc. Prime example is the `node_modules` which people downloading your project can get from running `npm install` if they have the right `package.json`. 

In general, you should include the following in your `.gitignore`

```
#.gitignore

lib-cov
*.seed
*.log
*.csv
*.dat
*.out
*.pid
*.gz
*.swp

pids
logs
results
tmp
coverage

# API keys
.env

# Dependency directory
node_modules
bower_components

# Editors
.idea
*.iml

# OS metadata
.DS_Store
Thumbs.db

```