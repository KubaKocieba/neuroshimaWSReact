import React, { Component } from 'react'
import {Setup} from './components/Setup'
import HexBoard from './components/hexBoard'
import GameDeck from './components/gameDeck'
import {connect} from 'react-redux'

import './App.css';
import './style/setup.css';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      started: true,
      server: 'server'
    }

    this.start = this.start.bind(this);

  }

  start(){
    this.setState({
      started: true
    });
  }

  render() {
    let activePlayer = this.props.users[this.props.game.activePlayer];

    console.log(activePlayer);

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
          ) : (!this.props.game.started ? <Setup /> : <HexBoard activePlayer={activePlayer} /> )
        }
        </div>
        {this.props.game.started ? <GameDeck activePlayer={activePlayer} name={'Kupa gówna'}/> : ''}
      </div>
    );
  }
}

const mapStateToProps = (state) =>{
  return {
    users: state.users,
    game: state.game
  }
}

const mapDispatchActions = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchActions)(App);