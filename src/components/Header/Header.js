import React from 'react';
import '../../css/Header.css'
import '../../css/App.css'
import SignOutButton from '../SignOut/SignOut'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose';
import { NavLink } from "react-router-dom";

const Header = ({ authUser }) =>
    authUser ? (
        <NavigationAuth />
    ) : (
            <NavigationNonAuth />
        );

const NavigationAuth = () => {
    return (
        <div className='header ClassHeaderFooter' >
            Header
            <SignOutButton />
        </div>
    )
}
const NavigationNonAuth = () => {

    return (
        <div className='header ClassHeaderFooter' >
            <NavLink to="/login" style={{ textDecoration: 'none' }}>
                Login
            </NavLink>

        </div>
    )
}

const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
});

export default compose(
    withRouter,
    connect(mapStateToProps),
)(Header);