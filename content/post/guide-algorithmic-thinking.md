---
title: "Applying Algorithmic Thinking To Solve A Problem In JavaScript"
date: 2018-05-30
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
