const express = require('express');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const actionHandlers = require('./actionHandlers.js');
const { normalizePort, onError } = require('./expressHelpers.js');
const http = require('http');

const port = normalizePort(process.env.PORT || '3001');
const app = express();
app.set('port', port);
app.use(bodyParser.json());
const io = socketIo();
io.on('connection', onSocketConnect);
const server = http.createServer(app);
io.attach(server, { transports: ['websocket'] });
server.listen(port);
server.on('error', onError);
server.on('listening', () => console.log(`Started express server on port ${server.address().port}`));

function onSocketConnect(socket) {
  socket.on('request', (action, respondFn) => {
    const { type } = action;
    if (!type) {
      console.error('Received request action with no `type` property', action);
      return socket.emit('serverError', 'bad request, no type');
    }
    if (!actionHandlers[type]) {
      console.error(`No actionHandler for type '${type}'`);
      return socket.emit('serverError', `bad request, no handler for type '${type}'`);
    }
    return actionHandlers[type](socket, action, respondFn);
  });
}
