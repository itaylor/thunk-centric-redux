import { AnyAction, Action, Middleware, Store } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk-recursion-detect';

export interface SetUrlAction {
  type: 'setUrl',
  url: string,
}

export interface SetUrlRouteAction {
  type: 'setUrlRoute',
  url: string,
}

export declare function processCurrentUrl(): void;

export declare function actionHandler<
  TState = {},
  TExtraThunkArg = undefined,
  TBasicAction extends Action = AnyAction,
  TAction extends TBasicAction | ThunkAction<TState, TExtraThunkArg, TBasicAction, unknown> = TBasicAction | ThunkAction<TState, TExtraThunkArg, TBasicAction, unknown>,
  TReturnType = unknown,
  TStore extends Store<TState, TBasicAction> & { dispatch: ThunkDispatch<TState, TExtraThunkArg, TBasicAction> } = 
    Store<TState, TBasicAction> & { dispatch: ThunkDispatch<TState, TExtraThunkArg, TBasicAction> }
>(store: TStore, next: (action: TAction) => TReturnType, action: TAction): TReturnType;

export declare function dispatcher<
  TValues,
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
>(
  store: { dispatch: ThunkDispatch<TState, TExtraThunkArg, TBasicAction> },
  match: (values: TValues) => TBasicAction | ThunkAction<TState, TExtraThunkArg, TBasicAction, unknown>,
  values: TValues,
  path: string
): void;

export interface RoutesMap<
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
  TValues = any
> {
  [url: string]: (values: TValues) => TBasicAction | ThunkAction<TState, TExtraThunkArg, TBasicAction, unknown>;
}

export interface UrlSupport {
  cleanUp(): void;
  processUrl(): void;
  setUrl(url: string): void;
}

export interface ActionRouterOpts<
  TValues,
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
  TStore extends Store<TState, TBasicAction> & { dispatch: ThunkDispatch<TState, TExtraThunkArg, TBasicAction> } = 
    Store<TState, TBasicAction> & { dispatch: ThunkDispatch<TState, TExtraThunkArg, TBasicAction> }
> {
  dispatcher?: (
    store: TStore,
    match: (values: TValues) => TBasicAction | ThunkAction<TState, TExtraThunkArg, TBasicAction, unknown>,
    values: TValues,
    path: string
  ) => void;
  actionHandler?: <
    TAction extends TBasicAction | ThunkAction<TState, TExtraThunkArg, TBasicAction, unknown> = TBasicAction | ThunkAction<TState, TExtraThunkArg, TBasicAction, unknown>,
    TReturnType = unknown,
  >(store: TStore, next: (action: TAction) => TReturnType, action: TAction) => TReturnType;
  urlSupport?: (onChange: (url: string) => void) => UrlSupport;
}

declare function createActionRouterMiddleware<
  TState = {},
  TExtraThunkArg = undefined,
  TBasicAction extends Action = AnyAction,
  TValues = any,
  TStore extends Store<TState, TBasicAction> & { dispatch: ThunkDispatch<TState, TExtraThunkArg, TBasicAction> } = 
    Store<TState, TBasicAction> & { dispatch: ThunkDispatch<TState, TExtraThunkArg, TBasicAction> }
>(
  routes: RoutesMap<TState, TExtraThunkArg, TBasicAction, TValues>,
  opts: ActionRouterOpts<TValues, TState, TExtraThunkArg, TBasicAction, TStore>
): Middleware<
  ThunkDispatch<TState, TExtraThunkArg, TBasicAction>,
  TState,
  ThunkDispatch<TState, TExtraThunkArg, TBasicAction>
>;

export default createActionRouterMiddleware;