import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import "../../css/LoginRegister.css"
import user from './user.png'
import lock from './lock.png'
import key from './key.png'
import facebook_icon from './facebook_icon.png'


const SignUpPage = () => (
  <div>
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
      .then(() => {
        this.props.firebase.usersSummonersRef(this.props.firebase.currentUser()).update({
          0: 0
        })
      })
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
      <form className="formBox" onSubmit={this.onSubmit}>
        <div className="inputFormDiv">
          <input className="inputForm" label="Adress e-mail" variant="outlined"
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
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
          <img src={lock} alt="Lock icon" />
        </div>
        <div className="inputFormDiv">
          <input className="inputForm" label="Confirm password" variant="outlined"
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm password"
          />
          <img src={key} alt="Key icon" />
        </div>
        <div className="submitButton">
          <button disabled={isInvalid} type="submit">
            Sign Up
           </button>
        </div>
        {error ? <div className="errorLoginRegister">{error.message}</div> : <div className="errorLoginRegister"></div>}
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