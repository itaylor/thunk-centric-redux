import window from './testSetup.js';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createActionRouterMiddleware from '../dist/index.js';

const routerMiddleware = createActionRouterMiddleware({
  '/foo/:payload': 'action3',
  '/foo/bar/:payload': 'action1',
  '/foo' : 'action2',
  '/biff/:payload/:var1/:var2': 'action4'
});

suite('Action router tests');

test('Changing the URL dispatches an action', 3, (done) => {
  const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
  const store = createStoreWithMiddleware(simpleReducer);
  window.location.href='#/foo/bar';

  setTimeout(()=>{
    equal(store.getState().action3, 'bar');
    strictEqual(store.getState().action1, undefined);
    strictEqual(store.getState().action2, undefined);
    done();
  },0);
});

test('Dispatching an action changes the URL', 3, (done) => {
  const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
  const store = createStoreWithMiddleware(simpleReducer);
  store.dispatch({type:'action3', payload:'blah'});

  setTimeout(()=>{
    equal(window.location.hash, '#/foo/blah');
    strictEqual(store.getState().action2, undefined);
    strictEqual(store.getState().action1, undefined);
    done();
  },0);
});

test('The most specific match is preferred', 3, (done) => {
  const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
  const store = createStoreWithMiddleware(simpleReducer);
  window.location.href='#/foo/bar/baz';

  setTimeout(()=>{
    equal(store.getState().action1, 'baz');
    strictEqual(store.getState().action2, undefined);
    strictEqual(store.getState().action3, undefined);
    done();
  },0);
});

test('Multiple variables in one action dispatched from url change', 3, (done) => {
  const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
  const store = createStoreWithMiddleware(simpleReducer);
  window.location.href='#/biff/something/v1/v2/';

  setTimeout(()=>{
    equal(store.getState().action4.payload, 'something');
    equal(store.getState().action4.var1, 'v1');
    equal(store.getState().action4.var2, 'v2');
    done();
  },0);
});

test('Multiple variables go into the url when dispatched from action', 1, (done) => {
  const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
  const store = createStoreWithMiddleware(simpleReducer);
  store.dispatch({type:'action4', payload:'awesome', var1:'thing1', var2:'thing2'});

  setTimeout(()=>{
    equal(window.location.hash, '#/biff/awesome/thing1/thing2');
    done();
  },0);
});



function simpleReducer(state={}, action){
  switch(action.type){
    case 'action1':
      return Object.assign({}, state, {
        'action1': action.payload || 'action1'
      });
    case 'action2':
      return Object.assign({}, state, {
        'action2': action.payload || 'action2'
      });
    case 'action3':
      return Object.assign({}, state, {
        'action3': action.payload || 'action3'
      });
    case 'action4':{
      return Object.assign({}, state, {
        'action4': {
          payload:action.payload,
          var1:action.var1,
          var2:action.var2
        }
      });
    }
    default:
      return state;
  }
}
