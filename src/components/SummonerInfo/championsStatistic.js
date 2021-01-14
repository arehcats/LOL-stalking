import React from 'react';
import '../../css/SummonerInfo.css'
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux';
import { compose } from 'recompose';


class ChampionsStatistic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLodaing: true,
            stats: 0,
            errorMessage: "",
            dictionaryChampsID: [],
            setClass: ["statsSelected", "stats", "stats"],
            statsComponents: [],
            displayNumber: 6,
        };

    };

    async componentDidMount() {
        // const SummonerName = this.state.SummonerName
        // const region = "https://eun1.api.riotgames.com"
        const cors = "https://cors-anywhere.herokuapp.com/"
        // const basicInfoSummoner = this.props.basicInfoSummoner

        /// fetch champions names and their ID
        const responseChampions = await fetch(cors + "http://ddragon.leagueoflegends.com/cdn/11.1.1/data/en_US/champion.json")
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
            // console.log(`${key}: ${value.key}`);

            dictionaryChampsID.push([value.key, key])
        }

        let statsComponents = []
        statsComponents[0] = StatsComponent(this.props.championsPlayedSolo, dictionaryChampsID)
        statsComponents[1] = StatsComponent(this.props.championsPlayedFlex, dictionaryChampsID)
        statsComponents[2] = StatsComponent(this.props.championsPlayedAram, dictionaryChampsID)

        this.setState({
            isLodaing: false,
            statsComponents: statsComponents,
        })

    }

    changeClass = (id) => {
        let copyState = [...this.state.setClass];
        copyState.forEach((val, i) => {
            copyState[i] = 'stats'
        })
        copyState[id] = 'statsSelected'
        this.setState({
            setClass: copyState
        });
    }


    render() {
        return (
            <div>
                {this.state.isLodaing ? <Loading status={this.state.status} />
                    :
                    <div>
                        <div id="statsSelectGameType">
                            <div className={this.state.setClass[0]}>
                                <Button type="submit" variant="outlined" color="primary"
                                    onClick={() => {
                                        this.changeClass(0)
                                        this.setState({
                                            stats: 0,
                                            displayNumber: 6,
                                        })
                                    }}
                                >
                                    SoloQ
                                </Button>
                            </div>
                            <div className={this.state.setClass[1]}>
                                <Button type="submit" variant="outlined" color="primary"
                                    onClick={() => {
                                        this.changeClass(1)
                                        this.setState({
                                            stats: 1,
                                            displayNumber: 6,
                                        })
                                    }}
                                >
                                    Flex
                                </Button>
                            </div>
                            <div className={this.state.setClass[2]}>
                                <Button type="submit" variant="outlined" color="primary"
                                    onClick={() => {
                                        this.changeClass(2)
                                        this.setState({
                                            stats: 2,
                                            displayNumber: 6,
                                        })
                                    }}
                                >
                                    Aram
                                </Button>
                            </div>
                        </div>
                        <div>
                            <Stats stats={this.state.stats}
                                statsComponents={this.state.statsComponents} displayNumber={this.state.displayNumber} />
                        </div>
                        <div id="stats" onClick={() => {
                            this.setState((prevState) => ({
                                displayNumber: prevState.displayNumber + 8
                            }));
                        }}>
                            <Button id="showMore" type="submit" variant="outlined" color="primary">
                                Show more
                                </Button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

const Stats = ({ stats, statsComponents, displayNumber }) => {
    if (stats === 0) {
        if (statsComponents[0].length === 0) return <div className="gamesNotFound" >You haven't play this game mode in preseason</div>
        return <div className="statsListing" >
            {statsComponents[0].map((val, i) => {
                if (i > displayNumber) return null
                return val
            })}
        </div>
    }
    else if (stats === 1) {
        if (statsComponents[1].length === 0) return <div className="gamesNotFound">You haven't play this game mode in preseason</div>
        return <div className="statsListing" >
            {statsComponents[1].map((val, i) => {
                if (i > displayNumber) return null
                return val
            })}
        </div>
    }
    else {
        if (statsComponents[2].length === 0) return <div className="gamesNotFound">You haven't play this game mode in preseason</div>
        return <div className="statsListing" >
            {statsComponents[2].map((val, i) => {
                if (i > displayNumber) return null
                return val
            })}
        </div>
    }

}

const StatsComponent = (championsPlayed, dictionaryChampsID) => {
    let elemtns = []

    championsPlayed.forEach((val, i) => {
        dictionaryChampsID.forEach((val2, i2) => {
            if (val2[0] === val[0]) {
                elemtns.push(<div key={i}>
                    <img src={'/assets/images/champions/' + val2[1] + '.png'}
                        alt={"Summoner icon"} />
                    <div className="statsListingInside" >
                        <div>
                            <span className="boldStats">{val2[1]}</span>
                        </div>
                        <div>
                            <span className="fontSizeStats">Played games: </span><span className="boldStats">{val[1]}</span>
                        </div>
                    </div>
                </div>)
            }
        })
    })

    return elemtns
}


const Loading = ({ status }) => {
    if (status === false) {
        return <div align="center"><CircularProgress /></div>
    }
    else if (status === 404) {
        console.log("ell");
        return <div>User not found</div>
    }
    else {
        return <div>Ups... something went wrong</div>
    }
}

const mapStateToProps = state => ({
    basicInfoSummoner: state.summonerInfoState.basicInfoSummoner,
    championsPlayedFlex: state.summonerInfoState.championsPlayedFlex,
    championsPlayedSolo: state.summonerInfoState.championsPlayedSolo,
    championsPlayedAram: state.summonerInfoState.championsPlayedAram,
});

export default compose(
    // withFirebase,
    connect(mapStateToProps),
)(ChampionsStatistic);
