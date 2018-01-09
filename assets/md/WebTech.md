# Understanding Web Technology

## Motivation

This is an introduction of concepts and technology behind modern web applications. Modern web applications are built on stacks of open source libraries and frameworks. You can visit [stackshare.io](https://stackshare.io/airbnb/airbnb) to see the stacks used by tech companies such as Airbnb.


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
> <p>A List:</p>
<ul>
	<li>One</li>
	<li>Two</li>
</ul>

When you visit a website built in the 1990s, your browser (e.g., Chrome, Firefox, Safari) makes a request to the server of the website to download all files it needs to display the webpage. For instance, the HTML file tells your browser how to create a DOM. The Cascading Style Sheets (CSS) file tells your browser how to apply styles, such as text color and font, to the DOM. Go ahead and open [https://www.w3.org/TR/WD-DOM/introduction.html](https://www.w3.org/TR/WD-DOM/introduction.html) with Chrome and press `Cmd + Shift + C` to inspect the DOM.  Press `Cmd + s` to save the webpage to your computer and click the `.html` file stored on your computer to see that the same webpage is displayed.

Static webpages are undesirable from a user perspective as well as from a web developer perspective. Users cannot interact much with a static website other than viewing the content. The owner of the website has to modify the html file to change the content of page.

Javascript frameworks provide a way for the client (i.e., the browser) to manipulate the DOM. The client may interact with DOM in different ways (e.g., collapsing and filtering a list). Javascript frameworks also handle the interface between the DOM and server. There are many javascript frameworks out there but none is more powerful than [React](https://reactjs.org/docs/thinking-in-react.html).


### React
>React is a declarative, efficient, and flexible JavaScript library for building user interfaces.

**[React](https://reactjs.org/tutorial/tutorial.html)** is a Javascript library, built and maintained by Facebook. It was developed by [Jordan Walke](https://twitter.com/jordwalke), a software engineer at Facebook. It was open-sourced and announced to the developer community in March 2015. Since then, it has undergone tremendous growth and adoption in the developer community. React is currently on version 16 (See the [Migration log](https://reactjs.org/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) to appreciate the pace of growth in popularity and capability of React).

React gives the developer full control of the DOM and covers the rendering of initial state and updating the state to reflect changes based on user or server input.

* [Good Introduction to React from Auth0](https://auth0.com/blog/reactjs-authentication-tutorial/)
	> React lets you create custom and reusable HTML elements. React provides some methods that are triggered at various points from creating a component up until the component is destroyed. This is called the Component's Lifecycle. You can declare methods to hook into the component's lifecycle to control the behavior of components in your app. Some examples of these lifecycle hooks are `componentDidMount()`, `componentWillMount()`, `componentWillUnmount()`, `shouldComponentUpdate()`, `componentWillUpdate()` and more. 
	
	What is a `prop`?

	> Props is the short form for properties. Properties are attributes of a component. In fact, props are how components talk to each other. A tag in HTML such as `<img>` has an attribute, a.k.a prop called src that points to the location of an image.
	
In React, application data flows unidirectionally via the state and props objects, as opposed to the [data binding](https://www.themarketingtechnologist.co/introduction-to-data-binding-in-angular-2-versus-angular-1/) of libraries like [Angular](https://angular.io/) (another popular Javascript framework for building web apps). This means that, in a multi-component hierachy, a common parent component should manage the state and pass it down the chain via the `prop`.	


* [Thinking in React](https://reactjs.org/docs/thinking-in-react.html)

	> Since you’re often displaying a JSON data model to a user, you’ll find that if your model was built correctly, your UI (and therefore your component structure) will map nicely. That’s because UI and data models tend to adhere to the same information architecture, which means the work of separating your UI into components is often trivial.
	
For example, when you first click on the link to visit [KhanAcademy](https://www.khanacademy.org/)'s home page -- a webpage built on React -- your browser makes a request to the KhanAcademy's server to load the React code. The browser executes the React code, which creates React components. Each React component generates the part of the DOM it is responsible for by making another (asynchronous) request to the webpage's server or another server's API (more on that later) to grab the data (typically JSON) it needs to generates the appropriate information that needs to be displayed on the webpage.  For subsequent updates to the webpage, the React component repeats the steps to load JSON from the server or API and updates the information on the webpage. 


### Redux
> [`redux`](https://redux.js.org/) is a manager of global variables for React components.

**Why we need Redux?**

Sometimes, we want multiple React components to render different views of the same JSON and modify that JSON. We need to have a way to properly manage global variables. [Understanding Redux](http://www.youhavetolearncomputers.com/blog/2015/9/15/a-conceptual-overview-of-redux-or-how-i-fell-in-love-with-a-javascript-state-container) explains the motivation of Redux well. Redux manages the global variables using states.

> `actions` are dispached to trigger `reducers` to change the `store`.

* `store` is where the state of the application lives.
* `reducer` takes the current state as input and returns the next state. This is the only way to change the state of the application.
* `action` passes setter functions to React components to make changes to global states managed by redux. 


* `container` is basically a React component that is hooked up to redux. It fetches data and renders its corresponding sub-component. The boilerplate for any `container` component includes the following:

	```javascript
	//AppContainer.js
	
	import React from 'react'
	import { applyMiddleware, compose, createStore } from 'redux'
	import thunk from 'redux-thunk'
	import promise from 'redux-promise'
	import createLogger from 'redux-logger'
	import { Provider } from 'react-redux'
	import AppContainer from './app/containers/AppContainer'
	
	
	const configureStore = (initialState) => {
	   const logger = createLogger();
  		const store = createStore(
    	rootReducer,
    	initialState,
    	applyMiddleware(thunk, promise, logger)
  		);
	}
	
	const store = configureStore(window.INITIAL_STATE);
	
	const App = () => (
		<Provider store={store}>
			<AppContainer />
		</Provider>
	
	)
	export default AppContainer
	```
	
The `Provider` provides the `store` to the React app, which allows us to `connect` our React components to the redux `store`. The components can't  directly interact with the store; everything has to be done through redux:

* We can retrieve data by obtaining its current state
* we can change its state by dispatching an action

```
//AppContainer.js
App
//The AppContainer passes all the possible actions to the View components


import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'
import Router from '../components/Router'

//Dispatching functions (boilerplate)

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  //the state in the argument is the global state of the application
  return {
    todoCount: state.todoCount,
    username: state.username,
  }
}, mapDispatchToProps)(Router);

```

```
// Router.js

const Router = () => {

	// ...
}

```


* Image from [React-redux-connect explained](https://www.sohamkamani.com/blog/2017/03/31/react-redux-connect-explained/)

![](https://www.sohamkamani.com/assets/images/posts/react-redux-explanation/final-connect-flow.svg)


**Middleware for Redux**

* [`redux-thunk`](https://github.com/gaearon/redux-thunk) - allows you to write action creators that return a function instead of an action. `redux-thunk` allows you to delay the dispatch of an action or to dispatch only if a certain condition is met. A thunk is a function that wraps an expression to delay its evaluation.
* [`redux-promise`](https://github.com/acdlite/redux-promise) - receives a promise, dispatch the resolved value of the promise, but will not dismatch anything if the promise rejects.
* [`redux-logger`](https://github.com/evgenyrodionov/redux-logger) - logging tool that lets you replay problems as if they happened in your own browser.
* [`react-redux`](https://github.com/reactjs/react-redux) - We need to use `connect` from `react-redux` to connect a React component to a Redux store.

## RESTful API
> The RESTful API provides a way for the frontend app to talk to a server. 

**Why we need a RESTful API?**
 
The motivation for a RESTful API is to promote separation of concerns between the frontend application (the client) and the backend application (the server). REST, which stands for Representational State Transfer) provides an communications interface between the client and the server so that the client does not need to be concerned with data storage, which remains internal to the server, and the server does not need to be concerned with the display and user manipulation of the DOM, which remains internal to the client. 

Separation of concerns improves portability of both the client code and server code. To support this goal, we need a way for the client to talk to server. The most common communications between a client and a server are the `GET` and `PUT`. The client asks the server for information via a HTTP `GET` requests and displays a DOM to the user based on that information. The client also gives the server information based on user input via a HTTP `PUT`. The information that's passed back and forth is in a format called JSON, which looks something like this: [https://api.github.com/users/xiaoyunyang/repos](https://api.github.com/users/xiaoyunyang/repos)

While we (people) can view the JSON via clicking on the link and opening it up in the browser, the frontend app can view this data via making the following HTTP request:

```
GET https://api.github.com/users/xiaoyunyang/repos

```

The above example is supported by the [Github API](https://developer.github.com/v3/repos/#list-your-repositories). Many websites that collect a lot of data from their users provide an API that allows web developers to access that data. Some good APIs include:

* [Twitter API](https://developer.twitter.com/en/docs/tweets/post-and-engage/overview) - Grab tweets (useful for news websites)
* [Github API](https://developer.github.com/v3/repos/#list-your-repositories) - Grab repo information (useful if you are making an app to compare the popularity of open source libraries in real time)
* [Facebook Graph API](https://developers.facebook.com/docs/graph-api/) - Get user profile info or business info
* [Yelp Fusion API](https://www.yelp.com/developers/documentation/v3/business_search) - Find Information about businesses

The above example demonstrates the another usefulness of REST API as it allows you to build frontend applications that can talk to not just its own server, but other servers that provides public access to their data via a REST API.


## Back End
### Authentication



**Open Authentication (OAuth)**
1. OAuth - Why Open Authentication? Per [scotch.io](https://scotch.io/tutorials/the-easiest-way-to-add-authentication-to-any-app), there are a few key reasons for this, including:
> 
* A shifting identity landscape where we are now logging in with social providers like Google, Facebook, Twitter, and others
* A desire for tighter security through features like multi-factor authentication, password-less login, and single sign-on
* A new approach for application architecture that makes it more difficult to implement authentication


 
## Good Resources
**Web Technology 101:**

* [Web Technology Fundamentals](http://chimera.labs.oreilly.com/books/1230000000345/ch03.html)

**Web App Design Guides**

**Frontend**

[React-Reduc Connect Explained](https://www.sohamkamani.com/blog/2017/03/31/react-redux-connect-explained/)

* [Material Design](http://www.google.com/design/spec/material-design/introduction.html) - Best practice for UX and UI