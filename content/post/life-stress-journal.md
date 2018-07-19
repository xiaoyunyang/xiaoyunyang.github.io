---
title: "The Algorithm for Managing Stress"
date: 2018-08-17
categories:
  - blog
tags:
  - Life
  - Productivity
  - Guide
thumbnailImagePosition: left
thumbnailImage: /post/images/stress.png
comments: true
showTags: true
showPagination: true
showSocial: true
showDate: true

---

What is stress? Stress is your subconscious telling you that you have sh*t to do. Feeling stressed about your health? Go to the gym everyday. Feeling stressed about your financial situation? Get a more high paying job. If only things were that simple. In this post, I'm going to teach you how to get rid your stress by understanding where your stress is coming from, then come up with an action plan and execute actions to address the source of your stress. This is not another "top 10 things you can do to ...." article. I will be discussing specific algorithms and heuristics with roots in computer science and mathematics that can be followed for every step of your journey to eliminating the source of your stress.

<!--more-->

Kyle, a friend of mine, introduced me to his method for managing stress. I became an instant fan. His process is as follows:

> Write down everything that's stressing you, prioritize based on importance and urgency, then for the high priority things, develop small, easy, achievable tasks to address the stressor - then do it - only work on the high priority stuff (you avoid procrastination by making the tasks easy and sometimes even pleasant).

Kyle's method provides an excellent framework for approaching stress management but it doesn't explain how you assess importance, how you break down priorities into actionable todos, and how to schedule the performance of these todos.

We will be discussing all these edge cases, using Kyle's method as a starting point to design our algorithms.

# Step 1: Brainstorm a list of todos

The first step follows very closely with Kyle's method:

1. Keep a journal of things that are stressing you out (i.e., stressors).
2. For each stressors, create an action plan consists of a goal(s).
3. For each goal, create a list of todos with deadlines that would help to meet the goal.

There could be multiple stressors at any time and the todos could have overlapping priorities and deadlines. Also, sometimes it's not easy to recognize what actions you can perform to address a stressor.

For example, the stressor is you have a big exam coming up and your goal is to . The action you can perform is to study and the deadline is the day of the exam. But that's a terrible todo because it's too general. A good todo needs to be something you can visualize doing, has a specific location, time of accomplishment, and something you can hold yourself accountable to. To revise our todo-list, we can have the following:

1. Go to the library on Monday evening and go over your notes and textbook chapters from class for 4 hours.
2. Go to the library on Tuesday evening and work on practice problems 1 through 10 from Chapter 3 of the textbook.
3. Go to office hour on Wednesday and ask the professor about concepts you don't get from Monday's study session and specific problems you couldn't solve from Tuesday's practice problems.

Notice how todo #3 depends on todo #1 and todo #2? Additionally, todo #3 cannot be done until Wednesday when the office hour is held. Your todo-lists will have lots of these constraints for your todos. In general, constraints make problem solving and prioritizing easier. We will discuss in the next part of the article how we can prioritize our todos based on constraints.

Brainstorming by yourself is sufficient in many cases but it's always more effective and efficient to brainstorm with other people. You can ask your friend who's in the same class as you what he is doing to study for the exam. He may tell you about this TA-led study session that'll be occurring on Thursday and you didn't know about. Then you can add that to the list as it seems like a really great resource to prepare you for the exam.

4. Go to the TA-led study session on Thursday.

A lot of times, we need to do things in which the actions we can perform are not so obvious and there are no classmates to help us brainstorm. For example, job hunting is a big source of stress for many people but it's not clear what you can do to get a job after you've uploaded your updated resume into the void of job websites, *hoping* someone will reach out to you.

Whenever *hope* is part of your action plan, you know you can do better.

The best thing you can do in this situation is to do a lot of research and find other people who were / are in the same situation as you and ask them what they did / are doing. This includes:

* Type "how to improve my chances of getting a job with X" or "how to get hired as Y" into Google and read some blogs about job hunting and some advice from QA websites such as Quora and blogs.
* Go to some professional networking events and meet people who are in the same situation as you. Ask them what to do.
* Go to an employment workshop or join a webinar.
* Read some job postings to see what employers are looking for in a job applicant.

It's important to note that the actions listed above are *not* part of your todo-list. They are things you can do to help you brainstorm your todo-list. They help you set up the right expectations and help you set specific goals which you can address independently by completing actions from your todo-list. For our job hunting example, suppose you find out from reading some job postings that employers are looking for job applicants to have a set of skills which you don't possess. Then your goal becomes "close my skills gap" and the todos can be take an online class from Coursera.

# Step 2: Process the todos list

The previous step transforms the intangible emotional response to a stressor into an unsorted list of todos. The next step is to figure out what action to perform and in what order.

## Step 2a: Filter the todos list

First, we eliminate things that are not actionable from our list of todos. This is easier said than done. We don't always know what we are capable of and we have a tendency of overestimating our abilities or underestimating the scope and difficulty of the task. A good rule of thumb is to eliminate any todos that relies on other people's actions. This is based on the Stoicism principle that things that are outside of our control (other people's actions) are not worth doing or stressing over.

Eliminating an un-actionable todo can mean deleting the todo from your list or turn it into something actionable. For example, if your todo is "Get a raise", that's not actionable because it's not up to you if you get a raise or not. You can revise this todo to be "Ask boss about raise", which is actionable. You don't need anyone's permission to ask your boss a question and you can do that all by yourself.

## Step 2b: Sort the todos based on Importance

After we prune our todo-list to get rid of un-actionable todos, we can begin sorting the todo-list in order of accomplishment based on importance. We define importance as

*the contribution that completion of this todo has to successful accomplishment of our goal*.

A problem that people often has is that it's not clear whether a todo will contribute anything at all to accomplishment of the goal. That's why the previous steps of brainstorming and filtering are so important because they help us generate a todo-list containing only goals that will contribute *something* to the successful accomplishment of our goal.

Equipped with the concept of importance, we can now sort the todos-list in two ways based on importance. There are two different criterion for sorting:

1. Likelihood the action contributes to success.
2. Consequence if completion of this action fails to contribute to success.

The first criterion for sorting is easy to understand but difficult to implement.

The second criterion is based on the idea of loss-minimization and this is the criterion I usually use.

Loss-minimization is based on the idea of consequence, which you can identify by asking yourself this question:

> What's the worst thing that could happen if I fail to do this?

A lot of the times, it's not how completing a todo will lead to us accomplishing a goal but it's clear how failure to complete the todo will lead to the failure in accomplishing the goal. For example, if your goal is to work out for an hour everyday this week and your todos are "go to the gym for an hour on Monday", "go to the gym for an hour on Tuesday", ... "go to the gym for an hour on Sunday", then you can see how failing to complete any of the todos will lead to the failure to accomplish the overall goal.

## Step 2c: Sort the todos based on deadline

Now we need to

I calculate consequence as the `benefit - cost`. If the consequence of failure is positive, it's a win-win situation because the worst thing that could happen to you is a good thing.

The time you spend completing the action is always a cost (unless you are paying someone else to do it for you, in which case money becomes a cost instead of time). The longer something takes up your time, the more negative the consequence of failure becomes; however, `benefit - cost` can still be a positive number if the benefit outweighs the cost. For example,


If the worst thing that could happen is still just do something. The more you do, the busier you’re going to get. This is because each task has multiple follow-on tasks. The task that doesn't have a follow-on task is probably not worth pursuing any longer.


# Step 2: Sort The Tasks based on Priorities

So that could quickly proliferate. So you need a way to prioritize what to work on. My algorithm for working on a task T is if I fail, did I just waste my time or did I gain some value? I rank the tasks based on the benefit minus cost if I fail at the task



Do the sorting of tasks into a prioritized list ahead of the time of execution so you don’t have to think about what to work on next. You just do it.

Scheduling theory

Search-Sort tradeoff

# Step 3:
