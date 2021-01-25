import React from 'react';
import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <div className="logInOut" onClick={firebase.doSignOut}>
    <strong>Wyloguj</strong>
  </div>
);

export default withFirebase(SignOutButton);