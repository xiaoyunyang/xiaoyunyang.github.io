---
title: "Beyond Minimum Viable Product: A Lesson on Building Production-ready Software"
date: 2019-08-12
categories:
  - blog
tags:
  - JavaScript
  - TypeScript
  - Guide
  - Software Design
keywords:
  - programming
  - web development
  - typescript
  - javascript
  - guide
  - best practice
---

What I learned working at a mature startup that's building new things but also has a ton of customers and products in production. Product focused and quality focused. Off-shore team.

This post is a WIP.

<!--more-->
<!--toc-->

# Testing

This section discusses when to test, how much testing, and breadth and depth of the coverage.

- Test Driven Development (TDD)
- Write Good Unit Tests. How to test? What to test? Link to Jest article
- Testing in multiple browsers
- Testing on staging.
- Monitoring after deployment to Production
- CI/CD - triggers typecheck

## When to Write Tests

If it's hard to test, that means you didn't design your software well.

For things in production, ensure thorough test coverage. For greenfield projects, usually you don’t have good picture of what correct looks like, or it’s difficult to verify quantitatively. It's acceptable to iterate on the experimental code without tests at first. But once you are settled on the algorithm and design, you should turn your experimental code into production-ready code with a fews phases of refactoring and tests, depending on the complexity of the code.

*Tests hinders rapid prototyping. Once design is locked down, then add tests.*

As discussed in [this post about unit testing](https://xiaoyunyang.github.io/post/effective-unit-testing-of-react-components-with-jest-and-enzyme/), test driven development (TDD) requires that you write your tests before you write code. For projects that have a lot of uncertainties on design and implementation, we cannot implement true TDD. True TDD is implementable for projects that include extensive functional requirements which drive development. For instance, safety critcal software or software developed to meet specific contracts have functional requirements and product specification that specify exactly how the software should behave. Tests can be written based on these functional requirements.

Testing checklist

- correctness
- security
- performance
- stress testing
- internationalization
- usability / accessibility

## Unit Testing

```
// TODO: add discussion about Automated Testing vs. Manual Testing
```

## Regression Testing

```
// TODO: add discussion about Feature Parity
```

## Accessibility Testing

Resources:

- [IBM Accessibility Checklist](https://www.ibm.com/able/guidelines/ci162/accessibility_checklist.html)
- [WAI Standard](https://www.w3.org/WAI/standards-guidelines/wcag/)

Best practice for accessibility

- Can I use the entire page using only the keyboard but not the mouse?
- you should be able to Tab around the page and to go to every input and button on the page
- Protip: Document.activeElement - add a focus state on it.
- Tabbing through the page increments through the elements in the correct order
- Protip: use TabIndex = 0 or TabIndex = -1
- Pressing enter on a focused element should achieve the same result as clicking. ProTip: In addition to onClick, also add onKeyboard enter
- Don’t make spans buttons, use button for buttons. Use the correct HTML markup. That gives you accessibility out of the box. Use correct landmarks (eg, nav, aside, footer)
- Use Alt Text: Make sure your pencil icon has the correct alt text (alt text fulfills the same promise as what the icon represents). make altText  “edit”
- Esc key closes the modal
- Use automated test (1) chrome developer tool (Lighthouse) -Audit - accessibility checkbox, (2) Storybook Accessibility Tab, (3) accessibility eslint plugin: [eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y)

# After Deployment

Metric Tracking

- [New Relic](https://www.newrelic.com/)

Deployment

- [Launch Darkly](https://launchdarkly.com/) - feature flag and toggle management

# Refactoring

Good software design hides complexity with abstraction.

Every refactoring has the potential to break existing functionality. Make sure to write some tests before you start refactoring.

Whenever you are adding a new feature to a component and you find yourself copying-and-pasting a block of code from another component , that’s when you know you should add a method to your utilities class to share this block of code between the components.

Avoid pre-mature pptimization. Avoid writing throwaway code (tests for WIP code) Once your design approach and implementation is firmed up, add tests. Refactoring vs not refactoring. Some considerations:

```
// TODO: add list of considerations
```

## Cost of Refactoring

Specifically time and effort. You need to spend time and effort to reduce tech debt or to implement new features. Also, code reviews are more difficult. Risk of refactoring - Massive refactoring carries the risk of breaking existing functionality but unit tests and regression tests help to reduce that risk.

Cost of not refactoring is higher.

Software becomes harder to extend, understand, and maintain. Adding even the smallest change requires a ton of effort and QA. Cost of testing and QA go up. See [Lesson from 6 software rewrite stories](https://medium.com/@herbcaudill/lessons-from-6-software-rewrite-stories-635e4c8f7c22).

Refactoring code makes code more scalable => easier to add new features and make changes later.

Not refactoring also caries risks of code entropy. Increase tech debt. Codebase becomes difficult to work with - cannot retain and attract talent.

## How to Refactor

[Source Making](https://sourcemaking.com/refactoring) provides an excellent discussion on various bad code smells, how to recognize them, and strategies for getting rid of the [bad code smells](https://sourcemaking.com/refactoring). I highly recommend checking out Source Making's website as it provides an extensive list of code smells and refactoring techniques:


{{< image classes="fancybox fig-50" src="/post/images/programming/bad-code-smells/couplers.png"
thumbnail="/post/images/programming/bad-code-smells/couplers.png">}}
{{< image classes="fancybox fig-50" src="/post/images/programming/bad-code-smells/dispensables.png"
thumbnail="/post/images/programming/bad-code-smells/dispensables.png">}}
{{< image classes="fancybox fig-50" src="/post/images/programming/bad-code-smells/change-preventers.png" thumbnail="/post/images/programming/bad-code-smells/change-preventers.png">}}
{{< image classes="fancybox fig-50 clear" src="/post/images/programming/bad-code-smells/object-orientation-abusers.png"
thumbnail="/post/images/programming/bad-code-smells/object-orientation-abusers.png">}}
{{< image classes="fancybox fig-50" src="/post/images/programming/bad-code-smells/bloaters.png"
thumbnail="/post/images/programming/bad-code-smells/bloaters.png">}}
{{< image classes="fancybox fig-50 clear" src="/post/images/programming/bad-code-smells/composing-methods.png"
thumbnail="/post/images/programming/bad-code-smells/composing-methods.png">}}

### Simplifying Conditionals

- My code has a lot of if() statements right now, it calls out for a refactor
- how many if statements is the threshold for refactoring?
- also, are they nested if statements? If so, how many levels of nesting?

My favorite refactoring techniques:

- [Replace Nested Conditionals with Guard Clauses](https://sourcemaking.com/refactoring/replace-nested-conditional-with-guard-clauses)
- [Replace Conditional With Polymorphism](https://sourcemaking.com/refactoring/replace-conditional-with-polymorphism)
- Replace Conditionals with a dictionary. State machine: IsLoading....isSelecting...isBrowsing. we can map UI / representation to a state instead of having a lot of nested ternary operators in render
- Use Monad (e.g., `Promise`, `Maybe`, [Null Object](https://sourcemaking.com/refactoring/introduce-null-object)) avoids callback hell. Avoid callback hell - Make asynchronous behavior synchronous (React Hooks)

```javascript
// TODO: dictionary example
```

### DRY

The evils of boilerplate

- Hard to review
- Shotgun surgery needed to extend a feature
- Creates [Bloaters](https://sourcemaking.com/refactoring/smells/bloaters). In files that are over 1000 lines of code, lint stops working and editor becomes slow.

![code review](/post/images/programming/code-review.png)

Avoid boilerplate by

- Create abstractions
- Copy-paste programming is evil. Please create mocks, generator functions, higher order functions...whatever it takes to get rid of boilerplate.
- Don’t copy-paste.
- Create Mocks and import mocks in tests.
- Create generator functions. Create higher order functions.

## Documentation

### README

Make sure to have README.md for every repo. Make sure to include information like how to set the project up for local development.

### UML

### Self Documenting Code

Self Documenting Code possible with static typing.

We want to separate behavior from presentation so code is self documenting and easy to test. Use:

- react hooks
- state machine
- container components vs view components
- libraries

Naming variables to describe what they do/mean also constributes to self-documenting code.

# Component Libraries

DesignOps

- Design systems: UI
- design systems - UI kit. UIC. Typography, etc
- Goal: You want your users to have a consistent experience
- Benefits: better user experience. Help with recruiting. Easier onboarding. Increase efficiency. Easier design changes
- Components work well together. They have the same design principle under the hood.
- Palette (colors palette)
- Support theme

[Storybook](https://storybook.js.org/) lets you create a catalog of UI components.

## Use Open Source vs Roll Your Own

When you need a library, there are two options. You can

1. Find an existing library that accomplishes what you need, or
2. Write your own library.

In most cases, you should choose to adopt an open source library because it's (1) Already implemented and tested, (2) support from other users of the open source library (if it's a popular library).

If there a precedent for what you’re trying to do, don’t waste time rebuilding something someone else has built.

The cost of using the library code is low if the library is well built and maintained and has a lot of users and active contributions.

Using Open Source is great if you have simple need and is covered by the general use case. If you have special needs, adopting an open source library could be high. If your use case is not exactly the typical use case of the library code, you have to build adapters to  make your data model has to conform to the library's data model and decorators to extend the functionality of the library. In the worst case, you may have to fork the library if you can't get the maintainer of the library to make changes. 

Getting maintainers of the library to make a change can be a frustrating process. Fragmentation is dangerous for open source.

That said, you should consider writing your own library if

- You have a very clear vision of what you need and no existing open source libraries meet that need
- It's less costly to implement your own than to try to tweak the open source library
- You need full control over functionality and aesthetics
- You need a library Can iterate. Open source solutions could be too complex for your use case.

## Monorepo

Advantages of Monorepo: consistency. Good for UI library.
Use Lerna.

# Collaboration

Pull Request

- If you are submitting a breaking change, put “Breaking Change” in both title and body of the commit / PR
- Don’t address too many things in one commit. PR review will be painful if you have too many extraneous clean-up changes in your PR
- If you have PR that includes the absolutely necessary changes to implement the feature, followups from previous PRs, and a bug fix, the PR should include 3 commits so you can see those changes.

Use this PR Template. Simply add `pull-request-template.md` to the root of your repo.

```markdown
### Jira Issue

[Jira Link]()

### Notable changes

(add line annotations and or files)

### Screenshots (optional)

(provide visual feedback about what's changed)

### Cleanup

(mention any cleanup, like typescript types, renaming, etc)

### Test Plan

#### Special test cases

(e.g. Tested for plurals, CJK and RTL)

#### Manual Testing

(what might need to be tested that was difficult to capture with unit tests)

#### Regression Testing

(what existing functionality might break as a result of this change)

### Preview link (optional)

[Link on Staging]()

```

## Agile

New concepts:

- Velocity
- Sprints
- Story Points
- Tech Debt
- Backlog



Planning

- Agile - Weekly Sprints, Estimates. Backlog, Points
- Daily Standup, Task Breakdown, Dev Diary
- Agile, Scrum, Test Driven Development (TDD), Service Oriented Architecture and APIs (SOA)
- Continuous Deployment - multiple times a day
- Full test automation - we have no QA Team
- DevOps is not a team, it’s a culture

## Soft Skills

![Soft Skills Grading Sheet](/post/images/soft-skills-grading-sheet.png)