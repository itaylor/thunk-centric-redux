import { Store, AnyAction, Action, Middleware } from 'redux';
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

export declare function actionHandler<TAction, TReturnType>(next: (action: TAction) => TReturnType, action: TAction): TReturnType;

export declare function dispatcher<
  TValues,
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
  TReturnTypeConstraint = unknown
>(
  store: { dispatch: ThunkDispatch<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint> },
  match: (values: TValues) => TBasicAction | ThunkAction<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint>,
  values: TValues,
  path: string
): void;

export interface RoutesMap<
  TState,
  TExtraThunkArg,
  TBasicAction extends Action,
  TReturnTypeConstraint = unknown,
  TValues = any
> {
  [url: string]: (values: TValues) => TBasicAction | ThunkAction<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint>;
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
  TReturnTypeConstraint = unknown
> {
  dispatcher?: (
    store: { dispatch: ThunkDispatch<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint> },
    match: (values: TValues) => TBasicAction | ThunkAction<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint>,
    values: TValues,
    path: string
  ) => void;
  actionHandler?: <TAction, TReturnType>(next: (action: TAction) => TReturnType, action: TAction) => TReturnType;
  urlSupport?: (onChange: (url: string) => void) => UrlSupport;
}

declare function createActionRouterMiddleware<
  TState = {},
  TExtraThunkArg = undefined,
  TBasicAction extends Action = AnyAction,
  TReturnTypeConstraint = unknown,
  TValues = any
>(
  routes: RoutesMap<TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint, TValues>,
  opts: ActionRouterOpts<TValues, TState, TExtraThunkArg, TBasicAction, TReturnTypeConstraint>
): Middleware<
  ThunkDispatch<TState, TExtraThunkArg, TBasicAction>,
  TState,
  ThunkDispatch<TState, TExtraThunkArg, TBasicAction>
>;

export default createActionRouterMiddleware;