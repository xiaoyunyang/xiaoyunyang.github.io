---
title: "Data Structure with JavaScript Object: Linked List"
date: 2018-05-16
categories:
  - blog
tags:
  - JavaScript
  - Programming
keywords:
  - computer science
  - javascript
  - interview prep
  - algorithms
  - data structure
  - learn to code
  - linked list
thumbnailImagePosition: left
thumbnailImage: /post/images/algo/linked-list.png
---

Linked list is like an array but more flexible. Elements in an array are stored contiguously in memory while linked lists are stored as nodes with two fields: current value and a pointer to the next thing in the list. We are going to implement linked list in JavaScript and go over some algorithms with the linked list.

<!--more-->
<!--toc-->

We are only going to focus on singly linked list for this article. Doubly linked lists are also implemented sometimes but having an extra pointer to the predecessor of each node increases the overhead of a linked list as we have to keep twice as many pointers.

# Motivation

The main benefit of a linked list is that it is a more memory efficient way of maintaining a dynamic collection of things that could get really large. Because the relationship between the thing and the next thing in the collection is defined by a pointer rather than the proximity in memory, things that are next to each other in the linked list don't need to be physically stored next to each other in memory. As such, you can use a linked list for solving the following problems:

* Maintain a sorted list that you can keep adding things to without overhead of copying the entire list to a new array.
* Maintain a Last in, first out (LIFO) or a stack. Stacks are used for managing computer processes when your main process get interrupted by calling a subroutine.

# Definition
```javascript
function ListNode(val) {
  this.val = val;
  this.next = null;
}
```

# Linked List Basics

## Add to tail

Adding to tail of a linked list of size N is an O(N) operation because you have to traverse the entire linked list to the end. We can create a linked list manually by keep adding to the tail:

```javascript
let l = new ListNode(1)
l.next = new ListNode(2)
l.next.next = new ListNode(3)
```

This creates the following linked list:

```
ListNode {
  val: 1,
  next: ListNode {
    val: 2,
    next:
    ListNode {
      val: 3,
      next: null
    }
  }
}
```

linked list is often drawn as such:  `1 -> 2 -> 3 -> null`.

We can also create a method for `ListNode` that adds a new node to the end of a given chain of ListNodes:

```javascript
ListNode.prototype.add = function(val) {
  let curr = this
  while(curr) {
    if(!curr.next) {
      curr.next = new ListNode(val)
      return this
    }
    curr = curr.next  
  }
  return this
}
```

In the code above, `curr` is a pointer that traverses the entire linked list. `add` is a mutator method which modifies the original linked list (i.e., `this`). Specifically, it modifies the `next` of the last node in the original list by making it point to a new node instead of being null (which means it doesn't point to anything).

```
console.log('l before adding\n', l) //> 1 -> 2 -> 3 -> null
let lmod = l.add(4)

console.log('lmod after adding\n', lmod) //> 1 -> 2 -> 3 -> 4 -> null
console.log('l after adding\n', l) //> 1 -> 2 -> 3 -> 4 -> null
```

## Add to head

Adding to the head of the linked list is an O(1) operation. Let's write a method for `ListNode` called `push`.

```javascript
ListNode.prototype.push = function(val) {
  let head = new ListNode(val)
  head.next = this
  return head
}
```

`push` does not modify the original list, which becomes a subset of the extended list with a new head whose `next` points to the original array.

```javascript
let lmod = l.push(0)
console.log('lmod', lmod) // 0 -> 1 -> 2 -> 3
console.log('l', l) // 1 -> 2 -> 3 ...same as before
```

## Remove from head

```javascript
ListNode.prototype.pop = function() {
  return this.next
}
```

# Algos:

## Create Linked List from Array

```javascript
let arr1 = ['a', 'b', 'c']
let arr2 = ['x', 'y', 'z']
let curr = new ListNode(0)
let tail = null

let l1 = createLL(arr1)
let l2 = createLL(arr2)
```

Now we write our `createLL` function:

```javascript
function createLL(arr) {
  let ll, head
  // initialize ll:
  ll = null
  for(let i=arr.length-1; i>=0; i--) {
    head = new ListNode(arr[i])
    head.next = ll
    ll = head
  }
  return ll
}
```

The result:

```javascript
console.log('l1:\n', l1) //> a -> b -> c -> null
console.log('l2:\n', l2)  //> x -> y -> z -> null
```


`push` and `pop` are stack operations.  Stack is a data structure that's generally implemented with a linked list.

## Zip

`zip` takes two linked lists and return a linked list that is the result of combining the arguments:

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

  pred.next = null // Doing tail = null here doesn't work. Why?

  return l3
}
```

Let's run `zip` on `l1` and `l2` from earlier:

```javascript
let l3 = zip(l1,l2)
console.log('l3:\n', l3)
```

```
l3:
 ListNode {
  val: 'ax',
  next: ListNode {
    val: 'by',
    next: ListNode {
      val: 'cz',
      next: null
    }
  }
}
```

Why did we need `pred`? Why can't we do `tail = null` or `tail = tail.next`?

Well, when we break out of the loop, `tail` is point to an object `ListNode {val: '', next: null}`, which is part of `l3`. Setting `tail` to null doesn't set that object to null but rather destroys the reference to that object. setting `pred.next` to null modifies the predecessor node so instead of point to `ListNode {val: '', next: null}`, it points to null.

A simpler example to understand the concept of JavaScript object and references is with this example:

```javascript
let arr = [1,2,3]
let arr2 = arr
arr2.pop()
console.log('arr:', arr) // #1
arr2 = null
console.log('arr:', arr) // #2
```

`#1` prints out `arr: [1,2]` because arr2 is a reference to arr and when we use the Array mutator method `pop` on arr2, arr is mutated.

`#2` prints out `arr: [1,2]`, not null. When we set `arr2` to null, we destroy a reference to the array in arr2 but `arr` still maintains a reference to the array.

JavaScript has some primitives which are object-like because they have methods, but making a copy actually makes a hard copy:

JavaScript primitive: Number

```javascript
let a = 1
let b = a
b = 13
console.log(a) //> 1
```

JavaScript primitive: String
```javascript
let c = 'hi'
let d = c
d = 'bye'
console.log(c) //> "hi"
```

## Reverse

Write a function `reverseLL` which takes a linked list and returns a linked list that's the reverse. For example, `1 -> 2 -> 3 -> null` becomes `3 -> 2 -> 1 -> null`I'm using a recursive function but you can use a loop to do this.

```javascript
const reverseLL = (ll, revLL) => {
  if(ll === null) return revLL
  let newRevLL = new ListNode(ll.val)
  newRevLL.next = revLL
  return reverseLL(ll.next, newRevLL)    
}

let l3Rev = reverseLL(l3, null)
console.log('l3Rev:\n', l3Rev)
```

```
l3Rev:
 ListNode {
  val: 'cz',
  next: ListNode {
    val: 'by',
    next: ListNode {
      val: 'ax',
      next: null
    }
  }
}
```

All the code is [here](https://repl.it/@xiaoyunyang/DataStructure-LinkedList)
