---
title: "Applying Algorithmic Thinking To Solve A Problem In JavaScript"
date: 2018-04-30
categories:
  - blog
tags:
  - JavaScript
  - Guide
thumbnailImagePosition: left
thumbnailImage: /post/images/brain-lightbulb.png
---

This is a deep dive of a coding challenge that my friend was asked to solve during an interview. I like this problem a lot because the solution requires both algorithmic thinking and familiarity with some fundamental frameworks and techniques in computer science.

<!--more-->

# The Problem

Write a function to check for balanced parentheses. For example, `'('` returns false, `')('` returns false, `'()'` returns true, and `'foo'` returns true.

# How To Approach The Problem

The problem description gives us a set of inputs and expected outputs. This provides the specification for this function. First we should stop and think about how we would do this on paper. Imagine someone gives you a load of text and asks you to tell them if there are balanced parentheses.



 don't have a computer to automate




 **reframe the problem** in such a way that would translate the specification to requirements. Depending on your preference, you may want to start with writing some pseudo code or drawing a picture on a whiteboard. I like writing down an outline of what the function needs to do in comments.

```javascript
// function isBalanced
// Given: A string
// Step through the string and
```

[How to think like a programmer](https://medium.freecodecamp.org/how-to-think-like-a-programmer-lessons-in-problem-solving-d1d8bf1de7d2)




## Recursion



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

```

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
We want to transform the article title into a string of all lower case words joined by '-'.

**Option #1 - use Array.map, then Array.join**

```javascript
phrase.split(' ').map(w => w.toLowerCase()).join('-');
```

The disadvantage of this approach is it's [slow](https://stackoverflow.com/questions/22614237/javascript-runtime-complexity-of-array-functions). map is O(N). join is O(N) we can do better.

**Option #2 - use Array.reduce**
```javascript
phrase.split(' ').reduce((res, a) => res + '-' + a.toLowerCase(), '').slice(1)
//> "three-ways-to-title-case-a-sentence-in-javascript"

// Why .slice(1) at the end?

phrase.split(' ')
	.map(w => w.toLowerCase())
	.reduce((res,a) => {
		console.log('res = ', res);
		console.log('a = ', a);
		return res+'-'+a
	}, '')

```

```
//res =  
// a =  three
// res =  -three
// a =  ways
// res =  -three-ways
// a =  to
// res =  -three-ways-to
// a =  title
// res =  -three-ways-to-title
// a =  case
// res =  -three-ways-to-title-case
// a =  a
// res =  -three-ways-to-title-case-a
// a =  sentence
// res =  -three-ways-to-title-case-a-sentence
// a =  in
// res =  -three-ways-to-title-case-a-sentence-in
// a =  javascript
// "-three-ways-to-title-case-a-sentence-in-javascript"
```

**Option #3 - ES6**
```javascript
let arr = phrase.split(' ')

// ES6
let [first] = arr //> "Three" ...es6 solution using destructuring
[first, ...rest] = arr
first //> "Three"
rest //> ["Ways", "to", "Title", "Case", "a", "Sentence", "in", "JavaScript"]
let urlStr = rest.reduce((res, a) => res + '-' + a.toLowerCase(), first.toLowerCase())
//> "three-ways-to-title-case-a-sentence-in-javascript"
```

```javascript
// ES5
let first = arr[0]
let rest = arr.slice(1)
let urlStr = rest.reduce((res, a) => res + '-' + a.toLowerCase(), first.toLowerCase())
```

**Aside: Tips on array operations**

*Caveat:* use arr[0], don't use arr.pop() because Array.pop() has the side effect of modifying your original array.
```
arr = [1, 2, 3]
arr[0] //> 1
arr //> [1, 2, 3]

arr = [1, 2, 3]
arr.pop(0) //> 1 ... but is O(1)
arr //> [2, 3]

// Tip:  use Array.slice(1), don't use Array.splice(1). Array.slice and Array.splice are both O(N)
arr = [1, 2, 3]
arr.slice(1) //> [2, 3]
arr //> [1, 2, 3]

arr = [1, 2, 3]
arr.splice(1) //> [2, 3] ... O(N)
arr //> [1]
```
Tip: if you care about performance of getting rest with O(1), use Array.pop()

## HTML String Transform
Try it out in [repl.it](https://repl.it/@xiaoyunyang/StrReplace)

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
1. notice the `decode` and `encode` functions have basically the same functional structure. That is, it runs a loop to update the result based on value from the array of objects. We can generalize it further.
2. The pattern we are matching in the `matchHTMLChar` RegExp is hardcoded. We should make that dependent on  `dict`.

I'll leave these two problems to you as an exercise.

# Array Algorithms

# Object Oriented programming

# Case Study
