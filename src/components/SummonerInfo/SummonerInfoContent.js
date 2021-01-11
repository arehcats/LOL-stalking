import React from 'react';
import '../../css/SummonerInfo.css'
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'
import ChampionsStatistic from './championsStatistic'
import { connect } from 'react-redux';
import { compose } from 'recompose';

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
    };
    componentDidMount() {

        let getStorage = JSON.parse(localStorage.getItem(this.state.SummonerName))

        if (getStorage === null) { } // check if storage exist
        else if (getStorage.length === 5) { // if exist check if has all needed information
            console.log(getStorage);

            this.props.setBasicInfoSummoner(getStorage[0]);

            // if (getStorage[1][0] === false) jsonSummonerRank[0] = false
            if (getStorage[1][0].queueType === "RANKED_SOLO_5x5") this.props.setSoloRank(getStorage[1][0]);
            else this.props.setFlexRank(getStorage[1][0]);
            // if (jsonSummonerRank[1] === undefined) jsonSummonerRank[1] = false
            if (getStorage[1][1].queueType === "RANKED_SOLO_5x5") this.props.setSoloRank(getStorage[1][1]);
            else this.props.setFlexRank(getStorage[1][1]);


            this.props.setChampionsPlayedFlex(getStorage[2])
            this.props.setChampionsPlayedSolo(getStorage[3])
            this.props.setChampionsPlayedAram(getStorage[4])

            this.setState({
                isLodaing: false,
            })
            return
        }

        this.fetchAllDataOnMount()

    }

    async fetchAllDataOnMount() {
        const SummonerName = this.state.SummonerName
        const RiotApiKey = "?api_key=" + process.env.REACT_APP_RITO_API_KEY
        const RiotApiKeySecond = "&api_key=" + process.env.REACT_APP_RITO_API_KEY
        const region = "https://eun1.api.riotgames.com"
        const cors = "https://cors-anywhere.herokuapp.com/"
        // const cors = "https://yacdn.org/proxy/"

        // fetch data by summuner name
        const SummonerByName = region + "/lol/summoner/v4/summoners/by-name/" + SummonerName + RiotApiKey
        const responseSummonerByName = await fetch(cors + SummonerByName)
        if (responseSummonerByName.status !== 200) {
            this.setState({
                status: responseSummonerByName.status,
                errorMessage: responseSummonerByName.statusText
            })
            return
        }
        const jsonSummonerByName = await responseSummonerByName.json()

        this.props.setBasicInfoSummoner(jsonSummonerByName);

        // fetch summoner rank by summoner id
        const SummonerID = jsonSummonerByName.id
        const SummonerRank = region + "/lol/league/v4/entries/by-summoner/" + SummonerID + RiotApiKey
        const responseSummonerRank = await fetch(cors + SummonerRank)
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


        ////////////// fetch games by account ID ///////////////////////////////

        let championsPlayedFlex = []
        let championsPlayedSolo = []
        let championsPlayedAram = []

        championsPlayedFlex = await this.fetchListGame(region, jsonSummonerByName, RiotApiKeySecond, cors, 440)
        championsPlayedSolo = await this.fetchListGame(region, jsonSummonerByName, RiotApiKeySecond, cors, 420)
        championsPlayedAram = await this.fetchListGame(region, jsonSummonerByName, RiotApiKeySecond, cors, 450)

        if (this.state.isFetchError) return

        this.props.setChampionsPlayedFlex(championsPlayedFlex)
        this.props.setChampionsPlayedSolo(championsPlayedSolo)
        this.props.setChampionsPlayedAram(championsPlayedAram)


        let StorageData = []
        StorageData.push(jsonSummonerByName)
        StorageData.push(jsonSummonerRank)
        StorageData.push(championsPlayedFlex)
        StorageData.push(championsPlayedSolo)
        StorageData.push(championsPlayedAram)

        localStorage.setItem(SummonerName, JSON.stringify(StorageData));
        let getStorage2 = JSON.parse(localStorage.getItem(SummonerName))
        console.log(getStorage2);
        console.log("fetched all");

        this.setState({
            isLodaing: false,
        })
    }

    async fetchListGame(region, jsonSummonerByName, RiotApiKeySecond, cors, gameID) {
        let beginIndex = 0
        let endIndex = 100
        let totalGames = 0
        let fetchedGames = []

        do {
            const games = region + "/lol/match/v4/matchlists/by-account/" + jsonSummonerByName.accountId +
                "?queue=" + gameID + "&beginTime=1605060000000&endIndex=" + endIndex + "&beginIndex=" + beginIndex + RiotApiKeySecond
            const responsegames = await fetch(cors + games)
            if (responsegames.status === 404) {

                return []
            }
            else if (responsegames.status !== 200) {
                this.setState({
                    status: responsegames.status,
                    errorMessage: responsegames.statusText,
                    isFetchError: true,
                })
                return responsegames.statusText
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
                                <img src={'/assets/images/profileicon/' + this.props.basicInfoSummoner.profileIconId + '.png'}
                                    alt={"Summoner icon"} />
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
                                            this.fetchAllDataOnMount();
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
                                            <span>{this.props.soloRank.wins} W {this.props.soloRank.losses} L</span>
                                            <span>Wina ratio {Math.round(100 * (this.props.soloRank.wins / (this.props.soloRank.losses + this.props.soloRank.wins)))}%</span>
                                        </div>
                                    </div>

                                    :
                                    <div className="unranked">
                                        SoloQ
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
                                            <span>{this.props.flexRank.wins}W {this.props.flexRank.losses}L</span>
                                            <span>Wina ratio {Math.round(100 * (this.props.flexRank.wins / (this.props.flexRank.losses + this.props.flexRank.wins)))}%</span>
                                        </div>
                                    </div>
                                    :
                                    <div className="unranked">
                                        Flex
                                            <img src={'/assets/images/rank-icons/provisional.png'}
                                            alt="provisional" />
                                        <b>Unranked</b>
                                    </div>
                                }
                                <div id="championsStats">
                                    <ChampionsStatistic />
                                </div>
                            </div>
                            <div id="rightConteiner">
                                f
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

});

const mapStateToProps = state => ({
    basicInfoSummoner: state.summonerInfoState.basicInfoSummoner,
    flexRank: state.summonerInfoState.flexRank,
    soloRank: state.summonerInfoState.soloRank,
    championsPlayedFlex: state.summonerInfoState.championsPlayedFlex,
    championsPlayedSolo: state.summonerInfoState.championsPlayedSolo,
    championsPlayedAram: state.summonerInfoState.championsPlayedAram,

});

export default compose(
    // withFirebase,
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
)(SearchUserInputContent);


