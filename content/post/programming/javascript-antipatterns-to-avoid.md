---
title: "JavaScript Antipatterns to Avoid"
date: 2021-04-25
categories:
  - blog
tags:
  - JavaScript
  - Guide
  - Software Design
keywords:
  - software design principles
  - computer science
  - javascript
  - interview prep
  - algorithms
  - separation of concerns
  - learn to code
  - balanced parentheses
  - recursion
thumbnailImagePosition: left
thumbnailImage: /post/images/brain-lightbulb.png
---

Sourcemaking provides a great discussions on all the anti-patterns.

<!--more-->

# Antipattern #1: Programming to Implementation Rather Than Interface

Program to interface:

* `fun` only takes one argument
* Make sure the names (i.e., arg1 and arg2) are consistent

```javascript
const fun = ({arg1, arg2}) => {
  console.log(`${arg1} ${arg2}`);
}
```



Program to implementation:

* `fun2` takes two or more arguments
* The order in which argument is passed in matters
* For caller to use `fun2` correctly, caller has to look up `fun2`'s documentation to figure out what each argument means.

```javascript
const fun2 = (arg1, arg2) => {
  console.log(`${arg1} ${arg2}`);
}
```

Caller Code

```javascript
const caller = () => {
  const arg1 = 'hello'
  const arg2 = 'world'
  const arg3 = 'goodbye'
  const args = {arg1: 'hello', arg2:'world'}
  const args2 = {hello: 'hello', world: 'world'}
  const args3 = {arg1, world: 'world'}
  fun({ arg2, arg1 }) // #1
  fun({ arg2, arg1 }) // #2
  fun(args) // #3
  fun(args2) // #4
  fun(args3) // #5
  fun({arg1, arg2, arg3}) // #6
  fun2(arg1, arg2) // #7
  fun2(arg2, arg1) // #8
  fun2(arg1, arg3) // #9
}
```

`#6` prints out "hello world" because `fun` doesn't care about `arg3`.

Another way to write `fun` would be:

```javascript
const fun3 = (args) => {
  console.log(`${args.arg1} ${args.arg2}`);
}
```

[repl code](https://repl.it/@xiaoyunyang/program-to-interface-not-implementation)
