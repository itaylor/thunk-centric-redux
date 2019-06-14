# Error handling with redux-thunk

Imagine you have two thunks, each which make calls to backend services and dispatch Redux actions.

```js
function thing1Thunk(id) {
  return async (dispatch, getState) => {
    const result = await api.thing1(id);
    dispatch({ type: 'thing1', result });
    return result;
  }
}

function thing2Thunk(id) {
  return async (dispatch, getState) => {
    const result = await api.thing2(id);
    dispatch({ type: 'thing2', result });
    return result;
  }
}

api = {
  thing1: id => fetch(`url/to/thing1/${id}`).then(res => res.json()),
  thing2: id => fetch(`url/to/thing2/${id}`).then(res => res.json()),
}
```

This works great and is super simple to read and reason about, so long as there are no errors you need to handle.

Broadly speaking, there are two categories of errors that may occur here, depending on the design of the API's you're calling.
* Transport layer errors:
  Something like a 500 error or 404 error coming back from the `fetch` API calls
* Application layer errors:
  The fetch returns a 200 and the `res.json()` call works fine, and returns a JSON object, but that object indicates an error in your application.

For this example, lets assume that one of the expected things that both of these APIs return under some conditions is a 200 OK response with json that says
```json
{ "error":true, "authTimeout": true }
```

So, let's write some code that handles this case

```js
async function handleAuthError (promise) {
  const result = await promise;
  if (result.error && result.authTimeout) {
    throw new Error('Auth Timed Out');
  }
  return result;
}

api = {
  thing1: id => handleAuthError(fetch(`url/to/thing1/${id}`).then(res => res.json())),
  thing2: id => handleAuthError(fetch(`url/to/thing2/${id}`).then(res => res.json())),
}
```
That's not super terrible.  Now we need to handle that error in both of our thunks.

```js
function thing1Thunk(id) {
  return async (dispatch, getState) => {
    try {
      const result = await api.thing1(id);
      dispatch({ type: 'thing1', result });
      return result;
    } catch (e) {
      if (e.message === 'Auth Timed Out') {
        dispatch({ type: 'logout' });
      } else {
        throw e;
      }
    }    
  }
}

function thing2Thunk(id) {
  return async (dispatch, getState) => {
    try {
      const result = await api.thing2(id);
      dispatch({ type: 'thing2', result });
      return result;
    } catch (e) {
      if (e.message === 'Auth Timed Out') {
        dispatch({ type: 'logout' });
      } else {
        throw e;
      }
    }
  }
}
```

This is ugly and brittle.  When we add thing3 API, we have to remember to check for this case.  Imagine if there were 10 of these common errors and 20 APIs!

So, lets clean this up.  Let's get DRY and make a Redux middleware that makes this error handling built-in to `dispatch`, so we never have to remember it again.

```js
const authTimedOutMiddleware = store => next => (action) => {
  const result = next(action);
  if (result instanceof Promise) {
    return result.catch((e) => {
      if (e.message === 'Auth Timed Out') {
        store.dispatch({ type: 'logout' });
      } else {
        throw e;
      }
    });
  }
  return result;
}

async function handleAuthError (promise) {
  const result = await promise;
  if (result.error && result.authTimeout) {
    throw new Error('Auth Timed Out');
  }
  return result;
}

api = {
  thing1: id => handleAuthError(fetch(`url/to/thing1/${id}`).then(res => res.json())),
  thing2: id => handleAuthError(fetch(`url/to/thing2/${id}`).then(res => res.json())),
}

function thing1Thunk(id) {
  return async (dispatch, getState) => {
    const result = await api.thing1(id);
    dispatch({ type: 'thing1', result });
    return result;
  }
}

function thing2Thunk(id) {
  return async (dispatch, getState) => {
    const result = await api.thing2(id);
    dispatch({ type: 'thing2', result });
    return result;
  }
}

```

Now we can wire this into the Redux middleware chain, and we're done, everything is perfect forevermore...
right?...

...almost.  The above works great until the moment you decide to have thunks that dispatch other thunks and depend on their output.

Let's use our example from above and add one more thunk.  It'll just call the other two thunks, wait for their results and then do something with the results.

```js
function thing1and2Thunk() {
  return async (dispatch) => {
    const result1 = await dispatch(thing1Thunk(1));
    const result2 = await dispatch(thing2Thunk(2));
    if (result1.name === 'Korax') {
      dispatch({ type: 'overheat', internalDamage: 100, from: result2.name });
    }
  }
}
```
This will work fine when there are no errors.  However, if thing1 api were to return our auth timeout result, we'd get an exception about the property `name` not existing on `undefined` on this line: `if (result1.name === 'Korax') {`

## Why?
Because our errorHandling middleware stops the exception from bubbling up the middleware chain past the deepest dispatch call.  Instead of the exception continuing up the stack and preventing us from reaching the usage of the `result1.name` we stopped it and handled it by dispatching the `logout` action, and since we didn't return anything, the result of that dispatch is now undefined.

So, to keep using this middleware-based approach safely, we'd have to make a rule that we can't dispatch thunks from within thunks.  That's lame, because dispatching thunks from within thunks is incredibly useful... it allows you to elegantly build your business logic out of smaller pieces.


## What we want:
* A single place to put all code that handles *common* errors
* No additional boilerplate in our thunks
## What we won't give up:
* The ability to nest thunk dispatch calls within other thunks
* The ability to handle errors locally within a thunk (in addition to the common error handler)


## What we built to achieve these goals:

* [redux-thunk-recursion-detect](//github.com/itaylor/thunk-centric-redux/blob/master/packages/redux-thunk-recursion-detect/readme.md) A drop-in replacement for `redux-thunk` middleware.  It is 100% API compatible with vanilla redux-thunk.  It adds only one thing, the ability to detect that a thunk was dispatched from within another thunk.
* [redux-thunk-error-handler](//github.com/itaylor/thunk-centric-redux/blob/master/packages/redux-thunk-error-handler/readme.md) A middleware that handles both sync and async/promise errors/rejections within thunks and which uses the `isNestedThunkSymbol` export from `redux-thunk-recursion-detect` to be able to let errors bubble naturally and only handle them at the top level.
