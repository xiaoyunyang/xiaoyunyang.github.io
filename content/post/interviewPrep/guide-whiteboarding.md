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

[The Quicksort algo in a nutshell](https://medium.com/basecs/pivoting-to-understand-quicksort-part-1-75178dfb9313)
> The quicksort algorithm is a sorting algorithm that sorts a collection by choosing a pivot point, and partitioning the collection around the pivot, so that elements smaller than the pivot are before it, and elements larger than the pivot are after it.

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

## Optimization
The partition logic we just implemented is not smart. It chooses the last element every time. Ideally, we want to choose the median of the array as our pivot so we can evenly offload work to the left and right subproblems.

Another place we can optimize is in space efficiency. Our basic quicksort have us build new arrays (i.e., `left` and `right`). Instead of building new arrays, we want to recursively mutate the original array, swapping the elements around until the array is completely sorted.

There are more efficient quicksort implementations that swaps elements in the array.

The names for these are the Hoarse partition and Lomuto partition. Hoarse partition is more efficient than the Lomuto partition. See [all the quicksort implementations here](http://blog.benoitvallon.com/sorting-algorithms-in-javascript/the-quicksort-algorithm/).

# LinkedList Zip

Write a function `zip` that takes two linked lists and return a
linked list that is the result of combining the arguments.

## Whiteboard
{{< image classes="fancybox fig-100 clear" src="/post/images/algo/ll-zip.png"
thumbnail="/post/images/algo/ll-zip.png" title="LinkedList Zip">}}

An issue with the whiteboarded code is right before the loop ends, l1 and l2 are incremented. However, one of them could be null. Getting `next` from null will result in an error. We can fix this by using a conditional ternary operator:

```javascript
l1 = l1 ? l1.next : l1
l2 = l2 ? l2.next : l2
```

## The Code

```javascript
function ListNode(val) {
  this.val = val;
  this.next = null;
}
```

```javascript
function zip(l1,l2) {
  let l3, tail, pred
  // initialize l3
  l3 = new ListNode('')
  tail = l3
  while(l1 || l2) {
    if(l1 !== null) tail.val += l1.val
    if(l2 !== null) tail.val += l2.val

    tail.next = new ListNode('')
    pred = tail
    tail = tail.next

    l1 = l1 ? l1.next : l1
    l2 = l2 ? l2.next : l2
  }

  pred.next = null

  return l3
}
```

# Practice
* [TwoSum](https://repl.it/@xiaoyunyang/TwoSum) - Easy
* [AddTwoNumbers](https://repl.it/@xiaoyunyang/AddTwoNumbers) - Medium

# Resources
* [Ben's Blog](http://blog.benoitvallon.com/) - Basic Algos implemented in JavaScript.
