import React from 'react';
import { withAuthorization } from '../Session';


function Content() {
    return (
        <div>
            CONTENTCONTENTCONTENT
            CONTENTCONTENTCONTENT
        </div>
    );
}

const condition = authUser => authUser != null;
 
export default withAuthorization(condition)(Content);
