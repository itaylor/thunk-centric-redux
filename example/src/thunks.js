
export function socketIoRequest(withError = false) {
  return async (dispatch, getState, ioPromise) => {
    try {
      const { data } = await ioPromise({ type: 'ioPromiseFetch', withError });
      dispatch({ type: 'ioPromiseSuccess', data });
    } catch (err) {
      dispatch({ type: 'ioPromiseError', err });
    }
  };
}
