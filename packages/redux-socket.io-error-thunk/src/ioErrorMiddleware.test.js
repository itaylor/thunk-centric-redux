import createIoErrorMiddleware, { IoError } from '../dist/ioErrorMiddleware.esm.js';
import MockSocket from './MockSocket.js';
import MockStore from './MockStore.js';

describe('ioErrorMiddleware', () => {
  test('Has the redux middleware signature and passes data through', () => {
    const mockStore = new MockStore();
    const mockSocket = new MockSocket();
    const ioMiddleware = createIoErrorMiddleware(mockSocket);
    const nextSpy = jest.fn();
    const action = { type: 'whatever' };
    ioMiddleware(mockStore)(nextSpy)(action);
    expect(nextSpy).toHaveBeenCalledWith(action);
    expect(nextSpy).toHaveBeenCalledTimes(1);
  });

  test('create ioErrorMiddleware', () => {
    const mockSocket = new MockSocket();
    const ioMiddleware = createIoErrorMiddleware(mockSocket);
    const mockStore = new MockStore();
    ioMiddleware(mockStore);
    const errTypes = ['error', 'serverError', 'connect_failed'];
    errTypes.forEach((errType) => {
      mockStore.dispatch.mockClear();
      const err = new Error(`error ${errType}`);
      mockSocket.emitMockMessage(errType, err);
      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      const firstCallArg = mockStore.dispatch.mock.calls[0][0];
      expect(typeof firstCallArg).toBe('function');
      expect(() => firstCallArg(mockStore.dispatch)).toThrow(err);
    });
  });

  test('wraps non exception errors in IoError exception type', () => {
    const mockSocket = new MockSocket();
    const ioMiddleware = createIoErrorMiddleware(mockSocket);
    const mockStore = new MockStore();
    ioMiddleware(mockStore);
    const errTypes = ['error', 'serverError', 'connect_failed'];
    errTypes.forEach((errType) => {
      mockStore.dispatch.mockClear();
      const err = { just: 'anObject' };
      mockSocket.emitMockMessage(errType, err);
      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      const firstCallArg = mockStore.dispatch.mock.calls[0][0];
      expect(typeof firstCallArg).toBe('function');
      expect(() => firstCallArg(mockStore.dispatch)).toThrow(IoError);
    });
  });

  test('can use options to pass custom errorTypes', () => {
    const mockSocket = new MockSocket();
    const errTypes = ['bunk', 'junk', 'funk'];
    const ioMiddleware = createIoErrorMiddleware(mockSocket, {
      eventsToThrow: errTypes,
    });
    const mockStore = new MockStore();
    ioMiddleware(mockStore);
    errTypes.forEach((errType) => {
      mockStore.dispatch.mockClear();
      const err = new Error(`error ${errType}`);
      mockSocket.emitMockMessage(errType, err);
      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      const firstCallArg = mockStore.dispatch.mock.calls[0][0];
      expect(typeof firstCallArg).toBe('function');
      expect(() => firstCallArg(mockStore.dispatch)).toThrow(err);
    });
  });

  test('Passes object properties through to ioError object', () => {
    const mockSocket = new MockSocket();
    const ioMiddleware = createIoErrorMiddleware(mockSocket);
    const mockStore = new MockStore();
    ioMiddleware(mockStore);
    const errTypes = ['error', 'serverError', 'connect_failed'];
    errTypes.forEach((errType) => {
      mockStore.dispatch.mockClear();
      const err = { just: 'anObject', type: 'rad', message: 'I set the message' };
      mockSocket.emitMockMessage(errType, err);
      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      const firstCallArg = mockStore.dispatch.mock.calls[0][0];
      expect(typeof firstCallArg).toBe('function');
      try {
        firstCallArg(mockStore.dispatch);
        expect(true).toBe(false);
      } catch (e) {
        expect(e.just).toBe('anObject');
        expect(e.type).toBe('rad');
        expect(e).toBeInstanceOf(IoError);
        expect(e.message).toBe('I set the message');
      }
    });
  });
});
