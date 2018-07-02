import React from 'react';
import { socketIoRequest } from '../thunks.js'
import { connect } from 'react-redux';
import './SocketIoContent.css';

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
  return <div className='SocketIoContent'>
    <p>
      A super simple socket.io-promise example.
    </p>
    <p>
      Every time you click the button the `socketIoRequest` thunk will be dispatched.
      <br/>
      This will make a call to the server using the socket.io websocket.
      <br/>
      Succesful requests go to the box on the left, failure on the right.
    </p>
    <button onClick={ makeRequest }>Make request</button>
    <button onClick={ makeErrorRequest }>Make error request</button>
    <section>
      <aside>
        <h3>Successful Responses</h3>
        <div>
          { successes.map(success => <div><span role='img' aria-label='check'>✅</span> { JSON.stringify(success) }</div>) }
        </div>
      </aside>
      <aside>
        <h3>Failed Responses</h3>
        <div>
          { failures.map(failure => <div><span role='img' aria-label='error'>🚫</span> { JSON.stringify(failure) }</div>) }
        </div>
      </aside>
    </section>
  </div>
}

export default connect(mapStateToProps)(SocketIoContent);
