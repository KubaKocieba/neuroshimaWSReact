export default (state = {
  started: false
}, action) => {
  switch(action.type){
    case 'START_GAME':
      return {...state, started: true};

    default:
      return state;
  }
}