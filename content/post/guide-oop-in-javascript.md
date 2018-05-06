---
title: "How To Do Object Oriented Programming The Right Way"
date: 2018-04-28
categories:
  - blog
tags:
  - JavaScript
  - Programming
  - Software Design
keywords:
  - object oriented programming
  - computer science
  - javascript
  - interview prep
  - prototypal inheritance
  - classical inheritance
  - functional composition
thumbnailImagePosition: left
thumbnailImage: /post/images/oop.png
---

Object Oriented Programming (OOP) is a software design pattern that allows you to think about problems in terms of objects and their interactions. OOP is typically done with classes or with prototypes. Most languages that implement OOP (e.g., Java, C++, Ruby, Python) use class-based inheritance. JavaScript implements OOP via Prototypal inheritance. In this article, I'm going to show you how to use both approaches for OOP in JavaScript, discuss the advantages and disadvantages of the two approaches of OOP and introduce an alternative for OOP for designing more modular and scalable applications.  

<!--more-->

# Primer: What is an Object?
OOP is concerned with composing objects that manages simple tasks to create complex computer programs. An object consists of private mutable states and functions (called methods) that operate on these mutable states. Objects have a notion of self and reused behavior inherited from a blueprint (classical inheritance) or other objects (prototypal inheritance).

Inheritance is the ability to say that these objects are just like that other set of objects *except* for these changes. The goal of inheritance is to speed up development by promoting code reuse.

# Classical Inheritance
In classical OOP, classes are blueprints for objects. Objects are created or *instantiated* from classes. There's a constructor that is used to create an instance of the class with custom properties.

Consider the following example:

```javascript
class Person {

  this = {
    firstName:  '',
    lastName: ''
  }

  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
  getFullName() {
    return this.firstName + ' ' + this.lastName
  }
}
```

The `class` key word from ES6 is used to create the `Person` class with properties stored in `this` called `firstName` and `lastName`, which are set in the `constructor` and accessed in the `getFullName` function.

We instantiate an object called `person` from the `Person` class with the `new` key word as follows:

```javascript
let person = new Person('Dan', 'Abramov')
person.getFullName() //> "Dan Abramov"

// We can use an accessor function or access directly
person.firstName //> "Dan"
person.lastName //> "Abramov"
```

Objects created using the `new` keyword are mutable. In other words, changes to a class affect all objects created from that class and all derived classes which *extends* from the class.

To extend a class, we can create another class. Let's extend the `Person` class to make a `User`. A `User` is a Person with an email and a password.

```javascript
class User extends Person {
  this = {
    email: '',
    password: ''
  }
  constructor(firstName, lastName, email, password) {
    super(firstName, lastName)
    this.email = email
    this.password = password
  }
  getEmail() {
    return this.email
  }
  getPassword() {
    return this.password
  }
}
```

In the code above, we created a `User` class which *extends* the capability of the `Person` class by adding email and password properties and accessor functions. In the `App` function below, a `user` object is *instantiated* from the `User` class:

```javascript
function App() {
  let user = new User('Dan', 'Abramov', 'dan@abramov.com', 'iLuvES6')
  user.getFullName() //> "Dan Abramov"
  user.getEmail() //> "dan@abramov.com"
  user.getPassword() //> "iLuvES6"

  user.firstName //> "Dan"
  user.lastName //> "Abramov"
  user.email //> "dan@abramov.com"
  user.password //> "iLuvES6"
}
```

That seems to work just fine but there's a big design flaw with using the classical inheritance approach: **How the heck do the users of the `User` class (e.g., `App`) know `User` comes with firstName and lastName and there's a function called `getFullName` that can be used?** Looking at the code for `User` class does not tell us anything about the data or methods from its super class. We have to dig into the documentation or trace code through the class hierarchy.

As Dan Abramov [puts it](https://medium.com/@dan_abramov/how-to-use-classes-and-sleep-at-night-9af8de78ccb4):

> The problem with inheritance is that the descendants have too much access to the implementation details of every base class in the hierarchy, and vice versa. When the requirements change, refactoring a class hierarchy is so hard that it turns into a WTF sandwich with traces of outdated requirements.

Classical inheritance is based on establishing relationships through dependencies. The base class (or super class) sets the baseline for the derived classes. Classical inheritance is OK for small and simple applications that don't often change and has no more than one level of inheritance (keeping our inheritance trees shallow to avoid [The Fragile Base Class](https://www.wikiwand.com/en/Fragile_base_class) problem) or wildly different use cases. Class-based inheritance can become unmaintainable as the class hierarchy expands.

Eric Elliot described how classical inheritance can potentially lead to project failure, and in the worst cases, [company failures](https://medium.com/javascript-scene/inside-the-dev-team-death-spiral-6a7ea255467b):

> Get enough clients using `new`, and you can’t back out of the constructor implementation even if you want to, because code you don’t own will break if you try.

When many derived classes with wildly different use cases are created from the same base class, any seemingly benign change to the base class could cause the derived classes to malfunction. At the cost of increased complexity to your code and the entire software creation process, you could try to mitigate side effects by creating a [dependency injection container](https://medium.com/the-everyday-developer/creating-an-ioc-container-with-dependency-injection-in-javascript-9db228d34060) to provide an uniform service instantiation interface by abstracting the instantiation details. Is there a better way?

### Prototypal Inheritance
Prototypal inheritance do not use classes at all. Instead, objects are created from other objects. We start with a *generalized object* we called a prototype. We can use the prototype to create other by cloning it or extend it with custom features.

Although in the previous section, we showed how to use the ES6 `class`, [**JavaScript classes are not classy**](https://medium.freecodecamp.org/elegant-patterns-in-modern-javascript-ice-factory-4161859a0eee).

```javascript
typeof Person //> "function"
typeof User //> "function"
```

ES6 classes are actually [syntactic sugar](https://stackoverflow.com/questions/36419713/are-es6-classes-just-syntactic-sugar-for-the-prototypal-pattern-in-javascript/36419728) of JavaScript's existing prototypal inheritance. Under the hood, creating a class with a `new` keyword creates a function object with code from the `constructor`.

JavaScript is fundamentally a prototype-oriented language.

{{< blockquote "Douglas Crockford (creator of JSON)" "https://www.amazon.com/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742" "JavaScript: The Good Parts" >}}
The simple types of JavaScript are numbers, strings, booleans (true and false), null, and undefined. All other values are objects.  Numbers, strings, and booleans are object-like in that they have methods, but they are immutable. Objects in JavaScript are mutable keyed collections. In JavaScript, arrays are objects, functions are objects, regular expressions are objects, and, of course, objects are objects.
{{< /blockquote >}}

Let's look at one of these objects that JavaScript gives us for free out-of-the-box: the `Array`.

Array instances inherit from [Array.prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype) which includes many methods which are categorized as accessors (do not modify the original array), mutators (modifies the original array), and iterators (applies the function passed in as an argument onto every element in the array).

**Accessors:**
* [`Array.prototype.includes(e)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) - returns true if element `e` is included in the array. False otherwise.
* [`Array.prototype.slice(i,j)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) - extract array from index `i` to index `j` (exclusive). Return as new array.

**Mutators:**

* [`Array.prototype.push(e)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) - add `e` to the tail
* [`Array.prototype.pop(e)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop) - remove `e` from the tail
* [`Array.prototype.splice(i, j)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) - extract array from index `i` to index `j` (exclusive). Discard the rest.

Mutator functions modify the original array. `splice` gives you the same sub-array as `slice` but you want to maintain the original array, `slice` is a better choice.

**Iterators:**

* [`Array.prototype.map(f)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) - applies the function `f` onto every element of the given array to compute the new elements of the resultant array.
* [`Array.prototype.filter(f)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) - evaluates every element of the given array against a predicate `f` and returns it with the resultant array if it passes `f`.
* [`Array.prototype.forEach(f)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) - applies the function `f` onto every element of the given array.

`map` and `forEach` are similar in that they are doing *something* to everything to the array but the key difference is `map` returns an array while `forEach` is like a void function and returns nothing. Good functional software design practices say we should always write functions that has no side effects, i.e., don't use void functions. `forEach` doesn't do anything to the original array so `map` is a better choice if you want to do any data transformation. One potential use case of `forEach` is printing to console for debugging:

```javascript
let arr = [1,2,3]
arr.forEach(e => console.log(e))
arr //> [1,2,3]
```

Suppose we want to extend the `Array` prototype by introducing a new method called `partition`, which divides the array into two arrays based on a predicate. For example [1,2,3,4,5] becomes [[1,2,3], [4,5]] if the predicate is "less than or equal to 3". Let's write some code to add `partition` to the Array prototype:

```javascript
Array.prototype.partition = function(pred) {
  let passed = []
  let failed = []
  for(let i=0; i<this.length; i++) {
    if (pred(this[i])) {
      passed.push(this[i])
    } else {
      failed.push(this[i])
    }
  }
  return [ passed, failed ]
}
```

Now we can use `partition` on any array:

```JavaScript
[1,2,3,4,5].partition(e => e <=3)
//> [[1, 2, 3], [4, 5]]
```

`[1,2,3,4,5]` is called a literal. [Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Array_literals) is one way to create an object. We can also use [factory functions](https://medium.com/@pyrolistical/factory-functions-pattern-in-depth-356d14801c91) or [Object.create](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) to create the same array:

```javascript
// Literal
[1,2,3,4,5]

// Factory Function
Array(1,2,3,4,5)

// Object.create
let arr = Object.create(Array.prototype)
arr.push(1)
arr.push(2)
arr.push(3)
arr.push(4)
arr.push(5)
```

A factory function is any function which is not a class or constructor that returns a (presumably new) object. In JavaScript, any function can return an object. When it does so without the `new` keyword, it’s a factory function.

In the code above, we created an object called `arr` using `Object.create` and pushed 5 elements into the array. `arr` comes with all the functions inherited from the `Array` prototype such as `map`, `pop`, `slice`, and even `partition` that we just created for the `Array` prototype. Let's add some more functionality to the `arr` object:

```javascript
arr.hello = () => "hello"
```

**Quiz time!** What's going to be returned when we run the following code?

```javascript
arr.partition(e => e < 3) // #1

arr.hello() // #2

let foo = [1,2,3]
foo.hello() // #3

Array.prototype.bye = () => "bye"
arr.bye() // #4
foo.bye() // #5
```

**Answers**

* **#1** is going to return `[[1,2], [3,4,5]]` because `partition` is defined for `Array`, which `arr` inherits from.
* **#2** is going to return "hello" because we created a new function for `arr` object called `hello` that takes no arguments and returns the string "hello".
* For **#3**, If you guessed "TypeError: foo.hello is not a function", you are correct. Since `foo` is a new object created from the `Array` prototype and `hello` is not defined for `Array`, `hello` will not be defined for `foo`.
* **#4** and **#5** are both going to return "bye" because in the line above, we added the function `bye` to the `Array` prototype from which `arr` and `foo` both inherit. Any changes to the prototype will affect every object that inherits from the object, even *after the object has been created*.

Factory functions have [always been attractive in JavaScript](https://medium.com/javascript-scene/javascript-factory-functions-with-es6-4d224591a8b1) because they offer the ability to easily produce object instances without diving into the complexities of classes and the `new` keyword.

Creating `Person` and `User` using prototypal inheritance:

```javascript
function Person(firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
Person.prototype.getFullName = function () {  
  return this.firstName + ' ' + this.lastName
}
```

Now we can use the `Person` prototype like so:

```javascript
let person = new Person('Dan', 'Abramov')
person.getFullName() //> Dan Abramov
```

`person` is an object. Doing a `console.log(person)` gives us the following:

```
Person {
  firstName: "Dan",
  lastName: "Abramov",
  __proto__: {
    getFullName: f
    constructor: f Person(firstName, lastName)
  },
  __proto__: Object  
}
```

For our `User`, we just need to extend the `Person` class:

```javascript
function User(firstName, lastName, email, password) {
  Person.call(this, firstName, lastName) // call super constructor.
  this.email = email
  this.password = password
}

User.prototype = Object.create(Person.prototype);

User.prototype.setEmail = function(email) {
  this.email = email
}

User.prototype.getEmail = function() {
  return this.email
}

user.setEmail('dan@abramov.com')
```

`user` is an object. Doing a `console.log(user)` gives us the following:

```
User {
  firstName: "Dan",
  lastName: "Abramov",
  email: "dan@abramov.com",
  password: "iLuvES6",
  __proto__: Person {
    getEmail: f ()
    setEmail: f (email)
    __proto__: {
      getFullName: f,
      constructor: f Person(firstName, lastName)
      __proto__: Object

    }
  }
}
```

What if we want to customize the `getFullName` function for `User`? How is the following code going to affect `person` and `user`?

```javascript
User.prototype.getFullName = function () {  
  return 'User Name: '+this.firstName + ' ' + this.lastName
}

user.getFullName() //> "User Name: Dan Abramov"
person.getFullName() //> "Dan Abramov"
```
As we expect, `person` is not be affected at all.

How about decorating the `Person` object by adding a gender attribute and corresponding getter and setter functions?

```javascript
Person.prototype.setGender = function (gender) {  
  this.gender = gender
}
Person.prototype.getGender = function () {  
  return this.gender
}

person.setGender('male')
person.getGender() //> male

user.getGender() //> returns undefined ... but is a function
user.setGender('male')
user.getGender() //> male
```

Both `person` and `user` are affected because `Person` is prototyped from `User` so if `User` changes, `Person` changes too.

The decorator pattern from prototypal inheritance is not so different from the classical inheritance.

{{< blockquote "Eric Elliot" "https://medium.com/javascript-scene/master-the-javascript-interview-what-s-the-difference-between-class-prototypal-inheritance-e4cd0a7562e9" "Master the JavaScript Interview: What’s the Difference Between Class & Prototypal Inheritance?" >}} Unlike most other languages, JavaScript’s object system is based on prototypes, not classes. Unfortunately, most JavaScript developers don’t understand JavaScript’s object system, or how to put it to best use. {{< /blockquote >}}

Dan Abramov [advices](https://medium.com/@dan_abramov/how-to-use-classes-and-sleep-at-night-9af8de78ccb4) that

* Classes obscure the prototypal inheritance at the core of JS.
* Classes encourage inheritance but you should prefer composition.
* Classes tend to lock you into the first bad design you came up with.

> Instead of creating a class hierarchy, consider creating several factory functions. They may call each other in chain, tweaking the behavior of each other. You may also teach the “base” factory function to accept a “strategy” object modulating the behavior, and have the other factory functions provide it.

# A Third way: No OOP

The three cornerstones of OOP - Inheritance, Encapsulation, and Polymorphism - are powerful programming tools/concepts but have their shortcomings:

## Inheritance

Inheritance promotes code reuse but you are often forced to take more than what you want.

Joe Armstrong (creator of Erlang) puts it best:

> The problem with object-oriented languages is they’ve got all this implicit environment that they carry around with them. You wanted a banana but what you got was a gorilla holding the banana and the entire jungle.

So what if there's more than what we ask for? Can't we just ignore the stuff we don't need? Only if it's that simple. When we need classes that depend on other classes, which depend on other classes, we're going to have to deal with [dependency hell](https://www.wikiwand.com/en/Dependency_hell), which really slows down the build and debugging processes. Additionally, applications that carry a long chain of dependencies are not very portable.

There's of course the fragile base class problem as mentioned above. It's [unrealistic to expect everything to fall neatly into place](https://medium.com/@cscalfani/goodbye-object-oriented-programming-a59cda4c0e53) when we create mappings between real-world objects and their classes. Inheritance is not forgiving when you need to refactor your code, especially the base class. Also, [inheritance weakens encapsulation](http://www.informit.com/articles/article.aspx?p=2210836), the next cornerstone of OOP:

> The problem is that if you inherit an implementation from a superclass and then change that implementation, the change from the superclass ripples through the class hierarchy. This rippling effect potentially affects all the subclasses.

## Encapsulation

Encapsulation keeps every object's internal state variables safe from the outside. The ideal case is that your program would consist of "islands of objects" each with their own states passing messages back and forth. This sounds like a good idea in theory if you are building a perfectly distributed system but in practice, designing a program consisting of perfectly self-contained objects is hard and limiting.

Lots of real world applications require solving difficult problems with many moving parts. When you take an OOP approach to design your application, you're going to run into conundrums like how do you divide up the functionalities of your overall applications between different objects and how to manage interactions and data sharing between different objects. [This article](https://medium.com/@brianwill/object-oriented-programming-a-personal-disaster-1b044c2383ab) has some interesting points about the design challenges OOP applications:

> When we consider the needed functionality of our code, many behaviors are inherently cross-cutting concerns and so don’t really belong to any particular data type. Yet these behaviors have to live somewhere, so we end up concocting nonsense [Doer](http://steve-yegge.blogspot.com/2006/03/execution-in-kingdom-of-nouns.html) classes to contain them...And these nonsense entities have a habit of begetting more nonsense entities: when I have umpteen Manager objects, I then need a ManagerManager.

It's true. I've seen "ManagerManager classes" in production software that wasn't originally designed to be this way has grown in complexity over the years.

As we will see next when I introduce function composition (the alternative to OOP), we have something much simpler than objects that encapsulates its private variables and performs a specific task - it's called functions!

But before we go there, we need to talk about the last cornerstone of OOP:

## Polymorphism

Polymorphism let's us specify behavior regardless of data type. In OOP, this means designing a class or prototype that can be adapted by objects that need to work with different kinds of data. The objects that use the polymorphic class/prototype needs to define type-specific behavior to make it work. Let's see an example.

Suppose to want to create a general (polymorphic) object that takes some data and a status flag as parameters. If the status says the data is valid (i.e., `status === true`), a function can be applied onto the data and the result, along with the status flag, will be returned. If the status flags the data as invalid, then the function will not be applied onto the data and the data, along with the invalid status flag, will be returned.

Let's start with creating a polymorphic prototype object called `Option`:

```javascript
function Option({data, status}) {
  this.data = data
  this.status = status
}

Option.prototype.apply = function (f) {
  if(this.status) {
    return new Option({data: f(this.data), status: this.status})
  }
  return new Option({data: this.data, status: this.status})
}

Option.prototype.getOrElse = function (msg) {
  if(this.status) return this.data

  return msg
}
```

Now we create two objects from the `Option` prototype called `Number`:

```javascript
function Number(data) {
  let status = (typeof data === 'number')
  Option.call(this, {data, status})
}
Number.prototype = Object.create(Option.prototype)
```

and `String`:

```javascript
function String(data) {
  let status = (typeof data === 'string')
  Option.call(this, {data, status})
}
String.prototype = Object.create(Option.prototype)
```

Let's see our objects in action. We create a function called `increment` that's only defined for numbers and another function called `split` that's only defined for strings:

```javascript
const increment = num => num + 1
const split = str => str.split('')
```
Because JavaScript is not type safe, it won't prevent you from incrementing a string or splitting a number. You will see a runtime error when you uses an undefined method on a data type. For example, suppose we try the following:

```javascript
let foop = 12
foop.split('')
```

That's going to give you a type error when you run the code.

However, if we used our `Number` and `String` objects to *wrap* the numbers and strings before operating on them, we can prevent these run time errors:

```javascript
let numValid = new Number(12)
let numInvalid = new Number("foo")
let strValid = new String("hello world")
let strInvalid = new String(-1)

let a = numValid.apply(increment).getOrElse('TypeError!')
let b = numInvalid.apply(increment).getOrElse('TypeError Boo!')
let c = strValid.apply(split).getOrElse('TypeError!')
let d = strInvalid.apply(split).getOrElse('TypeError :(')
```

What will the following print out?

```javascript
console.log({a, b, c, d})
```

Since we designed our `Option` prototype to only apply the function onto the data if the data is the right type, this will be logged to console:

```
{
  a: 13,
  b: 'TypeError Boo!',
  c: [ 'h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd' ],
  d: 'TypeError :('
}
```

## Composition

As alluded to earlier, there's something much simpler than class/prototypes which can be easily reused, encapsulates internal states, performs a given operation on any type of data, and be polymorphic - it's called a function.

JavaScript easily lets us bundle related functions and data together in an object:

```javascript
const Person = {
  firstName: 'firstName',
  lastName: 'lastName',
  getFullName: function() {
    return `${this.firstName} ${this.lastName}`
  }
}
```

Then we can use the `Person` object directly like this:

```javascript
let person = Object.create(Person)

person.getFullName() //> "first last"

// Assign internal state variables
person.firstName = 'Dan'
person.lastName = 'Abramov'

// Access internal state variables
person.getFullName() //> "Dan Abramov"
```

Let's make a `User` object by cloning the `Person` object, then augmenting it with additional data and functions:

```javascript
const User = Object.create(Person)
User.email = ''
User.password = ''
User.getEmail = function() {
  return this.email
}
```

Then we can create an instance of user using `Object.create`
```javascript
let user = Object.create(User)
user.firstName = 'Dan'
user.lastName = 'Abramov'
user.email = 'dan@abramov.com'
user.password = 'iLuvES6'
```

A gotcha here is use `Object.create` whenever you want to copy. Objects in JavaScript are mutable so when you straight out assigning to create a new object and you mutate the second object, it will change the original object!

Except for numbers, strings, and boolean, everything in JavaScript is an object.

```javascript
// Wrong
const arr = [1,2,3]
const arr2 = arr
arr2.pop()
arr //> [1,2]
```

In the above example, I used `const` to show that it doesn't protect you from mutating objects. Objects are defined by their reference so while `const` prevents you from reassigning `arr`, it doesn't make the object "constant".

`Object.create` makes sure we are copying an object instead of passing its reference around.

Like Lego pieces, we can create copies of the same objects and tweak them, compose them, and pass them onto other objects to augment the capability of other objects.

For example, we define a `Customer` object with data and functions. When our `User` converts, we want to add the `Customer` stuff our user instance.

```javascript
const Customer = {

}
```

When we want to supply a object with some additional capability, higher order objects cover every use case.

Favor composition over class inheritance because  composition is [simpler, more expressive, and more flexible](https://medium.com/javascript-scene/3-different-kinds-of-prototypal-inheritance-es6-edition-32d777fa16c9):

> Classical inheritance creates **is-a** relationships with restrictive taxonomies, all of which are eventually wrong for new use-cases. But it turns out, we usually employ inheritance for **has-a**, **uses-a**, or **can-do** relationships.

# Resources

* [JavaScript Factory Functions vs Constructor Functions vs Classes](https://medium.com/javascript-scene/javascript-factory-functions-vs-constructor-functions-vs-classes-2f22ceddf33e)
* [How to Use Classes and Sleep at Night](https://medium.com/@dan_abramov/how-to-use-classes-and-sleep-at-night-9af8de78ccb4)
* [Master the JavaScript Interview: What’s the Difference Between Class & Prototypal Inheritance?](https://medium.com/javascript-scene/master-the-javascript-interview-what-s-the-difference-between-class-prototypal-inheritance-e4cd0a7562e9)
* [ES6 — classes and inheritance](https://medium.com/ecmascript-2015/es6-classes-and-inheritance-607804080906)
* [JavaScript Objects In Detail](http://javascriptissexy.com/javascript-objects-in-detail/)
* [Factory Function Patterns In Depth](https://medium.com/@pyrolistical/factory-functions-pattern-in-depth-356d14801c91)
* [Elegant patterns in modern JavaScript: Ice Factory](https://medium.freecodecamp.org/elegant-patterns-in-modern-javascript-ice-factory-4161859a0eee)
* [Small Functions considered Harmful](https://medium.com/@copyconstruct/small-functions-considered-harmful-91035d316c29)
