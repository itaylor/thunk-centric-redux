import { Action, Middleware, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk-recursion-detect';

export type BufferActionsOptions = {
  startBuffered: boolean,
  startBufferActionType?: string,
  releaseBufferActionType?: string,
  bufferedActionTypes: Array<string> | 'all',
}

declare function createPostMessageDispatcherMiddleware<
  TState = {},
  TBasicAction extends Action = AnyAction,
  TExtraThunkArg = undefined,
>(options?: BufferActionsOptions): Middleware<
  {},
  TState,
  ThunkDispatch<TState, TExtraThunkArg, TBasicAction>
>;

export default createBufferActionsMiddleware;