const INITIAL_STATE = {
  queuesIDsDictionary: null,
  championsIDs: null,
  acutalPatch: null,
  spellsDictionary: {
    21: "SummonerBarrier",
    1: "SummonerBoost",
    14: "SummonerDot",
    3: "SummonerExhaust",
    4: "SummonerFlash",
    6: "SummonerHaste",
    7: "SummonerHeal",
    13: "SummonerMana",
    30: "SummonerPoroRecall",
    31: "SummonerPoroThrow",
    39: "SummonerSnowURFSnowball_Mark",
    32: "SummonerSnowball",
    12: "SummonerTeleport",
    11: "SummonerSmite",

  }
};

const applyQueuesIDsDictionary = (state, action) => ({
  ...state,
  queuesIDsDictionary: action.queuesIDsDictionary,
});
const applyChampionsIDs = (state, action) => ({
  ...state,
  championsIDs: action.championsIDs,
});
const applySpellsDictionary = (state, action) => ({
  ...state,
  spellsDictionary: action.spellsDictionary,
});

const applyacutalPatch = (state, action) => ({
  ...state,
  acutalPatch: action.acutalPatch,
});

function someDataGameReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'GAMES_IDs_SET': {
      return applyQueuesIDsDictionary(state, action);
    }
    case 'CHAMPIONS_IDs_SET': {
      return applyChampionsIDs(state, action);
    }
    case 'SPELLS_DICT_SET': {
      return applySpellsDictionary(state, action);
    }
    case 'ACTUAL_PATCH_SET': {
      return applyacutalPatch(state, action);
    }
    default:
      return state;
  }
}

export default someDataGameReducer;