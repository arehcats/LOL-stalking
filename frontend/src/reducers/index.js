import { combineReducers } from 'redux';
import sessionReducer from './session';
import summonerInfoReducer from './summonerInfo';
import summonersRerucer from './summoners';
import someDataGameReducer from './someGamesData';
 
const rootReducer = combineReducers({
  sessionState: sessionReducer,
  summonerInfoState: summonerInfoReducer,
  summoners: summonersRerucer,
  someDataGame: someDataGameReducer,
});
 
export default rootReducer;