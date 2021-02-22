const INITIAL_STATE = {
  unloggedError: false,
  recentlyPlayedWith: [true, []],
};

const applyUnloggedErrorr = (state, action) => ({
  ...state,
  unloggedError: action.unloggedError,
});

const applyRecentlyPlayedWith = (state, action) => ({
  ...state,
  recentlyPlayedWith: action.recentlyPlayedWith,
});

function otherStateReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'UNLOGGED_ERROR_SET': {
      return applyUnloggedErrorr(state, action);
    }
    case 'RECENTLY_PLAYED_WITH_SET': {
      return applyRecentlyPlayedWith(state, action);
    }
    default:
      return state;
  }
}

export default otherStateReducer;