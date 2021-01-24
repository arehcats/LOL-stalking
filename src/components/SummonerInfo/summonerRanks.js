import React from 'react';
import { connect } from 'react-redux';

const SummonerRanks = (props) => {
    return <React.Fragment>
        {props.soloRank ?
            <div className="rankSummoner">
                <div>
                    <img src={'/assets/images/rank-icons/' + props.soloRank.tier + '.png'}
                        alt={props.soloRank.tier} />
                </div>
                <div className="soloQandFlexStats">
                    <span>SoloQ rank</span>
                    <span>{props.soloRank.tier} {props.soloRank.rank}</span>
                    <span>{props.soloRank.leaguePoints} lp</span>
                    <span>{props.soloRank.wins}W / {props.soloRank.losses}L</span>
                    <span>Win ratio <b>{Math.round(100 * (props.soloRank.wins / (props.soloRank.losses + props.soloRank.wins)))}%</b></span>
                </div>
            </div>

            :
            <div className="unranked">
                <span>SoloQ</span>
                <img src={'/assets/images/rank-icons/provisional.png'}
                    alt="provisional" />
                <b>Unranked</b>
            </div>
        }

        {props.flexRank ?
            <div className="rankSummoner">
                <div>
                    <img src={'/assets/images/rank-icons/' + props.flexRank.tier + '.png'}
                        alt={props.flexRank.tier} />
                </div>
                <div className="soloQandFlexStats">
                    <span>Flex 5 vs 5 rank</span>
                    <span>{props.flexRank.tier} {props.flexRank.rank}</span>
                    <span>{props.flexRank.leaguePoints} LP</span>
                    <span>{props.flexRank.wins}W / {props.flexRank.losses}L</span>
                    <span>Win ratio <b>{Math.round(100 * (props.flexRank.wins / (props.flexRank.losses + props.flexRank.wins)))}%</b></span>
                </div>
            </div>
            :
            <div className="unranked">
                <span>Flex</span>
                <img src={'/assets/images/rank-icons/provisional.png'}
                    alt="provisional" />
                <b>Unranked</b>
            </div>
        }
    </React.Fragment>
}

const mapStateToProps = state => ({
    flexRank: state.summonerInfoState.flexRank,
    soloRank: state.summonerInfoState.soloRank,
});

export default connect(mapStateToProps)(SummonerRanks);