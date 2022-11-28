---
title: "i18n Challenges and Solutions"
date: 2023-11-25
categories:
  - blog
tags:
  - JavaScript
  - Open Source
  - Software Design
keywords:
  - ESLint Plugin
  - web development
  - javascript
  - guide
thumbnailImage: /post/images/open-source/cover.png
thumbnailImagePosition: left
---

I have recently open sourced a ESLint plugin for OkCupid. The plugin enforces localization best practices by catching and fixing errors during development. The plugin rules were inspired by the learning pains from our efforts to localize our website.

<!--more-->

## What is Localization

<https://www.smartling.com/resources/101/localization-101/>

<https://www.smartling.com/resources/101/how-to-localize-your-mobile-app/>

Localization is the process of preparing the software to be translated into multiple languages.

There are certain anti-patterns we need to avoid when localizing our website code.

This tool helps developers identify these anti-patterns during development, thus reducing localization bugs and improves the speed of getting the website translated.

Without getting too much into the weeds,

Another benefit is engineer recruiting as this tool is also useful for the general public. By associating OkCupid brand with the open source project, we hope it will attract engineering talent and improve brand recognition.

We need to localize strings in our codebases in order to provide a our users we do not speak English.

I previously worked at smartling.

- leading trailing spaces
- emoji consistency

How to come up with the rules?

- Look at all the questions raised by translators in our TMS.
- Look at the QA issues raised on the source string.

### Terminologies

- **Wrapping strings**

## Linting

> Linting is something that will save you time, not
> My friend Bryan open sourced an ESLint plugin for Square. He gave a at Ember Conf

> A lot could be improved about the development process Developers often making the same mistakes again and again

## Locale Fallback

If you ever have to implement your own locale fallback,

## Language Selector

The industry best practice is the show the native name of the language in the language selector rather than its English name (e.g., Deutsch instead of German).

Don't create custom dictionary (unless you plan on open sourcing it). Use a well maintained library for getting language name from locale.

There is a library [language-mapping-list](https://github.com/mozilla/language-mapping-list) that can be leveraged to get the language native name based on the locale. This list is maintained by Mozilla.

[Don't use flags in the language selector](https://davidboniface.net/best-practice-for-presenting-website-language-selection/). There are over 6000 languages in use in the world but only 195 actual countries. The population of a country may speak multiple languages.

## Concatenated Strings

Avoid splitting sentences into several keys because that assumes grammar rules and sentence structures that may not work in other languages. Concatenation during

. concatenating strings and placeholders to create sentences. This makes the order of the words hardcoded.

Splitting sentences into several keys presumes grammar rules and a certain sentence structure. If you use conditional statements and conditionalize single terms or a portion of a sentence, the granularity of conditional text might cause confusion during the translation process.

I spent the first day learning while . Reading [ESLint developer guides](https://eslint.org/docs/developer-guide/), tutorials and blog posts about how to write a plugin, the some blog posts, tutorials, and studying other ESLint plugins, I
