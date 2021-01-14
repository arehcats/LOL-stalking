import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import messageReducer from './message';
import summonerInfoReducer from './summonerInfo';
import summonersRerucer from './summoners';
 
const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  messageState: messageReducer,
  summonerInfoState: summonerInfoReducer,
  summoners: summonersRerucer,
});
 
export default rootReducer;