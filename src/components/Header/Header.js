import React from 'react';
import '../../css/Header.css'
import '../../css/App.css'
import SignOutButton from '../SignOut/SignOut'
import { connect } from 'react-redux';

function Header() {
    return (
        <div id='header' className="ClassHeaderFooter">
            Header
            <SignOutButton />
        </div>
    );
}

export default Header;
