import IoPromiseError from './IoPromiseError.js';

export { IoPromiseError };

export default function createIoPromise(socket, opts) {
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
