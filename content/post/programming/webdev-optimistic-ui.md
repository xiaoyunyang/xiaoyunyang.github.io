---
title: "Web Developer Playbook: Optimistic UI"
date: 2022-08-25
categories:
  - blog
tags:
  - Guide
  - Frontend
  - UX
  - React
keywords:
  - Software Design
  - web development
  - JavaScript
  - Optimistic State Updates
  - Optimistic UI
  - Design Pattern
  - React
  - User Experience
autoThumbnailImage: false
thumbnailImage: /post/images/optimistic-ui/thumb.png
thumbnailImagePosition: top
coverImage: /post/images/optimistic-ui/cover.png
---

In classic implementations of a CRUD app, the client app makes a request to the server and only updates its display state if the server responds to the request. However, in many modern applications like chat apps and note taking apps, users expect the display state to immediately update after they initiate an action.

Quick response time from the server is not always achievable, especially when the user is on a slow network on a mobile device.

<!--more-->

There is not much frontend developers can do about network latency but we can incorporate a technique called **optimistic UI** to mitigate users’ perception of a laggy and buggy app and deliver a richer overall user experience by creating opportunities to implement better offline support and error handling.

There are two parts to the blog post.

Part 1 focuses on the theory of optimistic UI to develop a better understanding and mental model about solving optimistic UI problems.

Part 2 looks at some for optimistic UI design patterns illustrated by some oy examples.

{{< toc >}}

## What is Optimistic UI And When We Need It?

Optimistic UI is a technique for making your app feel more responsive to the user by simulating the server response to an update request and updating the UI before actually receiving the server response.

From a _UI perspective_, there are two types of use cases where we make a mutation:

1. **Creating new stuff:** The UI is not preloaded with server data when it first mounts because the thing you are creating does not exist yet. Examples include creating a new Instagram story and filling out your user information during onboarding.
2. **Updating existing stuff on screen:** The UI is seeded with server data on the initial load and the user is making changes to that data.

The mutation operation could be to update a field on an object (toggling the checkbox on an item in a to-do list) or to update a collection of objects (adding a new item to a to-do list).

For the first use case, the client state is the only source of truth for the data that drives the UI display.

For the second use case, we cannot base our source of truth entirely on the server state because it would cause the update operation to not appear instantaneously from the user's perspective.

Since it takes some time for the mutation to resolve (especially if you are on a slow network on a mobile device), the update will not appear immediately after the user triggers the updates. This makes the user second-guess their action and could give the impression that the app is sluggish and buggy.

With Optimistic UI, we can make the perceived latency disappear by simulating the expected result in the success case. Let's call this the **optimistic result**.

This is a simple concept but the implementation could vary depending on what type of UI you are building and what type of data you are modifying.

In the next section, let's go over different considerations for implementing Optimistic UI.

## An Overview of Optimistic UI Problems

There are three considerations for implementing Optimistic UI:

### 1. Persisting Optimistic Result

When to persist optimistic results primarily depends on the use case and product requirements.

Imagine you are commenting on a post. You spend 30 minutes typing a long and thoughtful response, click "post". The comment is added optimistically to the comment section, but your internet suddenly cuts off. When you are back online, that comment is nowhere to be found because the post operation failed due to a network issue.

Consider another scenario when you are starring a repo on Github. The star is added optimistically but while your mutation is in flight, the author of the repo deleted the repo. The server responds with some error and you see an error toast message pop up on your screen that something went wrong but you still see the star on that repo.

These are examples of incorrect implementation of _client-side persistence_ of the optimistic result after the update operation failed _server-side_.

For the post comment, we want to persist the optimistic result after an error because the optimistic result (the comment) is very expensive for the user to generate.

On the other hand, it takes no effort for the user to click a button to star the repo again but the user could be confused and perceive it as a bug when they see that the repo is still starred when there's an error message and that repo does not show up on their list of starred repos when they later navigate to their starred repos page.

### 2. What Kind of Data Are We Updating

The type of bookkeeping we need to implement for the optimistic result is driven by the type of data that is being updated and whether we need to persist the optimistic result after the mutation resolves.

As previously mentioned, the two types of updates we do are field update and collection update.

More precisely, field update is when we are _changing_ the property of an existing object in the data model without changing the identity of that object (the object's `id` field). Collection update is when we are adding a new object to or deleting an object from the data model; that new object could assume two identities during the optimistic update lifecycle: client-only data or server-driven data.

For example, toggling the checkmark on an item in a to-do list is a field update. Adding a new item to the to-do list is a collection update.

That said, the level of bookkeeping we need based on update type and optimistic result persistence:

- Field update without persistence - No need for bookkeeping. Always overwrite optimistic result with the server response.
- Collection update without persistence - bookkeeping is probably unnecessary but there should be a way to quickly add or remove items from the data model.
- Field update with persistence - Need to keep track of the status of the update request which tells us when to update the optimistic result.
- Collection update with persistence - Need to keep track of the status of the update request AND which data is client-only and which is server-driven in the data model.

We will take a look at some implementation approaches for field update with persistence and collection update with persistence in the design patterns section.

### 3. Where to store the optimistic result

Optimistic results should be stored in the data model that provides the source of truth for your UI.

There is an array of client-side datastore options to keep your data model:

- Apollo client cache - for client state based on API data
- React component state or ref - for client state that does not need to live beyond the lifecycle of the component
- Redux or React Context - for client state that needs to be shared across multiple pages
- Local storage - for client state that needs to persist across multiple sessions

Apollo client cache is the most restrictive option for storing our data model because data in the cache has to conform to the server-defined schema which prevents us from implementing any sort of bookkeeping system using only the Apollo client cache.

If we are making a field or collection update without persistence, Apollo client cache is a perfectly valid choice for our data model. Field update with persistence is trickier because the cache update needs to be coordinated with the update to the view state of the component where the optimistic result is created.

Apollo cache is a poor choice for collection update with persistence for two reasons:

1. We are restricted by the schema to maintain bookkeeping information (local-only data) in the same place as our collection data.
2. Optimistic results cannot always mock all the required fields for the result to _truly persist_ AND be consistent with its server version.

What I mean by the second point can be demonstrated with this example:

Suppose we are using the Apollo cache to keep our data model for a to-do list. The schema requires that every to-do list item have an `id`. When user adds a new item to the list, we must presume an `id` for the optimistic result because without the server response, we don't know the real id.

The [GraphQL Optimistic UI tutorial](https://www.apollographql.com/blog/frontend/tutorial-graphql-mutations-optimistic-ui-and-store-updates-f7b6b66bf0e2/) proposed "a little hack" for generating an id for the new to-do item that looks different enough from the server-generated id for us to clearly distinguish optimistic results in the data model from the real ones.

When the mutation resolves with the real id, we are left with two choices; both are not without downsides:

1. **Update the client-generated id with the real id.** This ensures all the data in our Apollo Client Cache data is correct, i.e. if the data exists server-side, it matches the server-side data. However, this could cause UI bugs because if a component is rendered using the `id` as the key, changing that `id` is going to cause the component to unmount and a new component to mount. Visually, this results in glitching in the UI as the to-do item disappears for less than a second and then reappears again. This is an incorrect implementation of optimistic UI because the original optimistic component did not persist.
2. **Don't update the client-generated id with the real id.** The UI glitch is averted but now the apollo client version of the data has the wrong id. If this is a collaborative to-do list and the to-do app is subscribing to updates to the to-do list from collaborators and the update event identifies the to-do item by `id`, then the real-time update will not work correctly because the `id` does not match the server `id`.

Is it acceptable for the post-mutation optimistic result to be out of sync with the server version? Is it acceptable for the optimistic result to not persist in the success case?

We can avoid making that tradeoff by just avoiding Apollo Client Cache as the data model store when we are working with optimistic results that need to persist. That is not to say we will not use Apollo cache at all when we keep our source of truth somewhere else.

The Apollo cache is still useful for managing server-driven data and that's the only type of data allowed in the cache. If the data does not exist server-side, it should not be in the client cache.

Having to maintain multiple datastores and keeping them in sync presents an architecture challenge but there is a clean way to do it by using a data structure and a set of datastore update policies. We will discuss that later in the design patterns section.

## Design Patterns

This section discusses strategies and best practices for implementing optimistic UI and managing your data model containing the optimistic result. It's important to note that they are two distinct problems.

Recall the condition for persisting optimistic results is if the result is expensive for the user to generate. Examples include updating your profile bio, uploading a new photo to a photo album, and writing a response to a text message in a chat app.

### Field Update with Persistence

Suppose the task is to implement optimistic UI for updating the user profile bio.

Even if the original bio is loaded into the Apollo Client Cache, we still need to keep a local copy of that bio in a component state because we don't want to update the Apollo cache every time the user types.

**What the user sees is the optimistic result.**

Because we are keeping the optimistic result in a component state, it makes sense to keep the bookkeeping logic and metadata about the optimistic result in the same component so we don't have to jump back and forth between different components and data stores to gather all the information we need about an update operation.

**Do the bookkeeping in the same place where you keep your data model.**

Let's say we have this form component that shows the current bio in a textbox, lets the user edit the bio and send that update using the "Send" button.

The form component manages the data model and implements optimistic UI.

The design for the data model and its bookkeeping is as such:

- Create component state `bio` which is pre-loaded with the server-based bio. This is where we keep our optimistic result.
- Create component state `sendStatus` which includes the following values: `PENDING` (initial value), `SENDING`, `SUCCESS`, `FAILED`. `sendStatus` is essentially the metadata about the optimistic result.
- When user triggers the "sending" of the optimistic result, `sendStatus` is updated from `PENDING` to `SENDING`.
- When the response is received, `sendStatus` is temporarily updated to `SUCCESS` or `FAILED`, then reverts back to `PENDING` after some timeout.

We do not have to update `bio` because we want to persist `bio` client-side regardless of the result of the update operation.

`sendStatus` tells us about the server acceptance of the update request but it doesn't tell us whether this version of the bio only exists client-side or also exists server-side. In most cases we don't need to know; we can make our UI design of the form such that it does not prohibit sending an update to the `bio` that's exactly the same as the server version of the `bio`. But if we are interested in eliminating unnecessary network requests, a common practice is to cache the server data somewhere like in Apollo Client Cache or in another component state so that can be compared with the optimistic result.

Unless the Apollo cache needs to have up-to-date `bio` to support other screens, I do not recommend setting up the Apollo cache _just_ to keep the source of truth for the server version of `bio` because it adds complexity to the architecture from having to maintain two separate data sources for the form component, coordinate the update of both data stores, and creates another dependency for the form component.

Caching the server version of `bio` in a component state and updating it when mutation resolves with success is a better approach because it's not a large piece of data to store in a component state and provides a key piece of bookkeeping information about the optimistic UI.

Let's add another component state to our form component: `serverBio` which is preloaded with server data when the component mounts and is updated to the optimistic result in the `SUCCESS` state.

Now we have all our pieces for the data model - `bio`, `serverBio`, and `sendStatus` - let's look at how we use this data model to render the view for our optimistic UI. The view state is based entirely on the data model:

- When `sendStatus` is `PENDING`, show `bio`. If `bio` is not equal to `serverBio`, show an enabled SEND button; otherwise, show a disabled SEND button.
- When `sendStatus` is `SENDING`, show a "sending" indicator and a disabled SEND button.
- When `sendStatus` is `SUCCESS`, show some success notification and continue to show a disabled SEND button.
- When `sendStatus` is `FAILED`, show some error notification and continue to show a disabled SEND button.

In the `SENDING` state, if the UI allowed the user to send another request with a different input while the previous request is still in progress, then if the first request succeeds, the optimistic result of the second request will get overwritten.

**Do not assume the order of network response and user action.**

Due to the non-deterministic nature of the request round-trip time and user input, we should consider prohibiting user input while the request is in progress by disabling the send CTA and displaying some send status indicator to inform the user why they are prohibited from making another update request. A common way we implement this is by updating the send button to be disabled with the label `SENDING…`.

### Collection Update with Persistence

The design pattern for field update with persistence can be adapted for collection update with persistence:

1. Apollo Client Cache only contains server data only. No mixed client-only + server
2. Single source of truth for data that drives the views
3. Keep bookkeeping in the same place as your data model

But with some gotchas:

1. Collections data cannot be updated in isolation.
2. The collection items may be ordered and are fetched together from the server, which could be an expensive API call.
3. Collection items can have multiple "identities", i.e., when it only exists on the server with a server-generated `id` and when it is also added by the server with a server-generated `id`. The view component needs to recognize that these two versions are the same.

### Data Model

Where do we store our data model?

Our data model could contain server-driven data, client-only data, and metadata so Apollo Client Cache is eliminated as an option.

Collection items can be added and removed so it doesn't make sense for the view component of each collection item to keep tabs on its own update status because that could potentially lead to memory leaks from updating the state of an unmounted component.

The component that renders all the Collection items component is a good place to keep the data model but we have to be very careful about storing the collection in a component state as it could potentially lead to excessive re-rendering following an update. Storing the data model in a mutable React ref variable (created using `useRef`) could mitigate this problem but an update made to the ref only causes shallow rendering (update only to the component, not its children). If adding and removing to the collection are the only operations you need to worry about, then the ref variable is a good place to store your collection data. But if you need to also worry about updating the properties of an existing item in your collection, then the component state should be used.

Note that we don't have to restrict ourselves to a single storage location. We can have multiple data layers:

1. **Server Data Layer:** Source of truth for server data in Apollo Client Cache. We don't always need this layer since we can always pre-load server data into the optimistic data layer. The need for this layer is based on whether the collection data affect other pages in our app.
2. **Optimistic Data Layer** Single source of truth for optimistic results plus server data. The server data in this layer is based on Apollo cache and the optimistic results are based on UI states. This layer also includes bookkeeping metadata. Another way to think about this layer is it's like a buffer for outgoing and incoming data from the server. This layer is where our data model should be stored.
3. **View Data Layer** Single source of truth for data driving the view, which is a component state based on the data model. It can be the data model itself or component states based on the data model. If you don't always want every update to the data model to trigger re-rendering.

Having multiple layers of data like this adds some clarity about the origin of the data and makes it easier to implement policies for updating the data in each layer at the interfaces.

Another performance consideration is the time complexity of updating the data model. If we keep our collection in an array, it's an O(N) lookup, insertion, and deletion by `id`. If we keep our collection in a JavaScript object, the lookup/insertion/deletion operation is O(1) but JavaScript objects do not guarantee order. `Map` provides the best of both worlds by offering a fast lookup and guarantees ordering based on the original insertion order.

### Bookkeeping

How do we keep tabs on the optimistic results in our data model? The goals of bookkeeping are:

- Be able to clearly distinguish server data from client-only data.
- Update the optimistic results when the server request resolves **without** losing the persistence.
- Keep status of the update operation (i.e., SENDING, SUCCESS, FAILED)

In the optimistic field update example, we used three component states `bio`, `serverBio`, and `sendStatus` for a single field. For bookkeeping on a collection, we could continue to use three entities like this for each collection item but keeping a server version and a client version of the data for every item is not very space-efficient.

Next, I will introduce a space-efficient strategy for bookkeeping on a collection where items are updated optimistically.

This strategy uses a data structure. Let's walk through an example:

The task is to implement a collaborative todo-list where each todo item could be added/deleted and modified by you and any collaborators of your todo-list.

The todo-list from the server looks like this:

```json
{
  "todoList": [
    { "id": "123", "value": "laundry", "completed": false },
    { "id": "456", "value": "taxes", "completed": false }
  ]
}
```

We have the following view components:

- `Todo` - renders a checkbox and the value of each todo list item.
- `NewTodo` - an input that lets the user create the value for a new todo item and an ADD button that will trigger the optimistic update and server request.
- `TodoList` - renders a collection of `Todo` components and the `NewTodo`.

We want to keep our data model in `Todo` since that is the top-level component that needs to keep tabs on both the data from the server and the optimistic results.

`TodoList` will maintain a data structure `TodoList` defined as follows:

```ts
type todoId = string; // server Id or previousId

interface Todo {
  id: todoId;
  value: string;
  completed: boolean;
}

interface TodoWithMeta {
  todo: Todo;
  previousId?: string;
  sendStatus?: "SENDING" | "FAILED";
}

type TodoList = Map<todoId, TodoWithMeta>;
```

Then in our `TodoList` component, we use a ref object to keep our todo list with metadata:

```ts
const todoListRef = useRef<TodoList>(new Map());
```

Here's how the `todoListRef` will be updated:

**Initial Load**
When the `TodoList` component first mounts, the Map will be populated with server data. This is our Map on initial load:

```js
{
  "123": {
    todo: { id: "123": value: "laundry", completed: false }
  },

  "456": {
    todo: { id: "456": value: "taxes", completed: false }
  },
}
```

**Add Optimistic Result**

User adds a new todo "dishes" and clicks ADD. An optimistic result will be added to the Map with a client-generated `id` that should look different enough from the server-generated id to not cause a collision. Our Map now looks like this:

```diff
{
  "123": {
    todo: { id: "123": value: "laundry", completed: false }
  },
  "456": {
    todo: { id: "456": value: "taxes", completed: false }
  },
+ "abc": {
+  todo: { id: "abc": value: "dishes", completed: false },
+  sendStatus": "SENDING"
+ },
}
```

**Failed Response**

The server request resolves with an error. We update Map:

```diff
{
  "123": {
    todo: { id: "123": value: "laundry", completed: false }
  },
  "456": {
    todo: { id: "456": value: "taxes", completed: false }
  },
  "abc": {
    todo: { id: "abc": value: "dishes", completed: false },
+   sendStatus: "FAILED"
  },
}
```

**Success Response**

Client retries sending that request and the second time, the request resolves with success. The success response contains the `id` for the new todo item in the collection. We update the Map as follows;

1. Delete the optimistic result from Map
2. Create a new entry based on the server result with some metadata.

```diff
{
  "123": {
    todo: { id: "123": value: "laundry", completed: false }
  },
  "456": {
    todo: { id: "456": value: "taxes", completed: false }
  },
- "abc": {
-   todo: { id: "abc": value: "dishes", completed: false },
-   sendStatus: "FAILED"
- },
+ "789": {
+   todo: { id: "789": value: "dishes", completed: false },
+   previousId: "abc"
+ },
}
```

Because the todo list update operation was approved by the server, the actual todo item id should be based on the server-generated `id`. But we also want to _remember that this item used to be an optimistic result_. So `previousId` is added to the new entry's metadata to prevent the todo item from unmounting and remounting, which could be a noticeable and jarring user experience.

We are not keeping `SUCCESS` as another `sendStatus` state because it's irrelevant from a data model standpoint. Success send status doesn't need to persist and is generally a UI side effect like a success notification. If the update operation is a success, the data in our Map will match the data on the server. We only need this extras piece metadata in our data model to tell us which pieces of data in our Map _don't match_ what's on the server. `sendStatus` will also facilitate the implementation of the option to resend failed requests.

If the design of the todo-list requires a success notification, I recommend implementing that in a component state as a UI side-effect rather than incorporating this side effect in the data model.

**Collaborator Updates a Todo Item**

We want to keep the data model always in sync with the server data in a `useEffect`.

Suppose the todo-list app implements real-time updates from collaborators via socket. The collaborator of this todo-list saw the "dishes" item added to their list and marks it as done. Now the Map we are maintaining will be updated based on this server update:

```diff
{
  "123": {
    todo: { id: "123": value: "laundry", completed: false }
  },
  "456": {
    todo: { id: "456": value: "taxes", completed: false }
  },
  "789": {
-   todo: { id: "789": value: "dishes", completed: false },
+   todo: { id: "789": value: "dishes", completed: true },
    previousId: "abc"
  },
}
```

Because the update identifies the todo item by its actual `id` (server-generated), the Map is updated correctly and the "dishes" `Todo` checkmark will be updated.

**User Updates an Optimistic Todo Item**

The key of our Map is always the most "true" id. Server-generated id is _more true_ than client-generated id. There are no duplicate items in our collection because the deletion of the optimistic todo happens at the same time as the addition of our server-approved todo.

Suppose the todo-list app also supports offline mode. The user adds a new todo item "yoga", send status gets updated to FAILED. Our Map becomes:

```diff
{
  "123": {
    todo: { id: "123": value: "laundry", completed: false }
  },
  "456": {
    todo: { id: "456": value: "taxes", completed: false }
  },
  "789": {
    todo: { id: "789": value: "dishes", completed: true },
    previousId: "abc"
  },
+ "def": {
+  todo: { id: "def": value: "yoga", completed: false },
+  sendStatus: "FAILED"
+ },
}
```

Now in offline mode, the user checks off "yoga" from the list. Our Map becomes:

```diff
{
  "123": {
    todo: { id: "123": value: "laundry", completed: false }
  },
  "456": {
    todo: { id: "456": value: "taxes", completed: false }
  },
  "789": {
    todo: { id: "789": value: "dishes", completed: true },
    previousId: "abc"
  },
  "def": {
-   todo: { id: "def": value: "yoga", completed: false },
+   todo: { id: "def": value: "yoga", completed: true },
    sendStatus: "FAILED"
  },
}
```

Since the source of truth for our view component is the data model, not the server, data can be added and changed as if the user were online.

When the user can resend the request for "yoga", the collaborator will get an update to their todo-list with "yoga" in a checked state.

## Summary

For how long to persist optimistic result is a key consideration in determining where the optimistic result will get stored. This requires thinking through how the optimistic result needs to be updated after the mutation resolves with success or error.

Another important consideration is what kind of data we are optimistically updating, which determines what kind of bookkeeping we need for the optimistic result.

We also need to take a step back to question whether it is worth implementing optimistic UI at all.

For a banking app, we probably never want to implement optimistic UI because users expects a loading state after sending and it's not worth risking determinism in handling user request for a more responsive UI. On the other hand, users expect responsive UI on social apps where there is a ton of micro-interactions such as sending a message or liking a post.

There's a tradeoff to make between the need for a more responsive user experience and adding technical complexity. Technical complexity introduces potential sources of bugs and added cost to codebase maintainability. Hopefully, this guide provides a good mental framework for thinking about optimistic UI problems and strategies for solving it in a way that mitigates the risks of the added technical complexity.

To summarize, if you find yourself needing to implement optimistic UI, follow these best practices:

- Optimistic results should be stored in the data model that provides the source of truth for your UI.
- Do not use Apollo client cache to store the data model if the optimistic result needs to persist after the mutation resolves with success.
- The data model should be designed to be able to clearly keep track of optimistic results and tell apart client-only data from the server-driven data.
- Do not split the data model because that introduces technical complexity in having to synchronize the different parts of the data model which could lead to maintainability issues and bugs.
- We should implement the bookkeeping in the same location as our data model because bookkeeping requires us to make use of metadata that does not make sense outside the context of the data we are managing.
- Ensure determinism in the update operation by disabling parallel update requests from the user.

If you enjoy reading this, please check out the other posts in the Web Developer Playbook Series 🙏:

- [Web Developer Playbook: Slug](https://medium.com/dailyjs/web-developer-playbook-slug-a6dcbe06c284)
- [Web Developer Playbook: Rick Text Editor](https://codeburst.io/web-developer-playbook-rich-text-editor-4c356fb8929d)
