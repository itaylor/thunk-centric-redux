
import createBufferActionsMiddleware from './bufferActionsMiddleware.js';

describe('bufferActionsMiddleware', () => {
  test('basic functionality, buffer actions until released', async () => {
    const mockStore = {
      dispatch: jest.fn(),
    };
    const middleware = createBufferActionsMiddleware({ bufferedActionTypes: ['foo', 'bar'] });
    const nextSpy = jest.fn();
    const initedMiddleware = middleware(mockStore);
    // starts unbuffered
    initedMiddleware(nextSpy)({ type: 'foo' });
    expect(nextSpy).toHaveBeenCalledWith({ type: 'foo' });
    nextSpy.mockReset();
    // buffering begins
    initedMiddleware(nextSpy)({ type: 'START_ACTION_BUFFER' });
    initedMiddleware(nextSpy)({ type: 'foo' });
    initedMiddleware(nextSpy)({ type: 'bar' });
    expect(nextSpy).not.toHaveBeenCalled();
    expect(mockStore.dispatch).not.toHaveBeenCalled();
    // actions not listed in bufferedActionTypes are dispatched normally to `next(action)`;
    initedMiddleware(nextSpy)({ type: 'fizz' });
    expect(nextSpy).toHaveBeenCalledWith({ type: 'fizz' });

    initedMiddleware(nextSpy)({ type: 'RELEASE_ACTION_BUFFER' });
    // releasing the buffer dispatches all the buffered actions
    nextSpy.mockReset();
    expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'foo' });
    expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'bar' });
    expect(nextSpy).not.toHaveBeenCalled();
    initedMiddleware(nextSpy)({ type: 'foo' });
    expect(nextSpy).toHaveBeenCalledWith({ type: 'foo' });
  });

  test('startBuffered option', async () => {
    const mockStore = {
      dispatch: jest.fn(),
    };
    const middleware = createBufferActionsMiddleware({
      startBuffered: true,
      bufferedActionTypes: ['foo', 'bar'],
    });
    const nextSpy = jest.fn();
    const initedMiddleware = middleware(mockStore);
    initedMiddleware(nextSpy)({ type: 'foo' });
    initedMiddleware(nextSpy)({ type: 'bar' });
    expect(nextSpy).not.toHaveBeenCalled();
    expect(mockStore.dispatch).not.toHaveBeenCalled();
    // actions not listed in bufferedActionTypes are dispatched normally to `next(action)`;
    initedMiddleware(nextSpy)({ type: 'fizz' });
    expect(nextSpy).toHaveBeenCalledWith({ type: 'fizz' });

    initedMiddleware(nextSpy)({ type: 'RELEASE_ACTION_BUFFER' });
    // releasing the buffer dispatches all the buffered actions
    nextSpy.mockReset();
    expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'foo' });
    expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'bar' });
    expect(nextSpy).not.toHaveBeenCalled();
    initedMiddleware(nextSpy)({ type: 'foo' });
    expect(nextSpy).toHaveBeenCalledWith({ type: 'foo' });
  });

  test('bufferedActionTypes === \'all\' option buffers all types', async () => {
    const mockStore = {
      dispatch: jest.fn(),
    };
    const middleware = createBufferActionsMiddleware({
      bufferedActionTypes: 'all',
    });
    const nextSpy = jest.fn();
    const initedMiddleware = middleware(mockStore);
    // buffering begins
    initedMiddleware(nextSpy)({ type: 'START_ACTION_BUFFER' });
    initedMiddleware(nextSpy)({ type: 'foo' });
    initedMiddleware(nextSpy)({ type: 'bar' });
    initedMiddleware(nextSpy)({ type: 'fizz' });
    expect(nextSpy).not.toHaveBeenCalled();
    initedMiddleware(nextSpy)({ type: 'RELEASE_ACTION_BUFFER' });
    // releasing the buffer dispatches all the buffered actions
    expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'foo' });
    expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'bar' });
    expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'fizz' });
  });

  test('provide your own types for start/release buffer', async () => {
    const mockStore = {
      dispatch: jest.fn(),
    };
    const middleware = createBufferActionsMiddleware({
      startBufferActionType: 'pause',
      releaseBufferActionType: 'play',
      bufferedActionTypes: ['foo', 'bar'],
    });
    const nextSpy = jest.fn();
    const initedMiddleware = middleware(mockStore);
    // starts unbuffered
    initedMiddleware(nextSpy)({ type: 'foo' });
    expect(nextSpy).toHaveBeenCalledWith({ type: 'foo' });
    nextSpy.mockReset();
    // buffering begins
    initedMiddleware(nextSpy)({ type: 'pause' });
    initedMiddleware(nextSpy)({ type: 'foo' });
    initedMiddleware(nextSpy)({ type: 'bar' });
    expect(nextSpy).not.toHaveBeenCalled();
    expect(mockStore.dispatch).not.toHaveBeenCalled();
    // actions not listed in bufferedActionTypes are dispatched normally to `next(action)`;
    initedMiddleware(nextSpy)({ type: 'fizz' });
    expect(nextSpy).toHaveBeenCalledWith({ type: 'fizz' });

    initedMiddleware(nextSpy)({ type: 'play' });
    // releasing the buffer dispatches all the buffered actions
    nextSpy.mockReset();
    expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'foo' });
    expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'bar' });
    expect(nextSpy).not.toHaveBeenCalled();
    initedMiddleware(nextSpy)({ type: 'foo' });
    expect(nextSpy).toHaveBeenCalledWith({ type: 'foo' });
  });
});
