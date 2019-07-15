import { Action, Middleware, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk-recursion-detect';

export interface IoMessageSocket {
  on(eventName: string, listener: Function): void;
}

export interface IoMessageHandlers<
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
> {
  [type: string]: (message: any) => TBasicAction | ThunkAction<TState, TExtraThunkArg, TBasicAction, unknown>;
}

declare function createIoMessageMiddleware<
  TState = {},
  TBasicAction extends Action = AnyAction,
  TExtraThunkArg = undefined,
>(socket: IoMessageSocket, ioMessageHandlers: IoMessageHandlers<
    TState,
    TExtraThunkArg,
    TBasicAction
  >, opts?: { eventName: string }): Middleware<
    {},
    TState,
    ThunkDispatch<TState, TExtraThunkArg, TBasicAction>
  >;

export default createIoMessageMiddleware;