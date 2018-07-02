/* global window */
import { createStore, applyMiddleware, compose } from 'redux';
import createThunkErrorHandlerMiddleware from 'redux-thunk-error-handler';
import createRouterMiddleware from 'redux-action-router';
import routes from './routes.js';
import thunkMiddleware from 'redux-thunk-recursion-detect';
import createIoPromise from 'socket.io-promise';
import rootReducer from './rootReducer.js';
import errorHandler from './errorHandler.js';
import io from 'socket.io-client';

const hostname = `${window.location.hostname}:3001`;
const socket = io(hostname, { transports: ['websocket'], upgrade: false });
const ioPromise = createIoPromise(socket);

const initialState = {};
const enhancers = [];

const middleware = [
  createThunkErrorHandlerMiddleware(errorHandler),
  createRouterMiddleware(routes),
  thunkMiddleware.withExtraArgument(ioPromise),
];

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
);

export default store;
