import React from 'react'

class GameDeck extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
        <div>
          <p> Player {sessionStorage.getItem('player')}</p>
          <p>Your hand:</p>
          <div className="slots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )
  }
}

export default GameDeck;
