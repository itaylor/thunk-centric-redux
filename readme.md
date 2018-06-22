# thunk-centric-redux
A collection of tools for building Redux applications in a thunk-centric fashion.  

## What does thunk-centric mean?
Redux sets up great some basic infrastructure and paradigms for building an app, but leaves it to the implementer to figure out where code that deals with side-effects (things like server communication, data fetching/storing, and sequencing of non-DOM related external API calls) should live.  A popular choice for where to put this type of information is into functions that will be dispatched using the `redux-thunk` middleware.  This monorepo contains a set of tools that help deal with the realities and complexities of using thunks for side-effects, and which seek to make it as easy as possible to structure *all* of an applications side-effects into thunks.

## What is a fully thunk-centric Redux app
As enabled by the middleware here:
* All route changes/navigation within the app dispatch thunks
* Any messages from outside of the normal Redux `action -> reducer -> store -> view` redux flow will dispatch a thunk (Socket.io messages received from the server, or window.postMessages, or whatever) will dispatch thunks.
* All error handling is handled inside thunks, and the error handlers themselves dispatch more thunks.
* All data fetching and calls to the server-side occur within thunks.
* Thunks can be sequenced to run after other thunks, even when they're not dispatched from within the same call stack.

The goal of a thunk-centric app is to have no information in the view layer (typically React Components) about how data is fetched or the sequencing of that data fetching.  This way the view stays simple and focused on taking a state and creating the UI for that state.  Complexities of communication with other systems lives entirely in the thunks.

## Should every React + Redux app be thunk-centric?

Goodness no!  Software is not a baseball cap 🧢 one size rarely fits all.

Most apps that are small in scope will do much better with a component-centric implementation of Redux (or no Redux at all) where React components deal with most of the complexity of fetching data based on whether or not the component is mounted.

Even if the app is large in scope, thunk-centric may not make sense for your use case.  If your app can sync all the data in the store to the server side via an out-of-band process, then you probably don't want to be thunk-centric, as it's not necessary.  Similarly, if your app is server-centric, where the server is perhaps connected over a Websocket and "drives" the UI by dispatching actions directly into Redux, you probably don't need thunks at all.

Generally speaking, thunk-centric implementations of Redux are a good fit for complex, large applications, where the server-side APIs are simplistic and traditional.  Apps where the UI is expected to call to many endpoints and join the data together into a cohesive UI, and where saving data often requires data manipulation in the client side and/or calls to multiple backend APIs.

## What tools are in this repo

* [`redux-action-router`](packages/redux-action-router/readme.md) A router that dispatches thunks (or regular actions) on route changes.
* [`redux-awaitable-thunk`](packages/redux-awaitable-thunk/readme.md) A library that allows you give thunks names, and then sequence them using Promises and `async`/`await`.  It's kinda sorta like `redux-saga` if you squint hard enough 👓, but instead of having to write everything as a saga using generators, you can just layer it into your existing thunks on an as-needed basis.
* [`redux-thunk-recursion-detect`](packages/redux-thunk-recusion-detect/readme.md) If you're dispatching thunks from within other thunks (which if you're fully thunk-centric, you definitely will be) you may encounter edge cases that require you to know if you're in the top-most thunk.  This drop-in replacement for `redux-thunk` makes knowing that possible.
* [`redux-thunk-error-handler`](packages/redux-thunk-error-handler/readme.md) Handles errors in both sync and async thunks.  Handles the errors by dispatching even more thunks.
* [`redux-socket.io-error-thunk`](packages/redux-socket.io-error-thunk/readme.md) Handles socket.io errors by dispatching thunks that will throw them so they can be handled by your error handler.
* [`redux-socket.io-message-thunk`](packages/redux-socket.io-message-thunk/readme.md) Handles socket.io messages by mapping them to thunks that should be run when a message arrives.
* [`socket.io-promise`](packages/socket.io-promise/teadme.md) Kind of an outlier, in that it's not a redux-middleware, it wraps socket.io's `emit`/`ack` in a nice Promise shell so you can `await` it in your thunks.

## Example implementation of all of the included tools

TODO: A simple React/Redux app that uses all this functionality to do contrived pointless stuff.

## Contributing

This project is structured as a monorepo and uses [lerna](https://github.com/lerna/lerna) and [yarn](https://github.com/yarnpkg/yarn) to manage shared dependencies.

To install everything, lint everything, build everything and run all the tests:
```bash
yarn
yarn test
```
All libraries are packaged for distribution with Rollup.js
All homegrown tests use Jest, any newly written tests should use a tdd style syntax.


### MIT License
Copyright (c) 2015-2018 Ian Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
