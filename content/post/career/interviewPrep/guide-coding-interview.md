---
title: "The Coding Interview: What to Expect"
date: 2018-05-07
categories:
  - blog
tags:
  - Productivity
  - Guide
  - Programming
  - Career
keywords:
  - computer science
  - interview prep
  - algorithms
  - data structure
  - productivity
  - guide
thumbnailImagePosition: left
thumbnailImage: /post/images/CTCI.png
---

Being great at coding interviews doesn't necessarily make you a great developer and being a great developer doesn't necessarily make you great at interviews. However, you need to pass the interview to get the job. Most tech companies, public or startups, have started drawing from the same pool of interview material, adopted the same set of coding challenges and problems for candidates to solve. Coding interviews can be challenging and stressful, but with enough practice, research, and preparation, it can be very manageable.

<!--more-->

{{< alert info >}} This is a Live Document. I will be updating it often. {{< /alert >}}

<!-- toc -->

# Advice
To understand the process, difficulty, and best way to prepare for a coding interviews at a top tech company, I talked to people I know who interviewed with and got hired by Facebook and Dropbox. I talked to a few recruiters, including one from Facebook, about the interview process and how to prepare for the phone screen and onsite. Additionally, I reviewed various articles people have written about their coding interview prep:

* [Andyy Hope's Journey](https://medium.freecodecamp.org/software-engineering-interviews-744380f4f2af)
* [Xiaohan Zeng's journey]
(https://medium.com/@XiaohanZeng/i-interviewed-at-five-top-companies-in-silicon-valley-in-five-days-and-luckily-got-five-job-offers-25178cf74e0f)
* [Matt Lloyd's journey](https://medium.com/@MatttLloyd/my-thoughtworks-interview-or-how-i-stopped-worrying-and-learnt-to-love-the-interview-9cfdb5ee6217)
* [Zhia Hwa Chong's Journey](https://medium.freecodecamp.org/how-i-landed-offers-from-microsoft-amazon-and-twitter-without-an-ivy-league-degree-d62cfe286eb8)
* A series of [vlogs on YouTube](https://www.youtube.com/watch?v=ZgdS0EUmn70) by an ex-Facebooker on how the interview process at Facebook or most high tech companies works and how to prepare for each interview.
* [Stephan Behnke's Guide](https://blog.stephanbehnke.com/how-i-learned-to-stop-worrying-and-love-the-job-hunt-in-toronto/)
* [Yangshun Tay's Guide](https://medium.freecodecamp.org/coding-interviews-for-dummies-5e048933b82b)
* [TripleBytes' Guide](https://quip.com/q41AA3OmoZbC)
* [Connor Leech's Guide](https://codeburst.io/the-2-types-of-software-engineering-interviews-and-how-to-prepare-for-them-2e7bd4daa0b)
* [Googley as Heck](https://medium.freecodecamp.org/why-i-studied-full-time-for-8-months-for-a-google-interview-cc662ce9bb13)

The advice I got for interviewing at Facebook and Google include:

* Know your Computer Science 101 really well. The Facebook recruiter told me to study from [The Algorithms Design Manual](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.471.4772&rep=rep1&type=pdf). This book has interview problems and programming challenges.

* Interviews are very difficult and require more preparation than even a difficult computer science exam at a top university. You don't get partial credits. If you don't provide the correct solution at any stage of the interview, they will decline you immediately.

* There's a phone screen involving coding with a time limit, usually 45 minutes. If your code doesn't work or doesn't handle edge cases, you fail to meet their minimum standard and you won't go on to the onsite interview.

* For the phone interview, Facebook uses [coderpad.io](https://coderpad.io/) and ask you to write an answer to a problem they saw on [leetcode](https://leetcode.com/problemset/all/)
but they have the run code function turned off. *No reference material is allowed* So you need to know your syntax really well. For the frontend developer job, the recruiter told me you need to know ES6 really well. Be able to write ES6 on paper and expect that to work if you run it.

    > Do [leetcode](https://leetcode.com/problemset/all/) questions and make sure you know what the best answer is. It's the kind of thing where it's worth making note cards. Read the solutions on leetcode. Even if your code works, it doesn't mean it's the most efficient. You'll get points off for that.

* Phone interview lasts 45 minutes.  If they give you one easy problem then you must finish that one quickly and do another. If they give you medium or difficult you can use the whole time. They usually expect you to do two medium questions in 45 minutes. You want to be able to do any medium question in less than 20 minutes with no reference material. My friend was asked to solve the word split problem.

* Coding challenges are an additional step that they add sometimes before you get the onsite. Coding challenges can be a take home project, an online quiz, or an online code exercise. Nobody is watching you and you usually have a week to do it. Though once you start you may be timed.

* For the take-home project, sometimes they may ask you to submit to github. Make sure to adhere to good git practices, such as having a .gitignore for node_modules. A friend who did a take-home project got docked for pushing node_modules along with his project onto the github repo.

* Onsite coding is like the phone interview but on a whiteboard. You need to write the code that can compile on the whiteboard.

    > They will type it up and it should work. It's pretty brutal.

* Prepare for system design questions like object oriented design questions. Design a game like hangman or snake at the command line is pretty popular.

* Startups are easier to interview at. Most decent public companies (Facebook, Google, Airbnb, Twitter, Amazon, Uber, Lyft) do basically the same thing.

* For interview prep, spend half your time on system design and half on coding.

* Practice whiteboard problem from [Cracking the Coding Interview](https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850/ref=sr_1_1?ie=UTF8&qid=1525587700&sr=8-1&keywords=cracking+the+coding+interview) (CTCI).

    > If you don't have a copy of CTCI get one. I haven't really tried online coding challenges. I mostly practice on a white board with another engineer giving me a question from the book. Practice Practice Practice.

* For the phone interview, make sure to practice on [coderpad.io](https://coderpad.io/). A bunch of companies use it. It looks like repl, leetcode, and coderbyte. It doesn't give you autocompletion like an IDE will, but lets you execute the code that you run exactly as you write it.

# Coding
Steps to prepare for the coding questions:

1. Do all problems from [leetcode](https://leetcode.com/problemset/all/). Need to be able to solve all problems with no reference material and write code that runs and passes the test the first time you submit. What's most impressive about the CoderByte practice problems are that they are actually pretty hard and require you to be proficient in your Computer Science 101. CoderByte hosts a weekly coding challenge every Saturday.
  * For easy questions, need to be able to do them in less than 15 minutes. For medium problems, need to do them within 20 minutes. For hard problems, need to do them within 45 minutes.
  * Review the best solutions for each problem on leetcode.
2. Extra practice:
  * [Edabit](https://edabit.com/explore) contains a bunch of coding challenges.
  * [CoderByte](https://coderbyte.com/) provides a collection of coding challenges in various languages. For JavaScript CoderByte doesn't have that many hard Computer Science 101 questions. They are focused on knowledge-based problem solving in a specific language.
  * [InterviewBit](https://www.interviewbit.com/) provides a gamified experience in preparing you with all aspects of the coding interview (Big-Oh, algorithm, and system design) with videos and tutorials and sample problems. It doesn't seem to have as many problems as CoderByte, but it has a peer mock interview feature. What's more, InterviewBit offers curated collections of interview questions as seem from [Google](https://www.interviewbit.com/google-interview-questions/), [Facebook](https://www.interviewbit.com/facebook-interview-questions/),[Amazon](https://www.interviewbit.com/amazon-interview-questions/), and [Microsoft](https://www.interviewbit.com/microsoft-interview-questions/).
3. Best answers for difficult problems:
  * [CareerCup](https://careercup.com/page) has a bunch of coding questions.

# Whiteboarding (Onsite)
1. [Cracking the Coding Interview](https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850/ref=sr_1_1?ie=UTF8&qid=1525587700&sr=8-1&keywords=cracking+the+coding+interview)
  * The book has solutions. They also have a github repo with solutions coded up in different languages.
  * [JavaScript Solutions](https://github.com/careercup/CtCI-6th-Edition-JavaScript/tree/ec307944f9c824376ea36bf9d730b0b709b9a923) to chapters 1-10
2. [The Algorithms Design Manual](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.471.4772&rep=rep1&type=pdf)
3. Mock Interview: https://interviewing.io/. They do mock interviews with real interviewers and if you do really well they'll invite you to do real interviews.

So what CS stuff should you study and memorize before a technical interview at a * major tech company?

* Hash tables
* Linked lists
* Binary search trees
* Dynamic programming
* Breadth-first search, depth-first search
* Quicksort, merge sort
* 2D arrays
* Dynamic arrays
* Big-O analysis

To name a few. Those are just the really, really common ones.


# Behavioral Interview

I started reading that cracking  the coding interview book and preparing for the interviews. One of the earlier chapters talk about behavior question you might expect, like **Why Do You Want to Work Here?** I composed a response for why I want to work at Facebook. In composing the response, I discovered what I’m really long for in a job: (1) inclusivity and cultivating ecosystems, (2) empowering regular people and developers with open source tools, (3) company is entrepreneurial and always taking risks. Facebook has been taking risks for years. Pushing limits all the time. People got over it and Facebook has more users than ever.

Why do I want to work at Facebook? I want to help people. Regular people, users, consumers, and creators all benefit from Facebook’s products. Facebook empowers developers and people with ideas to implement and market their ideas. Inclusivity and ecosystem building are what Facebook is about they are very important to me. These goals give deeper meaning to hard work and I’m really motivated to work hard to achieve these goals. As an entrepreneur, I’ve benefited so much from Facebook’s software products like React and open auth, and Facebook’s platform lets me create a brand for a company that I didn’t have a website for. In fact, I’ve seen lots of freelancers and online personalities use facebook’s pages in lieu of having to build a website of their own. I’ve also benefited greatly from Facebook’s ad platform. I saw a coworking space as and that prompted me to investigate coworking spaces. I ended up signing up for one and that significantly boosted my productivity and General well being. I’ve also used Facebook to reach out to long lost friends and people I’ve met once at college, asked them for advice about things like how to get a job at Facebook.

Facebook is the only big company I want to work at (maybe Google also) because it's kinda startupy. Facebook has an astounding collection of [open source tools and libraries](https://opensource.fb.com/) that helps you build anything. I greatly admire a company who sees the value in making open sourcing a core mission statement and puts so much effort into developing and maintaining its open source projects. I would like to join a startup or work at my own startup if I get funding. Facebook is pretty chill about people leaving to start companies and eventually coming back. Many ex-Facebookers started successful companies like Quora and Asana.

# System Design
1. [Cracking the Coding Interview](https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850/ref=sr_1_1?ie=UTF8&qid=1525587700&sr=8-1&keywords=cracking+the+coding+interview)
2. [The Algorithms Design Manual](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.471.4772&rep=rep1&type=pdf)

# Brainteasers?

Laszlo Bock, senior vice president of People Operations at Google said:

> "Some of these interview questions [brainteasers] have been and I’m sure continue to be used at the company. Sorry about that. We do everything we can to discourage this, and when our senior leaders—myself included—review applicants each week, we ignore the answers to these questions."
