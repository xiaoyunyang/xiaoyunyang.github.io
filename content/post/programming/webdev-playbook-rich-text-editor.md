---
title: "Web Developer Playbook: Rich Text Editor"
date: 2018-08-14
categories:
  - blog
tags:
  - JavaScript
  - Guide
keywords:
  - Software Design
  - web development
  - JavaScript
---

In this article, I will show you add a rich text editor based on Draft.js to your web app. This post is part of the Web Developer Playbook series, created to provide examples, best practice, and suggestions for designing and building web services. I will be using libraries from the JavaScript ecosystem (e.g., Node.js, React.js) in all my examples.
![draftjs](/post/images/projects/draftjs.png).

Let's get started!

<!--more-->

# Draft.js Overview

Draft.js is a React framework for building text editors. It's one of many amazing frontend projects [open sourced by Facebook](https://opensource.fb.com/). According to [its github repo](https://github.com/facebook/draft-js) commit history, Draft.js was open sourced on Feb 22, 2016, so it has not been around for that long.

The following video (or click [this link](https://www.youtube.com/watch?v=1d9R-mD_wOs&feature=youtu.be)) contains a preview of the Rich Text editor Draft.js lets us build. I will show you how to get this set up in your project.

{{< youtube 1d9R-mD_wOs >}}

Before we install dependencies and start writing code, let's go over all the plugins we will use.

Draft.js, being highly customizable, has a lot of [great plugins](https://www.draft-js-plugins.com/) to do everything from shortcuts for mentions and hashtags shortcuts like in Twitter to adding stickers and emojis to the text areas.

For this tutorial, we are going to use these three plugins:

[Inline Toolbar](https://www.draft-js-plugins.com/plugin/inline-toolbar) -  This plugin draws a a little toolbar in a tooltip when you select text to add style to the selected text.

![draftjs inline toolbar](/post/images/projects/draftjs-inline-toolbar.png)

[Anchor Plugin](https://www.draft-js-plugins.com/plugin/anchor) - This plugin is an add-on to the Inline Toolbar plugin. It lets you add a hyperlink to any selected text.

![draftjs anchor plugin](/post/images/projects/draftjs-anchor-plugin.png)

[draft-js-markdown-plugin](https://github.com/withspectrum/draft-js-markdown-plugin) - this plugin lets us use markdown shortcuts to create styles. This is super useful for things like ordered lists and unordered lists.

![](/post/images/projects/draftjs-markdown-plugin.gif)

# Quick Setup

Let's install all the dependencies:

```
$ npm install --save draft-js
$ npm install --save draft-js-plugin-editor
$ npm install --save draft-js-buttons
$ npm install --save draft-js-inline-toolbar-plugin
$ npm install --save draft-js-anchor-plugin
$ npm install --save draft-js-markdown-plugin
```

Where

* `react` and `react-dom` are both dependencies for `draft-js`.
* `draft-js-plugin-editor` is needed for all the plugins.
* `draft-js-buttons` is a dependency for `draft-js-inline-toolbar-plugin`


We also need to make sure the HTML file has this line in `<head></head>` block:

`<meta charset="utf-8" />`

In addition, we need to import `Draft.css` into our project:

```
import 'draft-js/dist/Draft.css';
```

If you are using create-react-app, add the import statement to your index.js file.

# The Code

We are going to create a component called `PostEditor` which incorporates the Draft.js rich text editor and the three plugins. In the video showcase above, I show the editor inside of a [materializeCSS card](https://materializecss.com/cards.html) component (if you are interested). The actual Draft-js editor

**All the code is contained in [this gist here](https://gist.github.com/xiaoyunyang/c0cea1c753c2920ac07b4d6863ebced2).**

I'm not going to walk through line-by-line what's in here. You can refer to the [official doc](https://draftjs.org/docs/getting-started.html) for Draft.js and the tutorials from the DraftJS Plugins website for [the Inline Toolbar](https://www.draft-js-plugins.com/plugin/inline-toolbar) and [the Anchor Plugin](https://www.draft-js-plugins.com/plugin/anchor). I will, however, point out a few Gotchas and hurdles that I had to work through to get the editor working.

## Gotcha 1: Client Render Only

If you are building an isomorphic web app where you are doing both server-side rendering and client-side rendering, make sure the Draft.js code is only rendered on the client side. Otherwise, you'll get an id-mismatch error like this:

![](/post/images/projects/draftjs-id-mismatch.png)

This issue was [discussed in detail here](https://github.com/facebook/draft-js/issues/385). Basically, the ids created inside the Editor is pseudo-random. Every time you refresh the page, the hash changes. To avoid the id-mismatch error in your isomorphic app, my workaround is to use `componentDidMount` to toggle a state variable for the `PostEditor` component called `clientModeOn` (a boolean) to make sure the server application renders `null` while the client application renders `Editor`.

## Gotcha 2: Placeholder

The placeholder appears behind a bullet as shown here:
![](/post/images/projects/draftjs-placeholder-behind-bullet.png)

As discussed [here](https://github.com/facebook/draft-js/issues/446) and [here](https://github.com/facebook/draft-js/issues/1205), placeholder renders conditionally if there is text in `Editor` but it still renders if you have a single unordered-list-item block without any text. Having the bullet directly on top of the placeholder text is obviously not acceptable. Some users of Draft.js prefers to have the placeholder shifted to the right to the right of the bullet. My workaround is to add some logic to make the placeholder value an empty string if there is any decorator like ordered list or unordered list in `Editor`.

The following function was added to `PostEditor`:

```javascript
renderPlaceholder(placeholder, editorState) {
  const contentState = editorState.getCurrentContent();
  const shouldHide = contentState.hasText() ||
   contentState.getBlockMap().first().getType() !== 'unstyled';
  return shouldHide ? '' : placeholder;
}
```
