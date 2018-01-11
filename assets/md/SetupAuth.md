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
**What is salt and what it's good for?**
[Salt](https://www.wikiwand.com/en/Salt_(cryptography))
> salt is random data that is used as an additional input to a one-way function that "hashes" data, a password or passphrase. Salts are closely related to the concept of nonce. The primary function of salts is to defend against dictionary attacks or against its hashed equivalent, a pre-computed rainbow table attack
[Rainbow Table Attack](https://www.wikiwand.com/en/Rainbow_table)
> A rainbow table is a precomputed table for reversing cryptographic hash functions, usually for cracking password hashes. Tables are usually used in recovering a plaintext password (or credit card numbers, etc) up to a certain length consisting of a limited set of characters. It is a practical example of a space–time tradeoff, using less computer processing time and more storage than a brute-force attack which calculates a hash on every attempt, but more processing time and less storage than a simple lookup table with one entry per hash. Use of a key derivation function that employs a salt makes this attack infeasible.


## Set up the Authentication Process


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

**Set up passport with auth0**

[https://github.com/auth0/passport-auth0](https://github.com/auth0/passport-auth0)

## Integration With React Router

Check out [this tutorial](https://tylermcginnis.com/react-router-protected-routes-authentication/)

[This Stackoverflow post](https://stackoverflow.com/questions/43164554/how-to-implement-authenticated-routes-in-react-router-4) suggests creating a `PrivateRoutes` component:


Same Tutorial is found here: [React Training](https://reacttraining.com/react-router/web/example/auth-workflow) 

[`react-router-config`](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config)

* According to the [documentation](https://reacttraining.com/react-router/web/example/route-config), you can do something like this:

	```javascript
	const routes = [
	  { path: '/sandwiches',
	    component: Sandwiches
	  },
	  { path: '/tacos',
	    component: Tacos,
	    routes: [
	      { path: '/tacos/bus',
	        component: Bus
	      },
	      { path: '/tacos/cart',
	        component: Cart
	      }
	    ]
	  }
	]
	
	// wrap <Route> and use this everywhere instead, then when
	// sub routes are added to any route it'll work 
	const RouteWithSubRoutes = (route) => (
	  	<Route path={route.path} render={props => (
	  		// pass the sub-routes down to keep nesting
	    <route.component {...props} routes={route.routes}/>
	  	)}/>
	)
	
	```
`react-router-config` issues:
* [Issue 5138](https://github.com/ReactTraining/react-router/issues/5138)
* [Issue 4962](https://github.com/ReactTraining/react-router/issues/4962)

[Tutorial](https://www.mokuji.me/article/react-auth0) for implementing react-node app with authentication using auth0.


## Set up your Database


### PostgresQL

##### Install Postgres
Using Homebrew:  `brew install postgres`
##### Start Postgres
* Automatic:
	* `pg_ctl -D /usr/local/var/postgres start && brew services start postgresql` - This makes Postgres start every time your computer starts up. Execute the following command
	* `brew services start postgresql` - To have launchd start postgresql now and restart at login
* Manual
	* Start Postgres: `pg_ctl -D /usr/local/var/postgres start`
	* Stop Postgres: `pg_ctl -D /usr/local/var/postgres stop`

##### Database Management
* `createdb looseleaf` - creates a database called looseleaf
* `dropdb looseleaf` - delete the database called looseleaf
* `psql looseleaf` - access the database called looseleaf. After you type this, you'll see this: `looseleaf=#`, which is the header for the postgres database interface. Type the command after the `#`. For example:
	* `looseleaf=# \du` - see what users are installed
	* `looseleaf=# \h` - help
	* `looseleaf=# \q` - quit
If you want to use a PostgresQL GUI, install and launch [Postico](https://eggerapps.at/postico/). Look up the User name using `looseleaf=# \du`.


## WebApp Environmental
Accessing environment variables in Node.js is supported right out of the box. When your Node.js process boots up it will automatically provide access to all existing environment variables by creating an `env` object as property of the `process` global object. If you want to take a peek at the object run the the Node.js REPL with `node` in your command-line and type:

```javascript
console.log(process.env);
``` 
You should see that the value of `PORT` is `undefined` on your computer. Cloud hosts like Heroku or Azure, however, use the `PORT` variable to tell you on which port your server should listen for the routing to work properly. Therefore, the next time you set up a web server, you should determine the port to listen on by checking `PORT` first and giving it a default value otherwise:

```javascript
const app = require('http').createServer((req, res) => res.send('Ahoy!'));

// take the value of the PORT if it’s available or default 
// to 3000 as a fallback port to listen on.
const PORT = process.env.PORT || 3000;
 
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
```

If you want to separately define your environmental variable, then install `dotenv` and use the following lines in your `server.js`

>`Dotenv` is a simple way to allow you to create secret keys that your application needs to function and keep them from going public.
 
See more on the use of `dotenv` from [this article](https://medium.com/@thejasonfile/using-dotenv-package-to-create-environment-variables-33da4ac4ea8f).

## More Things to Checkout
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


## Resources
* Scotch.io Tutorial
	* [set up passport-local](https://scotch.io/tutorials/easy-node-authentication-setup-and-local) 
	* [set up passport-facebook](https://scotch.io/tutorials/easy-node-authentication-facebook) 
* [node passport and postgres setup](http://mherman.org/blog/2016/09/25/node-passport-and-postgres/) - Good tutorial on integrating `passport` with `postgres` and  `knex`
* [postgres with passport](http://uitblog.com/postgres-with-passport/)
* [node passport and postgres Medium](https://reallifeprogramming.com/node-authentication-with-passport-postgres-ef93e2d520e7)
* [codeMentor](https://www.codementor.io/devops/tutorial/getting-started-postgresql-server-mac-osx) - Getting Started Tutorial for postgresql
* [Tutorials Point MongoDB Tutorial](https://www.tutorialspoint.com/mongodb/mongodb_overview.htm)

