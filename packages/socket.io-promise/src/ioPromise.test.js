import createIoPromise, { IoPromiseError } from '../dist/ioPromise.esm.js';
import MockSocket from './MockSocket.js';

describe('ioPromise', () => {
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
