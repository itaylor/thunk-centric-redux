import { createStore, applyMiddleware } from 'redux';
import createErrorCatchMiddleware, { forceHandleError } from '../dist/reduxThunkErrorHandler.esm.js';
import thunkMiddleware from 'redux-thunk-recursion-detect';

describe('error catch middleware', () => {
  test('error in sync thunk', () => {
    const onError = jest.fn();
    const errorCatchMiddleware = createErrorCatchMiddleware({ onError });
    const store = createStore(() => {}, applyMiddleware(errorCatchMiddleware, thunkMiddleware));
    store.dispatch(thunks.thunkThatWillThrow());
    expect(onError.mock.calls).toMatchSnapshot();
  });

  test('error in async thunk', async () => {
    const onError = jest.fn();
    const errorCatchMiddleware = createErrorCatchMiddleware({ onError });
    const store = createStore(() => {}, applyMiddleware(errorCatchMiddleware, thunkMiddleware));
    await store.dispatch(thunks.asyncThunkThatWillThrow());
    await sleep(0);
    expect(onError.mock.calls).toMatchSnapshot();
  });

  test('error in sync nested thunk', async () => {
    const onError = jest.fn();
    const errorCatchMiddleware = createErrorCatchMiddleware({ onError });
    const store = createStore(() => {}, applyMiddleware(errorCatchMiddleware, thunkMiddleware));
    store.dispatch(thunks.nestedSyncThrow());
    await sleep(0);
    expect(onError.mock.calls).toMatchSnapshot();
  });

  test('error in async nested thunk', async () => {
    const onError = jest.fn();
    const errorCatchMiddleware = createErrorCatchMiddleware({ onError });
    const store = createStore(() => {}, applyMiddleware(errorCatchMiddleware, thunkMiddleware));
    await store.dispatch(thunks.nestedAsyncThrow());
    await sleep(0);
    expect(onError.mock.calls).toMatchSnapshot();
  });

  test('error in double nested sync thunk', async () => {
    const onError = jest.fn();
    const errorCatchMiddleware = createErrorCatchMiddleware({ onError });
    const store = createStore(() => {}, applyMiddleware(errorCatchMiddleware, thunkMiddleware));
    await store.dispatch(thunks.doubleNestedSyncThrow());
    await sleep(0);
    expect(onError.mock.calls).toMatchSnapshot();
  });

  test('error in double nested async thunk', async () => {
    const onError = jest.fn();
    const errorCatchMiddleware = createErrorCatchMiddleware({ onError });
    const store = createStore(() => {}, applyMiddleware(errorCatchMiddleware, thunkMiddleware));
    await store.dispatch(thunks.doubleNestedAsyncThrow());
    await sleep(0);
    expect(onError.mock.calls).toMatchSnapshot();
  });

  test('async errors are handled only at the top level', async () => {
    const log = [];
    const topThunk = async (dispatch) => {
      log.push('enter topThunk');
      await sleep(0);
      await dispatch(middleThunk);
      log.push('exit topThunk');
    };
    const middleThunk = async (dispatch) => {
      log.push('enter middleThunk');
      await sleep(0);
      await dispatch(bottomThunk);
      log.push('exit middleThunk');
    };
    const bottomThunk = async () => {
      log.push('enter bottomThunk');
      await sleep(0);
      throw new Error('error in bottomThunk');
    };
    const onError = jest.fn();
    const errorCatchMiddleware = createErrorCatchMiddleware({ onError });
    const store = createStore(() => {}, applyMiddleware(errorCatchMiddleware, thunkMiddleware));
    await store.dispatch(topThunk);
    await sleep(0);
    expect(onError.mock.calls).toMatchSnapshot();
    expect(log).toMatchSnapshot();
    expect(log.join(' ').includes('exit')).toBe(false);
  });

  test('sync errors are handled only at the top level', () => {
    const log = [];
    const topThunk = (dispatch) => {
      log.push('enter topThunk');
      dispatch(middleThunk);
      log.push('exit topThunk');
    };
    const middleThunk = (dispatch) => {
      log.push('enter middleThunk');
      dispatch(bottomThunk);
      log.push('exit middleThunk');
    };
    const bottomThunk = () => {
      log.push('enter bottomThunk');
      throw new Error('error in bottomThunk');
    };
    const onError = jest.fn();
    const errorCatchMiddleware = createErrorCatchMiddleware({ onError });
    const store = createStore(() => {}, applyMiddleware(errorCatchMiddleware, thunkMiddleware));
    store.dispatch(topThunk);
    expect(onError.mock.calls).toMatchSnapshot();
    expect(log).toMatchSnapshot();
    expect(log.join(' ').includes('exit')).toBe(false);
  });

  test('nested async errors that are not awaited can be handled by using forceHandleError', async () => {
    const onError = jest.fn();
    const errorCatchMiddleware = createErrorCatchMiddleware({ onError });
    const store = createStore(() => {}, applyMiddleware(errorCatchMiddleware, thunkMiddleware));
    const topThunk = (dispatch) => {
      // If I awaited this, it would be handled.
      // alteratively, if I don't want to await, I can wrap it in forceHandleError
      dispatch(forceHandleError(middleThunk));
    };
    const middleThunk = async () => {
      await sleep(0);
      throw new Error('I will be handled');
    };
    store.dispatch(topThunk);
    await sleep(50);
    expect(onError.mock.calls.length).toBe(1);
    expect(onError.mock.calls).toMatchSnapshot();
  });

  test('onError can return a thunk function that will be dispatched', async () => {
    const onErrorContents = jest.fn();
    const onError = jest.fn(() => onErrorContents);
    const errorCatchMiddleware = createErrorCatchMiddleware({ onError });
    const store = createStore(() => {}, applyMiddleware(errorCatchMiddleware, thunkMiddleware));
    await store.dispatch(thunks.asyncThunkThatWillThrow());
    await sleep(0);
    expect(onError.mock.calls).toMatchSnapshot();
    expect(onErrorContents.mock.calls).toMatchSnapshot();
  });

  test('errors in an onError thunk do not recursively call the errorCatchMiddleware', async () => {
    const onErrorContents = jest.fn(() => {
      throw new Error('I should not be caught');
    });
    const onError = jest.fn(() => onErrorContents);
    const errorCatchMiddleware = createErrorCatchMiddleware({ onError });
    const store = createStore(() => {}, applyMiddleware(errorCatchMiddleware, thunkMiddleware));
    let hasException = false;
    try {
      await store.dispatch(thunks.asyncThunkThatWillThrow());
    } catch (e) {
      expect(e.message).toBe('I should not be caught');
      hasException = true;
    }
    await sleep(0);
    expect(hasException).toBe(true);
    expect(onError.mock.calls).toMatchSnapshot();
    expect(onError.mock.calls.length).toBe(1);
    expect(onErrorContents.mock.calls).toMatchSnapshot();
  });
});


const thunks = {
  thunkThatWillThrow() {
    return () => {
      throw new Error('thunkThatWillThrow');
    };
  },
  asyncThunkThatWillThrow() {
    return async () => {
      await sleep(0);
      throw new Error('asyncThunkThatWillThrow');
    };
  },
  nestedSyncThrow() {
    return (dispatch) => {
      dispatch(thunks.thunkThatWillThrow());
    };
  },
  nestedAsyncThrow() {
    return async (dispatch) => {
      await sleep(0);
      await dispatch(thunks.asyncThunkThatWillThrow());
    };
  },
  doubleNestedSyncThrow() {
    return (dispatch) => {
      dispatch(thunks.nestedSyncThrow());
    };
  },
  doubleNestedAsyncThrow() {
    return async (dispatch) => {
      await sleep(0);
      await dispatch(thunks.nestedAsyncThrow());
    };
  },
};

function sleep(ms = 0) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}
