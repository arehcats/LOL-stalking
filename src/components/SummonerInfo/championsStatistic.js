import React from 'react';
import '../../css/SummonerInfo.css'
import CircularProgress from '@material-ui/core/CircularProgress';



class ChampionsStatistic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SummonerName: "aaaa",
            isLodaing: true,

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
                        jkhjhk
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



export default ChampionsStatistic;

