import React from 'react'
import {connect} from 'react-redux'
import '../style/gameDeck.css'
import * as gameActions from '../actions/gameActions'
import Tile from './Tile'
import {Armies} from '../helpers/armies'

var time;

class GameDeck extends React.Component{
  constructor(props){
    super(props);

    this.state = {
        timer: null,
        player: sessionStorage.getItem('player'),
        tiles: this.tilesFillWithRepeated(Armies[sessionStorage.getItem('army')]),
        hand: []
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
    this.turn(this.props.activePlayer.name);
  }

    componentDidUpdate(prevProps){
        if (prevProps.activePlayer !== this.props.activePlayer) {
            clearInterval(time);
            this.setState({timer: null});
            this.turn(this.props.activePlayer.name);
        }
    }

  tilesFillWithRepeated(tiles){
    let setTiles = tiles.reduce((res, curr)=>{
        for(let i = 0; i < curr.amount; i++){
            var {amount, ...rest} = curr;

            res = res.concat([rest]);
        }

        return res;
    }, []);

    return [Armies[sessionStorage.getItem('army')][0], ...setTiles];
  }

  finishTurn(){
    clearInterval(time);
    this.setState({timer: null});
    //this.props.game.socket.send(JSON.stringify({type: 'next_player'}));
    this.props.nextPlayer(this.props.game.socket, this.state);
  }

  drawTiles(){
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
        tiles,
        hand: handTiles
      });

      // console.log('tiles left');
      // console.log(tiles.length);

      if (tiles.length <= 0 && !this.props.game.lastRound) {
        this.props.game.socket.send(JSON.stringify({type: 'last_round'}));
      }
     }
     else{
      console.log('no more tiles');
     }
  }

    handleTileRemove(index){
      let hand = this.state.hand.slice();

      hand.splice(index, 1);

      this.setState({
          ...this.state,
          hand
      })

    }

    dragStartHandle(event, tile){
      console.log('started');
        event.dataTransfer.setData('text/plain', JSON.stringify(tile));
    }

    dragHandle(event){
      event.preventDefault();
      console.log('dragHandle');
    }

  render(){
    let you = sessionStorage.getItem('player'),
        isYou = this.props.activePlayer.name === you,
        yourTurnEndBtn = isYou ? <div><button onClick={this.finishTurn.bind(this)}>END TURN</button></div> : '' ,
        whoIsActiveNow = isYou ? 'Your turn!!!' : 'Active player is: ',
        playerName = isYou ? sessionStorage.getItem('player') : this.props.activePlayer.name,
        tilesInHand = this.state.hand.map((tile, index) => {
            return (
                <Tile dragStart={(ev)=> this.dragStartHandle(ev, tile)}
                      dragFurther={this.dragHandle}
                      name={tile.name} click={() => this.handleTileRemove(index)}
                      key={index}
                      dragEnd={(ev)=> this.dragEnd(ev, tile)}
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
