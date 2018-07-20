import React from 'react'
import Tile from './Tile'
import {Armies} from '../helpers/armies'
import '../style/gameDeck.css'
import {connect} from 'react-redux'
import * as gameActions from '../actions/gameActions'

var time;

class GameDeck extends React.Component{
  constructor(props){
    super(props);


    this.state = {
      timer: null,
      player: sessionStorage.getItem('player'),
      tiles: Armies[sessionStorage.getItem('army')]
    }

    this.tilesInitiate = this.tilesInitiate.bind(this);
    this.turn          = this.turn.bind(this);
    this.drawTiles     = this.drawTiles.bind(this);
  }

  turn(activePlayer){
      let minutes = 0,
          seconds = 5;

      if (activePlayer === sessionStorage.getItem('player')){
        this.drawTiles();
        console.log(this.state.tiles);
      }

      time = setInterval(()=> {
        seconds--;

        if (seconds < 0 && minutes){
          seconds = 59;
          minutes = 0;
        }

        if(seconds < 0 && !minutes){
          minutes = 0;
          seconds = 5;


          if (activePlayer === sessionStorage.getItem('player')){
            this.props.game.socket.send(JSON.stringify({type: 'next_player'}));
          }

          clearInterval(time);
        }

        const checkSeconds = () => {
          if(seconds < 10) return '0' + seconds;
          return seconds;
        };

        this.setState({timer: `${minutes} : ${checkSeconds()}`});
      }, 1000)
  }

  componentDidMount(){
    this.turn(this.props.activePlayer.name);
    this.tilesInitiate();
  }

  tilesInitiate(){
    this.setState({
      ...this.state,
      tiles: Armies[sessionStorage.getItem('army')]
    })
  }

  componentWillReceiveProps(nextProps){
    console.log('received props');
    console.log(nextProps);
    this.turn(nextProps.activePlayer.name);
  }

  drawTiles(){
    var hq = this.state.tiles.findIndex(tile => tile.name.indexOf('hq') !== -1);

    var tiles       = this.state.tiles,
        handTiles,
        draw;

    if(!hq)
    {
      handTiles = tiles.splice(hq, 1);

      console.log('hq was in the set');
    }
    else
    {
      let drawIndex;

      handTiles = [];

      var drawed = [];

      for(let i = 0; i < 3; i++)
      {
        const draw =() => Math.floor(Math.random() * tiles.length);

        drawIndex = draw();

        while(drawed.indexOf(drawIndex) !== -1){
           drawIndex = draw();
        }

        drawed.push(drawIndex);
        console.log('wylosowano index', drawIndex);
        handTiles.push(tiles.splice(drawIndex, 1));
      }
    }

    console.log(handTiles);
    console.log(tiles);

    this.setState({
      ...this.state,
      tiles,
      hand: handTiles
    });
  }


  render(){
    let you = sessionStorage.getItem('player'),
        isYou = this.props.activePlayer.name === you;

    return (
        <div>
          <h1>{isYou ? 'Your turn!!!' : 'Active player is: '}</h1><p> Player {isYou ? sessionStorage.getItem('player') : this.props.activePlayer.name}</p>
          <p>Your hand:</p>
          <div className="slots">
            <Tile></Tile>
            <Tile></Tile>
            <Tile></Tile>
          </div>
          <div id="TimerContainer">{this.state.timer}</div>
        </div>
      )
  }
}

const mapActions = (dispatch) =>{
  return {
    nextPlayer: (socket) => dispatch(gameActions.nextPlayer(socket))
  }
}


const mapStateToProps = (state) => {
  return {
    users: state.users,
    game:  state.game
  }
}

export default connect(mapStateToProps, mapActions)(GameDeck);
