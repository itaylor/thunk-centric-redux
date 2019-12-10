import { Action, Middleware, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk-recursion-detect';

interface PostMessageWindowType {
  targetWindow: HTMLIFrameElement,
  targetWindowOrigin: string,
}

export interface PostMessageActionMap<
  TState,
  TReturnType,
  TExtraThunkArg,
  TBasicAction extends Action,
> {
  [type: string]: (message: any) => TBasicAction | ThunkAction<unknown, TState, TExtraThunkArg, TBasicAction>;
}

declare function createPostMessageDispatcherMiddleware<
  TReturnType,
  TState = {},
  TBasicAction extends Action = AnyAction,
  TExtraThunkArg = undefined,
>(windowSelector: () => PostMessageWindowType, actionsMap: PostMessageActionMap<
  TState,
  TReturnType,
  TExtraThunkArg,
  TBasicAction
>): Middleware<
  {},
  TState,
  ThunkDispatch<TState, TExtraThunkArg, TBasicAction>
>;

export default createPostMessageDispatcherMiddleware;