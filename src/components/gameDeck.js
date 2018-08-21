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
        tiles: this.tilesFillWithRepeated(Armies[sessionStorage.getItem('army')]),
        hand: []
    };

    this.turn          = this.turn.bind(this);
    this.drawTiles     = this.drawTiles.bind(this);
  }

  turn(activePlayer){
    if (!!this.props.game.lastRound && activePlayer === this.props.users[this.props.game.playerInitiatedLastRound].name) {
          alert('GAME OVER');
    }
    else {
        let minutes = 1,
            seconds = 30;

        if (activePlayer === sessionStorage.getItem('player')) {
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

                if (activePlayer === sessionStorage.getItem('player')) {
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

  componentWillReceiveProps(nextProps){
    clearInterval(time);
    this.setState({timer: null});
    this.turn(nextProps.activePlayer.name);

    console.log(this.props.game);
  }

  finishTurn(){
    clearInterval(time);
    this.setState({timer: null});
    this.props.game.socket.send(JSON.stringify({type: 'next_player'}));
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

      console.log('tiles left');
      console.log(tiles.length);

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
      console.log('dragStart');
      console.log(tile);
      //event.dataTransfer.effectAllowed = "move";
    }

    dragHandle(event){
      console.log('dragHandle');
      console.log(event.pageX);
    }

    showUsersState = () => {
      console.log(this.props.board);
    }

  render(){
    let you = sessionStorage.getItem('player'),
        isYou = this.props.activePlayer.name === you,
        yourTurnEndBtn = isYou ? <div><button onClick={this.finishTurn.bind(this)}>END TURN</button></div> : '' ,
        whoIsActiveNow = isYou ? 'Your turn!!!' : 'Active player is: ',
        playerName = isYou ? sessionStorage.getItem('player') : this.props.activePlayer.name,
        tilesInHand = this.state.hand.map((tile, index) => {
            return <Tile userState={this.showUsersState} dragStart={(ev)=> this.dragStartHandle(ev, tile)} dragFurther={this.dragHandle} name={tile.name} click={() => this.handleTileRemove(index)} key={index}></Tile>;
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
    nextPlayer: (socket) => dispatch(gameActions.nextPlayer(socket))
  }
}


const mapStateToProps = (state) => {
  return {
    users: state.users,
    game:  state.game,
    board: state.board
  }
}

export default connect(mapStateToProps, mapActions)(GameDeck);
