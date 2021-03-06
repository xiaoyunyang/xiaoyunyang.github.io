---
title: "Modeling UI State Using A Finite State Machine"
date: 2021-02-15
categories:
  - blog
tags:
  - JavaScript
  - React
  - Web Dev
  - Frontend
  - Architecture
keywords:
  - JavaScript
  - React
  - Best Practices
  - Web Design
  - Web Development
  - React.js
  - Finite State Machine
  - FSM
  - Design Pattern
  - Architecture
  -
thumbnailImagePosition: left
thumbnailImage: /post/images/fsm/machine-cover.png

---

A finite state machine (FSM) is an architectural design pattern that allows us to model a large system as a collection of loosely coupled components. Each component in the system changes its behavior when the internal state changes. This pattern allows us to write flexible, reusable, and testable code. In this article, we will explore the use of FSM in building complex React components.

The primary use of FSM has been in [programming embedded systems](https://www.embedded.com/programming-embedded-systems-the-easy-way-with-state-machines/) but in recent years, there has been an emergence of FSM in other applications like [managing states in the browser](https://www.smashingmagazine.com/2018/01/rise-state-machines/), [modeling behavior](https://mind-simulation.com/en/blog/tech/using-finite-state-machines-to-model-behavior.html), and [building chatbots](https://www.hamidadelyar.com/blog/finite-state-machine-chatbot/). The goal of this post is not to evangelize FSM as a better state management solution than its alternatives like [Redux](http://redux.js.org/) but rather, to introduce a pattern for simplifying the architecture of a system and write robust code that is understandable, extendable, and [delete-able](https://programmingisterrible.com/post/139222674273/how-to-write-disposable-code-in-large-systems).

<!--more-->

## Core Concepts

An FSM consists of states and state transitions. It can be represented by a state machine [diagram](https://medium.com/well-red/state-machines-for-everyone-part-1-introduction-b7ac9aaf482e):

{{< image classes="fancybox fig-75 clear" src="/post/images/fsm/fsm-traffic-light.png"
thumbnail="/post/images/fsm/fsm-traffic-light.png" title="FSM representing a traffic light">}}

Formally,

- **States** represent the modes of the system and drive the output of the system. Light switches have two states: ON or OFF.  [Traffic lights contain three states](https://levelup.gitconnected.com/an-example-based-introduction-to-finite-state-machines-f908858e450f): RED, YELLOW, or GREEN. There are a finite number of states in an FSM. Every FSM has an initial state, which is the state the system is in when it first initiates.
- **State transitions** are rules for going from the current state to the next state based on the current state and the system inputs.

If we model a React component as an FSM, system inputs are provided externally by the user, the server, or callers of the component. These include events, such as a button click or having received a certain response from the server. The output of the system is the JSX (i.e., what is rendered) because that is what is ultimately returned from the component.

{{< image classes="fancybox fig-100 clear" src="/post/images/fsm/fsm-traffic-light.png"
thumbnail="/post/images/fsm/react-component-fsm-input-output.png" title="Inputs and outputs of a React component modeled as an FSM">}}

Transitions out of a state must be mutually exclusive. That means a given input cannot cause transition into two states. This ensures the deterministic behavior of our system.

## A Component with Few States

You probably already have had experience building React components that use component states like  isLoading  and isDisabled to determine how to render. These are examples of stateful components that can be modeled with a simple FSM with binary states. Let's apply what we learned about FSMs so far to model a simple stateful React component as an FSM in a concrete example.

Suppose we are building the `<FriendStatus>` component from the [React Hooks documentation](https://reactjs.org/docs/hooks-effect.html#example-using-hooks-1). At any given time, this component displays one of the three messages "Loading...", "Online", and "Offline".

```js
import React, { useState } from "react";

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return "Loading...";
  }
  return isOnline ? "Online" : "Offline";
}
```

The **component state**  `isOnline` determines exactly what message to render and is initialized to `null` and updated to "online" or "offline" in the `useEffect`.

`isOnline` allows us to stores three **UI States**: LOADING, OFFLINE, ONLINE.

We can rewrite `<FriendStatus>` to render based on the **UI State** instead.

```js
import React, { useState } from "react";

const UiState = {
  LOADING: "LOADING",
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
};

const UiStateMessageMap = {
  [UiState.LOADING]: "Loading...",
  [UiState.ONLINE]: "Online",
  [UiState.OFFLINE]: "Offline",
};

const getUiState = (status) => {
  const { isOnline } = status;
  if (isOnline === null) return UiState.LOADING;
  return isOnline ? UiState.ONLINE : UiState.OFFLINE
};

function FriendStatus(props) {
  const [uiState, setUiState] = useState(UiState.LOADING); // init state

  useEffect(() => {
    function handleStatusChange(status) {
      const nextUiState = getUiState(status);
      setUiState(nextUiState);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return UiStateMessageMap[uiState];
}
```

The state transition happens in `handleStatusChange`, which is triggered on every render because the `useEffect` has no second argument.

The `setUiState(nextUiState)` is responsible for causing the transition from the current uiState to the next uiState based on the system input (i.e., `status` from ChatAPI).

Our system output is the message we want to render, which comes directly from `UiStateMessageMap`. We can do this because our system can only ever be in one of three states. When the output of the system depends solely on the current state, we have a special type of FSM called a [Moore machine](https://en.wikipedia.org/wiki/Moore_machine). A Moore machine is more deterministic but reacts slower to input changes compared to a [Mealy machine](https://en.wikipedia.org/wiki/Mealy_machine). In a Mealy machine, the output depends on both the current state and the inputs of the system.

Whether you build a Moore machine or a Mealy machine really depends on the requirements of your system. We will see in the next part of the post how we can build a system that is a hybrid Moore and Mealy machine using an architecture that delegates the implementation of state-driven output to the child components.

## A Component with Many States

For simple components that have only two or three states, an FSM may be overkill. There is quite a lot of overhead to implement the FSM (e.g., defining all the UI States and transitions) for not much additional benefit.

For a complex system consisting of many sub-systems with cross-cutting concerns, an FSM provides a huge benefit.

Consider you have a system composed of multiple components in which one component needs to be disabled while another component is loading and the output of the two components determines the output of the third component.

The cross-component dependencies could result in tight coupling of components and make encapsulation difficult and the system difficult to test.

At my company, [OkCupid](https://www.okcupid.com/careers), we've built such a component (`<LocationSearch>`) that lets you specify a country and a query term (zip code or city name) to find a location anywhere in the world. This seems pretty straight-forward until you consider all the edge cases this component has to handle.

- The component interfaces with an API that provides an array of location objects that best match the country and query search term. Based on the length of this array, the component could display a success message, a variety of error messages, and another selection UI to disambiguate the search by selecting from a list of best matches.
- A bonus feature of this component is that if it's used on a mobile device, there's a button that lets you locate yourself automatically using your GPS location (latitude and longitude). The same API accepts the GPS location as input and responds with the locations array.
- The component needs to handles client-side input validation errors like invalid zip code as well as network errors.
- Furthermore, the component can be mounted with a **preloaded** location, which needs to be reflected in the country dropdown, zip code/city name input, and success message immediately when the component first mounts.

If you see this design spec in a Jira ticket, it might seem a bit overwhelming. There's a lot of logic that needs to be implemented. But having all the functional requirements up-front is actually a blessing in disguise - it enables us to think more holistically about the design of this component and pick an architecture that can effectively manage all of the complexity of this component.

### Enumeration of All UI States

A nice thing about working on a cross-functional team with a designer is that you get all the mocks before you start the implementation. The mocks can be used to devise the architecture.

Since this is an article about UI State modeling using FSM, you may have seen it coming. We are going to assign a UI State to each mock, which represents a snapshot of the component in action.

{{< image classes="fancybox fig-90 clear" src="/post/images/fsm/location-search-all-states.png"
thumbnail="/post/images/fsm/location-search-all-states.png" title="LocationSearch output in every state">}}

These images depict the output of the system (what the user sees) in each state. Let's take a look at what the outputs have in common in the different states. This will give us an idea on how to split up our `<LocationSearch>` component into sub-systems.

- In the SUCCESS state all the error states, a feedback message is displayed. The text color depends on the state.
- In the SUCCESS state, the DISAMBIGUATION state, and all the error states, an icon is displayed next to the input (checkmark and exclamation mark).
- In all the states except LOADING, the country dropdown, query input, and geo-location search button (labeled "USE CURRENT LOCATION") are enabled and accepting input from the user.

Based on these observations, we can start to delegate the rendering logic to different presentational components.

| Component       | What it renders                                                                               | Value depends on                                          | Affected by uiStates                   |
|-----------------|-----------------------------------------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------|
| Countries       | Dropdown menu containing countries retrieved from the server                                     | - Found location <br/>- User input                             | LOADING                              |
| QueryInput      | - Input field containing the country/city name or zip code <br/>- Checkmark or exclamation mark icon for feedback | - Found location <br/>- User input                             | - LOADING <br/>- SUCCESS <br/>- All error states |
| Feedback        | Success message containing location name                                                    | - Found location <br/>- Static messages mapped to error states | - SUCCESS <br/>- All error states           |
| Suggestions     | Dropdown menu containing matched locations                                                     | Matched locations from the server   | DISAMBIGUATION                       |
| GpsSearchButton | Button to trigger location search by GPS                                                  | N/A                                                       | LOADING                              |

By delegating the implementation of the state-specific output to these components, we are able to transform `<LocationSearch>` into a system of loosely-coupled components that are coordinated via the UI State. We are encapsulating the FSM in `<LocationSearch>`, in the sense that the parent components of `<LocationSearch>` do not know anything about the implementation of the UI state in this component.

Now we've defined the states and the output of each state, we are going to specify the state transitions.

### State Transitions

Similar to what we did in `<FriendStatus>` earlier, we are going to instantiate `uiState` as a component state of `<LocationSearch>` and mutate `uiState` in a `useEffect`. The evaluation of the next `uiState` will be done in a helper function `getUiState`. The advantage of making the next state evaluation explicit in `getUiState` is that we will be able to separate the concern of computing *when* to render from the concern of *what* to render.

Recall FSM can be represented as a directed graph and state transitions are the edges between the nodes. This is what our FSM should look like.

{{< image classes="fancybox fig-90 clear" src="/post/images/fsm/location-search-fsm.png"
thumbnail="/post/images/fsm/location-search-fsm.png" title="FSM representing LocationSearch">}}

The PENDING state is the initial state when the `<LocationSearch>` first mounts. As the component can mount with a preloaded location, there's an arrow going directly from the PENDING state to the SUCCESS state. We can also reach the SUCCESS state by providing a country+query to the server or a GPS location to the server.

The ERROR_NOT_ZIP_CODE state is reached via client-side input validation and does not depend on the result of the server request. On the other hand, all the other error states would be reached only after making a request to the server.

## Conclusion

In this post, we learned what an FSM is and how to model a complex React component as a system of loosely coupled sub-systems coordinated via the UI State. The FSM allowed us to build a robust system that is understandable, extendable, and [delete-able](https://programmingisterrible.com/post/139222674273/how-to-write-disposable-code-in-large-systems).

We've seen some examples of how this is done using React primitives like `useState` and `useEffect`. There exist JavaScript libraries like [xState](https://xstate.js.org/docs/about/concepts.html) and [Machina.js](http://machina-js.org/) which provide a more opinionated framework for creating, interpreting, and executing finite state machines and statecharts.

While the FSM is a powerful design pattern, it is not always the right thing to use for a project. Architectural design is most effective when there is a clear product vision and requirements upfront for how the full user experience should be. Pre-mature optimization could lead to worse code maintainability. Fortunately, the location search experience project was blessed with good product planning and clear design goals that made it possible to break down the problem and architect a robust technical solution.
