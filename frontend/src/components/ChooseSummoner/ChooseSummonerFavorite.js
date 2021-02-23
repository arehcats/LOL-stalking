import React, { Component } from 'react';
import Button from '@material-ui/core/Button'
import '../../css/ChooseSummoner.css'
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import Delete from '../../media/delete_plus/delete.svg';

class ChooseSummonerAuth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setClass: ["selectedSummoner", "summoner"],
            loading: true,
        }
    }

    componentDidMount() {
        this.props.firebase
            .usersSummonersRef(this.props.firebase.currentUser()).on('value', snapshot => {
                const summonerObject = snapshot.val();
                if (!summonerObject) return this.setState({ loading: false });

                let arrayOfSummoners = []

                Object.keys(summonerObject).map(key => {
                    return arrayOfSummoners.push(key)
                });

                this.props.setFavoriteSummoners(arrayOfSummoners)

                if (arrayOfSummoners.includes(this.props.summoners[0])) {
                    this.props.deleteSummoner(this.props.summoners[0])
                }

                this.setState({
                    isLodaing: false,
                })

            })
    }

    deleteSummoner = (value) => {


        this.props.firebase.usersSummonersRef(this.props.firebase.currentUser()).child(value).remove()
            .catch(error => {
                alert(error);
            })
    }

    render() {
        return (
            <div className='chooseSummoner' >
                <div className="FavHistoryTitle" >
                    Favorite:
                </div>
                {this.state.isLodaing ? <div align="center"><CircularProgress /></div>
                    :
                    this.props.favoriteSummoners.map((value, i) => {
                        if (value === "0") return []
                        return (
                            <React.Fragment key={i}>
                                <NavLink activeClassName="selectedSummoner" className="summoner" to={"/eune/" + value} style={{ textDecoration: 'none' }}>
                                    <div className={this.state.setClass[1]}>
                                        <Button type="submit" variant="outlined" color="primary">
                                            {value}
                                        </Button>
                                    </div>
                                </NavLink>
                                <img className="plusIcon" src={Delete} alt={"Summoner icon"}
                                    onClick={() => {
                                        this.deleteSummoner(value)
                                    }}
                                />
                            </React.Fragment>
                        )
                    })
                }
                <div className={"bottomLine"}>

                </div>
            </div>
        );
    }

}

const mapStateToProps = state => ({
    summoners: state.summoners.summoners,
    favoriteSummoners: state.summoners.favoriteSummoners
})
const mapDispatchToProps = dispatch => ({
    deleteSummoner: newSummoner =>
        dispatch({ type: 'DELETE_SUMMONER_SET', newSummoner }),
    setFavoriteSummoners: favoriteSummoners =>
        dispatch({ type: 'UPDATE_FAVORITE_SUMMONETS', favoriteSummoners }),
});

export default compose(
    withFirebase,
    connect(mapStateToProps,
        mapDispatchToProps
    ),
)(ChooseSummonerAuth)