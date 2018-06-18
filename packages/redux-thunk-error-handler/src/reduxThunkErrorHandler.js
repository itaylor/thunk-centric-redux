import { isNestedThunkSymbol } from 'redux-thunk-recursion-detect';

export const handleErrorsSymbol = Symbol('handleErrors');

export default function createThunkErrorCatchMiddleware({
  onError = logError,
}) {
  return ({ dispatch }) => {
    return next => (action) => {
      let act = action;
      if (shouldHandleError(action)) {
        act = wrapErrorHandling(action);
      }
      return next(act);
    };

    function wrapErrorHandling(fn) {
      return (...args) => {
        let result;
        try {
          result = fn(...args);
        } catch (err) {
          // sync error in reducer within a thunk
          errorHandler(err);
        }
        if (result instanceof Promise) {
          // async error in thunk
          return result.then(
            value => value,
            e => errorHandler(e)
          );
        }
        return result;
      };
    }

    function errorHandler(err) {
      const result = onError(err);
      if (typeof result === 'function') {
        // no recursive error handler calls;
        result[handleErrorsSymbol] = false;
        return dispatch(result);
      }
      return result;
    }
  };
}


function shouldHandleError(action) {
  if (typeof action !== 'function') {
    return false;
  }
  if (typeof action[handleErrorsSymbol] === 'boolean') {
    return action[handleErrorsSymbol];
  }
  return action[isNestedThunkSymbol] !== true;
}
/* This is useful for errors that happen in a nested thunk that is not awaited
  by the caller */
export function forceHandleError(thunkFn) {
  thunkFn[handleErrorsSymbol] = true;
  return thunkFn;
}

const logError = err => console.error('Unhandled error', err); // eslint-disable-line no-console
