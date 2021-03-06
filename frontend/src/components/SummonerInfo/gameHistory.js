import React from 'react';
import '../../css/gameHistory.css'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux';
import { compose } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from "react-router-dom";
import { productionFetch } from '../productionVariables.js'


class GameHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            displayedGames: 0,
            fetchStep: 10,
            status: false,
            errorMessage: "",
            fetchedGames: [],
            baisicsGameInfo: [],
            loadAgain: [],
            loadMore: true,
            isDisabled: false,
            filterHistory: "All games",
            gameTypes: [],
            quueueTypeActiveIndex: 0,
        };
        this._isMounted = false;

    };


    componentDidMount() {
        this._isMounted = true;
        this.props.setRecentlyPlayedWith([true, []])
        let gameTypes = []
        this.props.last100games.forEach((game) => {
            if (gameTypes.includes(game.queue)) { }
            else gameTypes.push(game.queue)
        })

        gameTypes.sort()
        gameTypes.unshift("All games")
        this.setState({
            gameTypes: gameTypes,
        })
        this.fetchInfoAboutGame()

        //     console.log(localStorage.length);
        //     for (var i = 0; i < localStorage.length; i++){
        //        console.log(localStorage.getItem(localStorage.key(i)));
        //        console.log("///////////////////////////////////////////////////");
        //     }

        //     var data = '';

        // console.log('Current local storage: ');

        // for(var key in window.localStorage){

        //     if(window.localStorage.hasOwnProperty(key)){
        //         data += window.localStorage[key];
        //         // console.log( key + " = " + ((window.localStorage[key].length * 16)/(8 * 1024)).toFixed(2) + ' KB' );
        //     }

        // }

        // console.log(data ? '\n' + 'Total space used: ' + ((data.length * 16)/(8 * 1024)).toFixed(2) + ' KB' : 'Empty (0 KB)');
        // console.log(data ? 'Approx. space remaining: ' + (5120 - ((data.length * 16)/(8 * 1024)).toFixed(2)) + ' KB' : '5 MB');

    }

    async fetchInfoAboutGame() {
        const filterHistory = this.state.filterHistory
        const lastGames = this.props.last100games.filter(game => game.queue === filterHistory || filterHistory === "All games")
        let displayedGames = this.state.displayedGames
        const fetchStep = this.state.fetchStep
        let fetchedGames = this.state.fetchedGames
        const condition = displayedGames + fetchStep
        let matchIDs = []
        let baisicsGameInfo = this.state.baisicsGameInfo

        for (; displayedGames < condition; displayedGames++) {
            if (lastGames.length > displayedGames) {
                matchIDs.push(lastGames[displayedGames].gameId)
                baisicsGameInfo.push(lastGames[displayedGames])
            }
            else {
                this.setState({
                    loadMore: false
                })
            }
        }

        // matchIDs[1] = "4444d44"
        // baisicsGameInfo.push(lastGames[3])

        // const RiotApiKey = "?api_key=" + process.env.REACT_APP_RITO_API_KEY
        // const RiotApiKeySecond = "&api_key=" + process.env.REACT_APP_RITO_API_KEY
        // const region = "https://eun1.api.riotgames.com"
        const region = "eun1"
        // const cors = "https://cors-anywhere.herokuapp.com/"
        // const cors = ""
        let getStorageGame
        let response = ''
        let timeInMs = Date.now();

        let [...rest] = await Promise.all(
            matchIDs.map(async (matchID) => {
                getStorageGame = JSON.parse(localStorage.getItem(matchID))
                if (getStorageGame) {

                    return getStorageGame
                }
                else {
                    // response = await fetch(cors + region + "/lol/match/v4/matches/" + matchID + RiotApiKey)
                    response = await fetch(productionFetch + "/api/match?region=" + region + "&matchID=" + matchID)

                    if (!this._isMounted) return
                    if (response.status !== 200) {
                        console.log("22222");
                        return ["error", productionFetch + "/api/match?region=" + region + "&matchID=" + matchID]
                    }
                    else {
                        console.log("33333");
                        let jsonresponse = await response.json()
                        let returngameInfo = [jsonresponse, timeInMs]
                        try {
                            localStorage.setItem(jsonresponse.gameId, JSON.stringify(returngameInfo));
                        } catch (e) {
                            console.log("clear //////////////////////////");
                            localStorage.clear()
                        }
                        return returngameInfo

                    }
                }
            }))


        fetchedGames.push(...rest)



        ////// check if player was playing more than 2 times with other players
        this.recentlyPlayed(this.state.fetchedGames)


        this.setState({
            fetchedGames: fetchedGames,
            displayedGames: displayedGames,
            baisicsGameInfo: baisicsGameInfo,
            isLoading: false,
            isDisabled: false,
        })


    }
    applyNewClass = (indexQueue) => {
        this.setState({
            quueueTypeActiveIndex: indexQueue,
        })
    }


    recentlyPlayed = (fetchedGames) => {
        let recentlyPlayedWith = {}
        let temporaryKeyArray = []
        let enemyOrAlly = null

        fetchedGames.forEach((game) => {
            if (game[0] === "error") return
            game[0].participantIdentities.slice(0, 5).forEach((participant, i_OtherPlayers) => {

                temporaryKeyArray.push(participant.player.summonerName)

                if (recentlyPlayedWith[participant.player.summonerName]) {
                    let tempArray = recentlyPlayedWith[participant.player.summonerName]
                    tempArray[0] = tempArray[0] + 1
                    recentlyPlayedWith[participant.player.summonerName] = tempArray
                }
                else {
                    recentlyPlayedWith[participant.player.summonerName] = [1, 0, 0]
                }

                if (this.props.basicInfoSummoner.name === participant.player.summonerName) {
                    enemyOrAlly = true
                }

                if (i_OtherPlayers === 4) {
                    if (enemyOrAlly === true) {
                        temporaryKeyArray.forEach((summName) => {
                            let tempArrary = recentlyPlayedWith[summName]
                            tempArrary[1] = parseInt(tempArrary[1]) + 1
                            recentlyPlayedWith[summName] = tempArrary
                        })
                    }
                    else if (enemyOrAlly === false) {
                        temporaryKeyArray.forEach((summName) => {
                            let tempArrary = recentlyPlayedWith[summName]
                            if (summName === "ArehCats") console.log("1", tempArrary);

                            tempArrary[2] = parseInt(tempArrary[2]) + 1
                            if (summName === "ArehCats") console.log("2", tempArrary);

                            recentlyPlayedWith[summName] = tempArrary
                            if (summName === "ArehCats") console.log(recentlyPlayedWith[summName]);
                        })
                    }
                    temporaryKeyArray = []
                    enemyOrAlly = false
                }

            })


            game[0].participantIdentities.slice(5, 10).forEach((participant, i_OtherPlayers) => {

                temporaryKeyArray.push(participant.player.summonerName)

                if (recentlyPlayedWith[participant.player.summonerName]) {
                    let tempArray = recentlyPlayedWith[participant.player.summonerName]
                    tempArray[0] = tempArray[0] + 1
                    recentlyPlayedWith[participant.player.summonerName] = tempArray
                }
                else {
                    recentlyPlayedWith[participant.player.summonerName] = [1, 0, 0]
                }

                if (this.props.basicInfoSummoner.name === participant.player.summonerName) {
                    enemyOrAlly = true
                }

                if (i_OtherPlayers === 4) {
                    if (enemyOrAlly === true) {
                        temporaryKeyArray.forEach((summName) => {
                            let tempArrary = recentlyPlayedWith[summName]
                            tempArrary[1] = parseInt(tempArrary[1]) + 1
                            recentlyPlayedWith[summName] = tempArrary
                        })
                    }
                    else if (enemyOrAlly === false) {
                        temporaryKeyArray.forEach((summName) => {
                            let tempArrary = recentlyPlayedWith[summName]
                            if (summName === "ArehCats") console.log("1", tempArrary);

                            tempArrary[2] = parseInt(tempArrary[2]) + 1
                            if (summName === "ArehCats") console.log("2", tempArrary);

                            recentlyPlayedWith[summName] = tempArrary
                            if (summName === "ArehCats") console.log(recentlyPlayedWith[summName]);
                        })
                    }
                    temporaryKeyArray = []
                    enemyOrAlly = false
                }

            })

        })


        if (recentlyPlayedWith[this.props.basicInfoSummoner.name]) delete recentlyPlayedWith[this.props.basicInfoSummoner.name]

        let ArrayRecentlyPlayedWith = Object.keys(recentlyPlayedWith).map((key) => [key, recentlyPlayedWith[key]]);

        ArrayRecentlyPlayedWith.sort((a, b) => {
            return b[1][1] - a[1][1]
        })

        if (ArrayRecentlyPlayedWith.length !== 0) {
            console.log(ArrayRecentlyPlayedWith[1][1][0]);
            if (ArrayRecentlyPlayedWith[1][1][0] === 1) {
                ArrayRecentlyPlayedWith = []
            }
        }
        this.props.setRecentlyPlayedWith([false, ArrayRecentlyPlayedWith])
    }


    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        let champions = this.props.championsIDs
        const acutalPatch = this.props.acutalPatch

        return (
            <div id="rightConteiner">

                <div className="topBoxHistory">
                    <div className="topBoxfilterHistory">
                        {this.state.gameTypes.map((queueId, indexQueue) => {
                            const className = (this.state.quueueTypeActiveIndex === indexQueue) ? "quueueTypeActive" : "quueueType"

                            let name
                            if (queueId === "All games") name = "All games"
                            else name = this.props.queuesIDsDictionary[queueId]

                            return <div className={className} key={indexQueue} onClick={() => {
                                this.setState({
                                    filterHistory: queueId,
                                    displayedGames: 0,
                                    fetchedGames: [],
                                    baisicsGameInfo: [],
                                    loadMore: true,
                                    isLoading: true,
                                }, () => {
                                    this.applyNewClass(indexQueue)
                                    this.fetchInfoAboutGame()
                                })
                            }}>
                                <Button type="submit" variant="outlined" color="primary">
                                    {name}
                                </Button>

                            </div>
                        })}
                    </div>
                    {/* <div className="topBoxStats">
                        stats history
                    </div> */}
                </div>
                { this.state.isLoading ? <Loading status={this.state.status} errorMessage={this.state.errorMessage} />
                    :
                    <div>
                        {this.state.fetchedGames.map((allGameInfo, i) => {

                            // check if game fetched properly
                            if (allGameInfo[0] === "error") {
                                return <div key={i} onClick={async () => {


                                    let loadAgain = this.state.loadAgain
                                    loadAgain[i] = true
                                    this.setState({
                                        loadAgain: loadAgain,
                                    })

                                    let response = await fetch(allGameInfo[1])
                                    if (!this._isMounted) return

                                    if (response.status !== 200) {
                                        loadAgain[i] = false

                                        return this.setState({
                                            loadAgain: loadAgain,
                                        })
                                    }
                                    else {
                                        let timeInMs = Date.now();

                                        let jsonresponse = await response.json()
                                        let returngameInfo = [jsonresponse, timeInMs]
                                        try {
                                            localStorage.setItem(jsonresponse.gameId, JSON.stringify(returngameInfo));
                                        } catch (e) {
                                            localStorage.clear()
                                        }
                                        let games = this.state.fetchedGames
                                        games[i] = returngameInfo
                                        loadAgain[i] = false

                                        this.setState({
                                            fetchedGames: games,
                                            loadAgain: loadAgain,
                                        }, () => {
                                            this.recentlyPlayed(this.state.fetchedGames)
                                        })
                                    }
                                }}>
                                    {this.state.loadAgain[i] ? <div className="circular" align="center"><CircularProgress /></div>
                                        :
                                        <div className="refresh">
                                            Ups.. something went wrong, click to try refresh
                                        </div>
                                    }
                                </div>
                            }




                            let classBackround = "gameHistory lose"

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
                            if (kda === Infinity || isNaN(kda)) kda = "Perfect"

                            let gameDurationMinutes = Math.round((allGameInfo[0].gameDuration) / 60)
                            let gameDurationSeconds = (allGameInfo[0].gameDuration) % 60
                            let timeInMs = Date.now();
                            let gameCreation = allGameInfo[0].gameCreation
                            let timeMinutes = Math.round((timeInMs - gameCreation) / 60000) - 45
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


                            let killsInRow

                            if (allGameInfo[0].participants[participantId[0]].stats.pentaKills) {
                                killsInRow = "Penta kill"
                            }
                            else if (allGameInfo[0].participants[participantId[0]].stats.quadraKills) {
                                killsInRow = "Quadra kill"
                            }
                            else if (allGameInfo[0].participants[participantId[0]].stats.tripleKills) {
                                killsInRow = "Triple kill"
                            }
                            else if (allGameInfo[0].participants[participantId[0]].stats.doubleKills) {
                                killsInRow = "Dobule kill"
                            }



                            let ifWin
                            if (allGameInfo[0].participants[participantId[0]].stats.win) ifWin = "Victory"
                            else ifWin = "Defeat"

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
                            // check if remake
                            if (gameDurationMinutes * 60 < 401 && (allGameInfo[0].queueId === 420 || allGameInfo[0].queueId === 440)) {
                                classBackround = "gameHistory remakeGame"
                                ifWin = "Remake"
                            }



                            return <div className={classBackround} key={i}>


                                <div className="basicInfoGame">
                                    <div title={this.props.queuesIDsDictionary[allGameInfo[0].queueId]} className="gameType">
                                        {this.props.queuesIDsDictionary[allGameInfo[0].queueId]}
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
                                            <img src={'https://ddragon.leagueoflegends.com/cdn/' + acutalPatch + '/img/champion/'
                                                + champions[allGameInfo[0].participants[participantId[0]].championId] + '.png'}
                                                alt={"Champion"} />
                                        </div>
                                        <div className="SpellsImg">
                                            <img
                                                src={"https://ddragon.leagueoflegends.com/cdn/" + acutalPatch + "/img/spell/"
                                                    + this.props.spellsDictionary[allGameInfo[0].participants[participantId[0]].spell1Id] + ".png"}
                                                alt={"Spell"} />
                                            <img
                                                src={"https://ddragon.leagueoflegends.com/cdn/" + acutalPatch + "/img/spell/"
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
                                    <div className="killsInRow">
                                        {killsInRow}
                                    </div>
                                </div>



                                <div className="level_cs_part_kills">
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
                                            {allGameInfo[0].participants[participantId[0]].stats.totalMinionsKilled + allGameInfo[0].participants[participantId[0]].stats.neutralMinionsKilled}
                                        </div>
                                    </div>
                                    <div className="minionsMinute">
                                        <div>
                                            Minions / minute
                                        </div>
                                        <div>
                                            {Math.round(10 * (allGameInfo[0].participants[participantId[0]].stats.totalMinionsKilled + allGameInfo[0].participants[participantId[0]].stats.neutralMinionsKilled) / (allGameInfo[0].gameDuration / 60)) / 10}
                                        </div>
                                    </div>
                                </div>



                                <div className="items">
                                    <div>
                                        <div>
                                            {allGameInfo[0].participants[participantId[0]].stats.item0 ?
                                                <img src={'https://ddragon.leagueoflegends.com/cdn/' + acutalPatch + '/img/item/'
                                                    + allGameInfo[0].participants[participantId[0]].stats.item0 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[participantId[0]].stats.item1 ?
                                                <img src={'https://ddragon.leagueoflegends.com/cdn/' + acutalPatch + '/img/item/'
                                                    + allGameInfo[0].participants[participantId[0]].stats.item1 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[participantId[0]].stats.item2 ?
                                                <img src={'https://ddragon.leagueoflegends.com/cdn/' + acutalPatch + '/img/item/'
                                                    + allGameInfo[0].participants[participantId[0]].stats.item2 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[participantId[0]].stats.item6 ?
                                                <img src={'https://ddragon.leagueoflegends.com/cdn/' + acutalPatch + '/img/item/'
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
                                                <img src={'https://ddragon.leagueoflegends.com/cdn/' + acutalPatch + '/img/item/'
                                                    + allGameInfo[0].participants[participantId[0]].stats.item3 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[participantId[0]].stats.item4 ?
                                                <img src={'https://ddragon.leagueoflegends.com/cdn/' + acutalPatch + '/img/item/'
                                                    + allGameInfo[0].participants[participantId[0]].stats.item4 + '.png'}
                                                    alt={""} />
                                                :
                                                []
                                            }
                                        </div>
                                        <div>
                                            {allGameInfo[0].participants[participantId[0]].stats.item5 ?
                                                <img src={'https://ddragon.leagueoflegends.com/cdn/' + acutalPatch + '/img/item/'
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
                                        {allGameInfo[0].participantIdentities.slice(0, 5).map((participant, i_OtherPlayers) => {
                                            return <div className="playerList" key={i_OtherPlayers}>
                                                <Link to={"/eune/" + participant.player.summonerName.toLowerCase()}>
                                                    <img title={champions[allGameInfo[0].participants[i_OtherPlayers].championId]} src={'https://ddragon.leagueoflegends.com/cdn/' + acutalPatch + '/img/champion/'
                                                        + champions[allGameInfo[0].participants[i_OtherPlayers].championId] + '.png'}
                                                        alt={"Champion"} />
                                                    {(participantId[0] === i_OtherPlayers) ? <b>{participant.player.summonerName}</b> : participant.player.summonerName}
                                                </Link>
                                            </div>
                                        })}
                                    </div>
                                    <div>
                                        {allGameInfo[0].participantIdentities.slice(5, 10).map((participant, i_OtherPlayers) => {
                                            return <div className="playerList" key={i_OtherPlayers}>
                                                <Link to={"/eune/" + participant.player.summonerName.toLowerCase()}>
                                                    <img title={champions[allGameInfo[0].participants[i_OtherPlayers + 5].championId]} src={'https://ddragon.leagueoflegends.com/cdn/' + acutalPatch + '/img/champion/'
                                                        + champions[allGameInfo[0].participants[i_OtherPlayers + 5].championId] + '.png'}
                                                        alt={"Champion"} />
                                                    {(participantId[0] === i_OtherPlayers + 5) ? <b>{participant.player.summonerName}</b> : participant.player.summonerName}
                                                </Link>
                                            </div>
                                        })}
                                    </div>
                                </div>


                            </div>
                        })}
                        <div>
                            {this.state.loadMore ?
                                <Button
                                    onClick={() => {

                                        this.props.setRecentlyPlayedWith([true, []])

                                        this.setState({
                                            isDisabled: true,
                                        }, () => {
                                            this.fetchInfoAboutGame()
                                        })
                                    }}
                                    disabled={this.state.isDisabled} id="showMoreHistoryButton" type="submit" variant="outlined" color="primary">
                                    {this.state.isDisabled ? <div align="center"><CircularProgress /></div> : "Show more"}
                                </Button>
                                :
                                <Button id="showMoreHistoryButton" disabled={true} type="submit" variant="outlined" color="primary">
                                    No more games to display
                                </Button>
                            }
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


const mapStateToProps = state => ({
    last100games: state.summonerInfoState.last100games,
    championsIDs: state.someDataGame.championsIDs,
    queuesIDsDictionary: state.someDataGame.queuesIDsDictionary,
    spellsDictionary: state.someDataGame.spellsDictionary,
    acutalPatch: state.someDataGame.acutalPatch,
    basicInfoSummoner: state.summonerInfoState.basicInfoSummoner,
});

const mapDispatchToProps = dispatch => ({
    setRecentlyPlayedWith: recentlyPlayedWith =>
        dispatch({ type: 'RECENTLY_PLAYED_WITH_SET', recentlyPlayedWith }),
});




export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(GameHistory);
