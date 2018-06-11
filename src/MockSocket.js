module.exports = class MockSocket {
  constructor() {
    this.emit = jest.fn();
  }
};
