# redux-buffer-actions
A redux middleware that allows you to buffer actions and have them be dispatched at some later point based on a control action.

## Why would I want this?
You have an application that dispatches actions before they are ready to be handled.  It is useful when used in conjunction with other middlewares that perform side-effects or send messages to other, non-redux systems, like `redux-send-postmessage` or `redux-socket.io`.  It's primary use is to prevent messages being sent before the sender is ready to listen for them.

## What's the difference between this and `redux-action-buffer`? 
`redux-action-buffer` buffers *all* actions and doesn't have a way to restart buffering after the buffers have been released.  This middleware allows both of those things.

## Usage

```bash
npm install redux-buffer-actions
```

You'll just want to wire this middleware in to Redux like all other middleware.
```js
import { createStore, applyMiddleware } from 'redux';
import createBufferActionsMiddleware from 'redux-buffer-actions';
import myReducerFn from 'wherever/myReducer.js';

const actionTypes = [
  'someExampleAction',
  'anotherExampleAction'
]

const bufferActionsMiddleware = createBufferActionsMiddleware({
  bufferedActionTypes: actionTypes,
});

const store = createStore(myReducerFn, applyMiddleware(bufferActionsMiddleware));

store.dispatch({ type: 'START_ACTION_BUFFER' });
store.dispatch({ type: 'someExampleAction' }); // won't be dispatched now, buffered until later

// somewhere else in your code, after you're ready for someExampleAction to be dispatched...

store.dispatch({ type: 'RELEASE_ACTION_BUFFER' });
// at this point `{ type: 'someExampleAction' }` will be dispatched.

```

## Options
```js
export type BufferActionsOptions = {
  startBuffered: boolean,
  startBufferActionType?: string,
  releaseBufferActionType?: string,
  bufferedActionTypes: Array<string> | 'all',
}
```
### startBuffered `(boolean), default false`
`true` if you want the middleware to start buffering immediately
`false` if you want the middleware to wait to start buffering until in encounters an action with the value of `startBufferActionType` option.

### startBufferActionType `(string) default 'START_ACTION_BUFFER'`
The `.type` of action that indicates the start of buffering.

### releaseBufferActionType `(string) default 'RELEASE_ACTION_BUFFER'`
The `.type` of action that indicates that any buffered actions should be dispatched.

### bufferedActionTypes `(Array<string> | 'all') default []`
Either an Array of strings indicating the type of actions that we want to buffer, or the string `'all'` indicating that all actions should be buffered. 


## A part of the [thunk-centric-redux](//github.com/itaylor/thunk-centric-redux) set of tools
This library is part of a larger set of tools that can be helpful for making thunk-centric Redux applications.  [Visit that project](//github.com/itaylor/thunk-centric-redux) to see a runnable example app that makes use of this code in context.

### MIT License
Copyright (c) 2015-2018 Ian Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
