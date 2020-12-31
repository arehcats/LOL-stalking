import React from 'react';
import SummonerInfoContent from './SummonerInfoContent'

function SummonerInfo({ match }) {
    return (
        <div>
            <SummonerInfoContent match={match} />
        </div>
    );
}


export default SummonerInfo;
