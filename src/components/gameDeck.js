import React from 'react'
import Tile from './Tile'
import '../style/gameDeck.css';

class GameDeck extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      timer: null
    }
  }

  componentDidMount(){
    let minutes = 1,
        seconds = 30;

    const turn = () => {
      var time = setInterval(()=> {
        seconds--;

        if (seconds < 0 && minutes){
          seconds = 59;
          minutes = 0;
        }

        if(seconds < 0 && !minutes){
          minutes = 1;
          seconds = 30;
          clearInterval(time);
          turn();
        }

        const checkSeconds = () => {
          if(seconds < 10) return '0' + seconds;
          return seconds;
        };

        this.setState({timer: `${minutes} : ${checkSeconds()}`});
      }, 1000);
    }

    turn();
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

export default GameDeck;
