import { Action, Middleware } from 'redux';
import { ThunkAction } from 'redux-thunk-recursion-detect';

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
export declare function inProgress(name: string): Promise<void>;
export declare function isInProgress(name: string): boolean;
export declare function resetThunkState(): void;

export interface AwaitableThunkAction<
  TReturnType,
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
  AwaitableNames extends string = string
> {
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
> {
  <TReturnType>(
    thunkAction: AwaitableThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction, AwaitableNames>
  ): TReturnType;
  <A extends TBasicAction>(action: A): A;
}

declare function awaitableThunkMiddleware<
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
  AwaitableNames extends string = string,
>(): Middleware<
  AwaitableThunkDispatch<TState, TExtraThunkArg, TBasicAction, AwaitableNames>,
  TState,
  AwaitableThunkDispatch<TState, TExtraThunkArg, TBasicAction, AwaitableNames>
>;

export default awaitableThunkMiddleware;
