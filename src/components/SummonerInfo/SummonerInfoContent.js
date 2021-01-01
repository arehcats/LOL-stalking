import React from 'react';
import '../../css/SummonerInfo.css'
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'
import ChampionsStatistic from './championsStatistic'


class SearchUserInputContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SummonerName: this.props.match.params.SummonerName,
            isLodaing: true,
            status: false,
            basicInfoSummoner: "",
            soloRank: "",
            flexRank: "",
        };
    };
    async componentDidMount() {
        const SummonerName = this.state.SummonerName
        const RiotApiKey = "?api_key=" + process.env.REACT_APP_RITO_API_KEY
        const region = "https://eun1.api.riotgames.com"
        const cors = "https://cors-anywhere.herokuapp.com/"

        // fetch data by summuner name
        const SummonerByName = region + "/lol/summoner/v4/summoners/by-name/" + SummonerName + RiotApiKey
        const responseSummonerByName = await fetch(cors + SummonerByName)
        if (responseSummonerByName.status !== 200) {
            this.setState({
                status: responseSummonerByName.status
            })
            return
        }
        const jsonSummonerByName = await responseSummonerByName.json()
        console.log(jsonSummonerByName);
        this.setState({
            basicInfoSummoner: jsonSummonerByName,
        })

        // fetch summoner rank by summoner id
        const SummonerID = jsonSummonerByName.id
        const SummonerRank = region + "/lol/league/v4/entries/by-summoner/" + SummonerID + RiotApiKey
        const responseSummonerRank = await fetch(cors + SummonerRank)
        if (responseSummonerRank.status !== 200) {
            this.setState({
                status: responseSummonerRank.status
            })
            return
        }
        const jsonSummonerRank = await responseSummonerRank.json()
        // console.log(jsonSummonerRank);
        this.setState({
            flexRank: jsonSummonerRank[0],
            soloRank: jsonSummonerRank[1],
        })






        this.setState({
            isLodaing: false
        })

    }

    render() {
        return (
            <div>
                {this.state.isLodaing ? <Loading status={this.state.status} />
                    :
                    <div>
                        <div id="topBannerBasicInfo">
                            <div id="summIcon">
                                <img src={'/assets/images/profileicon/' + this.state.basicInfoSummoner.profileIconId + '.png'}
                                    alt={"Summoner icon"} />
                                <div>
                                    {this.state.basicInfoSummoner.summonerLevel}
                                </div>
                            </div>
                            <div id="summNick">
                                <div>
                                    {this.state.basicInfoSummoner.name}
                                </div>
                                <div>
                                    <Button id="LiveGame" type="submit" variant="outlined" color="primary">
                                        Live game
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div id="allOderInfo">
                            <div id="leftContainer">
                                <div className="rankSummoner">
                                    <div>
                                        <img src={'/assets/images/rank-icons/' + this.state.soloRank.tier + '.png'}
                                            alt={this.state.soloRank.tier} />
                                    </div>
                                    <div className="soloQandFlexStats">
                                        <span>SoloQ rank</span>
                                        <span>{this.state.soloRank.tier} {this.state.soloRank.rank}</span>
                                        <span>{this.state.soloRank.leaguePoints} lp</span>
                                        <span>{this.state.soloRank.wins} W {this.state.soloRank.losses} L</span>
                                        <span>Wina ratio {Math.round(100 * (this.state.soloRank.wins / (this.state.soloRank.losses + this.state.soloRank.wins)))}%</span>
                                    </div>
                                </div>
                                <div className="rankSummoner">
                                    <div>
                                        <img src={'/assets/images/rank-icons/' + this.state.flexRank.tier + '.png'}
                                            alt={this.state.soloRank.tier} />
                                    </div>
                                    <div className="soloQandFlexStats">
                                        <span>Flex 5 vs 5 rank</span>
                                        <span>{this.state.flexRank.tier} {this.state.flexRank.rank}</span>
                                        <span>{this.state.soloRank.leaguePoints} LP</span>
                                        <span>{this.state.flexRank.wins}W {this.state.flexRank.losses}L</span>
                                        <span>Wina ratio {Math.round(100 * (this.state.flexRank.wins / (this.state.flexRank.losses + this.state.flexRank.wins)))}%</span>
                                    </div>
                                </div>
                                <div id="championsStats">
                                    <ChampionsStatistic basicInfoSummoner={this.state.basicInfoSummoner} />
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

const Loading = ({ status }) => {
    console.log(status);
    if (status === false) {
        return <div align="center"><CircularProgress /></div>
    }
    if (status === 404) {
        console.log("ell");
        return <div>User not found</div>
    }
    else {
        return <div>Ups... something went wrong</div>
    }

}

// let loading = <div align="center"><CircularProgress /></div>



export default SearchUserInputContent;

