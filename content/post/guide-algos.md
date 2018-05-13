---
title: "Problem Solving Using JavaScript"
date: 2018-04-16
categories:
  - blog
tags:
  - JavaScript
  - Guide
thumbnailImagePosition: top
thumbnailImage: /post/images/algorithms-xkcd.png
---

JavaScript is one of the most popular and versatile languages today, but when Brandon Eich first created JavaScript in 1995, it was not recognized as a general purpose programming language. JavaScript only ran in the browser and was primarily used to enhance the user interfaces of website (e.g., animation, effects upon hover), thus tightly coupled with the Data Object Model (DOM). In recent years, JavaScript has gotten a lot more useful as a general purpose language as it can be run independently from the DOM and browser. Additionally, JavaScript has also has gotten very sophisticated with the introduction of ES6 and ES7. With that, let's take a look at how JavaScript can be used to solve fundamental problems in computer science. Specifically, let's look at how to write algorithms and leverage data structures to help us solve problems using JavaScript.

<!--more-->

{{< alert info >}} This is a Live Document. I will be updating it periodically. {{< /alert >}}

<!-- toc -->

# String Algorithms

## Reverse Strings

```javascript
// takes a string and returns the reverse of that string
function reverse(s) {
  return s.split('').reduce((res, d) =>
    d + res, ''
  );
}
```

## Palindrome
Given string `s`, returns `true` if `s` is a palindrome, false otherwise.
Example:

* `isPalindrome('aba')` returns `true`.
* `isPalindrome('abb')` returns `false`.
* `isPalindrome('abba')` returns `true`.

Try out the solution: https://repl.it/@xiaoyunyang/palindrome

### Naive Algorithm
The simple way to determine if the string is a palindrome is by comparing the original string with the reverse of the string and see if they are equal.

```javascript
function isPalindrome(s) {
  if (typeof s !== 'string') return false;
  return s === reverse(s);
}
```
However, this may not be the most efficient since the computational complexity is always O(N) regardless of whether the string is a palindrome or not. We want an efficient algorithm such that we can return immediately if the head and tail of the string don't match.

### More Efficient Algorithm
A more efficient algorithm is this:

```javascript
function isPalindrome2(s) {
  if (typeof s !== 'string') return false;
  let first = s.slice(0,1)
  let last = s.slice(-1)

  // not a palindrome
  if(first !== last) return false
  if(first === '') return true

  return isPalindrome2(s.slice(1, -1))
}
```

### Unit Test

```javascript
let testCases = [
  {test: 'hello', shouldBe: false},
  {test: 42, shouldBe: false},
  {test: null, shouldBe: false},
  {test: undefined, shouldBe: false},
  {test: 'aba', shouldBe: true},
  {test: 'abba', shouldBe: true},
  {test: 'a bba', shouldBe: false},
  {test: 'a bb a', shouldBe: true},
  {test: 'ab ba', shouldBe: true},
  {test: '', shouldBe: true},
];
let fun = (str) => isPalindrome2(str);
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

## Match Two Strings

Create a function that takes two strings and returns true if the first argument ends with the 2nd argument; otherwise return false .
Example:

* "abc", "d" ➞ false
* "samurai", "zi" ➞ false
* "feminine", "nine" ➞ true
* "convention", "tio" ➞ false

### The Algorithm
```javascript
function checkEnding(str1, str2) {
  let str1Rev = str1.split('').reverse().join('')
  let str2Rev = str2.split('').reverse().join('')
  let regex = new RegExp(str2Rev, 'i')
  let match = str1Rev.match(regex)

  if (!match) return false
  return match.index === 0
}
```

Try out the solution: https://repl.it/@xiaoyunyang/checkEnding

## Capitalize Letters In A Sentence

### The Algorithm
Using reduce vice a map and join gives you a slight performance boost.

When your phrase is really long, you should care about performance also. Doing a `map` then `join` is going to be slower than doing a `reduce` based on [this benchmark](https://jsperf.com/test-map-join-vs-reduce).

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

### Unit Test
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
testResult.filter(d => d!=='passed').length === 0 ? 'passed all tests' :
                                                    'failed at least one test'
```

## Match parentheses in a string
Try out the solution in [repl.it](https://repl.it/@xiaoyunyang/MatchParentheses)

### The Algorithm

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

```

### Unit Test

It is necessary to extensively unit test your code.

```javascript
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

## URL String transform
Try out the solution in [repl.it](https://repl.it/@xiaoyunyang/urlStringTransform)

Given an article title for a blog, create a url string of all lower case words joined by '-'.

### Option 1 - use Array.map, then Array.join

```javascript
function createURL(title) {
  if(typeof title !== 'string') return ''
  return title.split(' ')
              .map(word => word.toLowerCase())
              .join('-');
}
```

The disadvantage of this approach is it's [slow](https://stackoverflow.com/questions/22614237/javascript-runtime-complexity-of-array-functions). map is O(N). join is O(N) we can do better.

### Option 2 - use Array.reduce

```javascript
function createURL2(title) {
  if(typeof title !== 'string') return ''

  return title.split(' ')
              .reduce((res, word) =>  
                res + '-' + word.toLowerCase(),
                '')
              .slice(1)
}
```
Question for the reader: why `.slice(1)` at the end?


### Option 3 - ES6

```javascript
function createURL3(title) {
  if(typeof title !== 'string') return ''

  let [first, ...rest] = title.split(' ')

  return rest.reduce((res, word) =>
              res + '-' + word.toLowerCase(),
              first.toLowerCase())
}
```

### Unit Test

```javascript
let testCases = [
  {test: '', shouldBe: ''},
  {test: 'hello', shouldBe: 'hello'},
  {test: 'hello world', shouldBe: 'hello-world'},
  {test: undefined, shouldBe: ''}
];
let fun = (str) => createURL3(str);

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

## HTML String Transform
Try out the solution in [repl.it](https://repl.it/@xiaoyunyang/strReplace)

Symbols used in HTML document consist of special character sets, including `&lt;` for & and [some others](https://www.w3.org/MarkUp/HTMLPlus/htmlplus_13.html).

```javascript
// &lt; => '<''
// &gt; => '>'
// &quot; => ''\"'


// Takes a string and encodes the characters as HTML characters
function encodeV1(char) {
  switch (char) {
    case '<': return '&lt;'
    case '>': return '&gt;'
    case '\"': return '&quot;'
  }
  return char
}

let s = "1 > 0 and 1 < 12, \"hello\""
let encode = encodeV1
s.split('').map(char => encode(char)).join('')
//> '1 &gt; 0, 1 &lt; 12, 1 &gt;= 1. &quot;hello&quot;''
```

This works but the `encode` function is hard-coded with simples. If we want to write a `decode` function that makes the string transformation in reverse, that would require writing out all those mappings again, requiring us to refactor code. It would be desirable to have a single source of truth that dictates all available encoding. Let's make a data structure called `dict` that provides the collection of tuples for encoding and decoding our characters and HTML special characters.

Some refactoring is necessary:

```javascript
const dict = [
  {char: '<', code: '&lt;'},
  {char: '>', code: '&gt;'},
  {char: '\"', code: '&quot;'},  
]

// Build a switch based on array
function encodeV2(dict) {
  return char => {
    let res = char
    for(let i=0; i<dict.length; i++) {
      if(dict[i].char === char) {
        res = dict[i].code
        break
      }  
    }
    return res
  }
}

// This is so we don't have to change our interface encode(c) below
encode = encodeV2(dict)
s.split('').map(c => encode(c)).join('')
//> '1 &gt; 0, 1 &lt; 12, 1 &gt;= 1. &quot;hello&quot;''
```

Let's also write `decode` to use `dict`. Previously for `encode`, we are able to partition the string into an array of characters for processing. However for `decode`, this step is not so straight forward since our code e.g., `&gt;` consists of multiple character. So what do we do?

Let's write a helper function that handles partitioning of the string to arrays of regular characters or

```javascript
function decodeV2(dict) {
  return code => {
    let res = code
    for(let i=0; i<dict.length; i++) {
      if(dict[i].code === code) {
        res = dict[i].char
        break
      }  
    }
    return res
  }
}
const matchHTMLChar = new RegExp(/&(lt|gt|quot);/, 'g')

let encoded = s.split('').map(char => encode(char)).join('')

let decode = decodeV2(dict)
let decoded = encoded.replace(matchHTMLChar, decode)
s === decoded //> true
```

Can we make the solution more general? Yes, in the following ways:
1. notice the `decode` and `encode` functions have basically the same functional structure. That is, they both run a loop to update the result based on value from the array of objects. We can generalize it further and abstract away that boilerplate.
2. The pattern we are matching in the `matchHTMLChar` RegExp is hardcoded. We should make that dependent on  `dict`.

I'll leave these two problems to you as an exercise.

{{< alert info >}} Note: Abstraction is vital in helping us to cope with the complexity of large systems. One of the tenets of functional programming, a **problem solving framework**, is the principle of abstraction. Some parts of your code are boilerplate. Some parts of your code are unique. The goal of abstraction is to capture that boilerplate stuff in a higher order function. {{< /alert >}}

# Array Algorithms

## Flatmap

Write a function that converts "hello" to "h.e.l.l.o." There are two parts to this: `flat` and `map`.

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

# Resources
* [How to think like a programmer](https://medium.freecodecamp.org/how-to-think-like-a-programmer-lessons-in-problem-solving-d1d8bf1de7d2)
