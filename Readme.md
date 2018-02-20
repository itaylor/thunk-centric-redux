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
