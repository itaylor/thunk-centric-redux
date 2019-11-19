# `redux-window-message-thunk`

A middleware that allows you to setup event handlers for window 'message' events.

## Philosophy
We like thunks and want to use them wherever possible.  We should be able to handle all errors that occur inside of executing thunks, both sync and async in a centralized place.  When we handle an error, the error handling function is just an action creator that may itself return another thunk.

## Usage

```bash
npm install redux-window-message-thunk
```

Then in the place you're creating your redux store, add the middleware:

```js
import { createStore, applyMiddleware } from 'redux';
import reduxWindowMessageThunk from 'redux-window-message-thunk';
import myReducerFn from './myReducer.js';

const messageCallbacks = {
  'MODAL_CLOSE': (data) => {
    const {someKey} = data
    return {
      type: 'HANDLE_MODAL_IN_PARENT',
      payload: {someKey}
    }
  }
}

const myOrigins = ['https://my.project.dev']

const messageMiddleware = reduxWindowMessageThunk(myOrigins, messageCallbacks)

const store = createStore(
  myReducerFn,
  applyMiddleware(messageMiddleware)
);
```

### What's Happening

This will begin listening to _all_ window message events. If an event comaes along with a payload of the shape:

```js
data: {
  type: 'MODAL_CLOSE',
  payload: {
    someKey: true,
  },
},
```

It will looks for a method on your `messageCallbacks` map, and if it finds it will pass your playload to it and dispatch the result.


## A part of the [thunk-centric-redux](//github.com/itaylor/thunk-centric-redux) set of tools
This library is part of a larger set of tools that can be helpful for making thunk-centric Redux applications.  [Visit that project](//github.com/itaylor/thunk-centric-redux) to see a runnable example app that makes use of this code in context.

### MIT License
Copyright (c) 2015-2019 Ian Taylor & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
