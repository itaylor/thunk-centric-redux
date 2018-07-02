import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Main from './components/Main.js';
import NavBar from './components/NavBar.js';

const mapStateToProps = (state) => {
  return {
    activeView: state.view,
  }
}

class App extends Component {

  render() {
    const { activeView = 'home' } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Thunk-centric-redux Example</h1>
          <NavBar activeView={ activeView } />
        </header>
        <Main activeView={ activeView }/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
