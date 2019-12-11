
export const createSendPostMessageMiddleware = (windowSelector, actionTypes) => {
  const actionTypesSet = new Set(actionTypes);
  return ({ dispatch }) => next => (action) => {
    if (actionTypesSet.has(action.type)) {
      const { targetWindow, targetWindowOrigin } = windowSelector();
      if (targetWindow) {
        targetWindow.postMessage(action, targetWindowOrigin);
      }
    }
    return next(action);
  };
};
