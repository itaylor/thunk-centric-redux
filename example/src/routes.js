const routes = {
  '/': homeNavigate,
  '/home': homeNavigate,
  '/socket.io': socketIoNavigate,
};
export default routes;

function homeNavigate() {
  return dispatch => dispatch({ type: 'setView', view: 'home' });
}

function socketIoNavigate() {
  return (dispatch) => {
    dispatch({ type: 'ioPromiseClear' });
    dispatch({ type: 'setView', view: 'socket.io' });
  };
}
