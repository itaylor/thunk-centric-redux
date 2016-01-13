import window from './testSetup.js';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createActionRouterMiddleware from '../dist/index.js';
import expect from 'expect';

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

suite('Action router tests', function (){

  test('Changing the URL dispatches an action', (done) => {
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    window.location.href='#/foo/bar';

    setTimeout(()=>{
      expect(store.getState().action3).toBe('bar');
      expect(store.getState().action1).toBe(undefined);
      expect(store.getState().action2).toBe(undefined);
      done();
    },0);
  });

  test('Dispatching an action changes the URL', (done) => {
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    store.dispatch({type:'action3', payload:'blah'});

    setTimeout(()=>{
      expect(window.location.hash).toBe('#/foo/blah');
      expect(store.getState().action2).toBe(undefined);
      expect(store.getState().action1).toBe(undefined);
      done();
    },0);
  });

  test('The most specific match is preferred', (done) => {
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    window.location.href='#/foo/bar/baz';

    setTimeout(()=>{
      expect(store.getState().action1).toBe('baz');
      expect(store.getState().action2).toBe(undefined);
      expect(store.getState().action3).toBe(undefined);
      done();
    },0);
  });

  test('Multiple variables in one action dispatched from url change', (done) => {
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    window.location.href='#/biff/something/v1/v2/';

    setTimeout(()=>{
      expect(store.getState().action4.payload).toBe('something');
      expect(store.getState().action4.var1).toBe('v1');
      expect(store.getState().action4.var2).toBe('v2');
      done();
    },0);
  });

  test('Multiple variables go into the url when dispatched from action', (done) => {
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    store.dispatch({type:'action4', payload:'awesome', var1:'thing1', var2:'thing2'});

    setTimeout(()=>{
      expect(window.location.hash).toBe('#/biff/awesome/thing1/thing2');
      done();
    },0);
  });

  test('Mapping a route to an action creator that returns a thunk', (done) => {
    const createStoreWithWhateverMiddleware = applyMiddleware(thunkMiddleware, routerMiddleware)(createStore);
    const store = createStoreWithWhateverMiddleware(simpleReducer);

    window.location.href='#/thunk/myvar1/myvar2';
    setTimeout(()=>{
      expect(store.getState().action5.var1).toBe('myvar1');
      expect(store.getState().action5.var2).toBe('myvar2');
      done();
    }, 0);
  });

  test('using urlChange action to explicitly change url without triggering re-evaluation of routes', function (done){
    const createStoreWithWhateverMiddleware = applyMiddleware(thunkMiddleware, routerMiddleware)(createStore);
    const store = createStoreWithWhateverMiddleware(simpleReducer);
    store.dispatch({type:'urlChange', url:'/foo/urlchange'});
    expect(window.location.hash).toBe('#/foo/urlchange');
    expect(store.getState().action1).toBe(undefined);
    done();
  });

  test('Overriding urlChangeActionType and urlChangeActionProperty', function (done){
    let optsRouterMiddleware = createActionRouterMiddleware(routes, {
      urlChangeActionType:'changed_url',
      urlChangeActionProperty:'new_url'
    });
    const createStoreWithWhateverMiddleware = applyMiddleware(thunkMiddleware, optsRouterMiddleware)(createStore);
    const store = createStoreWithWhateverMiddleware(simpleReducer);
    store.dispatch({type:'changed_url', new_url:'/foo/changed_url'});
    expect(window.location.hash).toBe('#/foo/changed_url');
    expect(store.getState().action1).toBe(undefined);
    done();
  });

  test('fireInitial option true fires change for the current url', function (done){
    //Set href before creating the middleware.
    window.location.hash = '/fireinitial/abc';
    const routerMiddleware = createActionRouterMiddleware(routes, {
      fireInitial:true
    });
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    setTimeout(()=>{
      expect(store.getState().action6.var1).toBe('abc');
      done();
    },0);
  });

  test('fireInitial option false doesnt fire change for the current url', function (done){
    //Set href before creating the middleware.
    window.location.href='#/fireinitial/def';
    const routerMiddleware = createActionRouterMiddleware(routes, {
      fireInitial:false
    });
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    setTimeout(()=>{
      expect(store.getState().action6).toBe(undefined);
      done();
    },0);
  });

  test('fireInitial option defaults to false', function (done){
    //Set href before creating the middleware.
    window.location.href='#/fireinitial/hij';
    const routerMiddleware = createActionRouterMiddleware(routes);
    const createStoreWithMiddleware = applyMiddleware(routerMiddleware)(createStore);
    const store = createStoreWithMiddleware(simpleReducer);
    setTimeout(()=>{
      expect(store.getState().action6).toBe(undefined);
      done();
    },0);
  });

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
