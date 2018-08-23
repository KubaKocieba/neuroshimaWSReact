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

    this.start = this.start.bind(this);
  }

  state = {
    started: true,
    hand: []
  };

  start(){
    this.setState({
      started: true
    });
  }

  dragOverAction(event){
    event.preventDefault();
    event.stopPropagation();
    console.log('here is a dragged over');
  }

  handRemove = (tile) => {
    let hand = this.state.hand.slice();

    const toErase = hand.findIndex(handTile=>{
      return handTile.name === tile.name;
    });

    hand.splice(toErase, 1);

    this.setState({
      ...this.state,
      hand
    });
  };

  handAddTiles = (tiles) => {
    var currHand = this.state.hand.slice();

    console.log(currHand);
    console.log(tiles);

    this.setState({
      ...this.state,
      hand: tiles
    });
  };

  render() {
    console.log(this.state.hand);

    let activePlayer = this.props.users[this.props.game.activePlayer];

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
          ) : (!this.props.game.started ? <Setup /> : <HexBoard tileRemoveFromHand={this.handRemove} board={this.props.board} activePlayer={activePlayer} /> )
        }
        </div>
        {
          this.props.game.started ?
            <GameDeck tileRemoveFromHand={this.handRemove} tilesToHand={this.handAddTiles} playerData={{...this.state}} activePlayer={activePlayer} name={'Kupa gówna'}/> : ''}
      </div>
    );
  }
}

const mapStateToProps = (state) =>{
  return {
    users: state.users,
    game: state.game,
    board: state.board
  }
}

const mapDispatchActions = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchActions)(App);