# socket.io-promise
An opinionated Promise wrapper around socket.io's `emit`/`ack`

Philosophy
-------------
We should be able to have a request/response semantic to use over a socket.io channel.  This should support using promises and `async/await` to get back the response.  The request sent should always be a redux action (a js object with a `type` property).  The message received in response should also always be a redux action.  If the `type` of the response is not the same as the `type` of the request, this indicates that an error occurred in the response, and my promise should reject.

How to use
----------------
### Installation
```
npm install --save socket.io-promise
```

### Example usage:

```js
  import createIoPromise from 'socket.io-promise';
  const ioPromise = createIoPromise(socket);

  async function makeRequest() {
    try {
      const result = await ioPromise({ type: 'foo' });
      // if the server .ack sends an action that has type: 'foo';
      console.log(result.type) // 'foo'
    } catch (e) {
      // if the server .ack sends an action that is not type: 'foo'
      console.log(e.type) // a value other than 'foo'
    }  
  }  
  makeRequest();
```

## A part of the [thunk-centric-redux](//github.com/itaylor/thunk-centric-redux) set of tools
This library is part of a larger set of tools that can be helpful for making thunk-centric Redux applications.  [Visit that project](//github.com/itaylor/thunk-centric-redux) to see a runnable example app that makes use of this code in context.

### MIT License
Copyright (c) 2015-2018 Ian Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
