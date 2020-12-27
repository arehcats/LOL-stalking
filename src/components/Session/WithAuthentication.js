import React from 'react';
import { withFirebase } from '../Firebase';
import { connect } from 'react-redux';
import { compose } from 'recompose';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    // constructor(props) {
    //     super(props);
    //     // this.props.onSetAuthUser(
    //     //   JSON.parse(localStorage.getItem('authUser')),
    //     // ); idk what is that for
    //   }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          // localStorage.setItem('authUser', JSON.stringify(authUser));
          console.log(this.props);
          console.log(this.props.onSetAuthUser);
          this.props.onSetAuthUser(authUser);
          console.log("!");
        },
        () => {
          console.log("222222222222222222222222222222222222222");
          localStorage.removeItem('authUser');
          this.props.onSetAuthUser(null);
          console.log("222222222222222222222222222222222222222");

        },
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  const mapDispatchToProps = dispatch => ({
    onSetAuthUser: authUser =>
      dispatch({ type: 'AUTH_USER_SET', authUser }),
  });

  return compose(
    withFirebase,
    connect(
      null,
      mapDispatchToProps,
    ),
  )(WithAuthentication);
};

export default withAuthentication;