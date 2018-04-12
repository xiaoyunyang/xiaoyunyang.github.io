---
title: "Using Hugo To Build A Personal Brand Website"
date: 2018-04-07
categories:
  - projects
tags:
  - WebApp
  - Career
  - Productivity
thumbnailImagePosition: left
thumbnailImage: /post/images/unique.png
coverImage: /post/images/unique.png
---

It's not always clear why we need need a personal website. But here's the truth: we are a product (a brand) with unique skills to offer to prospective employees and customers. A website is an effective medium to let the world know who we are, what we are capable of, and what our values are. Building a personal website has never been easier these days with tools like [Hugo](https://gohugo.io/).

<!--more-->

## What A Personal Brand Website Needs
I need a website to:

1. Showcase my projects,
2. Blog about programming and my other interests, and
3. Share information about me that would be of interest to a recruiter, including my resume, email, and links to my Github, Medium, and LinkedIn pages.

## Why Use A Static Site Generator
My old personal website was built with vanilla HTML, React, and [marked](https://github.com/markedjs/marked) to dynamically load markdown files. It was high maintenance and not scalable. Although I kinda set the website up to separate content from code, I still had to go into the code when I want to add more pages to the website. The website was set up to display three pages: Work, About, and Writing, which included links to articles I [published on Medium](https://medium.com/@xiaoyunyang/latest).

My old website was bootstrapped. I wanted something set up quickly and didn't have a lot of time to architect it. I had on my todo-list for a long time to clean up the code for the website to also let it function as a blog.

One day I watched [a talk on YouTube](https://www.youtube.com/watch?v=KX4G49ZrvY0) by a content management system (CMS) evangelist. He discussed the benefits of using a CMS to generate a website composed of content from markdown and text files. This promotes separation of content from code and better security and speed at which content is delivered. Some CMS are either git-backed or talk to an API.

This is when I decided to abandon my old website. I built my old website as a static site generator. Writing all the code myself and maintaining the codebase seems like a low-value added activity, especially when I can simply leverage existing static site generators. I rather spend my time creating content for my website and work on my various other projects.

## Why I Chose Hugo
I'm going with the git-backed option for a personal brand website because I want to use github to host my website for free and having an API to serve static files just seems like an overkill for a simple personal / blog website.

I researched different options for [static site generators](https://www.netlify.com/blog/2016/05/02/top-ten-static-website-generators/). My criteria are:

1. **Speed** - This includes speed of development (getting a website up and running quickly), and the performance of the website at delivering content.
2. **Popularity** - A very important but often overlooked aspect of choosing a technology is how many people use it. When a technology is popular, you'd be able to get more community support (e.g. StackOverflow, tutorials, sample projects) and the creators of the tools have an incentive to continue to support and improve upon their product.
3. **Customization**  - This is a fringe criterion. Style and uniqueness of the website are not super important for me. I want my website to be a place to share information about me and having too unique of a website could make it more difficult for visitors of the website to find information. Still, it'd be nice if I have the option to choose from different layouts for my website and some customization like fonts.

From my research, a few static site generators impressed me:

* [Jekyll](https://jekyllrb.com/): Built with Ruby and uses Liquid templates. Very popular, created by the founder of Github, and offers free hosting on Github.
* [Docusaurus](https://docusaurus.io/): Built with JavaScript and uses Markdown templates. Created by Facebook engineers to create and maintain documentation.
* [Gatsby](https://www.gatsbyjs.org/): Built with JavaScript and uses React.js templates. Gatsby is a static Progressive Web App generator good for websites that are mostly static (for example, a portfolio or a blog). You can write your website in React (Create-React-App) and Gatsby pre-renders the website into HTML at the build time.
* [Next](https://github.com/zeit/next.js): Built with JavaScript and uses React templates. A framework for statically-exported React apps.
* [Hugo](https://gohugo.io/): Go and Go Template

I ultimately went with Hugo because it's popular, has a plethora of [themes](https://themes.gohugo.io/) to choose from, lets you [host from github](https://gohugo.io/hosting-and-deployment/hosting-on-github/), and provides a simple workflow and a straightforward means of customizing your site.

## Creating A Website Powered By Hugo
Setting up the Hugo project is easy enough with their [5-step Quick Start](https://gohugo.io/getting-started/quick-start/) Tutorial. Choosing a template took a while. The [Hugo templates](https://themes.gohugo.io/) are created by third party developers and are hosted from Github. I want a template that not only looks good, but has good documentation, lots of users, and is actively maintained. I ultimately went with the [tranquilpeak](https://github.com/kakawait/hugo-tranquilpeak-theme) template, which has the nice sidebar navigation that I adore, well maintained as an open source project, and has a good number of users.

## Conclusion
I need a personal website to build my brand, assemble a portfolio for myself and let the world know who I am and what I care about by keeping a blog. I want to focus on the "what" and not the "how" for my personal website. Thus, I'm leveraging a static site generator like [Hugo](https://gohugo.io/).
