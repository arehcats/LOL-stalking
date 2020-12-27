import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


const SignInPage = () => (
  <div>
    <span id="widht_h1">
      <h1>Logowanie</h1>
    </span>
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
      <form className="form" onSubmit={this.onSubmit}>
        <div id="emailWidth">
          <TextField className="outlined-basic" label="Adres e-mail" variant="outlined"
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Adres e-mail"
          />
        </div>
        <div id="passwordWidth">
          <TextField className="outlined-basic" label="Hasło" variant="outlined"
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Hasło"
          />
        </div>
        <div className="blueBacground">
          <Button disabled={isInvalid} type="submit" variant="outlined" color="primary">
            Zaloguj się!
           </Button>
        </div>
        {error && <div className="errorLoginRegister">{error.message}</div>}
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
  async componentDidMount() {
    console.log("dd");
    const cors = "https://cors-anywhere.herokuapp.com/"
    const url = "https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/0TsBN6urzvch-gPGzsP25Nk-IIQ9b06lLtUVH7d4FuCJGKY?api_key=RGAPI-b35d1385-4639-4b53-8642-37f57399a24f"
    const response = await fetch(cors + url)
    console.log(response)
    const json = await response.json()
    console.log(json)
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
      <form onSubmit={this.onSubmit}>
        <button type="submit">Sign In with Facebook</button>

        {error && <p>{error.message}</p>}
      </form>
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


