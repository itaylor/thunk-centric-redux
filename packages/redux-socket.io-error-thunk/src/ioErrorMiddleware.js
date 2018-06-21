import IoErrorCtor from './IoError.js';

export const IoError = IoErrorCtor;
/*
  A redux middleware that handles socket.io errors by dispatching thunks that will
  re-throw them.  This allows socket.io errors to be handled by a generic redux
  error handler middleware.  This can be the same error handling middleware
  used for handling all errors in thunks.
*/
export default function createIoErrorMiddleware(socket, opts = {}) {
  const options = {
    eventsToThrow: ['serverError', 'error', 'connect_failed'],
    ...opts,
  };

  return ({ dispatch }) => {
    options.eventsToThrow.forEach((ev) => {
      socket.on(ev, errorThrower);
    });
    return next => action => next(action);

    function errorThrower(err) {
      dispatch(() => {
        if (err instanceof Error) {
          throw err;
        }
        throw new IoError(err);
      });
    }
  };
}
