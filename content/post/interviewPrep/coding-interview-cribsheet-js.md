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

The coding interviews / coding challenges are designed to assess how productive someone can be with the language. In contrast to the algorithm whiteboarding interview, which assesses how thte candidate go about solving a problem, or the architecture design interview, which assesses how thte candidate's experience in system engineering and product design, the coding interview is is utilized by the company interviewing you to answer one question:

> Can you code?

<!--more-->

You are usually given the flexibility of choosing the language you are most comfortable with to complete the coding challenge. Thus it's expected you know how to take advantage of all the language specific features and deal with the language specific idiosyncracies (JavaScript has a lot) to solve problems.

These tests are also designed to gauge your knowledge of computer science fundamentals like various datastructures (e.g., arrays, strings, object/dictionaries), logic building blocks (e.g., loops, if-statements, functions), and problem solving patterns (e.g., recursion, pattern matching, higher order functions).

For coding challenges, there's always a time limit. The faster you can solve a problem correctly, the better. Thus, this post introduces JavaScript features, best practices,  to leverage and common pitfalls to avoid to help you get productive with JavaScript and get the right result quickly.

<!-- toc -->

For more extensive cheatsheet, check out [Let's Get Productive With JavaScript](https://xiaoyunyang.github.io/post/lets-get-productive-with-javascript/)

# Working with Strings

## Regex

In a nutshell, regular expression, or Regex for short, are patterns you specify to test a string. There are whole books written about Regexes. We are going to focus on the most likely problem we're going to need to solve with regex during a coding challenge:

> Does the string contain this pattern? If so, how many times does this pattern appear? Where does it appear?

Let's consider this coding challenge:

> Given a string, determine if the string is a url.

We can assume we only want to test for websites with the .com and .org top level domains. We don't care if the website actually exists or not.

Input and expected output:

* "google.com" -> true
* "www.icann.org" -> true
* "google.foobar" -> false

```javascript
const isStrUrl = str => {
  const matchTld = /(\.com|\.org)$/i
  return matchTld.test(str);
};
```

The `matchTld` is the regex that specifies that we are looking for a string that ends with `.com` or `.org`. The `\.` escapes the The `$` at the end of the regex means:

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

Other useful regex patterns:

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

Get One Character

* `str.chartAt(i)` - get a character at a index `i` from `str`.

```javascript
let str = 'hello'
str.charAt(0) //> 'h'
str.charAt(str.length-1) //> 'o'
str.charAt(str.length) //> ''
```

What happens if you do the following?

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

However, using `slice` and `substring` for extracting the sub-string requires knowing exactly where is the starting index is. Usually, the substring we want to extract are delimeted by a space or a special character such as a slash. Suppose we have the following problem:

> Get the username from the Medium url for user profile.

Usually, webpages for user profile pages on social networking websites have the following form:

```
https://<domainName>/<route>/<username>
```

What we want is the username at the end. `domainName` and `route` could be arbirarily long. So we can't use `slice` to solve our problem.

```javascript
const getUsername = url => {
  return url.split('/').pop().slice(1);
};

getUsername('https://medium.com/@xiaoyunyang') //> xiaoyunyang
```

`getUsername` function has a one-liner solution but there are few things going on:

1. `split('/')` splits the url string into an array of substrings using teh "/" delimiter. The output of the `split('/')` operated on our example url becomes `[ 'https:', '', 'medium.com', '@xiaoyunyang' ]`, which gets piped into the next operation `pop()`
2. `pop()` is a built-in function for arrays we will discuss later. What it does is it returns the last element of the array and in the process, mutating the original array. `pop()` could get us in hot water (we will discuss later in the arrays section) because it's mutating the original array but in this case, it's ok because the array we got from `split` is an intermediate throw-away datastructure that we are only using for deriving the final result. The `pop()` operatin gives us `@xiaoyunyang`, which we pipe into the next operation.
3. `slice(1)`, as discussed above, returns the substring starting from index 1 until the end of the array. This effectively chops off the `@` and gives us `xiaoyunyang`, which is the username.

# Working with Arrays

When we work with arrays in JavaScript, we have a whole suite of built-in functions we can use. This section discusses those functions that returns arrays or mutates the original array. A later section will discuss how to use JavaScript built-in functions for arrays to transform the array to other data types.

## Add things to an array and combine arrays

Mutable

* `array.push(elem)` - adds `elem` to the end of `array`.
* `array.unshift(elem)` - adds `elem` to the beginning of `array`.

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
const arr5 = arr0.concat(arr1, arr2)
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

* `array.splice(-1)` - return the tail of `array` as an array. mutates `array`.

Example:

```javascript
const arr = [0, 1, 2];
const tailArr = arr.splice(-1);
console.log(tailArr) //> [2]
console.log(arr) //> [0, 1]
```

One gotcha with using `splice` in this way is `arr.splice(-1)` returns the tail element of `arr` wrapped in an array. If you just want `elem`, then you can use ES6 destructuring:

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

Numbers

```javascript
const nums = [3,2,7,1,2,0]

nums.sort((a,b) => {
  return a-b
})

console.log(nums) //> [ 0, 1, 2, 2, 3, 7 ]

nums.sort((a,b) => {
  return b-a
})

console.log(nums) //> [ 7, 3, 2, 2, 1, 0 ]
```

It's important note that the `sort` function mutates the original array.

If you don't pass in a function, `sort` will by default give you the mutated array in ascending order.

```javascript
const letters = ['c', 'r', 'a', 'b', 'a', 't']
letters.sort()
letters //> [ 'a', 'a', 'b', 'c', 'r', 't' ]
```

However, if you want to get the letters in descending order, we need to use `string.prototype.localeCompare`.

```javascript
const letters = ['c', 'r', 'a', 'b', 'a', 't']
letters.sort((a,b) => {return b.localeCompare(a)})
letters //> [ 't', 'r', 'c', 'b', 'a', 'a' ]
```

# Working with Objects

JavaSCript Objects are used to store key-value pairs and can nest other objects as deep as you want. In JavaScript, arrays are actually objects where the keys are numbers. I can make an array using an object notation:

```javascript
const arr1 = {
    0: 0,
    1: 1,
    2: 2
}
const arr2 = [0, 1, 2];
```

How I access the elements are indistinguishable:

```javascript
arr1[1] //> 1
arr2[1] //> 1
```

This is how I remember the rules for accessing the value of an object using the key - it looks just like the way you access the element of an array at a given index!

```javascript
const basket = {
    apple: 1,
    pear: 2
}
const numApple = basket['apple']; //> 1
const numPear = basket['pear']; //> 2
```

## Size of JS Object

* `Object.keys(dict).length` gives you the number of entries in the object called `dict`, short for dictionary.

Example:

```javascript
let basket = {}
Object.keys(basket).length; // 0
basket = {apple: 2}
Object.keys(basket).length; // 1
```

## Merging two JS objects

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
basketCpy = {...basket}
console.log(basket === basket2) //> true
console.log(basket === basketCpy) //> false
```

## Add and remove things from object

```javascript
const addToDict = (dict, newKey, newVal) => {
  if (dict[newKey]) return dict;
  const newDict = {...dict};
  newDict[newKey] = newVal;
  return newDict;
};
```

```javascript
const deleteFromDict = (dict, newKey, newVal) => {
  if (!dict[key]) return dict;
  const newDict = {...dict};
  newDict[key] = newVal;
  return newDict;
};
```

## Compare two objects

What if you have two dictionaries and you want to see if they are equal?

```javascript
let dict1 = {}
dict1["a"] = 1
dict1["b"] = 2

let dict2 = {}
dict2["a"] = 1
dict2["b"] = 2

JSON.stringify(dict1) === JSON.stringify(dict2) //> true

dict1["a"] = 2
JSON.stringify(dict1) === JSON.stringify(dict2) //> false
```

# Conversion Between Data Types

{{< image classes="fancybox fig-75 center clear" src="/post/images/programming/data-type-conversion.png"
thumbnail="/post/images/programming/data-type-conversion.png" title="Conversion Between Different Data Types">}}

We can use functions to transform between these data types as depicted in the graph above.

# Shortcuts

Find Max:

```javascript
const arr = [1, 2, 3]
Math.max(...arr)
```

Swapping

```javascript
let a = 'world', b = 'hello'
[a, b] = [b, a]
console.log(a) //> hello
console.log(b) //> world
```

Generating a sequence

```javascript
const indices = Array.from(Array(10).keys()) 
console.log(indices); //> (10) [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```