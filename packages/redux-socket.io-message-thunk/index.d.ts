import { Action, Middleware, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk-recursion-detect';

export interface IoMessageSocket {
  on(eventName: string, listener: Function): void;
}

export interface IoMessageHandlers<
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
  TReturnTypeContraint = unknown
> {
  [type: string]: (message: any) => TBasicAction | ThunkAction<TState, TExtraThunkArg, TBasicAction, TReturnTypeContraint>;
}

declare function createIoMessageMiddleware<
  TState = {},
  TBasicAction extends Action = AnyAction,
  TExtraThunkArg = undefined,
  TReturnTypeContraint = unknown,
>(socket: IoMessageSocket, ioMessageHandlers: IoMessageHandlers<
    TState,
    TExtraThunkArg,
    TBasicAction,
    TReturnTypeContraint
  >, opts?: { eventName: string }): Middleware<
    {},
    TState,
    ThunkDispatch<TState, TExtraThunkArg, TBasicAction, TReturnTypeContraint>
  >;

export default createIoMessageMiddleware;