---
title: "Creating LooseLeaf: A Platform To Support The Future Of Work"
date: 2018-04-12
categories:
  - projects
tags:
  - Web App
  - Entrepreneurship
  - React
  - Node
thumbnailImagePosition: left
thumbnailImage: /post/images/looseleaf/logo.png
---

[LooseLeaf](http://looseleafapp.com) is a passion project and a startup I've been building while serving a 5 year commitment in the military. I've been creating prototypes and iterating on the concept of LooseLeaf since 2015.

<!--more-->


# What is looseleaf
{{< image classes="fancybox fig-20" src="/post/images/looseleaf/logo-long.png" thumbnail="/post/images/looseleaf/logo-long.png">}}
lets you gain relevant work experience as a developer, designer, and writer by helping Non-profits. LooseLeaf is an intersection between an online learning platform and a freelancing platform. I founded LooseLeaf to connect people with opportunities to gain relevant work experience. LooseLeaf is envisioned to disrupt the higher education industry, which is becoming increasingly unaffordable and out of touch with real world needs. LooseLeaf takes advantage of the rising popularity of the sharing economy and creates a space for those eager build skills with those looking to delegate work for their coding, design, or research projects without paying a lot to hire a freelancer or an employee.

**One-liner**:  Build Skills by Helping Nonprofits.

# What I've Done
I began creating LooseLeaf in July 2015. On top of the software engineering and product development for LooseLeaf, I'm also responsible for graphic design and marketing. Recently I exhibited LooseLeaf at LA TechDay, which is the second TechDay since DC TechDay in 2015 during which I presented the product for public feedback.

Here's the timeline for what I've accomplished for LooseLeaf. It has been a long process of trial and error. Some lessons learned about software development and the startup process are highlighted:

## Iteration 1
*June 2015 - January 2016*

* Envisioned LooseLeaf as a place for college students to share notes and tips
* Created a single page application using D3 and React to create a way to navigate related content based on tags
* Got a booth at a startup conference (TechDay) in Washington DC to present the early idea of LooseLeaf. Initial feedback from attendees were they were confused what LooseLeaf is supposed to do and want to see actual examples of how it works. {{< hl-text blue >}}[Lesson Learned]{{< /hl-text >}}

## Iteration 2
> LooseLeaf is a social bookmarking based learning management platform that delivers relevant learning content to learners and also make the careers of professional online content creators more sustainable. The learning content is in the form of bookmarks crowdsourced and curated by subject matter experts and LooseLeaf's recommendation algorithms. Users get data visualizations and recommendations to filter and explore their bookmarks and bookmarks from the community.

*January 2016 - October 2016*

* Generalized a use case for LooseLeaf as a social bookmarking site for learning content.
* Developed more pages for the single page application powered by React and data from csv files hosted from google drive.
* Developed two interactive data navigation and visualizations (heat-map and donut chart) in D3 that for finding and discovering related links in a collection and summarizing the collection.
* Started developing a Chrome plugin for creating a bookmark of any webpage for LooseLeaf's knowledge database.
* Developed marketing material for presenting LooseLeaf at a TechDay in Los Angeles. Used Adobe Illustrator, free vector graphics available online to create banners, flyers, illustrations on LooseLeaf's site.
* Incorporated LooseLeaf as an LLC in Washington DC
* Presented LooseLeaf at TechDay Los Angeles and received some lukewarm feedback from attendees.

LooseLeaf exhibited at LA TechDay in September 2016.
{{< youtube fKWuc5rwtlU >}}
{{< image classes="fancybox fig-100 nocaption" src="/post/images/looseleaf/techday.png" thumbnail="/post/images/looseleaf/techday.png" title="LooseLeaf at TechDay LA in 2016">}}
{{< image classes="fancybox fig-50 nocaption" src="/post/images/looseleaf/chrome-plugin.png" thumbnail="/post/images/looseleaf/chrome-plugin.png" thumbnail-height="450px" title="LooseLeaf's Chrome Plugin For Saving Webpages to Collection">}}
{{< image classes="fancybox fig-50 nocaption" src="/post/images/looseleaf/landing-world.png" thumbnail="/post/images/looseleaf/landing-world.png" thumbnail-height="250px" title="Original vision of LooseLeaf to be a notebook of useful learning content on the web">}}
{{< image classes="fancybox fig-50 nocaption clear" src="/post/images/looseleaf/fullstack.png" thumbnail="/post/images/looseleaf/fullstack.png" title="Technology Full Stack for LooseLeaf in early vision">}}


*December 2016 - February 2017*

* Ported the single page application to my day job work computer to try it out as a knowledge management tool and get coworkers to use it. The best we have for our knowledge management system on the classified network are share-point sites and folders on shared drives. Through personally using the tool at work and discussing with coworkers, I realized people are not interested in using a new tool for "tribal knowledge" management because (1) you either already have a system for organizing content or (2) you are not really that interested in knowledge management for "tribal knowledge" beyond what was formally required for documentation purposes. {{< hl-text blue >}}[Lesson Learned]{{< /hl-text >}}
* Paused work on LooseLeaf idea development and frontend development due to the realization that the idea for LooseLeaf needs to be revised and frontend design is tightly coupled with the product design, which requires the idea for LooseLeaf to be firmed up.
* Started backend development while frontend development is paused. The server side development originally began with the Play framework, which utilized Scala and can leverage the Java ecosystem.

*February 2017 - August 2017*

* Decided pause server side development for LooseLeaf to work on a side project building a React Native mobile application. This pause to the server development was partly motivated by the realization that Play and Scala are not popular so there was not that much support from the community with respect to open source projects, Stackoverflow, Github repos, and tutorials. This added frustration and time to the development process. {{< hl-text blue >}}[Lesson Learned]{{< /hl-text >}}
* Development of the React Native application exposed me to the rich JavaScript ecosystem, tools (e.g., webpack), and the expressiveness of ES6.

## Iteration 3

> LooseLeaf lets you gain relevant work experience as a developer, designer, and writer by volunteering for Non-profits.

*January 2017 -*

> My startup is called LooseLeaf. It lets people build skills by helping Nonprofits. People can gain relevant work experience as a developer, designer, and writer while volunteering to assist a nonprofit.

* Revised idea for LooseLeaf to be what it is now.
* Started isomorphic application development using full stack JavaScript (React and Node.js) and the latest tech stack in the JavaScript ecosystem.
