---
title: "How to do Object Oriented Programming in JavaScript"
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
thumbnailImagePosition: top
thumbnailImage: /post/images/jsDev.png
---

Object Oriented Programming (OOP) is a software design pattern that allows you to think about problems in terms of objects and their interactions. OOP is typically done with classes or with prototypes. Most languages that implement OOP (e.g., Java, C++, Ruby, Python) use class-based inheritance. JavaScript implement OOP via Prototypal inheritance.

<!--more-->

# Primer: What is an Object?
OOP is concerned with composing objects with that manages simple tasks to create complex computer programs. Objects have a notion of self and reused behavior inherited from a blueprint (classical inheritance) or other objects (prototypal inheritance).

The goal of inheritance is to speed up development by promoting code reuse.

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

We instantiate an object called `celebrity` from the `Person` class with the `new` key word as follows:

```javascript
let celebrity = new Person('Chris', 'Pratt')
celebrity.getFullName() //> "Chris Pratt"

// We can use an accessor function or access directly
celebrity.firstName //> "Chris"
celebrity.lastName //> "Pratt"
```

Objects created using the `new` keyword are mutable. In other words, changes to a class affects all objects created from that class and all derived classes which *extends* from the class.

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
  let user = new User('Chris', 'Pratt', 'chris@pratt.com', 'lolWut')
  user.getFullName() //> "Chris Pratt"
  user.getEmail() //> "chris@pratt.com"
  user.getPassword() //> "lolWut"

  user.firstName //> "Chris"
  user.lastName //> "Pratt"
  user.email //> "chris@pratt.com"
  user.password //> "lolWut"
}
```

That seems to work just fine but there's a big design flaw with using the classical inheritance approach: **How the heck do the users of the `User` class (e.g., `App`) know `User` comes with firstName and lastName and there's a function called `getFullName` that can be used?** Looking at the code for `User` class does not tell us anything about the data or methods from its super class. We have to dig into the documentation or trace code through the class hierarchy.

As Dan Abramov [puts it](https://medium.com/@dan_abramov/how-to-use-classes-and-sleep-at-night-9af8de78ccb4):

> The problem with inheritance is that the descendants have too much access to the implementation details of every base class in the hierarchy, and vice versa. When the requirements change, refactoring a class hierarchy is so hard that it turns into a WTF sandwich with traces of outdated requirements.

Classical inheritance is based on establishing relationships through dependencies. The base class (or super class) sets the baseline for the derived classes. Classical inheritance is OK for small and simple applications that don't often change and has no more than one level of inheritance (keeping our inheritance trees shallow to avoid [The Fragile Base Class](https://www.wikiwand.com/en/Fragile_base_class) problem) or wildly different use cases. Class-based inheritance can become unmaintainable as the class hierarchy expands.

Eric Elliot described how classical inheritance can potentially lead to project failure, and in the worst cases, [company failures](https://medium.com/javascript-scene/inside-the-dev-team-death-spiral-6a7ea255467b):

> Get enough clients using `new`, and you can’t back out of the constructor implementation even if you want to, because code you don’t own will break if you try.

When many derived classes with wildly different use cases are created from the same base class, any seemingly benign change to the base class could cause the derived classes to malfunction. At the cost of increased complexity to your code and the entire software creation process, you could try to bandage mitigate side effects by creating a dependency injection container to provide an uniform service instantiation interface by abstracting the instantiation details. Is there a better way?


### Prototypal Inheritance
Prototypal inheritance do not use classes at all. Instead, objects are created from other objects. We start with a *generalized object* we called a prototype. We can use the prototype to create other by cloning it or extend it with custom features.

Although in the previous section, we showed how to use the ES6 `class`, [**JavaScript classes are not classy**](https://medium.freecodecamp.org/elegant-patterns-in-modern-javascript-ice-factory-4161859a0eee).

```javascript
typeof Person //> "function"
typeof User //> "function"
```

ES6 classes are actually [syntactic sugar](https://stackoverflow.com/questions/36419713/are-es6-classes-just-syntactic-sugar-for-the-prototypal-pattern-in-javascript/36419728) over JavaScript's existing prototypal inheritance. Under the hood, creating a class with a `new` keyword creates a function object with code from the `constructor`.

JavaScript is fundamentally a prototype-oriented language.

{{< blockquote "Douglas Crockford (Inventor of JSON)" "https://www.amazon.com/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742" "JavaScript: The Good Parts" >}}
The simple types of JavaScript are numbers, strings, booleans (true and false), null, and undefined. All other values are objects.  Numbers, strings, and booleans are object-like in that they have methods, but they are immutable. Objects in JavaScript are mutable keyed collections. In JavaScript, arrays are objects, functions are objects, regular expressions are objects, and, of course, objects are objects.
{{< /blockquote >}}

Let's look at one of these objects that JavaScript gives us for free out-of-the-box: the `Array`.

Array instances inherit from [Array.prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype) which includes many methods which are categorized as accessors (do not modify the original array), mutators (modifies the original array), and iterators (applies the function passed in as an argument onto every element in the array).

* Accessors: [`Array.prototype.includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes), [`Array.prototype.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
* Mutators:  [`Array.prototype.push()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push), [ `Array.prototype.pop()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop), [`Array.prototype.splice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice))
* Iterators: [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), [`Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`Array.prototype.forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)


Suppose we want to extend the `Array` prototype by introducing a new method called `partition`, which divides the array into two arrays based on a predicate. For example [1,2,3,4,5] becomes [[1,2,3], [4,5]] if the predicate is "less than or equal to 3". Let's write some code to add `partition` to the Array prototype:

```javascript
Array.prototype.partition = function(pred) {
  let left = []
  let right = []
  for(let i=0; i< this.length; i++) {
    if(pred(this[i])) {
      passed.push(this[i])
    } else {
      failed.push(this[i])
    }
  }
  return [passed, failed];
}
```

Now we can use `partition` on any array:

```JavaScript
[1,2,3,4,5].partition(e => e <=3)
//> [[1, 2, 3], [4, 5]]
```


{{< blockquote "Eric Elliot" "https://medium.com/javascript-scene/master-the-javascript-interview-what-s-the-difference-between-class-prototypal-inheritance-e4cd0a7562e9" "Master the JavaScript Interview: What’s the Difference Between Class & Prototypal Inheritance?" >}} Unlike most other languages, JavaScript’s object system is based on prototypes, not classes. Unfortunately, most JavaScript developers don’t understand JavaScript’s object system, or how to put it to best use. {{< /blockquote >}}


Dan Abramov [advices](https://medium.com/@dan_abramov/how-to-use-classes-and-sleep-at-night-9af8de78ccb4) that

> Instead of creating a class hierarchy, consider creating several factory functions. They may call each other in chain, tweaking the behavior of each other. You may also teach the “base” factory function to accept a “strategy” object modulating the behavior, and have the other factory functions provide it.

# A Third way: No OOP

As Dan Abramov puts it in [How to use Classes and Sleep at Night](https://medium.com/@dan_abramov/how-to-use-classes-and-sleep-at-night-9af8de78ccb4):

* Classes obscure the prototypal inheritance at the core of JS.
* Classes encourage inheritance but you should prefer composition.
* Classes tend to lock you into the first bad design you came up with.

## Object Composition

## Functional composition

Functional Programming provides a way to create complex applications without using classes.
