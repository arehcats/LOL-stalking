const INITIAL_STATE = {
  basicInfoSummoner: null,
  flexRank: null,
  soloRank: null,
  championsPlayedFlex: [],
  championsPlayedSolo: [],
  championsPlayedAram: [],
  last100games: [],
};

const applyBasicInfoSummoner = (state, action) => ({
  ...state,
  basicInfoSummoner: action.jsonSummonerByName,
});

const applyFlexRank = (state, action) => ({
  ...state,
  flexRank: action.flexRank,
});

const applySoloRank = (state, action) => ({
  ...state,
  soloRank: action.soloRank,
});

const applyChampionsPlayedFlex = (state, action) => ({
  ...state,
  championsPlayedFlex: action.championsPlayedFlex,
});

const applyChampionsPlayedSolo = (state, action) => ({
  ...state,
  championsPlayedSolo: action.championsPlayedSolo,
});

const applyChampionsPlayedAram = (state, action) => ({
  ...state,
  championsPlayedAram: action.championsPlayedAram,
});

const applylast100games = (state, action) => ({
  ...state,
  last100games: action.last100games,
});

function summonerInfoReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'BASIC_INFO_SUMMOONER_SET': {
      return applyBasicInfoSummoner(state, action);
    }
    case 'FLEX_RANK_SET': {
      return applyFlexRank(state, action);
    }
    case 'SOLO_RANK_SET': {
      return applySoloRank(state, action);
    }
    case 'PLAYED_FLEX_SET': {
      return applyChampionsPlayedFlex(state, action);
    }
    case 'PLAYED_SOLO_SET': {
      return applyChampionsPlayedSolo(state, action);
    }
    case 'PLAYED_ARAM_SET': {
      return applyChampionsPlayedAram(state, action);
    }
    case 'LAST_100_GAMES_SET': {
      return applylast100games(state, action);
    }
    default:
      return state;
  }
}

export default summonerInfoReducer;