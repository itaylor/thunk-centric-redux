/* global window document */

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createActionRouterMiddleware, { processCurrentUrl } from '../dist/reduxActionRouter.esm.js';

const routes = {
  '/foo/:payload': params => ({ ...params, type: 'action3' }),
  '/foo/bar/:payload': params => ({ ...params, type: 'action1' }),
  '/foo': params => ({ ...params, type: 'action2' }),
  '/biff/:payload/:var1/:var2': params => ({ ...params, type: 'action4' }),
  '/thunk/:var1/:var2': ({ var1, var2 }) => (dispatch) => {
    dispatch({ type: 'action5', var1, var2 });
  },
  '/fireinitial/:var1': params => ({ ...params, type: 'action6' }),
  '/something/:payload': params => ({ ...params, type: 'action7' }),
  '/somethingElse/:payload': params => ({ ...params, type: 'action8' }),
  '/count/how/many': params => ({ ...params, type: 'callCounter' }),
  '/callCounter': params => ({ ...params, type: 'callCounter' }),
};

describe('Action router tests', () => {
  test('Changing the URL dispatches an action', async () => {
    const routerMiddleware = createActionRouterMiddleware(routes);

    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    window.location.href = '#/foo/bar';

    await sleep();
    expect(store.getState().action3).toBe('bar');
    expect(store.getState().action1).toBe(undefined);
    expect(store.getState().action2).toBe(undefined);
  });

  test('The most specific match is preferred', async () => {
    const routerMiddleware = createActionRouterMiddleware(routes);

    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    window.location.href = '#/foo/bar/baz';

    await sleep();
    expect(store.getState().action1).toBe('baz');
    expect(store.getState().action2).toBe(undefined);
    expect(store.getState().action3).toBe(undefined);
  });

  test('Multiple variables in one action dispatched from url change', async () => {
    const routerMiddleware = createActionRouterMiddleware(routes);

    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    window.location.href = '#/biff/something/v1/v2/';

    await sleep();
    expect(store.getState().action4.payload).toBe('something');
    expect(store.getState().action4.var1).toBe('v1');
    expect(store.getState().action4.var2).toBe('v2');
  });

  test('Mapping a route to an action creator that returns a thunk', async () => {
    const routerMiddleware = createActionRouterMiddleware(routes);
    const createStoreWithThunkMiddleware = applyMiddleware(thunkMiddleware, routerMiddleware)(createStore);
    const store = createStoreWithThunkMiddleware(simpleReducer);

    window.location.href = '#/thunk/myvar1/myvar2';
    await sleep();
    expect(store.getState().action5.var1).toBe('myvar1');
    expect(store.getState().action5.var2).toBe('myvar2');
  });

  test('use setUrl action to change url without triggering re-evaluation of routes', () => {
    const actionRouterMiddleware = createActionRouterMiddleware(routes);
    const createStoreWithMiddleware = applyMiddleware(actionRouterMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    store.dispatch({ type: 'setUrl', url: '/foo/urlchange' });
    expect(window.location.hash).toBe('#/foo/urlchange');
    expect(store.getState().action1).toBe(undefined);
  });

  test('Without calling process API existing url does not fire changes', async () => {
    // Set href before creating the middleware.
    window.location.href = '#/fireinitial/def';
    await sleep();
    const actionRouterMiddleware = createActionRouterMiddleware(routes);
    const createStoreWithMiddleware = applyMiddleware(actionRouterMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    expect(store.getState().action6).toBe(undefined);
  });

  test('With calling process API existing url does fire changes', async () => {
    // Set href before creating the middleware.
    window.location.href = '#/fireinitial/def';
    await sleep();
    const actionRouterMiddleware = createActionRouterMiddleware(routes);
    const createStoreWithMiddleware = applyMiddleware(actionRouterMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    processCurrentUrl();
    expect(store.getState().action6).toEqual({ var1: 'def' });
  });

  test('Query parameters are passed', async () => {
    const routerMiddleware = createActionRouterMiddleware(routes);
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    window.location.href = '#/something/bar?queryParam1=cool&queryParam2=awesome';

    await sleep();
    expect(store.getState().action7).toBe('barcoolawesome');
  });

  test('Path params trump query params', async () => {
    const routerMiddleware = createActionRouterMiddleware(routes);
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    // There is a path param 'payload' which takes precedence over the query param payload.
    window.location.href = '#/something/yes?queryParam1=1&queryParam2=2&payload=no';
    await sleep();
    expect(store.getState().action7).toBe('yes12');
  });

  test('Multiple of the same params treated as arrays', async () => {
    const routerMiddleware = createActionRouterMiddleware(routes);
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    // There is a path param 'payload' which takes precedence over the query param payload.
    window.location.href = '#/somethingElse/hey?multiQP=test%20%E2%B7%AF&multiQP=number%20X';

    await sleep();
    expect(store.getState().action8).toBe('heytest ⷯnumber X');
  });

  test('Clicking a link element set the same hash url dispatches an action a second time', async () => {
    const routerMiddleware = createActionRouterMiddleware(routes);
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    window.location.href = '#/count/how/many';
    await sleep();
    const a = document.createElement('a');
    a.href = '#/count/how/many';
    document.body.appendChild(a);
    a.click();
    await sleep();
    expect(store.getState().callCounter).toBe(2);
  });

  test('dispatching setUrl does not trigger route evaluation.', async () => {
    const routerMiddleware = createActionRouterMiddleware(routes);
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    store.dispatch({
      type: 'setUrl', url: '/callCounter',
    });
    store.dispatch({
      type: 'setUrl', url: '/foo',
    });
    store.dispatch({
      type: 'setUrl', url: '/callCounter',
    });
    store.dispatch({
      type: 'setUrl', url: '/callCounter',
    });
    await sleep();
    expect(store.getState().callCounter).toBe(undefined);
    expect(store.getState().action2).toBe(undefined);
  });

  test('dispatching setUrlRoute triggers route evaluation.', async () => {
    const routerMiddleware = createActionRouterMiddleware(routes);
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    store.dispatch({
      type: 'setUrlRoute', url: '/callCounter',
    });
    store.dispatch({
      type: 'setUrlRoute', url: '/foo',
    });
    store.dispatch({
      type: 'setUrlRoute', url: '/callCounter',
    });
    store.dispatch({
      type: 'setUrlRoute', url: '/callCounter',
    });
    expect(store.getState().callCounter).toBe(3);
    expect(store.getState().action2).toBe('action2');
    await sleep();
    expect(store.getState().callCounter).toBe(3);
    expect(store.getState().action2).toBe('action2');
  });

  test('when url does not change and hash change occurs then navigate to new url', async () => {
    const routerMiddleware = createActionRouterMiddleware(routes);
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    store.dispatch({ type: 'setUrlRoute', url: '/foo/bar' });
    store.dispatch({ type: 'setUrlRoute', url: '/foo/bar' });
    window.location.hash = '#/callCounter';
    await sleep();
    expect(store.getState().callCounter).toBe(1);
  });

  test('default dispatcher dispatches urlChange action before calling route action creator', async () => {
    const routerMiddleware = createActionRouterMiddleware(routes);
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const reducerSpy = jest.fn().mockReturnValue({});
    createStoreWithMiddleware(reducerSpy);
    reducerSpy.mockClear();
    window.location.hash = '#/foo';
    await sleep();
    expect(reducerSpy.mock.calls).toMatchSnapshot();
  });
});


function simpleReducer(state = {}, action) {
  switch (action.type) {
    case 'action1':
      return Object.assign({}, state, {
        action1: action.payload || 'action1',
      });
    case 'action2':
      return Object.assign({}, state, {
        action2: action.payload || 'action2',
      });
    case 'action3':
      return Object.assign({}, state, {
        action3: action.payload || 'action3',
      });
    case 'action4':
      return Object.assign({}, state, {
        action4: {
          payload: action.payload,
          var1: action.var1,
          var2: action.var2,
        },
      });
    case 'action5':
      return Object.assign({}, state, {
        action5: {
          var1: action.var1,
          var2: action.var2,
        },
      });
    case 'action6':
      return Object.assign({}, state, {
        action6: { var1: action.var1 },
      });
    case 'action7':
      return Object.assign({}, state, {
        action7: action.payload + action.queryParam1 + action.queryParam2,
      });
    case 'action8':
      return Object.assign({}, state, {
        action8: action.payload + action.multiQP[0] + action.multiQP[1],
      });
    case 'callCounter':
      return Object.assign({}, state, {
        callCounter: (state.callCounter || 0) + 1,
      });
    default:
      return state;
  }
}

function sleep(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
