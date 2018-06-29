import { createStore, applyMiddleware, compose } from 'redux';
import createThunkErrorHandlerMiddleware from 'redux-thunk-error-handler';
import createRouterMiddleware from 'redux-action-router';
import routes from './routes.js';
import thunkMiddleware from 'redux-thunk-recursion-detect';
import rootReducer from './rootReducer.js';
import errorHandler from './errorHandler.js';

const initialState = {};
const enhancers = [];

const middleware = [
  createThunkErrorHandlerMiddleware(errorHandler),
  createRouterMiddleware(routes),
  thunkMiddleware,
];

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
)

export default store
