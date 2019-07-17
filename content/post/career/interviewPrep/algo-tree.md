---
title: "Data Structure with JavaScript Object: Tree"
date: 2019-06-22
draft: true
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
  - tree
thumbnailImagePosition: left
thumbnailImage: /post/images/algo/tree.png
---

A Tree is like a [Linked list](/data-structure-with-javascript-object-linked-list/) but each node usually points to two other nodes instead of just one other node. All linked lists are trees but not all trees are linked lists.

<!--more-->
<!--toc-->

# Motivation

Trees are used to solve the following problems:

* Storing sorted objects and quickly retrieving (Binary Search Tree)

# Definition

```javascript
function TreeNode(val) {
   this.val = val;
   this.left = this.right = null;
 }
```

# Tree Basics

```
[5,4,8,11,null,13,4,7,2,null,null,5,1]

      5       <----- root
     / \
    4   8     <----- children whose parent is root
   /   / \
  11  13  4
 /  \    / \
7    2  5   1  <---- leaves
```

To make the tree above using our `TreeNode`, we do this:

Can we codify how do we test if a given node is a leaf? A leaf is something that has no children so:

```javascript
function isLeaf(node) {
  return !node.left && !node.right
}
```

## Add to Tree

```javascript
let tree = new TreeNode(5)
let curr = tree // 5
curr.left = new TreeNode(4)
curr.right = new TreeNode(8)
curr = tree.left // 4
curr.left = new TreeNode(11)
curr = tree.left.left // 11
curr.left = new TreeNode(7)
curr.right = new TreeNode(2)
curr = tree.right // 8
curr.left = new TreeNode(13)
curr.right = new TreeNode(4)
curr = tree.right.right // 4
curr.left = new TreeNode(5)
curr.right = new TreeNode(1)
```

## Traverse a Tree

# Algos:

## Depth First Search (DFS)

## Breadth First Search (BFS)

# More Reading

* Difference between tree and node: [Quora Response](https://www.quora.com/What-is-the-difference-between-Binary-Tree-and-Linked-Lists)
