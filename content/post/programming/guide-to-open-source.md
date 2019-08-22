---
title: "A Guide to Open Source"
date: 2019-08-21
draft: true
categories:
  - project
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

Introduction to TypeScript and guide for how to migrate your project from Flow to TypeScript.

This post is a WIP.

<!--more-->
<!--toc-->

# Road to Open Sourcing

Hardest part is to decouple library logic with application logic.

This could take many steps. I did it in phases:

## Phase 1

Remove proprietary information

1. Modularize flowchart library
2. Update workflow mock data
    * Remove Smartling and Translation Verbiage from file names and mock data
3. Update name of repo to react-css-grid-flowchart
4. Add flowchart examples
    * TDD/CICD:  Add Test => Run Test => Make a change => Refactor
5. Support custom themes and CSS
    * For now, copying-pasting from https://github.com/Smartling/tms-dashboard-ui-components/tree/master/packages/lib/theme
6. Figure out type and subtype for WF steps and to what extent they should affect the library's logic
7. Write Algo for calculating WF Step Order (i.e., distance of node from source node)
    * If BE data already has WF Step Order, bypass the calc. Otherwise, perform the calc to generate the WorkflowVisData


## Phase 2

Reusable components

1. Make Config file for all the Icons mapping
2. Add context for workflowVis component. Context will include …?
3. workflowStepConfig
    1. Type -> { theme, dropdown menu options array }
    2. Node Type based on Config files
4. Create Config file where All the Smartling Components are passed down from the top level
    1. Popover
    2. Icons
        * Type vs Subtype
    3. Tooltip
    4. FontAwesome

## Phase 3

Add documentation

1. Two modes for the DataVis - (1) Display only. (2) Editable workflow
2. Example
3. API
    1. Example: https://github.com/One-com/react-truncate#api

## Modularize

## Import / Export modules

```javascript
import * as Utils from "./utils";
export * from "./messages";
export {
    Utils
}
```

To [export an imported module](https://stackoverflow.com/questions/34444909/export-an-imported-module)

```javascript
export * from "../path/to/module";
export { default as messages } from "./messages";
```

# Design

## colEntries

Array where each entry is a workflowStep

```js
{
    matrixEntry: "54c9fcff4f6a"
    tile: {
        displayWarning: undefined,
        id: "54c9fcff4f6a",
        name: "Published",
        nextNodes: [],
        nextSteps: [],
        nodeType: "PUBLISH",
        prevSteps: (3) [{…}, {…}, {…}],
        type: "PUBLISH",
        workflowStepOrder: 3,
        workflowUid: "aa26cdafbe6f",
    }
}
```

or

```js
{
    matrixEntry: "box|rightUpArrow|6,1"
    tile: {
        containerName: "connectorContainerBox",
        id: "box|rightUpArrow",
        name: "rightUpArrow",
        type: "diamond"
    }

}
```

## tile

* containerName: `connectorContainerBox`, `connectorContainerStandard`, `connectorContainerDiamond` determine the width of the column.
* id: e.g., `box|empty`, `standard|lineHoriz`
* name: `empty`, `lineHoriz`
* `type`: `NodeType`, "box", "standard" or "diamond". box, standard, and diamond are all connector types.

```js
{
    containerName: "connectorContainerBox"
    id: "box|empty"
    name: "empty"
    type: "box"
}
```

### Empty Tile

```js
{
    containerName: "connectorContainerStandard"
    id: "standard|arrowRight"
    name: "arrowRight"
    type: "standard"
}
```

### Diamond

```js
{
    containerName: "connectorContainerDiamond"
    id: "diamond|downRight"
    name: "downRight"
    type: "diamond"
}

```


| prop                            | type         | default | description                                                                               |
|---------------------------------|--------------|---------|-------------------------------------------------------------------------------------------|
| `children`                      | renderable   | `null`  | swipeable content                                                                         |
| `leftContent`                   | renderable   | `null`  | (optional) left content visible during pull action                                        |
| `rightContent`                  | renderable   | `null`  | (optional) right content visible during pull action                                       |
| `leftButtons`                   | renderable[] | `null`  | (optional) array of buttons, first being the innermost; ignored if `leftContent` present  |
| `rightButtons`                  | renderable[] | `null`  | (optional) array of buttons, first being the innermost; ignored if `rightContent` present |
| `leftActionActivationDistance`  | integer      | 125     | (optional) minimum swipe distance to activate left action                                 |
| `onLeftActionRelease`           | function     | `null`  | (optional) user has swiped beyond `leftActionActivationDistance` and released             |
| `rightActionActivationDistance` | integer      | 125     | (optional) minimum swipe distance to activate right action                                |
| `onRightActionRelease`          | function     | `null`  | (optional) user has swiped beyond `rightActionActivationDistance` and released            |
| `leftButtonWidth`               | integer      | 75      | (optional) resting visible peek of each left button after buttons are swiped open         |
| `rightButtonWidth`              | integer      | 75      | (optional) resting visible peek of each right button after buttons are swiped open        |
| `onRef`                         | function     | `null`  | (optional) receive swipeable component instance reference                                 |
| `onPanAnimatedValueRef`         | function     | `null`  | (optional) receive swipeable pan `Animated.ValueXY` reference for upstream animations     |
