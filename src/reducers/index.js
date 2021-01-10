import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import messageReducer from './message';
import basicInfoSummonerReducer from './basicInfoSummoner';
 
const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  messageState: messageReducer,
  basicInfoSummonerState: basicInfoSummonerReducer,
});
 
export default rootReducer;