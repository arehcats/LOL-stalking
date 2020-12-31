import React from 'react';
import '../../css/SearchUserInput.css'
import CircularProgress from '@material-ui/core/CircularProgress';


class SearchUserInputContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SummonerName: this.props.match.params.SummonerName,
            isLodaing: true,
            status: false,
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

        // fetch data by summuner puuid
        const SummonerByPuuid = "https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/ICBh4vDzTpCsul7tb12tCuXOQhI5kSSvn7sM8Vn684wo1GgaMsU-kVIA0fohlzhz3Bdyo4hECApo4A?api_key=RGAPI-00836aab-fa09-48e2-8182-b17e5d36b3e2"

        const responseSummonerByPuuid = await fetch(cors + SummonerByPuuid)

        if (responseSummonerByPuuid.status !== 200) {
            this.setState({
                status: responseSummonerByPuuid.status
            })
            return
        }
        const jsonSummonerByPuuid = await responseSummonerByPuuid.json()
        console.log(jsonSummonerByPuuid);





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
                        <div>
                            last ranks
                        </div>
                        <div>
                            ikona lvl i znajdz aktywne gry, odnów dane, nick, ranking serwerowy
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

