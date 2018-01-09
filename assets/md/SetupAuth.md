## Goal
We want to build a `react` and `node` app with user authentication via `passport`, `postgresql` for database, and `knex` to connect the app to the database. 

## Dependencies
We need these dependencies:

**Authentication**

* [`passport`](), which help us authenticating with different methods includes these add-ons to help us authenticate with different methods:
	* [`passport-local`]()
	* [`passport-facebook`]() 
	* [`passport-google-oauth`]() 
	* [`passport-github2`](https://www.npmjs.com/package/passport-github2)
* [`express-session`]() 

**Utilities**
	
* [`connect-flash`]() - allows for passing session flashdata messages. 
* [`cookie-parser`]() - read cookies (needed for auth)
* [`body-parser`]() -  get information from html forms
* [`morgan`]() - log every request to the console
* 	[`bcrypt-nodejs`](https://www.npmjs.com/package/bcrypt-nodejs) - used to hash strings and compare the hash with the hash stored in the database
* [`crypto`](https://nodejs.org/api/crypto.html) - nodes's built in module for hashing.

**Database**
* [`knex`](http://knexjs.org/) - SQL query builder for Postgres. Our app uses `knex` to interact with the database.


## Set up the `User` model
You want to sign up users and log users in to use your website. We need to create a `User` object. From your project directory:

```
$ mkdir models
$ touch models/User.js
```
The `User` model will include logic for authentication, including:

* Hooking up to a `users` table in the postgresql database
* When a new user signs up, create a new `User` with the information provided by the user and saving all that information into the `users` table in the database. We don't want to save the raw password into the database because if your database gets hacked, the hacker will have the login information of all your users. A mitigation for that is to hash the password with secure hash algorithm (SHA) and store the hash into the database.
* Next time returning user tries to log in with the password, you hash the password and compare the hash of the password with the stored hash in the database. If they match, the user is authenticated and gets logged in. If the hashes don't match, then the user can click on a "forgot my password" link to reset the password. Note, we can't tell the user what the password is because SHA is a one way function, meaning it is not possible to guess what the original password is using just the hash.
* Dependencies to achieve these goals:
	* [`knex`](http://knexjs.org/) - SQL query builder for Postgres. We use `knex.js` to interact with the database.

		```
		$ mkdir models/dbconfig
		$ touch models/dbconfig/bookshelf.js
		$ touch models/dbconfig/knexfile.js
		$ touch models/dbconfig/.env
		```

## Set up the Authentication Process

[]()
**Passport Setup**

1. Create a config file for passport
	```
	$ touch config/passport.js
	```
2. Follow the scotch.io tutorials to populate the `config/passport.js` file to use different strategies to log in/sign up
	* [Set up local](https://scotch.io/tutorials/easy-node-authentication-setup-and-local)
	* [Set up oAuth](https://scotch.io/tutorials/easy-node-authentication-facebook)

	The `config/passport` file will end up looking like this after you set passport up to use both local and facebook strategies:
	
	```javascript
	// config/passport.js
	
	const LocalStrategy = require('passport-local').Strategy;
	const FacebookStrategy = require('passport-facebook').Strategy;
	const User = require('../models/user');
	
	// You are exporting a function that takes passport as 
	// an argument and returning
	module.export = (passport) => {
	
	  /** passport session setup **/
	  // required for persistent login session
	  passport.serializeUser((user, done) => { /* TODO */ }
	  passport.deserializeUser((id, done) => { /* TODO */ }
	  
	  /** Local Signup **/
	  passport.use('local-signup', new LocalStrategy( /* TODO */ ))
	  
	  /** Facebook Signup **/
	  passport.use('facebook-signup', new FacebookStrategy( /* TODO */ ))	 
	}
	```
3. We pass this `config/passport.js` file into `server.js` to configure `passport`. `server.js` contains the following code:
	
	```javascript
	// server.js
	
	const passport = require('passport')
	require('./config/passport')(passport);
	
	```


## Integration With React Router

Check out [this tutorial](https://tylermcginnis.com/react-router-protected-routes-authentication/)

[This Stackoverflow post](https://stackoverflow.com/questions/43164554/how-to-implement-authenticated-routes-in-react-router-4) suggests creating a PrivateRoutes component:


Same Tutorial is found here: [React Training](https://reacttraining.com/react-router/web/example/auth-workflow) 


## Background
[Sample App](https://github.com/aybmab/express-redux-sample)
	
**A User System**
Use `passport` to implement a user system. Essentially, a session token is generated when a client connects, it is then associated with an account if the user successfully signs on and saved to a store (currently the dev session store, but soon to be redis - though it could also be saved in the DB). The token is then used to authorize subsequent requests.

**Redux**
Everytime something happens, a new state object is created to reflect the change, and the views update accordingly.

**Optimistic Updates:**
	
> After having a redux application connected to a backend, I wanted to implement optimistic updates (a.k.a. reflect user updates immediately, even though the change wasn't necessarily saved). This was implemented by generating a unique id on the client side and then using that to reconcile after hearing back from the server. By using the client-side-generated id, react nicely handles updating the view and notifying the user on the status of each change. 

**Live Update/Push Notification**
> After users were able to make changes, I didn't want them to have to refresh their page to see changes made by other users. I used [SocketIO](https://socket.io/) to alert each client of any update. Please let me know what you think about this! I've never used backbone, but it seems to have a nice model and event system that could be worth exploring.

**Sessions**
Sessions are basically cookies that also gives you the ability to define the backend storage used by the server part of your application
	
**Client Side Routing**	
> 	

## Set up your Database



## Resources
* Scotch.io Tutorial
	* [set up passport-local](https://scotch.io/tutorials/easy-node-authentication-setup-and-local) 
	* [set up passport-facebook](https://scotch.io/tutorials/easy-node-authentication-facebook) 
* [node passport and postgres setup](http://mherman.org/blog/2016/09/25/node-passport-and-postgres/) - Good tutorial on integrating `passport` with `postgres` and  `knex`
* [postgres with passport](http://uitblog.com/postgres-with-passport/)
* [node passport and postgres Medium](https://reallifeprogramming.com/node-authentication-with-passport-postgres-ef93e2d520e7)
* [codeMentor](https://www.codementor.io/devops/tutorial/getting-started-postgresql-server-mac-osx) - Getting Started Tutorial for postgresql


