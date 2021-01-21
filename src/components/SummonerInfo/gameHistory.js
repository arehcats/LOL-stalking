import React from 'react';
import '../../css/gameHistory.css'
// import Button from '@material-ui/core/Button'
import { connect } from 'react-redux';
import { compose } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';


class GameHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            displayedGames: 0,
            fetchStep: 21,
            status: false,
            errorMessage: "",
            fetchedGames: [],
            baisicsGameInfo: [],
        };
        this._isMounted = false;

    };

    componentDidMount() {
        this._isMounted = true;

        this.fetchInfoAboutGame()

        // console.log(localStorage.length);
        // for (var i = 0; i < localStorage.length; i++){
        //    console.log(localStorage.getItem(localStorage.key(i)));
        // }

    }

    async fetchInfoAboutGame() {

        // console.log(this.props.last100games[0]);
        const lastGames = this.props.last100games
        let displayedGames = this.state.displayedGames
        const fetchStep = this.state.fetchStep
        let fetchedGames = this.state.fetchedGames
        const condition = displayedGames + fetchStep
        let matchIDs = []
        let baisicsGameInfo = this.state.baisicsGameInfo

        for (; displayedGames < condition; displayedGames++) {
            matchIDs.push(lastGames[displayedGames].gameId)
            baisicsGameInfo.push(lastGames[displayedGames])
        }
        // console.log(baisicsGameInfo);
        // console.log(matchIDs);
        // console.log(displayedGames);

        const RiotApiKey = "?api_key=" + process.env.REACT_APP_RITO_API_KEY
        // const RiotApiKeySecond = "&api_key=" + process.env.REACT_APP_RITO_API_KEY
        const region = "https://eun1.api.riotgames.com"
        const cors = "https://cors-anywhere.herokuapp.com/"
        let getStorageGame
        // let fetchURLs = []
        let response = ''
        let timeInMs = Date.now();
        // let gameInfo = ''

        let [...rest] = await Promise.all(
        matchIDs.map(async (matchID) => {
            getStorageGame = JSON.parse(localStorage.getItem(matchID))
            // getStorageGame = false
            // console.log(getStorageGame);
            if (getStorageGame) {
                console.log("11111");

                return getStorageGame
            }
            else {

                response = await fetch(cors + region + "/lol/match/v4/matches/" + matchID + RiotApiKey)

                if (!this._isMounted) return

                if (response.status !== 200) {
                    console.log("22222");

                    return "error"

                }
                else {
                    console.log("33333");
                    let jsonresponse = await response.json()
                    console.log(jsonresponse);
                    let returngameInfo = [jsonresponse, timeInMs]
                    localStorage.setItem(jsonresponse.gameId, JSON.stringify(returngameInfo));
                    return returngameInfo

                }
            }
        }))
        // console.log(rest);

        fetchedGames.push(...rest)
        // console.log(fetchedGames);

        this.setState({
            fetchedGames: fetchedGames,
            displayedGames: displayedGames,
            isLoading: false,
            baisicsGameInfo: baisicsGameInfo,
        })


    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        let champions = this.props.championsIDs
        return (
            <div id="rightConteiner">
                <div
                    onClick={() => {
                        console.log(this.state.fetchedGames);
                    }}
                >
                    {/* click */}
                </div>
                { this.state.isLoading ? <Loading status={this.state.status} errorMessage={this.state.errorMessage} />
                    :
                    <div>
                        {this.state.fetchedGames.map((allGameInfo, i) => {
                            let classBackround = "gameHistory lose"
                            // console.log(allGameInfo);
                            // console.log(allGameInfo[0].gameId);
                            // console.log(i);

                            let participantId = []

                            allGameInfo[0].participants.forEach((participant, participantsIndex) => {
                                
                                if (participant.championId === this.state.baisicsGameInfo[i].champion) {

                                    participantId.push(participantsIndex, participant.teamId)

                                }
                            })

                            let kills = allGameInfo[0].participants[participantId[0]].stats.kills
                            let deaths = allGameInfo[0].participants[participantId[0]].stats.deaths
                            let assists = allGameInfo[0].participants[participantId[0]].stats.assists

                            let kda = Math.round(100 * (kills + assists) / deaths) / 100
                            if (kda === Infinity) kda = "Perfect"

                            let gameDurationMinutes = Math.round((allGameInfo[0].gameDuration) / 60)
                            let gameDurationSeconds = (allGameInfo[0].gameDuration) % 60
                            let timeInMs = Date.now();
                            let gameCreation = allGameInfo[0].gameCreation
                            let timeMinutes = Math.round((timeInMs - gameCreation) / 60000)
                            let timeAgo
                            let minutesAgoString = "minutes ago"

                            if (timeMinutes <= 60) {
                                timeAgo = timeMinutes
                            }
                            else if (timeMinutes / 60 <= 24) {
                                timeAgo = Math.round(timeMinutes / 60)
                                minutesAgoString = "hours ago"
                            }
                            else {
                                timeAgo = Math.round((timeMinutes / 60) / 24)
                                minutesAgoString = "days ago"
                            }

                            let ifWin
                            if (allGameInfo[0].participants[participantId[0]].stats.win) ifWin = "Victory"
                            else ifWin = "Defeat"



                            let killsInRows

                            if (allGameInfo[0].participants[participantId[0]].stats.pentaKills) {
                                killsInRows = "Penta kill"
                            }
                            else if (allGameInfo[0].participants[participantId[0]].stats.quadraKills) {
                                killsInRows = "Quadra kill"
                            }
                            else if (allGameInfo[0].participants[participantId[0]].stats.tripleKills) {
                                killsInRows = "Triple kill"
                            }
                            else if (allGameInfo[0].participants[participantId[0]].stats.doubleKills) {
                                killsInRows = "Dobule kill"
                            }

                            if (allGameInfo[0].teams[0].teamId === participantId[1]) {
                                if (allGameInfo[0].teams[0].win === "Fail") {
                                }
                                else {
                                    classBackround = "gameHistory win"
                                }
                            }
                            else if (allGameInfo[0].teams[1].teamId === participantId[1]) {
                                if (allGameInfo[0].teams[1].win === "Fail") {
                                }
                                else {
                                    classBackround = "gameHistory win"
                                }
                            }
                            return <div className={classBackround} key={i}>
                                <div className = "basicInfoGame">
                                    <div title={this.props.gamesIDs[allGameInfo[0].queueId]} className="gameType">
                                        {this.props.gamesIDs[allGameInfo[0].queueId]}
                                    </div>
                                    <div className="timeAgo">
                                        {timeAgo} {minutesAgoString}
                                    </div>
                                    <div className="styledLine">

                                    </div>
                                    <div className={ifWin}>
                                        {ifWin}
                                    </div>
                                    <div className="gameDuration">
                                        {gameDurationMinutes}m {gameDurationSeconds}s
                                    </div>
                                </div>
                                <div className="championAndSpellsImg">
                                    <div>
                                        <div className="championsImg" >
                                            <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/champion/'
                                                + champions[allGameInfo[0].participants[participantId[0]].championId] + '.png'}
                                                alt={"Champion"} />
                                        </div>
                                        <div className="SpellsImg">
                                            <img
                                                src={"http://ddragon.leagueoflegends.com/cdn/11.1.1/img/spell/"
                                                    + this.props.spellsDictionary[allGameInfo[0].participants[participantId[0]].spell1Id] + ".png"}
                                                alt={"Spell"} />
                                            <img
                                                src={"http://ddragon.leagueoflegends.com/cdn/11.1.1/img/spell/"
                                                    + this.props.spellsDictionary[allGameInfo[0].participants[participantId[0]].spell2Id] + ".png"}
                                                alt={"Spell"} />
                                        </div>
                                    </div>
                                    <div className="championName">
                                        {champions[allGameInfo[0].participants[participantId[0]].championId]}
                                    </div>
                                </div>
                                <div className="killsAndKDA">
                                    <div className="killsDeats">
                                        {kills} / <span className="colorRed">{deaths}</span> / {assists}
                                    </div>
                                    <div className="kda">
                                        {kda} <span className="colorGrey">KDA</span>
                                    </div>
                                    <div className="killsInRows">
                                        {killsInRows}
                                    </div>
                                </div>
                                <div className="level_cs_patr_kills">
                                    <div className="champLevel">
                                        <div>
                                            Level
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[participantId[0]].stats.champLevel}
                                        </div>
                                    </div>
                                    <div className="minions">
                                        <div>
                                            Minions
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[participantId[0]].stats.totalMinionsKilled}
                                        </div>
                                    </div>
                                    <div className="minionsMinute">
                                        <div>
                                            Minions / minute
                                        </div>
                                        <div>
                                            {Math.round(10 * (allGameInfo[0].participants[participantId[0]].stats.totalMinionsKilled) / (allGameInfo[0].gameDuration / 60)) / 10}
                                        </div>
                                    </div>
                                </div>
                                <div className="items">
                                    <div>
                                        <div>
                                            {allGameInfo[0].participants[participantId[0]].stats.item0 ?
                                                <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/'
                                                    + allGameInfo[0].participants[participantId[0]].stats.item0 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[participantId[0]].stats.item1 ?
                                                <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/'
                                                    + allGameInfo[0].participants[participantId[0]].stats.item1 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[participantId[0]].stats.item2 ?
                                                <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/'
                                                    + allGameInfo[0].participants[participantId[0]].stats.item2 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[participantId[0]].stats.item6 ?
                                                <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/'
                                                    + allGameInfo[0].participants[participantId[0]].stats.item6 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            {allGameInfo[0].participants[participantId[0]].stats.item3 ?
                                                <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/'
                                                    + allGameInfo[0].participants[participantId[0]].stats.item3 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[participantId[0]].stats.item4 ?
                                                <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/'
                                                    + allGameInfo[0].participants[participantId[0]].stats.item4 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[participantId[0]].stats.item5 ?
                                                <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/'
                                                    + allGameInfo[0].participants[participantId[0]].stats.item5 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div className="displayNone">

                                        </div>
                                    </div>
                                    <div>

                                    </div>
                                </div>
                                <div className="otherPlayers" >
                                    <div>
                                        {allGameInfo[0].participantIdentities.map((participant, i_OtherPlayers) => {
                                            if (i_OtherPlayers > 4) return []
                                            else {
                                                return <div className="playerList" key={i_OtherPlayers}>
                                                    <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/champion/'
                                                        + champions[allGameInfo[0].participants[i_OtherPlayers].championId] + '.png'}
                                                        alt={"Champion"} />
                                                    {participant.player.summonerName}
                                                </div>
                                            }
                                        })}
                                    </div>
                                    <div>
                                        {allGameInfo[0].participantIdentities.map((participant, i_OtherPlayers) => {
                                            if (i_OtherPlayers < 5) return []
                                            else {
                                                return <div className="playerList" key={i_OtherPlayers}>
                                                    <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/champion/'
                                                        + champions[allGameInfo[0].participants[i_OtherPlayers].championId] + '.png'}
                                                        alt={"Champion"} />
                                                    {participant.player.summonerName}
                                                </div>
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                }
                <div
                    onClick={() => {
                        this.fetchInfoAboutGame()
                    }}
                >
                    Load more
                </div>
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


const mapStateToProps = state => ({
    last100games: state.summonerInfoState.last100games,
    championsIDs: state.someDataGame.championsIDs,
    gamesIDs: state.someDataGame.gamesIDs,
    spellsDictionary: state.someDataGame.spellsDictionary,
});

export default compose(
    // withFirebase,
    connect(mapStateToProps),
)(GameHistory);
