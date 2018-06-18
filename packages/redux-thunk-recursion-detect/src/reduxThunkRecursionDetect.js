function createRecursionDetectThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => {
    return next => (action) => {
      if (typeof action === 'function') {
        return action(wrappedDispatch, getState, extraArgument);
      }
      return next(action);
    };
    function wrappedDispatch(action) {
      if (typeof action === 'function') {
        action[isNestedThunkSymbol] = true;
      }
      return dispatch(action);
    }
  };
}
const thunk = createRecursionDetectThunkMiddleware();
thunk.withExtraArgument = createRecursionDetectThunkMiddleware;
export const isNestedThunkSymbol = Symbol('isNestedThunk');
export default thunk;
