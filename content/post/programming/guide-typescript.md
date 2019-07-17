---
title: "Intro to TypeScript and Cheatsheet for TypeScript"
date: 2019-09-16
categories:
  - blog
tags:
  - JavaScript
  - TypeScript
  - Guide
  - Software Design
keywords:
  - programming
  - web development
  - typescript
  - javascript
  - interview prep
thumbnailImagePosition: left
thumbnailImage: /post/images/brain-lightbulb.png
---

An introduction to TypeScript and a cheatsheet for getting productive in TypeScript.

<!--more-->
<!--toc-->

# TypeScript vs JavaScript

## A Simple Example

The example is taken from TypeScript's [quick start tutorial](http://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

In JavaScript

```javascript
const greeter = (person) => "hello "+person;
greeter([1,2,3]) // "hello 1,2,3"
```

In TypeScript

```typescript
const greeter = (person) => "hello "+person; // error: Parameter 'person' implicitly has an 'any' type.
```

> TSError: ⨯ Unable to compile TypeScript:
> index.ts:1:18 - error TS7006: Parameter 'person' implicitly has an 'any' type.

Unable to compile - TypeScript provides static typing.

```javascript
const greeter = (person: string) => "hello " + person;
greeter([1,2,3]) // X3 error: Type 'number' is not assignable to type 'string'
```

The error is printed out three times because there are three numbers in the array.

```javascript
const greeter = (person: string) => "hello " + person;
greeter([1,2,3]) // error: Type 'number' is not assignable to type 'string'
```

```javascript
const greeter = (person: string) => "hello " + person;
greeter(["1","2","3"]) // error: Argument of type 'string[]' is not assignable to parameter of type 'string'.
```

# TypeScript vs Flow

## Inline

```javascript
// Flow
function getUser (): { name: string, age: number }

// TypeScript
// Note the semicolon
function getUser (): { name: string; age: number }
```

## Explicit

Flow has [type alias](https://flow.org/en/docs/types/aliases/)

```javascript
// Flow
type User = {
  name: string,
  age: number
}

function getUser (): User
```

TypeScript has [interface](https://www.typescriptlang.org/docs/handbook/interfaces.html)

```javascript
// TypeScript
interface User {
  name: string;
  age: number;
}

function getUser (): User
```

## Optional Type

```javascript
// Flow
type User = {
  name: string,
  age: number,
  location?: string
}

// TypeScript
interface User {
  name: string;
  age: number;
  location?: string;
}
```

## Maybe Types

[Flow Maybe Types](https://flow.org/en/docs/types/primitives/#toc-maybe-types)

```javascript
// Flow
function acceptsMaybeString(value: ?string) {
  // ...
}
```

In addition to the type in `?type`, maybe types can also be `null` or `void`.

## Type of functions

```javascript
// Flow
type Date = {
  toString: () => string,
  setTime: (time: number) => number
}

// TypeScript
interface Date {
  toString(): string;
  setTime(time: number): number;
}
```

## Enums

From Steve Faulkner's [deck about best practice for TypeScript](https://speakerdeck.com/southpolesteve/shipping-typescript-to-npm?slide=50)

```javascript
// TypeScript


```

# Flow Basic Types

## Flow

- `number`, `string`, `boolean`, `null`, `typeof undefined`

Optional Types

## TypeScript

- `any`
- `void`
- Primitives: `boolean`, `number`, `string`, `null`, `undefined`
- Array
  - `string[]`
  - `Array<string>`
- Tuple: `[string, number]`
- Union: `string | null | undefined`
- Unreachable
  - `never`

# Resources

- [TypeScript Cheatsheet from devhint](https://devhints.io/typescript)