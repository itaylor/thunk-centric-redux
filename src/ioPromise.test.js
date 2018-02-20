const createIoPromise = require('../dist/ioPromise.cjs.js').default;
const IoPromiseError = require('../dist/ioPromise.cjs.js').IoPromiseError;
const MockSocket = require('../mocks/MockSocket.js');

describe('ioMiddleware', () => {
  test('ioPromise resolves normally on received response', async () => {
    const mockSocket = new MockSocket();
    const ioPromise = createIoPromise(mockSocket);
    const requestAction = { type: 'sendSomeData', payload: 'junk' };
    scheduleFakeResponse(mockSocket, { type: 'sendSomeData', payload: 'this is a response' });
    const resp = await ioPromise(requestAction);
    expect(resp).toEqual({ type: 'sendSomeData', payload: 'this is a response' });
  });

  test('ioPromise rejects on response with type that is different from request', async () => {
    const mockSocket = new MockSocket();
    const ioPromise = createIoPromise(mockSocket);
    const requestAction = { type: 'sendSomeData', payload: 'junk' };

    try {
      await Promise.all([
        scheduleFakeResponse(mockSocket, { type: 'someErrorType', payload: 'this is an error' }),
        ioPromise(requestAction),
      ]);
      expect(false).toBe(true); // should never get here, this should have thrown.
    } catch (e) {
      expect(e instanceof IoPromiseError).toBe(true);
      expect(e).toMatchSnapshot();
    }
  });

  test('ioPromise throws on missing response', async () => {
    const mockSocket = new MockSocket();
    const ioPromise = createIoPromise(mockSocket);
    const requestAction = { type: 'sendSomeData', payload: 'junk' };

    try {
      await Promise.all([
        scheduleFakeResponse(mockSocket, undefined),
        ioPromise(requestAction),
      ]);
      expect(false).toBe(true); // should never get here, this should have thrown.
    } catch (e) {
      expect(e instanceof Error).toBe(true);
      expect(e).toMatchSnapshot();
    }
  });

  async function scheduleFakeResponse(mockSocket, responseAction) {
    await sleep();
    const [, , ackFn] = mockSocket.emit.mock.calls[0];
    ackFn(responseAction);
  }

  function sleep(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});
