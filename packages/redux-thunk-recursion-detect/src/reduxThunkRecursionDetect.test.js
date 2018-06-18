import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware, { isNestedThunkSymbol } from '../dist/reduxThunkRecursionDetect.esm.js';

describe('recursion detection thunk middleware', () => {
  test('top level thunk does not get marked with isNestedThunk symbol', () => {
    const store = createStore(() => {}, applyMiddleware(thunkMiddleware));
    const topThunkFn = topThunk({ type: 'test' });
    store.dispatch(topThunkFn);
    expect(topThunkFn[isNestedThunkSymbol]).toBe(undefined);
    function topThunk(data) {
      return (dispatch) => {
        dispatch(data);
      };
    }
  });

  test('second level and beyond thunks functions do get marked with isNestedThunk symbol', () => {
    const store = createStore(() => {}, applyMiddleware(thunkMiddleware));
    let nestedThunkFn;
    let doubleNestedThunkFn;
    const topThunkFn = topThunk({ type: 'test' });
    store.dispatch(topThunkFn);
    expect(topThunkFn[isNestedThunkSymbol]).toBe(undefined);
    expect(nestedThunkFn[isNestedThunkSymbol]).toBe(true);
    expect(doubleNestedThunkFn[isNestedThunkSymbol]).toBe(true);
    function topThunk(data) {
      return (dispatch) => {
        nestedThunkFn = nestedThunk(data);
        dispatch(nestedThunkFn);
      };
    }
    function nestedThunk(data) {
      return (dispatch) => {
        doubleNestedThunkFn = doubleNestedThunk(data);
        dispatch(doubleNestedThunkFn);
      };
    }
    function doubleNestedThunk(data) {
      return (dispatch) => {
        dispatch(data);
      };
    }
  });
});
