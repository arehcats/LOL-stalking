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
            <div>
                <div
                    onClick={() => {
                        console.log(this.state.fetchedGames);
                    }}
                >
                    click
                </div>
                { this.state.isLoading ? <Loading status={this.state.status} errorMessage={this.state.errorMessage} />
                    :
                    <div>
                        {this.state.fetchedGames.map((allGameInfo, i) => {
                            let classBackround = "gameHistory lose"
                            console.log(allGameInfo);
                            console.log(allGameInfo[0]);
                            console.log(allGameInfo[0].teams[0]);

                            if (allGameInfo[0].teams[0].teamId === allGameInfo[1][1]) {
                                if (allGameInfo[0].teams[0].win === "Fail"){
                                }
                                else {
                                    classBackround = "gameHistory win"
                                }
                            }
                            else if (allGameInfo[0].teams[1].teamId === allGameInfo[1][1]) {
                                if (allGameInfo[0].teams[1].win === "Fail"){
                                }
                                else {
                                    classBackround = "gameHistory win"
                                }
                            }
                            return <div className={classBackround} key={i}>
                                <div>
                                    1
                                </div>
                                <div className="championAndSpellsImg">
                                    <div>
                                        <div className="championsImg" >
                                            <img src={'/assets/images/champions/'
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
                                <div>

                                </div>
                                <div>

                                </div>
                                <div>

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
