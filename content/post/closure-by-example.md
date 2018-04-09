---
title: "Closure By Example"
date: 2018-04-06T20:25:10-04:00
categories:
  - blog
tags:
  - JavaScript
draft: true
---


### What is Closure?

[One definition](https://medium.freecodecamp.org/lets-learn-javascript-closures-66feb44f6a44) is this:
> Closures are functions that refer to independent (free) variables. In other words, the function defined in the closure ‘remembers’ the environment in which it was created.

[Another definition](https://medium.freecodecamp.org/3-questions-to-watch-out-for-in-a-javascript-interview-725012834ccb)
> A closure is basically when an inner function has access to variables outside of its scope. Closures can be used for things like [implementing privacy](https://medium.com/written-in-code/practical-uses-for-closures-c65640ae7304) and creating [function factories](https://medium.com/javascript-scene/javascript-factory-functions-vs-constructor-functions-vs-classes-2f22ceddf33e#.1817w0lmb).

I like this definition from [Secrets of the JavaScript Ninja](https://www.manning.com/books/secrets-of-the-javascript-ninja-second-edition) better:
>A closure is a way to access and manipulate external variables from within a function.


### Tricky Questions on Closure and Scoping in JS

1. What will this output?

	```javascript
	for (var i = 0; i < 3; i++) {
	  setTimeout(function() { console.log(i); }, 1000 + i);
	}
	```
	[Solution](https://coderbyte.com/algorithm/3-common-javascript-closure-questions)

2. What will this output?

	```javascript
	const arr = [10, 12, 15, 21];
	for (var i = 0; i < arr.length; i++) {
	  setTimeout(function() {
	    console.log('Index: ' + i + ', element: ' + arr[i]);
	  }, 3000);
	}
	```
	[Solution](https://medium.com/coderbyte/a-tricky-javascript-interview-question-asked-by-google-and-amazon-48d212890703)

3. Write a function that would allow you to do this.

	```javascript
	var addSix = createBase(6);
	addSix(10); // returns 16
	addSix(21); // returns 27
	```

	Solution:

	```javascript
	var createBase = (base) => (num) => base + num
	var addSix = createBase(6)
	addSix(10) //> 16
	addSix(21) //> 21
  ```
