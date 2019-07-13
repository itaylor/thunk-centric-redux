import { Action, Middleware, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk-recursion-detect';

export declare function awaitableThunk<
  Name extends string,
  TBasicAction extends Action,
  TReturnType,
  TState,
  TExtraThunkArg,
>(name: Name, thunk: ThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction>):
  Required<AwaitableThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction, Name>>;

export declare function after(name: string): Promise<void>;
export declare function afterExactly(name: string, nCalls: number): Promise<void>;
export declare function afterAnother(name: string): Promise<void>;
export declare function afterAnotherExactly(name: string, nCalls: number): Promise<void>;
export declare function inProgress(name: string): Promise<void>;
export declare function isInProgress(name: string): boolean;
export declare function resetThunkState(): void;

export interface AwaitableThunkAction<
  TReturnType,
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
  AwaitableNames extends string = string
> extends ThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction> {
  (
    dispatch: AwaitableThunkDispatch<TState, TExtraThunkArg, TBasicAction, AwaitableNames>,
    getState: () => TState,
    extraArgument: TExtraThunkArg
  ): TReturnType;
  awaitableThunk?: AwaitableNames
}

export interface AwaitableThunkDispatch<
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
  AwaitableNames extends string = string,
> extends ThunkDispatch<TState, TExtraThunkArg, TBasicAction> {
  <TReturnType>(
    thunkAction: AwaitableThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction, AwaitableNames>
  ): TReturnType;
  <A extends TBasicAction>(action: A): A;
}

export type AwaitableThunkMiddleware<
  TState = unknown,
  TExtraThunkArg = undefined,
  TBasicAction extends Action = AnyAction,
  AwaitableNames extends string = string,
> = Middleware<
  AwaitableThunkDispatch<TState, TExtraThunkArg, TBasicAction, AwaitableNames>,
  TState
>;

declare const awaitableThunkMiddleware: AwaitableThunkMiddleware;

export default awaitableThunkMiddleware;
