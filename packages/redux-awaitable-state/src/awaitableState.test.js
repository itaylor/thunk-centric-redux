import { createStore } from 'redux';
import awaitableState, { stateMatch, futureStateMatch, resetSubscribers } from './awaitableState.js';

describe('awaitableState', () => {
  afterEach(async () => {
    resetSubscribers();
    await sleep(50);
  });

  test('stateMatch, resolves after state matching function returns truthy value', async () => {
    const store = createStore(simpleReducer);
    awaitableState(store);

    setTimeout(() => store.dispatch({ type: 'actionFoo' }), 10);
    setTimeout(() => store.dispatch({ type: 'actionBar' }), 20);
    setTimeout(() => store.dispatch({ type: 'actionBaz' }), 30);

    await stateMatch(state => state.inOrderActions.includes('actionBar'));
    expect(store.getState().inOrderActions).toEqual([
      'actionFoo',
      'actionBar',
    ]);
  });

  test('stateMatch resolves immediately if state is already matching', async () => {
    const store = createStore(simpleReducer);
    awaitableState(store);

    store.dispatch({ type: 'actionFoo' });
    store.dispatch({ type: 'actionBar' });
    store.dispatch({ type: 'actionBaz' });
    await stateMatch(state => state.inOrderActions.includes('actionBar'));
    expect(store.getState().inOrderActions).toEqual([
      'actionFoo',
      'actionBar',
      'actionBaz',
    ]);
  });

  test('futureStateMatch does not resolve immediately if state is already matching', async () => {
    const store = createStore(simpleReducer);
    awaitableState(store);
    store.dispatch({ type: 'actionFoo' });
    store.dispatch({ type: 'actionBar' });
    store.dispatch({ type: 'actionBaz' });
    setTimeout(() => {
      store.dispatch({ type: 'clear' });
      store.dispatch({ type: 'actionBar' });
    }, 10);
    await futureStateMatch(state => state.inOrderActions.includes('actionBar'));
    expect(store.getState().inOrderActions).toEqual([
      'actionBar',
    ]);
  });
});

function simpleReducer(state = {
  inOrderActions: [],
}, action) {
  if (action.type.startsWith('action')) {
    return { ...state, inOrderActions: state.inOrderActions.concat([action.type]) };
  } else if (action.type === 'clear') {
    return { ...state, inOrderActions: [] };
  }
  return state;
}

function sleep(ms = 0) {
  return new Promise(res => setTimeout(res, ms));
}
