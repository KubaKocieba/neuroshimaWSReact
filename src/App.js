import React, { Component } from 'react';
import {Setup} from './components/Setup.js'
import HexBoard from './components/hexBoard.js';

import './App.css';
import './style/setup.css';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      started: false,
      server: 'server'
    }

    this.start = this.start.bind(this);

  }

  start(){
    this.setState({
      started: true
    });
  }

  handleData(data){
    let result = JSON.parse(data);

    console.log(result);
  }

  handleOpen(){
    console.log('opened');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">KTactics</h1>
        </header>
        <div id="main">
        { !this.state.started ? (
          <div>
          <div className="App-intro">
            <div id="startHex" onClick={this.start}>&#x2B22;</div>
          </div>
          <div id="clickInfo">To get started, click on the hex.</div>
        </div>
       ) : <Setup /> }
        </div>
      </div>
    );
  }
}

export default App;