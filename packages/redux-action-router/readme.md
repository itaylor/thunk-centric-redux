# redux-action-router
A super simple router middleware for redux that maps routes to action creators.

How to use
-------------
### Installation
```
npm install --save redux-action-router
```

### Example usage
This will create a middleware that dispatches a redux action 'selectThing' whenever a route `/thing/:id` is visited.
```js
import { createStore, applyMiddleware } from 'redux';
import createRouterMiddleware from 'redux-action-router';
import myRootReducer from './yourRootReducer.js';

let routeMap = {
  '/thing/:id': ({ id, param }) => ({ type: 'selectThing', id, param }),
}

let routerMiddleware = createRouterMiddleware(routeMap);
let store = applyMiddleware(routerMiddleware)(createStore)(myRootReducer);

window.location.href = '#/thing/1?param=true';
//This will dispatch an action:
//{type:'selectThing', id:'1', param:'true' }
```

## Using with action creators and thunks

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

## Changing the url by dispatching an action

There are four ways to change the url:

1. *Via link href*  This is the simplest.  You can just set the `href` of a link to `#/whatever` and that will be caught and handled when the link is clicked.
2. *Via location properties*  You can set `location.hash='/whatever'`
  You can also set `location.hash = /whatever`;
3. *Via redux with routing* You can dispatch an action `{ type: 'setUrlRoute', url:'/whatever' }`.  This will set the url and then process any routing that may apply for the url, just like the three above options.
3. *Via redux without routing* You can dispatch an action `{ type: 'setUrl', url:'/whatever' }`.   This will set the url, but will *NOT* process any routing.  This is useful mostly from within a thunk that is a route handler, as it allow you set the url to the correct value without re-processing the route.

## Handling route changes
Whenever the route changes through any of the above methods, a redux action `{ type: 'urlChange', url:'/the/url' }` is dispatched.  This happens *before* any route handler action creators are called.

### Changes
* 1.0.0
  Use rollup.js to build cjs/modules
  Require use of action creators (no more `Map<String, String>` route objects)
  Split `urlChange` action into three separate actions, `urlChange`, `setUrl`, `setUrlRoute`

* 0.2.0
  Removes bi-directionality of route to url mapping. Previously, dispatching an action that was mapped to a route would automatically change the url.  In practice, this has proved to be not very useful so it is being removed.  
  Adds support for query parameters.

* 0.1.0 Adds support for dispatching action creators, `urlChange` actions.  

### Why choose this over a more name brand router like `react-router`?

First, you have to be ok with `location.hash` based routing, or help implement pushState/popState support (I'd love to add it, but don't have it as a use case of my own).

My experience with `react-router` is that it's all about tying routing to React components.  It's my belief that when you have an app driven by a Redux store, and the app has lots of data that must be loaded when routes change, that this tie of route->component is not optimal, and often unhelpful.  

When routing is tied to components, that means the components must know how to load the data they depend on when they enter the DOM.  This makes doing things like batching data loads difficult, as components are supposed to be modular, but data-fetching may need to affect multiple components.  It can also lead to fetching the same data multiple times, or creating a lots of specialized 'data-fetching-only' components that don't really have presentational value, or creating components that chain-load, EG: component mounts, it renders a loading indicator and on `componentDidMount`, it fetches data, then when the data is fetched, it re-renders, this time loading a child component that in turn does the same thing and fetches data on `componentDidMount` for a different piece of set of data.

If instead your app moves all data fetching to actionCreators/thunks, and these are responsible getting all the right data for the current route, then you can easily wait to mount components until after the data is loaded.  You can also chain all your thunks together, or dispatch actions that start animations while waiting for the data to load, or whatever.

The below is a bit of a synopsis of how I think the common flows go in the different systems:
| React Router | `Route -> Component Mounted -> Data Loading -> Redux State Update -> Component updated with new props` |
| Action Router| `Route -> Thunk -> Data Loading -> Redux State Update -> Component Mounted with all needed data` |

In a large application with lots of data fetching, I find the bottom to be easier to work and reason about.  I also find that the data fetching within thunks is more composable than the same data fetching done within components, because thunks are devoid of UI lifecycle needs.

Nothing against React-router, it's a great routing framework with some great people who work on it.  I'd highly recommend it for any app that either doesn't have a redux-like state store or which doesn't have a need for complex data-loading scenarios.  I imagine react-router is probably the right choice for a react/redux app where the whole store is synced with the backend automatically and you can expect that the data that is in the store is always complete and correct and you have no need to manage details about how to fetch data.   In that case, the direct tie from route to component is definitely a benefit.

## A part of the [thunk-centric-redux](//github.com/itaylor/thunk-centric-redux) set of tools
This library is part of a larger set of tools that can be helpful for making thunk-centric Redux applications.  [Visit that project](//github.com/itaylor/thunk-centric-redux) to see a runnable example app that makes use of this code in context.

### MIT License
Copyright (c) 2015-2018 Ian Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
