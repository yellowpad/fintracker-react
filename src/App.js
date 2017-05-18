import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BtcTracker from './Components/BtcTracker'

class App extends Component {
  render() {
    return (
      <div className="App">
        <BtcTracker />
      </div>
    );
  }
}

export default App;
