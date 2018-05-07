---
title: "So You Wanna Be A Gopher Eh?"
date: 2018-05-06
categories:
  - blog
tags:
  - Go
  - Guide
thumbnailImagePosition: left
thumbnailImage: /post/images/go/gopher.png
---

Go is becoming pretty mainstream. Every job posting I've seen recently requires Go as a want-to-have or a need-to-have skill. Here's a guide to help you hit the ground running with Go.

<!--more-->

![Go Gopher](/post/images/go/gophers-learn.png)

{{< alert info >}} This is a Live Document. I will be updating it periodically. {{< /alert >}}

<!-- toc -->

# What is Go
[Go](https://github.com/golang/go) is a programming language created by Google. It started as an experiment by some engineers, to develop to address the pain points of  C++ and Java without compromising performance and capability that those languages provides. Other than a well-thought design, it has some specific features for concurrency like a type of light-weight processes called goroutines.

In [Tomassett's blog article](https://tomassetti.me/best-programming-languages/) on best articles for each situation, he writes:

> All its [Go's] authors expressed a dislike for C++ complexity. So, in some way, it is a language designed to persuade C people to enter the new century.

## Why You Should Learn Go

1. It's [easy to learn](https://movio.co/en/blog/migrate-Scala-to-Go/).
2. It let's you do concurrency without the overhead.
3. It's type safe.
4. It's fast.

This article discusses the [business case for why learn go](https://medium.com/@kevalpatel2106/why-should-you-learn-go-f607681fad65), including Moore's law is failing, which drives the need for a language with built-in concurrency support. [Concurrency is not parallelism](https://blog.golang.org/concurrency-is-not-parallelism).

> concurrency is the **composition** of independently executing processes, while parallelism is the simultaneous execution of (possibly related) computations. Concurrency is about **dealing with lots** of things at once. Parallelism is about **doing lots** of things at once.

## Features of Go

* Easy to learn - [See this article](https://movio.co/en/blog/migrate-Scala-to-Go/)
* Built-in Concurrency Support
* Go is that it's a modern high performant low level language with built in concurrency support and strong type system
* supports OOP but instead of class inheritance, it uses composition
* Supports lambda expressions with their function literals and also supports higher order functions
* The market share for Go is networking and servers but based on current trends, it seems Go will beat C, C++, Java, and Rust in the language for building infrastructure since the future is multicore processing. Go is not totally mainstream yet but is gaining a lot of traction

## Go Offers Best Balance

There used to be a time when programmers have to make a tradeoff between and efficient code and clean and easy to read code when selecting a language.

Go lets you write efficient and clean code.

{{< image classes="fancybox fig-100 center clear" src="/post/images/go/efficient-and-clean.png"
thumbnail="/post/images/go/efficient-and-clean.png" title="Go is efficient and easy to write and manage">}}
