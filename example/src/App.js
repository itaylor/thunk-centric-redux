import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import Body from './components/Body.js';
import NavBar from './components/NavBar.js';

const mapStateToProps = (state) => {
  return {
    activeView: state.view,
  }
}

class App extends Component {

  render() {
    const { activeView } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Thunk-centric-redux Example</h1>
          <NavBar activeView={ activeView } />
        </header>
        <Body activeView={ activeView }/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
