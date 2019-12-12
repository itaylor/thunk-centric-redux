import { Action, Dispatch, Middleware } from 'redux';

interface MessageHandler {
  [key: string]: (message: MessageEvent) => Action
}

export const messageListener = async (domains: string[], messageHandlers: MessageHandler, dispatch: Dispatch, message: MessageEvent) => {
  const { data, origin } = message;
  const { type, payload } = data;
  const messageCallback = messageHandlers[type];
  const isValidOrigin = domains.some(domain => origin === domain);
  if (messageCallback && isValidOrigin) {
    await dispatch(messageCallback(payload));
  } else if (messageCallback && !isValidOrigin) {
    console.warn(`The origin ${origin} is not included in your domains configuration.`);
  }
};

export const windowMessageMiddleware = (domains : string[], messageHanlders: MessageHandler, listenTarget?: any) : Middleware => ({ dispatch }: {dispatch:Dispatch}) => {
  const targetToListenTo = listenTarget || window;
  targetToListenTo.addEventListener(
    'message',
    async (message: MessageEvent) => messageListener(domains, messageHanlders, dispatch, message)
  );
  return (next: Dispatch) => (action: Action) => next(action);
};

export default windowMessageMiddleware;
