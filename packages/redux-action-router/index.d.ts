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

export declare function actionHandler<
  TState,
  TReturnType = any,
  TAction extends AnyAction = AnyAction
>(store: Store<TState, TAction>, next: (action: TAction | SetUrlAction | SetUrlRouteAction) => TReturnType, action: TAction | SetUrlAction | SetUrlRouteAction): TReturnType;

export declare function dispatcher<
  TState,
  TAction extends AnyAction = AnyAction,
  TValues = any
>(store: Store<TState, TAction>, match: (values: TValues) => TAction, values: TValues, path: string): void;

export interface RoutesMap<
  TBasicAction extends Action,
  TReturnType,
  TState,
  TExtraThunkArg,
  TValues = any
> {
  [url: string]: (values: TValues) => TBasicAction | ThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction>;
}

export interface UrlSupport {
  cleanUp(): void;
  processUrl(): void;
  setUrl(url: string): void;
}

export interface ActionRouterOpts<
  TState,
  TAction extends AnyAction = AnyAction,
  TStore extends Store<TState, TAction> = Store<TState, TAction>,
  TReturnType = any,
  TValues = any,
> {
  dispatcher(store: TStore, match: (values: TValues) => TAction, values: TValues, path: string): void;
  actionHandler(store: TStore, next: (action: TAction | SetUrlAction | SetUrlRouteAction) => TReturnType, action: TAction | SetUrlAction | SetUrlRouteAction): TReturnType;
  urlSupport: (onChange: (url: string) => void) => UrlSupport;
}

declare function createActionRouterMiddleware<
  TBasicAction extends Action,
  TReturnType,
  TState,
  TExtraThunkArg,
  TStore extends Store<TState, TBasicAction> & { dispatch: ThunkDispatch<TState, TExtraThunkArg, TBasicAction> } = Store<TState, TBasicAction> & { dispatch: ThunkDispatch<TState, TExtraThunkArg, TBasicAction> },
  TValues = any
>(routes: RoutesMap<TBasicAction, TReturnType, TState, TExtraThunkArg, TValues>, opts: ActionRouterOpts<TState, TBasicAction, TStore, TReturnType, TValues>): Middleware<
  ThunkDispatch<TState, TExtraThunkArg, TBasicAction | SetUrlAction | SetUrlRouteAction>,
  TState,
  ThunkDispatch<TState, TExtraThunkArg, TBasicAction>
>;

export default createActionRouterMiddleware;