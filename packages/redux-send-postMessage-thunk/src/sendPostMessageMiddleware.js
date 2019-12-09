
export const createSendPostMessageMiddleware = (windowSelector, actionsMap) => ({ dispatch }) => next => (action) => {
  const { targetWindow, targetWindowOrigin } = windowSelector();
  if (targetWindow && actionsMap.has(action.type)) {
    targetWindow.postMessage(action, targetWindowOrigin);
  }
  return next(action);
};
