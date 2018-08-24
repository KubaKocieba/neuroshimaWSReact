import { combineReducers } from 'redux';
import users from './usersReducer'
import game from './gameReducer'
import board from './boardReducer'

const Reducers = combineReducers({
  users,
  game,
  board
})

export default Reducers;