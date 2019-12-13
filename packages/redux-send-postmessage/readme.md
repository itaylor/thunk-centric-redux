# redux-send-postmessage
A redux middleware that allows the consumer to conditionally dispatch messages to window.postMessage.


## How it works
This library allows you to create a middleware that dispatches actions to other windows via window.postMessage for configured action types. `createSendPostMessageMiddleware` receives a selector function for the window you are targeting along with a list of action types and returns a middleware function to be passed in to your redux store that will target the provided window when the type of dispatched action is included in the provided list.


## Usage

```bash
npm install redux-send-postmessage
```

You'll just want to wire this middleware in to Redux like all other middleware.
```js
import { createStore, applyMiddleware } from 'redux';
import createSendPostMessageMiddleware from 'redux-send-postmessage';
import myReducerFn from 'wherever/myReducer.js';
import actionsMap from 'wherever/actionsMap.js';

function windowSelector() {
  return {
    targetWindow: someTargetWindow,
    targetWindowOrigin: someTargetWindowOrigin,
  };
};

const actionTypes = [
  'someExamplePostMessageAction',
  'anotherExamplePostMessageAction'
]

const sendPostMessageMiddleware = createSendPostMessageMiddleware(windowSelector, actionsMap);

const store = createStore(myReducerFn, applyMiddleware(sendPostMessageMiddleware));
```

Now you can dispatch data to window.postMessage via thunks
```js
export const exampleThunk = (someArg) => (dispatch) => {
  dispatch({ type: 'someExamplePostMessageAction', someArg })
}
```


## A part of the [thunk-centric-redux](//github.com/itaylor/thunk-centric-redux) set of tools
This library is part of a larger set of tools that can be helpful for making thunk-centric Redux applications.  [Visit that project](//github.com/itaylor/thunk-centric-redux) to see a runnable example app that makes use of this code in context.

### MIT License
Copyright (c) 2015-2018 Ian Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
