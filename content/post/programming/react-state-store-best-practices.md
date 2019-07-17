---
title: "Best Practices For State Management With React And Redux"
date: 2018-01-05
categories:
  - blog
tags:
  - JavaScript
  - React
  - Web Dev
  - Frontend
keywords:
  - JavaScript
  - React
  - Redux
  - Best Practices
  - Web Design
  - Web Development
  - Redux
  - React.js
thumbnailImagePosition: left
thumbnailImage: /post/images/company-culture-plant.png

---

In this post, I'll share some best practices, tips, and practical examples for managing states and data in a frontend applications. Although the examples are targeted at frontend developers working with React and Redux, the best practices discussion are applicable for frontend developers working with any framework.

<!--more-->

# A Closer Look at the React Paradigm

When React first came out in May 2013, it offered developer a framework for frontend applications which was a radical departure from what had been done before.

In its early days, frontend applications had been synonymous with side effects. Libraries and frameworks like jQuery, Backbone.js, and Ember, and Angular 1 had been popular with frontend developers. These libraries and framework relied on two-way data binding whereby data and JavaScript are attached to existing DOM specified in an HTML file after the application mounts in the browser.

React challenged this paradigm by introducing one-way data flow.

In React, application data flows unidirectionally via the state and props objects to generate the DOM.
A React component can use the data or pass the data to its children. If the component uses the data, the data controls the DOM rendered by the component. Anytime the data changes, the DOM changes. The data upstream controls the lifecycle of the DOM. React is not a repackaging of something that already exists. React is a paradigm shift.

React gives the developer full control of the DOM and covers the rendering of initial state and updating the state to reflect changes based on user or server input.

We can declare methods to hook into the component's lifecycle to control the behavior of components in your app. Some examples of these lifecycle hooks are `componentDidMount()`, `componentWillMount()`, `componentWillUnmount()`, `shouldComponentUpdate()`, `componentWillUpdate()` and more.

The unidirectional dataflow model is not unique to React. D3.js was built on the same principle. However, React excels at being a declarative, efficient, and flexible library for building user interfaces.

Like anything that's flexible, there are the wrong ways of doing something and there are the right ways. This post seeks to address common pitfalls with building frontend web applications using React, in particular when it comes to how to manage states of data in React.

# React State Store vs. Redux Store


Feel free to skip this section if you are familiar with or have worked with React and Redux.

# Best Practices

## #1 Use State Store When Consuming an API

A frontend application generally consumes an API (i.e., getting the JSON data from an API endpoint and use it to render DOM), but sometimes it can also request changes to the data in the database by sending 

## #2 Use Redux Store When Component Makes POST Requests (Sometimes)

A frontend application generally consumes an API (i.e., getting the JSON data from an API endpoint and use it to render DOM), but sometimes it can also request changes to the data in the database by sending 

A React component can use the data or pass the data to its children. This means that, in a multi-component hierachy, a common parent component should manage the state and pass it down to its children components via the prop.

The first time I used Redux was when building a React Native 

## #3 Use Component Store for Animated Components

Practial example is status alerts.

## #4 Use Redux Store for Multi-Page Applications

React Router

## #5 The Magic of ComponentWillReceiveProps

When your frontend application has multiple data

## #6 ComponentDidMount vs. ComponentWillMount