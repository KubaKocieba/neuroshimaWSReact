export default (state = [], action) => {
  switch(action.type){
    case 'SEND_USER':
      let usr = {name: action.name, army: action.army, socket: action.socket};

      action.socket.send(JSON.stringify({type: 'connect_user', data: [usr]}));
      return state;

    case 'LIST_USERS':
      return state;

    case 'SET_USERS':
    case 'ADD_USER':

      if(state !== action.data)
      {
        state = [...action.data];
        return state;
      }

      return state;

    default:
    console.log('default ', state);
      return state;
  }
};