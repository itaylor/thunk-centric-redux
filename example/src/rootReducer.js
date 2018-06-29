export const initialState = {
  view: 'home',
  ioPromiseSuccesses: [],
  ioPromiseErrors: [],
};

const reducers = {
  setView,
  ioPromiseSuccess,
  ioPromiseError,
  ioPromiseClear,
};

export default function rootReducer(state = initialState, action) {
  const { type } = action;
  if (!reducers[type]) {
    return state;
  }
  return reducers[type](state, action);
}

function setView(state, { view }) {
  return { ...state, view };
}

function ioPromiseSuccess(state, action) {
  return {
    ...state,
    ioPromiseSuccesses: [
      ...state.ioPromiseSuccesses,
      action,
    ],
  };
}

function ioPromiseClear(state) {
  return {
    ...state,
    ioPromiseSuccesses: [],
    ioPromiseErrors: [],
  };
}

function ioPromiseError(state, action) {
  return {
    ...state,
    ioPromiseErrors: [
      ...state.ioPromiseErrors,
      action,
    ],
  };
}
