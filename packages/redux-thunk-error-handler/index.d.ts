import { Action, Middleware } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk-recursion-detect';

declare function createThunkErrorCatchMiddleware<
  TBasicAction extends Action,
  TReturnType,
  TState,
  TExtraThunkArg,
>(config: { onError(error: unknown): TBasicAction | ThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction> | void }): Middleware<
  {},
  TState,
  ThunkDispatch<TState, TExtraThunkArg, TBasicAction>
>;

export declare function forceHandleError<
  TBasicAction extends Action,
  TReturnType,
  TState,
  TExtraThunkArg,
>(thunkFn: ThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction>): TBasicAction | ThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction>; 

export declare const handleErrorsSymbol: symbol;
export default createThunkErrorCatchMiddleware;
