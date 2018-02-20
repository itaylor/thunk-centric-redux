import ExtendableError from 'es6-error';

class IoPromiseError extends ExtendableError {
  constructor({ request, response }) {
    const message =
      `Socket.io response error.  Expected type '${request.type}' but got '${response.type}'\n` +
      `response: ${JSON.stringify(response)}\n` +
      `request: ${JSON.stringify(request)}`;
    super(message);
    this.request = request;
    this.response = response;
    this.type = response.type;
  }
}

function createIoPromise(socket, opts) {
  const options = Object.assign({ eventName: 'request' }, opts);

  return function ioPromise(request) {
    let resolve;
    let reject;

    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    socket.emit(options.eventName, request, (response) => {
      if (!response) {
        throw new Error(`Missing response for request: ${JSON.stringify(request)}`);
      }
      if (response.type === request.type) {
        resolve(response);
      } else {
        reject(new IoPromiseError({ request, response }));
      }
    });
    return promise;
  };
}

export default createIoPromise;
export { IoPromiseError };
