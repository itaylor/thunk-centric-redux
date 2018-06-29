import React from 'react';
import PropTypes from 'prop-types';

const options = [
  { url: 'home', text: 'Home' },
  { url: 'socket.io', text: 'Socket.io Examples' },
  { url: 'errorHandler', text: 'Error handler Examples' }
]

export default function NavBar({ activeView }) {
  return <ul> {
     options.map(({ url, text }) =>
      <li key={ url } className={  activeView === url ? 'active' : '' }>
        <a href={`#/${url}`}>{ text }</a>
      </li>
    )
  }
  </ul>
}

NavBar.propTypes = {
  view: PropTypes.string,
}
