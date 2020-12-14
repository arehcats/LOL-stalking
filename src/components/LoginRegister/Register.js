import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const SignUpPage = () => (
  <div>
    <span id="widht_h1">
      <h1>Rejestracja</h1>
    </span>
    <SignUpForm />
  </div>
);
const INITIAL_STATE = {
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};
class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };

  }

  onSubmit = event => {
    const { email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid = passwordOne !== passwordTwo ||
      passwordOne === '' || email === '';
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
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Hasło"
          />
        </div>
        <div id="confrimWidth">
          <TextField className="outlined-basic" label="Potwierdź hasło" variant="outlined"
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Potwierdź hasło"
          />
        </div>
        <div className="blueBacground">
          <Button disabled={isInvalid} type="submit" variant="outlined" color="primary">
            Zarejestruj się!
           </Button>
        </div>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}



const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);


export default SignUpPage;

export { SignUpForm };