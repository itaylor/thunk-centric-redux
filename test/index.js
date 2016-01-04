import window from './testSetup.js';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createActionRouterMiddleware from '../dist/index.js';

const routes = {
  '/foo/:payload': 'action3',
  '/foo/bar/:payload': 'action1',
  '/foo' : 'action2',
  '/biff/:payload/:var1/:var2': 'action4',
  '/thunk/:var1/:var2': ({var1, var2}) => dispatch => {
    dispatch({type:'action5', var1, var2});
  },
  '/fireinitial/:var1': 'action6'
};

const routerMiddleware = createActionRouterMiddleware(routes);

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

test('Mapping a route to an action creator that returns a thunk', 2, (done) => {
  const createStoreWithWhateverMiddleware = applyMiddleware(thunkMiddleware, routerMiddleware)(createStore);
  const store = createStoreWithWhateverMiddleware(simpleReducer);

  window.location.href='#/thunk/myvar1/myvar2';
  setTimeout(()=>{
    equal(store.getState().action5.var1, 'myvar1');
    equal(store.getState().action5.var2, 'myvar2');
    done();
  }, 0);
});

test('using urlChange action to explicitly change url without triggering re-evaluation of routes', 2, function (done){
  const createStoreWithWhateverMiddleware = applyMiddleware(thunkMiddleware, routerMiddleware)(createStore);
  const store = createStoreWithWhateverMiddleware(simpleReducer);
  store.dispatch({type:'urlChange', url:'/foo/urlchange'});
  equal(window.location.hash, '#/foo/urlchange');
  strictEqual(store.getState().action1, undefined);
  done();
});

test('Overriding urlChangeActionType and urlChangeActionProperty', 2, function (done){
  let optsRouterMiddleware = createActionRouterMiddleware(routes, {
    urlChangeActionType:'changed_url',
    urlChangeActionProperty:'new_url'
  });
  const createStoreWithWhateverMiddleware = applyMiddleware(thunkMiddleware, optsRouterMiddleware)(createStore);
  const store = createStoreWithWhateverMiddleware(simpleReducer);
  store.dispatch({type:'changed_url', new_url:'/foo/changed_url'});
  equal(window.location.hash, '#/foo/changed_url');
  strictEqual(store.getState().action1, undefined);
  done();
});

test('fireInitial option true fires change for the current url', 1, function (done){
  //Set href before creating the middleware.
  window.location.hash = '/fireinitial/abc';
  const routerMiddleware = createActionRouterMiddleware(routes, {
    fireInitial:true
  });
  const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
  const store = createStoreWithMiddleware(simpleReducer);
  setTimeout(()=>{
    equal(store.getState().action6.var1, 'abc');
    done();
  },0);
});

test('fireInitial option false doesnt fire change for the current url', 1, function (done){
  //Set href before creating the middleware.
  window.location.href='#/fireinitial/def';
  const routerMiddleware = createActionRouterMiddleware(routes, {
    fireInitial:false
  });
  const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
  const store = createStoreWithMiddleware(simpleReducer);
  setTimeout(()=>{
    equal(store.getState().action6, undefined);
    done();
  },0);
});

test('fireInitial option defaults to false', 1, function (done){
  //Set href before creating the middleware.
  window.location.href='#/fireinitial/hij';
  const routerMiddleware = createActionRouterMiddleware(routes);
  const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
  const store = createStoreWithMiddleware(simpleReducer);
  setTimeout(()=>{
    equal(store.getState().action6, undefined);
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
    case 'action4':
      return Object.assign({}, state, {
        'action4': {
          payload:action.payload,
          var1:action.var1,
          var2:action.var2
        }
      });
    case 'action5':
      return Object.assign({}, state, {
        'action5': {
          var1:action.var1,
          var2:action.var2
        }
      });
    case 'action6':
      return Object.assign({}, state, {
        'action6': {var1: action.var1}
      });
    default:
      return state;
  }
}
