import ExtendableError from 'es6-error';

export default class IoPromiseError extends ExtendableError {
  constructor({ request, response }) {
    const message = `Socket.io response error.  Expected type '${request.type}' but got '${response.type}'\n`
      + `response: ${JSON.stringify(response)}\n`
      + `request: ${JSON.stringify(request)}`;
    super(message);
    this.request = request;
    this.response = response;
    this.type = response.type;
  }
}
