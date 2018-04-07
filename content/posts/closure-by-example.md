---
title: "JavaScript Scoping Gotchas"
date: 2018-04-06T20:25:10-04:00
draft: true
tags:
- JavaScript
- Gotchas
- Programming
---

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
