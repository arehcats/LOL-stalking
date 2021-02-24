import React from 'react';
import '../../css/Header.css'
import '../../css/App.css'
// import SignOutButton from '../SignOut/SignOut'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose';
import { NavLink } from "react-router-dom";
import { withFirebase } from '../Firebase';

const Header = ({ authUser, firebase, ...props }) => {
    // console.log(props.location.pathname === '/eune/');
    // console.log(props);
    // var str = "Hello world, welcome to the universe.";
    // var n = str.startsWith("Hello");
    return (
        <div className='header ClassHeaderFooter'>
            <div id="leftNavbar">
                <NavLink className={props.location.pathname !== '/login' ? "navigateSelected navigate" : "navigate"} to="/">
                    <span>
                        Summoners
                    </span>
                </NavLink>
                <NavLink className={props.location.pathname === '/login' ? "navigateSelected navigate" : "navigate"} to="/login">
                    <span>
                        TO DO
                    </span>
                </NavLink>
                {/* <NavLink className={props.location.pathname === '/eune/arehcats' ? "navigateSelected navigate" : "navigate"} to="/login">
                    <span>
                        To do 2
                    </span>
                </NavLink> */}
            </div>
            <div id="rightNavbar">
                {authUser ?
                    <React.Fragment>
                        <div>
                            {authUser.email}
                        </div>
                        <div className="logInOut" onClick={firebase.doSignOut}>
                            <strong>Wyloguj</strong>
                        </div>
                    </React.Fragment>
                    :
                    <div >
                        <NavLink className="logInOut" to="/login" style={{ textDecoration: 'none' }}>
                            <strong>
                                Login
                            </strong>
                        </NavLink>
                    </div>
                }
            </div>
        </div>


    )
}


// const NavigationAuth = (authUser) => {
//     return (
//         <div  >
//             <div>
//                 {authUser.authUser.email}
//             </div>
//             <div>
//                 <SignOutButton />
//             </div>
//         </div>
//     )
// }
// const NavigationNonAuth = () => {

//     return (
//         <div>
//             <NavLink to="/login" style={{ textDecoration: 'none' }}>
//                 Login
//             </NavLink>

//         </div>
//     )
// }

const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
});

export default compose(
    withRouter,
    withFirebase,
    connect(mapStateToProps),
)(Header);