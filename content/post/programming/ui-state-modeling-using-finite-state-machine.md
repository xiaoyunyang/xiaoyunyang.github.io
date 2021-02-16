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

A finite state machine (FSM) is an architectural design pattern that allows us to model a large system as a collection of loosely coupled components. Each component in the system changes its behavior when the internal state changes.

This pattern allows us to build flexible, reusable, and testable systems. In this article, we will explore the use of FSM in building complex React components.

<!--more-->

## Core Concepts

an FSM consists of states and state transitions. It can be represented by a state machine diagram.

{{< image classes="fancybox fig-50 clear" src="/post/images/fsm/fsm-turnstile.png"
thumbnail="/post/images/fsm/fsm-turnstile.png" title="FSM representing a turnstile">}}

Formally,

- **States** represent the modes of the system and drives the output of the system. Light switches have two states: ON or OFF.  [Traffic lights contain three states](https://levelup.gitconnected.com/an-example-based-introduction-to-finite-state-machines-f908858e450f): RED, YELLOW, or GREEN. There are a finite number of states in an FSM. Every FSM has an initial state, which is the state the system is on when it first initiates.
- **State transitions** are rules for going from the current state to the next state based on the current state and the system inputs.

If we model a React component as an FSM, events and component props are inputs to the system. An event can be like a button click or having received a certain response from the server. Inputs are triggered externally by the user, the server, or callers of the component.

The output of the system is the JSX (i.e., what is rendered) because that is what is ultimately returned from the component.

Transitions out of a state must be mutually exclusive. That means a given input cannot cause transition into two states. This ensures the deterministic behavior of our system.

## Component with A Few States

You probably already have had experience building React components that use component states like  isLoading  and isDisabled to determine how to render a component. These are examples of stateful components that can be modeled with a simple FSM with binary states. Let's apply what we learned about FSMs so far to model a simple stateful React component as an FSM in a concrete example.

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

`isOnline` allows us to stores three **UI States:** LOADING, OFFLINE, ONLINE.

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

The `setUiState(nextUiState)` is responsible for causing the state to transition from the current uiState to the next uiState based on the system input (i.e., `status` from ChatAPI).

Our system output is the message we want to render, which comes directly from `UiStateMessageMap`. We can do this because our system can only ever be in one of three states. When the output of the system depends solely on the current state, we have a special type of an FSM called a Moore machine. Moore machine is more deterministic but reacts slower to input changes compared to a Mealy machine. In a Mealy machine, the output depends on both the current state and the inputs of the system.

Whether you build a Moore machine or a Mealy machine really depends on the requirements of your system. We will see in the next part of the article how we can build a system that is a hybrid Moore and Mealy machine using an architecture that delegates the implementation of state-driven output to child components.

## Component with Many States

For simple components that may only have two or three states, an FSM may be overkill. There is quite a lot of overhead to implementing the FSM like defining all the UI States for not much additional benefit.

For a complex system consist of many sub-systems with cross-cutting concerns, an FSM provides a huge benefit.

Consider you have a system composed of multiple components in which one component needs to be disabled while another component is loading and the output of the two components determines the output of the third component.

The cross-component dependencies could result in tight coupling of components and makes encapsulation difficult and the system difficult to test.

At OkCupid, we've built such a component that lets you select a country and a query term (zip code or city name) to find a location anywhere in the world. This seems pretty straight-forward until you consider all the edge cases that this component needs to handle.

- The `<LocationSearch>` component interfaces with an API that provides an array of location objects that best matches the country+query search terms. Based on the lengths of this array, the component could display a success message, a variety of error messages, and another selection UI to disambiguate the search by selecting from a list of best matches.
- A bonus feature of this component is that if it's used on a mobile device, there's a button that lets you locate yourself automatically using your GPS (latitude+longitude). The same API accepts the geo-point data as input and responds with the locations array.
- The `<LocationSearch>` component also needs to handles client-side input validation errors like invalid zip code and network errors.
- Furthermore, the component can also be mounted with a **preloaded** `location`, which needs to be reflected in the country dropdown, zip code/city name input, and success message immediately.

If you see this in a Jira ticket, it might seem a bit overwhelming. There's a lot of logic that needs to be implemented. But having all the functional requirements up-front is actually a blessing in disguise - it enables us to think more holistically about the design of this component and pick an architecture that can effectively manage all of the complexity of this component.

### Enumeration of All UI States

A nice thing about working on a cross-functional team with a designer is that you get all the mocks before you start implementations. The mocks can be used devise the architecture.

Since this is an article about UI State modeling using FSM, you may have seen it coming. We are going to assign a UI State to each mock, which represents a snapshot of the component in action.

{{< image classes="fancybox fig-90 clear" src="/post/images/fsm/location-search-all-states.png"
thumbnail="/post/images/fsm/location-search-all-states.png" title="LocationSearch output in every state">}}

These images depict the output (the UI)  of the system in each state. Let's take a look at what the UI have in common in the different states. This will give us an idea on how to split up our `<LocationSearch>` component into sub-systems.

- In the SUCCESS state all the error states, a feedback message is displayed. The text color depends on the state.
- In the SUCCESS state, DISAMBIGUATION state, and all the error states, an icon is displayed besides the input (checkmark vs exclamation mark).
- In all the states except LOADING, the country dropdown, query input, and geo-location search buttons are enabled and accepting input from the user.

Based on these observations, we can start to delegating the rendering logic to different presentational components.

| Component       | What it renders                                                                               | Value depends on                                          | Affected by uiStates                   |
|-----------------|-----------------------------------------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------|
| Countries       | - dropdown containing countries retrieved from the server                                     | - found location <br/>- user input                             | LOADING                              |
| QueryInput      | - input containing the country/city name or zip code <br/>- check mark or x mark icon for feedback | - found location <br/>- user input                             | - LOADING <br/>- SUCCESS <br/>- all error states |
| Feedback        | - success message containing location name                                                    | - found location <br/>- static messages mapped to error states | - SUCCESS <br/>- all error states           |
| Suggestions     | - A dropdown containing matched locations                                                     | dropdown containing matched locations from the server   | DISAMBIGUATION                       |
| GpsSearchButton | - A button to trigger location search by GPS                                                  | N/A                                                       | LOADING                              |

By delegating the implementation of the state-specific output to these components, we are able to transform `<LocationSearch>` into a system of loosely-coupled components that are coordinated via the UI State. We are encapsulating the FSM in `<LocationSearch>`, in the sense that the parent component `<LocationSearch>` does not know anything about the implementation of the UI state in this component.

Now we've defined the states and the output of each state, we are going to specify the state transitions.

### State Transitions

Similar to `<FriendStatus>`, we are going to instantiate `uiState` as a component state of `<LocationSearch>` and mutate `uiState` in a `useEffect`. The evaluation of the next `uiState` will be done in a helper function `getUiState`.

Recall FSM can be represented as a directed graph and state transitions are the edges between the nodes. This is what our FSM should look like.

{{< image classes="fancybox fig-90 clear" src="/post/images/fsm/location-search-fsm.png"
thumbnail="/post/images/fsm/location-search-fsm.png" title="LocationSearch as a finite state machine">}}

The PENDING state is the initial state when the `<LocationSearch>` first mounts. As the component can mount with a preloaded location, there's an arrow going directly from PENDING to the SUCCESS state. We can also reach the SUCCESS state by providing a country+query to the server or a GPS coordinate to the server.

The ERROR_NOT_ZIP_CODE state is reached via client-side input validation and does not depend on the result of the server request. On the other hand, all the other error states would be reached only after making a request to the server.

## Summary

In this article, we learned what an FSM is and how to model a complex component as a system of loosely coupled sub-systems coordinated via the UI State.

We've seen some examples of how this is done using React primitives like `useState` and `useEffect`. There is a library called [xState](https://xstate.js.org/docs/about/concepts.html) which provides a more opinionated framework for creating, interpreting, and executing finite state machines and statecharts.
