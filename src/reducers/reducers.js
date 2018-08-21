import { combineReducers } from 'redux';
import users from './users'
import game from './game'
import board from './board'

const Reducers = combineReducers({
  users,
  game,
    board
})

export default Reducers;