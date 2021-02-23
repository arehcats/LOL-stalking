import React, { Component } from 'react';
import Button from '@material-ui/core/Button'
import '../../css/ChooseSummoner.css'
import { NavLink, Link } from "react-router-dom";
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import Add from '../../media/delete_plus/add.svg';

class ChooseSummonerHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setClass: ["selectedSummoner", "summoner"]
        }
    }
    addSummoner = (value) => {
        this.props.firebase.usersSummonersRef(this.props.firebase.currentUser()).update({
            [value]: value
        })
        .then(()=>{
            this.props.applyDeleteSummonerFromHistory(value)
        })

    }

    render() {
        return (
            <div className='chooseSummoner' >
                <div className="FavHistoryTitle" 
                onClick={()=>{
                    console.log(this.props.summoners);
                }}
                >
                    History:
                </div>
                <div className="clearHistory">
                    <Button type="submit" variant="outlined" color="primary"
                        onClick={() => {
                            this.props.applyClearHistory("")
                        }}
                    >
                        Clear
                    </Button>
                </div>
                <NavLink className="newSummoner" to="/" style={{ textDecoration: 'none' }}>
                    <div className={this.state.setClass[1]}>
                        <Button type="submit" variant="outlined" color="primary">
                            New summoner
                        </Button>
                    </div>
                </NavLink>
                {(Array.isArray(this.props.summoners) && this.props.summoners.length) ? this.props.summoners.map((value, i) => {
                    return (
                        <React.Fragment key={i}>
                            <NavLink activeClassName="selectedSummoner" className="summoner" to={"/eune/" + value} style={{ textDecoration: 'none' }}>
                                <div className={this.state.setClass[1]}>
                                    <Button type="submit" variant="outlined" color="primary">
                                        {value}
                                    </Button>
                                </div>
                            </NavLink>
                            {this.props.authUser ?
                                !this.props.favoriteSummoners.includes(value) ? <img className="plusIcon" src={Add} alt={"Summoner icon"}
                                    onClick={() => {
                                        this.addSummoner(value)
                                    }}
                                />
                                    :
                                    false
                                :
                                <Link onClick={() => {
                                    this.props.applyUnloggedErrorr(true)
                                }}
                                    title="Add to farvorite" className="linkToLoginPage" to={"/login"}>
                                    <img src={Add} alt={"Summoner icon"} />
                                </Link>

                            }

                        </React.Fragment>
                    )
                })
                    :
                    <div>

                    </div>
                }
                <div className={"bottomLine"}>

                </div>
            </div>
        );
    }

}

const mapStateToProps = state => ({
    summoners: state.summoners.summoners,
    favoriteSummoners: state.summoners.favoriteSummoners,
    authUser: state.sessionState.authUser,

})
const mapDispatchToProps = dispatch => ({
    applyDeleteSummonerFromHistory: newSummoner =>
        dispatch({ type: 'DELETE_SUMMONER_SET', newSummoner }),
    applyClearHistory: () =>
        dispatch({ type: 'CLEAR_HISTORY' }),
    applyUnloggedErrorr: unloggedError =>
        dispatch({ type: 'UNLOGGED_ERROR_SET', unloggedError }),
});

export default compose(
    withFirebase,
    connect(mapStateToProps,
        mapDispatchToProps
    ),
)(ChooseSummonerHistory)