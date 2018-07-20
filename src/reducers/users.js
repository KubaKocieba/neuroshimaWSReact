export default (state = [], action) => {
  switch(action.type){
    case 'SEND_USER':
      let usr = action.data;

      action.data.socket.send(JSON.stringify({type: 'connect_user', data: [usr]}));
      return state;

    case 'LIST_USERS':
      return state;

    case 'SET_USERS':
    case 'ADD_USER':
      if(state !== action.data)
      {
        state = [...action.data];
      }

      return state;

    default:
      return state;
  }
};