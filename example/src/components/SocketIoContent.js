import React from 'react';
import { socketIoRequest } from '../thunks.js'
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    successes: state.ioPromiseSuccesses,
    failures: state.ioPromiseErrors,
  }
}

function SocketIoContent({ dispatch, successes, failures }) {
  function makeRequest() {
    dispatch(socketIoRequest(false));
  }
  function makeErrorRequest() {
    dispatch(socketIoRequest(true));
  }
  return <div>
    <p>
      A super simple socket.io-promise example.
    </p>
    <p>
      Every time you click the button the `socketIoRequest` thunk will be dispatched.
      If the response results in an successful response, it goes into the box on the left.
    </p>
    <button onClick={ makeRequest }>Make request</button>
    <button onClick={ makeErrorRequest }>Make error request</button>
    <div>
      <h3>Successful Responses</h3>
      <div>
        { successes.map(success => <div><span role='img' aria-label='check'>✅</span> { JSON.stringify(success) }</div>) }
      </div>
      <h3>Failed Responses</h3>
      <div>
        { failures.map(failure => <div><span role='img' aria-label='error'>🚫</span> { JSON.stringify(failure) }</div>) }
      </div>
    </div>
  </div>
}

export default connect(mapStateToProps)(SocketIoContent);
