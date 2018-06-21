export default class MockStore {
  constructor(initialState = {}) {
    this.dispatch = jest.fn();
    this.subscribe = jest.fn();
    this.getState = jest.fn(() => initialState);
    this.replaceReducer = jest.fn();
  }
}
