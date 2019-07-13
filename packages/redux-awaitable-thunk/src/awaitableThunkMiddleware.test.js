import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import awaitableThunkMiddleware, {
  awaitableThunk,
  inProgress,
  after,
  resetThunkState,
  afterExactly,
  afterAnother,
  afterAnotherExactly,
} from './awaitableThunkMiddleware.js';

const createStoreWithMiddleware = applyMiddleware(awaitableThunkMiddleware, thunkMiddleware)(createStore);

const namedSimpleThunk = () => awaitableThunk('namedSimpleThunk', async (dispatch) => {
  await sleep(50);
  dispatch({ type: 'action1' });
});

describe('awaitableThunks', () => {
  afterEach(() => {
    resetThunkState();
  });

  test('await an inProgress thunk', async () => {
    const store = createStoreWithMiddleware(simpleReducer);
    const listener = jest.fn();
    store.subscribe(listener);
    store.dispatch(namedSimpleThunk());
    store.dispatch(async (dispatch) => {
      await inProgress('namedSimpleThunk');
      dispatch({ type: 'action2' });
    });
    await sleep(60);
    expect(store.getState().inOrderActions).toEqual(['action1', 'action2']);
    expect(listener.mock.calls.length).toBe(2);
  });

  test('using inProgress on a thunk that is not in progress resolves immediately', async () => {
    const store = createStoreWithMiddleware(simpleReducer);
    const listener = jest.fn();
    store.subscribe(listener);
    await store.dispatch(async (dispatch) => {
      await inProgress('namedSimpleThunk');
      dispatch({ type: 'action2' });
    });
    expect(store.getState().inOrderActions).toEqual(['action2']);
    expect(listener.mock.calls.length).toBe(1);
  });

  test('await a named thunk using "after"', async () => {
    const store = createStoreWithMiddleware(simpleReducer);
    const listener = jest.fn();
    store.subscribe(listener);
    store.dispatch(async (dispatch) => {
      await after('namedSimpleThunk');
      dispatch({ type: 'action2' });
    });
    store.dispatch(namedSimpleThunk());
    await sleep(60);
    expect(store.getState().inOrderActions).toEqual(['action1', 'action2']);
    expect(listener.mock.calls.length).toBe(2);
  });

  test('"after" works even if named thunk has been run multiple times', async () => {
    const store = createStoreWithMiddleware(simpleReducer);
    const listener = jest.fn();
    store.subscribe(listener);
    await store.dispatch(namedSimpleThunk());
    await store.dispatch(namedSimpleThunk());
    await store.dispatch(async (dispatch) => {
      await after('namedSimpleThunk');
      dispatch({ type: 'action2' });
    });
    expect(store.getState().inOrderActions).toEqual(['action1', 'action1', 'action2']);
    expect(listener.mock.calls.length).toBe(3);
  });

  test('using "after", awaited thunk fires if named thunk was run before', async () => {
    const store = createStoreWithMiddleware(simpleReducer);
    const listener = jest.fn();
    store.subscribe(listener);
    await store.dispatch(namedSimpleThunk());
    await store.dispatch(namedSimpleThunk());
    await store.dispatch(async (dispatch) => {
      await after('namedSimpleThunk');
      dispatch({ type: 'action2' });
    });
    expect(store.getState().inOrderActions).toEqual(['action1', 'action1', 'action2']);
    expect(listener.mock.calls.length).toBe(3);
  });

  test('"afterExactly" runs only when the number of times the thunk has been called matches the requested number of calls', async () => {
    const store = createStoreWithMiddleware(simpleReducer);
    const listener = jest.fn();
    store.subscribe(listener);
    store.dispatch(async (dispatch) => {
      await afterExactly('namedSimpleThunk', 3);
      dispatch({ type: 'action2' });
    });
    await store.dispatch(namedSimpleThunk());
    await store.dispatch(namedSimpleThunk());
    await store.dispatch(namedSimpleThunk());
    await store.dispatch(namedSimpleThunk());
    expect(store.getState().inOrderActions).toEqual(['action1', 'action1', 'action1', 'action2', 'action1']);
    expect(listener.mock.calls.length).toBe(5);
  });

  test('"afterAnotherExactly" runs only if namedSimpleThunk is called N more times after afterAnotherExactly', async () => {
    const store = createStoreWithMiddleware(simpleReducer);
    const listener = jest.fn();
    store.subscribe(listener);
    await store.dispatch(namedSimpleThunk());
    await store.dispatch(namedSimpleThunk());
    store.dispatch(async (dispatch) => {
      await afterAnotherExactly('namedSimpleThunk', 2);
      dispatch({ type: 'action2' });
    });
    await store.dispatch(namedSimpleThunk());
    await store.dispatch(namedSimpleThunk());
    expect(store.getState().inOrderActions).toEqual(['action1', 'action1', 'action1', 'action1', 'action2']);
    expect(listener.mock.calls.length).toBe(5);
  });

  test('"afterAnother" runs only if namedSimpleThunk is called 1 more times after afterAnotherExactly', async () => {
    const store = createStoreWithMiddleware(simpleReducer);
    const listener = jest.fn();
    store.subscribe(listener);
    await store.dispatch(namedSimpleThunk());
    await store.dispatch(namedSimpleThunk());
    store.dispatch(async (dispatch) => {
      await afterAnother('namedSimpleThunk');
      dispatch({ type: 'action2' });
    });
    await store.dispatch(namedSimpleThunk());
    expect(store.getState().inOrderActions).toEqual(['action1', 'action1', 'action1', 'action2']);
    expect(listener.mock.calls.length).toBe(4);
  });
});

function simpleReducer(state = {
  inOrderActions: [],
}, action) {
  if (action.type.startsWith('action')) {
    state.inOrderActions.push(action.type);
  }
  return state;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
