import { Action, Middleware, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk-recursion-detect';

export declare function awaitableThunk<
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
  TName extends string,
  TReturnTypeConstraint,
  TReturnType extends TReturnTypeConstraint,
>(name: TName, thunk: ThunkAction<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint, TReturnType>):
  Required<AwaitableThunkAction<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint, TReturnType, TName>>;

export declare function after(name: string): Promise<void>;
export declare function afterExactly(name: string, nCalls: number): Promise<void>;
export declare function inProgress(name: string): Promise<void>;
export declare function isInProgress(name: string): boolean;
export declare function resetThunkState(): void;

export interface AwaitableThunkAction<
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
  TReturnTypeConstraint = unknown,
  TReturnType extends TReturnTypeConstraint = TReturnTypeConstraint,
  TAwaitableNames extends string = string
> extends ThunkAction<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint, TReturnType> {
  (
    dispatch: AwaitableThunkDispatch<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint, TAwaitableNames>,
    getState: () => TState,
    extraArgument: TExtraThunkArg
  ): TReturnType;
  awaitableThunk?: TAwaitableNames;
}

export interface AwaitableThunkDispatch<
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
  TReturnTypeConstraint = unknown,
  TAwaitableNames extends string = string,
> extends ThunkDispatch<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint> {
  <TReturnType>(
    thunkAction: AwaitableThunkAction<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint, TReturnType, TAwaitableNames>
  ): TReturnType;
  <A extends TBasicAction>(action: A): A;
}

export type AwaitableThunkMiddleware<
  TState = {},
  TExtraThunkArg = undefined,
  TBasicAction extends Action = AnyAction,
  TReturnTypeConstraint = unknown,
  TAwaitableNames extends string = string,
> = Middleware<
  AwaitableThunkDispatch<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint, TAwaitableNames>,
  TState
>;

declare const awaitableThunkMiddleware: AwaitableThunkMiddleware;

export default awaitableThunkMiddleware;
