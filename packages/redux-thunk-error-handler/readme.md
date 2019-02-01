# redux-thunk-error-handler
A Redux error handler middleware for thunks that can handle errors in both async and sync thunks gracefully.

## Philosophy
We like thunks and want to use them wherever possible.  We should be able to handle all errors that occur inside of executing thunks, both sync and async in a centralized place.  When we handle an error, the error handling function is just an action creator that may itself return another thunk.

## Dependency on `redux-thunk-recursion-detect`
In order to be able to properly handle some difficult and complex error situations that occur with dispatching thunks within other thunks, it is highly recommended to use this middleware in conjunction with `redux-thunk-recursion-detect`.  The error handler will work with vanilla `redux-thunk`, but it will not be able to handle these nested thunk cases properly.  If you want to better understand the scenarios that make this necessary, please read [thunkErrorHandling.md](./thunkErrorHandling.md).

## Usage

```bash
npm install redux-thunk-error-handler
```

Then in the place you're creating your redux store, add the middleware and your own implementation of an error handler

```js
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk-recursion-detect';
import createThunkErrorHandlerMiddleware from 'redux-thunk-error-handler';
import myReducerFn from './myReducer.js';

const myErrorHandler = (err) => {
  console.error(err); // write the error to the console
  // your logic here to determine what should be done on different error types
  if (err.message === 'auth_failed') {
    return logoutThunk;
  }
}

const logoutThunk = async (dispatch) => {
  dispatch({ type: 'showLogoutModal' });
  await fetch('/path/to/some/api/i/call/on/logout');
  delete localStorage.myStuff;
}

const errorHandlerMiddleware = createThunkErrorHandlerMiddleware({ onError: myErrorHandler });
const store = createStore(myReducerFn, applyMiddleware(errorHandlerMiddleware, thunkMiddleware));
```
You probably always want this middleware to come before the thunk middleware in the `applyMiddleware` chain.

## Implementing an error handler
An error handler is a function that takes a single argument, the error that was thrown or rejected.  This is passed as the `onError` property of an object as the first argument of `createThunkErrorHandlerMiddleware()` (the default export).  The result of calling the errorHandler function will be `dispatch`ed if it's not falsey.

Your error handler will probably interrogate that error object to figure out what your app needs to do.  You may wish to handle errors of specified types differently, if you have typed errors that your app throws, then you may want to use `instanceof` to do the checks.  Checking a `.type` property on the errors is also possible if your app is `reject`ing action objects.  You can also always check the `.message` property.

Typically, you want also provide some fallback error handler for all errors that don't have a specific handler.


```js
const exampleErrorHandler = (err) => {
  if (err instanceof ServerNotAvailableError) { // your custom error type (hint: use https://www.npmjs.com/package/es6-error)
    return { type: 'serverDown' } // return just an action
  } else if (err.type === 'badRequestParameter') { // just a property on the error object
    return (dispatch, getState) => { // or return a thunk
      // from within a thunk you can do whatever custom logic based on the app state...
      if (getState().currentRequest === 'save') {
        dispatch({ type: 'saveFailed' });
      } else {
        dispatch({ type: 'fetchFailed' });
      }
    }
  } else {
    console.error('Unexpected error', err);
    dispatch({ type: 'showUnexpectedErrorModal', error:err });
  }
}
```

## Additional APIs
For situations where you want to explicitly apply error handling to a thunk that is nested but which will not execute within the error handling scope of the parent thunk, you can do this using the `forceHandleError` function.
```js
import { forceHandleError } from 'redux-thunk-error-handler';

export function myThunk1() {
  return (dispatch) => {
    dispatch(forceHandleError(myThunk2()));
    dispatch({ type: 'doAThing' });
  }
}

export function myThunk2() {
  return async (dispatch) => {
    const something = await fetch('something');
    return something.whatever;
  }
}
```
In the above example, this will cause the error middleware to process errors that occur in `myThunk2` even though `myThunk1` did not `await` completion of `myThunk2`.  If myThunk1 was `async` and did `await dispatch(myThunk2());` then the `forceHandleError` would be unneeded.  Awaiting is generally preferable to manually using the `forceHandleError` function.


## A part of the [thunk-centric-redux](//github.com/itaylor/thunk-centric-redux) set of tools
This library is part of a larger set of tools that can be helpful for making thunk-centric Redux applications.  [Visit that project](//github.com/itaylor/thunk-centric-redux) to see a runnable example app that makes use of this code in context.

### MIT License
Copyright (c) 2015-2018 Ian Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
