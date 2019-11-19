const {
  messageListener,
  windowMessageMiddleware,
} = require('./redux-window-message-thunk');

const consoleMock = {
  warn: jest.fn(),
};

global.console = consoleMock;

describe('redux-window-message-thunk', () => {
  let simpleMessage;
  beforeEach(() => {
    consoleMock.warn.mockReset();
    simpleMessage = {
      type: 'message',
      origin: 'origin',
      data: {
        type: 'type',
        payload: {
          data: true,
        },
      },
    };
  });
  describe('messageListener', () => {
    it('should fire callback if type and origin are valid', async () => {
      const typeMock = jest.fn();
      const dispatchMock = jest.fn();
      await messageListener(['origin'], { type: typeMock }, dispatchMock, simpleMessage);
      expect(dispatchMock).toBeCalledTimes(1);
      expect(typeMock).toBeCalledTimes(1);
      expect(typeMock.mock.calls[0][0]).toEqual(simpleMessage.data.payload);
      expect(consoleMock.warn).toBeCalledTimes(0);
    });
    it('should not fire callback if origin is not valid', async () => {
      const typeMock = jest.fn();
      const dispatchMock = jest.fn();
      await messageListener(['shady-place'], { type: typeMock }, dispatchMock, simpleMessage);
      expect(dispatchMock).toBeCalledTimes(0);
      expect(typeMock).toBeCalledTimes(0);
      expect(consoleMock.warn).toBeCalledTimes(1);
    });
    it('should not fire any callbacks if nothing is setup correctly', async () => {
      const typeMock = jest.fn();
      const dispatchMock = jest.fn();
      await messageListener(['shady-place'], {}, dispatchMock, simpleMessage);
      expect(dispatchMock).toBeCalledTimes(0);
      expect(typeMock).toBeCalledTimes(0);
      expect(consoleMock.warn).toBeCalledTimes(0);
    });
  });
  describe('windowMessageMiddleware', () => {
    it('should return an api correct thunk', () => {
      const middlewareOut = windowMessageMiddleware([], {});
      const apiMock = jest.fn();
      middlewareOut({})(apiMock)({ test: true });
      expect(apiMock.mock.calls[0][0]).toEqual({ test: true });
    });
    it('should call our listener on an event that does exist', async () => {
      const typeMock = jest.fn();
      const dispatchMock = jest.fn();
      const baseMiddleware = windowMessageMiddleware([''], { type: typeMock });
      baseMiddleware({ dispatch: dispatchMock });
      window.postMessage(simpleMessage.data, '*');
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(dispatchMock).toBeCalledTimes(1);
      expect(typeMock).toBeCalledTimes(1);
      expect(typeMock.mock.calls[0][0]).toEqual(simpleMessage.data.payload);
      expect(consoleMock.warn).toBeCalledTimes(0);
    });
    it('should not call our listener on an event type that does not exist', async () => {
      const typeMock = jest.fn();
      const dispatchMock = jest.fn();
      const baseMiddleware = windowMessageMiddleware([''], { notCalled: typeMock });
      baseMiddleware({ dispatch: dispatchMock });
      window.postMessage(simpleMessage.data, '*');
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(dispatchMock).toBeCalledTimes(0);
      expect(typeMock).toBeCalledTimes(0);
      expect(consoleMock.warn).toBeCalledTimes(0);
    });
  });
});
