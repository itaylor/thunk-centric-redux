let thunkState;
resetThunkState();

export default function awaitableThunkMiddleware() {
  return next => async (action) => { // eslint-disable-line no-unused-vars
    if (action.awaitableThunk && typeof action === 'function') {
      const name = action.awaitableThunk;
      thunkState.inProgress[name] = (thunkState.inProgress[name] || 0) + 1;
      thunkState.completeCount[name] = thunkState.completeCount[name] || 0;
      let result;
      try {
        result = await next(action);
      } finally {
        thunkState.inProgress[name]--;
        thunkState.completeCount[name]++;
        evaluatePromises(name);
      }
      return result;
    }
    return next(action);
  };
}

export function awaitableThunk(name, thunk) {
  thunk.awaitableThunk = name;
  return thunk;
}

function afterNCalls(name, nCalls, orMore = false) {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const calls = thunkState.completeCount[name];
  if (calls === nCalls || orMore && calls > nCalls) {
    setTimeout(resolve, 0);
  } else {
    addPromise(name, resolve, reject, nCalls);
  }
  return promise;
}

export function after(name) {
  return afterNCalls(name, 1, true);
}

export function afterExactly(name, nCalls) {
  return afterNCalls(name, nCalls, false);
}

export function inProgress(name) {
  if (isInProgress(name)) {
    return afterNCalls(name, thunkState.completeCount[name] + 1, false);
  }
  return new Promise(resolve => setTimeout(resolve, 0));
}

export function isInProgress(name) {
  return thunkState.inProgress[name] && thunkState.inProgress[name] > 0;
}

function addPromise(name, resolve, reject, nCalls) {
  const arrPromises = thunkState.promises[name] || [];
  arrPromises.push({
    resolve,
    reject,
    nCalls,
  });
  thunkState.promises[name] = arrPromises;
}

function evaluatePromises(name) {
  let promiseArr = thunkState.promises[name];
  if (promiseArr && promiseArr.length) {
    promiseArr = promiseArr.filter((promise) => {
      if (promise.nCalls === thunkState.completeCount[name]) {
        promise.resolve();
        return false;
      }
      return true;
    });
    thunkState.promises[name] = promiseArr;
  }
}

// Really only needed for test purposes.
export function resetThunkState() {
  thunkState = {
    inProgress: {},
    completeCount: {},
    promises: {},
  };
}
