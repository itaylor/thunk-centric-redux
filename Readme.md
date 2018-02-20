# socket.io-promise
An opinionated Promise wrapper around socket.io's emit/ack

Philosophy
-------------
We should be able to have a request/response semantic to use over a socket.io channel.  This should support using promises and `async/await` to get back the response.  The request sent should always be a redux action (a js object with at `type` property).  The message received in response should also always be a redux action.  If the `type` of the response is not the same as the `type` of the request, this indicates that an error occured in the response, and my promise should reject.

How to use
----------------
### Installation
```
npm install --save socket.io-promise
```
