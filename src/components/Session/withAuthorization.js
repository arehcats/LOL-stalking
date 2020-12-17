import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import AuthUserContext from './context';
import CircularProgress from '@material-ui/core/CircularProgress';

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        // componentDidMount() {
        //     this.listener = this.props.firebase.auth.onAuthStateChanged(
        //         authUser => {
        //             if (!condition(authUser)) {
        //                 if (this.props.history.location.pathname === "/") {
        //                     this.props.history.push('/MojeSlowka');
        //                 }
        //                 else {
        //                     this.props.history.push('/');
        //                 }
        //             }
        //         },
        //     );
        // }
        componentWillUnmount() {
            this.listener();
        }
        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser =>
                        condition(authUser) 
                        ? <Component {...this.props} /> 
                        : <div id="beforeRender"><CircularProgress /></div>
                    }
                </AuthUserContext.Consumer>
                );
        }
    }

    return compose(
        withRouter,
        withFirebase,
    )(WithAuthorization);
};

export default withAuthorization;