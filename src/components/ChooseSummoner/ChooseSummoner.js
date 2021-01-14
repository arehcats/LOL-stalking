import React from 'react';
import '../../css/ChooseSummoner.css'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose';
import ChooseSummonerAuth from './ChooseSummonerAuth'
import ChooseSummonerNonAuth from './ChooseSummonerNonAuth'

const ChooseSummoner = ({ authUser }) => {
    return (
        <React.Fragment>
            { authUser ? <ChooseSummonerAuth /> : <div></div>}
            <ChooseSummonerNonAuth />
        </React.Fragment>

    )
}


const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
});

export default compose(
    withRouter,
    connect(mapStateToProps),
)(ChooseSummoner);