# redux-awaitable-thunk
A redux middleware that allows you to await completion of other in-progress thunks, allowing for complex flow control within thunks.

## Philosophy
We should have a convenient way to able to handle complex flow control scenarios within and between thunks.  Thunks should be able to know when another thunk (or another instance of the same thunk) is running and either choose not to run, or wait for the other thunk to finish before proceeding.  All of this should be opt-in, in that you only add it where you need it and you shouldn't have to modify any "normal" thunks to include this functionality on a small subset of them.  

## How it works
This is a library that allows you give thunks names, and then sequence them by name, using Promises and `async`/`await`.  It's kinda sorta like `redux-saga` if you squint hard enough, but instead of having to write everything in your app as a saga using generators, you can just layer it into your existing thunks on an as-needed basis.


## Usage

```bash
npm install redux-awaitable-thunk
```

You'll just want to wire this middleware in to Redux like all other middleware.  You want it somewhere before the thunk middleware in the applyMiddleware chain.
```js
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import awaitableThunkMiddleware from 'redux-awaitable-thunk';
import myReducerFn from 'wherever/myReducer.js';

const store = createStore(myReducerFn, applyMiddleware(awaitableThunkMiddleware, thunkMiddleware));
```

Now if somewhere in your app, you had two thunks
```js
export const serverCallThunk = (someArg) => (dispatch, getState) => {
  const someValue = await fetch(`something/from/the/server.json?someArg=${someArg}`).json();
  if (getState().someCrazyThingIsTrue) {
    dispatch({ type: 'crazy', someValue });
  } else {
    dispatch({ type: 'notCrazy', someValue });
  }
}
export const superSimpleThunk = (someArg) => (dispatch) => {
  dispatch({ type: 'doAThing', someArg });
}
```

And you wanted to make it so that `superSimpleThunk` can't be called before `serverCallThunk` has finished running at least once, you use the `awaitableThunk` function to give `serverCallThunk` a name.  Then `superSimpleThunk` can use that name with the `after` function:

```js
import { awaitableThunk, after } from 'redux-awaitable-thunk';

export const serverCallThunk = (someArg) => awaitableThunk('serverCallThunk',
  (dispatch, getState) => {
    const someValue = await fetch('something/from/the/server.json?someArg='+someArg).json();
    if (getState().someCrazyThingIsTrue) {
      dispatch({ type: 'crazy', someValue });
    } else {
      dispatch({ type: 'notCrazy', someValue });
    }
  )
};

export const superSimpleThunk = (someArg) => async (dispatch) => {
  await after('serverCallThunk');
  dispatch({ type: 'doAThing', someArg });
};
```

## API

`awaitableThunkMiddleware(): Function` (default export)
This is the middleware itself that you'll pass to Redux's `applyMiddleware` function

`awaitableThunk(name: String, thunk: Function): Function`
Names a thunk, so that its progress can be observed by other thunks by passing this same name.  Returns the named thunk.

`inProgress(name: String): Promise`
Returns a promise that will resolve when the named thunk finshes running.  Resolves immediately if the thunk is not currently running.

`isInProgress(name: String): Boolean`
Returns `true` if the named thunk is currently running, false otherwise.

`after(name: String): Promise`
Returns a promise that will resolve when the named thunk has finished running at least once.  Resolves immediately if the named thunk has already finished running at least once.

`afterExactly(name: String, nCalls: Number): Promise`
Returns a promise that will resolve when the number of finished calls of that name has happened exactly nCalls times.  Will *not* resolve if the number of calls is already greater than `nCalls`.

`next(name: String): Promise`
Returns a promise that will resolve when the named thunk has finished running one more time than it has already run. Useful when it is not known how many times the awaitableThunk has already run.

`more(name: String, nCalls: Number): Promise`
Returns a promise that will resolve when the named thunk has finished running N more times than it has already run. Useful when it is not known how many times the awaitableThunk has already run.


## A part of the [thunk-centric-redux](//github.com/itaylor/thunk-centric-redux) set of tools
This library is part of a larger set of tools that can be helpful for making thunk-centric Redux applications.  [Visit that project](//github.com/itaylor/thunk-centric-redux) to see a runnable example app that makes use of this code in context.

### MIT License
Copyright (c) 2015-2018 Ian Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
