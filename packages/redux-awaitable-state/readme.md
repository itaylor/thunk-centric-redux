# redux-awaitable-state
A redux store utility that allows you to await until the store's state matches a function you supply

## Reason this exists
It provides a way to express a side-effect dependency between two unrelated components, and have that dependency be tracked in the state store and usable from within a thunk.  One concrete use case is for animations.  You might have your thunk defer dispatching some actions until an animation is complete. 

## How it works
It adds a subscriber to the redux state store that fires on every state change and evaluates if the supplied function against the new state.  If that function returns true, the promise resolves.

## Usage

```bash
npm install redux-awaitable-state
```

You wire this up right after your store has been created. 

```js
import { createStore } from 'redux';
import awaitableState, { stateMatch } from 'redux-awaitable-state';
import myReducerFn from 'wherever/myReducer.js';

const store = createStore(myReducerFn);
awaitableState(store);
```

Here's a contrived example where we want to load data, but don't want to interrupt an animation that we run while the data is loading.

```js
export const serverCallThunk = (someArg) => (dispatch, getState) => {
  // Because of this dispatch, a connected component will rerender and start animating. 
  // It may or may not finish before your data is fetched.
  dispatch({ type: 'startMyAnimation' });

  // We want to wait for both the data to be fetched and the animation
  // to finish.  So we have the component dispatch an action when 
  // it has finished its animation, and we await both the fetch and 
  // the animation being complete.
  const [someValue] = await Promise.all([
    fetch(`something/from/the/server.json?someArg=${someArg}`).json(),
    stateMatch(state => state.myAnimationComplete),
  ])
  // At this point we're certain that the animation and the data fetch
  // have both finished.
  dispatch({ type: 'whatever', someValue });
}
```


## API

`awaitableState(store): Function` (default export)
This is the utility itself that you'll it the store you've created with the `createStore` function.

`stateMatch(evalFn: Function): Promise`
evalFn is a function that is passed the state on every state change.  If it returns true, then the promise returned from stateMatch will resolve.  This is run immediately with the current state at the time the function is called, and may resolve immediately.

`futureStateMatch(evalFn: Function): Promise`
Exactly like `stateMatch`, except it does not look at the current state, only future states. 


## A part of the [thunk-centric-redux](//github.com/itaylor/thunk-centric-redux) set of tools
This library is part of a larger set of tools that can be helpful for making thunk-centric Redux applications.  [Visit that project](//github.com/itaylor/thunk-centric-redux) to see a runnable example app that makes use of this code in context.

### MIT License
Copyright (c) 2015-2019 Ian Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
