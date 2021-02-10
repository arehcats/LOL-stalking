import React from 'react';
import LoginRegisterBox from './LoginRegisterBox.js'
import { withAuthorization } from '../Session';


function LoginRegister() {
    return (
        <div>
            <LoginRegisterBox />
        </div>
    );
}

const condition = authUser => !authUser;
 
export default withAuthorization(condition)(LoginRegister);
