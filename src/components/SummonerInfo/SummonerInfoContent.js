import React from 'react';
import '../../css/SummonerInfo.css'
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'
import ChampionsStatistic from './championsStatistic'
import { connect } from 'react-redux';
import { compose } from 'recompose';
import GameHistory from './gameHistory'

class SearchUserInputContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SummonerName: this.props.match.params.SummonerName,
            isLodaing: true,
            status: false,
            errorMessage: "",
            isFetchError: false,
        };
        // this.fetchListGame = this.fetchListGame.bind(this)
        this._isMounted = false;

    };
    componentDidMount() {
        this._isMounted = true;

        this.props.setBasicInfoSummoner()
        this.props.setSoloRank()
        this.props.setFlexRank()
        this.props.setChampionsPlayedFlex()
        this.props.setChampionsPlayedSolo()
        this.props.setChampionsPlayedAram()
        this.props.setLast100games()
        this.props.setChampionsIDs()


        this.props.addNewSummoner(this.state.SummonerName)

        let getStorage = JSON.parse(localStorage.getItem(this.state.SummonerName))
        let gamesIDsFromStorage = JSON.parse(localStorage.getItem("gamesIDs"))

        
        if (gamesIDsFromStorage === null) {
            this.fetchGamesID()
        }
        else {
            this.props.setGamesIDs(gamesIDsFromStorage)
        }


        if (getStorage === null) { } // check if storage exist
        else if (getStorage.length === 7) { // if exist check if has all needed information

            this.props.setBasicInfoSummoner(getStorage[0]);

            let rank1 = getStorage[1][0]
            let rank2 = getStorage[1][1]

            if (rank1.queueType === "RANKED_SOLO_5x5") this.props.setSoloRank(rank1);
            else if (rank1.queueType === "RANKED_FLEX_SR") this.props.setFlexRank(rank1);

            if (rank2.queueType === "RANKED_SOLO_5x5") this.props.setSoloRank(rank2);
            else if (rank2.queueType === "RANKED_FLEX_SR") this.props.setFlexRank(rank2);

            this.props.setChampionsPlayedFlex(getStorage[2])
            this.props.setChampionsPlayedSolo(getStorage[3])
            this.props.setChampionsPlayedAram(getStorage[4])
            this.props.setLast100games(getStorage[5])
            this.props.setChampionsIDs(getStorage[6])


            this.setState({
                isLodaing: false,
            })
            return
        }

        this.fetchSummDataOnMount()

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async fetchGamesID() {
        const gamesID_url = "http://static.developer.riotgames.com/docs/lol/queues.json"
        const responsegamesID_url = await fetch(gamesID_url)
        if (!this._isMounted) return

        if (responsegamesID_url.status !== 200) {
            this.setState({
                status: responsegamesID_url.status,
                errorMessage: responsegamesID_url.statusText
            })
            return
        }
        let gamesIDs = {}
        const jsonresponseGamesID_url = await responsegamesID_url.json()
        jsonresponseGamesID_url.forEach((val)=>{
            gamesIDs[val.queueId] = val.description
        })

        localStorage.setItem("gamesIDs", JSON.stringify(gamesIDs));
        this.props.setGamesIDs(gamesIDs)

    }

    async fetchSummDataOnMount() {
        const SummonerName = this.state.SummonerName
        const RiotApiKey = "?api_key=" + process.env.REACT_APP_RITO_API_KEY
        const RiotApiKeySecond = "&api_key=" + process.env.REACT_APP_RITO_API_KEY
        const region = "https://eun1.api.riotgames.com"
        const cors = "https://cors-anywhere.herokuapp.com/"
        const acutalPatch = "11.1.1"
        // const cors = "https://yacdn.org/proxy/"
        this.fetchGamesID()

        ////////////////////////////////// fetch data by summuner name ////////////////////////

        const SummonerByName = region + "/lol/summoner/v4/summoners/by-name/" + SummonerName + RiotApiKey
        const responseSummonerByName = await fetch(cors + SummonerByName)
        if (!this._isMounted) return

        if (responseSummonerByName.status !== 200) {
            this.setState({
                status: responseSummonerByName.status,
                errorMessage: responseSummonerByName.statusText
            })
            return
        }
        const jsonSummonerByName = await responseSummonerByName.json()

        this.props.setBasicInfoSummoner(jsonSummonerByName);

        ///////////////// fetch summoner rank by summoner id /////////////////////////////

        const SummonerID = jsonSummonerByName.id
        const SummonerRank = region + "/lol/league/v4/entries/by-summoner/" + SummonerID + RiotApiKey
        const responseSummonerRank = await fetch(cors + SummonerRank)
        if (!this._isMounted) return

        if (responseSummonerRank.status !== 200) {
            this.setState({
                status: responseSummonerRank.status,
                errorMessage: responseSummonerByName.statusText
            })
            return
        }
        const jsonSummonerRank = await responseSummonerRank.json()

        if (jsonSummonerRank[0] === undefined) jsonSummonerRank[0] = false
        else if (jsonSummonerRank[0].queueType === "RANKED_SOLO_5x5") this.props.setSoloRank(jsonSummonerRank[0]);
        else this.props.setFlexRank(jsonSummonerRank[0]);
        if (jsonSummonerRank[1] === undefined) jsonSummonerRank[1] = false
        else if (jsonSummonerRank[1].queueType === "RANKED_SOLO_5x5") this.props.setSoloRank(jsonSummonerRank[1]);
        else this.props.setFlexRank(jsonSummonerRank[1]);

        ////////////////// fetch champions ids and their names ////////////////////

        const responseChampions = await fetch("http://ddragon.leagueoflegends.com/cdn/" + acutalPatch + "/data/en_US/champion.json")
        if (responseChampions.status !== 200) {
            this.setState({
                status: responseChampions.status,
                errorMessage: responseChampions.statusText
            })
            return
        }
        const jsonChampions = await responseChampions.json()

        let dictionaryChampsID = []

        for (const [key, value] of Object.entries(jsonChampions.data)) {

            dictionaryChampsID[value.key] = key
        }

        this.props.setChampionsIDs(dictionaryChampsID)

        ////////////// fetch last 100 games by account ID ///////////////////////////////

        let last_games_url = region + "/lol/match/v4/matchlists/by-account/" + jsonSummonerByName.accountId + RiotApiKey
        const responsegames = await fetch(cors + last_games_url)

        if (responsegames.status === 404) { }
        else if (responsegames.status !== 200) {
            if (!this._isMounted) return

            this.setState({
                status: responsegames.status,
                errorMessage: responsegames.statusText,
                isFetchError: true,
            })
        }
        const json_lats_100_games = await responsegames.json()

        this.props.setLast100games(json_lats_100_games.matches)

        ////////////// fetch games by account ID ///////////////////////////////

        let championsPlayedFlex = []
        let championsPlayedSolo = []
        let championsPlayedAram = []

        championsPlayedFlex = await this.fetchListGame(region, jsonSummonerByName, RiotApiKeySecond, cors, 440)
        championsPlayedSolo = await this.fetchListGame(region, jsonSummonerByName, RiotApiKeySecond, cors, 420)
        championsPlayedAram = await this.fetchListGame(region, jsonSummonerByName, RiotApiKeySecond, cors, 450)

        if (this.state.isFetchError) return
        if (championsPlayedFlex === null) championsPlayedFlex = []
        if (championsPlayedSolo === null) championsPlayedFlex = []
        if (championsPlayedAram === null) championsPlayedFlex = []


        this.props.setChampionsPlayedFlex(championsPlayedFlex)
        this.props.setChampionsPlayedSolo(championsPlayedSolo)
        this.props.setChampionsPlayedAram(championsPlayedAram)

        let StorageData = []
        StorageData.push(jsonSummonerByName)
        StorageData.push(jsonSummonerRank)
        StorageData.push(championsPlayedFlex)
        StorageData.push(championsPlayedSolo)
        StorageData.push(championsPlayedAram)
        StorageData.push(json_lats_100_games.matches)
        StorageData.push(dictionaryChampsID)

        localStorage.setItem(SummonerName, JSON.stringify(StorageData));

        this.setState({
            isLodaing: false,
        })
    }

    async fetchListGame(region, jsonSummonerByName, RiotApiKey, cors, gameID) {
        let beginIndex = 0
        let endIndex = 100
        let totalGames = 0
        let fetchedGames = []

        do {
            let games = region + "/lol/match/v4/matchlists/by-account/" + jsonSummonerByName.accountId +
                "?queue=" + gameID + "&beginTime=1610085600000&endIndex=" + endIndex + "&beginIndex=" + beginIndex + RiotApiKey
            const responsegames = await fetch(cors + games)

            if (responsegames.status === 404) {

                return []
            }
            else if (responsegames.status !== 200) {
                if (!this._isMounted) return

                this.setState({
                    status: responsegames.status,
                    errorMessage: responsegames.statusText,
                    isFetchError: true,
                })
                return []
            }
            const jsongames = await responsegames.json()
            totalGames = jsongames.totalGames
            fetchedGames.push(...jsongames.matches)
            beginIndex = beginIndex + 100
            endIndex = endIndex + 100

        } while (fetchedGames.length !== totalGames);

        let championsPlayed = {}
        let championsArray = []
        fetchedGames.forEach((val, i) => {
            championsArray.push(val.champion)
        })

        championsArray.forEach((x) => {

            championsPlayed[x] = (championsPlayed[x] || 0) + 1;
        });


        let entries = Object.entries(championsPlayed);

        let sorted = entries.sort((a, b) => b[1] - a[1]);

        return sorted
    }

    render() {
        return (
            <div>
                {this.state.isLodaing ? <Loading status={this.state.status} errorMessage={this.state.errorMessage} />
                    :
                    <div>
                        <div id="topBannerBasicInfo">
                            <div id="summIcon">
                                <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/profileicon/' + this.props.basicInfoSummoner.profileIconId + '.png'}
                                    alt={"Summoner icon"}
                                    onClick={() => {
                                        // console.log(this.props.last100games);
                                    }}
                                />
                                <div>
                                    {this.props.basicInfoSummoner.summonerLevel}
                                </div>
                            </div>
                            <div id="summNick">
                                <div>
                                    {this.props.basicInfoSummoner.name}
                                </div>
                                <div>
                                    <Button id="LiveGame" type="submit" variant="outlined" color="primary"
                                        onClick={() => {
                                            // localStorage.setItem(this.state.SummonerName, JSON.stringify("Refreshed"));
                                            this.setState({
                                                isLodaing: true,
                                            })
                                            this.fetchSummDataOnMount();
                                            // this.fetchGamesID();
                                        }}
                                    >
                                        Refresh
                                    </Button>
                                    <Button id="LiveGame" type="submit" variant="outlined" color="primary">
                                        Live game to do
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div id="allOderInfo">
                            <div id="leftContainer">
                                <div>
                                    {this.props.soloRank ?
                                        <div className="rankSummoner">
                                            <div>
                                                <img src={'/assets/images/rank-icons/' + this.props.soloRank.tier + '.png'}
                                                    alt={this.props.soloRank.tier} />
                                            </div>
                                            <div className="soloQandFlexStats">
                                                <span>SoloQ rank</span>
                                                <span>{this.props.soloRank.tier} {this.props.soloRank.rank}</span>
                                                <span>{this.props.soloRank.leaguePoints} lp</span>
                                                <span>{this.props.soloRank.wins}W / {this.props.soloRank.losses}L</span>
                                                <span>Wina ratio <b>{Math.round(100 * (this.props.soloRank.wins / (this.props.soloRank.losses + this.props.soloRank.wins)))}%</b></span>
                                            </div>
                                        </div>

                                        :
                                        <div className="unranked">
                                            <span>SoloQ</span>
                                            <img src={'/assets/images/rank-icons/provisional.png'}
                                                alt="provisional" />
                                            <b>Unranked</b>
                                        </div>
                                    }

                                    {this.props.flexRank ?
                                        <div className="rankSummoner">
                                            <div>
                                                <img src={'/assets/images/rank-icons/' + this.props.flexRank.tier + '.png'}
                                                    alt={this.props.flexRank.tier} />
                                            </div>
                                            <div className="soloQandFlexStats">
                                                <span>Flex 5 vs 5 rank</span>
                                                <span>{this.props.flexRank.tier} {this.props.flexRank.rank}</span>
                                                <span>{this.props.flexRank.leaguePoints} LP</span>
                                                <span>{this.props.flexRank.wins}W / {this.props.flexRank.losses}L</span>
                                                <span>Wina ratio <b>{Math.round(100 * (this.props.flexRank.wins / (this.props.flexRank.losses + this.props.flexRank.wins)))}%</b></span>
                                            </div>
                                        </div>
                                        :
                                        <div className="unranked">
                                            <span>Flex</span>
                                            <img src={'/assets/images/rank-icons/provisional.png'}
                                                alt="provisional" />
                                            <b>Unranked</b>
                                        </div>
                                    }
                                </div>
                                <div id="championsStats">
                                    <ChampionsStatistic />
                                </div>
                            </div>
                            <div>
                                <GameHistory />
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

const Loading = ({ status, errorMessage }) => {
    if (status === false) {
        return <div align="center"><CircularProgress /></div>
    }
    else if (status === 404) {
        return <div>User not found... {errorMessage}</div>
    }
    else {
        return <div>Ups something went wrong... {errorMessage}</div>
    }
}

const mapDispatchToProps = dispatch => ({
    setBasicInfoSummoner: jsonSummonerByName =>
        dispatch({ type: 'BASIC_INFO_SUMMOONER_SET', jsonSummonerByName }),
    setFlexRank: flexRank =>
        dispatch({ type: 'FLEX_RANK_SET', flexRank }),
    setSoloRank: soloRank =>
        dispatch({ type: 'SOLO_RANK_SET', soloRank }),
    setChampionsPlayedFlex: championsPlayedFlex =>
        dispatch({ type: 'PLAYED_FLEX_SET', championsPlayedFlex }),
    setChampionsPlayedSolo: championsPlayedSolo =>
        dispatch({ type: 'PLAYED_SOLO_SET', championsPlayedSolo }),
    setChampionsPlayedAram: championsPlayedAram =>
        dispatch({ type: 'PLAYED_ARAM_SET', championsPlayedAram }),
    addNewSummoner: newSummoner =>
        dispatch({ type: "ADD_SUMMONER_SET", newSummoner }),
    setGamesIDs: gamesIDs =>
        dispatch({ type: "GAMES_IDs_SET", gamesIDs }),
    setChampionsIDs: championsIDs =>
        dispatch({ type: "CHAMPIONS_IDs_SET", championsIDs }),
    setLast100games: last100games =>
        dispatch({ type: "LAST_100_GAMES_SET", last100games }),
    setQueueIDs: queueIds =>
        dispatch({ type: "QUEUE_ID_SET", queueIds }),

});

const mapStateToProps = state => ({
    basicInfoSummoner: state.summonerInfoState.basicInfoSummoner,
    flexRank: state.summonerInfoState.flexRank,
    soloRank: state.summonerInfoState.soloRank,
    championsPlayedFlex: state.summonerInfoState.championsPlayedFlex,
    championsPlayedSolo: state.summonerInfoState.championsPlayedSolo,
    championsPlayedAram: state.summonerInfoState.championsPlayedAram,
    gamesIDs: state.someDataGame.gamesIDs,
});

export default compose(
    // withFirebase,
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
)(SearchUserInputContent);


