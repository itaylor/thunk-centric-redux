const homeNavigate = () => (dispatch) => {
  dispatch({ type: 'setView', view: 'home' });
};
const socketIoNavigate = () => (dispatch) => {
  dispatch({ type: 'setView', view: 'socket.io' });
};

const routes = {
  '/': homeNavigate,
  '/home': homeNavigate,
  '/socket.io': socketIoNavigate,
};

export default routes;
