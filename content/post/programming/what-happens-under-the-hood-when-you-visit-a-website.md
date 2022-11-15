---
title: "What Happens Under the Hood When you Visit a Website"
date: 2023-10-01
categories:
  - blog
tags:
  - JavaScript
  - React
  - Node
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

This post is inspired by my recent experience interviewing for a developer role. During few of the the initial phone screens, I was asked the question:

> Tell me what happens under the hood when you visit a website.

<!--more-->

What the interviewers were looking for is a discussion on the HTTP protocol, how server responds to requests and ensure authenticated communications between client and server. Some even asked to describe how web domains are translated to public IP addresses by DNS. I provided my response based on my experience working on applications in the past 5 years. But I don't feel I provided the best response I could have. It has been more than 5 years when I learned web fundamentals from a university course. Based on my attempt to answer the interview question, I've identified clear gaps in my understanding about how all of the technologies behind the internet come together.

This post is designed to help beginners and experienced web developers alike in gaining a comprehensive and deep understanding of how the web works and how web technologies work together. If you are learning this for the first time, preparing for a job interview, or trying to refresh your memory or update your knowledge, read on!

several companies We are diving into web fundamentals in this post. We will cover HTTP protocol, get a more in depth understanding.

This is an introduction of concepts and technology behind modern web applications. Modern web applications are built on stacks of open source libraries and frameworks. You can visit [stackshare.io](https://stackshare.io/airbnb/airbnb) to see the stacks used by tech companies such as Airbnb.

# The Fundamentals

## Internet Technology

The Internet is quintessentially networked computers. Computers used to be standalone machines, primarily used by researchers at universities to support local computations. In the 1970s, the US Army funded a project to provide the capability to network computers. ARPANET was born. ARPANET parlayed into serveral other initiatives that eventually resulted in what we all know today as the Internet.

At a physical level, computers talk to each other by leveraging existing telecommunication system infrastruture to send signals from one end point to another end point. Phone companies expanded their roles to become Internet Service Providers (ISP). Big ISPs owns the main infrastructure to support internet access to a region of the world. We will not go into ISP traffic throttling or telecommunications policies but that's an interesting topic reserved for another blog post. But we will keep in mind the physical limitations of the "wires as a service" and important considerations for the regionality of machines we use for hosting when we later discuss network latency.

## Layers

Layers are abstractions of the technology under the hood to make communications over the internet possible. There are four layers:

- Application Layer
- HTTP
- TCP/IP
- Hardware layer

Since this post is tailored for web developers, we will not go into a lot of details about TCP/IP or the hardware layer. These are topics that hardware engineers and network engineers are concerned with but thanks to abstraction, we web developers don't have to be concerned about how our data travels through copper wires and can treat these layers as black boxes. But for our appreciation, here's a brief aside discussion on the TCP/IP and Hardware layer with a fun analogy:

Suppose you are sending a long message to your pen pal by mail. You can send the long message in a

If you want to audit the University of Michigan [Coursera course](https://www.coursera.org/learn/internet-history) taught by Charles Severance, I highly recommend it.

## Application Layer in depth

This section is divided into two parts. One part deals with the things you got to know when developing a localhost website. The second part deals with the things you encounter when you get around to deploying the website to the cloud, e,g, Amazon Web Service.

### Part 1

**\_Session**

### Part 2

### Session

### Request

Request Header

### Response

Response Header

The Application <-> HTTP layer is used to deliver images, files, videos, and other kinds of data from the server to the client (e.g., browser). The browser

The client is not always a browser. You can use curl to see what is returned when you send a HTTP request. There are APIs that allow web applications to request data from each other and for mobile applications to request and send data to a server application hosted in the cloud. The most popular api is the REST API.

### SSL

### CSRF

### Request/Response Headers

- eTag
- Status code
- CSRF concern?
- XSS

**What about GraphQL?**

Used a lot for mobile applications. It is not a competitor to REST but rather an enhancement.

# Application of Web Fundamental

Now we know how the web works, how do we apply this knowledge to build a web applications? What tools, frameworks and libraries can we leverage to create a fast, reliable, and secure web application?

adding csrf tags to forms

How Github does it, here's the DOM from Github settings page:

![](/post/images/webdev/csrf-tag-example.png)

## How to ensure response comes from a valid source?

- CSRF concern mitigated by injecting a special field in the form like a one time hash that

- Tabnabbing concern mitigated by using `rel="noopener noreferrer"` in anchors containing `target="\_blank". This post demonstrates the danger of tabnabbing https://mathiasbynens.github.io/rel-noopener/

For more, read [this](https://github.com/asciidoctor/asciidoctor/issues/2071) and [this](https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/)

> The page we're linking to gains partial access to the linking page via the window.opener object.

# Understanding Web Technology

## Front End

In the early days of the Internet, everyone writes their websites in HTML. The Document Object Model (DOM) is a programming API for HTML. The object model itself closely resembles the structure of the documents it models. For instance:

```
<p>A List:</p>
<ul>A List
  <li>One</li>
  <li>Two</li>
</ul>
```

gives you

<p>A List:</p><ul><li>One</li><li>Two</li></ul>

When you visit a website built in the 1990s, your browser (e.g., Chrome, Firefox, Safari) makes a request to the server of the website to download all files it needs to display the webpage. For instance, the HTML file tells your browser how to create a DOM. The Cascading Style Sheets (CSS) file tells your browser how to apply styles, such as text color and font, to the DOM.

With CSS, we are able to style multiple elements simultaneously. CSS is [a new kind of JavaScript](https://medium.com/@Heydon/css-a-new-kind-of-javascript-fcf730d33ce7).

Go ahead and open [https://www.w3.org/TR/WD-DOM/introduction.html](https://www.w3.org/TR/WD-DOM/introduction.html) with Chrome and press `Cmd + Shift + C` to inspect the DOM. Press `Cmd + s` to save the webpage to your computer and click the `.html` file stored on your computer to see that the same webpage is displayed.

Static webpages are undesirable from a user perspective as well as from a web developer perspective. Users cannot interact much with a static website other than viewing the content. The owner of the website has to modify the html file to change the content of page.

Javascript frameworks provide a way for the client (i.e., the browser) to manipulate the DOM. The client may interact with DOM in different ways (e.g., collapsing and filtering a list). Javascript frameworks also handle the interface between the DOM and server. There are [many javascript frameworks](https://hackernoon.com/5-best-javascript-frameworks-in-2017-7a63b3870282) out there but none is more powerful than [React](https://reactjs.org/docs/thinking-in-react.html).

### React

> React is a declarative, efficient, and flexible JavaScript library for building user interfaces.

**[`React`](https://reactjs.org/tutorial/tutorial.html)** is a Javascript library, built and maintained by Facebook. It was developed by [Jordan Walke](https://twitter.com/jordwalke), a software engineer at Facebook. It was open-sourced and announced to the developer community in May 2013. Since then, it has undergone tremendous growth and adoption in the developer community. React is currently on version 16 (See the [Migration log](https://reactjs.org/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) to appreciate the pace of growth in popularity and capability of React).

React gives the developer full control of the DOM and covers the rendering of initial state and updating the state to reflect changes based on user or server input.

[Good Introduction to React from Auth0](https://auth0.com/blog/reactjs-authentication-tutorial/)

> React lets you create custom and reusable HTML elements. React provides some methods that are triggered at various points from creating a component up until the component is destroyed. This is called the Component's Lifecycle. You can declare methods to hook into the component's lifecycle to control the behavior of components in your app. Some examples of these lifecycle hooks are `componentDidMount()`, `componentWillMount()`, `componentWillUnmount()`, `shouldComponentUpdate()`, `componentWillUpdate()` and more. Read more about the lifecycle API [here](http://www.react.express/lifecycle_api)

What is a `prop`?

> Props is the short form for properties. Properties are attributes of a component. In fact, props are how components talk to each other. A tag in HTML such as `<img>` has an attribute, a.k.a prop called src that points to the location of an image.

In React, application data flows unidirectionally via the state and props objects, as opposed to the [data binding](https://www.themarketingtechnologist.co/introduction-to-data-binding-in-angular-2-versus-angular-1/) of libraries like [Angular](https://angular.io/) (another popular Javascript framework for building web apps). This means that, in a multi-component hierachy, a common parent component should manage the state and pass it down the chain via the `prop`.

- [Thinking in React](https://reactjs.org/docs/thinking-in-react.html)

  > Since you’re often displaying a JSON data model to a user, you’ll find that if your model was built correctly, your UI (and therefore your component structure) will map nicely. That’s because UI and data models tend to adhere to the same information architecture, which means the work of separating your UI into components is often trivial.

For example, when you first click on the link to visit [KhanAcademy](https://www.khanacademy.org/)'s home page -- a webpage built on React -- your browser makes a request to the KhanAcademy's server to load the React code. The browser executes the React code, which creates React components. Each React component generates the part of the DOM it is responsible for by making another (asynchronous) request to the webpage's server or another server's API (more on that later) to grab the data (typically JSON) it needs to generates the appropriate information that needs to be displayed on the webpage. For subsequent updates to the webpage, the React component repeats the steps to load JSON from the server or API and updates the information on the webpage.

[matthias nehlsen's blog](http://matthiasnehlsen.com/blog/2014/01/05/play-framework-and-facebooks-react-library/):

>

- Components can have state if necessary.
- React prefers immutable props over mutable state wherever possible, making state changes much easier to reason about.
- Each component knows how to render itself.
- Components can have other components as children. They can pass their own state or props to these as immutable props.
- The entire DOM is rendered into a (fast) virtual DOM with every change made. Changes can either come from mutated state or from parent elements as immutable props.
- This virtual DOM is then diffed against a representation of the current DOM, with the actual DOM only being manipulated where new and old versions differ.
- Data coming from business logic outside will not be touched; React can work withimmutable data thoughout.
- Hierarchical components, props, state, handlers. That’s pretty much it, no more rather unintuitive concepts to understand.

### Redux

## Building an API

### RESTful API

> The RESTful API provides a way for the frontend app to talk to a server.

**Why we need a RESTful API?**

The motivation for a RESTful API is to promote separation of concerns between the frontend application (the client) and the backend application (the server). REST, which stands for Representational State Transfer) provides an communications interface between the client and the server so that the client does not need to be concerned with data storage, which remains internal to the server, and the server does not need to be concerned with the display and user manipulation of the DOM, which remains internal to the client.

Separation of concerns improves portability of both the client code and server code. To support this goal, we need a way for the client to talk to server. The most common communications between a client and a server are the `GET` and `PUT`. The client asks the server for information via a HTTP `GET` requests and displays a DOM to the user based on that information. The client also gives the server information based on user input via a HTTP `PUT`. The information that's passed back and forth is in a format called JSON, which looks something like this: [https://api.github.com/users/xiaoyunyang/repos](https://api.github.com/users/xiaoyunyang/repos)

While we (people) can view the JSON via clicking on the link and opening it up in the browser, the frontend app can view this data via making the following HTTP request:

```
GET https://api.github.com/users/xiaoyunyang/repos
```

which can be generalized as follows:

```
<HTTP Verb> <Endpoint>
```

**Endpoint** is the address (i.e., a URL) of the service. We will discuss HTTP in the section below.

The above example is supported by the [Github API](https://developer.github.com/v3/repos/#list-your-repositories). Many websites that collect a lot of data from their users provide an API that allows web developers to access that data. Some good APIs include:

- [Twitter API](https://developer.twitter.com/en/docs/tweets/post-and-engage/overview) - Grab tweets (useful for news websites)
- [Github API](https://developer.github.com/v3/repos/#list-your-repositories) - Grab repo information (useful if you are making an app to compare the popularity of open source libraries in real time)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api/) - Get user profile info or business info
- [Yelp Fusion API](https://www.yelp.com/developers/documentation/v3/business_search) - Find Information about businesses

The above example demonstrates the another usefulness of REST API as it allows you to build frontend applications that can talk to not just its own server, but other servers that provides public access to their data via a REST API.

**What is HTTP?**

[HTTP](https://www.wikiwand.com/en/Hypertext_Transfer_Prool) stands for Hypertext Transport Protocol. It was invented for the Web to retrieve HTML, images, documents etc. The basic concept of HTTP is (1) establish a connection, (2) request a document, (3) retrieve the document, and (4) close the connection. Let's see HTTP in action. In your terminal, type:

```
telnet www.rigaut.com 80
```

Port 80 is the non-encrypted HTTP port. If you see the following, the connection went through:

```
Trying 80.248.208.218...
Connected to www.rigaut.com.
Escape character is '^]'.
```

Then type:

```
GET /benoit/CERN/about/
```

get the following response:

```
<html>
...
</html>
Connection closed by foreign host.
```

That's essentially what your browser does when you visit [http://www.rigaut.com/benoit/CERN/about](http://www.rigaut.com/benoit/CERN/about/). Your browser gets back a bunch of HTML and it will render a DOM based on the HTML and displays the webpage to you. A browser is a software application that makes HTTP requests, processes the HTTP response (e.g., HTML), and display that to you.

**HTTP Requests**

As stated above, REST is based on HTTP. We need to have a way to respond to a request with a message when the response is success or has an error.

These are all the [HTTP requests](http://www.restapitutorial.com/lessons/httpmethods.html), their corresponding operation, and response in HTTP status codes:

| HTTP Verb |    CRUD Operation     | Response (status Codes) |
| :-------: | :-------------------: | :---------------------- |
|  `POST`   |        Create         | 201, 404, 409           |
|   `GET`   |         Read          | 200, 304, 404           |
|   `PUT`   | Update/Replace/Create | 200, 201, 204, 404, 405 |
|  `PATCH`  |     Update/Modify     | 200, 204, 404, 405      |
| `DELETE`  |        Delete         | 200, 204, 404, 405      |

These are the typical [HTTP status codes](https://www.wikiwand.com/en/List_of_HTTP_status_codes), their definition, and an easy way to remember the ranges per [the tweet from @stevelosh](https://twitter.com/stevelosh/status/372740571749572610):

**The 200 range**

> Here you go

- `200`= OK
  - The `GET` request has succeeded and content was retrieved.
- `201` = Created
  - This status is provided as response to a successful `POST` (or if using`PUT` for create) request along with a location header with a link to the newly-created resource.
- `204` = No content
  - A response to a `PUT` or `PATCH` request upon successful update if not returning any content in the body. In the case of `DELETE`, you return `204` after a successful delete operation.

**The 300 range**

> Go away

- `301`= Moved Permanently
  - The requested resource has been assigned a new permanent URI and any future references to this resource should use one of the returned URIs.
- `303` = See Other
  - Resource is already created and you want to redirect to a new page.
- `304` = A successful response to `GET`. Resource is still fetched for the browser, but as opposed to `200` where a new thing is fetched, a `304` status means the resource for current fetch request matches that of a previous fetch request so there is no need to retransmit the resource since the client still has a previously-downloaded copy.

**The 400 range**

> You messed up

- `400`= Bad Request
  - The request could not be understood by the server due to malformed syntax. The client should not repeat the request without modifications.
- `401`= Unauthorized
  - The request requires user authentication.
- `403` = Forbidden
  - Even logged in user has no permission to do something. For example, if logged in user can access some parts of the static files but not others.
- `404`= Not Found
  - For example, a `GET` request on something that cannot be fetched because there is no code matched to the URI. a `DELETE` request on something with an ID not found or invalid.
- `405` = Method Not Allowed
  - For example, a `GET` request on a form that requires data to be presented via `POST`, or a `PUT` request on a read-only resource.
- `409` = Conflict
  - A response to a failed `POST` request (e.g., cannot create user because user already exists).

**The 500 range**

> I messed up

- `500` = Internal Server Error
  - In an express app, the 500 error is associated with a requesting a file that does not exist. For example, if you are using `res.sendFile` to send an nonexisting file.
  - Unlike the rest of the status codes where you want to be as descriptive as possible, it’s often better to be vague and say “Internal Server Error”; that way hackers can’t know where the weaknesses in your system lie.
- `503`= Service Unavilable

See more [from the DigitalOcean Tutorial](https://www.digitalocean.com/community/tutorials/how-to-troubleshoot-common-http-error-codes)

### GraphQL

[REST vs GraphQL](https://blog.pusher.com/rest-versus-graphql/)

> GraphQL is a declarative data fetching specification and query language for APIs. It was created by Facebook back in 2012 to power their mobile applications. It is meant to provide a common interface between the client and the server for data fetching and manipulations. GraphQL was open sourced by Facebook in 2015.

> REST and GraphQL can both be operated over HTTP, though GraphQL is protocol agnostic.

In 2016 [Github migrated its API from REST to GraphQL](https://developer.github.com/v4/guides/intro-to-graphql/)

[Apollo's Article](https://dev-blog.apollodata.com/graphql-vs-rest-5d425123e34b) on two ways to send data over HTTP states:

> GraphQL is presented as a revolutionary new way to think about APIs. Instead of working with rigid server-defined endpoints, you can send queries to get exactly the data you’re looking for in one request.

With REST:

```
GET /books/1
{
  "title": "Black Hole Blues",
  "author": {
    "firstName": "Janna",
    "lastName": "Levin"
  }
  // ... more fields here
}
```

With GraphQL:

```
GET /graphql?query={ book(id: "1") { title, author { firstName } } }
{
  "title": "Black Hole Blues",
  "author": {
    "firstName": "Janna",
  }
}
```

> The core idea of REST is the resource. Each resource is identified by a URL, and you retrieve that resource by sending a GET request to that URL. You will likely get a JSON response, since that’s what most APIs are using these days.
> We can see that the URL with a GraphQL query specifies the resource we’re asking for and also which fields we care about. Also, rather than the server author deciding for us that the related author resource needs to be included, the consumer of the API decides.

[An Introduction to GraphQL](https://hackernoon.com/an-introduction-to-graphql-2c3f7d8fb4e0)

## Backend

Modern web apps are built on sophisticated frontend frameworks like React that handles all the UI logic, even routing (`react-router`). While [any backend](https://www.wikiwand.com/en/Comparison_of_web_frameworks) will do the job and developers choose backend frameworks based on their language of choice (e.g., ruby's Ruby on Rails, python's Django, scala's Play, Haskell's Yesod etc.), a poor performing backend can really hurt your webapp's performance and scalability. We need to keep [three main things to consider](https://www.quora.com/Would-you-choose-Node-js-Express-js-or-Play-framework-Java-for-a-new-web-app-project-Why) when choosing a backend framework:

- **Performance:** For backend, that means being stateless, asynchronous, and supporting non-blocking I/O. We throw out Ruby on Rails for its performance issues.
- **Flexibility:** Ability to make extendable modules and add-ons to help you make anything you need for a server, such as authentication.
- **Community:** IMO the most important for a startup founding or freelancer doing a lot with little/no support from a big team. A popularity of a framework contributes directly to developer productivity and framework extensibility. This is especially important for a minimal and unopinionated framework that is flexible, such as Express. We want the ability to add third-party modules to extend the capability of Express and get help from the community for a specific problem we have. There's a healthy Node.js ecosystem so you have a myriad of open source third party modules, tutorials, and an extensive knowledge repository online to help you.

There are [many backend frameworks](https://gearheart.io/blog/7-best-frameworks-for-web-development-in-2017/) out there but we will be using Express, which runs in the Node.js runtime environment.

### Runtime Environment

**Node.js**, or simply Node is a JavaScript runtime environment to execute JavaScript code server-side. This is the same concept as the Java Virtual Machine (JVM), which is a runtime environment for Java and languages in the Java family (e.g., Scala, Clojure, Groovy, Kotlin). Node was released in 2009 and is based on [Google Chrome's powerful JavaScript engine, V8](https://www.wikiwand.com/en/Chrome_V8).

A benefit of Node compared to other frameworks (like Ruby) is Node's ability to handle requests **asynchronously**. A browser might request something from your server. The server begins responding to this request and another request comes in. Let’s say the first request requires the server to talk to an external database and the second request does not. The server can ask the external database about the first request, and while that external database is working on responding to the first request, the server can work on responding to the second request. Your server isn’t doing two things at once, but when someone else is working on something, you’re not held up waiting.

### Framework

**Express.js**, or simply Express, is a framework that runs on top of the Node's web server to simplify the development of a Node app. Node provides a bevy of low-level features you’d need to build an application. But like browser-based JavaScript, its low-level offerings can be verbose and difficult to use. Express is philosophically similar to jQuery, which cuts down boilerplate code by simplifying the APIs of the browser and adding helpful new features.

Express augments Node by abstracting away the low level request handling, partitioning request handling to smaller, more modular parts that can be implemented by third party libraries (e.g., `morgan` for logging all requests and `passport` for authenticating users). Without express, you have to manage one monolithic request handler function with verbose Node.js APIs. With express, you can write multiple small request handler functions that are made more pleasant by Express and its easier APIs.

Most of your Express code involves writing request handler functions, and Express adds a number of conveniences when writing these.

Express does not provide a lot of out-of-box features as compared to bigger (and more opinionated) frameworks such as Play; however Express is not too opinionated how you build your application so you get a lot of flexibility to make architectural decisions for your app. Although you get less out-of-the-box features with Express, there's a rich set of third-party modules (called middleware) to implement the various functions in your Express app.

Hunting for the right modules and making design decisions can be a time consuming process. Downselecting from an overwhelming number of choices seems to be the theme of the JavaScript world. To make it easier, here are the best modules to implement the important functions of a server built in Express:

- Logging Requests - use [`morgan`](https://www.npmjs.com/package/morgan-2)
- Authentication - use [`passport`](http://www.passportjs.org/), [`nodemailer`](https://github.com/nodemailer/nodemailer)
- Talk to the database - use [`mongoose`](http://mongoosejs.com/) for mongoDB or [`knex`](http://knexjs.org/) for SQL databases such as postgresQL. See [more options](https://npmcompare.com/compare/bookshelf,knex,objection,orm,sequelize) for working with SQL database.
- Password treatment - use [`bcrypt-nodejs`](https://www.npmjs.com/package/bcrypt-nodejs), [`crypto`](https://nodejs.org/api/crypto.html)
- Session management - use [`express-session`](https://github.com/expressjs/session) or `cookie-parser`
- Environmental (make your app more configurable) - use [`dotenv`](https://github.com/motdotla/dotenv)

### Building a RESTful Backend Server to Interface With React

The traditional view of a server built with Node is [this](https://hackerstribe.com/wp-content/uploads/2016/04/Node.js-Express-in-Action.pdf):

> you write a single JavaScript function for your entire application. This function listens to a web browser’s requests, or the requests from a mobile application consuming your API, or any other client talking to your server. When a request comes in, this function will look at the request and determine how to respond.

Express simplifie the server functionality by taking care of all the boilerplate code you need to listen to requests and responding to requests. But as frontend frameworks like React is becoming more and more sophisticated, we want to delegate all of the user interface responsbility to the client code to display views and perform routing. Implementing view logic (including when to display a certain view) would lead to under-utilization of the frontend capability and pose an obstacle to the separation of concerns between the frontend and the backend. REST API to the rescue! What we want is to implement separate the Express backend separately from the and React Frontend and integrate them via a REST API. Let's compare the interaction between the server and client with the old way without React and the new way with React and a REST API:

**Routing:**
Routing refers to the mapping certain HTTP requests to certain functionality. For example, when visiting the homepage, certain code should be run. For example When a browser sends a `GET` request for `/` to your server, the router needs to respond with sending HTML for the home page.

- Old way: Server does all the routing. For example, if you visit the homepage (e.g., `localhost:3000/`) in a web browser, the server responds by sending you HTML. If you send a message to an API endpoint, this function could determine what you want and respond with JSON.
- New way: Client does most of the URI-driven routing (assuming you have routing libraries like `react-router` installed). The server routes if the request is triggered by an external event (such as logging in via open authentication) in which case server side logic needs to initiate a redirect.

**Display Dynamic Content from the DB**

- Old way: User requests content (via URL pattern or button press) via a HTTP [`GET`](http://www.restapitutorial.com/lessons/httpmethods.html). Server responds to the request and grabs content from the database, renders the HTML, and sends HTML to the browser.
- New way: User requests content. Server responds to the request by grabbing content from the databse same as before but sends the content as JSON to an API e.g., `/api/someStuff`. A React component that renders itself based on the `someStuff` JSON (use `isomorphic-fetch` to get that data) will update itself by updating its state variables and render the DOM to reflect changes to the JSON. This follows from the single source of truth imperative integral to React.

**Update Content from the DB**

- Old way: A new user fills out a signup form for your site and presses the submit button. Server gets the request to [`POST`](http://www.restapitutorial.com/lessons/httpmethods.html) new content, which entails updating the `Users` database to add new user, then redirects the user to a part of the website that only authenticated users can access, e.g., `/dashboard/` or unlocks the features of website that only users can access (see [https://www.facebook.com/](https://www.facebook.com/) before and after you login). Or another way is to use a templating engine such as `ejs` to dynamically create HTML and have the server plug dynamic content directly into the corresponding `ejs` file to be rendered.
- New way: Everything is the same as the old way except for big one difference: instead of having the server switch on what feature to unlock, the client code decides what to unlock based on the authentication status provided by the server. This is essentially a session JSON that is shared globally with the React component and is updated by the server and the client (if the user presses the log out button). We want to use `redux` to keep track of the session object because that provides one source of truth for all our React components as well as the server.

**Session**
Because HTTP is stateless, in order to associate a request to any other request, you need a way to store user data between HTTP requests. Cookies let the browser store your session for a certain period of time so you can be kept logged in before the cookie expires even if you closes the website. The server needs to check whether the browser has any cookies, which the server can use to "log in the user on his/her behalf". Cookies expire when a specified time elapses or if the user logs out of your site.

The most common external resources you’ll deal with in Express are

- Anything involving the filesystem—Like reading and writing files from your hard drive
- Anything involving a network—Like receiving requests, sending responses, or sending your own requests over the internet

### Authentication

**Authentication vs. Authorization**
Per [This Stackoverflow Response](https://stackoverflow.com/questions/36490904/whats-the-difference-between-passport-and-oauth):
Passport is authentication middleware. OAuth is authorization middleware.
Passport will allow you to authenticate the user before allowing access to your API. It does not (directly, it's possible) allow to check if a user is allowed to perform an action after authentication.

> Authentication is the process of ascertaining that somebody really is who he claims to be.

> Authorization refers to rules that determine who is allowed to do what. E.g. Bob may be authorized to create and delete databases, while Bobbette is only authorized to read.

**Open Authentication (OAuth)**

OAuth was developed by Twitter and Ma.gnolia. It is a standard for the delegation of (restricted) rights.

1. OAuth - Why Open Authentication? Per [scotch.io](https://scotch.io/tutorials/the-easiest-way-to-add-authentication-to-any-app), there are a few key reasons for this, including:
   >

- A shifting identity landscape where we are now logging in with social providers like Google, Facebook, Twitter, and others
- A desire for tighter security through features like multi-factor authentication, password-less login, and single sign-on
- A new approach for application architecture that makes it more difficult to implement authentication

Authentication is your username + password. Authorization is what you're allowed to do.

**HTTP requests from mobile web applications**
Your server can send an eTag as part of the response to your client's HTTP request. The eTag is a hash digest calculated over the content sent by the server. The client can keep a copy of the eTag and next time it asks the server for an update, it can send the eTag with the HTTP request. The server can make a comparison of the eTag in the request, with the eTag calculated over the content it wants to send. If the eTags match, then the server sends a 304 status code, which notifies the client that nothing has changed since the last time the request was made so the client can use what it has stored in its persistent data store on the client side and does not need to download the data again. The eTag is a useful tool for communications between a mobile web application that requires a lot of data from the server because the mobile web app has limited data plan and downloading a lot of data drains the battery.

## Database

**Why Database?**

- We want our data to live on after our server goes down (either because we manually stop it or it crashes)
- When we have multiple servers and one set of data that they both need to use and update
- A database is essentially a file management system. It gives us a way to structure our data, query our data, etc

**SQL versus NoSQL**

- [This Video](https://www.youtube.com/watch?v=eM7hzKwvTq8)\*\* compares SQL with NoSql.
- SQL databases are also called relational databases. Data is stored like spreadsheets. There are columns and rows. You need to define the columns when you first create the database. Each new entry is a new row and needs to conform to the schema. You use SQL protocol to interact with the database.
- NoSQL, also known as non-relational database, are not generally structured like a spreadsheet. The protocol you use to query a NoSQL database can be anything from a RESTful HTTP request (like couchdb), a JSON-like protocol (such as the BSON of MongoDB), or a SQL-like protocol (such as Cassandra's CQL)

[Kristof Kovacs](https://kkovacs.eu/cassandra-vs-mongodb-vs-couchdb-vs-redis?) put together a very good summary of all the different kinds of NoSQL databases and what they are good for:

- MongoDB: for building a regular app that could benefit from a flexible schema for your database (such as building a website for a startup)
- Redis: for building real-time stuff (such as stock prices, real-time communication, leaderboards)
- Cassandra: for big data. It lets you use SQL-like queries, which can allow data scientists to port over their existing SQL skills.
- HBase: for needing to store a gigantic table (e.g., to do matrix multiplication on or something). For example, a search engine like Google. This is based on Google's BigTable, with support for Map/reduce with Hadoop. Alternative are Accumulo, Hypertable.
  - Note: If you are building a social network, don't be tempted to use BigTable to store graph. It's not efficient and you could have a very sparse table. Use a graph database, such as

## Stack

**MERN Stack**

![](https://webassets.mongodb.com/_com_assets/cms/MERN_stack-y11tmdeja3.png)

[Source](https://www.mongodb.com/blog/post/the-modern-application-stack-part-1-introducing-the-mean-stack)

## Tools

**Node Package Manager (NPM)**
Every Node project sits in a folder, and at the root of every Node project there’s a file called `package.json`, which is a pretty simple JSON file that defines project metadata like the name of the project, its version, and its authors. It also defines the project’s dependencies.

[react express](http://www.react.express/npm)

> `npm` uses a file named `package.json` to record which packages your app depends on. This package.json file should live in the top level directory of your React project.

> To add a package.json to a project, run `npm init`

> When you type `npm install` npm automatically downloads all dependencies into a folder called `node_modules`. This folder will live alongside your package.json.

**Webpack**

[react express](http://www.react.express/webpack)

> Webpack bundles your client-side code (JavaScript, css, etc) into a single JavaScript file. Webpack is highly configurable with plugins, allowing you to bundle nearly any kind of asset imaginable.

**Git / Github**
[See My Tutorial](https://github.com/xiaoyunyang/xiaoyunyang.github.io/blob/master/assets/md/GitTutorial.md)

## Good Resources

**Web Technology 101:**

- [Web Technology Fundamentals](http://chimera.labs.oreilly.com/books/1230000000345/ch03.html)
- [Frontend Backend DevOps Roadmap](https://github.com/kamranahmedse/developer-roadmap)

**Web App Design Guides**

**Frontend**

- [React.Express Tutorial](http://www.react.express) - Learn about React, Redux, ES6, Babel, Webpack
- [React-Redux Connect Explained](https://www.sohamkamani.com/blog/2017/03/31/react-redux-connect-explained/)
- [Material Design](http://www.google.com/design/spec/material-design/introduction.html) - Best practice for UX and UI
- [Frontend Handbook](https://frontendmasters.com/books/front-end-handbook/2017/)

**Backend**

- [Manning Express In Action](https://hackerstribe.com/wp-content/uploads/2016/04/Node.js-Express-in-Action.pdf)
- [Express In Action Code](https://github.com/EvanHahn/Express.js-in-Action-code)
- [How to Integrate React Router v4 with Server Router](https://crypt.codemancers.com/posts/2017-06-03-reactjs-server-side-rendering-with-router-v4-and-redux/)

**REST API**

- [REST API tutorial](http://www.restapitutorial.com/)

## TODO

- [ ] Integrate [resources from here](https://www.reddit.com/r/LearnFree/comments/6p2p4a/list_of_best_online_resources_to_learn/) to this document.
- [ ] Add self-directed learning guide section to this document.
- [ ] Go through the [Awesome List](https://github.com/sindresorhus/awesome)
