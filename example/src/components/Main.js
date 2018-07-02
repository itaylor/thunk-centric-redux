import React from 'react';
import PropTypes from 'prop-types';
import SocketIoContent from './SocketIoContent.js';
import HomeContent from './HomeContent.js';
import ErrorHandlerContent from './ErrorHandlerContent.js';

export default function Main({ activeView }) {
  return <main>{ getActiveContent(activeView) }</main>
}

function getActiveContent(activeView) {
  switch (activeView) {
    case 'socket.io':
      return <SocketIoContent/>;
    case 'errorHandler':
      return <ErrorHandlerContent/>;
    case 'home':
    default:
      return <HomeContent/>;
  }
}

Main.propTypes = {
  activeView: PropTypes.string,
}
