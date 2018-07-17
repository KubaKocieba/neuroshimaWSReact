import { combineReducers } from 'redux';
import {Socket} from '../components/Setup';
import users from './users'
import game from './game'

const Reducers = combineReducers({
  users,
  game
})

export default Reducers;