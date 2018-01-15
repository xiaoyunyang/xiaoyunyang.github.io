# ES6 and how Babel helps
## Babel

* [What is Babel?](https://kleopetrov.me/2016/03/18/everything-about-babel/)
* [React Express Tutorial](http://www.react.express/modern_javascript)
	
	>ECMAScript is the language specification used to implement the JavaScript language. Nearly every JavaScript environment today can run at least ECMAScript 5 (ES5), the version of JavaScript introduced in 2009. However, there are many new features in the latest versions of JavaScript that we'd like to use. Thanks to Babel, we can use them today! Babel transforms newer features into ES5 for cross-platform compatibility.
* How to [set up Babel for react app](http://www.react.express/babel) or [set up Babel for node/express app](https://github.com/babel/example-node-server). For node app, assume you have this file structure:

	```
	my-app
	├───package.json
	├───.babelrc
	├───server
	│   ├───app.js <===ES6
	│   └───build
	|		 └───app.js <===ES5
	...
	```

	Add the following to `.babelrc`
	
	```
	{
	  "presets": [
	    "env",
	    "stage-2"
	  ],
	  "plugins": [
	    "transform-runtime"
	  ]
	}
	
	```
	Add the following to `package.json`:
	
	```
	"scripts": {
		"build": "babel server -d ./server/build",
    	"start": "node server/build/app.js",
	}
	"dependencies": {
		"express": "^4.16.2",
		"webpack": "^3.10.0"
	},
	"devDependencies": {
		"babel-cli": "^6.26.0",
		"babel-core": "^6.26.0",
		"babel-loader": "^7.1.2",
		"babel-plugin-transform-runtime": "^6.23.0",
		"babel-preset-env": "^1.6.1",
		"babel-preset-react": "^6.24.1",
		"babel-preset-stage-1": "^6.24.1",
		"babel-preset-stage-2": "^6.24.1",
		"eslint": "^3.19.0",
		"webpack-dev-middleware": "^2.0.4",
		"webpack-hot-middleware": "^2.21.0"
	}
	
	```
	In your terminal:
	
	```
	$ npm install
	$ npm run build
	$ npm run start 
	```
	
	In `package.json`, the following `build` script is saying compile the entire server directory and output it to the server/build directory. `-d` means directory.
	
	```
	"build": "babel server -d ./server/build"
	
	```
	If we didn't have the `.babelrc` then we have to make this the build script:
	```
	"build": babel server -d ./server/build --presets env,stage-2",
	```	
	If we didn't have the scripts in `package.json`, then every time we make a change to `server.js`, we would have to transpile the code from ES6 to ES5 and manually run the babel transpiling command to populate the build folder then run the ES5 version of the folder. 
	
	```
	$ babel server -d ./server/build --presets env,stage-2"
	$ node server/build/app.js
	```

### Notes

* `babel-preset-es2015` is deprecated. Use `babel-preset-env` instead. [Read about it here](http://babeljs.io/env). `babel-preset-env` node [not working](https://github.com/facebookincubator/create-react-app/issues/1125) in create-react-app
* [set up](https://babeljs.io/docs/plugins/transform-runtime/) `babel-runtime`, which "externalise references to helpers and builtins, automatically polyfilling your code without polluting globals



## Useful Stuff in ES6



>ES2015, or ECMAScript 2015, is the first significant update to the language since ES5 was initially released in 2009. You'll often see ES2015 called by its original name, ES6, since it's the 6th version of ECMAScript.

[var let and const](http://www.react.express/block_scoped_declarations)
>the [babel] compiled output replaces const and let with var. You'll also notice that Babel transforms const a = 3 into var _a = 3. This is so that your code can run on older platforms that don't support the new block-scoped variable declarations.

[Fat arrow functions](http://www.react.express/fat_arrow_functions)
>The fat arrow `=>` is used to define anonymous functions. There are two important differences in the behavior of these functions, compared to functions defined with `function`.

>If the function body is not wrapped in curly braces (as in the previous sentences), it is executed as an expression, and the return value of the function is the value of the expression. The function body can be wrapped in curly braces to make it a block, in which case you will need to explicitly `return` a value, if you want something returned.

[Destructuring](http://www.react.express/destructuring)
>Destructuring is a convenient way to extract multiple keys from an object or array simultaneously and assign the values to local variables.

[Imports and exports](http://www.react.express/imports_and_exports)
>There is one default export per file, and this exported value can be imported without refering to it by name. Every other import and export must be named.

[Default Parameters](http://www.react.express/default_parameters)

```javascript
const printInput = (input = 'hello world') => {
  console.log(input)
}

printInput()
printInput('hello universe')
```

[Classes](http://www.react.express/classes)
>In ES5, classes are written as functions, with instance methods assigned to `MyFunction.prototype`. ES2015 allows us to use the simpler `class` syntax.

>`class` gives us built in instance functions, static functions, and inheritance. `constructor` is a special function that is called automatically every time a class instance is created. We can use the static keyword to declare `static` class functions. Static method calls are made directly on the class and cannot be called on instances of the class.

```javascript
// Class Instance Property

class Cat {
  name = 'Tom'
  state = {
    running: true
  }

  constructor() {
    console.log(this.name, this.state.running)
  }
}

new Cat()

```

```javascript
// Static class property
class Foo {
  static bar = 'hello'
}

console.log(Foo.bar)
```

[Bound Instance Method](http://www.react.express/bound_instance_methods)
>Before ES2016, you might bind functions to class instances in the `constructor`, e.g. `this.func = this.func.bind(this)`. Binding here ensures that a class's instance function is invoked with the correct context.

```javascript
class Cat {
  constructor(name) {
    this.name = name
  }
  printName = () => {
    console.log(this.name)
  }
}

const cat = new Cat('Tom')
const printName = cat.printName

// 'this' is still bound to our Cat instance, so even
// though our calling context changed, the function
// executes in its original context.
printName()
```

[Dynamic Object Keys](http://www.react.express/dynamic_object_keys)
[Array Spread](http://www.react.express/array_spread)
[Object Spread](http://www.react.express/object_spread)
>We can copy an object simply with `{...originalObj}`. Note that this is a shallow copy. We can also extend an object with `{...originalObj, key1: 'newValue'}`.

[Async and Await](http://www.react.express/async_await)
>We can use the `async` keyword before a function name to wrap the return value of this function in a `Promise`. We can use the `await` keyword (in an `async` function) to wait for a promise to be resolved or rejected before continuing code execution in this block.

```javascript
const fetchData = async () => {
  return fetch('https://randomuser.me/api/')
}

const printData = async () => {
  try {
    const data = await fetchData()
    const json = await data.json()
    console.log(json)
  } catch(e) {
    console.error("Problem", e)
  }
}

printData()
```

## Gotchas
### Scoping

* [Everything You Need to Know about Scopes](https://toddmotto.com/everything-you-wanted-to-know-about-javascript-scope/) - which discusses closure.

**What is Closure?**
Closure is basically a design pattern where your function returns another function that takes an inputso you can call your closure like this: `myFun(arg1)(arg2)`, which is equivalent to

```
const myFun2 = myFun(arg1)myFun2(arg2)```It’s called currying and partial application - a key concept of functional programming, a key concept. Closure is a powerful design pattern because you can continuing chaining things like `myFun(arg1)(arg2)(arg3)…`. `myFun` does some calculation with using `arg1`, returns another function that takes the result of `myFun`'s calculation on `arg1` and `arg2` as input, then processes things further by calling a third function, which in turn calls a fourth function and so on. You can think of it like an assembly line in a factory.