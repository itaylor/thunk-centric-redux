import { Action, Middleware, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk-recursion-detect';

declare function createThunkErrorCatchMiddleware<
  TState = {},
  TExtraThunkArg = undefined,
  TBasicAction extends Action = AnyAction,
  TReturnTypeConstraint = unknown,
>(config: { onError(error: unknown): TBasicAction | ThunkAction<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint> | void }): Middleware<
  {},
  TState,
  ThunkDispatch<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint>
>;

export declare function forceHandleError<
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
  TReturnTypeConstraint = unknown,
  TReturnType extends TReturnTypeConstraint = TReturnTypeConstraint
>(thunkFn: ThunkAction<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint, TReturnType>): ThunkAction<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint, TReturnType>; 

export declare const handleErrorsSymbol: symbol;
export default createThunkErrorCatchMiddleware;
