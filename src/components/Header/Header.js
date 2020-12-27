import React from 'react';
import '../../css/Header.css'
import '../../css/App.css'

import SignOutButton from '../SignOut/SignOut'

function Header() {
    return (
        <div id='header' className="ClassHeaderFooter">
            Header
            <SignOutButton />
        </div>
    );
}

export default Header;
