---
title: "Single Page Application For Work"
date: 2018-05-09
categories:
  - projects
tags:
  - Web Dev
  - Frontend
  - Open Source
  - JavaScript
  - UX
  - Productivity
  - React
thumbnailImagePosition: left
thumbnailImage: /post/images/react.png
---

When I work at my federal job on a close intranet network, we often had to access information from different databases and filesystems through custom or share point websites which did not have the best user interface. It was a pain point for me and many of my colleagues. I decided to make a set of single page applications (SPAs) with nicer UX for querying the databases and file systems.

<!--more-->

# Motivation
On our intranet, the files are very well organized but the websites for accessing those files are slow and cumbersome. While some of the websites are stateful, many are stateless and have a unique URL for each endpoint. Documents reside at the endpoints and the documents are what we want. There were two ways of getting the documents:

1. Go to the website that provides an interface for the database/files system where the document you want is hosted, enter a unique identifier for the document into a form or enter all the fields for generating the form. The websites are very slow and have bad UX.
2. Click on a link that someone else sends you.

When I discovered the patterns in the URLs, I relied on editing the URL directly to avoid having to use the website. When I told coworkers about this method, it wasn't as sensational as I had hoped. It's difficult for a human to construct the right URL by modifying a substring in the URL because the URLs we have are very long and full of seemingly random characters.

That's what gave me the idea of creating a SPA which generates a URL with a simple and user friendly form. 💡

The goal became how to provide a user friendly interface for accessing files using URLs. I decided to build some SPAs consist of forms with nice UI to help construct a URL that can be clicked to access documents from various filesystems on our intranet.

# Design Decision
These are the constraints for the SPAs:

* Needs to run on Internet Explorer 11.
* Need to run without internet.

These constraints motivated the design goal that the apps need to be standalone, with minimal dependencies (zipped with all the files necessary to run the apps), and no preprocessing before it can be run - so no Babel transpiling or npm. Just vanilla JavaScript with ES5.

I used React to build the SPAs with JSXTransformer although [it has been deprecated](https://reactjs.org/blog/2015/06/12/deprecating-jstransform-and-react-tools.html).

The repository for the SPAs are hosted here and contain more specification on the stack:

{{< alert success no-icon >}} **Repo:**  https://github.com/xiaoyunyang/serverless-webapp-no-internet
{{< /alert >}}

# Deployment
Media transferring the zipped repo to the intranet. I had to make a few syntactical changes to the JavaScript I wrote and tested out in Chrome so it can run on IE 11.

Every URL has some unchanging parts and some variable parts. The variable parts could be a single value like a unique identifier, or a collection of values delimited by commas (let's call it a collection-based URL).

The code I imported contained some dummy url to test out so I had to manually input the unchanging parts of the urls in a data structure and for the collection-based URLS, all the possible values for a collection-based URL into another data-structure so it could be used for the dropdown menu with auto-complete capabilities.

![Serverless WebApp](/post/images/projects/serverless-webapp.png)

# Demo

{{< alert success no-icon >}} 🌎 [Click Here](/serverless-webapp/apps/avail-viewer.html) for the live Demo
{{< /alert >}}
