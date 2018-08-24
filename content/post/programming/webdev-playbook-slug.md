---
title: "Web Developer Playbook: Slug"
date: 2018-07-14
categories:
  - blog
tags:
  - JavaScript
  - Guide
  - Web App
  - Node
keywords:
  - Software Design
  - web development
  - JavaScript
  - Slug
  - SEO
---
![](/post/images/webdev-manual-cover.png)
This post is part of the Web Developer Playbook series, which are created to provide examples, best practice, and suggestions for designing and building web services. I will be using libraries from the JavaScript ecosystem (e.g., Node.js, React.js) in all my examples.


<!--more-->
{{< alert info >}} This article was also [published on Medium](https://medium.com/dailyjs/web-developer-playbook-slug-a6dcbe06c284) under DailyJS. {{< /alert >}}

## What is a Slug?

A slug is the last part of the url containing a unique string which identifies the resource being served by the web service. In that sense, a slug is a unique identifier for the resource. For example, the slug for this article, which has the url of http://xiaoyunyang.github.io//web-developer-playbook-slug is: `web-developer-playbook-slug`.

Some websites are designed to have slugs contain actual words of the title of the resource being services. For instance:

* Medium
  * URL:  https://medium.com/@xiaoyunyang/how-to-do-object-oriented-programming-the-right-way-1339c1a25286
  * Slug: `how-to-do-object-oriented-programming-the-right-way-1339c1a25286`
* Blog of the famous movie critic Roger Ebert
  * URL: https://www.rogerebert.com/reviews/great-movie-mulholland-dr-2001
  * Slug: `great-movie-mulholland-dr-2001`
* Yelp:
  * URL: https://www.yelp.com/biz/old-ebbitt-grill-washington
  * Slug: `old-ebbitt-grill-washington`
* Crunchyroll:
  * URL: http://www.crunchyroll.com/food-wars-shokugeki-no-soma/episode-1-challenging-the-elite-ten-749165
  * Slug: `episode-1-challenging-the-elite-ten-749165`
* Repl.it
  * URL: https://repl.it/@xiaoyunyang/slugify
  * Slug: `slugify`

Other websites are designed to have slugs that contain seemingly random string of characters. For instance:

* Codepen:
  * URL: https://codepen.io/stefanjudis/full/gkHwJ
  * Slug: `gkHwJ`
* Youtube
  * https://www.youtube.com/watch?v=fCn8zs912OE
  * Slug: `watch?v=fCn8zs912OE`

When a resource is requested, the client sends a slug to the server's API to look up the resource from the database and return a JSON containing everything the client needs to be able to display the resource.

> A slug is a unique identifier for the resource.

Underline unique.

The basis for embedding title in the slug is Search Engine Optimization (SEO) and UX. Per [Google's SEO Guide](https://support.google.com/webmasters/answer/7451184?hl=en).

> Creating descriptive categories and filenames for the documents on your website not only helps you keep your site better organized, it can create easier, "friendlier" URLs for those that want to link to your content. Visitors may be intimidated by extremely long and cryptic URLs that contain few recognizable words.

DO
![](/post/images/webdev-manual-url-good.png)

DON'T
![](/post/images/webdev-manual-url-bad.png)

# Slugifying The Title

Now we know why having a url containing title of our resource is useful, let's walk through how to create a url with slugified title.

The URL is case sensitive, so the best practice for embedding a title of the resource into the url is to have all lowercase letters joined by a dash (kebab case). We can create a function called `slugify` (courtesy of [Matt Hagemann's Medium post](https://medium.com/gatemill/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1)), which creates a kebab case, url friendly version of the title string:

```javascript
const slugify = (string) => {
  const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
  const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters in a with b
    .replace(/&/g, '-and-') // Replace & with ‘and’
    .replace(/[^\w-]+/g, '') // Remove all non-word characters such as spaces or tabs
    .replace(/--+/g, '-') // Replace multiple — with single -
    .replace(/^-+/, '') // Trim — from start of text
    .replace(/-+$/, ''); // Trim — from end of text
}
```

This turns the following string:

`I'm a </little> Tea---Pot Short & Stout ♥`

into:

`im-a-little-tea-pot-short-and-stout`


A potential issue with using just the title to create the slug is there could be multiple resources with the same title. We can solve this problem by appending some additional information to distinguish resources with the same title, For Roger Ebert's movie blog, that's the year in which the movie was released. For Yelp's restaurant page, that's the city of the restaurant. For Medium, that's some pseudo-random characters.

For cases where there's less predictability in the name of the title, lots of options exist to create a pseudo-random character for the slug, which we will refer to hereafter as the `fingerprint`.

Matt Hagemann [recommended](https://medium.com/@matthagemann/very-welcome-and-great-question-6945bebfe233) [`shortid`](https://github.com/dylang/shortid). It's an excellent choice. But I ended up going with [`cuid`](https://github.com/ericelliott/cuid) created by Eric Elliot.

To finish our example with creating the unique slug with a slugified title, we are going to create a new function:

```javascript
const urlSlug = (title, fingerprint) => {
  return `${slugify(title)}-${fingerprint}`;
}
```

We call the `urlSlug` function as follows:

```javascript
const cuid = require('cuid');
const slug = urlSlug(title, cuid.slug());
```

If your title is `I'm a </little> Tea---Pot Short & Stout ♥`, It will give you a `slug` like this:

`im-a-little-tea-pot-short-and-stout-w40n25k`

And that's it!

# Using the Slug

Finally, how do we integrate the slug into our overall web service and what does the interaction between the client application and server application look like?

Suppose the user is creating a new item for sale on an e-commerce website (let's call it *www.mytrashyourtreasure.com*, which I'm surprised is not a real site!) using a form. The client application manages the form and collecting data from the user input for submittal to the server.

When the user presses the "Submit" button, the client application will send all the form data to the server application by making an HTTP POST request.

The server needs to do a few things:

1. Verify that the form data contains a non-empty `title` field. If the `title` is empty, send an error status back to the client, along with a message that "the title cannot be empty”. The client can then figure out how to display an error message to the user to fix the problem.
2. Create a new item object in compliance with the database Item model with the information from the form (don't forget to sanitize all the strings). One of the fields need to be the slug created from the `title` field.
3. Send the "200 OK" status to the client, along with the slug.

When client gets the slug, it can redirect the page to the page that displays the item with the following line of code:

```javascript
window.location = `/${res.data}`;
```

Where `res.data` contains the slug. Assume the slug we've created is `cat-paper-clips-set-of-3-w40n25k`.

Setting `window.location` to `/cat-paper-clips-set-of-3-w40n25k` redirects the browser to go to  `https://mytrashyourtreasure.com/cat-paper-clips-set-of-3-w40n25k`. This is no different than putting that url in your browser directly and pressing the enter key or clicking the link from an email.

So what needs to happen when we visit `https://mytrashyourtreasure.com/cat-paper-clips-set-of-3-w40n25k`?

A couple of things will be done by the client and the server in order to load the page for this new item for sale that the user just created:

1. The client sends an HTTP GET request to the server API to get data on this item as such: `GET /api/item/at-paper-clips-set-of-3-w40n25k`
2. The server will use slug as the key for lookup in the database of items. When it finds it, it will send the JSON for this item back to the client.
3. The client takes the JSON to render the page for this item.

Because every item has a unique slug, there is no ambiguity in which item is being requested. The client is guaranteed to get back the JSON for just one item.
