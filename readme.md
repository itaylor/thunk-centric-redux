# redux-action-router
A super simple router middleware for redux that maps routes to actions or action creators.

## What it does

The simplest way to use this is as a bidirectional mapping between url routes and redux action types.
```
{
  '/myRoute/:id' : 'showMyRoute',
  '/some/other/route/:param' : 'showSomeOtherRoute'
}
```
When used with a route description like the above, when the url changes to include `#/myRoute/1`, it will dispatch a redux action `{type:'showMyRoute', id:'1'}`.  Conversely, when an action `{type:'showMyRoute', id:'5'}` is dispatched it will change the url to `#/myRoute/5`.

This allows you to take routing information out of your React components and deal with all url changes as if they were just Redux actions.

## Using with action creators

You can also use it with action creators to get more sophisticated with what happens when a route changes:
```
{
  '/foo': () => {type:'fooAction', key:'someValue'},
  '/route/:param1/:param2': ({param1, param2}) => dispatch =>
    dispatch({type:'someAction', subject:param1});
    dispatch({type:'anotherAction', subject:param2});
  }
}
```
In the above, we have a route `#/foo` that will use an action creator to dispatch an action with some hardcoded value, and a route `#/route/:param1/:param2` that uses an action creator to dispatch a thunk that dispatches two separate actions, each with one of the params from the route.  You can use this pattern with thunks to string together very complex orchestration logic that needs to occur on route change.

## Explicitly changing the url from within a thunk.

When you use an action creator like in the above example, you may find yourself wanting to change the url as part of a thunk that was not triggered by a url change.  You can either do this by just setting `location.hash`, or by dispatching an action of type `urlChange` with a property `url` to the route eg: `{type:'urlChange', url:'/some/url'}`.

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

### Changes
* 0.1.0 Adds support for dispatching action creators, `urlChange` actions.  

### Roadmap for 1.0
* ~~Action creators~~
* Update to Babel 6
* Add support for pushState/popState/replaceState, right now only hash based urls work


### MIT License
Copyright (c) 2015 Ian Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
