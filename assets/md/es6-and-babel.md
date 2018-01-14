# ES6 and how Babel helps
## Babel

* [What is Babel?](https://kleopetrov.me/2016/03/18/everything-about-babel/)
* [React Express Tutorial](http://www.react.express/modern_javascript)
	
	>ECMAScript is the language specification used to implement the JavaScript language. Nearly every JavaScript environment today can run at least ECMAScript 5 (ES5), the version of JavaScript introduced in 2009. However, there are many new features in the latest versions of JavaScript that we'd like to use. Thanks to Babel, we can use them today! Babel transforms newer features into ES5 for cross-platform compatibility.
* [How to set up Babel](http://www.react.express/babel)


	```
	$ npm install --save-dev babel-loader babel-core babel-preset-react babel-preset-env babel-preset-stage-1 babel-plugin-transform-runtime
	$ npm install --save babel-runtime
	```
* `babel-preset-es2015` is deprecated. Use `babel-preset-env` instead. [Read about it here](http://babeljs.io/env)

`babel-preset-env` node [not working](https://github.com/facebookincubator/create-react-app/issues/1125) in create-react-app

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