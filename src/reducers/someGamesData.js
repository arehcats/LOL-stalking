const INITIAL_STATE = {
  gamesIDs: null,
  championsIDs: null,
  };
   
  const applyGamesIDs = (state, action) => ({
    ...state,
    gamesIDs: action.gamesIDs,
  });
  const applyChampionsIDs = (state, action) => ({
    ...state,
    championsIDs: action.championsIDs,
  });
   
  function someDataGameReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'GAMES_IDs_SET': {
        return applyGamesIDs(state, action);
      }
      case 'CHAMPIONS_IDs_SET': {
        return applyChampionsIDs(state, action);
      }
      default:
        return state;
    }
  }
   
  export default someDataGameReducer;