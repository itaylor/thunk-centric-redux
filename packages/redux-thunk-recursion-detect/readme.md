# redux-thunk-recursion-detect
A drop-in replacement for `redux-thunk` that allows other middleware to detect that a thunk has been dispatched from within another thunk.

## WTF, why would I care about this?
Ah, yes, a very good question.  I wish the answer was "you don't ever have to" and this middleware didn't need to exist.  However, there exist some edge cases, (error handling being one of them) where knowing that you're at the top of the redux `dispatch` call stack is important.

I wrote an explanation that helps understand one such case in [redux-thunk-error-handler's thunkErrorHandling.md](//github.com/itaylor/thunk-centric-redux/blob/master/packages/redux-thunk-error-handler/thunkErrorHandling.md)


## Usage

```bash
npm install redux-thunk-recursion-detect
```

Normally, you can just replace anywhere you're using `redux-thunk` with this library instead.

```js
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk-recursion-detect';

const store = createStore(myReducerFn, applyMiddleware(thunkMiddleware));
```

Then, in some other middleware that needs to know whether or not a thunk was dispatched from inside another thunk, you can use the `isNestedThunkSymbol` export to test for it.

```js
import { isNestedThunkSymbol } from 'redux-thunk-recursion-detect';

export const myCoolMiddleware = store => next => action => {
  if (typeof action === 'function' && action[isNestedThunkSymbol]) {
    // The thunk that is currently in the dispatch pipeline is a nested thunk.
    doWhateverINeedForNestedThunks();
    return next(action);
  } else {
    // The thunk is at the top level of its call stack
    return next(action)
  }
}
```

Take a look at [redux-thunk-error-handler](//github.com/itaylor/thunk-centric-redux/blob/master/packages/redux-thunk-error-handler/) to see a real application of this middleware.

## A part of the [thunk-centric-redux](//github.com/itaylor/thunk-centric-redux) set of tools
This library is part of a larger set of tools that can be helpful for making thunk-centric Redux applications.  [Visit that project](//github.com/itaylor/thunk-centric-redux) to see a runnable example app that makes use of this code in context.

### MIT License
Copyright (c) 2015-2018 Ian Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
