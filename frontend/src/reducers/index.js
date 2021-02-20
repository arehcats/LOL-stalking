import { combineReducers } from 'redux';
import sessionReducer from './session';
import summonerInfoReducer from './summonerInfo';
import summonersRerucer from './summoners';
import someDataGameReducer from './someGamesData';
import otherStateReducer from './otherState';
 
const rootReducer = combineReducers({
  sessionState: sessionReducer,
  summonerInfoState: summonerInfoReducer,
  summoners: summonersRerucer,
  someDataGame: someDataGameReducer,
  otherState: otherStateReducer,
});
 
export default rootReducer;