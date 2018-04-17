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

JavaScript is one of the most popular and versatile languages today, but when Brandon Eich first created JavaScript in 1995, it was not recognized as a general purpose programming language. JavaScript only ran in the browser and was primarily used to enhance the user interfaces of website (e.g., animation, effects upon hover), thus tightly coupled with the Data Object Model (DOM). In recent years, JavaScript has gotten a lot more useful as a language as it can be run independently from the DOM and browser. Additionally, JavaScript has also has gotten very sophisticated with the introduction of ES6 and ES7. With that, let's take a look at how JavaScript can be used to solve fundamental problems in computer science. Specifically, let's look at how to write algorithms and leverage data structures to help us solve problems using JavaScript.

<!--more-->

{{< alert info >}} This is a Live Document. I will be updating it periodically. {{< /alert >}}

<!-- toc -->

# String Algorithms

## Capitalize Letters In A Sentence

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

## Match parentheses in a string.
Try it out in [repl.it](https://repl.it/@xiaoyunyang/MatchParentheses)

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

## HTML String Transform
Try it out in [repl.it](https://repl.it/@xiaoyunyang/StrReplace)

Symbols used in HTML document consist of special character sets, including `&amp;` for & and [some others](https://www.w3.org/MarkUp/HTMLPlus/htmlplus_13.html).

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
1. notice the `decode` and `encode` functions have basically the same functional structure. That is, it runs a loop to update the result based on value from the array of objects. We can generalize it further.
2. The pattern we are matching in the `matchHTMLChar` RegExp is hardcoded. We should make that dependent on  `dict`.

I'll leave these two problems to you as an exercise.

# Array Algorithms

# Object Oriented programming

# Case Study
