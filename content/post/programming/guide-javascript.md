---
title: "Let's Get Productive With JavaScript"
date: 2018-02-08
categories:
  - blog
tags:
  - JavaScript
  - Guide
  - Programming
thumbnailImagePosition: top
thumbnailImage: /post/images/jsDev.png
---

JavaScript is one of the most popular and versatile languages today. You can build anything in JavaScript: from full stack web apps, to cross platform mobile apps, to cross platform desktop apps. Here are some useful algorithms and syntax in JavaScript to help you be productive in JavaScript right away. No set up necessary. Just open up your browser's console (hit `Cmd`+`Shift`+`C` if you are using Chrome and Mac) and start typing.

<!--more-->

{{< alert info >}} This is a Live Document. I will be updating it periodically. {{< /alert >}}

{{< toc >}}

# Array

- See [Mutating vs Non-mutating array operation](https://lorenstewart.me/2017/01/22/javascript-array-methods-mutating-vs-non-mutating/)
- Check out [lodash](https://lodash.com/docs/4.17.4#range) and underscore for useful array operators.

## Constructing

### Add things to an array (mutable)

- `array.push(elem)` - adds `elem` to the end of `array`.
- `array.unshift(elem)` - adds `elem` to the beginning of `array`.

```javascript
const mutatingAdd = [1, 2, 3];

mutatingAdd.push(4); //> [1, 2, 3, 4]
mutatingAdd.unshift(0); //> [0, 1, 2, 3, 4]

console.log(mutatingArr); //> [0, 1, 2, 3, 4]
```

### Add things to an array (immutable)

- `array.concat` - add things to the head or tail of an array without mutating the original array.

```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];

const arr3 = arr1.concat(arr2); //> [1, 2, 3, 4]
console.log("arr1", arr1); //> [1, 2]
console.log("arr2", arr2); //> [3, 4]

const arr0 = [0];
const arr4 = arr0.concat(arr3); //> [0, 1, 2, 3, 4]
console.log("arr1", arr1); //> [1, 2]
console.log("arr2", arr2); //> [3, 4]
console.log("arr3", arr3); //> [1, 2, 3, 4]
console.log("arr4", arr4); //> [0, 1, 2, 3, 4]
```

### Create an array Statically

```javascript
let arr = [];
arr[0] = 1; //> [1]
arr[2] = 2; //> [1, empty, 2]

arr[1]; //> undefined
```

### Concatenating

```javascript
const one = ["a", "b", "c"];
const two = ["d", "e", "f"];
const three = ["g", "h", "i"];
// Old way #1
const result = one.concat(two, three);
// Old way #2
const result = [].concat(one, two, three);

// New with ES6 spread operator
const result = [...one, ...two, ...three];
```

Why JavaScript lets you create an array this way is ... different. In Java, arrays have a fixed sized. The space for the array needs to be allocated upfront before you can modify elements. The compiler will yell at you if you are trying to modify the nth element of an array of size n. I suppose in JavaScript, arrays are more like array lists.

### Create an array dynamically

```javascript
let vals = Array.from({ length: 13 }, (v, i) => i);
//> (13) [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

vals = vals.map((v) => v - 1);
//> (13) [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
```

### Array Concatenation

```javascript
let arr1 = [1, 2, 3];
let arr2 = [4, 5];
arr.concat(arr2); //> [1,2,3,4,5]
```

## Destructing

### Get One Element By Index

Given an array:

```JavaScript
const arr = [1, 2, 3, 4];
```

We want to get elements from this array. How?

```javascript
arr[0]; //> 1
arr[3]; //> 4
```

### Get Multiple Elements with slice

Slice lets us remove one or multiple chunks of contiguous elements from the array.

```javascript
let arr = [1, 2, 3];
arr.slice(1); //> [2, 3]
arr.slice(2); //> [3]
arr.slice(3); //> []
```

Note, the following two expressions are equivalent and both gives us the last element of the array:

```javascript
arr.slice(-1); //> [3]
arr.slice(arr.length - 1); //> [3]
```

What happens when we do the following?

```javascript
arr.slice(arr.length + 1); //> []
```

As you expect, if we slice off more things from the array than the array contains, we get an empty array.

### Get Last Element From Array

#### With side effects using Array.pop

```javascript
let arr = [1, 2, 3];
arr.pop(); //> 3
arr; //> [1, 2] ... Very Bad. Your original array got changed

let arr2 = [1, 2, 3];
arr2.pop();
arr2; //> Even const can't help you

let arr3 = arr;
arr3.pop(); //>2
arr; //> [1] ... arr got changed even though arr3 did the pop
```

{{< alert warning >}} Use `arr[arr.length-1]` or `arr.slice(-1)` to get the last element of the array if you don't want to modify the original array. Using `arr.pop()` has the side effect of modifying your original array. {{< /alert >}}

But if the goal is to modify your original array, which we will look at later, then Array.pop() is more efficient than Array.slice since it doesn't need to copy over the array.

#### With no side effects using Array.slice

```javascript
let arr = [1, 2, 3];
arr.slice(-1)[0]; //> 3
arr; //> [1, 2, 3]
```

Or you can try the ES6 syntax for deconstructuring:

```JavaScript
let [last] = arr.slice(-1)
```

More on `Array.slice`:

```javascript
let arr = [1, 2, 3];
arr.slice(-1); //> [3]
arr.slice(0); //> [1, 2, 3]
arr.slice(1); //> [2, 3]
arr.slice(2); //> [3]
```

## Destructuring (ES6)

### Rest Spread

```javascript
let arr = [1, 2, 3, 4];
let [first, second] = arr;
first; //> 1
second; //> 2
```

Using the spread operator `...rest`:

```JavaScript
let [first, ...rest] = arr
first //> 1
rest //> [2, 3, 4]

[first, second, ...rest] = arr
first //> 1
second //> 2
rest //> [3, 4]
```

Destructuring is a shortcut for performing `slice` on the array multiple times:

```javascript
let first = arr.slice(0, 1); //> [1]
let rest = arr.slice(1); //> [2,3,4]
```

### Swapping Hack

```javascript
let a = "world",
  b = ("hello"[(a, b)] = [b, a]);
console.log(a); //> hello
console.log(b); //> world
```

This ES6 hack was [courtesy of Tal Bereznitskey](https://medium.com/dailyjs/7-hacks-for-es6-developers-4e24ff425d0b).

### Async/Await

```javascript
const [user, account] = await Promise.all([fetch("/user"), fetch("/account")]);
```

## Processing

### Remove any Elements From Array

There are two ways to do it: with side effect or without side effect. The side effect is modifying the original array. Let's take a look at both these options.

#### Without Side Effect Using Array.slice

Per the [docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) `slice` takes two arguments:

```
arr.slice([begin[, end]])
```

- `begin` is inclusive and `end` is exclusive.

For example:

```javascript
let arr = [1, 2, 3, 4];

// get elements beginning with the element at arr.length - 1
// in other words, get the last element
arr.slice(-1); //> [4]

// get elements beginning with the last two elements
arr.slice(-2); //> [3, 4]

// get the sub-array from index 0 to index arr.length - 1 (exclusive)
arr.slice(0, -1); //> [1, 2, 3]

// get third element, that is, element at index 2 through 3 (exclusive)
arr.slice(2, 3);
```

#### With Side Effects using Array.splice

{{< alert warning >}} Use `arr[0]` or `arr.slice(1)` to get the first element of the array if you don't want to modify the original array. Using `arr.splice(1)` has the side effect of modifying your original array. {{< /alert >}}

```javascript
arr = [1, 2, 3];
arr[0]; //> 1
arr; //> [1, 2, 3]

arr = [1, 2, 3];
arr.pop(0); //> 1 ... but is O(1)
arr; //> [2, 3]

// Tip:  use Array.slice(1), don't use Array.splice(1). Array.slice and Array.splice are both O(N)
arr = [1, 2, 3];
arr.slice(1); //> [2, 3]
arr; //> [1, 2, 3]

arr = [1, 2, 3];
arr.splice(1); //> [2, 3] ... O(N)
arr; //> [1]
```

### Combine Elements of Array

```javascript
let arr = [1, 2, 3];
let [first, ...rest] = arr;
rest.reduce((sum, elem) => {
  sum + elem;
}, first);
//> total is 6
```

```javascript
["hello", "World"]
  .reduce((res, elem) => res + elem) //> "helloWorld"

  [("a", "b", "c")].reduce((res, elem) => {
    return elem + res;
  }, " is the reverse.");
//> "cba is the reverse."
```

```javascript
["a", "b", "c"]
  .join("") //> "abc"
  [("a", "b", "c")].map((d) => "1" + d)
  .join(","); //> "1a,1b,1c"
```

If you don’t pass in an initial value, reduce will assume the first item in your array is your initial value.

### Combine sub-arrays

```javascript
// Flat

const flat = (data) =>
  data.reduce((total, amount) => {
    return total.concat(amount);
  }, []);

var data = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
flat(data); // [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```

### Sorting

```javascript
["a", "c", "b"]
  .sort((a, b) => a > b) //> ["a", "b", "c"]

  [(1, 3, 2)].sort((a, b) => a - b) //> [1, 2, 3]

  [(1, 3, 2)].sort((a, b) => b - a) //> [3, 2, 1]

  [(1, 3, 2)].sort((a, b) => b > a); //> [3, 2, 1]
```

Find Smallest Number:

```javascript
function findSmallestNum(arr) {
  return arr.sort((a, b) => b - a).pop();
}
```

For sorting an array of alphanumeric characters:

```javascript
["b", "a", "c"].sort(); //> ['a','b','c']
```

# Functions

## The Basics

Functions in JavaScript are objects. Objects are collections of name/value pairs having a hidden link to a prototype object.

The function’s name is optional. The function can use its name to call itself recursively. The name can also be used by debuggers and development tools to identify the function. If a function is not given a name, as shown in the example below, it is said to be anonymous.

Following are identical ways of declaring a function that create a variable called `add` and store a function in it that adds two numbers:

```javascript
var add = function (a, b) {
  return a + b;
};
```

```javascript
function add(a, b) {
  return a + b;
}
```

```javascript
const =  (a, b) =>  a + b;
```

We call the function `add` the following way:

```JavaScript
add(1,2) //3
```

We can also declare and call the function in one action:

```javascript
((a, b) => a + b)(1, 2); // 3
```

In the example above, you don't need to give the function `(a,b) => a+b` a name. Because it doesn't have a name, we call it an anonymous function.

## How to Pass Arguments

**Option 1**

Not great. This function is not resilient to change.
You have to change the function signature if you add/remove arguments

```javascript
const getStuffNotBad = (id, force, verbose) => {
  // ...do stuff
};

// Somewhere else in the codebase... WTF is true, true?
getStuffNotBad(150, true, true);
```

**Option 2**

```javascript
// Better
const getStuffAwesome = ({ id, name, force, verbose }) => {
  // ...do stuff
};
// Somewhere else in the codebase... I ❤ JS!!!
getStuffAwesome({ id: 150, force: true, verbose: true });
```

## Alternative to doing a loop

```javascript
let arr = Array.from(Array(10).keys()) //> (10) [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
arr.map(d => /* your function */)
```

## Math Functions

### Max

```javascript
Math.max(1, 2); //> 2
```

Hack with ES6 Array Destructuring:

```javascript
let arr = [1, 2, 3];
Math.max(...arr);
```

### Random

```javascript
// returns a random number between 0 amd 1
const rand = Math.random();
const rand2 = Math.random();
const rand3 = Math.random();

// returns a number between 0 and 9
const numProj = Math.ceil(rand * 10);

// returns a number between 0 and 13
const numMonths = Math.ceil(rand2 * 14);

const numBest = Math.floor(rand3 * numProj);

const msg = `Completed ${numProj} projects in the past ${numMonths} months. Won best project ${numBest} times`;
```

## Console.log

Hack 1

```javascript
console.log("my number is this:", 42);
```

Hack 2

```javascript
console.log(`my number is this: ${42}`);
```

Hack 3

```javascript
const a = 5,
  b = 6,
  c = 7;
console.log({ a, b, c });
// outputs this nice object:
// {
//    a: 5,
//    b: 6,
//    c: 7
// }
```

## Function Composition

{{< blockquote "Eric Elliot" "https://medium.com/javascript-scene/master-the-javascript-interview-what-is-function-composition-20dfb109a1a0" "Master the JavaScript Interview: What is Function Composition" >}} Function composition is the process of combining two or more functions to produce a new function. Composing functions together is like snapping together a series of pipes for our data to flow through. {{< /blockquote >}}

```javascript
const curry =
  (fn) =>
  (...args) =>
    fn.bind(null, ...args);
const map = curry((fn, arr) => arr.map(fn));
const join = curry((str, arr) => arr.join(str));
const toLowerCase = (str) => str.toLowerCase();
const split = curry((splitOn, str) => str.split(splitOn));
```

## The JavaScript Closure

{{< blockquote "Eric Elliot" "https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-closure-b2f0d2152b36" "Master the JavaScript Interview: What is closure?" >}} Closures are frequently used in JavaScript for object data privacy, in event handlers and callback functions, and in partial applications, currying, and other functional programming patterns. {{< /blockquote >}}

{{< alert info >}} See the article I published on Medium: [Making Sense Of JavaScript’s Closure With Some Examples](https://medium.com/dailyjs/some-examples-to-help-understand-javascripts-closure-372e42fff94d) {{< /alert >}}

We have to be able to explain the basic mechanics of closure. Understanding the basic mechanics comes with building actual JavaScript applications.

### What is a Closure

- A closure is a way to access and manipulate external variables from within the function.
- A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). The bundling occurs _at function creation time_.
- In other words, a closure gives you access to an outer function’s scope from an inner function. In JavaScript, closures are created every time a function is created.
- The inner function maintains closured reference to everything it uses from its _parent's lexical scope_. This means the inner function will have access to the variables in the outer function scope, even after the outer function has returned.

To use a closure, simply define a function inside another function and expose it. To expose an function, return it or pass it to another function.

### Two Common uses for closures

**Data Privacy**

Among other things, closures are commonly used to give objects data privacy. Data privacy is an essential property that helps us program to an interface, not an implementation. In JavaScript, closures are the primary mechanism used to enable data privacy. When you use closures for data privacy, the enclosed variables are only in scope within the containing (outer) function.

```javascript
// Data Privacy Example
function Rectangle(color) {
  let state = {
    width: 10,
    height: 20,
    color: color,
    key: "secret",
  };
  function updateColor(color) {
    state = { ...state };
    state.color = color;
  }
  function updateWidth(width) {
    state = { ...state };
    state.width = width;
  }
  return {
    draw: () => {
      return {
        width: state.width,
        height: state.height,
        color: state.color,
      };
    },
    drawWrong: {
      width: state.width,
      height: state.height,
      color: state.color,
    },
    updateColor: (c) => updateColor(c),
    updateWidth: (w) => updateWidth(w),
  };
}
```

The `state` object in `Rectangle` is private to `Rectangle`, which returns accessors and modifiers to the `state` variable inside `Rectangle`. In the example, we use `draw` to get width, height, and color properties for the rectangle and we use `updateColor` and `updateWidth` to modify width and height.

`updateColor` and `updateWidth` are inner functions of `Rectangle` and thus maintain a closured reference to `state` at creation time.

`Rectangle` is created as follows:

```javascript
let shape = new Rectangle("red");
console.log("draw: ", shape.draw());
console.log("drawWrong: ", shape.drawWrong);

console.log("updating color ..................");
shape.updateColor("blue");
console.log(shape.draw());
console.log("draw: ", shape.draw());
console.log("drawWrong: ", shape.drawWrong);

console.log("updating width ..................");
shape.updateWidth(40);
console.log("draw: ", shape.draw());
console.log("drawWrong: ", shape.drawWrong);
```

Console:

```
draw:  { width: 10, height: 20, color: 'red' }
drawWrong:  { width: 10, height: 20, color: 'red' }
updating color ..................
{ width: 10, height: 20, color: 'blue' }
draw:  { width: 10, height: 20, color: 'blue' }
drawWrong:  { width: 10, height: 20, color: 'red' }
updating width ..................
draw:  { width: 40, height: 20, color: 'blue' }
drawWrong:  { width: 10, height: 20, color: 'red' }
```

`drawWrong` is wrong. Why?

{{< alert info >}} Try this example out in [repl.it](https://repl.it/@xiaoyunyang/ClosureExample) {{< /alert >}}

**Partial Application**

Option 1: ES5

```javascript
function multThenAdd(num) {
  function multiplyBy(num2) {
    function add(num3) {
      return num * num2 + num3;
    }
    return add;
  }
  return multiplyBy;
}
```

Option 2: ES6

```javascript
const multThenAdd2 = (num) => (num2) => (num3) => num * num2 + num3;
```

Creating a partially applied function called `timesTwoPlusFour`:

```javascript
const timesTwoPlusFour = (num) => multThenAdd(num)(2)(4);

timesTwoPlusFour(1); //> 6
timesTwoPlusFour(10); //> 24
```

What’s happening in the code above is that you created a closure to keep the value `num` passed to the function `multThenAdd` even after the inner function is returned. The inner function `multiply` that is being returned is created within an outer function, making it a closure. More specifically:

- `multiply` is an inner function of `multThenAdd` that returns a function called `add`.
- `add` is an inner function of `multiply` that maintains a closured reference to `num2` and returns a number.

# String

## Get Characters from String

Use `chartAt()` on a string to get the character at a specific index.

```javascript
let str = "hello";
str.charAt(0); //> 'h'
str.charAt(str.length - 1); //> 'o'
str.charAt(str.length); //> ''
```

What happens if you do the following?

```javascript
str.charAt(str.length); //> ''
```

It returns an empty string! You don't get any help like the index out of bounds error that people who work with a statically typed language with a compiler like Java would be familiar with. This could be a really nasty bug. A similar thing happens with arrays when you access an index out of bound array element: `arr[arr.length]` gives you `undefined`.

{{< alert warning >}}
JavaScript, being a scripting language with a dynamic typed system, lacks a compiler that provides error checking support like throwing index out of bounds error. This is why we need to use a [linter](https://github.com/airbnb/javascript) on vanilla JavaScript or write code in TypeScript that provides a compiler and static type-checking.
{{< /alert >}}

## Getting Substrings

Say we have "hello world" as our string but we only want "world". What do we do?

```javascript
// Option 1:  Split using RegExp, then slice and take the part of the array
"hello world".split(new RegExp("hello")); //> ["", ["", "world"]]
"hello world".split(new RegExp("hello")).slice(1); //> ["", "world"]
"hello world".split(new RegExp("hello")).slice(1)[1]; //> "world"
```

```javascript
// Option 2:  Slice recursively. "hello" plus space is 6 characters
"hello world".slice(6); //> "world"
```

Option 2 using `slice` works because a string is really just an array of characters.

## RegExp

```javascript
const matchLetters = new RegExp(/[a-zA-Z]/, "g");
const matchVowels = new RegExp(/[aeiouAEIOU]/, "g");
const matchExact = new RegExp(/^abc$/, "g");
const matchExact2 = new RegExp("abc", "i");
const matchHTMLChar = new RegExp(/&(lt|gt|quot);/, "g");

let str = "abcde";
str.match(matchLetters); //> ["a", "b", "c", "d", "e"]
str.match(matchVowels); //> ["a", "e"]
str.match(matchExact); //> ["abcde"]
"abc".match(matchExact); //> null
"abcdef".match(matchExact); //> null

let str = "abcde &lt; &quot; hello &quot; hm";
function decode(match) {
  if (match === "&lt;") return "<";
  else if (match === "&quot;") return '"';
}
str.replace(matchHTMLChar, decode); //> "abcde < ' hello ' hm"
```

The below regex will match the strings that starts and ends with alpha character.

```javascript
/^[a-z].*[a-z]$/gim;
```

Explanation (see [this tutorial](http://www.mpi.nl/corpus/html/trova/ch01s04.html) or [this tutorial](https://eloquentjavascript.net/09_regexp.html)):

```
/abc/         A sequence of characters
/[abc]/       Any character from a set of characters
/[a-z]/       alphabatic  character (lowercase only).
/[^abc]/     Any character not in a set of characters
/[0-9]/      Any character in a range of characters
/x+/         One or more occurrences of the pattern x
/x+?/         One or more occurrences, nongreedy
/x*/         Zero or more occurrences
/x?/         Zero or one occurrence
/x{2,4}/     Two to four occurrences
/(abc)/       A group
/a|b|c/       Any one of several patterns
/\d/         Any digit character
/\w/         An alphanumeric character (“word character”)
/\s/         Any whitespace character
/.*/          Any character 0 or more times
/./           Any character except newlines
/\b/         A word boundary
/^/           Start of input
/$/           End of input

/a/i          case-insensitive match
/a/g          global
/a/m          multiline
```

- `g` flag:
  - if we ran `match` on regex without the `g` flag, we get the first match
  - if we ran `match` on regex with the `g` flag, we get all matches
- `^` and `$` - See [this tutorial](https://javascript.info/regexp-anchors)
- `[abc]` means "a or b or c", e.g. query "[br]ang" will match both "adbarnirrang" and "bang"
- `[^abc]` means "begins with any character but a,b,c", e.g. query [^aeou]ang will match "rang" but not "baang"
- `[a-zA-Z]` means "a character from a/A through z/Z", e.g. `b[a-zA-Z]` will match "bang", "bLang" or "baang" but not "b8ng"
- `.` (the dot) means "any character", e.g. "b.ng" will match "bang", "b8ng", but not "baang"
- `X*` means "X zero or more times", e.g. "ba\*ng" will match "bng", "bang", "baang", "baaang" etc.
- `X+` means "X one or more time", e.g. "ba+ng" will match "bang", "baang" but not "bng"
- `^` means "the beginning of the annotation", e.g. "^ng" will match "ngabi" but not "bukung"
- `$` means "the end of the annotation", e.g. "ung$" will match "bukung" but not "ngabi"
- `\b` matches only word boundaries. For example:
  - `/\bMoz/` matches any word beginning with "Moz", like "Mozilla" or "Mozillathon"
  - `/Moz\b/` matches any word ending with "Moz", like "myMoz" or "bigMoz"
  - `/\bMoz\b/` matches only the word "Moz" -- not "Mozilla" or "myMoz"

Cases where the `g` flag should be used is when you want to replace all occurrences of something in a string

```javascript
// replace all 'a' in the string with '1'
"abbaaab".replace(/a/g, "1"); //> "1bb111b"

"hello world hello".replace(/hello/, "hi"); //> "hi world hello"
"hello world hello".replace(/hello/g, "hi"); //> "hi world hi"
```

# JS Object

JavaScript Object encodes data as key value pairs. You probably heard of JSON, which is a text format that conforms to the JS Object format and is used to share data between server and client. Compared to XML, JSON is faster and easier to parse with JavaScript.

## Creating JS Object

Dynamically

```javascript
// ES6 Syntax
[1, 2, 3].map((d) => {
  return { [d]: -d };
});

// ES 5 Syntax
[1, 2, 3].map((d) => {
  var tmp = {};
  tmp[d] = -d;
  return tmp;
});

// or
[1, 2, 3].map((d) => ({ [d]: -d }));

// yields
//> [{1: -1}, {2: -2}, {3: -3}]
```

Statically

```javascript
var stooge = {
  firstName: "Jerome",
  lastName: "Howard",
};

var flight = {
  airline: "Oceanic",
  number: 815,
  departure: {
    IATA: "SYD",
    time: "2004-09-22 14:55",
    city: "Sydney",
  },
  arrival: {
    IATA: "LAX",
    time: "2004-09-23 10:42",
    city: "Los Angeles",
  },
};
```

A property’s name can be any string, including the empty string. The quotes around a property’s name in an object literal are optional if the name would be a legal JavaScript name and not a reserved word. So quotes are required around “last-name", but are optional around first_name. Commas are used to separate the pairs.

## Converting JS Object from one form to another

```javascript
// Create array of objects
var foo = [1, 2, 3].map((d) => {
  return { [d]: null };
});

// Create object with original arrays as keys and null as the values
var bar = foo.reduce((acc, x) => {
  for (let key in x) acc[key] = x[key];
  return acc;
}, {});
```

## Retrieving Things from JS Object

```javascript
stooge.firstName //> “Jerome”
stooge[“lastName”] //> Howard
flight.departure.IATA  //> "SYD"
```

The undefined value is produced if an attempt is made to retrieve a non existent member:

```javascript
stooge["middleName"]; //> undefined
flight.status; //> undefined
stooge["FIRSTNAME"]; //> undefined
```

The `||` operator can be used to fill in default values:

```javascript
var middle = stooge["middleName"] || "(none)";
var middle = stooge["middleName"] || "(none)";
var status = flight.status || "unknown";
```

The `&&` operator can be used to guard against retrieving values from `undefined`

```javascript
flight.equipment; //> undefined
flight.equipment.model; //> throw "TypeError"
flight.equipment && flight.equipment.model; //> undefined
```

## Retrieving By Value from Array Of objects

Use `filter`

```javascript
const dict = [
  { char: "<", code: "&lt" },
  { char: ">", code: "&gt" },
  { char: ">=", code: "&ge" },
  { char: "<=", code: "&ge" },
];
dict.filter((obj) => {
  return obj.char === ">";
}); //> [{ char: '>', code: '&gt' }]
dict.filter((obj) => {
  return obj.char === "foo";
}); //> []
```

## Update JS Object

If the object does not already have that property name, the object is augmented:

```javascript
stooge.firstName = "Jerome";
stooge["middleName"] = "Lester";
stooge.nickname = "Curly";
```

JavaScript Object can be used as a dictionary. If we want to maintain a list of unique things and when we encounter a new thing, we want to update the list only if the this thing does not exist in the list already, maintaining the list of things as an array would be pretty expensive. The reason array is a bad datastructure for maintaintaing a list of unique things that could change overtime is because every time we want to add a new thing list, we have to search through the entire array to see if this thing already exists or not. Add operation becomes O(N) in time complexity. If we maintain the list of unique things as a dictionary, the Add operation would be O(1).

```javascript
const addToDict = (dict, newKey) => {
  if (dict[newKey]) return dict;
  const newDict = Object.assign({}, dict);
  newDict[newKey] = new Date();
  return newDict;
};
```

A Gotcha here is we need to make sure we make a copy of the old `dict` with `Object.assign`. Otherwise, the code is going to fail due to side effects. `dict` is a reference to object, not the actual thing. This is especially true if your `dict` is a dynamically loaded object. An important programming principle is our function should not have side effect (i.e., mutate any argument). Rather, the function should return a copy of the dict that’s modified.

Similarly, we can delete item from a list. Time complexity of the delete operation is O(1) is O(1) if the list is maintained as a dictionary and in worst case O(N) if the list is maintained as an array.

```javascript
const deleteFromDict = (dict, key) => {
  if (!dict[key]) return dict;
  const newDict = Object.assign({}, dict);
  newDict[key] = null;
  return newDict;
};
```

## Size of JS Object

```javascript
let basket = {};
Object.keys(basket).length; // 0
basket = { apple: 2 };
Object.keys(basket).length; // 1
```

## Operations on JS Object

```javascript
let users = [{ name: "andrew", country: "usa" }, { name: "mary" }];
users[0]; //> {name: "andrew", country: "usa"}
users[0].country; //> "usa"
users[1].country; //> undefined
users.filter((u) => u.country !== null).map((u) => u.username); //> ["xy"]
```

## Get all keys from JS Object

```javascript
let foo = { name: "andrew", country: "usa" };
let keys = Object.keys(foo); //> [“name”, “country”]
```

## Check if a key exists in a JS Object

```javascript
let user = { name: "andrew", country: "usa" };
user.hasOwnProperty("name"); //>true
user.hasOwnProperty("andrew"); //> false
user.hasOwnProperty("country"); //> true
user.hasOwnProperty("city"); //> false
```

## JSON.stringify

`JSON.stringify` is very useful when you are debugging server side using `console.log`. Serverside javascript prints out to terminal and if you are trying to print out an object, you will see 'object' getting printed out on console, which is not very helpful.

```javascript
var foo = { name: "andrew", country: "usa" };
var bar = { name: "xiaoyun", city: "dc" };
var baz = { name: "andrew", country: "usa" };
JSON.stringify(foo) == JSON.stringify(baz); //> true
JSON.stringify(foo) === JSON.stringify(baz); //> true
JSON.stringify(foo) == JSON.stringify(bar); //> false
```

Then you can use `indexOf` is an operation on a `string`.

```javascript
let a = JSON.stringify(foo); //> "{"name":"andrew","country":"usa”}"
a.indexOf("{"); //> 0
a.indexOf("n"); //> 2
a.indexOf("france"); //> -1
a.indexOf("usaa"); //> -1
a.indexOf("usa"); //> 28
a.indexOf("u"); //> 20
a.indexOf("sa"); //> 29
a.indexOf("s"); //> 29
a.indexOf("}"); //> 32
```

## Object.values

Create an array of values from the JavaScript object.

```javascript
const addressBook = {
  mary: { gender: "female", age: 12 },
  jason: { gender: "male", age: 22 },
};
const values = Object.values(addressBook);
console.log(values); //> [ { gender: 'female', age: 12 }, { gender: 'male', age: 22 } ]
```

## Make Hard Copy of JS Object

For the previous example:

```javascript
const shallowCopy = addressBook;
const deepCopy = Object.assign({}, addressBook);
```

`shallowCopy` only makes a copy of the reference to addressBook, not making a deep copy.

For making a deep copy, use `Object.assign`

## Swap Key and Val of JS Objects

```javascript
const objKey = (d, i) => Object.keys(d)[i];
const objVal = (d, i) => d[objKey(d, i)];

// create JS Object from an array of keys

const swap = (data) =>
  Object.keys(data).reduce((obj, key) => {
    obj[data[key]] = key;
    return obj;
  }, {});

var data = { A: 1, B: 2, C: 3, D: 4 };
var newData = swap(data);

console.log(newData); //> {1: "A", 2: "B", 3: "C", 4: "D"}
```

## Destructuring

Using object destructuring saves you from creating temporary references for those properties.

```javascript
var user = { firstName: "Amy", lastName: "Winehouse" };
var { firstName, lastName } = user;
firstName; //> "Amy"
lastName; //> "Winehouse"
```

## Merging two JS objects

There's a more verbose way of doing it but we are using ES6's spread operator here:

```javascript
let foo = { a: "a", b: "b" };
let bar = { c: "c", d: "d" };
let foobar = { ...foo, ...bar }; //> {a: "a", b: "b", c: "c", d: "d"}
```

The more verbose way to do it is with `Object.assign`.

```javascript
const basket1 = {
  apple: 2,
};
const basket2 = {
  pear: 3,
  apple: 8,
  orange: 4,
};
const { pear, oranges } = basket2;

const combined1 = Object.assign(basket1, basket2);

console.log("basket1", basket1);
//> basket1 { apple: 2, pear: 3, oranges: 0} ... Side effect! basket1 got mutated
// by Object.assign above. Stuff from basket2 got combined into basket1.

console.log("basket2", basket2);
//> basket1 { apple: 2, pear: 3, oranges: 0}

const combined2 = Object.assign(basket1, { pear });

console.log("combined1", combined1);
//> combined1 {}

console.log("combined2", combined2);
//> combined2 { apple: 2, pear: 3}
```

# Time

## Date

```javascript
const today = new Date();
typeof today; //> "object"
```

Like many things in JavaScript, `Date` is an object.

```javascript
const getTomorrow = (today) => {
  return new Date(today.getTime() + 1000 * 60 * 60 * 24);
};
```

```javascript
const areDatesSame = (d1, d2) => {
  return d1.toDateString() === d2.toDateString();
};
```

You can get `num` days from today using `getTomorrow` recursively.

## Display DateString

```javascript
new Date().toDateString(); //> "Sun Sep 16 2018"
```

Using the `Date.toLocaleDateString` with `en-US` date format, we get the date string displayed in the following format: "Sep 16, 2018"

```javascript
const dateFormatted = (dateStr) => {
  if (!dateStr) return "";

  const options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  // The split is to chop off the day of the week
  const formatted = new Date(dateStr)
    .toLocaleDateString("en-US", options)
    .split(/,(.+)/)[1];
  return formatted;
};
```

You can also write your own dateString generator:

```javascript
const date2DateString = (date, format) => {
  let dateString = date.toDateString();
  if ((format = "YYYY-MM-DD")) {
    return (dateString =
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2));
  }
  return dateString;
};
```

## Elapsed Date

```javascript
const getElapsedDates = (startDate, endDate) => {
  //TODO: Need to add logic here if startDate is greater than endDate, then return. Something's wrong
  //TODO: convert this ugly imperative code to map then a reduce

  //TODO: is there a way to not have to copy the getTomorrow and areDatesSane functions into this function?
  let getTomorrow = (today) => {
    return new Date(today.getTime() + 1000 * 60 * 60 * 24);
  };

  let start = startDate;
  var arr = [];
  while (!areDatesSame(start, endDate)) {
    arr = arr.concat(start);
    start = getTomorrow(start);
  }
  return arr;
};
```

# Utility Libraries

- [Sugar](https://github.com/andrewplummer/Sugar) - A JavaScript utility library for working with native objects.
- [Moment](https://github.com/moment/moment/) - A JavaScript date and time manipulation library for parsing, validating, manipulating, and formatting dates.
- [Ramda](https://github.com/ramda/ramda) - A utility library is designed for functional programming.
- [MathJS](https://github.com/josdejong/mathjs) - An extensive math library for JavaScript and Node.js.

# Resources

- JavaScript [Grammar and Types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types)
- Master The JavaScript Interview Series:
  - [What is a Closure?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-closure-b2f0d2152b36)
  - [What is the Difference Between Class & Prototypal Inheritance?](https://medium.com/javascript-scene/master-the-javascript-interview-what-s-the-difference-between-class-prototypal-inheritance-e4cd0a7562e9)
  - [What is a Pure Function?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976#.4256pjcfq)
  - [What is Function Composition?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-function-composition-20dfb109a1a0#.i84zm53fb)
  - [What is Functional Programming?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-functional-programming-7f218c68b3a0#.jddz30xy3)
  - [What is a Promise?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-promise-27fc71e77261#.aa7ubggsy)
  - [Soft Skills](https://medium.com/javascript-scene/master-the-javascript-interview-soft-skills-a8a5fb02c466)
- Eric Elliot on [why you should stay away from OO](https://medium.com/javascript-scene/inside-the-dev-team-death-spiral-6a7ea255467b)
