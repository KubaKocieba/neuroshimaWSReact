import React from 'react'
import {connect} from 'react-redux'
import '../style/gameDeck.css'
import * as gameActions from '../actions/gameActions'
import Tile from './Tile'
import {tilesFillWithRepeated} from '../helpers/assignArmies'
import {Armies} from '../helpers/armies'

var time;

class GameDeck extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      timer: null,
      tiles: tilesFillWithRepeated(Armies[sessionStorage.getItem('army')]),
      player: sessionStorage.getItem('player'),
      ...this.props.playerData
    };

    this.turn          = this.turn.bind(this);
    this.drawTiles     = this.drawTiles.bind(this);
  }

  turn(activePlayerName){
    if (!!this.props.game.lastRound && activePlayerName === this.props.users[this.props.game.playerInitiatedLastRound].name) {
          alert('GAME OVER');
    }
    else {
      let minutes = 1,
          seconds = 30;

      if (activePlayerName === sessionStorage.getItem('player')) {
          this.drawTiles();
      }

      const checkSeconds = () => {
          if (seconds < 10) return '0' + seconds;
          return seconds;
      };

      this.setState({timer: `${minutes} : ${checkSeconds()}`});

      time = setInterval(() => {
          seconds--;

          if (seconds < 0 && minutes) {
              seconds = 59;
              minutes = 0;
          }

          if (seconds < 0 && !minutes) {
              minutes = 1;
              seconds = 30;

              if (activePlayerName === sessionStorage.getItem('player')) {
                  this.finishTurn();
              }
          }

          this.setState({timer: `${minutes} : ${checkSeconds()}`});
      }, 1000);
    }
  }

  componentDidMount(){
    console.log('mounted');
    this.turn(this.props.activePlayer.name);
  }

  componentDidUpdate(prevProps){
    if (prevProps.activePlayer !== this.props.activePlayer) {
      clearInterval(time);
      this.setState({timer: null});
      this.turn(this.props.activePlayer.name);
    }

    if(prevProps.playerData !== this.props.playerData){
      this.setState({
        ...this.props.playerData
      })
    }
  }

  finishTurn = () => {
    clearInterval(time);
    this.setState({timer: null});
    //this.props.game.socket.send(JSON.stringify({type: 'next_player'}));
    this.props.nextPlayer(this.props.game.socket, this.state);
  }

  drawTiles= () => {
    var tiles = this.state.tiles.slice();

    if (tiles.length)
    {
      var hq = this.state.tiles.findIndex(tile => tile.name.indexOf('hq') !== -1),
          handTiles;

      if(!hq)
      {
        handTiles = tiles.splice(hq, 1);
      }
      else
      {
        let drawIndex;

        handTiles = this.state.hand;

        var drawed = [],
            minusOnHand = tiles.length >= 3 ? 3 - handTiles.length : (handTiles.length > 1 ?  3 - handTiles.length : tiles.length);

        for(let i = 0, j = minusOnHand; i < j; i++)
        {
          const draw = () => Math.floor(Math.random() * tiles.length);

          drawIndex = draw();

          while(tiles.length > 1 && drawed.indexOf(drawIndex) !== -1){
             drawIndex = draw();
          }

          drawed.push(drawIndex);
          handTiles.push(tiles[drawIndex]);
          tiles.splice(drawIndex, 1);
        }
      }

      this.setState({
        ...this.state,
        tiles
      });

      this.props.tilesToHand(handTiles);

      if (tiles.length <= 0 && !this.props.game.lastRound) {
        this.props.game.socket.send(JSON.stringify({type: 'last_round'}));
      }
     }
     else{
      console.log('no more tiles');
     }
  }

  handleTileRemove = (index) => {
    let hand = this.state.hand.slice();

    this.props.tileRemoveFromHand(hand[index]);

  }

  dragStartHandle(event, tile){
    this.state.hand.length < 3 ? (
      event.dataTransfer.setData('text/plain', JSON.stringify(tile))
    ) : alert('Please remove 1 tile first');
  }


  render(){
    let you = sessionStorage.getItem('player'),
        isYou = this.props.activePlayer.name === you,
        yourTurnEndBtn = isYou ? <div><button disabled={Object.keys(this.state.hand).length  > 2 || this.state.hand.find(tile=>{
          return tile.name.indexOf('hq') !== -1
        }) } onClick={this.finishTurn.bind(this)}>END TURN</button></div> : '' ,
        whoIsActiveNow = isYou ? 'Your turn!!!' : 'Active player is: ',
        playerName = isYou ? sessionStorage.getItem('player') : this.props.activePlayer.name,
        tilesInHand = this.state.hand.map((tile, index) => {
            return (
                <Tile dragStart={isYou ? (ev)=> this.dragStartHandle(ev, tile) : null}
                      dragFurther={isYou ? this.dragHandle : null}
                      name={tile.name} click={isYou ? (() => this.handleTileRemove(index)) : null}
                      key={index}
                >
                </Tile>);
        }) ;

    return (
        <div>
          <h1>{whoIsActiveNow}</h1><p> Player {playerName}</p>
          <p>Your hand:</p>
          <div className="slots">
              { tilesInHand }
          </div>
          <div id="TimerContainer">{this.state.timer}</div>
          { yourTurnEndBtn }
        </div>
      )
  }
}

const mapActions = (dispatch) =>{
  return {
    nextPlayer: (socket, playerData) => dispatch(gameActions.nextPlayer(socket,playerData))
  }
}


const mapStateToProps = (state) => {
  return {
    users: state.users,
    game:  state.game
  }
}

export default connect(mapStateToProps, mapActions)(GameDeck);
