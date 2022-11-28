---
title: "Stash of The Design Behind OkCupid's Offline-first Chat App"
date: 2022-11-18
draft: true
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
thumbnailImage: /post/images/offline-first-chat-app/cover.png
thumbnailImagePosition: left
coverImage: /post/images/offline-first-chat-app/cover.png
---

<!-- Photo by <a href="https://unsplash.com/@alexbemore?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Alexander Shatov</a> on <a href="https://unsplash.com/s/photos/chat-app?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a> -->

The chat app is a table stakes feature for any dating app. A responsive and reliable messaging experience encourages users to stay on the platform for communications. This is desirable from a trust and safety standpoint, as abusive messages produced on the platform can be effectively moderated and proper actions can be promptly taken.

In this article, we will explore the design of an offline-first chat app on the OkCupid website, in particular, how we achieved responsiveness by implementing optimistic UI design patterns and reliability by incorporating a messages cache to support offline-mode.

<!--more-->

{{< toc >}}

## Why do we need the chat app to be offline-first?

Quick response time from the server is not always achievable, especially when the user is on a slow network on a mobile device. Offline-mode support is common for mobile apps because mobile apps often have to deal with spotty internet connection.

When do we need offline-mode support for a _web app_? There are two main reasons:

**1. If the web app is used in a mobile web browser on a phone where reliable network connection is not guaranteed.**

It's common for a web app that runs in a desktop browser and the web app that runs in a mobile browser to share code (sometimes they are the same web app!). On mobile web, being offline is a real possibility.

**2. If the web app is managing user-generated data that is expensive for the user to create.**

In a chat app, it can be frustrating user experience if you spend a long time drafting a new message to be sent but the draft is not persisted when the message fails to send, forcing you to have to type it all up again.

The desktop version of popular chat apps like iMessage, Whatsapp, and Facebook Messenger all support offline-mode so users expect offline-mode support for any chat app regardless of the device.

## What does offline-first mean exactly?

An app is considered to be offline-first if it can be used even when the user is offline.

An app that is designed to be offline-first supports unpredictable network latency by default.

We can think of being offline to mean having infinite network response time.

When the app is completely offline, the POST request for new content never resolves. If the app is designed to be offline-first, we would expect the app to still show the new content (responsiveness) and to still allow us to create newer content without losing the previously created new content (persistence).

Responsiveness is achieved by applying [optimistic UI techniques](https://xiaoyunyang.github.io/post/web-developer-playbook-optimistic-ui/). To make user interactions seem instant in a CRUD app, we can mock the expected server response before the server response is actually received and display the mocked response (the optimistic result). Optimistic results are things that exist client-side but not server-side.

How and where we are storing the optimistic results becomes important when we want to provide persistence.

Things can get very hairy when we need to persist an arbitrary number of optimistic results and these optimistic results needs to be displayed alongside things that exist server-side.

We will discuss that in more detail in the [solution approach](#solution-approach) section. But first, let's look at the design decisions behind the offline-first OkCupid chat app.

## Architectural Design Considerations

The previous section answers the question of _why_ we need to have offline-mode for the chat app. This section answers the question of _How_ we should implement an offline-first chat app _for OkCupid_.

In general, to design a correct and future-proof solution, we must first consider the requirements and constraints to establish the boundaries for our problem solving. Second, we must decompose the problem into sub-problems and search through the solution space for the best way to solve these sub-problems.

### Requirements Gathering

Understanding the scope of the problem requires insight into the business context of the problem we are solving and how the solution will need to scale for future use cases.

There are must-have and nice-to-have requirements for a modern chat app. The best way to enumerate the functional requirements for a feature is to use [user stories](https://www.mountaingoatsoftware.com/agile/user-stories). As a user, I want to be able to send and receive messages so that I can communicate with other users. More specifically,

- When I first open the chat app, I want to see the most recent messages exchanged me and the other user.
- I want to be able to draft a new message and send it to the other user.
- I want to see the new message I sent appear in the chat app immediately after I send it.
- I want to see the new message the other user sent appear in the chat app immediately after the other user sends it.
- When the other user sees my message, I want to immediately see the message marked as read.
- When I scroll up in the chat app, I want to see older messages appear.
- I want to be able to send a new message even when I am offline.
- If I try to send a new message when I am offline, I want to see the message appear in the chat history with a status indicating that this message has not actually been sent.
- When I am online again, I want a simple way to resend the messages that I tried to send when I was offline. It would be nice if the resend is automatic.

Functional requirements include the features we need to support now but the solution design should also consider future features. The better we can anticipate future requirements, the better we can make good initial design decisions to create a robust and scalable solution that can easily adapt to new use cases.

A non-scalable solution cannot evolve to support new requirements without costly refactoring or special-case handling, which introduces maintainability concerns. But when too much emphasis is put on future-proofing, we end up with an over-engineered solution that is also hard to scale and maintain.

Scalability and maintainability are examples of [non-functional and business requirements](https://www.altexsoft.com/blog/business/functional-and-non-functional-requirements-specification-and-types) that we also want to optimize for. For the chat app, we don't want to use a general offline-mode implementation that can be used for both collaborative data as well as non-collaborative data because this implementation can be very demanding on memory usage and computationally intensive. Using a memory and power intensive implementation not only causes unnecessary technical complexity in the implementation (bad for maintenance and velocity to launch the feature), but also a degraded offline-first experience from lagginess and crashes on cheap phones without a lot of processing power and memory.

Collaborative data is not a future use-case we will ever need to support for the chat app. As previously mentioned, only one person can create and edit a message and this is true for any chat app.

What are some valid and likely future features we would want to add for the OkCupid chat app? We can look to other chat apps to see what features they have that makes sense for a dating app.

- **Threaded reply** - Very Likely. Almost all modern chat apps support [threaded reply](https://www.engadget.com/2019-03-20-facebook-messenger-threads.html). Bumble, another dating app, already implements threaded reply in their chat app.
- **Group chat** - Likely. OkCupid is one of the best dating apps for daters seeking non-traditional relationships and already provides the ability for partnered daters to link their profiles together. It would be on-brand for OkCupid to provide a way for daters to chat with multiple people at once.
- **Un-send a message** - Unlikely because it is undesirable from a trust and safety standpoint, allowing bad actors to un-send a message will make it difficult to moderate a reported conversation. This feature is also not present in Bumble's chat app.
- **Edit a sent message** - Unlikely. Same reason as un-send a message.

### Identify Constraints

Unconstrained problem solving can be liberating but also overwhelming when there are too many choices to consider.

When we are searching for an optimal solution for a problem in a solution space, applying constraints can help us better scope our problem and refine our search to discover a simple and practical solution.

There are two flavors of constraints in engineering problem-solving: feasibility and practicality.

#### Feasibility

Feasibility concerns technical constraints that are imposed by the current technology we are using.

For example, a feasibility concern for the chat app may be memory availability on the device that the chat app runs on.

A conversation can have arbitrarily large number of messages. If we load all the messages into memory without pagination when the app first mounts, we will quickly run out of memory and the app will crash.

#### Practicality

Practicality deals with business constraints like engineering resource, budget, timeline, and the tolerance for risk.

Choosing to pursue a more technically complex and robust solution at a higher engineering cost is not always appropriate for a business that needs to be agile to test hypotheses and iterate quickly.

A social media platform like OkCupid operates in a very competitive landscape so there's an urgency to launch quickly and iterate on experimental features in response to new market insights. A flexible architectural design that is easier and faster to implement but has more technical debt is often the right choice for OkCupid.

Another practicality constraint is the tolerance for risk which depends on the business case for the feature. For example, if the KPI is measured in number of new user onboarding and conversion of these users to paid users, the business cost of shipping a broken onboarding flow or broken table-stakes feature like matching and chatting can be very high. In this case, it is better to trade off velocity for higher code quality.

### Other Things We Want to Optimize for

**Maintainability** is a goal for any software engineering project. We want to make sure that the solution we implement is consistent with the existing patterns in the codebase and is easy to maintain.

[Code complexity](https://www.codegrip.tech/productivity/a-simple-understanding-of-code-complexity) is a source of maintainability concern.

A more technically complex solution may be more robust but it also introduces more risk of bugs and crashes. A more technically complex solution may also be more expensive to maintain and scale.

There's non-recurring upfront cost to develope a solution and recurring cost to maintain and evolve the solution.

The recurring cost can often be higher than the upfront cost because the upfront cost is amortized over the lifetime of the product.

Engineering effort is required not only to implement the solution but also to maintain and evolve the solution over time. The more complex the solution, the more effort is required to maintain and evolve the solution.

One way to offset the upfront cost is to use a third-party solution. But this comes with the risk of vendor lock-in and the cost of integration.

To lower recurring cost, many code-bases use industry standards and have style guides to discourage deviations from existing patterns because inconsistencies in code-bases adds maintenance cost.

Another way to lower maintainability cost is to avoid duplication of code. Duplication is generally considered tech debt it makes the code-base hard to evolve (you have to make the same changes in multiple places), which could introduce inconsistency in the code-base and bugs.

However, [duplication is not always bad](https://xiaoyunyang.github.io/post/6-surprising-life-lessons-from-my-30s/#3-duplication-is-not-always-bad)! Sometimes it makes things simpler. As complexity can also be a source of maintainability concern. Sometimes it could be a good tradeoff to introduce a little bit of duplication for a lot of simplicity.

## Solution Approach

To make a the chat app offline-first, we need to find a way to manage a collection of ordered data (messages between two users) which can be added to the collection by the server or by the user. Server-added messages come from an API request or a WebSocket event. Client-added messages come from user sending a message.

We can think of the offline-first chat app as a collaborative editing tool - two users are collaborating on the same conversation thread. The conversation thread is a collection of messages ordered by the time they were created.

This insight provides a clear direction for our problem-solving because it helps us identify and tackle the sub-problems in collaborative editing systems using established design patterns.

### Sub-problem 1: Source of Truth

Offline-mode support is unachievable if we don't keep a local copy of the data that the client can operate on while offline.

Replication is a fundamental idea in collaborative editing systems. The basic idea is that we let the server maintain the source of truth for the conversation thread and we make a copy of that conversation thread (replica) on each client.

Each client operates on their own replica of based on events from the server or the user but only the server is allowed to make updates to the source of truth.

The clients collaborate on making changes to the source of truth by sending update requests to the server and syncing server states with their respective replica state.

Does the source of truth need to exist on the server? Not necessarily. In decentralized systems where there is no single authority to determine the final state that every client needs to be on. All replicas can reach [eventual consistency](https://en.wikipedia.org/wiki/Eventual_consistency) using [techniques which are widely deployed in distributed systems](https://martinfowler.com/eaaDev/EventSourcing.html) like massive multiplayer online games and peer-to-peer applications. It would be interesting to see how [distributed computing](https://en.wikipedia.org/wiki/Distributed_computing) techniques can be applied to web applications so that our data is not owned by a centralized authority like OkCupid (the premise of the [Web 3 movement](https://cointelegraph.com/blockchain-for-beginners/what-is-web-3-0-a-beginners-guide-to-the-decentralized-internet-of-the-future)).

But in our Web 2 world, we have a server that is the gate-keeper for communications between two users as we see in this example.

{{< image classes="fancybox fig-100 clear" src="/post/images/offline-first-chat-app/crdt-general-idea.png" thumbnail="/post/images/offline-first-chat-app/crdt-general-idea.png" title="All the players in the collaborative editing system">}}

When Alice and Bob first open their chat app, their replicas are populated by the source of truth from the server via an API request. A WebSocket connection is also established between their clients and the OkCupid server to stream any updates to the source of truth.

Alice and Bob can make changes (mutations) to the source of truth in these ways:

1. Send (Re-send) a message
2. React to a message
3. Send a read receipt

{{< image classes="fancybox fig-100 clear" src="/post/images/offline-first-chat-app/chat-app-in-action-multiplayer.png" thumbnail="/post/images/offline-first-chat-app/chat-app-in-action-multiplayer.png" title="OkCupid chat app in action (multiplayer view)">}}

Next, we will look at how we keep the replicas in sync with the source of truth when mutations are applies.

### Sub-problem 2: Consistency Maintenance

In our chat app system, we have two replicas of the conversation thread on Alice and Bob's devices. We would like to keep the replicas in sync with each other. In a chat app, you can't really have a conversation when your replica is showing a different chat history than your conversation partner's replica.

The replicas can become out of sync when Alice and Bob are proposing changes to the conversation thread (e.g., adding a new message to the thread or reacting to a message).

Suppose Alice wants to send Bob a message `M1`, Alice makes a request to the server to update the source of truth after applying the change optimistically to her replica. Meanwhile, Bob is drafting a message `M2` to Alice and sends it shortly after Alice sends `M1`.

In a perfect zero-latency world, Alice and Bob will get each other's messages instantaneously and their replicas will always be in sync.

{{< image classes="fancybox fig-100 clear" src="/post/images/offline-first-chat-app/consistency-zero-latency.png" thumbnail="/post/images/offline-first-chat-app/consistency-zero-latency.png" title="Zero-latency Collaborative Editing">}}

In the real world, server and network latencies both contribute to the order in which mutation requests are processed and broadcasted, which affects what Alice and Bob eventually see in their steady state replicas after all the messages are done being sent and received.

For instance, when the server receives the request from Alice, it needs to do some work which takes time. Maybe it runs some expensive checks on the incoming message for inappropriate content before it adds the message to the database (which also takes time) and broadcasts that mutation to Bob. You can implement timeouts in the server-client contract to provide some guarantee that the mutation will be successfully processed in a given window of time but there is still some variability in the server latency.

This variability is a potential source of non-determinism and divergence (inconsistency) in the replicas.

{{< image classes="fancybox fig-100 clear" src="/post/images/offline-first-chat-app/consistency-server-latency.png" thumbnail="/post/images/offline-first-chat-app/consistency-server-latency.png" title="Collaborative Editing with Server Latency">}}

We also have to worry about network latency. As illustrated by the sloped lines in the figure below, it takes some time for request to travel from Alice's and Bob's devices to the server and from the mutation event to travel from the server to Alice and Bob through the WebSocket connection.

Look what happens when Bob is on a really slow network.

{{< image classes="fancybox fig-100 clear" src="/post/images/offline-first-chat-app/consistency-network-latency-1.png" thumbnail="/post/images/offline-first-chat-app/consistency-network-latency-1.png" title="Collaborative Editing with Network Latency">}}

But there can be another configuration for the latencies stackup where the server will process Bob's request before Alice's request.

{{< image classes="fancybox fig-100 clear" src="/post/images/offline-first-chat-app/consistency-network-latency-2.png" thumbnail="/post/images/offline-first-chat-app/consistency-network-latency-2.png" title="Collaborative Editing with Network Latency if timestamp is created at server">}}

In all these non-ideal real world cases, all the latencies in the system cause the replicas to diverge. In the modern era of multi-tiered network abstractions (NAT WiFi, VPN, cloud computing, Docker, etc.), trying to make predictions about how the different latencies will stack up is an exercise in futility. The final states of all the copies will be non-deterministic unless we implement some policy for reconciling the differences between these copies.

TODO: overview about different reconciling policies

In our example, we see a divergence in the order of `M1` and `M2` at the different replica sites and the server. Because we designate the server as the keeper of truth, the server version of the messages is a key component in our reconciliation strategy. However, we need to first address the non-determinism in the order of the messages that exists server-side.

The invariant for our collection is that messages are always ordered by the time they were created. This needs to be true for all copies of the data (replicas and sources of truth).

_But there can be different interpretations for "time of creation"._ Is it the time when Alice sends `M1`? Or is it the time when the server adds `M1` to the database? What does "time of creation" for `M1` mean to Bob?

If we were to make the "time of creation" be the time when the server adds the message, we would introduce more entropy into the system as we see in the last example where the server version of the message order is influenced by network latency.

We can remove non-determinism in the server version of the messages order by forcing the server to recognize the "time to creation" for a message to be the time at which the client sends the mutation request to the server. This way, the "time of creation" as recognize by the server is consistent with the "time of creation" for the client (Recall when the client sends a message, it also adds the message optimistically to the replica).

Now we have established that the timestamp is the basis for the _real_ order of the messages and is consistent between the sender and the server, what about for the receiver?

TODO: in the messages cache implementation, need to update the timestamp of message that will be re-sent to reflect the retry send time rather than the time of the last send attempt.

### Sub-problem 3: Conflict Resolution (Or Avoidance?)

Each client's replica is modified by local action and remote updates. Conflict arises when the locally updated data disagrees with the data upstream.

Let's revisit the example when Alice and Bob are messaging each other.

When Alice sends `M1` to Bob, that mutation is propagated to Bob via a WebSocket event. You can think of the WebSocket event as a broadcast the server makes to all the clients that are subscribed to changes to the conversation thread. The server doesn't care who is on the receiving end of the broadcast. It announces to every participant of the conversation that something has changed and each participant needs to decide what to do with that information.

{{< image classes="fancybox fig-100 clear" src="/post/images/offline-first-chat-app/mutation-propagation-m1.png" thumbnail="/post/images/offline-first-chat-app/mutation-propagation-m1.png" title="Mutation Propagation of M1">}}

When Bob receives the WebSocket event, he needs to add `M1` to his replica because he doesn't have that message already. There are some nuances with how he should add the message to his replica which we'll get to that in the next section.

But let's first focus on Alice. When Alice receives this event, she can do one of two things:

1. Ignore the event or
2. Process the event by making some changes to her replica without causing a conflict.

If she chooses to process the event, what kind of conflict would arise if she were to add `M1` to her replica?

Because Alice was the one who sent `M1`, she already added that message optimistically to her replica. Adding it again would cause duplication, which is a type of conflict. She can update her replica version of `M1` to reflect the server version. In particular, the server version differs from her replica version in an important way: the message `id` is different.

The `id` is an important part of the message identity as it assigns uniqueness to each message in the replica collection. The `id` can be used to look up a particular message in the replica which supports various business logic. The `id` is also an important part of the view creation logic as it is used as the `key` in the React render function that maps an array of messages to JSX.

Optimistic UI design works by simulating the result before the server responds. When Alice adds a message optimistically to her replica, she can simulate almost everything in the result except the `id` because that is decided when the server adds `M1` to the database. But she needs to pick something for the `id` before she can add the optimistic message to her replica.

OkCupid's chat app implementation uses a pseudo-random generator to create a unique `id` for the optimistic message before adding it to the replica (let's call this `tempId`).

```js
function generateTemporaryMessageId() {
  return `${Math.round(Math.random() * 10000)}`;
}
```

The `tempId` looks something like `4306` while the real `id` looks something like `18325309058943693999`.

If Alice gets an event announcing that a message with the `id` = `18325309058943693999` has been added to the conversation and if she decides to process this event, she will need to update the associated message in her replica to add the real (server-assigned) `id` for the message. But how does she know which of the optimistically-added messages in her replica to update?

We are venturing into dangerous territories when the clients are in the business of reasoning about the provenance of data in its local copy. This could introduce a leaky abstraction problem wherein the client needs to know the implementation details of the server (e.g., how an `id` is picked), which can cause the system to be fragile and error-prone.

But we must address this conflict and be able to distinguish what's real and what's optimistic in our replica because the replica data is used for business logic and drives the view. Simply ignoring the server-generated `id` and only use `tempId` would cause problems when we need to make another mutation to the message (e.g., marking the message as read which requires updating a property on the message in the replica). Replacing the `tempId` with the server-generated `id` will also cause problems because the message `id` is used as `key` by React to render the message. If we simply replace the `tempId` with the server-generated `id`, we are going to experience a very noticeable flicker where React will unmount the optimistically added message and mount the server-added messaged.

{{< image classes="fancybox fig-50 clear" src="/post/images/offline-first-chat-app/flicker.gif" thumbnail="/post/images/offline-first-chat-app/flicker.gif" title="flickering from lack of conflict resolution on the id">}}

In our conflict resolution policy, we must keep both server-generated `id` and `tempId`.

Conflict resolution is a big topic in multiplayer functionalities implementation approaches for collaborative editing tools. [Operational Transformation](https://en.wikipedia.org/wiki/Operational_transformation) (implemented by Google Docs) and [Conflict-free Replicated Data Types](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) (CRDT) are the two main classes for conflict resolution strategies.

Which conflict resolution strategy to use depends on the specific usage patterns for our application. Answering these questions a provided good starting point to narrow our technology selection for the chat app:

- What is the nature of the data that is being collaborated on?
- Does it need to be real-time?
- What kind of mutations are supported?

Operational transform implemented by Google Docs is overkill for our chat app use case. For a two-player chat app, we don't need to worry about the case where two people are editing the same message property (e.g., body, reaction, read time) at the same time because that's not a valid use case. OkCupid's chat app does not even allow users to update the body of a sent message.

If the chat app supports more than two players, then we need to implement conflict resolution for reactions and read times on a message. While that's a future use case we don't have to address now, it's worthwhile to make our solution design general enough to support an arbitrary number of multi-players to it can be easily scaled for that future use case (which we identified earlier as a likely future use case).

A CRDT is an excellent choice for our problem because the data we are managing is a list of items.

With CRDT, we get conflict resolution for free because a CRDT is a data structure that automatically resolves any inconsistencies that might occur during updates. The replicas are kept in CRDT and can be updated independently and concurrently without coordination with other replicas or the server. A final property of CRDT is eventual consistency, which will look at a little later.

CRDT is a relatively new concept formalized in 2011 and popularized by collaboration tools like [Notion](https://www.notion.so/blog/data-model-behind-notion) and [Figma](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)

There are [various CRDTs to choose from](https://hal.inria.fr/inria-00555588/document). Notion and Figma both created their own CRDTs which target the specific problems they are solving. We will do the same for OkCupid's chat app.

### Sub-problem 4: Eventual Consistency

Replicas can become out-of-sync with each other during the collaborative editing session but we need to guarantee that the states kept in the replica will eventually converge.

To better visualize the problem of divergence, let's look at the following scenario:

- At t = `T0`, Alice goes offline
- At t = `T1`, Alice tried to send a messages `M1` (send fails)
- At t = `T2`, Bob sends `M2`
- At t = `T3`, Alice goes online again. WebSocket is re-established
- At t = `T4`, Alice sends `M4`
- At t = `T5`, Bob send `M5`
- At t = `T6`, Alice re-sends `M1`

What Alice sees at t = `T6`:

```
M4
M5
M1
```

What Bob sees at t = `T6`:

```
M2
M4
M5
M1
```

What Bob sees is consistent with what the server sees at `T6` but there's a divergence (inconsistency) between Alice's chat history and Bob's chat history. This is because when Alice comes back online at `T3`, Alice's client does not downloads a fresh copy of the chat history from the server. It only syncs the messages sent after a new WebSocket connection is established.

We avoid the need to solve the conflict resolution problem by keeping the client version after network connection is established again and not forcing it to be consistent with the server version. As there's no polling, the only server-driven update to the client replica is from WebSocket event.

The OkCupid chat app lets you go offline for an arbitrary amount of time and continue sending new messages. However, when you are online again, it doesn't automatically download all the messages sent to you when you were offline and re-apply your offline edits on top of the latest state.

Choosing an appropriate final state when concurrent updates have occurred is called reconciliation and can be quite tricky to implement.

For instance, there's a downside to simply syncing the replicas with the server state when the system reaches steady state: It can violate the invariant for our collection wherein messages are always ordered by the time they were created. This has some usability implications as it can create a jarring user experience to see the messages in the chat history suddenly change order.

[optimistic replication](https://en.wikipedia.org/wiki/Optimistic_replication) allows replicas to diverge. Replicas will reach [eventual consistency](https://en.wikipedia.org/wiki/Eventual_consistency) next time Alice and Bob syncs their replicas with the server state, which only happens when they refresh their chat apps (reload the page).

This seems like kind of a cheat but convergence upon system quiescence is a common strategy to achieve eventual consistency. This relieves us from having to implement an explicit reconciliation policy for the replicas which could be unnecessarily complex for our problem space.

Avoiding reconciliation simplifies the implementation of our CDRT. The insufficient real-time support is a limitation of our approach but is good enough for OkCupid's use case because in a dating app, we don't expect people to be chatting simultaneously for a long period of time like they would in Slack.

But if you are building a real-time chat app where simultaneous communication is a common use case, you will need to implement offline detection / polling the latest server data and merge the server data into the replica.

### Sub-problem 5: Intention Preservation

All the strategies for implementing collaborative editing tools are guided by a set of principles depending on which consistency model is used.

For the implementation of OkCupid's chat app, the [CCI consistency model](https://www.cs.cityu.edu.hk/~jia/research/reduce98.pdf) was considered. It includes these three properties:

**Causality preservation**

> ensures the execution order of causally dependent operations be the same as their natural cause-effect order during the process of collaboration.

**Convergence**

> ensures the replicated copies of the shared document be identical at all sites at quiescence (i.e., the final result at the end of a collaborative editing session is consistent across all replicas).

**Intention preservation**

> ensures that the effect of executing an operation at remote sites achieves the same effect as executing this operation at the local site at the time of its generation.

Causality preservation and convergence and are essential properties of any consistency model to ensure correctness of the system during and after a collaboration session.

What is a collaborating session in the context of a chat app?

That's when both Alice and Bob are online and actively participating in the conversation.

The causally dependent operations include optimistically adding the message with client-generated `tempId` to the replica, then when the server approves the mutation, replace the optimistic message by the real message with the server-assigned `id`, including a tombstone for what it was before when it was optimistically added (we will talk about this later in the implementation of the chat app CRDT).

While a serialization protocol can be used to achieve causality preservation, it cannot be used to achieve intention preservation. The reason is that the serialization protocol does not have access to the user's intention.

Intention preservation is an obvious goal in a chat app because the point of the chat app is to facilitate a conversation between two people where messages are created in response to other messages. The order of messages _as they appear at each replica site_ is important for the conversation to make sense.

Why we need intention preservation is best argued by considering a situation if we don't impose intention preservation:

Alice asks Bob a question and sees that the question is optimistically added to her replica of the chat history. In the meantime, Bob is typing up a response to another question Alice asked a day before. If Alice is on a really slow network, Bob will not see her new question come into his chat history until some time after he sends his reply to her old question. Bob's intent is for Alice (the remote site) to see the new message as a response to her old question but because of network latency, Bob's message will be mis-understood by Alice as a response to her new question. Intention is not preserved.

How do we prevent this misunderstanding? When Alice gets the event announcing that a message has been added to the conversation by Bob, rather than simply adding the message to the end of her chat history replica, she can perform some comparisons based on the message timestamps to insert the Bob's message in the right place in her chat history. This is possible because the real order of the messages is determined by the timestamp, which is created by the sender client at the time of creation (when the message is sent).

TODO: add this timestamp comparison logic to the messages cache implementation.

## The Data Model for OkCupid's Chat App

A CRDT is a data structure that can be replicated across multiple sites and can be updated concurrently at each site. It needs to satisfy these two properties:

An important assumption is nothing else get added to the cache between the time the temp message got added and the time the send mutation resolves

Re-parenting when the object's identity changes. We store a link to the parent as a property of the child. That way object identity is preserved. We have each parent store links to its child.

We ensure that when the message changes its identity from temporary to real, we update the CRDT in an atomic operation.

React will unmount the view optimistically-added message and add the actual message.

When the client wants to add a message to the thread, the update is always applied immediately to the replica since we want the chat experience to feel as responsive as possible. If the client gets another message from the server before the approval is received, we want the client to process that new message immediately as well.

1. Conflict-free
2.

The data structure is designed to be conflict-free which means that the data structure can be updated concurrently at each site without causing conflicts.

True CRDTs are commonly used in distributed systems where there is no single central authority. But in our case, we have a central authority - the server. The server is the source of truth for the conversation thread and what the final state should be.

An interesting observation here is

To achieve causality preservation, convergence, and intention preservation, we have to relax the requirement for convergence.

A very basic reconciliation strategy is when presented with two versions of the same data,

[Tombstone](<https://en.wikipedia.org/wiki/Tombstone_(data_store)>) is a concept in the replica of a distributed data store to provide a record for when a piece of data is deleted.

so she ignores this event.

Bob's replica is updated with the new message `M1` when he receives the WebSocket event.

This happens because the replicas keep optimistic messages.

Bob is made aware of the conflict when it gets an event

To satisfy our invariant and introduce the least friction in our user?

[CRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)

Consistency management is a big topic and there are implementations by Figma, Google Docs, and Quip. We will look at how we can implement a simple consistency management mechanism in our chat app.

We need to find a way to keep the replicas in sync with the source of truth.

In other words, we want to arrive at the same final state maintain consistency between all the copies of the conversation thread after .

When do the replicas become out-of-date with the source of truth and each other?

Consider this scenario:

There are two main technologies used for consistency maintenance and concurrency control: operational transformation (OT) and conflict-free replicated data type (CRDT).

But first, let's look at the problem of concurrency control in collaborative editing systems. At a high level, we need to worry about concurrency control whenever we deal with when multiple users are making changes to shared data at the same time.

Final state and reconciliation are the two main approaches to concurrency control in collaborative editing systems.

In our chat app, this means that Alice and Bob are both sending messages to each other at the same time.

Alice's replica is modified by local action and remote updates.

Technologies for supporting collaboration functionalities.

Next we will look at how to apply these mutations to the replicas and the source of truth and keeping the replicas in sync with the source of truth.

There are established patterns on how to implement multiplayer functionalities in collaborative editing systems that we can reference to build the chat app for OkCupid. this topic and we can learn from the experience of others.

, we can simplify the solution approach significantly because we only need to support communications for two users. Another simplification is that we don't need to support concurrent editing of the same message because the .

There are two techniques for maintaining consistency between multiple replica.

- [Operational transformation](https://en.wikipedia.org/wiki/Operational_transformation) is overkill because we don't need to support concurrent editing of the same message.

1. Distinguish which data exists locally and which data exists remotely

The replica drives the view!

The server streams the latest state of the source of truth to the clients via a WebSocket connection. Each client figures out how to reconcile the latest state of the source of truth with the local state of the client.

1. operation-based CRDT - replicas propagate states which are a list of operations that can be applied to the data to get the current state of the data. The data is not stored in the state but is derived from the operations.
2. state-based CRDT

This idea can be generalized to any kind of data that can be represented as a list of operations.

We can have implement complicated system to deal with conflicts but we can

The client needs to reconcile the two messages.
without the client needs to reconcile the two updates.

instead of waiting for the server approval
while we wait for acknowledgement from the server do this and we wait for the

When Bob receives the message from Alice, Bob's replica of the conversation thread is updated with the new message.

We don't update our replica until the server has approved the request to update the source of truth

### Sub-problem 4: How to handle responses to mutation requests?

When the server approves Alice's request, Alice updates the replica of the conversation thread with the server's response. If the server rejects Alice's request, Alice rolls back the optimistic update.

In concrete terms, we are building a collaborative

1. Source of truth
2. What's real?
3. Data structure

For the data structure for replicas need to satisfy these properties:

1. **Consistency** Conflict resolution, order preservation. Concurrent updates to multiple replicas of the same data, without coordination between the computers hosting the replicas, can result in inconsistencies between the replicas.
2. Memory usage and performance

Data storage location

1. Apollo Client Cache
2. Redux or some global state - don't need that
3. React component state

#### What's Real?

We solve this problem by adding a status indicator like `sending...`, `sent`, `failed to send` under the message. The status indicator tells the user if the message has been actually sent and processed by server, which implies that the conversation partner is able to see that message. This is a common pattern in chat apps, and it is also a common pattern in other apps that use optimistic UI design.

In this post, I will discuss how we added optimistic UI to the OkCupid Messenger. I will also discuss the tradeoffs we made in the design and implementation of this feature.

An important question is do you need optimistic UI? If you are building a chat app that only supports text messages, then you probably don't need it. However, if you are building a chat app that supports sending photos, then you probably do need it because the cost of creating a photo message to send is high client-side as client devices have to compress the file before creating the photo message object to send to the server. From a user’s perspective, it is expensive to provide a photo to send as it requires scrolling through files on the computer or photo library on the phone or taking a photo directly from the camera or scroll through.

Engineering effort is often spent on building out the backend of a system, and the frontend is often an afterthought. This is especially true for web applications, where the frontend is often a thin layer on top of a backend API.

It's easy to get caught up in the details of a system, and lose sight of the big picture. In this post, I'll discuss how we designed the frontend of OkCupid Messenger to be fast and responsive, even when the backend is slow or unavailable.

We looked at reference designs from other chat applications, and found that they were all too slow and unresponsive. We wanted to build a chat application that was fast and responsive, even when the backend was slow or unavailable.

user experience. In this post, I'll discuss one of the tradeoffs we made in the OkCupid Messenger product, and how we used it to improve the user experience.

maintainability and performance.

Development time. Code complexity. Ease of debugging. These are all factors that engineers consider when designing a system. But there’s another factor that’s often overlooked: user experience.

Product goals

- In cases like these, the value of acting early, or precomputating, is called into question by uncertainty about the future.
  Since the benefit of precomputation depends on a specific outcome of future events, it reflects a rather optimistic computation attitude with a confident outlook on the future.

Precomputing vs Lazy Evaluation

- Precomputing - benefit: efficient if you are optimistic about the future that the plan won’t change. Drawback - over-optimization. wasted effort if plans do change and your model for problem solving breakdown because the assumptions that underlie your solution approach changed

### Data Structure Choice

Operation-based CRDT. Each client update their replica then propagate the operation to the other client via the server.

A consistency criterion is that the collection of messages maintained in each replica must be ordered by the time they were created. This invariants is maintained by making the timestamp be client-generated rather than server-generated.

When the server gets around to adding the

When the server receives

timestamp for the message and sends the message to the server. The server does not change the timestamp.

for the message be the time when the message is created at the client rather than when the message is added by the server.

1. merging
2.

#### Preserving Order of Messages

Sending multiple messages in a row while offline: some may succeed and some may succeed. The request may get processed by the API in a different order than when the message gets created. We use reference designs like other chat apps to inform the design of our chat app.

The order of the messages has a direct impact on the chat experience because multiple users interact with the same dataset. If the other user responds to the most recent message in the chat but the most recent message is not the most recent in your chat, you may become very confused.

Does this change the message order?

```ts
messagesCacheRef.current.delete(tempId);
messagesCacheRef.current.set(realId, { message, tempId });
```

the temp one is deleted and the real one is added I think the real one gets put at the end instead of where the temp one was

-
- But that's not always a guarantee as you could get an instant event or a user generated message while the api request is pending on a slow network
- Is there a data structure that provides O(1) lookup based on the key and LIFO
- a separate array could be used to keep track of the id order, then the tempId gets swapped for the realID when it returns
- So the case we want to handle is this: suppose we have 3 events. (A) user sends message A. (B) message A send request resolves with success (C) user sends message B. The assumption is Event A is always immediately followed by Event B. However, there could be a case where Event C happens after Event A and before Event B. The question is what do we do in this edge case
- Our options are (1) keep the original order of message creation. So after send request resolves for message A, A still appears before B . (2) put message A after message B if the server resolves the send request for A after message B is added optimistically
- The current implementation supports option (2). To support option (1) another data structure or a complicated version of the Map needs to be used
- The downside of that is introducing another data structure splits the single source of truth into two sources of truth, which adds technical complexity of having to keep them synced and risks of bugs being introduced in the future when we want to update anything about the way we send messages (eg delete messages). Besides the added maintenance cost, there's also the added space and time complexity

- I guess the Map could be an array then so the message at an index could be modified, and I don't think time complexity is a concern here since we are dealing with tens to hundreds of messages (traversing over that list should be less than a ms anyways)
- It needs to be a map because we need quick lookup and update of the message based on the id when there's an instant event for message read or reaction or when you unblur an image (edited)
- Array doesn't provide any advantages over the map because we will only add a message to the end, never in the middle. We don't need to look up a message by its insertion order. We need to look up a message by its id
- I think it wouldn't make a difference map v array with the number of messages we are dealing with. using array.find or array.findIndex and then array[index] = updatedMessage wouldn't be significantly slower
- An array is basically an implementation of a Map in which the key is the index. We will never need to look up a message based on the order of its insertion
- but we only need to look up a message by its id when there is a tmpId replaced with a real id or an instant event?

- We need to look up a message by its id for  read message instant event, unblur photo message, and reaction
- We delete the temp message using its tempId when the send request resolves. Then we add the real message
- Performance wise O(1) lookup and O(N) lookup may not look different on a desktop, but this also needs to work for mobile web on cheap phones (edited)
- I don't think optimizing for performance here is a concern even on mw, maybe if we were dealing with millions of messages
- It's not just optimizing for performance. It's much easier to do a map.get, map.set, and map.delete than array.find by id, array find by index then remove that element at that index
- Even if you replace the map with the array, you still need the component state array to prevent app crash from hitting re-rendering limit
- what's the re-rendering limit?
- It's when you update a component state too much too fast and triggering a lot of deep rendering

- If we get rid of the ref and just update the component state directly, it's going to crash the app even for like 10 messages. That was the first thing I tried. That's why I put the source of truth in ref
- oh, then the array could be kept in a ref too
- I don't think either one is a big deal, as long as we are ok with the message order changing
- I tried that too but it doesn't always update when things change
- that's strange, I think the Map is a good solution
- Message order also changes in the iOS implementation

I'm just copying what iOS, iMessage, and all the other chat apps do already

The downside of option (1) is it may be a little jarring user experience to see the messages you are sending switching order

I argue that option 1 is acceptable for the following reasons: (1) it's an edge case that's unlikely to happen unless you are on a really really slow network or you can send a new message at super human speed. (2) the order in which all the messages appear in steady state (ie when all the api requests have resolved and user has stopped typing) reflects the actual order of the messages server-side so if you were to refresh the page, nothing would change. (3) other messaging apps like iMessage implements it this way too

I ran a quick experiment on iMessage. To simulate that case in which Event A , Event C, and Event B in that order, I sent two messages in offline mode. Event A = sending “1” in airplane mode. Event B = sending “2” in airplane mode. Event C =  retry sending “1” after turning data roaming back on. The send request resolves after Event C.

{{< image classes="fancybox fig-50 clear" src="/post/images/offline-first-chat-app/imessage-0.png" thumbnail="/post/images/offline-first-chat-app/imessage-0.png" title="initial state">}}

{{< image classes="fancybox fig-50 clear" src="/post/images/offline-first-chat-app/imessage-1.png" thumbnail="/post/images/offline-first-chat-app/imessage-1.png" title="initial state">}}

As depicted in the screenshots, the original order in which the messages were added optimistically was not kept

Based on the reasons above, my conclusion is the Map and the current implementation of the update operations to the Map is the most optimal and correct

### Caching System

Gotcha: Ordering of the resent message? It can be either. Go with what people are familiar with
Use Reference designs - iOS okcupid app, iMessage, WhatsApp, Facebook messenger.

Functional requirements - drives the regression testing

Need to respect the original insertion order
ID is created in the backend
Access pattern for individual message - read receipt
Optimistically updating the messages while not blocking users from creating new messages
Resend a message

I missed this - Pagination
Forgot to add this to the regression testing plan

Tradeoffs - what are we optimizing for? Finding the right balance depends on the engineering

Choosing the right place for caching

- Apollo client cache
- Component state
- Global state - Redux
  Choosing the right data structure and policy for updating it
- can be abstracted
- Options: array, map, object

Having multiple architectural patterns in the same codebase introduces cognitive complexity for the maintainers of the codebase.

Currently, the source of truth for messages come from Apollo Client Cache. On initial messenger load, all the messages from conversationThread get pushed into the Apollo Client Cache. When you send a message, a few things happen:

wrapping messages in something to also hold the metadata solves the optimistic sending

- A temporary message with a temporary Id gets created and added to the Apollo Client Cache.
- Send message mutation fires
- Mutation resolves with success, the temporary message in the cache gets replaced by the real message

Using Apollo Client Cache as the source of truth has a few disadvantages

- data in the cache has to conform to the server-defined schema which prevents us from adding metadata like tempId or sendStatus to distinguishing optimistically updated outgoing messages from the real ones coming from the server
- optimistically updated message cannot always mock all the required fields of the message such as the server generated message id. The consequence of that is the UI glitch after the message send mutation resolves where the optimistically added message unmounts and the server message mounts because the id, which is used as the key changed.

We need a different place to store our source of truth for messages. A message can fall into one of the three categories:

1. loaded from the server
2. sent from the client, optimistically updated, pending server resolution of the mutation
3. sent from the client, server resolved

Our datastore needs to include the option to add metadata about the messages to distinguish these different type of messages

There is an array of client-side datastore options to keep your data model:

1. Apollo client cache - for client state based on API data
2. React component state or ref - for client state that does not need to live beyond the lifecycle of the component
3. Redux or React Context - for client state that needs to be shared across multiple pages
4. Local storage - for client state that needs to persist across multiple sessions

We can eliminate options 3 and 4 because we are getting rid of redux and we don’t need to the client state to be shared across multiple pages. Messages only need to exist in the context of the messenger.

For reasons stated above, Apollo client cache is the most restrictive option for storing our data model because data in the cache has to conform to the server-defined schema which prevents us from implementing any sort of bookkeeping system using only the Apollo client cache.

So we are left with option 2 to keep our source of truth for messages.

#### Technical Complexity

#### 1. Time and Effort

These are business constraints.

Thus, it's important to understand the business context of what you are building to effectively develop a solid solution that is not over-engineered.

But on the mobile app versions, there’s usually no outbox or automatic resend. You have to manually trigger resend

#### 2. Adherence to Existing Patterns

**bias towards established patterns**
Popular chat apps like iMessage, Whatsapp, and Facebook Messenger all implement a desktop version that supports offline-mode. Many of these implementations rely on the concept of an outbox in which outgoing messages are queued if the device is offline. When the device is online again, the messages in the outbox can be sent out in batch or one-by-one in the order of creation.

Use reference designs.

Second,
For our codebase, we use component state, Apollo client cache for state management

#### 3. Regression

Are we upgrading something, not building something from scratch? It’s not a replacement, rather an improvement.

We need to not introduce regression
Don’t make too many sweeping changes unless it’s critical to the solution

Don’t implement cool features at the cost of creating new bugs

- How easily can we change the backend?
- how long we have to implement this?
- Simplifying assumptions we can make about the creation and update of the messages that it's managing.

With respect to persistence, design questions for the datastore

1. Where to store
2. How to update store
3.

Design approaches and limitations

Other design considerations

Reference designs:

-

First I identified all the existing functionalities of the chat app and create a plan to perform regression testing

Consideration

- regression testing
-
-

What new chat feature we want to add that the current chat app architecture cannot accommodate?

- retrying sending a message. Remembering the messages that didn’t get send and providing a UI to resend that
- Why? It’s expensive to create a photo

For a desktop app - don’t need offline support for many cases. Originally we did not support offline mode but as the chat app evolved, we need to now

It’s expensive to create a photo

<https://gist.github.com/sw-yx/108d90755aa3f34401dcb488c2f0f5aa>

feature-rich offline-first messenger

[offline-first](https://gist.github.com/sw-yx/108d90755aa3f34401dcb488c2f0f5aa)

tradeoffs of each tool and design pattern before using it. In this post, we'll explore the tradeoffs of using optimistic UI design patterns in a web application.

Failed to send, re-send a message seems like a table stakes feature for all chat apps, even desktop.
If we decide to remove the failed-to-send messages from the cache, it’s simpler from a technical perspective but worse from a user experience standpoint.

Prior to adding photo messaging support, the chat app on our website and mobile website did not support offline mode. This meant that when a user sent a message, the message would not appear in the chat until the server responded with a success message. This was a deliberate design decision, as it was easier to implement and less likely to cause bugs.

clearly partitioned and

Persisting the data locally enables local manipulation of data but (and subsequent syncing)

[This article](https://www.swyx.io/svelte-amplify-datastore) distinguishes

offline-first app - local storage and manipulation of data (and subsequent syncing)

Originally designed as a mailbox where real time update is not needed. People’s expectations of email apps do not include real time update although that has changed too with sophisticated email apps like gmail raising the bar of what people expect from a chat app

[offline-first apps](https://www.swyx.io/svelte-amplify-datastore)
Having an explicit data layer that controls syncing with the server allows us to implement offline-first apps. This means that the app can be used even when the user is offline, and the app will sync with the server when the user is online again.

### Steady State and Transient State

Transient state of the sent/(un)read indicator the indicator always show under the last sent message.

1. Initial state
   {{< image classes="fancybox fig-50 clear" src="/post/images/offline-first-chat-app/indicator-0.png" thumbnail="/post/images/offline-first-chat-app/indicator-0.png" title="initial state">}}

2. Press resend on "5":

   {{< image classes="fancybox fig-50 clear" src="/post/images/offline-first-chat-app/indicator-1.png" thumbnail="/post/images/offline-first-chat-app/indicator-1.png" title="Press resend on 5">}}

3. Target user reads "5" - read receipt processed correctly and indicator shown in the correct place.

   {{< image classes="fancybox fig-50 clear" src="/post/images/offline-first-chat-app/indicator-1.png" thumbnail="/post/images/offline-first-chat-app/indicator-2.png" title="conversation partner reads 5">}}

## Update policy

For updating the data layer we need to consider...

Although this was acceptable for sending simple messages in which the network delay did not result in any noticeable UI update delay, the delay in response is very noticeable for photo messages because sending a photo message is a significantly more expensive operation in the backend and API layer.

## It Works! What Could Have Been Done Better

## Messages Cache vs Messages State

`messagesCacheRef` and `messages` state

- [https://felixgerschau.com/useref-react-hooks/](https://felixgerschau.com/useref-react-hooks/)
- [https://www.smashingmagazine.com/2020/11/react-useref-hook/](https://www.smashingmagazine.com/2020/11/react-useref-hook/)
  - In React, there are two rendering mechanisms, *shallow* and *deep* rendering. Shallow rendering affects just the component and not the children, while deep rendering affects the component itself and all of its children.
  - Deep re-rendering is used when an update is carried out on a state using the `useState` hook or an update to the component’s props.
  - **FORCING A DEEP RE-RENDER FOR `useRef` UPDATE**
    - Copy the value into a component state and conditionally update the state when there’s an event
-

- In `MainWindowWrapper` (the top level component for the messenger), we add a `messagesCacheRef`. This data structure maintains the source of truth for the local version of all the messages, which include the outgoing message that has not been sent successfully yet.
- `messagesCacheRef` feeds data to to the `messages` component state which drives deep re-rendering of child components.
- `messagesCacheRef` stores a `Map`. This is the shape of that data structure:

  ```tsx
  interface MessageWithMetadata {
    message: Message;
    sendStatus?: SendStatus;
    tempId?: string;
  }
  type MessagesFromCache = Map<string, MessageWithMetadata>;

  const messagesCacheRef = useRef<MessagesFromCache>(new Map());
  ```

  - `MessageWithMetadata` augments message from the server with metadata about the message (`sendStatus` and `tempId`).

- `messagesCacheRef` syncs with data from Apollo client cache in a `useEffect`. Apollo cache updates when (1) component first mounts, (2) a message is received via instant event, (3) a message is successfully sent
- `messagesCacheRef` provides data to the component state `messages` (also in `MainWindowWrapper`) for rendering the view. `messages` is updated conditionally in `useEffect` when the Apollo client cache updates and in success / failed message send callbacks.

### Why use `Map`?

`Map` is an efficient data structure to use for maintaining an ordered list.

`Map` provides the best of both worlds by offering a fast lookup and guarantees ordering based on the original insertion order. If we keep our collection in an array, it's an O(N) lookup, insertion, and deletion by `id`. If we keep our collection in a JavaScript object, the lookup/insertion/deletion operation is O(1) but JavaScript objects do not guarantee order.

### Why Use Both Ref and State?

In React, there are two rendering mechanisms, *shallow* and *deep* rendering. Shallow rendering affects just the component and not the children, while deep rendering affects the component itself and all of its children.

We do not want every change to `messagesCacheRef` to cause deep rendering because that will exceed the re-rendering limit in react and cause a crash. So we keep this in a ref.

We want to cause deep re-rendering when there’s an event that causes an update to `messagesCacheRef`. In these events, we expect the `messages` state to be updated to have the latest data from `messagesCacheRef`. The three events are

1. When apollo cache get updated
2. Send message success
3. Send message failed

## Important Note About the `id` of a message

- When the temp message is added to the cache, we make the `id` and the `tempId` the same client generated id
- When mutation resolves, this temp message is replaced with a real message which has `id` equal to the server generated id and the `tempId` equal to the client generated id.

We want to prohibit certain interactions when the message is optimistic because the message doesn’t exist on the server. We use the following helper function to guard any logic or api calls which requires the `id` to be the real server-generated `id`

```tsx
const isOptimisticMessage = tempId === id;
```

Currently in the `Message` component, real message Id is required in two places

- PhotoMessage
- Reactions

Although currently you can only interact with a PhotoMessage (unblur and report) and react to a message if the message is not from you (ie, always from the server, never optimistic), it’s possible that in the future we want to add the ability to react to your own message, which has a chance of being optimistic.

To make the messenger app more resilient against future regressions, I added the `isOptimisticMessage` check to prevent rendering of `ReactionsPrompt` and `ReactionsTray` if the message is optimistic. I didn’t do that for photo messages because message Id is only required to unblur and report and the product will never change for sender to unblur or report their own photo messages.

## Resending

Allow a failed message to be resent. The input for the send mutation is created from the optimistically added message from the client messages cache which we added in a previous PR CE-548 Better Cache for Messages #6252. sendStatus, which is part of the metadata associated with each message entry in the client cache, is used to determine whether to render the retry CTA under a message. sendStatus is only available for messages which are created client-side and don't exist server-side. Thus only two sendStatuses - FAILED and SENDING - are defined.

# Contract with GraphQL

# Conflict Resolution

```ts
// The source of truth for the local version of all the messages, which include the outgoing message
// that has not been sent successfully yet.
const messagesCacheRef = useRef<MessagesFromCache>(new Map());

// messagesCacheRef feeds data to to the messages component state which drives deep re-rendering.
const [messages, setMessages] = useState<LegacyMessage[]>([]);
```

```ts
// We pass the lambda. The point of this function is to make sure
// messages state is always updated following an update to messagesCache
// Whenever this function is called, re-rendering should follow.
const updateMessagesCache = useCallback(
  (updateMessageCacheRef: () => void) => {
    updateMessageCacheRef();
    setMessages(getLegacyMessages(messagesCacheRef.current));
  },
  [setMessages]
);
```

```ts
const [messagesCacheLoaded, setMessagesCacheLoaded] = useState(false);
```

```ts
useEffect(() => {
  if (loading || !conversationThread) return;

  if (!messagesCacheLoaded) {
    setMessagesCacheLoaded(true);
  }

  // This keeps messagesCache up-to-date with conversationThread
  updateMessagesCache(() => {
    if (!conversationThread.messages) return;

    // For every message in conversationThread, copy it into the new map
    // If the message exists in the old map, merge the data from the cache message with the
    // thread message
    const newCache = new Map();
    conversationThread.messages.forEach((message) => {
      if (messagesCacheRef.current.has(message.id)) {
        // Cache entry contains message + metadata about the message
        const currentCacheEntry = messagesCacheRef.current.get(message.id);
        newCache.set(message.id, {
          ...currentCacheEntry,
          message,
        });
      } else {
        newCache.set(message.id, { message });
      }
      messagesCacheRef.current = newCache;
    });
  });
}, [conversationThread, loading, messagesCacheLoaded, updateMessagesCache]);
```

```ts
const sendMessageSuccess = ({
  tempId,
  realId,
}: {
  tempId: string;
  realId: string;
}) => {
  // create new entry for real message
  const message = messagesCacheRef.current.get(tempId)?.message;

  if (!message) return;

  // delete optimistic message and add real message
  // we do not want to cause any re-rendering at this point.
  // Therefore, we don't update the messages component state here
  messagesCacheRef.current.delete(tempId);
  messagesCacheRef.current.set(realId, { message, tempId });
};
```

```ts
const sendMessageFailed = ({ tempId }: { tempId: string }) => {
  const message = messagesCacheRef.current.get(tempId)?.message;
  if (!message) return;

  updateMessagesCache(() => {
    messagesCacheRef.current.set(tempId, {
      message,
      sendStatus: SendStatus.FAILED,
    });
  });
};
```

```ts
const sendMessageCaller = useCallback(
  (
    {
      gifResult,
      photoPreview,
    }: {
      photoPreview?: string;
      gifResult?: GifResult;
    } = { gifResult: undefined, photoPreview: undefined }
  ) => {
    const senderId = getMyId();
    if (!conversationThread || !senderId) return;
    const tempId = generateTemporaryMessageId();

    const outgoingMessageContent = getOutgoingMessageContent({
      draft,
      gifResult,
      photoPreview,
    });
    if (!outgoingMessageContent) return;

    // create entry for optimistic message
    const tempMessage = getTempMessage({
      senderId,
      content: outgoingMessageContent,
      threadId: conversationThread.id,
      id: tempId,
    });

    updateMessagesCache(() => {
      messagesCacheRef.current.set(tempId, { message: tempMessage, tempId });
    });

    sendMessage({ tempId, content: outgoingMessageContent });
  },
  [sendMessage, conversationThread, draft, updateMessagesCache]
);

const resendMessage = useCallback(
  (id: string) => {
    const messageWithMeta = messagesCacheRef.current.get(id);
    if (!messageWithMeta) return;
    const { message } = messageWithMeta;

    const outgoingMessageContent = getOutgoingMessageContentForResendMessage({
      message,
    });

    updateMessagesCache(() => {
      messagesCacheRef.current.set(id, {
        message,
        sendStatus: SendStatus.SENDING,
      });
    });

    sendMessage({ tempId: id, content: outgoingMessageContent });
  },
  [updateMessagesCache, sendMessage]
);
```

```ts
const { conversationThread, refetch, fetchMore, loading } =
  useConversationThread({
    targetId,
    setError: setConversationThreadError,
  });

useEffect(() => {
  if (loading || !conversationThread) return;

  if (!messagesCacheLoaded) {
    setMessagesCacheLoaded(true);
  }

  // This keeps messagesCache up-to-date with conversationThread
  updateMessagesCache(() => {
    if (!conversationThread.messages) return;

    // For every message in conversationThread, copy it into the new map
    // If the message exists in the old map, merge the data from the cache message with the
    // thread message
    const newCache = new Map();
    conversationThread.messages.forEach((message) => {
      if (messagesCacheRef.current.has(message.id)) {
        // Cache entry contains message + metadata about the message
        const currentCacheEntry = messagesCacheRef.current.get(message.id);
        newCache.set(message.id, {
          ...currentCacheEntry,
          message,
        });
      } else {
        newCache.set(message.id, { message });
      }
      messagesCacheRef.current = newCache;
    });
  });
}, [conversationThread, loading, messagesCacheLoaded, updateMessagesCache]);
```

```ts
if (!conversationToShow || !messagesCacheLoaded) {
  return <MainWindowSkeleton isOpen={isOpen} animatedStyle={animatedStyle} />;
}
return (
  <MainWindow
    {...conversationToShow}
    refetchConversation={refetch}
    resendMessage={resendMessage}
    messages={messages}
    loadMessages={loadMessages}
    sendMessage={sendMessageCaller}
    loadingMessages={loading}
  />
);
```

# Why Offline-first Chat App is complex

Dmitry’s Rant

- Yeah, if you have your current data store of msgs, and you have your new one with extra data, any actions that remove data from the original data store would have to also remove it from the new one. And chances are, if you do it sequentially and something fails in the middle of the process, you end up with things getting out of sync. Obviously you can implement cleanup processes that remove orphaned data, but, that would be more complexity. Then you would also need to add logic for accessing this new data store / dealing with data existing in the old one and not the new one (if you don't need extra / new data) or if the data exists in both, then you need to do atomic creation (or deal with things created partially). Edits could also cause issues if you have data dependency between the two data stores but updates not atomic. For example if the new data store has a msg status, but the msg gets created first in the primary data store, you could end up with and unknown msg status (because the second data store has not yet been updated?)
- Also also, that would bypass the data model anyway, so, not like you get extra clarity / readability there. You would need to either know about it existing / limitations with how to access data there (not atomic updates?) or you risk just a different set of issues / bugs later on. Or you would need to implement a wrapper layer to handle access of the data / hide the fact that the data model is split.
- obviously you can work around all of those issues, but... if you can just add local only bits of data to the existing data store + accessor methods (or something, language thing), that would make things more readable / localized / not have a surprise side effects if you don't know about it. If you don't know about the extra fields... you just don't use them. If you don't know about the split data store, you may end up with out of sync data actually being used
- Or ask that team for a better solution that is not split data stores because of ^ reasons and not just overloading an existing field (your id thing) because they would be confusing when people forget why it's this way. Just because someone put in restrictions does not mean it cant change again? If there is a reason for it.

# Problem Overview

Out of the box, React applications **do not** come with an opinionated way of fetching or updating data from your components so developers end up building their own ways of fetching data. This usually means cobbling together component-based state and effect using React hooks, or using more general purpose state management libraries to store and provide asynchronous data throughout their apps.

- server state:
  - Is persisted remotely in a location you do not control or own
  - Requires asynchronous APIs for fetching and updating
  - Implies shared ownership and can be changed by other people without your knowledge
  - Can potentially become "out of date" in your applications if you're not careful

Keeping client state synchronized with server state!
Cobbling together component states?
Client directives - an option?
Why we want to keep client-only messages in the cache?

# Alternative

Server State v Client State

- server state:
  - Is persisted remotely in a location you do not control or own
  - Requires asynchronous APIs for fetching and updating
  - Implies shared ownership and can be changed by other people without your knowledge
  - Can potentially become "out of date" in your applications if you're not careful

## Apollo Client

Optimistic implementation of Apollo Client is inadequate for solving our problem because we need to update a collection.

- [https://dnlytras.com/blog/optimistic-updates/](https://dnlytras.com/blog/optimistic-updates/)
- [https://www.apollographql.com/blog/frontend/tutorial-graphql-mutations-optimistic-ui-and-store-updates-f7b6b66bf0e2/](https://www.apollographql.com/blog/frontend/tutorial-graphql-mutations-optimistic-ui-and-store-updates-f7b6b66bf0e2/)
  - Using tempId

Maybe good reads

- [https://uxplanet.org/optimistic-1000-34d9eefe4c05](https://uxplanet.org/optimistic-1000-34d9eefe4c05)
- [https://ably.com/blog/websockets-vs-sse](https://ably.com/blog/websockets-vs-sse)
- [https://dnlytras.com/blog/optimistic-updates/](https://dnlytras.com/blog/optimistic-updates/)
- [https://blog.logrocket.com/using-localstorage-react-hooks/](https://blog.logrocket.com/using-localstorage-react-hooks/)
- [https://azimi.io/es6-map-with-react-usestate-9175cd7b409b](https://azimi.io/es6-map-with-react-usestate-9175cd7b409b)
- [https://howtodoinjava.com/typescript/maps/](https://howtodoinjava.com/typescript/maps/)
- [https://hackinbits.com/articles/how-to-iterate-a-map-in-javascript---map-part-2](https://hackinbits.com/articles/how-to-iterate-a-map-in-javascript---map-part-2)
- [https://howtodoinjava.com/typescript/maps/](https://howtodoinjava.com/typescript/maps/)
- [https://medium.com/guidesmiths-dev/anatomy-of-a-react-application-optimistic-updates-e4a3318665c7](https://medium.com/guidesmiths-dev/anatomy-of-a-react-application-optimistic-updates-e4a3318665c7)
- [https://alexsidorenko.com/blog/react-list-rerender/](https://alexsidorenko.com/blog/react-list-rerender/)

Nick’s article

- [https://tech.okcupid.com/okcupid-blog-why-we-decided-against-graphql-for-local-state-management-a45ba442a0a6](https://tech.okcupid.com/okcupid-blog-why-we-decided-against-graphql-for-local-state-management-a45ba442a0a6)
- Don’t use GraphQL for local state management. Optimistic result is local state. Don’t put it in Apollo Client Cache

Post mutation update

- the mutation already returns all the information we need to incorporate the new item into the list.
- What if it doesn’t?
- need to update the store based on an action on the client
- `useRef` causes shallow rendering. We want to force a deep re-render for `usRef` update (read-receipt)
  - [https://www.smashingmagazine.com/2020/11/react-useref-hook/](https://www.smashingmagazine.com/2020/11/react-useref-hook/)

Updating the store after a mutation is a common use-case. Apollo Client provides the `update` property in `mutate`

Apollo manages both the store and the network requests so Apollo Client can simulate zero-latency server responses with Optimistic UI.

All you have to do to simulate a zero-latency server response is add the `optimisticResponse` property to your `mutate` call.

Apollo’s Hack

To let the user know when a channel has not yet been confirmed by the server, we’ll need to somehow add that information to the item. Instead of modifying the server schema to keep track of some client state, we’re going to use a little hack here to keep track of which items are optimistic.

We know that all server-generated ids are positive integers, but the optimistically “generated” ids are all negative — how lucky!

# Options

1. The `optimisticResponse` option on the mutate function.

Optimistic Mutation Property

[https://www.apollographql.com/docs/react/performance/optimistic-ui/](https://www.apollographql.com/docs/react/performance/optimistic-ui/)

The value of `optimisticResponse` is an object that matches the shape of the mutation response we expect from the server

However, the optimistic response is not an object

# Problem

Optimistic update using a temp Id challenges:

1. Message component re-renders because the key changed.

[https://tkdodo.eu/blog/react-query-render-optimizations](https://tkdodo.eu/blog/react-query-render-optimizations)

While the above code works well, it can get out of sync quite easily. What if we want to react to the *error*, too? Or we start to use the *isLoading* flag? We have to keep the *notifyOnChangeProps* list in sync with whichever fields we are actually using in our components. If we forget to do that, and we only observe the *data* property, but get an *error* that we also display, our component will not re-render and is thus outdated. This is especially troublesome if we hard-code this in our custom hook, because the hook does not know what the component will actually use:

1. Redux: Single source of truth
2. Apollo client cache - only server data
3. Where do we keep client data that may not exist server-side? It’s not some meta-data about the server data. It’s an important part of the server

## My Hacky Solution

👎 modifying the server schema to keep track of some client state

The `id` of the outgoing message encodes the send status:

- When sending

  ```tsx
  id: "9195:SENDING";
  ```

- Success

  ```tsx
  id: "9195:SUCCESS:14630231634420457673";
  ```

- Failed

  ```tsx
  "9195:FAILED:";
  ```

Why we want to append the actual message Id to the temp Id

- For processing read receipts on recently sent messages
- Let’s define recently sent messages as the messages that were sent after the last page refresh where all `conversationThread` messages were retrieved from the server

The storing of the message status in the id may work, but it seems like a misuse of the field and a potential source of bugs. With this approach we lose type safety, it creates a mismatch of the ids we get from the api and the ids on the client, and makes the id field not just an id (what is the limit to what we can store there?)

I think an approach with a better separation of concerns would be to store a map of { [messageId]: status } somewhere and read/update the status there. From my understanding of this PR this state is used to show UI updates when you send a message, so it is ok to use component state. But if you need to access the update function in different parts of the compoent tree this could be a good use case for react context like useSmsWall

```tsx
const [messageStatus, setMessageStatus] =
  useState < Record<string, MessageStatus>({});

const updateMessageStatus = useCallback(
  (messageId: string, status: MessageStatus) => {
    setMessageStatus((prev) => ({ ...prev, [messageId]: status }));
  },
  []
);
```

## Apollo Client Reactive Variables

- Apollo Client [reactive variables](https://www.apollographql.com/docs/react/local-state/reactive-variables) are great for representing local state:
- Your Apollo Client queries can include **local-only fields** that *aren't* defined in your GraphQL server's schema. Use the `@client` directive on the field to indicate it’s local-only
- The values for these fields are calculated locally using any logic you want, such as reading data from `localStorage`.
- a query can include both local-only fields *and* fields that are fetched from your GraphQL server.

[https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-read-function](https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-read-function)

[https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/](https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/)

[https://tech.okcupid.com/okcupid-blog-why-we-decided-against-graphql-for-local-state-management-a45ba442a0a6](https://tech.okcupid.com/okcupid-blog-why-we-decided-against-graphql-for-local-state-management-a45ba442a0a6)

This is an argument for why we should not have a split data model in the frontend (e.g., some of the data in apollo client cache, some in redux) because you have to keep everything in sync and write a custom merge policy outside of redux or apollo's merge policies.

If most of our main data comes from apollo cache, we should try to keep the entire data model in apollo cache even if some of those fields are initialized and managed by the client and not persisted server side.

`sendState` is not some temporary field that controls the UI state. It changes the meaning of the message in the data model and affects how we use that message (calculate nway etc)

- Client directive not reason we want
- Non-trivial to update code-gen
  Gap in how we think about state-management
  Optimistically updating still new paradigm

# 3rd Approach

View components are protected from complexities of the message being temporary, client-only, or server-driven.

Technique

Apollo Cache should only contain 2 types of data: (1) server-generated OR (2) client-generated and server-approved data. What I mean by server-generated is it’s retrieved from the server via a query during the initial hydration of the client cache. Client-generated means it was created by the client by a mutation. When the mutation resolves with success and the cache is updated, then that piece of data becomes server-approved also.

# Dictionary Design

Dictionary mapping tempId to actual ID?

- Messy. Unmaintainable
- Introducing split data store and multiple sources of truth
- For every message in the apollo cache, do a dictionary look-up
- For every read receipt instant event we receive
  - Find the message in apollo cache using the id. If not found, look at every entry in the dictionary for a matching id
  - We can make a space / time tradeoff by adding another dictionary for faster lookup? More data-structures to maintain and keep in sync with the other dictionary and the apollo client cache data
  - Read receipt and sent indicator calculation depends on all the messages - only the most recent message that has a non-null `readTime` property and was successfully sent out in the client cache gets the read receipt

## Conclusion

In system design, engineers often have to make tradeoffs between managing software complexity and delivering value to our users. When the broader developer community comes out with a shiny new tool or design pattern, it's tempting to use it to solve every problem.
