# Github / Git Tutorial

#### This is a tutorial for Unix and Git newbies.

### Assume: 
* userA, userB, and userC all setup their computers with a Github account.

### Suppose: 
* userA wants to create an original repo called `ProjectName`.
* userB wants to fork the `ProjectName` repo from usernameB.
* userC wants to fork the `ProjectName` repo from userB.

## Git Tutorial For userA
Go to https://github.com/`userA`/ and click the "New" button. Name the new repo `ProjectName`.

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
Go to https://github.com/`userB`/`ProjectName` and click the "Fork" button.

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

