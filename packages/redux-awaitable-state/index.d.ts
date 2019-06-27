import { AnyAction, Store } from Redux;

export declare function stateMatch<TState>(evalFn: (state: TState) => boolean): Promise<void>;
export declare function futureStateMatch<TState>(evalFn: (state: TState) => boolean): Promise<void>;
export declare function resetSubscribers(): void;


declare function awaitableState<TState>(_store: Store<TState>): void;

export default awaitableState;