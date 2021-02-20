const INITIAL_STATE = {
    unloggedError: false,
  };
   
  const applyUnloggedErrorr = (state, action) => ({
    ...state,
    unloggedError: action.unloggedError,
  });
   
  function otherStateReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'UNLOGGED_ERROR_SET': {
        return applyUnloggedErrorr(state, action);
      }
      default:
        return state;
    }
  }
   
  export default otherStateReducer;