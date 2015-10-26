# redux-action-router
A super simple router middleware for redux that maps urls to actions.  Use actions to trigger url changes and use url changes to trigger actions.

How to use
-------------
### Installation
```
npm install --save redux-action-router
```

### Example usage
This will create a middleware that maps two hash based urls to actions, and vise versa.
```js
import { createStore, applyMiddleware } from 'redux';
import createRouterMiddleware from 'redux-action-router';
import myRootReducer from './reducer.js';

let routesToActions = {
  '/foo/bar': 'showFooBar',
  '/thing/:id': 'selectThing'
}

let routerMiddleware = createRouterMiddleware(routesToActions);
let store = applyMiddleware(routerMiddleware)(createStore)(myRootReducer);

window.location.href = '#/foo/bar';
//This will dispatch an action:
//{type:'showFooBar'}

store.dispatch({type:'selectThing', id:'5'});
//This will change the URL to #/thing/5
//As well as running an reducer cases that may be looking at action type 'selectThing'
```

### Why this is awesome
*  If you combine this with something like [redux-signals](https://www.npmjs.com/package/redux-signals) that makes actions chainable, you can create a very complete set of operations that occur on url changes, while keeping within the redux dispatch/reduce model.
*  All url/route changes result in dispatched actions that you can see in redux devtools.
*  No super complex routing libraries to learn to use, just map the routes to actions, the actions to reducers, and you're done.

### TODO / missing things
*  Right now only hash based urls work, no pushState/popState/replaceState support yet.  It should be straightforward to add though.

### MIT License
Copyright (c) 2015 Ian Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
