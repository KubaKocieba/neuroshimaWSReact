export default (state = {
  started: false
}, action) => {
  switch(action.type){
    case 'START_GAME':
      return {...state, started: true, activePlayer: action.payload};

    case'NEXT_PLAYER':
      return {...state, activePlayer: action.payload};

    default:
      return state;
  }
}