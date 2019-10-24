---
title: "Effective Unit Testing of React Components With Jest And Enzyme"
date: 2019-08-11
categories:
  - blog
tags:
  - JavaScript
  - Programming
  - Software Design
keywords:
  - jest
  - javascript
  - interview prep
  - programming
  - software design
  - guide
thumbnailImagePosition: left
thumbnailImage: https://images2.imgbox.com/22/c7/WQabWJ4U_o.png
---

The purpose of this article is to (1) provide a high level discussion of testing and (2) offer some practical examples and best practice for writing automated unit tests for React Application using Jest and Enzyme.

<!--more-->
<!--toc-->

# Testing Concepts

## Test Drive Development

Test Driven Development (TDD) is a software development methodology that requires that you write your tests before you write code.

In other words, the code you write is driven by the need to pass the tests, which should come directly from requirements.

In addition to increaseing confidence that code works as expected, TDD helps us to write better software that’s maintainable by helping to prevent future regression and bugs. Code maintainability is a natural consequence of TDD because code that is written to be testable are generally better designed (more modular), less complex, and better organized.

## Coverage

In most cases, it's impossible and/or infeasible to acheive 100% test coverage so you need to prioritize your test cases.

Prior to writing tests, we need a good big picture understanding of what the important requirements are. For example, image appear in the right place is not as important as image appearing at all. Functionality is more important than style in most cases.

There are a few things to consider before we start writing tests:

- Knowing how your piece of software fit into the system - mocks, stubs, spy, side effects
- Organization: come up with test cases. First break up what you want to test into categories. Then set up test cases in these categories.
- Practicality: can you test this at all? Give an example of code that’s not testable that has been refactored just so we could test it

## Types of Tests

### Blackbox testing vs. Whitebox testing

When we want to test a piece of software we wrote, we want to perform whitebox testing. Whitebox testing assumes knowledge of the innner workings of the code. For a React component, that includes testing:

- rendering from props
- event handler is called when button is clicked
- state is updated following an event

Sometimes our piece of software interacts with other pieces of software that we don’t control. Software interacts with each other via passing data to and from each other or calling each other. If our code uses a library or another component, we cannot perform whitebox testing of that component but we can test the interfaces between our component and the other component; for instance, making sure that particular input results in expected output.

### Unit Tests

Unit Tests test one piece of software in isolation. In Unit Testing, we are primarily concerned with answering the question

> Given some input, do we get correct output?

Unit testing is typically achieved with mocking dependencies and using frameworks like Jest, Mocha, Chai, Jasmine.

The type of code we should unit test includes

- complex algorithms
- utility functions
- class / react Component

### Integration Tests

When we make changes to a library, for example, we should perform integration testing locally before publishing the library. This means we want to check that the updated library still works in applications that use the library. Well designed libraries generally have an API that rarely changes, but when it does, that is when integration testing is most important.

### End-to-End Testing

End-to-end (e2e) testing ensures the flow of an application from beginning to finish is as expected and also checks its integration with external interfaces. Frameworks: [Puppeteer](https://github.com/GoogleChrome/puppeteer/), [Selenium](https://www.seleniumhq.org/)

### Regression Testing

Does the new feature break existing features? If you have automated testing set up, this would be done automatically.

### Automated vs Manual Testing

Some features (e.g., looks and feel of UX) may be too qualitative for automated test

### Stress Testing

Stress Testing - analyzing failure condition. Test failure cases. Making sure your software fails safely. For example, what you should get when you remove from an empty heap?

## Testing Techniques

This section goes into some best practice and techniques for testing a React application using Jest and Enzyme. It assumes the reader has some basic familiarity with these testing frameworks.

### Mocking

When we want to test one object, we replace other objects that interface with the object with mocks to simulate their behavior.

> Mocks imitate the behavior of other objects the object you want to test interfaces with.

A mock of other pieces of software is essentially data that we expect to get as input. For example, if we are writing a component in React to consume content from an API endpoint, we mock the API response by creating a file containing the JSON representing a response we’d expect to get from the endpoint.

We create mocks to support unit tests. For example

```javascript
const generateMockUser = (
  {
    userName = "janeDoe",
    firstName = "Jane",
    lastName = "Doe",
    email = "janeDoe@example.com"
  }
) => ({ userName, firstName, lastName, email})
```

Every argument in `generateMockUser` is optional with a default. This provides maximum flexibility for creating a customizable mock.

### Spying

A spy is essentially a mock function. A spy lets you spy on the behavior of a function that your software affects. The other function may be directly or indirectly called by your function. It’s clear what calling a function directly means but what do we mean by indirectly? For example, our function could emit and event and another function somewhere else observes that event and acts upon it.

If our function calls other functions, we want to test that the other functions are called under the right criteria with the right arguments. To do that, we spy on other functions.

# Testing Using Jest and Enzyme

For unit testing of React components, we are concerned about testing rendering and event handling. In summary, we want to check:

1. Child component is rendered with the right props.
2. Everything is rendered correctly on initial mount.
3. Changes to state or props results in the correct changes in what's rendered, as applicable.
4. State changes as expected when there's an event or a method call.
5. Functions external to the component (e.g, from props) are called with the right arguments when there's an event (e.g., mouse click) or a method call.

Below are some examples of unit testing using Jest and Enzyme.

## Setting up a test

```javascript
import EditProfileForm from "../feedbackForm";

// Child components
import Checkbox from "../checkbox";
import EmailInput from "../EmailInput";
import TextInput from "../TextInput";

// Mocks
import generateMockUser from "./mocks/mockUser";

const mockUser = generateMockUser({});

describe("EditProfileForm", () => {
      let props;
      let form;
      let submitSpy = jest.fn();

      beforeEach(() => {
        submitSpy = jest.fn();
        props = {
          ...mockUser,
          submit: submitSpy
        }
        form = shallow(<EditProfileForm {...props} />);
      });

      describe("render", () => {
        test("renders...", () => {

        });
        test("renders...", () => {

        });
      });
      describe("submit", () => {

      });
});
```

## Find

For testing that a child component is rendered, import the child component in the test file, then use `find()`.

```javascript
test("renders emailInput with right props", () => {
  const emailInput = form.find(EmailInput);
  expect(emailInput).toHaveLength(1);
  expect(emailInput.props()).toEqual({
    value: props.email
  });
});
```

When multiple instances of the same child components are rendered, use `find()` to get all the instances as an array, then use `at()` to select a specific instance at a given index.

```javascript
test("renders the text input with right props", () => {
  const textInputs = form.find(TextInput);
  expect(textInputs).toHaveLength(3);
  expect(textInputs.at(0).props()).toEqual({
    value: props.userName,
    locked: true
  });
  expect(textInputs.at(1).props()).toEqual({
    value: props.firstName,
    locked: false
  });
  expect(textInputs.at(2).props()).toEqual({
    value: props.lastName,
    locked: false
  });
});
```

We can also find by class

```javascript
const input = form.find(".inputClassName")
```

And by HTML Element

```javascript
const paragraph = form.find("p")
const textInParagraph = paragraph.at(0).childAt(0).text()
```

## childAt vs at

`childAt(n)` selects the `nth` child of the currently selected node in the DOM.

```javascript
const Paragraph = (
  <p>
    Foo
    <span>Bar</span>
  <p>
);
```

```javascript
test("renders Paragraph name", () => {
  const text = Field.find("p").childAt(0).text();
  expect(text).toEqual("Foo");
});
```

`at(n)` selects the nth element in an arrays/collections

```javascript
test("renders both edit and delete options", () => {
  const menuItems = editMenu.find(MenuItem);
  expect(menuItems.length).toBe(2);
  expect(menuItems.at(0).props().value).toEqual("edit");
  expect(menuItems.at(1).props().value).toEqual("delete");
});
```

## Testing Events

Use `simulate()` to simulate an keyboard event, mouse event, etc. Then use `spy` to ensure a proper response is fired when the event occurs.

```javascript
describe("submit", () => {
  test("submit with the right props", () => {
    form.simulate("click");
    expect(submitSpy).toHaveBeenNthCalledWith(1, {
      email: form.state().email,
      firstName: form.state().firstName,
      lastName: form.state().lastName
    });
  });
});
```

## Testing Callback

`fetch()` allows you to make network requests and is a built-in JavaScript function. `fetch()` uses `Promise`. If you need to test code that is executed after the response is received, the best approach is to mock `fetch` implementation as follows:

```javascript
global.fetch = jest.fn().mockImplementation(() => {
  const p = new Promise((resolve) => {
    resolve({
      status: 200,
      json: () => p
    });
  });
  return p;
});
```

Add this code to `beforeEach`.

## Testing A Collection

Use `each()`. For example, if we have a function `increment`

```javascript
const increment = (val) => {
  const parsedInt = parseInt(val, 10);
  if (Number.isNaN(parsedInt)) return undefined;
  return parsedInt + 1;
};
```

```javascript
test.each([
    [-1, 0],
    [0, 1],
    [1, 2],
    [1.5, 2]
    ["2", 3],
    ["foo", undefined],
    [null, undefined]
])("increment %s", (val, expectedRes) => {
    expect(increment(val)).toBe(expectedRes);
});
```

This will be printed out in console:

```
✓ increment -1
✓ increment 0 (1ms)
✓ increment 1
✓ increment 1.5
✓ increment 2
✓ increment foo
✓ increment null (1ms)
```

## Testing React component methods

We need to use `wrapper.instance()` to access the component instance inside the wrapper so we can invoke component methods directly in our tests.

For example, suppose we have this component:

```javascript
class Counter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.incrementValueBound = this.incrementValue.bind(this);
    this.state({
      value: this.props.counterValue
    });
  }
  incrementValue() {
    this.setState(state => ({
      value: state.value + 1
    }));
    this.props.updateCounter(this.state.value + 1);
  }
  render() {
    return (
      <div>
        <p>{this.state.value}</p>
        <button onClick={incrementValueBound}>Increment</button>
      <div>
    );
  }
}
```

```javascript
test("should increment value when incrementValue is called", () => {
  const props = {
    counterValue: 0,
    updateCounter: jest.fn()
  }
  const wrapper = shallow(<Counter {...props} />);
  expect(wrapper.state("value")).toBe(0);
  wrapper.instance().incrementValue();
  wrapper.instance().incrementValue();
  expect(wrapper.state("value")).toBe(2);
  expect(props.updateCounter).toHaveBeenNthCalledWith(1, 2)
});
```

## Checking Method In Props

Another use of `wrapper.instance` is in accessing the component method that is passed down to a child component as props.

Suppose we have a `App` component that uses the `Counter` component.

```javascript
class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.updateCounterBound = this.updateCounter.bind(this);
    this.state({
      counterValue: 0
    });
  }
  updateCounter(newValue) {
    this.setState({ counterValue: newValue })
  }
  render() {
    return (
        <Counter
  counterValue={this.state.value}
  updateValue={this.updateCounterBound}
/>
    );
  }
}
```

Our test for `App`

```javascript
test("renders Counter with right props", () => {
  const app = shallow(<App />);
  const counter = app.find(Counter);
  expect(counter).toHaveLength(1);
  expect(counter.props()).toEqual({
    counterValue: app.state("counterValue"),
    updateCounter: app.instance().updateCounterBound
  });
})
```

What about checking for higher order functions?

In general, you should not compare functions directly. Instead, you should compare the values that they return. If two functions perform the same calculation, you can check that they both return the same value for the same input.

## Spy on component methods

Using the `Counter` example from before

```javascript
describe("incrementValue", () => {
  let props;
  let counter;
  let counterInstance;
  let incrementValueSpy;

  beforeEach(() => {
    const props = {
      counterValue: 0,
      updateCounter: jest.fn()
    }
    counter = shallow(<Counter {...props} />);
    counterInstance = counter.instance();
    incrementValueSpy = jest.spyOn(counterInstance, "incrementValue");
  });
  test("should call incrementValue", () => {
    counterInstance.incrementValue();
    expect(incrementValueSpy).toHaveBeenCalledTimes(1);
  });
});
```

We use `jest.fn()` to create a [Jest mock function](https://jestjs.io/docs/en/mock-functions).

You can also check for the argument that a mock function is called with:

```javascript
expect(setValueSpy).toHaveBeenNthCalledWith(1, { newVal: 2 });
```

If you want to independently check the arguments in the jest mock function:

```javascript
const [arg1, arg2] = addSpy.mock.calls[0];
expect(arg1).toEqual(expectedArg1);
expect(arg2).toEqual(expectedArg2);
```

`addSpy.mock.calls[0]` provides the arguments for the first request while `addSpy.mock.calls[1]` provides the arguments for the second request.

## Shallow vs Mount

## Dive

When we want to render things inside of a shallowly mounted component, use [`dive()`](https://airbnb.io/enzyme/docs/api/ShallowWrapper/dive.html).

For example, if we have the following component:

```javascript
import ContentPage from "./ContentPage";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import MainScreen from "./MainScreen";

export class Layout extends React.PureComponent {
  render() {
    return (
      <ContentPage
   topNav={TopNav}
   sidebar={Sidebar}
   screen={MainScreen}
   title={"My Awesome App"}
/>
    );
  }
}
```

We want to write a test for Layout to verify that all the components are rendered.

```javascript
// Libraries
import React from "react";
import { shallow } from "enzyme";

// Components
import Layout from "./Layout";
import ContentPage from "./ContentPage";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import MainScreen from "./MainScreen";

describe("Layout", () => {
  let layout;
  beforeEach(() => {
    layout = shallow(<Layout />);
  });
  test("passes props to ContentPage", () => {
    expect(layout.prop("title").toBe("My Awesome App");
  });
  test("renders all components", () => {
    expect(layout.find(ContentPage)).toHaveLength(1);
    expect(layout.dive().find(TopNav)).toHaveLength(1);
    expect(layout.dive().find(Sidebar)).toHaveLength(1);
    expect(layout.dive().find(MainScreen)).toHaveLength(1);
  });
});
```

## State and Props

For this section, we will use the following component:

```javascript
class Foo extends React.PureComponent {
  constructor(props) {
    this.state = {
      title: "foo"
    }
  }
  render() {
    return (
      <div>
        <h1>{this.state.title}</h1>  
        <p>{this.props.value}</p>
      </div>
    );
  }
}
```

We initialize test as such:

```javascript
describe("Foo", () => {
  let props;
  let foo;
  beforeEach(() => {
    props = {
      value: "Hello World"
    };
    foo = mount(<Foo {...props} />);
  });
});
```

### Inspect State

These are all valid ways of inspecting the state of `<Foo />`:

```javascript
expect(foo.state("title")).toBe("foo");
expect(foo.state()).toEqual({ name: "foo" });
expect(foo.state().title).toBe("foo");
```

### Update State

```javascript
foo.setState({ name: "bar" });
const title = foo.find("h1");
expect(title.text()).toBe("bar");
```

After updating state, you need to reselect from the wrapper. This wouldn't work:

```javascript
const title = foo.find("h1");
foo.setState({ name: "bar" });
expect(title.text()).toBe("bar"); // fails. name is still "foo"
```

### Inspect Props

```javascript
expect(foo.prop("value")).toBe(props.value);
expect(foo.props()).toEqual({ value: "Hello World" });
expect(foo.state().value).toBe(props.value);
```

### Update Props

```javascript
expect(foo.find("p").text()).toBe("Hello World");
foo.setProps({
  value: "Hello"
});
expect(foo.find("p").text()).toBe("Hello");
```

Same with `setState`, if you setProp, you need to reselect everything before checking with `expect`.

## Debugging

Use `debug()`

```javascript
const form = shallow(<EditProfileForm {...props} />);
console.log(form.debug());
```

## Async/Await

Suppose you want to test a method that changes the state to something, then after 5 seconds, changes to something else. Jest imposes a 5 seconds timeout. If you want to capture that, you can set a new limit for the timeout:

```javascript
// Want to test

flashNameChange = async ({ newName }) => {
  this.setState({ name: newName, textColor: "red" });

  await delay(FLASH_CHANGE_DURATION);

  this.setState({ textColor: "black" });
}
```

```javascript
// Test

describe("flashNameChange", () => {
  const newName = "bar";
  test("should set new name and flash text color red", () => {
    wrapper.instance().flashNameChange({ newName });
    expect(wrapper.instance().state).toEqual({
      name: newName,
      textColor: "red"
     });
  });

  test("should set textColor back to black after FLASH_CHANGE_DURATION elapsed", async () => {
    await wrapper.instance().flashNameChange({ newName });

    expect(wrapper.instance().state.textColor).toEqual("black");
  }, FLASH_MESSAGE_DURATION * 2);
});

```

See [this](https://github.com/facebook/jest/issues/5055) for more information on timeouts.


## Spying on Async Functions

```javascript
makeRequestSpy = jest.spyOn(ApiRequestUtils, "makeRequest").mockImplementation(
  () => Promise.resolve({ code: "SUCCESS", data: {  } })
);
```

## Document and Element With Timeout

Let's walk through a difficult example testing a component which have a lot of UI effects. Suppose you have a component that scrolls into view on an element upon initial mount.

```js
const FLASH_DURATION = 3000; // 3 seconds
const delay = (ms: number) => new Promise<any>(res => setTimeout(res, ms));

const validElementIds = [
  "section1", "section2", "section3"
];

class Page extends React.PureComponent {
  componentIsMounted = false; // Needed to prevent memory leak
  constructor(props) {
    super(props);
    this.state = {
      highlightSection: false
    }
  }
  componentDidMount() {
    this.componentIsMounted = true;
    const { scrollTo } = this.props;

    if (!scrollTo) return;

    const elementId = scrollTo;
    const element = document.getElementById(elementId);

    if (!element) return;

    this.scrollToElement(element);
  }
  componentWillUnmount() {
    this.componentIsMounted = false;
  }
  async scrollToElement(element: HTMLElement) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });

    if (!this.componentIsMounted) return;

    this.setState({
      highlightSection: true
    });

    await delay(FLASH_DURATION);

    if (!this.componentIsMounted) return;

    this.setState({
        highlightSection: false
    });
  }
  render() {
    const { scrollTo } = this.props;
    const { highlightSection } = this.state;
    const sectionClassName = validElementIds.map(elementId =>
      (elementId === scrollTo && highlightSection) ? styles.highlightedSection : ""
    );
    return (
      <div>
        { validElementIds.map((id, i) =>
            <p key={id} id={id} className={sectionClassName[i]}>)
        }
      </div>
    );
  }
}
```

There is a few thing about this component that makes it harder to test:

1. `scrollTo`
2. element selection.
3. Setting state based on a timer.

Let's write a test for this component.

To address the `document.getElementById() returns null` error, we follow the advice from [here](https://stackoverflow.com/questions/43694975/jest-enzyme-using-mount-document-getelementbyid-returns-null-on-componen) to mount with `attachTo` param.

To address the `cannot scrollIntoView of null` error, we follow the advice from [here](https://stackoverflow.com/questions/51527362/testing-scrollintoview-jest?rq=1) to manually include a `scrollIntoView` spy in `window.HTMLElement.prototype`.

```js
describe("Page component", () => {
  let page;
  beforeEach(() => {
    const div = document.createElement("div");
    window.domNode = div;
    document.body.appendChild(div);
    scrollIntoViewSpy = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewSpy;

    page = mount(
      <Page scrollTo={validElementIds[0]}>,
      { attachTo: window.domNode }
    )
  });
});
```

Then we can add the following tests to verify that when provided with a valid `elementId`, our component scrolls to that element and highlights it upon mount.

```js
describe("Scroll to and highlight Section based on scrollTo", () => {
  test.each(
    [[undefined], ["invalid sectionId"]]
  )("scrolls to and highlights section when scrollTo = %s", (elementId) => {
      page = mount(
          <Page scrollTo={elementId} />,
          { attachTo: window.domNode }
      );
      expect(page.state().highlightSection).toBe(false);
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(0);
  });
  test.each(
    validElementIds
  )("scrolls to and highlights section when scrollTo = %s", (elementId) => {
      page = mount(
          <Page scrollTo={elementId} />,
          { attachTo: window.domNode }
      );
      expect(page.state().highlightSection).toBe(true);
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
      const element = page.find(`#${elementId}`);
      expect(element.hasClass("highlightedSection")).toBe(true);
  });
});
```

Finally, we also want to test that the highlight is removed after a specified duration.

```js
test("should set highlightSection to false after flash duration elapses after mount", async () => {
    const elementId = validElementIds[0];

    page = mount(
        <Page scrollTo={elementId} />,
        { attachTo: window.domNode }
    );

    await page.instance().scrollToElement(
        document.getElementById(elementId)
    );

    expect(userPreferencesForm.state().highlightSection).toBe(false);
}, FLASH_DURATION * 2);
```


# Resources

- [TDD the right way](https://medium.com/javascript-scene/tdd-the-rite-way-53c9b46f45e3)
- [5 questions every unit tests must answer](https://medium.com/javascript-scene/what-every-unit-test-needs-f6cd34d9836d)
- [Testing TDD Intro](https://github.com/foundersandcoders/testing-tdd-intro)
- [mocking es and commonjs modules](https://medium.com/codeclan/mocking-es-and-commonjs-modules-with-jest-mock-37bbb552da43)
- [Understanding Jest mocks](https://medium.com/@rickhanlonii/understanding-jest-mocks-f0046c68e53c)
- [Jest fn](https://medium.com/@deanslamajr/jest-fn-all-the-things-d26f3b929986)
- [Unit testing your React App With Jest and Enzyme](https://medium.com/wehkamp-techblog/unit-testing-your-react-application-with-jest-and-enzyme-81c5545cee45)
- [jest.fn vs jest.spy](https://github.com/facebook/jest/issues/1592)
- [Unit vs Integration vs End-to-End testing](https://codeahoy.com/2016/07/05/unit-integration-and-end-to-end-tests-finding-the-right-balance/)
- [Testing component methods directly](https://bambielli.com/til/2018-03-04-directly-test-react-component-methods/)

Cheatsheets

- [How to achieve the same thing in Sinon with Jest](https://github.com/maurocarrero/sinon-jest-cheatsheet)
- [Jest Cheatsheet](https://devhints.io/jest)
- [Enzyme Cheatsheet](https://devhints.io/enzyme)
- [Jest Docs](https://doc.ebichu.cc/jest/docs/en/expect.html)
- [Jest Expect Docs](https://jestjs.io/docs/en/expect)
- [Taking Advantage of Jest Matchers](https://benmccormick.org/2017/08/15/jest-matchers-1/)
- [Mocking Function using jest.fn](https://medium.com/@deanslamajr/jest-fn-all-the-things-d26f3b929986)
