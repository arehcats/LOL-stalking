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
            fetchStep: 2,
            status: false,
            errorMessage: "",
            fetchedGames: [],
        };

    };

    componentDidMount() {
        this.fetchInfoAboutGame()

    }

    async fetchInfoAboutGame() {

        // console.log(this.props.last100games[0]);
        const lastGames = this.props.last100games
        let displayedGames = this.state.displayedGames
        const fetchStep = this.state.fetchStep
        let fetchedGames = this.state.fetchedGames
        const condition = displayedGames + fetchStep
        let matchIDs = []
        let baisicsGameInfo = []

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
        let fetchURLs = []
        matchIDs.forEach(matchID => {
            getStorageGame = JSON.parse(localStorage.getItem(matchID))
            // console.log(getStorageGame);
            if (getStorageGame) {
                // console.log("storage");
                fetchedGames.push(getStorageGame)
                fetchURLs.push("")
            }
            else {
                fetchURLs.push(cors + region + "/lol/match/v4/matches/" + matchID + RiotApiKey)
            }
            // fetchURLs.push(cors + region + "/lol/match/v4/matches/" + matchID + RiotApiKey)

        });
        // console.log(fetchURLs);

        // const [...rest] = await Promise.all(
        //     [
        //         fetch(fetchURLs[0]),
        //         fetch(fetchURLs[1]),
        //     ]
        // );

        // console.log(rest);

        // const game1 = await rest[0].json();
        // const game2 = await rest[1].json();
        // let game1participant = []
        // let game2participant = []

        // game1.participants.forEach((participant, i) => {
        //     console.log(participant);

        //     if (participant.championId === baisicsGameInfo[0].champion) {
        //         console.log("111");
        //         game1participant.push(i, participant.teamId, baisicsGameInfo[0].timestamp)

        //     }
        // })
        // game2.participants.forEach((participant, i) => {
        //     console.log(participant);

        //     if (participant.championId === baisicsGameInfo[1].champion) {
        //         console.log("222");
        //         game2participant.push(i, participant.teamId, baisicsGameInfo[1].timestamp)
        //     }
        // })

        // console.log(game1participant);
        // console.log(game2participant);

        // let gameInfo1 = [game1, game1participant]
        // let gameInfo2 = [game2, game2participant]
        // console.log(game1);
        // console.log(game2);

        // localStorage.setItem(game1.gameId, JSON.stringify(gameInfo1));
        // localStorage.setItem(game2.gameId, JSON.stringify(gameInfo2));


        // fetchedGames.push(gameInfo1, gameInfo2)

        this.setState({
            fetchedGames: fetchedGames,
            displayedGames: displayedGames,
            isLoading: false,
        })


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
                            console.log(allGameInfo);
                            console.log(allGameInfo[0]);
                            let kills = allGameInfo[0].participants[allGameInfo[1][0]].stats.kills
                            let deaths = allGameInfo[0].participants[allGameInfo[1][0]].stats.deaths
                            let assists = allGameInfo[0].participants[allGameInfo[1][0]].stats.assists
                            let kda = Math.round(100 * (kills + assists) / deaths) / 100
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
                            if (allGameInfo[0].participants[allGameInfo[1][0]].stats.win) ifWin = "Victory"
                            else ifWin = "Defeat"



                            let killsInRows

                            if (allGameInfo[0].participants[allGameInfo[1][0]].stats.pentaKills) {
                                killsInRows = "Penta kill"
                            }
                            else if (allGameInfo[0].participants[allGameInfo[1][0]].stats.quadraKills) {
                                killsInRows = "Quadra kill"
                            }
                            else if (allGameInfo[0].participants[allGameInfo[1][0]].stats.tripleKills) {
                                killsInRows = "Triple kill"
                            }
                            else if (allGameInfo[0].participants[allGameInfo[1][0]].stats.doubleKills) {
                                killsInRows = "Dobule kill"
                            }

                            if (allGameInfo[0].teams[0].teamId === allGameInfo[1][1]) {
                                if (allGameInfo[0].teams[0].win === "Fail") {
                                }
                                else {
                                    classBackround = "gameHistory win"
                                }
                            }
                            else if (allGameInfo[0].teams[1].teamId === allGameInfo[1][1]) {
                                if (allGameInfo[0].teams[1].win === "Fail") {
                                }
                                else {
                                    classBackround = "gameHistory win"
                                }
                            }
                            return <div className={classBackround} key={i}>
                                <div>
                                    <div title = {this.props.gamesIDs[allGameInfo[0].queueId]} className="gameType">
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
                                                + champions[allGameInfo[0].participants[allGameInfo[1][0]].championId] + '.png'}
                                                alt={"Champion"} />
                                        </div>
                                        <div className="SpellsImg">
                                            <img
                                                src={"http://ddragon.leagueoflegends.com/cdn/11.1.1/img/spell/"
                                                    + this.props.spellsDictionary[allGameInfo[0].participants[allGameInfo[1][0]].spell1Id] + ".png"}
                                                alt={"Spell"} />
                                            <img
                                                src={"http://ddragon.leagueoflegends.com/cdn/11.1.1/img/spell/"
                                                    + this.props.spellsDictionary[allGameInfo[0].participants[allGameInfo[1][0]].spell2Id] + ".png"}
                                                alt={"Spell"} />
                                        </div>
                                    </div>
                                    <div className="championName">
                                        {champions[allGameInfo[0].participants[allGameInfo[1][0]].championId]}
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
                                            {allGameInfo[0].participants[allGameInfo[1][0]].stats.champLevel}
                                        </div>
                                    </div>
                                    <div className="minions">
                                        <div>
                                            Minions
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[allGameInfo[1][0]].stats.totalMinionsKilled}
                                        </div>
                                    </div>
                                    <div className="minionsMinute">
                                        <div>
                                            Minions / minute
                                        </div>
                                        <div>
                                            {Math.round(10 * (allGameInfo[0].participants[allGameInfo[1][0]].stats.totalMinionsKilled) / (allGameInfo[0].gameDuration / 60)) / 10}
                                        </div>
                                    </div>
                                </div>
                                <div className="items">
                                    <div>
                                        <div>
                                            {allGameInfo[0].participants[allGameInfo[1][0]].stats.item0 ?
                                                <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/'
                                                    + allGameInfo[0].participants[allGameInfo[1][0]].stats.item0 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[allGameInfo[1][0]].stats.item1 ?
                                                <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/'
                                                    + allGameInfo[0].participants[allGameInfo[1][0]].stats.item1 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[allGameInfo[1][0]].stats.item2 ?
                                                <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/'
                                                    + allGameInfo[0].participants[allGameInfo[1][0]].stats.item2 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[allGameInfo[1][0]].stats.item6 ?
                                                <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/'
                                                    + allGameInfo[0].participants[allGameInfo[1][0]].stats.item6 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            {allGameInfo[0].participants[allGameInfo[1][0]].stats.item3 ?
                                                <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/'
                                                    + allGameInfo[0].participants[allGameInfo[1][0]].stats.item3 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[allGameInfo[1][0]].stats.item4 ?
                                                <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/'
                                                    + allGameInfo[0].participants[allGameInfo[1][0]].stats.item4 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[allGameInfo[1][0]].stats.item5 ?
                                                <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/'
                                                    + allGameInfo[0].participants[allGameInfo[1][0]].stats.item5 + '.png'}
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
                                        {allGameInfo[0].participantIdentities.map((participant, i) => {
                                            if (i > 4) return []
                                            else {
                                                return <div className="playerList" key={i}>
                                                    <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/champion/'
                                                        + champions[allGameInfo[0].participants[i].championId] + '.png'}
                                                        alt={"Champion"} />
                                                    {participant.player.summonerName}
                                                </div>
                                            }
                                        })}
                                    </div>
                                    <div>
                                        {allGameInfo[0].participantIdentities.map((participant, i) => {
                                            if (i < 5) return []
                                            else {
                                                return <div className="playerList" key={i}>
                                                    <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/champion/'
                                                        + champions[allGameInfo[0].participants[i].championId] + '.png'}
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
