/* A simple socket.io redux middleware that listens for a socket.io event and dispatches by calling an action creator.

  Philosophy: The server will send messages that look like redux actions.
  The client will pass those to an action creator function and dispatch the result.

  createIoMessageMiddleware(socket, {
    myThunkType: ({ data }) => (dispatch) => dispatch(data),
    myActionCreatorType: ({ data }) => return { type: 'MY_ACTION_TYPE', data },
  })

  Then when the server sends socket.io a message:
  `{ type: 'myActionCreatorType', data: { foo: 'bar' } }`
  this will:
  `dispatch({ type: 'MY_ACTION_TYPE', data: { foo: 'bar' }})`
  */

export default function createIoMessageMiddleware(socket, ioMessageHandlers = {}, opts) {
  const options = {
    eventName: 'message',
    ...opts,
  };

  return ({ dispatch }) => {
    socket.on(options.eventName, onMessage);
    return next => action => next(action);

    async function onMessage(message) {
      const { type } = message;
      if (type && ioMessageHandlers[type]) {
        await dispatch(ioMessageHandlers[type](message));
      } else {
        await dispatch(() => {
          throw new Error(`Message received without 'type' property: ${JSON.stringify(message)}`);
        });
      }
    }
  };
}
