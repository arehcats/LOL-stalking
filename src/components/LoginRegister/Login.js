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

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };


