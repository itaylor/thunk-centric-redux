export const initialState = {
  view: 'home',
};

export default function rootReducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    case 'setView':
      return setView(state, action);
    default:
      return state;
  }
}

function setView(state, action) {
  return { ...state, view: action.view };
}
