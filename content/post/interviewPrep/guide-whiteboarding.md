---
title: "Algos to Practice Whiteboarding for The Coding Interview"
date: 2018-05-13
categories:
  - blog
tags:
  - JavaScript
  - Career
  - Programming
thumbnailImagePosition: left
thumbnailImage: /post/images/algo/algo-logo.png
---

We are going to go over a set of coding and whiteboard problems that would be asked during a coding interview. I'm drawing these problems from [Cracking the Coding Interview](https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850/ref=pd_lpo_sbs_14_t_0?_encoding=UTF8&psc=1&refRID=2E72V7DJM4CV4DNTBTKD) They are a sample of the medium and hard problems that require a bit of thinking and and familiarity with some fundamental frameworks and techniques in computer science.

<!--more-->
<!--toc-->

# QuickSort

Examples

```javascript
let arr = [10, 80, 30, 90, 40, 50, 70]
let arr2 = [6, 3, 17, 11, 4, 44, 76, 23, 12, 30]
```

## Whiteboard
{{< image classes="fancybox fig-100" src="/post/images/algo/quicksort1.png"
thumbnail="/post/images/algo/quicksort1.png" title="Quicksort example and Big-O Fundamental">}}
{{< image classes="fancybox fig-100 clear" src="/post/images/algo/quicksort2.png"
thumbnail="/post/images/algo/quicksort2.png" title="Another Quicksort Example">}}

## The Code
[Code on Repl](https://repl.it/@xiaoyunyang/Quicksort)

```javascript
function quicksort(arr) {
  //base case
  if(arr.length < 2) return arr

  // divide an conquer
  let subArr = arr
  let pivot = subArr.pop()

  // work at each level is O(N)
  let [left, right] = subArr.partition(e => e < pivot)

  //recurse
  return quicksort(left).concat(pivot, quicksort(right))
}

// Helper Function
Array.prototype.partition = function(fun) {
  let left = []
  let right = []
  for(let i=0; i < this.length; i++) { //<--- O(N)
    if(fun(this[i])) {
      left.push(this[i])
    } else {
      right.push(this[i])
    }
  }
  return [left, right]
}
```

## Analysis

Work at each level of the tree is O(N) because for each pivot, we have to go through each element in the array and determine if it is less than pivot. In the worst case, we are really unlucky with picking the pivot so instead of distributing work evenly between left and right, we leave all the work to one side. This increases the depth of the tree from logN to N. The expected time complexity is O(N logN), where the first N is how much work we do at each level of the tree and logN is the depth of the tree.

**Special Note**

* In our divide and conquer step, we want to pick `Array.pop`, which is a mutator function, because that's a O(1) operation and gives us both the pivot and the subArr. We could extract the subArr using `arr.slice(0, arr.length-1)` but that creates a whole new array, which is O(N) operation. This doesn't affect the big-O complexity as O(2N logN) is O(N logN) since we drop the constant.
* Our quicksort function is not tail recursive. In a compiled language, the compiler will translate the a tail recursive function to a loop so it's more efficient under the hood. In a real recursion, a new stack frame is built for each function call.
