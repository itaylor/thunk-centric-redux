import { Action, Middleware, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk-recursion-detect';

export type PostMessageWindowType = {
  targetWindow: Window,
  targetWindowOrigin: string,
}

declare function createPostMessageDispatcherMiddleware<
  TState = {},
  TBasicAction extends Action = AnyAction,
  TExtraThunkArg = undefined,
>(windowSelector: () => PostMessageWindowType, actionsMap: Array<string>): Middleware<
  {},
  TState,
  ThunkDispatch<TState, TExtraThunkArg, TBasicAction>
>;

export default createPostMessageDispatcherMiddleware;