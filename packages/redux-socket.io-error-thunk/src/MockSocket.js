export default class MockSocket {
  constructor() {
    this.emit = jest.fn();
    this.mappedOns = {};
  }

  on(msgName, fn) {
    this.mappedOns[msgName] = fn;
  }

  emitMockMessage(msgName, action) {
    if (this.mappedOns[msgName]) {
      this.mappedOns[msgName](action);
    }
  }
}
