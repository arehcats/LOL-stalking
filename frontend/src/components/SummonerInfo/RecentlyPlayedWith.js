import React from 'react';
import '../../css/SummonerInfo.css'
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { compose } from 'recompose';


class RecentlyPlayedWith extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    };
    componentDidMount() {
        console.log(this.props.recentlyPlayedWith);
    }

    render() {
        return (
            <div>
                {this.props.recentlyPlayedWith[0] ? <div align="center"><CircularProgress /></div>
                    :
                    <div>
                        <div className="RecentlyPlayedWith">
                            Recently played with
                        </div>
                        {this.props.recentlyPlayedWith[1].length !== 0 ?
                            <table className="tableRoot">
                                <thead className="tableRecentlyHead">
                                    <tr>
                                        <th>Player</th>
                                        <th>Played together</th>
                                        <th>Ally</th>
                                        <th className="lastColumn">Enemy</th>
                                    </tr>
                                </thead>
                                <tbody className="tableRecentlyBody">

                                    {this.props.recentlyPlayedWith[1].map((summoner, summonerindex) => {
                                        if (summoner[1][0] <= 1) return []

                                        return <tr key={summonerindex}>
                                            <td>{summoner[0]}</td>
                                            <td>{summoner[1][0]}</td>
                                            <td>{summoner[1][1]}</td>
                                            <td className="lastColumn">{summoner[1][2]}</td>
                                        </tr>
                                    })}
                                </tbody>

                            </table>
                            :
                            <div className="recentlyNone">
                                You wasn't played with any player more than 1 time
                            </div>
                        }
                    </div>


                }

            </div>
        );
    }
}



const mapStateToProps = state => ({
    recentlyPlayedWith: state.otherState.recentlyPlayedWith,
});

export default compose(
    // withFirebase,
    connect(mapStateToProps),
)(RecentlyPlayedWith);
