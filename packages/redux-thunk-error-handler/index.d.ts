import { Action, Middleware, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk-recursion-detect';

declare function createThunkErrorCatchMiddleware<
  TState = {},
  TExtraThunkArg = undefined,
  TBasicAction extends Action = AnyAction,
>(config: { onError(error: unknown): TBasicAction | ThunkAction<unknown, TState, TExtraThunkArg, TBasicAction> | void }): Middleware<
  {},
  TState,
  ThunkDispatch<TState, TExtraThunkArg, TBasicAction>
>;

export declare function forceHandleError<
  TReturnType,
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
>(thunkFn: ThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction>): ThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction>; 

export declare const handleErrorsSymbol: symbol;
export default createThunkErrorCatchMiddleware;
