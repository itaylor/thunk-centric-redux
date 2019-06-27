import ExtendableError from 'es6-error';
import { Action, Middleware } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk-recursion-detect';

export interface IoError extends ExtendableError {
  message: string;
  type: string;
}

export interface IoErrorSocket {
  on(eventName: string, listener: Function): void;
}

declare function createIoErrorMiddleware<
  TBasicAction extends Action,
  TReturnType,
  TState,
  TExtraThunkArg,
>(socket: IoErrorSocket, opts?: { eventsToThrow: string[] }): Middleware<
    {},
    TState,
    ThunkDispatch<TState, TExtraThunkArg, TBasicAction>
  >;
