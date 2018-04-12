---
title: "Let's Get Productive With JavaScript"
date: 2018-04-09
categories:
  - blog
tags:
  - JavaScript
thumbnailImagePosition: top
thumbnailImage: /post/images/jsDev.png
---

JavaScript is one of the most popular and versatile languages to date. You can build anything in JavaScript: from full stack web apps, to cross platform mobile apps, to cross platform desktop apps. Here are some useful algorithms and syntax in JavaScript to help you be productive in JavaScript right away. No set up necessary. Just  open up your browser's console (hit `Cmd`+`Shift`+`C` if you are using Chrome and Mac) and start typing.

<!--more-->

<!-- toc -->

# Array

* See [Mutating vs Non-mutating array operation](https://lorenstewart.me/2017/01/22/javascript-array-methods-mutating-vs-non-mutating/)
* Check out [lodash](https://lodash.com/docs/4.17.4#range) and underscore for useful array operators.

## Add things to an array

* `array.push()` adds an item to the end of the array
* `array.unshift()` adds an item to the beginning of the array.

```javascript
// since the array will be mutated,
// use 'let' rather than 'const'
let mutatingAdd = ['a', 'b', 'c', 'd', 'e'];

mutatingAdd.push('f'); // ['a', 'b', 'c', 'd', 'e', 'f']
mutatingAdd.unshift('z'); // ['z', 'b', 'c', 'd', 'e' 'f']
```

## Create an array dynamically
```javascript
var vals = Array.from({length: 13}, (v,i) => i)
//> (13) [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

vals = vals.map(v => v-1)
//> (13) [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

vals.map(v => ({val: v, : valIncrementer(v, false), disabled: valIncrementer(v, true) }))
```

## Get stuff From an array
```javascript
const arr = [1, 2, 3, 4];
const [first, second] = arr;
```

## Get last elem of an array

Don't use `pop` unless you want to mutate the array:

```javascript
var arr = [1,2,3]
arr.pop() //>3
arr //>[1, 2] ... Very Bad. Your original array got changed

const arr2 = [1,2,3]
arr2.pop()
arr2 //> Even const can't help you

const arr3 = arr
arr3.pop() //>2
arr //> [1] ... arr got changed even though arr3 did the pop
```

Do this instead:

```javascript
let arr = [1,2,3]
arr.slice(-1)[0] //> 3
arr //> [1, 2, 3]
```

More on `Array.slice`:

```javascript
let arr = [1, 2, 3]
arr.slice(-1) //> [3]
arr.slice(0) //> [1, 2, 3]
arr.slice(1) //> [2, 3]
arr.slice(2) //> [3]
```

## Combine things in array

```javascript
[0, 1, 2, 3].reduce((sum, value) => { sum + value;}, 0);
//> total is 6
```

```javascript
["hello","World"].reduce( (a, res) => a + res ) //> "helloWorld"

["hello","World"].reduce( (a, res) => { return a + res }, "My message: " )
//> "My message: helloWorld"
```

```javascript
['a','b','c'].join("") //> "abc"
['a','b','c'].map(d => "1"+d).join(",") //> "1a,1b,1c"
```

If you don’t pass in an initial value, reduce will assume the first item in your array is your initial value.

## Combine sub-arrays

```javascript
// Flat

const flat = (data) => data.reduce((total, amount) => {
  return total.concat(amount);
}, []);

var data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat(data) // [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```

## Flatmap

Write a function that converts "hello" to "h.e.l.l.o." There're two parts to this: `flat` and `map`.


```javascript
const arr = "hello".split("") //> ["h", "e", "l", "l", "o"]

const matrix = arr.map(s => [s, "."])
// [Array(2), Array(2), Array(2), Array(2), Array(2)]
// 0: (2) ["h", "."]
// 1: (2) ["e", "."]
// 2: (2) ["l", "."]
// 3: (2) ["l", "."]
// 4: (2) ["o", "."]

const flat = (data) => data.reduce((res, d) => {
  return res.concat(d);
}, []);


flat(matrix) //> ["h", ".", "e", ".", "l", ".", "l", ".", "o", "."]

flat(matrix).join("") //> "h.e.l.l.o."

```

## Sorting

```javascript
['a','c','b'].sort((a,b) => a > b) //> ["a", "b", "c"]

[1,3,2].sort((a,b) => a - b) //> [1, 2, 3]

[1,3,2].sort((a,b) => b - a) //> [3, 2, 1]

[1,3,2].sort((a,b) => b > a) //> [3, 2, 1]
```

# Operations

## Alternative to doing a loop

```javascript
let arr = Array.from(Array(10).keys()) //> (10) [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
arr.map(d => /* your function */)
```

## Random

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

# String

## Getting Substrings

Say we have "hello world" as our string but we only want "world". What do we do?

```javascript
// Option 1:  Split using RegExp, then slice and take the part of the array
"hello world".split(new RegExp("hello")) //> ["", ["", "world"]]
"hello world".split(new RegExp("hello")).slice(1) //> ["", "world"]
"hello world".split(new RegExp("hello")).slice(1)[1] //> "world"
```

```javascript
// Option 2:  Slice recursively. "hello" plus space is 6 characters
"hello world".slice(6) //> "world"
```

Option 2 using `slice` works because a string is really just an array of characters.

## Algo:  Match parentheses in a string.

```javascript
function isBalanced(str, openCnt) {
	if (typeof str !== 'string') return false;
  if (openCnt <  0) return false;
	if (str.length === 0) return openCnt === 0;

	const fst = str[0];
	const rst = str.slice(1);
	return isBalanced(rst, newOpenCnt(fst, openCnt));
}
const newOpenCnt = (c, openCnt) => {
	if(c === '(') return openCnt + 1;
	if(c === ')') return openCnt - 1;
	return openCnt;
}

// Test -----------------------------------------------------
let testCases = [
  {test: '(', shouldBe: false},
  {test: '())', shouldBe: false},
  {test: null, shouldBe: false},
  {test: undefined, shouldBe: false},
  {test: 22, shouldBe: false},
  {test: ')(', shouldBe: false},
  {test: '', shouldBe: true},
  {test: '()', shouldBe: true},
  {test: '()()', shouldBe: true},
  {test: '(())', shouldBe: true},
  {test: 'hi', shouldBe: true},
  {test: '(hi)', shouldBe: true},
  {test: '(((())(())',shouldBe: false}
];
let fun = (str) => isBalanced(str, 0);
const test = (testCases, fun) => {
  testCases.map(t => {
    const shouldBe = t.shouldBe;
    const is = fun(t.test);
    const res = (shouldBe === is) ? 'passed' : 'failed';
    const moreInfo = (res === 'failed') ? `testing ${t.test}. Should be ${shouldBe} but got ${is}` : ''
    console.log(`${res} ${moreInfo}`);
  })
}
test(testCases, fun)
```

## Algo:  Capitalize Letters In A Sentence

Using reduce vice a map and join gives you a slight performance boost.

When your phrase is really long, you should care about performance also. Doing a map then join is going to be slower than doing a reduce based on this benchmark.

```javascript
const capitalize = (word) => {
  const rest = word.slice(1);
  const firstLtr = word.charAt(0);
  return firstLtr.toUpperCase() + rest.toLowerCase();
}
const titleCase = (phrase) => {
  if(!phrase) return phrase;
  [first, ...rest] = phrase.split(' ');
  return rest.reduce((res,a) =>  res +' ' + capitalize(a),
                                            capitalize(first))
}
```

Simple Test:
I wrote a helper assert function and some test cases. This is by no means an exhaustive test.

```javascript
const assert = (fun, input, expected) => {
 return fun(input) === expected ?
  'passed' :
  `failed on input=${input}. expected ${expected}, but got ${fun(input)}`;
}
```

Test cases:

```javascript
let testCases = [
 {input: "I’m a little tea pot", expected: "I’m A Little Tea Pot"},
 {input: "sHoRt AnD sToUt", expected: "Short And Stout"},
 {input: "sHoRt AnD sToUt", expected: "Short And Stout"},
 {input: "HERE IS MY HANDLE HERE IS MY SPOUT", expected: "Here Is My Handle Here Is My Spout"},
 {input: "", expected: ""},
 {input: undefined, expected: undefined},
 ]
```

Doing this test, you should get all tests passed:

```javascript
let testResult = testCases.map(d => assert(titleCase, d.input, d.expected))
testResult.filter(d => d!=='passed').length === 0 ? 'passed all tests' : 'failed at least one test'
//> 'passed all tests'
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
};
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
((a, b) => a + b)(1,2) // 3
```
In the example above, you don't need to give the function `(a,b) => a+b` a name. Because it doesn't have a name, we call it an anonymous function.

# JSON

JSON or JavaScript Object Notation encodes data as key value pairs. It’s faster and easier to parse with JavaScript than XML.

## Creating JSON

Dynamically

```javascript
// ES6 Syntax
[1,2,3].map(d => {
  return {[d]: -d}
});

// ES 5 Syntax
[1,2,3].map(d => {
  var tmp = {};
  tmp[d] = -d;
  return tmp;
});

// or
[1,2,3].map(d => ({[d]: -d}));

// yields
//> [{1: -1}, {2: -2}, {3: -3}]
```

Statically

```javascript
var stooge = {
   firstName: "Jerome",
   lastName: "Howard"
};

var flight = {
   airline: "Oceanic",
   number: 815,
   departure: {
      IATA: "SYD",
      time: "2004-09-22 14:55",
       city: "Sydney"
   },
   arrival: {
      IATA: "LAX",
      time: "2004-09-23 10:42",
      city: "Los Angeles"
   }
};
```
A property’s name can be any string, including the empty string. The quotes around a property’s name in an object literal are optional if the name would be a legal JavaScript name and not a reserved word. So quotes are required around “last-name", but are optional around first_name. Commas are used to separate the pairs.

## Converting JSON from one form to another

```javascript
// Create array of objects
var foo = [1,2,3].map(d => {
  return {[d]: null};
});

// Create object with original arrays as keys and null as the values
var bar = foo.reduce((acc, x) => {
  for (let key in x) acc[key] = x[key];
  return acc;
}, {});
```

## Retrieving Things from JSON

```javascript
stooge.firstName //> “Jerome”
stooge[“lastName”] //> Howard
flight.departure.IATA  //> "SYD"
```

The undefined value is produced if an attempt is made to retrieve a non existent member:

```javascript
stooge["middleName"]  //> undefined
flight.status   //> undefined
stooge["FIRSTNAME"]   //> undefined
```

The `||` operator can be used to fill in default values:

```javascript
var middle = stooge["middleName"] || "(none)";
var middle = stooge["middleName"] || "(none)";
var status = flight.status || "unknown"
```

The `&&` operator can be used to guard against retrieving values from `undefined`

```javascript
flight.equipment //> undefined
flight.equipment.model //> throw "TypeError"
flight.equipment && flight.equipment.model //> undefined
```

## Update JSON
If the object does not already have that property name, the object is augmented:

```javascript
stooge.firstName = 'Jerome';
stooge['middleName'] = 'Lester';
stooge.nickname = 'Curly';
```
## Operations on JSON

```javascript
let users = [
	{"name": "andrew", "country": "usa"},
	{"name": "mary"}
]
users[0] //> {name: "andrew", country: "usa"}
users[0].country //> "usa"
users[1].country //> undefined
users.filter(u => u.country !== null).map(u => u.username) //> ["xy"]
```

## Get all keys from JSON

```javascript
let foo = {"name": "andrew", "country": "usa"}
let keys = Object.keys(foo) //> [“name”, “country”]
```
## Check if a key exists in a JSON

```javascript
let user = {"name": "andrew", "country": "usa"}
user.hasOwnProperty("name") //>true
user.hasOwnProperty("andrew") //> false
user.hasOwnProperty("country") //> true
user.hasOwnProperty("city") //> false
```

## JSON.stringify

```javascript
var foo = {"name": "andrew", "country": "usa"};
var bar = {"name": "xiaoyun", "city": "dc" };
var baz = {"name": "andrew", "country": "usa"}
JSON.stringify(foo) == JSON.stringify(baz) //> true
JSON.stringify(foo) === JSON.stringify(baz) //> true
JSON.stringify(foo) == JSON.stringify(bar); //> false
```
Then you can use `indexOf` is an operation on a `string`.

```javascript
let a = JSON.stringify(foo) //> "{"name":"andrew","country":"usa”}"
a.indexOf("{") //> 0
a.indexOf("n") //> 2
a.indexOf("france") //> -1
a.indexOf("usaa") //> -1
a.indexOf("usa") //> 28
a.indexOf("u") //> 20
a.indexOf("sa") //> 29
a.indexOf("s") //> 29
a.indexOf("}") //> 32
```

## Swap Key and Val of JSON Objects

```javascript
const objKey = (d, i) => Object.keys(d)[i]
const objVal = (d, i) => d[objKey(d,i)]

// create JSON from an array of keys

const swap = (data) => Object.keys(data).reduce( (obj,key) => {
   obj[ data[key] ] = key;
   return obj;
},{});

var data = {A : 1, B : 2, C : 3, D : 4}
var newData = swap(data)

console.log(newData); //> {1: "A", 2: "B", 3: "C", 4: "D"}
```

## Destructuring

Using object destructuring saves you from creating temporary references for those properties.

```javascript
var user = {firstName: "Amy", lastName:"Winehouse"}
var {firstName, lastName} = user
firstName //> "Amy"
lastName //> "Winehouse"
```

## Merging two JSON objects

There's a more verbose way of doing it but we are using ES6's spread operator here:

```javascript
let foo = {a: 'a', b: 'b'}
let bar = {c: 'c', d: 'd'}
let foobar = {...foo, ...bar} //> {a: "a", b: "b", c: "c", d: "d"}
```
