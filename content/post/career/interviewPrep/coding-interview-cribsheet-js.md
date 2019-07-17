---
title: "Cribsheet for JavaScript Coding Interview"
date: 2018-10-25
categories:
  - blog
tags:
  - JavaScript
  - Guide
  - Programming
thumbnailImagePosition: left
thumbnailImage: /post/images/programming/coding-interview.png
---

The coding interviews / coding challenges are designed to assess how productive someone can be with the language. In contrast to the algorithm whiteboarding interview, which assesses how the candidate go about solving a problem, or the architecture design interview, which assesses how the candidate's experience in system engineering and product design, the coding interview is is utilized by the company interviewing you to answer one question:

> Can you be productive with JavaScript?

<!--more-->

You are usually given the flexibility of choosing the language you are most comfortable with to complete the coding challenge. Thus it's expected you know how to take advantage of all the language specific features and deal with the language specific idiosyncrasies (JavaScript has a lot) to solve problems.

These tests are also designed to gauge your knowledge of computer science fundamentals like various data structures (e.g., arrays, strings, object/dictionaries), logic building blocks (e.g., loops, if-statements, functions), and problem solving patterns (e.g., recursion, pattern matching, higher order functions).

For coding challenges, there's always a time limit. The faster you can solve a problem correctly, the better. Thus, this post introduces JavaScript features, best practices,  to leverage and common pitfalls to avoid to help you get productive with JavaScript and get the right result quickly.

<!-- toc -->

For more extensive cheatsheet, check out [Let's Get Productive With JavaScript](https://xiaoyunyang.github.io/post/lets-get-productive-with-javascript/)

# Working with Strings

## Regex

In a nutshell, regular expression, or regex for short, are patterns you specify to test a string. There are whole books written about regexes. We are going to focus on the most likely problem we're going to need to solve with regex during a coding challenge:

> Does the string contain this pattern? If so, how many times does this pattern appear? Where does it appear?

Let's consider this coding challenge:

> Given a string, determine if the string is a url.

We can assume we only want to test for websites with the .com and .org top level domains. We don't care if the website actually exists or not.

Input and expected output:

* "google.com" → true
* "www.icann.org" → true
* "google.foobar" → false

```javascript
const isStrUrl = str => {
  const matchTld = /(\.com|\.org)$/i
  return matchTld.test(str);
};
```


The `matchTld` is the regex that specifies that we are looking for a string that ends with `.com` or `.org`. The `\.` escapes the dot (`.`). The `$` at the end of the regex means this pattern should appear at the end of the string. In summary:


{{< image classes="fancybox fig-75 center clear" src="/post/images/programming/regex-url.png"
thumbnail="/post/images/programming/regex-url.png" title="Regex URL">}}

You can match an exact sequence in the string using the following regex:

```javascript
const matchApple = /^apple$/
matchApple.test('apple'); //> true
matchApple.test('orange'); //> false
matchApple.test('apples'); //> false
matchApple.test('Apple'); //> false
```

The caret (`^`) and the dollar sign (`$`) signal "match from the beginning" and "match until the end", respectively.

As illustrated with the above example, regex is case sensitive.

If you want to match a sequence of characters regardless of whether the letters are upper case or lower case, you could convert every letter in the string to lowercase, then do the pattern matching:

```javascript
const str = 'Apple'.toLowerCase();
matchApple.test(str); //> true
```

Other useful regexes include:

* whitespace: `/^\s$/`

## String manipulation

Suppose we have a string containing alphanumeric characters sprinkled with some illegal characters, in particular, angle brackets, forward slash, backward slash, and quote. We want to remove the illegal characters and retain just the letters. How would we go about this string manipulation?

Using regex:

```javascript
const dirtyStr = "<script>window.location=\"http://evil.com\"</script>";
const matchIllegals = /<|>|\\|\/|"/g;
const cleanStr = dirtyStr.replace(matchIllegals, "");
console.log(cleanStr); //> scriptwindow.location=http:evil.comscript
```

We are using the JavaScript built-in function for string, i.e., `replace`, to replace every angle bracket, slash, and quote in the string with empty string, effectively removing them from the string.

## Get Characters from String

`str.chartAt(i)` gives us the character at a index `i` from `str`.

```javascript
let str = 'hello'
str.charAt(0) //> 'h'
str.charAt(str.length-1) //> 'o'
str.charAt(str.length) //> ''
```

What happens if we do the following?

```javascript
str.charAt(str.length) //> ''
```

It returns an empty string! You don't get any help like the index out of bounds error that people who work with a statically typed language with a compiler like Java would be familiar with. This could be a really nasty bug. A similar thing happens with arrays when you access an index out of bound array element:  `arr[arr.length]` gives you `undefined`.

Getting Multiple Characters (Substrings)

Say we have "hello world" as our string but we only want "world". What do we do? Slice recursively. "hello" plus space is 6 characters.

```javascript
"hello world".slice(6) //> "world"
```

Using `slice` works because a string is really just an array of characters.

A more general function for obtaining the substring is appropriately called `substring` and it takes two arguments: where to start (inclusive) and where to stop (exclusive). Here's how you use substring:

```javascript
'hello'.substring(0, 2); //> 'he'
```

However, using `slice` and `substring` for extracting the sub-string requires knowing exactly where is the starting index is. Usually, the substring we want to extract are delimited by a space or a special character such as a slash. Suppose we have the following problem:

> Get the username from the Medium url for user profile.

Usually, webpages for user profile pages on social networking websites have the following form:

```
https://<domainName>/<route>/<username>
```

What we want is the username at the end. Since `domainName` and `route` could be arbitrarily long, we can't use `slice` to solve our problem. What we can do is this:

```javascript
const getUsername = url => {
  return url.split('/').pop().slice(1);
};

getUsername('https://medium.com/@xiaoyunyang') //> xiaoyunyang
```

`getUsername` function has a one-liner solution but there are few things going on:

1. `split('/')` splits the url string into an array of substrings using the slash (`/`) as delimiter. The output of the `split('/')` operated on our example url becomes `[ 'https:', '', 'medium.com', '@xiaoyunyang' ]`, which gets piped into the next operation `pop()`.
2. `pop()` is a built-in function for arrays we will discuss later. What it does is it returns the last element of the array and in the process, mutating the original array. `pop()` could get us in hot water (we will discuss later in the arrays section) because it's mutating the original array but in this case, it's okay because the array we got from `split` is an intermediate throw-away data structure that we are only using for deriving the final result. The `pop()` operation gives us `@xiaoyunyang`, which we pipe into the next operation.
3. `slice(1)`, as discussed above, returns the substring starting from index 1 until the end of the array. This effectively chops off the `@` and gives us `xiaoyunyang`, which is the username.

# Working with Arrays

When we work with arrays in JavaScript, we have a whole suite of built-in functions we can use. This section discusses those functions that returns arrays or mutates the original array. A later section will discuss how to use JavaScript built-in functions for arrays to transform the array to other data types.

## Add things to an array and combine arrays

Mutable

* `array.push(elem)` - adds `elem` to the end of `array`
* `array.unshift(elem)` - adds `elem` to the beginning of `array`

Example:

```javascript
const mutatingAdd = [1, 2, 3];

mutatingAdd.push(4); //> [1, 2, 3, 4]
mutatingAdd.unshift(0); //> [0, 1, 2, 3, 4]

console.log(mutatingArr); //> [0, 1, 2, 3, 4]
```

Immutable

* `array.concat(elem)` - adds elem to the front or back of an array without mutating the original array.
* `[...arr1, ...arr2]` - ES6 Spread operator to merge two arrays
* `[elem, ...arr2]` - ES6 add elem to head of the array
* `[...arr1, elem]` - ES6 add elem to tail of the array

Example with concat:

```javascript
const arr0 = [0];
const arr1 = [1, 2];
const arr2 = [3, 4];

const arr3 = arr1.concat(arr2); //> [1, 2, 3, 4]
const arr4 = arr0.concat(arr3); //> [0, 1, 2]
const arr5 = arr0.concat(arr1, arr2) //> [0, 1, 2, 3, 4]
```

Example with spread operator

```javascript
const arr0 = [0];
const arr1 = [1, 2];
const arr2 = [3, 4];

const arr3 = [...arr1, ...arr2]; //> [1, 2, 3, 4]
const arr4 = [...arr0, ...arr1]; //> [0, 1, 2]
const arr4_altern = [0, ...arr1]; //> [0, 1, 2]
const arr5 = [...arr0, ...arr1, ...arr2]; //> [0, 1, 2, 3, 4]
```

## Extract and remove things from an array

We can access elements in the array using the index. This pattern is commonly used in many other programming elements. This section goes into more details about how to take advantage of JavaScript-specific built-in function to speed up problem solving.

A common thing we need to do with arrays is to remove the last thing in the array. Since the goal is to mutate the original array, one convenient function helps us do exactly that:

`array.splice(-1)` - return the tail of `array` as an array and mutates `array`

Example:

```javascript
const arr = [0, 1, 2];
const tailArr = arr.splice(-1);
console.log(tailArr) //> [2]
console.log(arr) //> [0, 1]
```

One gotcha with using `splice` in this way is `arr.splice(-1)` returns the tail element of `arr` wrapped in an array. If you just want `elem`, you can use ES6 destructuring:

```javascript
const [tail] = tailArr;
console.log(tail); //> 2
```

Unfortunately, ES6 destructuring does not support extraction of last element of an array. However, ES6 destructuring and rest operator is very useful for returning the head of the array as `elem` instead of an array containing an `elem` without mutating the rest of the array:

```javascript
const arr = [0, 1, 2];
const [head, ...rest] = arr;
console.log(head); //> 0
console.log(rest); //> [1, 2]
console.log(arr); //> [0, 1, 2]
```

In fact, you can use ES6 destructuring to get extract more than one elements from the array starting from the head of the array:

```javascript
const arr = [0, 1, 2, 3, 4, 5];
const [first, second, third, ...rest] = arr;
```

If you just want to return the last element of the array without mutating the original array, we can use `arr.slice(-1)`:

```javascript
const arr = [0, 1, 2];
const tailArr = arr.slice(-1);
console.log(tailArr); //> [2]
console.log(arr); //> [0, 1, 2]
```

`slice` and `splice` are useful for extracting any part of the array, not just the tail. The general way you use these functions is `arr.slice(from, until)` and `arr.splice(from, until)` where `from` and `until` are indices.  The sub-array returned from these operations includes the element at index `from` until the element that precedes index `until`. For example:

```javascript
const numbers = [0, 1, 2, 3, 4];
const lessThanThree = numbers.slice(0, 3); //> [0, 1, 2]
const moreThanTwo = numbers.splice(2, numbers.length); //> [2, 3, 4]
console.log(numbers); //> [0, 1]
```

Beware! If you reversed the order in which you use `slice` and `splice`, in the code above, the code will not have any run-time errors but you're going to have some nasty logic bugs:

```javascript
const numbers = [0, 1, 2, 3, 4];
const moreThanTwo = numbers.splice(2, numbers.length); //> [2, 3, 4]
const lessThanThree = numbers.slice(0, 3); //> [0, 1]
console.log(lessThanThree); //> [0, 1] ... not [0, 1, 2] as we expect
```

Therefore, when you are trying to quickly solve a programming problem correctly, be absolutely disciplined about using immutable functions like `slice` and ES6 destructuring so you're not spending 10 minutes of your 30 minute coding challenge time debugging this bug.

## Sorting things in Array

Suppose we have the following numbers we would like to sort:

```javascript
const nums = [3, 2, 7, 1, 2, 0];
```

Sort in ascending order:

```javascript
nums.sort((a,b) => {
  return a-b
});

console.log(nums) //> [ 0, 1, 2, 2, 3, 7 ]
```

Sort in descending order:

```javascript
nums.sort((a,b) => {
  return b-a
});

console.log(nums); //> [ 7, 3, 2, 2, 1, 0 ]
```

It's important note that the `sort` function mutates the original array!

If you don't pass in a function, `sort` will by default give you the mutated array in ascending order.

```javascript
const letters = ['c', 'r', 'a', 'b', 'a', 't']
letters.sort()
letters //> [ 'a', 'a', 'b', 'c', 'r', 't' ]
```

Another useful function is `String.prototype.localeCompare`.

```javascript
const letters = ['c', 'r', 'a', 'b', 'a', 't']
letters.sort((a,b) => {return b.localeCompare(a)})
letters //> [ 't', 'r', 'c', 'b', 'a', 'a' ]
```

# Working with Objects

JavaScript Objects are used to store key-value pairs and can nest other objects as deep as you want. In JavaScript, arrays are actually objects where the keys are numbers. I can make an array using an object notation:

```javascript
const arr1 = {
    0: 0,
    1: 1,
    2: 2
}
const arr2 = [0, 1, 2];
```

The syntax  I use to access the elements from the object and array are indistinguishable:

```javascript
arr1[1] //> 1
arr2[1] //> 1
```

This is how I remember the rules for accessing the value of an object using the key - it looks just like the way you access the element of an array at a given index!

```javascript
const basket = {
    'apple': 1,
    'pear': 2
}
const numApple = basket['apple']; //> 1
const numPear = basket['pear']; //> 2
```

## Size of object

* `Object.keys(dict).length` gives you the number of entries in the object called `dict` (short for dictionary).

Example:

```javascript
let basket = {};
Object.keys(basket).length; // 0
basket = {apple: 2}
Object.keys(basket).length; // 1
```

## Merging two objects

* Use spread operator

There's a more verbose way of doing it but we are using ES6's spread operator here:

```javascript
const foo = {a: 'a', b: 'b'}
const bar = {c: 'c', d: 'd'}
const foobar = {...foo, ...bar} //> {a: "a", b: "b", c: "c", d: "d"}
```

you can also use the spread operator to make a deep copy of the object.

```javascript
const foobarCpy = {...foobar} //> {a: "a", b: "b", c: "c", d: "d"}
```

Consistent with the tip above for preferring `slice` over `splice` for array operations, we want to err on the side of immutability. We want to make deep copies of things before we start changing things in arrays and objects to avoid nasty bugs and side effects. Assigning objects to another variable does not make a copy of the object, rather, it creates a new reference to the original object:

```javascript
const basket = {
    apple: 1,
    pear: 2
}

basket2 = basket;
basketCpy = {...basket};
console.log(basket === basket2); //> true
console.log(basket === basketCpy); //> false
```

## Add and remove things from object

Add to object (functional way):

```javascript
const addToDict = (dict, newKey, newVal) => {
  if (dict[newKey]) return dict;
  const newDict = {...dict};
  newDict[newKey] = newVal;
  return newDict;
};
```

Delete from object (functional way):

```javascript
const deleteFromDict = (dict, newKey, newVal) => {
  if (!dict[key]) return dict;
  const newDict = {...dict};
  newDict[key] = newVal;
  return newDict;
};
```

Sometimes for performance reasons, it's desirable to add/delete from object by mutating the object:

```javascript
const foobar = {'foo': 'foo', 'bar': 'bar'};
delete foobar['bar'];
foobar['baz'] = 'baz';
console.log(foobar); //> { foo: 'foo', baz: 'baz' }
```

## Compare two objects

What if you have two dictionaries and you want to see if they are equal? The trick is to use `JSON.stringify`.

```javascript
let dict1 = {};
dict1['a'] = 1;
dict1['b'] = 2;

let dict2 = {};
dict2['a'] = 1;
dict2["b"] = 2;

JSON.stringify(dict1) === JSON.stringify(dict2); //> true

dict1['a'] = 2;
JSON.stringify(dict1) === JSON.stringify(dict2); //> false
```

## Making A Deep Copy of Object

Once again the trick is to use `JSON.stringify` along with `JSON.parse`.

```javascript
const makeDeepCopy = obj => {
  return JSON.parse(JSON.stringify(obj))
}
```

# Conversion Between Data Types

We can use functions to transform between these data types as depicted in the graph below:

{{< image classes="fancybox fig-75 center clear" src="/post/images/programming/data-type-conversion.png"
thumbnail="/post/images/programming/data-type-conversion.png" title="Conversion Between Different Data Types">}}

# Generating a Random Number

The following function returns a random number between min (inclusive) and max (exclusive):

```javascript
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
```

If we want to generate a random integer between min (inclusive) and max (exclusive):

```javascript
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
```

# Data Structures

## Linked List

Basic operations are `appendToHead`, `appendToTail`.
Linked List provides O(1) appendToHead operations but O(N) look up.

```javascript
function ListNode(val) {
  this.val = val;
  this.next = null;
}
```

```javascript
ListNode.prototype.appendToTail = function(val) {
  let curr = this
  while(curr) {
    if(!curr.next) {
      curr.next = new ListNode(val)
      return this
    }
    curr = curr.next
  }
  return this
}
```

```javascript
ListNode.prototype.appendToHead = function(val) {
  let head = new ListNode(val)
  head.next = this
  return head
}
```

## Stack

Basic operations are:

* `push(item)` - adds item to top of stack -  O(1)
* `pop()` - remove the top item from the stack - O(1)
* `peek()` - returns top of the stack - O(1)
* `isEmpty()` - returns true if stack is empty - O(1)

We can use JavaScript's array object as a stack.

For example:

```javascript
const browserHistory = []
const clickLink = link => {
  browserHistory.push(link)
}
const clickBackBtn = () => {
  browserHistory.pop()
}
clickLink('facebook.com')
console.log(browserHistory) //> [ 'facebook.com' ]
clickLink('medium.com')
console.log(browserHistory) //> [ 'facebook.com', 'medium.com' ]
clickBackBtn()
console.log(browserHistory) //> [ 'facebook.com' ]
clickLink('youtube.com')
console.log(browserHistory) //> [ 'facebook.com', 'youtube.com' ]
```

Problem to be solved using a stack is Palindrome

```javascript
// palindrome (odd number): racecar, dad
// palindrom (even number): abba
// ignore space?
function isPalindrome(str) {
  let seen = [] //> stack

  // construct stack
  for(let i=0; i<str.length; i++) {
    let curr = str.charAt(i)
    seen.push(curr)
  }
  let revStr = ''

  // construct reverse string
  while(seen.length > 0) {
    revStr += seen.pop()

    //optimization
    if(revStr!==str.substring(0,revStr.length)) {
      return false
    }
  }

  return str === revStr
}
```

## Queue

* `add(item)` - add an item to the end of the list - O(1)
* `remove()` - remove the first item in the list - O(1)
* `peek()` - return the front of the queue
* `isEmpty()` - return true if the queue is empty

How to implement a Queue in JavaScript (See [repl](https://repl.it/@xiaoyunyang/Queue))

```javascript
function DoublyNode(val) {
  this.val = val;
  this.prev = null
  this.next = null
}
function Queue() {
  this.front = null
  this.back = null

  this.add = item => {
    let newNode = new DoublyNode(item)
    if(!this.front) {
      this.front = newNode
      this.back = newNode
      return
    }
    this.back.next = newNode
    newNode.prev = this.back
    this.back = newNode
  }
    this.printForward = () => {
    let vals = ''
    let n = this.front
    while(n) {
      vals += `${n.val} -> `
      n = n.next
    }
    return `${vals}null`
  }
  this.printBackward = () => {
    let vals = ''
    let n = this.back
    while(n) {
      vals = ` <- ${n.val}`.concat(vals)
      n = n.prev
    }
    return `null${vals}`
  }
  this.remove = () => {
    // remove from the front and return the removed node's val
    if(!this.front) return null
    let firstNode = this.front
    this.front = this.front.next
    // edge case: if this.front.next is null, the next line of
    // code will fail because can't dereference null pointer
    if(this.front) {
      this.front.prev = null
    } else {
      this.back = null
    }
    firstNode.next = null
    return firstNode.val
  }

  this.peek = () => {
    if(!this.front) return null
    return this.front.val
  }
}
```

# Shortcuts

## Initialize Array

```javascript
let arr = Array(10);
console.log(arr); //> [ <10 empty items> ]
```

## Find Max

```javascript
const arr = [1, 2, 3]
Math.max(...arr)
```

There's a few gotchas associated with `Math.max`. Consider if you have an array in which contains `null` or `undefined`:

```javascript
console.log(Math.max(...[null, null])); //> 0
console.log(Math.max(...[null, 1])); //> 1
console.log(Math.max(...[undefined, undefined])); //> NaN
console.log(Math.max(...[undefined, null, 1])); //> NaN
```

Empty elements in the array is the same as `undefined`:

```javascript
const foo = Array(3)
foo[0] = 2
console.log(Math.max(...foo)) //> NaN
```

## Swapping

```javascript
let a = 'hello';
let b = 'world'
[a, b] = [b, a];
console.log(a) //> 'world'
console.log(b) //> 'hello'
```

## Generating a sequence

```javascript
const indices = Array.from(Array(10).keys());
console.log(indices); //> (10) [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## Use Splice to insert into array

Let's write a function that insert a new element into a sorted array. splice is very handy in this situation.

```javascript
function insertIntoSorted(newItem, sortedItems) {
  let arr = sortedItems
  for(let i in arr) {
    let curr = arr[i];
    if(newItem<curr) {
      arr.splice(i, 0, newItem);
      return arr;
    }
  }
  arr.push(newItem);

  return arr;
}
```

In action:

```javascript
let arr = [1,2,5,9]
arr = insertIntoSorted(10, arr)
console.log(arr) //> [ 1, 2, 5, 9, 10 ]

arr = insertIntoSorted(4, arr)
console.log(arr) //> [ 1, 2, 4, 5, 9, 10 ]

arr = insertIntoSorted(0, arr)
console.log(arr) //> [ 0, 1, 2, 4, 5, 9, 10 ]
```

## Optional Parameter

ES6 shortcut using default value:

```javascript
function foo(fruit='apple') {
  let toPrint = fruit
  console.log('word:', toPrint)
}
```

As opposed to the old way of doing it using ternary operator:

```javascript
function foo(fruit) {
  let toPrint = fruit ? fruit : 'apple'
  console.log('word:', toPrint)
}
```

## Quickly convert string to number

Prepending `+` to the string is a shorthand for converting the string to a number.

```javascript
const [a,b,c] = [+'1', +'1.5', +'foo'];
console.log(a); //> 1
console.log(b); //> 1.5
console.log(c); //> NaN
```

## Different kinds of loop

Suppose we have the following data we want to loop through:

```javascript
let colors = ['red', 'blue', 'green', 'purple', 'yellow'];
```

We could do a simple for-loop:

```javascript
for(let i=0; i<colors.length; i++) {
  console.log(colors[i])
}
```

There's a less verbose way of achieving the same thing:

```javascript
for(let i in colors) {
  console.log(colors[i]);
}
```

If we don't are about the index but just the value, we could use `forEach`:

```javascript
colors.forEach(color => {
  console.log(color)
});
```

For some algorithms, we may need to use the while-loop:

```javascript
while(colors.length > 0) {
  let color = colors.shift();
  console.log(color);
}
```

Note, the while-loop operation above mutates the original array!

To loop through an object, we could do the following:

```javascript
let keycodeMapping = {
  65: 'a',
  66: 'b',
  187: '=',
  191: '/'
};

Object.keys(keycodeMapping).forEach(key => {
  console.log('keycode, value:', key, keycodeMapping[key]);
});
```

# Tips for writing Good JS Code

## Tip #1: Use let and const instead of var

- Use `const` for unchanging values.
- Use `let` for changing values.

`var` is scoped to the function while `let` is scoped to the [block](https://edgecoders.com/function-scopes-and-block-scopes-in-javascript-25bbd7f293d7). `let` also [prevents re-declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Description) of variables in the same scope.

Here's an example to understand the differences between `let` and  `var`. ([try it out in repl](https://repl.it/@xiaoyunyang/let-v-var))

{{< codeblock "let-v-var.js" >}}
function foo() {
  let res = ''
  let j = 10

  for(let i=0; i<j; i++) {
    // uncommenting ... the following line causes error
    // var j = 5
    res += `${j}, `
    j -= 1
  }
  res += `${j}`
  console.log(`foo: ${res}`)
}

function bar() {
  let res = ''
  let j = 10

  for(let i=0; i<j; i++) {
    let j = 5
    res += `${j}, `
    j -= 1
  }
  res += `${j}`
  console.log(`bar: ${res}`)
}

function baz() {
  let res = ''
  var j = 10

  for(let i=0; i<j; i++) {
    var j = 5
    res += `${j}, `
    j -= 1
  }
  res += `${j}`
  console.log(`baz: ${res}`)
}
{{< /codeblock >}}

What do we expect logged to console when we run `foo()`, `bar()` and `baz()`? 

```
foo: 10, 9, 8, 7, 6, 5
bar: 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10
baz: 5, 5, 5, 5, 4
```

Let's discuss what's happening in each function to fully appreciate the nuances between `var` and `let`.

**foo:**<br/>
Line 7 is commented out because it causes the "duplicate declaration" error because `var` is scoped to the `foo` function and on line 3, `j` is already declared and scoped to `foo` using the `let` keyword. Variables declared using `let` is protected from re-decalaration in the same scope. What happens if we declare `j` on Line 3 using `var` and declare `j` on Line 7 using `let`? The result is going to be same as `bar`. Why?

**bar:**<br/> 
The `j` in the condition of the for-loop on line 19 is the same `j` that's declared on line 17. The `j` that is being concatenated to `res` on line 21 is the same `j` that is declared on line 20. Line 20 does not cause the "duplicate decalaration" error because the `let` keyword is used so a new variable is created which is scoped ot the for-loop. When accessing `j` on line 21, the one that is closest to the current scope is used. Therefore, `bar` prints out 10 "5"s, followed by one "10" at the end. The fact that `j` is "10" before the function returns confirms that the `j` declared on line 17 is never changed and and that a new `j` is created on line 20.

**baz:**<br/>
Both the `j`s declared on line 30 and 33 are scoped to the `baz` function. We can re-declare `j` on line 33 because `j` is originally declared on line 30 and `var` doesn't have re-declaration protection. The two `j`s are the same. On line 33, `j` is reassigned as 5. So what is value of `j` on Line 32 which is being compared with `i`? The first time the for-loop is run, it's 10. The subsequent runs, it's 5. Therefore, the result of `bar` is four 5's, followed by a 4.

## Tip #2 Avoid Side Effects

Suppose we want to sort a shuffled array, then print out the shuffled array and the sorted array. Let's implement the `sortArr` function to accomplish that:


```javascript
function sortArr(arr) {
  return arr.sort((a,b) => a-b)
}
```

When we run the following code, we get an incorrect result when we print out the original array:

```javascript
const arr = [3,2,4,1]
const sortedArr = sortArr(arr)

console.log(arr) //> [ 1, 2, 3, 4 ]
console.log(sortedArr) //> [ 1, 2, 3, 4 ]
```

`Array.sort` mutates the original array! This is a side effect we'd like to avoid.

To fix this problem, we make a copy of the original array, then sort that copy:

```javascript
function sortArr(arr) {
  const arrCpy = [...arr]
  return arrCpy.sort((a,b) => a-b)
}
```

# Study material for JS interviews:

- [What is a Closure?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-closure-b2f0d2152b36#.ecfskj935)
- [What is the Difference Between Class and Prototypal Inheritance?](https://medium.com/javascript-scene/master-the-javascript-interview-what-s-the-difference-between-class-prototypal-inheritance-e4cd0a7562e9#.h96dymht1)
- [What is a Pure Function?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976#.4256pjcfq)
- [What is Function Composition?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-function-composition-20dfb109a1a0#.i84zm53fb)
- [What is Functional Programming?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-functional-programming-7f218c68b3a0#.jddz30xy3)
- [Functional Programming Pattern in React and Redux](https://medium.com/@agm1984/an-overview-of-functional-programming-in-javascript-and-react-part-one-10d75b509e9e) - unidirectional data flow and immutability (same input, same output every time. no side effects).
- [What is a Promise?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-promise-27fc71e77261#.aa7ubggsy)
- [Soft Skills](https://medium.com/javascript-scene/master-the-javascript-interview-soft-skills-a8a5fb02c466)
- [Common Data Structures](https://medium.freecodecamp.org/10-common-data-structures-explained-with-videos-exercises-aaff6c06fb2b)
- Google's Livebook: [Site Reliability Engineering](https://landing.google.com/sre/sre-book/toc/index.html)
- [How to refactor code to be more testable](https://hackernoon.com/how-to-refactor-unwieldy-untestable-code-4a73d75cb80a)
- Steve Armstrong's [article about ES6](https://tech.smartling.com/wake-up-tomorrow-and-start-using-es6-universal-language-f8380442816e)
- [Let's get productive with JavaScript](https://xiaoyunyang.github.io/post/lets-get-productive-with-javascript/)