import { Action, Middleware } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk-recursion-detect';

interface IoMessageSocket {
  on(eventName: string, listener: Function): void;
}

interface IoMessageHandlers<
  TBasicAction extends Action,
  TReturnType,
  TState,
  TExtraThunkArg,
> {
  [type: string]: (message: any) => TBasicAction | ThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction>;
}

declare function createIoMessageMiddleware<
  TBasicAction extends Action,
  TReturnType,
  TState,
  TExtraThunkArg,
>(socket: IoMessageSocket, ioMessageHandlers: IoMessageHandlers<
    TBasicAction,
    TReturnType,
    TState,
    TExtraThunkArg
  >, opts?: { eventName: string }): Middleware<
    {},
    TState,
    ThunkDispatch<TState, TExtraThunkArg, TBasicAction>
  >;