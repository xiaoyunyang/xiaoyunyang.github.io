---
title: "Get Started With Go"
date: 2019-02-03
categories:
  - blog
tags:
  - Go
  - Guide
thumbnailImagePosition: left
thumbnailImage: https://images2.imgbox.com/49/17/WNnaYp5v_o.png
---

Go is becoming pretty mainstream. Every job posting I've seen recently requires Go as a want-to-have or a need-to-have skill. This post serves as a guide to help you hit the ground running with Go.

<!--more-->

{{< toc >}}

![Go Gopher](https://images2.imgbox.com/f8/aa/OSwaqz8O_o.png)

{{< alert info >}} This is a Live Document. I will be updating it periodically. {{< /alert >}}

{{< toc >}}

# What is Go

[Go](https://github.com/golang/go) is a programming language created by Google. It started as an experiment by some engineers, to develop to address the pain points of C++ and Java without compromising performance and capability that those languages provides. Other than a well-thought design, it has some specific features for concurrency like a type of light-weight processes called goroutines.

In [Tomassett's blog article](https://tomassetti.me/best-programming-languages/) on best articles for each situation, he writes:

> All its Go's authors expressed a dislike for C++ complexity. So, in some way, it is a language designed to persuade C people to enter the new century.

## Why Learn Go

1. It's [easy to learn](https://movio.co/en/blog/migrate-Scala-to-Go/).
2. It let's you do concurrency without the overhead.
3. It's type safe.
4. It's fast.

This article discusses the [business case for why learn go](https://medium.com/@kevalpatel2106/why-should-you-learn-go-f607681fad65), including Moore's law is failing, which drives the need for a language with built-in concurrency support. [Concurrency is not parallelism](https://blog.golang.org/concurrency-is-not-parallelism).

> concurrency is the **composition** of independently executing processes, while parallelism is the simultaneous execution of (possibly related) computations. Concurrency is about **dealing with lots** of things at once. Parallelism is about **doing lots** of things at once.

## Language Features

- Easy to learn - [See this article](https://movio.co/en/blog/migrate-Scala-to-Go/)
- Built-in Concurrency Support
- Go is that it's a modern high performant low level language with built in concurrency support and strong type system
- supports OOP but instead of class inheritance, it uses composition
- Supports lambda expressions with their function literals and also supports higher order functions
- The market share for Go is networking and servers but based on current trends, it seems Go will beat C, C++, Java, and Rust in the language for building infrastructure since the future is multicore processing. Go is not totally mainstream yet but is gaining a lot of traction

## Go Offers Best Balance

There used to be a time when programmers have to make a tradeoff between and efficient code and clean and easy to read code when selecting a language.

Go lets you write efficient and clean code.

{{< image classes="fancybox fig-100 center clear" src="https://images2.imgbox.com/70/3b/DVneDl91_o.png"
thumbnail="https://images2.imgbox.com/70/3b/DVneDl91_o.png" title="Go is efficient and easy to write and manage">}}

# Your First Go Program

## Set up

Download Go from [this link](https://golang.org/dl/) and install Go on your computer.

Set up GOPATH and GOBIN:

1. Add $GOPATH and $GOBIN

   ```bash
   $ vim ~/.bash_profile
   ```

   Add the following lines to .bash_profile

   ```bash
   export GOPATH=$HOME/go
   export GOBIN=$HOME/go/bin
   ```

2. Refresh `.bash_profile` for the GOPATH and GOBIN to take effect:

   ```bash
   $ . ~/.bash_profile`
   ```

3. Verify paths

   ```bash
   $ echo $GOPATH
   /Users/xiaoyun/go
   ```

For more information about GOPATH, checkout [the wiki](https://github.com/golang/go/wiki/SettingGOPATH).

## Cat program

We will implement `cat` in Go. It should take at least one argument which specifies the file name and prints out the contents.

```go
package main

import (
  "fmt"
  "io"
  "os"
)

func main() {
  if len(os.Args) < 2 {
    _, err := io.Copy(os.Stdout, os.Stdin)

    if err != nil {
      fmt.Fprintf(os.Stderr, "%v\n", err)
      os.Exit(1)
    }

    os.Exit(0)
  }

  for _, files := range os.Args[1:] {
    r, err := os.Open(files)
    if err != nil {
      fmt.Fprintf(os.Stderr, "%v\n", err)
      continue
    }

    _, cerr := io.Copy(os.Stdout, r)

    if cerr != nil {
      fmt.Fprintf(os.Stderr, "%v\n", err)
      continue
    }
    r.Close()
  }
}
```

Save the code to a file called `cat.go`. Then in the same directory, create two files:

```bash
$ echo foo! > foo
$ echo bar! > bar
```

Build the cat program in go:

```
$ go build cat.go
```

Then we can run our cat program as such:

```
$ ./cat foo bar
foo!
bar!
```

We don't have to build a program to run it. Another way to run the program:

```
$ go run cat.go foo bar
```

# Dependencies

To use libraries created by the Go community in your code, we can use the `go get` command. A pre-requisite is to have `GOPATH` set.

For example, let's use [SVGo](https://github.com/ajstarks/svgo):

```
$ go get github.com/ajstarks/svgo
```

The command above basically performs a `git clone` and download all the code from that repository into `$GOPATH/src/github.com/ajstarks/svgo`. After executing the command, you can use the svgo library as follows:

```go
package main

import (
  "math/rand"
  "os"

  svg "github.com/ajstarks/svgo"
)

var (
  canvas = svg.New(os.Stdout)
  width  = 1000
  height = 500
)

func main() {
  canvas.Start(width, height)
  canvas.Gstyle("fill:#22264b")

  var color string
  radius := 90
  step := 8

  for i := 0; i < 200; i++ {
    if i%4 == 0 {
      color = "#e6cf8b"
    } else {
      color = "#b56969"
    }

    x, y := rand.Intn(width), rand.Intn(height)

    for r, nc := radius, 0; nc < 10; nc++ {
      canvas.Circle(x, y, r, "stroke:"+color)
      r -= step
    }
  }

  canvas.Gend()
  canvas.End()
}
```

Run the code above using `go run main.go > circles.html && open circles.html` generates the following image:

![](https://images2.imgbox.com/03/bc/WbCkgbm6_o.png)

## Go Modules

Go v.1.11 introduced Go modules, which is a dependency management solution in Go. Here's a good introduction to go.modules:

- [Walkthrough](https://github.com/Yigenana/WWGNYC/blob/master/go-modules/INSTRUCTIONS.md)
- [Slides](https://github.com/Yigenana/WWGNYC/blob/master/go-modules/Getting-Started-with-Go-Modules.pdf)

# Stuff to check out

- [SVGo](https://github.com/ajstarks/svgo) - generates SVG and canvas elements
- [Athens](https://github.com/gomods/athens) - A Go module datastore and proxy (NPM for Go)
- [GopherizeMe](https://gopherize.me/) - Make Gopher version of yourself
