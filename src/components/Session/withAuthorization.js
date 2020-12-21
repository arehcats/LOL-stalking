import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    if (!condition(authUser)) {
                        console.log("unloged");
                        // this.props.history.push('/login');

                        if (this.props.history.location.pathname === "/login") {
                             this.props.history.push('/');
                            console.log("1");
                        }
                        else {
                            console.log("2");
                            this.props.history.push('/login');
                        }
                    }
                },
            );
        }
        componentWillUnmount() {
            this.listener();
        }
        render() {
                return condition(this.props.authUser) ? (
                    <Component {...this.props} />
                  ) : <div id="beforeRender"><CircularProgress /></div>;
        }
    }

    const mapStateToProps = state => ({
        authUser: state.sessionState.authUser,
      });

    return compose(
        withRouter,
        withFirebase,
        connect(mapStateToProps),
    )(WithAuthorization);
};

export default withAuthorization;