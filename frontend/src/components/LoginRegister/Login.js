import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import "../../css/LoginRegister.css"
import user from './user.png'
import lock from './lock.png'
import facebook_icon from './facebook_icon.png'


const SignInPage = () => (
  <div>
    <SignInForm />
    <SignInFacebook />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';
    return (
      <form className="formBox" onSubmit={this.onSubmit}>
        <div className="inputFormDiv">
          <input className="inputForm" label="Adress e-mail"
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Adress e-mail"
          />
          <img src={user} alt="User icon" />
        </div>
        <div className="inputFormDiv">
          <input className="inputForm" label="Password" variant="outlined"
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
          <img src={lock} alt="Lock icon" />
        </div>
        <div className="submitButton">
          <button disabled={isInvalid} type="submit">
            Sign In
           </button>
        </div>
        {error ? <div className="errorLoginRegister">{error.message}</div> : <div className="errorLoginRegister"></div>}
      </form>
    );
  }
}

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;
class SignInFacebookBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: [],
        });
      })
      .then(() => {
        this.setState({ error: null });
        // this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;

    return (
      <div>
        <div className = "flexDisplay">
          <div className="withFacebookContainer" >
            <img src={facebook_icon} alt="Facebook icon" />
            <div onClick={this.onSubmit} className="withFacebook">Sign In with Facebook</div>
          </div>
          <div className="ForgotPassword">
            Forgot password?
          </div>
        </div>
        {error && <div className="errorLoginRegister">{error.message}</div>}
      </div>
    );
  }
}


const SignInFacebook = compose(
  withRouter,
  withFirebase,
)(SignInFacebookBase);

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm, SignInFacebook };


