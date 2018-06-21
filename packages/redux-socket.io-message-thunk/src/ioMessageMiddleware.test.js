// console.log(process.env);  // eslint-disable-line no-console
// test('ok', () => {});
import createIoMessageMiddleware from '../dist/ioMessageMiddleware.esm.js';
import MockSocket from './MockSocket.js';

describe('ioMiddleware', () => {
  test('Has the redux middleware signature and passes data through', () => {
    const mockStore = new MockStore();
    const mockSocket = new MockSocket();
    const ioMiddleware = createIoMessageMiddleware(mockSocket);
    const nextSpy = jest.fn();
    const action = { type: 'whatever' };
    ioMiddleware(mockStore)(nextSpy)(action);
    expect(nextSpy).toHaveBeenCalledWith(action);
    expect(nextSpy).toHaveBeenCalledTimes(1);
  });

  const messageHandlers = {
    testActionCreator({ data }) {
      return { type: 'testActionCreator1', payload: data };
    },
    testThunkActionCreator({ data }) {
      return dispatch => dispatch({ type: 'testActionCreator2', payload: data });
    },
  };

  test('message handled when messageHandler dispatches an action creator type', () => {
    const mockSocket = new MockSocket();
    const ioMiddleware = createIoMessageMiddleware(mockSocket, messageHandlers);
    const mockStore = new MockStore();
    ioMiddleware(mockStore);
    const message = { type: 'testActionCreator', data: 'stuff' };
    mockSocket.emitMockMessage('message', message);
    expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'testActionCreator1', payload: 'stuff' });
  });

  test('message handled when messageHandler dispatches a thunk type', () => {
    const mockSocket = new MockSocket();
    const ioMiddleware = createIoMessageMiddleware(mockSocket, messageHandlers);
    const mockStore = new MockStore();
    ioMiddleware(mockStore);
    const message = { type: 'testThunkActionCreator', data: 'things' };
    mockSocket.emitMockMessage('message', message);
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    const dispatchMock = jest.fn();
    mockStore.dispatch.mock.calls[0][0](dispatchMock);
    expect(dispatchMock).toHaveBeenCalledWith({ type: 'testActionCreator2', payload: 'things' });
  });

  test('Errors are thrown when a message does not contain a type property', () => {
    const mockSocket = new MockSocket();
    const ioMiddleware = createIoMessageMiddleware(mockSocket, messageHandlers);
    const mockStore = new MockStore();
    ioMiddleware(mockStore);
    const message = { data: 'things' };
    mockSocket.emitMockMessage('message', message);
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    const dispatchMock = jest.fn();
    const dispatchedThunk = mockStore.dispatch.mock.calls[0][0];
    expect(() => dispatchedThunk(dispatchMock)).toThrowErrorMatchingSnapshot();
  });
});

class MockStore {
  constructor(initialState = {}) {
    this.dispatch = jest.fn();
    this.subscribe = jest.fn();
    this.getState = jest.fn(() => initialState);
    this.replaceReducer = jest.fn();
  }
}
