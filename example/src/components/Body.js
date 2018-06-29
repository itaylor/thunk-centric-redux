import React from 'react';
import PropTypes from 'prop-types';
import SocketIoContent from './SocketIoContent.js';
import HomeContent from './HomeContent.js';
import ErrorHandlerContent from './ErrorHandlerContent.js';

export default function Body({ activeView }) {
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

Body.propTypes = {
  activeView: PropTypes.string,
}
