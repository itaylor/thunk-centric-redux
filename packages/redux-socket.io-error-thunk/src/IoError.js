import ExtendableError from 'es6-error';

export default class IoError extends ExtendableError {
  constructor(msg = {}) {
    let message = '';
    let type = 'error';
    if (typeof msg === 'string') {
      message = msg;
    }
    const { type: msgType, message: msgMessage } = msg;
    type = msgType || type;
    message = msgMessage || message;

    if (!message) {
      message = JSON.stringify(msg);
    }
    super(message);
    this.type = type;
  }
}
