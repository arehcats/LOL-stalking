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
            setClass: ["statsSelected", "stats", "stats"],
            statsComponents: [],
            displayNumber: 6,
            showMoreId: "showMore",
        };

    };

    componentDidMount() {
        let dictionaryChampsID = this.props.championsIDs
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

    changeClassShowMore = (newClassName) => {
        this.setState({
            showMoreId: newClassName,
        })
    }

    render() {
        return (
            <div>
                {this.state.isLodaing ? <div align="center"><CircularProgress /></div>
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
                                statsComponents={this.state.statsComponents}
                                displayNumber={this.state.displayNumber}
                            />
                        </div>
                        <div id="stats" onClick={() => {
                            this.setState((prevState) => ({
                                displayNumber: prevState.displayNumber + 8
                            }));
                        }}>
                            {(this.state.displayNumber >= this.state.statsComponents[this.state.stats].length)
                                ?
                                ""
                                :
                                < Button id="showMore"
                                    type="submit" variant="outlined" color="primary">
                                    Show more
                                </Button>}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

const Stats = ({ stats, statsComponents, displayNumber }) => {
    if (stats === 0) {
        if (statsComponents[0].length === 0) return <div className="gamesNotFound" >You haven't play this game mode in this season</div>
        return <div className="statsListing" >
            {statsComponents[0].map((val, i) => {
                if (i > displayNumber) return null
                return val
            })}
        </div>
    }
    else if (stats === 1) {
        if (statsComponents[1].length === 0) return <div className="gamesNotFound">You haven't play this game mode in this season</div>
        return <div className="statsListing" >
            {statsComponents[1].map((val, i) => {
                if (i > displayNumber) return null
                return val
            })}
        </div>
    }
    else {
        if (statsComponents[2].length === 0) return <div className="gamesNotFound">You haven't play this game mode in this season</div>
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
        elemtns.push(<div key={i}>
            <img src={'http://ddragon.leagueoflegends.com/cdn/11.1.1/img/champion/' + dictionaryChampsID[val[0]] + '.png'}
                alt={"Summoner icon"} />
            <div className="statsListingInside" >
                <div>
                    <span className="boldStats">{dictionaryChampsID[val[0]]}</span>
                </div>
                <div>
                    <span className="fontSizeStats">Played games: </span><span className="boldStats">{val[1]}</span>
                </div>
            </div>
        </div>)
    })

    return elemtns
}


const mapStateToProps = state => ({
    basicInfoSummoner: state.summonerInfoState.basicInfoSummoner,
    championsPlayedFlex: state.summonerInfoState.championsPlayedFlex,
    championsPlayedSolo: state.summonerInfoState.championsPlayedSolo,
    championsPlayedAram: state.summonerInfoState.championsPlayedAram,
    championsIDs: state.someDataGame.championsIDs,
});

export default compose(
    // withFirebase,
    connect(mapStateToProps),
)(ChampionsStatistic);
