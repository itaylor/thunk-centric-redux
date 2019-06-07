let subscribers;
let store;
resetSubscribers();

export default function awaitableState(_store) {
  store = _store;
  store.subscribe(subscriptionHandler);
  function subscriptionHandler() {
    const newState = store.getState();
    const subscribersToResolve = [];
    for (const subscriber of subscribers) { // eslint-disable-line no-restricted-syntax
      const { evalFn } = subscriber;
      if (evalFn(newState)) {
        subscribersToResolve.push(subscriber);
      }
    }
    subscribersToResolve.forEach((subscriber) => {
      subscribers.delete(subscriber);
      subscriber.resolve();
    });
  }
}

export function stateMatch(evalFn) {
  const currState = store.getState();
  if (evalFn(currState)) {
    return Promise.resolve();
  }
  return futureStateMatch(evalFn);
}

export function futureStateMatch(evalFn) {
  let resolve;
  let reject;
  const p = new Promise(res => resolve = res, rej => reject = rej); // eslint-disable-line no-return-assign
  subscribers.add({ evalFn, resolve, reject });
  return p;
}

export function resetSubscribers() {
  subscribers = new Set();
}
