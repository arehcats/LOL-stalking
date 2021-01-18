import React from 'react';
import '../../css/gameHistory.css'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux';
import { compose } from 'recompose';


class GameHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    };

    async componentDidMount() {
        console.log(this.props.last100games[0]);
    }



    render() {
        let champions = this.props.championsIDs
        return (
            <div>
                {this.props.last100games.map((val, i) => {
                    if (i>5) return
                    return <div className = "gameHistory" key={i}>
                        {champions[val.champion]}
                    </div>
                })}
            </div>
        );
    }
}


const mapStateToProps = state => ({
    last100games: state.summonerInfoState.last100games,
    championsIDs: state.someDataGame.championsIDs,
    gamesIDs: state.someDataGame.gamesIDs,
});

export default compose(
    // withFirebase,
    connect(mapStateToProps),
)(GameHistory);
