import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createSendPostMessageMiddleware } from './sendPostMessageMiddleware.js';

const makeWindowSelector = (spy) => () => {
  return {
    targetWindow: {
      postMessage: spy,
    },
    targetWindowOrigin: 'mockOrigin'
  }
}
const actionsMap = new Set(['sendPostMessageAction']);


describe('createPostMessageMiddleware', () => {
  test('calls postMessage if action is a valid postMessage type', async () => {
    const postMessageSpy = jest.fn();
    const windowSelector = makeWindowSelector(postMessageSpy);
    const sendPostMessageMiddleware = createSendPostMessageMiddleware(windowSelector, actionsMap);
    const createStoreWithMiddleware = applyMiddleware(sendPostMessageMiddleware, thunkMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    
    store.dispatch({ type: 'sendPostMessageAction'});
    expect(postMessageSpy).toHaveBeenCalledWith({ "type": "sendPostMessageAction"}, "mockOrigin");
  });
  test('calls postMessage if action is a valid postMessage type', async () => {
    const postMessageSpy = jest.fn();
    const windowSelector = makeWindowSelector(postMessageSpy);
    const sendPostMessageMiddleware = createSendPostMessageMiddleware(windowSelector, actionsMap);
    const createStoreWithMiddleware = applyMiddleware(sendPostMessageMiddleware, thunkMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    
    store.dispatch({ type: 'dontSendPostMessageAction'});
    expect(postMessageSpy).not.toHaveBeenCalled();
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
