import ExtendableError from 'es6-error';
import { Middleware } from 'redux';
import { ThunkDispatch } from 'redux-thunk-recursion-detect';

export interface IoError extends ExtendableError {
  message: string;
  type: string;
}

export interface IoErrorSocket {
  on(eventName: string, listener: Function): void;
}

declare function createIoErrorMiddleware<TState = {}>(socket: IoErrorSocket, opts?: { eventsToThrow: string[] }): Middleware<
    {},
    TState,
    ThunkDispatch<TState, any, any, any>
  >;

export default createIoErrorMiddleware;
