const INITIAL_STATE = {
    summoners: [],
    favoriteSummoners: [],
};


function applyAddSummonerHistory(state, action) {

    let currentArray = state.summoners
    let currentFavoriteArray = state.favoriteSummoners

    if (!currentArray.includes(action.newSummoner) && !currentFavoriteArray.includes(action.newSummoner)) {
        return ({
            ...state,
            summoners: [...state.summoners, action.newSummoner]
        })
    }
    else
        return ({
            ...state,
            summoners: [...state.summoners]
        })


}

function applyDeleteSummonerFromHistory(state, action) {

    let currentArray = [...state.summoners]
    let index = currentArray.indexOf(action.newSummoner);

    if (index !== -1) {
        currentArray.splice(index, 1);
    }
    if (Array.isArray(currentArray) && currentArray.length === 0) {
        return ({
            ...state,
            summoners: []
        })
    }
    return ({
        ...state,
        summoners: currentArray
    })
}

const applyFavoriteSummoners = (state, action) => ({
    ...state,
    favoriteSummoners: action.favoriteSummoners,
});

const applyClearHistory = (state, action) => ({
    ...state,
    summoners: [],
});

function summonersRerucer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'ADD_SUMMONER_SET': {
            return applyAddSummonerHistory(state, action);
        }
        case 'DELETE_SUMMONER_SET': {
            return applyDeleteSummonerFromHistory(state, action);
        }
        case 'CLEAR_HISTORY': {
            return applyClearHistory(state, action);
        }
        case 'UPDATE_FAVORITE_SUMMONETS': {
            return applyFavoriteSummoners(state, action);
        }

        default:
            return state;
    }
}

export default summonersRerucer;