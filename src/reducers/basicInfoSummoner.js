const INITIAL_STATE = {
    BasicInfoSummoner: null,
  };
   
  const applyBasicInfoSummoner = (state, action) => ({
    ...state,
    BasicInfoSummoner: action.jsonSummonerByName,
  });
   
  function basicInfoSummonerReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'BASIC_INFO_SUMMOONER_SET': {
        return applyBasicInfoSummoner(state, action);
      }
      default:
        return state;
    }
  }
   
  export default basicInfoSummonerReducer;