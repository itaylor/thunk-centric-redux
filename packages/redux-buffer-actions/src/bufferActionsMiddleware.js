
export default function createBufferActionsMiddleware(options = {}) {
  const defaultOpts = {
    startBuffered: false,
    startBufferActionType: 'START_ACTION_BUFFER',
    releaseBufferActionType: 'RELEASE_ACTION_BUFFER',
    bufferedActionTypes: [],
  };
  const opts = Object.assign({}, defaultOpts, options);
  const { bufferedActionTypes } = opts;
  const actionTypesSet = new Set(bufferedActionTypes);
  let buffer = [];
  let buffering = opts.startBuffered;
  return ({ dispatch }) => next => (action) => {
    if (action.type === opts.startBufferActionType) {
      buffering = true;
    } else if (action.type === opts.releaseBufferActionType) {
      buffer.forEach(act => dispatch(act));
      buffering = false;
      buffer = [];
    } else if ((bufferedActionTypes === 'all' || actionTypesSet.has(action.type)) && buffering) {
      buffer.push(action);
    } else {
      return next(action);
    }
    return undefined;
  };
}
