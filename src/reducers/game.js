export default (state = {
  started: false
}, action) => {
  switch(action.type){
    case 'SAVE_SOCKET':
      return {...state, socket: action.payload};

    case 'START_GAME':
      return {...state, started: true, activePlayer: action.payload};

    case'NEXT_PLAYER':
      action.payload.send(JSON.stringify({type: 'next_player'}));
      return state;

    case'NEXT_PLAYER_STARTED':
      console.log('starting player', action.payload);
      return {...state, activePlayer: action.payload};

    default:
      return state;
  }
}