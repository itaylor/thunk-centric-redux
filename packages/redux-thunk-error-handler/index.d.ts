import { Action, Middleware, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk-recursion-detect';

declare function createThunkErrorCatchMiddleware<
  TState = {},
  TExtraThunkArg = undefined,
  TBasicAction extends Action = AnyAction,
>(config: { onError(error: unknown): TBasicAction | ThunkAction<TState, TExtraThunkArg, TBasicAction, unknown> | void }): Middleware<
  {},
  TState,
  ThunkDispatch<TState, TExtraThunkArg, TBasicAction>
>;

export declare function forceHandleError<
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
  TReturnType 
>(thunkFn: ThunkAction<TState, TExtraThunkArg, TBasicAction, TReturnType>): ThunkAction<TState, TExtraThunkArg, TBasicAction, TReturnType>; 

export declare const handleErrorsSymbol: symbol;
export default createThunkErrorCatchMiddleware;
