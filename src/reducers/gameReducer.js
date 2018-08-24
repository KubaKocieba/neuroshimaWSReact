export default (state = {
  started: false
}, action) => {
  switch(action.type){
    case 'SAVE_SOCKET':
      return {...state, socket: action.payload};

    case 'START_GAME':
      return {...state, started: true, activePlayer: action.payload};

    case'NEXT_PLAYER':
      action.socket.send(JSON.stringify({type: 'next_player', playerData: action.playerData}));
      return state;

    case'NEXT_PLAYER_STARTED':
      console.log(action);
      return {...state, activePlayer: action.activePlayer, playerData: action.playerData};

      case 'LAST_ROUND':
        return {...state, lastRound: true, playerInitiatedLastRound: action.payload};

    default:
      return state;
  }
}