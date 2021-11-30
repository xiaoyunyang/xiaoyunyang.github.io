---
title: "How I Open Sourced An ESLint Plugin for OkCupid"
date: 2021-11-29
categories:
  - blog
tags:
  - JavaScript
  - Open Source
  - Software Design
  - Productivity
keywords:
  - ESLint Plugin
  - eslint-plugin-i18n-lingui
  - web development
  - javascript
  - guide
thumbnailImage: /post/images/open-source/cover.png
thumbnailImagePosition: left
---

We developers often find ourselves faced with a problem that seems general enough and common enough that someone else could have already developed a solution for it. The solutions for common general-purpose problems are good candidates for open sourcing because they do not represent core business values to keep them proprietary.

I recently open sourced an [ESLint](https://eslint.org/docs/about/) plugin for OkCupid called [`eslint-plugin-i18n-lingui`](https://github.com/OkCupid/eslint-plugin-i18n-lingui). The plugin is an extension for ESLint's core static code analysis rules that enforces [localization](https://www.smartling.com/resources/101/localization-101/) best practices by catching and fixing errors during development. The best practice rules were inspired by the learning pains from our efforts to localize our website.

This post will discuss why we developed our own ESLint plugin, why we open sourced it, and the steps I took to open source a ESLint plugin.

Although this post will not discuss the localization best practices that `eslint-plugin-i18n-lingui` enforces or how to create an ESLint plugin, keep an eye out for future posts written specifically about these!

<!--more-->

![open source eslint-plugin-i18n-lingui](/post/images/open-source/cover.png)

<!--Photo by <a href="https://unsplash.com/@lukesouthern?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Luke Southern</a> on <a href="https://unsplash.com/s/photos/open-source?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
-->

When we were localizing our website for launches in Turkey and Germany, I had noticed some patterns in code review feedback about how to prepare content in the source code for localization. Some examples of the review feedback:

- Don't use three periods `...` in the text; instead use unicode ellipsis `…`
- Use smartquotes `’`, `“`, and `”` in localized strings
- No evaluation inside placeholders of localized strings
- Don't hardcode percentage and currency
- Wrap punctuations
- Wrap emojis

The reasons were not always so obvious but they loosely follow some [best practice guides](https://developer.mozilla.org.cach3.com/en-US/docs/Mozilla/Localization/Localization_content_best_practices#Tooltips) and tribal knowledge.

An effort was made to share these best practices during meetings but developers are not good with following arbitrary rules. On the other hand, developer tools like ESLint are excellent at following arbitrary rules!

We were already using ESLint in our development process so the concept of linting is well embraced by the team. There are no cultural barriers to introducing a new plugin.

## Long Weekend Side Project Hackathon

It was July 2021. I've collected a list of automatable pre-localization checks that were at the time being done manually via code reviews.

After watching a [talk](https://youtu.be/nAIiXcisknc) my friend [Bryan](https://github.com/bmish) gave at EmberConf about using and creating ESLint plugins, I was inspired to write an ESLint plugin. There was an opportunity to work on this over the 4th of July long weekend.

Writing your own lint rules is actually very approachable. ESLint provides a convenient framework for visiting nodes in the Abstract Syntax Tree, which is used to represent the source code. The plugin just needs to implement the visitor functions.

In preparation for the work, I created a Facebook event for the long weekend hackathon and found a friend and a coworker to participate with me. The Facebook event reads:

```text
Welcome to the third 2021 Virtual Hackathon dedicated to personal projects! 

The rule of the hackathon is you must work on a personal project 
(work side project does not count) which is demo-able by the end of the event.
Some cool things people have done in the past long weekend hackathons:
- Package room notification app for apartment building
- Update resume
- A wrapper for Redux
- Music video on a homemade game console
- Deck for an Ember conference on eslint plugins
- Blog post on the use of finite state machine to model UI state
- Animation of a drawing using Adobe Illustrator

Some other examples of personal projects
- reaching the next milestone of an existing project you currently work on
- publishing a blog post
- completing an illustration or piece of artwork
- contributing to an open source project - creating a personal website
- building the MVP for a startup idea you have.

You can work in teams or on your own. We kick off the event with presentations
from participants of what they want to work on during the hackathon.
Participants can form teams after the presentations.

We end the event with demos.

How you spend the time between the kickoff and the demo is up to you. 
It's encouraged that participants join a zoom room during the hackathon 
for collaboration and check-ins. Even if everyone is working on different projects,
it's good to have other people to bounce ideas off of.

Agenda:
- Friday 7/2 8pm - 9pm kickoff and form teams
- Saturday 7/3 9am - Monday 7/5 4pm Hack on projects
- Monday 1/18 5pm - 7pm demo
During the hackathon, we will have socials like dinners and drinks. 
More to be updated later.
```

This wasn't the first hackathon I organized and it surely won't be the last. I find the social accountability and synergy from hackathons to be truly motivating in shaping my focus to produce great work. It was pretty inspiring to see how much we were all able to accomplish in a short period of time (My co-worker Josh wrote [a tool for using Git as an Rsync replacement](https://github.com/thejoshwolfe/git-push-working-tree)!)

Because there will be a demo at the end of the weekend, there was a real deadline to do the best you can to get to a working solution in three days. The deadline also helps to reduce the scope of the project to something achievable over a three-day weekend.

During the kickoff meeting, I identified a list of around ten rules I wanted to implement and chose two of these rules which I think provide the most value and are easy enough to implement in three days.

Keeping the scope limited to what's achievable in three days really helped to kick the project off. At the demo, I was able to showcase two working rules [`no-eval-in-placeholder`](https://github.com/OkCupid/eslint-plugin-i18n-lingui/blob/main/docs/rules/no-eval-in-placeholder.md)

![eslint-plugin-i18n-lingui no-eval-in-placeholder](/post/images/open-source/no-eval-in-placeholder.png)

and [`prefer-unicode-ellipsis`](https://github.com/OkCupid/eslint-plugin-i18n-lingui/blob/main/docs/rules/prefer-unicode-ellipsis.md), which not only flags the violation but also fixes it!

![eslint-plugin-i18n-lingui prefer-unicode-ellipsis](/post/images/open-source/prefer-unicode-ellipsis.gif)

## Open Sourcing Under Company Name

The goal has always been to open source this ESLint plugin because it's a general purpose tool that catches localization anti-patterns which are not uniquely experienced by OkCupid.

As the co-founder of GitHub Tom Preston-Werner [puts it](https://tom.preston-werner.com/2011/11/22/open-source-everything.html)

> If your code is popular enough to attract outside contributions, you will have created a force multiplier that helps you get more work done faster and cheaper. More users means more use cases being explored which means more robust code.

[Many eyes make all bugs shallow](https://www.microsoft.com/security/blog/2006/06/07/linuss-law-aka-many-eyes-make-all-bugs-shallow/). If this plugin gets used by developers outside of OkCupid and adapted to a variety of use cases beyond just the ones for which it was originally intended, bugs and edge cases will be surfaced, creating more robust software.

Open sourcing also creates opportunities for developers outside of your team and organization to contribute in form of reporting bugs, proposing new features, and even implementing fixes and improvements to the codebase.

I think "should I have this on my personal account or company account" is a big blocker to open sourcing for a company. If I just want the code to be out there and available as quickly as possible and I don't care what happens to it after it's out, having it under my personal account makes more sense.

On the other hand, having the project be maintained by a well-known company like OkCupid could improve adoption because a company-owned open sourced project will more likely  be updated after initial release than one which is maintained by an individual developer. This is especially true if the company has a strong open source culture (capable and willing to dedicate engineering resources to maintaining), uses the open source code themselves (incentive to improve the code).

After talking to my manager Susan, who has been very supportive of open sourcing, she will work with me to get approval from Legal, higher-ups, and our information security team to make the code open.

During one of our one-on-ones when we talked about my career goals, I mentioned that being an open source contributor and maintainer of open source projects is important to me, she is amenable to having me work on the open source project during my functional week. At OkCupid, every developer gets a week per quarter to work on something that is not directly related to the product. This can include deprecating legacy code, upgrading dependencies, improving web infrastructure, etc. Improving the ESLint plugin definitely falls under the umbrella of functional tasks that improves developer velocity with respect to localization work.

## Blocked By Legal

It was July 8th. With blessing from my manager, I transferred the repo from my account to OkCupid's account and it automatically got converted to a private repo. I submitted a service desk ticket to information security to flip the switch on that GitHub repo from private to public but there's a setback I didn't expect.

Because OkCupid is owned by Match Group, we had to go through Match Legal to get permission to open source anything.

The Match Group Intellectual Property and Litigations person responded with

> A few considerations that go into the decision whether to open any of our code will be the quality of the code, any potential security issues from making it public, and the company's willingness to dedicate resources necessary to maintain the project on an ongoing basis.

He sent me the Match Group OSS policy document full of legalese to read through and a form to fill out. There  most important questions I had to answer were:

### Who will maintain the project

From a legal perspective, the only acceptable answer is employees of the Company will maintain the project.

In practice, [open source maintainers](https://opensource.guide/best-practices/) are like [the conductors of an orchestra](https://www.fosslife.org/whats-open-source-software-maintainer). While anyone with a GitHub account can contribute to the project, the maintainers are responsible for documenting the process and guiding the project's strategic decision, leveraging the community, triaging issues, and keeping communications public and public friend. The job of an open source maintainer is sometimes compared to that of a [gardener](https://steveklabnik.com/writing/how-to-be-an-open-source-gardener), a librarian, a cat herder, and a moderator.

### Licensing

I immediately gravitated to the [MIT license](https://en.wikipedia.org/wiki/MIT_License) because it's the most popular type of license I've seen used for open source projects.

Choosing the wrong license could hinder the adoption of the open source software, create uncertainty from the community about whether the software is truly free and open.

Facebook changed the license on one of their most popular open source projects React, from their [custom BSD+Patents license](https://engineering.fb.com/2017/08/18/open-source/explaining-react-s-license/) to the popular MIT license. The [decision came](https://engineering.fb.com/2017/09/22/web/relicensing-react-jest-flow-and-immutable-js/) after "several weeks of disappointment and uncertainty" from their user community, in particular, [WordPress](https://ma.tt/2017/09/on-react-and-wordpress/) which powers 25% of all websites.

MIT is [the one true license for open source](https://tom.preston-werner.com/2011/11/22/open-source-everything.html) because it's short (anyone who reads it understands what it means) and offers enough protection so you won't get sued if something goes wrong when someone uses your code.

### Business case

I think there are three benefits to the Company for open sourcing this project.

The first and the most obvious is it provides brand recognition and reputation for OkCupid as a tech company. This attracts engineering talent.

The company's dedication to open sourcing can also retain engineering talent because working on open source projects can be a great outlet for developers to scratch their creative itch, solve challenging problems that they don't normally experience in their day-to-day work, and make a positive impact on the world.

Finally, open source code can potentially increase developer velocity when it's popular enough to attract outside contributors. However, maintaining open source projects could be [demanding](https://www.zdnet.com/article/hard-work-and-poor-pay-stresses-out-open-source-maintainers/) and could exceed the company's capacity or willingness to dedicate engineering resources.

{{< image classes="fancybox fig-75 center clear" src="/post/images/open-source/xkcd-automation.png"
thumbnail="/post/images/open-source/xkcd-automation.png" title="https://xkcd.com/1319">}}

I don't expect the ESLint plugin to require more than an engineer 1-2 days a quarter to maintain even if it gets hundreds of downloads every day. The plugin is an extension to a developer tool that is meant to improve developer experience and developer. If there is a bug in a rule that breaks for an edge case, that rule can be ignored for the parts of the code or entirely.
This is in contrast to an open source project like React which requires a full team of engineers at Facebook to maintain because is a framework that represents core platform infrastructure for most web apps.

## One Last Obstacle

It was October 14th. Match Legal finally approved open sourcing `eslint-plugin-i18n-lingui` after all the back and forth emails, waiting on people to come back from vacation, and getting all the signatures from the chain of command. My manager was instrumental in getting this on everyone's radar and pinging the right people to move this along.

Now we can finally flip the switch from private to public on that repo. 🎉

The next step is to make it official by publishing this ESLint plugin to NPM so everyone can use it.

NPM, or Node Package Manager, is an online registry for JavaScript packages. These packages can be paid or private.

We needed to create a user account on the public registry and publish the plugin under that account. Optionally, a package can be [scoped to an organization](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages) (e.g., `@okcupid/eslint-plugin-i18n-lingui`).

I worked with the information security officer to create an OkCupid email specifically to set up an NPM user account.

When we were looking into creating the `okcupid` organization, we noticed that it was already owned by another user account. That user account belongs to someone who used to work at OkCupid. The organization was created by the former employee under her personal NPM user account when she was looking at publishing an NPM package for OkCupid.

I reached out to her on LinkedIn to see if it's possible to transfer the organization back to us. She was very responsive and immediately transferred both `okcupid` and `matchgroup` back to us.

I guess the lesson learned here is to make sure to get the right people involved from the beginning to set up accounts and configure access rights correctly so the team won't be blocked if someone leaves the company.

It's also beneficial to stay in touch and be on good terms with your ex-coworkers because you never know what you need their help with!

## Moment of Truth

We ended up not needing to scope the package to the organization because we decided to publish the ESLint plugin as an unscoped package. Scoping the package allows two packages with the same name to co-exist. Since [eslint-plugin-i18n-lingui](https://www.npmjs.com/package/eslint-plugin-i18n-lingui) is a unique package name, it can be kept as unscoped. OkCupid's brand is still attached to this package because the NPM page as well as all the docs link to the repo under OkCupid's GitHub handle.

Publishing `eslint-plugin-i18n-lingui` to NPM took a few seconds using NPM's command line interface.

There were a few small updates I made after the initial publishing of the package. I followed [semantic versioning](https://docs.npmjs.com/about-semantic-versioning) best practice to increment the version.

![NPM semantic versioning guide](/post/images/open-source/semantic-versioning.png)

The most significant update I had to make was to fix the false positives for the[`no-eval-in-placeholder`](https://github.com/OkCupid/eslint-plugin-i18n-lingui/blob/main/docs/rules/no-eval-in-placeholder.md) rule after integrating the package into our actual codebase. There were edge cases I did not consider during the initial development of the rule.

## Open Source Contribution

When the repo was finally made public, I shared the good news with my friends, many of them software engineers. Bryan, the friend who inspired me to write the ESLint plugin in the first place and an active open source contributor in the JavaScript community, created a bunch of pull requests like adding internal linting and improving configuration based on his previous work on ESLint plugins. His contributions are extremely helpful as they are best practices for writing ESLint plugins that I didn't know existed.

As this project continues to mature, I hope that other people on my team will become interested in being an open source maintainer of the project (not just because Legal requires maintainers to be OkCupid employees).

The need to educate and document the process on how to open source and contribute to this project for both internal and external contributors becomes apparent; this includes writing internal documentation on how to be a maintainer, adding a contribution guide to the repo, giving tech talks about how to write an ESLint plugin, and promoting the localization best practices that this plugin enforces. This blog post is one of the many actions that could help to drive interests in this project and open sourcing in general.

## Conclusion

Meta (formerly Facebook) who has a strong open source culture [outlines](https://opensource.fb.com/) these three tenants for why a company should care about open sourcing:

- **collaboration:** learn from and work with developers from around the world to achieve common goals.
- **community:** be a part of something bigger than yourself and your company; empower diverse communities through open source technology.
- **technology:** open sourcing has been the key facilitator at creating historical technologies like Linux, Android, Git, Chromium, and Python, and Linux.

A company's commitment to open source is demonstrated by its policy and culture, which OkCupid excels in. There was little friction in making the project open sourced and everyone has been supportive from day one.

I hope this post sheds some light on what it's like to open source for a company as the process may be opaque or non-existent at all.

Most developers know how to write code in the open. You create a GitHub repo and push some code to the remote branch. But getting paid to work on open source projects requires a bit of hustling and a lot of initiative.

Advice for developers who are looking to open source something for their company is this:

**Pick the right project to open source.**

General-purpose tools and libraries are good candidates for open sourcing because they don't represent core business values to keep it proprietary. Apps and design systems (e.g., re-usable components library) are not good for open sourcing because they are too closely tied to the business and the brand.

**Take initiative.**

You may have to spend your own time working on it, at least in the beginning. But it's easy to do when you find a project that you feel passionate about and enjoyable enough that you want to work on in your free time. Completing a proof of concept (POC) / minimal viable product (MVP) will make it easier to show that it's viable to dedicate some engineering resources to it.

I'm a fan of weekend hackathons with friends as I find that to be a highly effective and enjoyable way of getting a lot of stuff done over a short period of time. During my weekend hackathon when I built the MVP, I kept the scope limited to what's achievable in three days. Keeping the MVP scope small really helped to kick the project off.

Many companies like OkCupid have hack weeks in which engineers are given company time to work on their own  ideas as long as it directly or tangentially benefits the company in some way. Hack weeks provide opportunities to work on things such as creating and open sourcing software for your company.

**Talk to your manager.**

They can be your biggest ally. I’ve never met anyone who’s against the idea of open sourcing a general purpose tool or solution to a general problem but you have to convince them that it's worth letting you work on it on company time. Having the POC / MVP when you are having the conversation with them will help a ton.

I think "should I have this on my personal account or company account" is a big blocker to open sourcing for a company. If I just want the code to be out there and available as quickly as possible, having it under my personal account makes more sense.

Another blocker for many people is using their personal time to work on something that they don't "own". When I told my non-tech friends about the project, people were surprised that I "gave away my work for free". I feel like no one can really "own" open-source code.
