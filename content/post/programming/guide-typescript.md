---
title: "A Guide For Migrating Your Project to TypeScript"
date: 2019-07-24
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
thumbnailImagePosition: left
thumbnailImage: /post/images/typescript.png
---

Introduction to TypeScript and guide for how to migrate your project from Flow to TypeScript.

This post is a WIP.

<!--more-->

{{< toc >}}

# Motivation

Why use TypeScript?

- TypeScript adds static typing for JavaScript, a dynamically typed and interpreted language. This significantly improves the maintainability and quality of the code.
- TypeScript has powerful integration with VS Code, which is the defacto editor for JavaScript application and is also created and maintained by Microsoft.
- TypeScript is backed by a big company - Microsoft.
- TypeScript is more popular than its competitors, e.g., Flow. According to the StackOverflow Survey 2019, TypeScript is the third most loved language, [see insights from stackoverflow's 2019 survey](https://insights.stackoverflow.com/survey/2019)
- TypeScript transpiles into to JavaScript because it's a superset of JavaScript.

# Migrating Project to TypeScript

Assuming the project used Flow.

## Phase 1: Configure Project to use TypeScript

### Update Loader

**Option 1** - Delete .babelrc and babel dependencies

Why? TypeScript now supports transpiling JavaScript.

```bash
yarn remove eslint-loader
yarn remove babel-loader
yarn add --dev awesome-typescript-loader source-map-loader typings-for-css-modules-loader
```

**Option 2** - Update babel loader

If you have a project that needs to support both JS and TS, update babel

```
rm .babelrc
touch babel.config.js
```

```js
// babel.config.js

module.exports = function babelConfig(api) {
  api.cache(true);
  return {
    presets: ["@smartling/babel-preset-smartling", "@babel/preset-typescript"],
    plugins: ["@babel/plugin-transform-modules-commonjs"],
    env: {
      test: {
        plugins: ["@babel/plugin-transform-modules-commonjs"],
      },
    },
  };
};
```

Update Webpack Config to use new loader

Assuming we went with `babel-loader`:

```javascript
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

const isDevelopmentMode = process.env.NODE_ENV === "development";

module.exports = {
  bail: !isDevelopmentMode,
  cache: true,
  devtool: isDevelopmentMode ? "eval-source-map" : false,
  mode: isDevelopmentMode ? "development" : "production",
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        enforce: "pre",
      },
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.(woff2?|ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: "url-loader",
        options: {
          name: "[name]-[hash].[ext]",
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    new MiniCssExtractPlugin({ filename: "editor.css", allChunks: true }),
  ],
  resolve: {
    extensions: [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".d.ts",
      ".scss",
      ".json",
      ".css",
    ],
    modules: [
      path.resolve(__dirname, "../src"),
      path.resolve(__dirname, "../node_modules"),
    ],
  },
};
```

After updating the webpack config, build the project (or run webpack) to generate the .d.ts files for your css / sass / pcss. This will ensure that these modules can be imported into your TypeScript project.

For more on TypeScript + WebPack + Sass

- https://stackoverflow.com/a/55993985/4399522
- https://medium.com/@chris_72272/migrating-to-typescript-write-a-declaration-file-for-a-third-party-npm-module-b1f75808ed2
- https://medium.com/@sapegin/css-modules-with-typescript-and-webpack-6b221ebe5f10 <== This one should work. Need to add typings-for-css-module
- https://www.npmjs.com/package/typings-for-scss-modules-loader
- https://medium.com/@kvendrik/generating-typings-for-your-css-modules-in-webpack-2beb3739b342
- https://stackoverflow.com/questions/45411909/loading-sass-modules-with-typescript-in-webpack-2

### Add packages

```bash
yarn add --dev typescript @types/react @types/react-dom @types/jest @types/enzyme @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-import-resolver-typescript
```

Add the TS version of all your library code

```bash
yarn add @types/deep-freeze --dev
yarn add @types/chai --dev
yarn add @types/classnames
```

etc etc

**Optional:** Add type-check script in `package.json`

```javascript
scripts: {
 "type-check": "tsc"
}
```

### Set up Lint

Add `tsconfig.json`:

```javascript
{
   "compilerOptions": {
       // Target latest version of ECMAScript.
       "target": "esnext",

       // Search under node_modules for non-relative imports.
       "moduleResolution": "node",

       // Process & infer types from .js files.
       "allowJs": true,

       // Don't emit; allow Babel to transform files.
       "noEmit": true,

       // Enable strictest settings like strictNullChecks & noImplicitAny.
       "strict": false,

       // Disallow features that require cross-file information for emit.
       "isolatedModules": true,

       // Import non-ES modules as default imports.
       "esModuleInterop": true,

       "jsx": "react",

       "module": "esNext"

   },
   "include": [
       "src/**/*.ts",
       "src/**/*.tsx"
   ],
   "exclude": [
       "src/**/*.js"
   ]
}
```

Update `eslintrc.js`

```javascript
//eslintrc.js
module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended",
    "@smartling/eslint-config-smartling",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["import", "@typescript-eslint"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
    useJSXTextNode: true,
    project: "./tsconfig.json",
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/member-delimiter-style": [2],
    "import/extensions": [1, "never", { ts: "never", json: "always" }],
    "react/jsx-indent": [0],
    "react/jsx-indent-props": [0],
    indent: [0],
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        semi: 1,
        "no-unused-vars": ["off"],
        "quote-props": ["error", "as-needed"],
      },
    },
  ],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      "eslint-import-resolver-typescript": true,
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    react: {
      version: "detect",
    },
  },
  env: {
    jest: true,
    browser: true,
  },
};
```

I suggest excluding `plugin:@typescript-eslint/recommended` for a big project at first to facilitate an incremental migration.

### TypeScript VSCode Integration

Open VSCode setting (See more about setting up TSLint [here](http://artsy.github.io/blog/2019/01/29/from-tslint-to-eslint/) and [here](https://dev.to/dorshinar/linting-your-reacttypescript-project-with-eslint-and-prettier-8hb))

```javascript
{
    "eslint.autoFixOnSave": true,
    "javascript.validate.enable": false,
    "editor.minimap.enabled": false,
    "git.enableSmartCommit": true,
    "window.zoomLevel": 1,
    "workbench.activityBar.visible": true,
    "javascript.updateImportsOnFileMove.enabled": "always",
    "typescript.implementationsCodeLens.enabled": true,
    "editor.formatOnSave": true,
    "eslint.validate": [
        {
            "language": "javascript",
            "autoFix": true
        },
        {
            "language": "javascriptreact",
            "autoFix": true
        },
        {
            "language": "typescript",
            "autoFix": true
        },
        {
            "language": "typescriptreact",
            "autoFix": true
        }
    ]
}
```

## Phase 2 TypeScriptify Flow Project

### Update files

1. Delete Flow-related files. This include, but are not limited to:

   - `flow-typed` folder
   - flowconfig
   - `flow-typed` in eslintignore

2. Delete all instances of `// @flow` and update import. Also, delete all instances of `// $FlowFixMe`

3. Change all `.js` -> `.ts` or `.tsx`. I wrote a Bash script

```bash
sudo touch migrate.sh
vim migrate.sh
```

```bash
#!/bin/bash

cd $1

for f in `find . -type f -name '*.js'`;
do
  git mv -- "$f" "${f%.js}.ts"
done

for f in `find . -type f -name '*.jsx'`;
do
  git mv -- "$f" "${f%.js}.tsx"
done
```

Then provide the directory that you want to migrate as first argument of and execute the script.

```bash
chmod +x migrate.sh
./migrate.sh ~/tinext-editor/src
```

⚠️ But be careful about this approach if you want to keep history of the file in git. If you simply delete the old file with a copy of the file with a different file name, all the commit history related to this file will be lost. See [this](http://thisbythem.com/blog/preserving-history-when-renaming-files-in-git/) and [this](https://joshpress.net/changing-file-names-git-repository-without-loosing-file-history/) for more on preserving history when renaming files in git. This happens somtimes when you are renaming a file and changing a substantial amount of the file in one commit. Basically you have to [trick git into recognizing](https://coderwall.com/p/_csouq/renaming-and-changing-files-in-git-without-losing-history) file is renamed and not treat it as a delete-file / create-file case by commiting immediately after changing the name of the file, then commiting a second time after changing the contents of the file.

When you are committing a lot of files at once, git gets confused about the file renaming and thinks that the js files were deleted and the ts files are new. This can make PR review very challenging. It might be worth renaming the ts files back to js files for the PR, then revert them back to ts.

### Update Plain JS Code to TypeScript

Check out:

- FreeCodeCamp's [Best Practices using Typescript with React](https://www.freecodecamp.org/news/effective-use-of-typescript-with-react-3a1389b6072a/)
- [react-redux-typescript guide](https://github.com/piotrwitek/react-redux-typescript-guide)

When in doubt, try things out in [TypeScript Playground](http://www.typescriptlang.org/play/) or [repl](https://repl.it/)

This is helpful if you are migrating from Flow to TypeScript: [typescript-vs-flowtype](https://github.com/niieani/typescript-vs-flowtype)

Once the project is configured to use TypeScript, there will be a ton of type errors that need to be resolved. This could be a daunting task for one person and could take many weeks, which is a huge problem for an active codebase to which many changes are constantly made while the migration is happening. Depending on the size and complexity of the project you want to migrate, it might be a good idea to conduct a hackathon with peer programming so multiple people can dedicate their time resolving all the errors together and get it done in a short period of time. The [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare-pack) VS Code extension is a useful tool for peer programming.

#### Importing types

```javascript
// Flow
import type { Type1, Type2 } from ./dir/to/path
import { type Type3 } from ./dir/to/path
```

```ts
// Typescript
import { Type1, Type2 } from ./dir/to/path
```

#### Basic Types in TypesScript

- `any`
- `void`
- Primitives: `boolean`, `number`, `string`, `null`, `undefined`
- Array
  - `string[]`
  - `Array<string>` (Generic. More on that later)
- Tuple: `[string, number]`
- Union: `string | null | undefined`
- Unreachable: `never`

We can also use literals as types. For example:

```ts
type One = 1;
const one: One = 1;
const two: One = 2; // <- error
```

#### Typing Functions

In TypeScript, there are [three ways](https://mariusschulz.com/blog/typing-functions-in-typescript#function-type-literals) to type a function.

```javascript
// Flow
type Date = {
  toString: () => string,
  setTime: (time: number) => number,
};
```

```ts
// TypeScript
interface Date {
  toString(): string;
  setTime(time: number): number;
}
```

#### Typing Objects

In flow, we use `type`.

In TypeScript, use `interface`. Interface types offer more capabilities they are generally preferred to type aliases. For instance:

- An interface can be named in an extends or implements clause, but a type alias for an object type literal cannot.
- An interface can have multiple merged declarations, but a type alias for an object type literal cannot.

#### Maybe Types

Flow has [Maybe Types](https://flow.org/en/docs/types/primitives/#toc-maybe-types)

```javascript
// Flow
function acceptsMaybeString(value: ?string) {
  // ...
}
```

In addition to the type in `?type`, maybe types can also be `null` or `void`.

In TypeScript, explicit typing is preferred.

```ts
// TypeScript
function acceptsMaybeString(value: string | null) {
  // ...
}
```

#### Casting

```javascript
// Flow

type User = {
  firstName: string,
  lastName: string,
  email: string,
};
const user = {
  firstName: "Jane",
  lastname: "Doe",
  email: "example@example.com",
  paidUser: true,
};
const user2 = {
  firstName: "Jane",
  lastname: "Doe",
};

const userAsUser: User = ((user: User): User);
const user2AsUser: User = ((user2: User): User); // Fails
```

The casting for `user2AsUser` fails with the following error from flow:

> Cannot cast `user2` to `User` because property `email` is missing in object literal but exists in `User`

In TypeScript, we can do something like this:

```ts
// TypeScript

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

const user: User = {
  firstName: "Jane",
  lastName: "Jane Doe",
} as any as User;
```

#### Readonly property

In flow, Plus sign in front of property Means it’s read-only https://stackoverflow.com/questions/46338710/flow-type-what-does-the-symbol-mean-in-front-a-property

In Typescript, use the “readonly” keyword https://mariusschulz.com/blog/read-only-properties-in-typescript

#### Inline

```javascript
// Flow
function getUser (): { name: string, age: number }
```

```typescript
// TypeScript
// Note the semicolon
function getUser(): { name: string; age: number };
```

#### Explicit

Flow has [type alias](https://flow.org/en/docs/types/aliases/)

```javascript
// Flow
type User = {
  name: string,
  age: number
}

function getUser (): User
```

TypeScript has [interface](https://www.typescriptlang.org/docs/handbook/interfaces.html)

```ts
// TypeScript
interface User {
  name: string;
  age: number;
}

function getUser(): User;
```

#### Optional Type

```javascript
// Flow
type User = {
  name: string,
  age: number,
  location?: string,
};
```

```ts
// TypeScript
interface User {
  name: string;
  age: number;
  location?: string;
}
```

#### Generics

Types can be parameterized. In TypeScript, we can create a generic type with type parameters, which are represented by an arbitary letter like `T`, in angle brackets.

In Flow

```javascript
type MyList = {
  filter: (Array<*>) => Array<*>,
  head: (Array<*>) => *,
};
```

In TypeScript

```ts
interface List<T> {
  filter: T[] => T[];
  head: T[] => T;
}

type NumberList = List<number>
type StringList = List<string>
```

An interface can extend other interfaces as demonstrated in these more complex example.

```ts
interface Entry {
  name: string;
  id: string;
}

interface EntryWithData<T> extends Entry {
  data?: T[];
  lastUpdated?: Date;
}

const stuff: EntryWithData<number> = {
  data: [1, 2, 3], // TS error: name and id are required for EntryWithData
};
```

```ts
interface GenericIcfOrChunk<T> {
  readonly type: T;
  chunks?: Chunk[];
  text?: string | null;
}

interface Chunk extends GenericIcfOrChunk<number> {
  id?: number;
  group?: number;
}

interface GenericIcf<I> extends GenericIcfOrChunk<IcfType> {
  id: I;
  group: number;
}

export type IcfDoc = GenericIcf<0>;
export type IcfSegment = GenericIcf<number>;
```

For more on Generics in TypeScript See the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/generics.html).

TypeScript supports many Generic types like `Record` and `ArrayLike`. See [lib.es5.d.ts](https://github.com/microsoft/TypeScript/blob/master/lib/lib.es5.d.ts) for a complete listing.

Note, in Flow, here's how you extend a type:

```js
type PremiumUser {
    ...User,
    annualPlan: boolean,
    monthlyPlan: boolean
}
```

There is a [gotcha](https://github.com/flowtype/flow-bin/issues/93) with combining types like this in flow. Using object spread to combine types makes the combined types optional. Using `$Exact` when spreading properties solves that problem.

```js
type PremiumUser {
    ...$Exact<User>,
    annualPlan: boolean,
    monthlyPlan: boolean
}
```

#### Class

In the previous section, we saw that both `interface` and `class` can be used to create generic types. But this begs the question: what's the difference between `interface` and `class`?

In object oriented programming, a class is a blueprint with properties and methods from which we can create objects. An interface is a collection of properties and methods.

In that sense, class and interface are the same. TypeScript allows us to type with classes. If we were to change the `interface` keyword to `class` in the examples in the Generics section, the code would still work. So why do we need `class` and when do we use it?

In short, `class` gives us more capability than `interface` such as designating properties as `private` or `public` and adding a constructor. [This blog post](https://ultimatecourses.com/blog/classes-vs-interfaces-in-typescript) and [the official docs](https://www.typescriptlang.org/docs/handbook/classes.html) provide some use cases of `class`. The class in TypeScript look almost identical to the JavaScript class in ES6. This is reasonable since TypeScript is a superset of JavaScript.

#### Array Types

In flow, we use `Array<ObjectType>`

In TypeScript, we use `ObjectType[]`, which is a shorthand for `Array<ObjectType>`. `Array` is a generic type in TypeScript.

#### Enum

This section only deals with TypeScript since Flow does not support enum, rather, to get the same result as enum in Flow, you have to do something like this:

```js
FilterTypes = {
  ALL: "ALL",
  COMPLETED: "COMPLETED",
  UNASSIGNED: "UNASSIGNED",
};

const currentFilter: $Keys<typeof FilterTypes> = FilterTypes.ALL;
```

Enum in TypeScript allow us to make a collection of constants as types. Some examples:

##### Merging Enums

Combining two enums

```ts
enum Mammal {
  DOG = "DOG",
  HORSE = "HORSE",
  HUMAN = "HUMAN",
}
enum Insect {
  ANT = "ANT",
  BEE = "BEE",
  FLY = "FLY",
}

const Animal = {
  ...Mammal,
  ...Insect,
};

type Animal = Mammal | Insect;

type animalCounts = { [key in ValueOf<typeof AnimalT>]: number };
```

💡 ProTip: you can use the same name for the type and a value of merged enum

The [naming convention for enums](<https://docs.microsoft.com/en-us/previous-versions/dotnet/netframework-1.1/4x252001(v=vs.71)>) is to:

> Use a singular name for most Enum types, but use a plural name for Enum types that are bit fields.

See Steve Faulkner's [deck about best practice for TypeScript](https://speakerdeck.com/southpolesteve/shipping-typescript-to-npm?slide=50)

Also see: https://github.com/Microsoft/TypeScript/issues/17592

Here's another Example:

```ts
const enum BasicEvents {
  Start = "Start",
  Finish = "Finish",
}
const enum AdvEvents {
  Pause = "Pause",
  Resume = "Resume",
}

type Events = BasicEvents | AdvEvents;

let e: Events = AdvEvents.Pause;
```

##### Check for membership

```ts
export const isMammal = (animal: Animal): animal is Animal =>
  Object.values(Mammal).includes(animal);
```

##### Subset of Enum

```ts
const animals: AnimalT[] = [“DOG”, “ANT”, “HUMAN”, “BEE”]
const mammals: Mammal[] = animals.filter(animal => animal in Mammal)
console.log(mammals) //> [“DOG”, “HUMAN"]
```

Note the difference between Animal and AnimalT!

##### Type Assertion

Consider the case when you have a union type that could be one of the two interfaces.

```ts
interface A {
  a: string;
}
interface B {
  b: string;
}
type AorB = A | B;
```

We create the following objects:

```ts
const a: AorB = { a: "a" };
const b: AorB = { b: "b" };
```

If we want to access the property `a` from `a`, sometimes we need to assert type like so:

```ts
if ((<A>AorB).a)
```

See [Type guards and type assertions](http://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-type-assertions) section of [Advanced Types](http://www.typescriptlang.org/docs/handbook/advanced-types.html).

##### Dictionary typing using enum

```ts
enum Var {
    X = "x",
    Y = "y",
}

type Dict = { [var in Var]: string };
```

This is a lot simpler than Flow. In Flow, we had to do something like this:

```javascript
// Flow

const Vars = {
  X: "x",
  Y: "y"
}

type VarType = $Keys<typeof Vars>
type Dict = { [var in VarType]: string }
```

#### Exclude

```ts
enum Animal {
  LION = "LION",
  PIG = "PIG",
  COW = "COW",
  ANT = "ANT",
}

type DomesticatedMammals = {
  [animal in Exclude<Animal, Animal.ANT>]: boolean;
};
```

#### Using enums in `Map`

```ts
enum One {
  A = "A",
  B = "B",
  C = "C",
}

enum Two {
  D = "D",
  E = "E",
  F = "F",
}

const map = new Map<string, One | Two>([
  ["a", One.A],
  ["d", Two.D],
]);
```

#### Shape

`$Shape<SomeObjectType>` in Flow has an analog in TypeScript: `Partial<SomeObjectType>`.

### Gotchas

#### Tuple Types

TypeScript sometimes does not recognize Tuple Types. Solution: explicit casting or typing when declaring new var

Example

```ts
type Interval = [number, number];

const getMaxAndMin = (interval: Interval) => ({
  min: interval[0],
  max: interval[1],
});

const interval = [0, 3];

getMaxAndMin(interval);
```

TypeScript complains:

> Argument of type 'number[]' is not assignable to parameter of type '[number, number]'. Type 'number[]' is missing the following properties from type '[number, number]'

Solution:

```ts
const interval: Interval = [0, 3];

getMaxAndMin(interval);
```

Or

```ts
getMaxAndMin([0, 3]);
```

#### Enzyme Mount

```ts
class MyButton extends React.Component {
  constructor() {
    this.handleClickBound = handleClick.bind(this);
  }
  handleClick() {
    console.log("do something");
  }
  render() {
    return <button onClick={handleClickBound}>Click Me</button>;
  }
}
```

```ts
const button = mount(<MyButton />);
const buttonInstance = button.instance();
buttonInstance.handleClick();
```

> Property 'handleClick' does not exist on type 'Component<{}, {}, any>'

Solution:

```ts
const button = mount<MyButton>(<MyButton />);
```

### Optional

#### CI/CD

- Update your CI/CD pipeline to include type checking as part of the build process. For example

```
// Jenkinsfile
stage('Type Check') {
    sh 'yarn type-check'
}
```

#### Storybook

Easy set up

1. Add Storybook for React

   ```bash
   npx -p @storybook/cli sb init --type react
   ```

   This create a `.storybook` directory at the root of your project. Alternatively, you can do everything manually.

   Add all the dependencies

   ```bash
   yarn add -d @babel/core @storybook/addon-actions @storybook/addon-links @storybook/addons @storybook/react babel-loader
   ```

   ```bash
   yarn add -D @storybook/react @storybook/addon-info @storybook/addon-jest @storybook/addon-knobs @storybook/addon-options @storybook/addons @storybook/react storybook-addon-jsx @types/react babel-core typescript awesome-typescript-loader react-docgen-typescript-webpack-plugin jest @types/jest ts-jest
   ```

   Create the files and folders

   ```bash
   mkdir .storybook
   touch .storybook/config.js .storybook/addons.js .storybook/webpack.config.js
   ```

2. Add add-ons for Storybook

   ```bash
   yarn add -D @storybook/addon-storysource @storybook/addon-knobs storybook-addon-jsx @storybook/addon-a11y
   ```

3. Add the dependencies for typescript loader:

   ```bash
   yarn add awesome-typescript-loader @storybook/addon-info react-docgen-typescript-loader
   ```

4. In `tsconfig.json`, make sure `compilerOptions` has the following attribute:

   ```js
   "jsx": "react"
   ```

   And make sure `rootDir` includes `stories`:

   ```js
   "rootDirs": [
       "src", "stories"
   ],
   ```

5. Update `.storybook/config.js`:

   ```js
   import { configure } from "@storybook/react";
   import { setAddon, addDecorator } from "@storybook/react";
   import JSXAddon from "storybook-addon-jsx";
   import { withKnobs, select } from "@storybook/addon-knobs/react";

   addDecorator(withKnobs);
   setAddon(JSXAddon);

   // automatically import all files ending in *.stories.js
   const req = require.context("../stories", true, /.stories.(t|j)sx?$/);

   function loadStories() {
     req.keys().forEach((filename) => req(filename));
   }

   configure(loadStories, module);
   ```

6. Add `.storybook/webpack.config.js`:

   ```js
   module.exports = ({ config }) => {
     config.module.rules.push({
       test: /\.stories\.jsx?$/,
       use: [
         {
           loader: require.resolve("@storybook/addon-storysource/loader"),
         },
       ],
     });
     config.module.rules.push({
       test: /\.stories\.tsx?$/,
       use: [
         {
           loader: require.resolve("awesome-typescript-loader"),
         },
         // Optional
         {
           loader: require.resolve("react-docgen-typescript-loader"),
         },
       ],
     });
     config.resolve.extensions.push(".ts", ".tsx");
     return config;
   };
   ```

   This configuration gives us the ability to load both js and ts stories.

Guides and Resources

- https://storybook.js.org/docs/configurations/typescript-config/
- https://dev.to/swyx/quick-guide-to-setup-your-react--typescript-storybook-design-system-1c51 with [sample project](https://github.com/sw-yx/react-typescript-storybook-starter)
- [Quick guide to storybook TS setup](https://dev.to/swyx/quick-guide-to-setup-your-react--typescript-storybook-design-system-1c51)
- https://github.com/storybookjs/storybook/issues/4739

## Phase 3 Regression Testing

- Re-run unit tests to make sure they all pass
- Integration testing - if the project is a library, make sure you can build it and integrate it into a project that's not TypeScript.

# TypeScript Learning Resource

TypeScript Learning Resources

- [Tutorial for setting up loader for css module](https://medium.com/@sapegin/css-modules-with-typescript-and-webpack-6b221ebe5f10)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/docs/types/type-assertion.html)
- [Typescript VS Code Integration](http://artsy.github.io/blog/2019/01/29/from-tslint-to-eslint/)
- [TypeScript function](https://mariusschulz.com/blog/typing-destructured-object-parameters-in-typescript)
- [TypeScript and React best practice](https://medium.freecodecamp.org/effective-use-of-typescript-with-react-3a1389b6072a)
- [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)
- [TypeScript Eslint Config](https://github.com/typescript-eslint/typescript-eslint/blob/master/.eslintrc.json)
- [TypeScript Docs](https://basarat.gitbooks.io/typescript/docs/const.html)
- [Narrow Interfaces TypeScript](https://medium.com/@OlegVaraksin/narrow-interfaces-in-typescript-5dadbce7b463)
- [So Many Useful TypeScript Tips!](https://codeburst.io/five-tips-i-wish-i-knew-when-i-started-with-typescript-c9e8609029db)
- [Type Assertion](https://www.tutorialsteacher.com/typescript/type-assertion)
- [TypeScript Cheatsheet from devhint](https://devhints.io/typescript)
- [Class vs Interface in TypeScript](https://ultimatecourses.com/blog/classes-vs-interfaces-in-typescript)