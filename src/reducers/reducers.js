import { combineReducers } from 'redux';
import {Socket} from '../components/Setup'

const users = (state = [], action) => {
  switch(action.type){
    case 'SEND_USER':
      let usr = {name: action.name, army: action.army, socket: action.socket};

      action.socket.send(JSON.stringify({type: 'connect_user', data:[...state, usr]}));
      return state;

    case 'ADD_USER':
      let users = action.data;
      console.log('added user');
      console.log(state.concat(users));

      return state.concat(users);

    case 'LIST_USERS':
      console.log('all users');
      console.log(state);
      return state;

    default:
    console.log('default ', state);
      return state;
  }
};

const Reducers = combineReducers({
  users
})

export default Reducers;