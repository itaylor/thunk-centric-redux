// As of Jest 21, there is absolutely no way for jest to
// allow you to handle your own unhandled promise rejections,
// as they are caught by the parent process and turned into
// jest failures. So this single test case has to run in mocha instead.
import { createStore, applyMiddleware } from 'redux';
import createErrorCatchMiddleware from '../dist/reduxThunkErrorHandler.esm.js';
import thunkMiddleware from 'redux-thunk-recursion-detect';
import expect from 'expect';

suite('reduxThunkErrorHandler mocha tests', () => {
  test('nested async errors that are not awaited are not handled automatically', wrapUnhandledRejection(async (rejState) => {
    const errCalls = [];
    const onError = err => errCalls.push(err);
    const errorCatchMiddleware = createErrorCatchMiddleware({ onError });
    const store = createStore(() => {}, applyMiddleware(errorCatchMiddleware, thunkMiddleware));
    const topThunk = (dispatch) => {
      // If I awaited this, it would be handled.
      dispatch(middleThunk);
    };
    const middleThunk = async () => {
      await sleep(0);
      throw new Error('I will not be handled');
    };

    expect(rejState.unhandledRejs.length).toBe(0);
    store.dispatch(topThunk);
    await sleep(100);
    expect(onError.length).toBe(1);
    expect(rejState.unhandledRejs[0].message).toBe('I will not be handled');
  }));

  function wrapUnhandledRejection(fn) {
    return async () => {
      const oldListenersRejection = process.listeners('unhandledRejection').slice();
      //  console.log('oldListenersRejection', oldListenersRejection);
      const state = { unhandledRejs: [] };
      const onUnhandledRej = e => state.unhandledRejs.push(e);
      process.on('unhandledRejection', onUnhandledRej);
      try {
        //  console.log('newRegListener', process.listeners('unhandledRejection'));
        await fn(state);
      } finally {
        process.listeners('unhandledRejection').slice();
        oldListenersRejection.forEach((l) => {
          process.on('unhandledRejection', l);
        });
      }
    };
  }
});

function sleep(ms = 0) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}
