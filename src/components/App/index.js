import LoginRegister from '../LoginRegister/LoginRegister';
import Content from '../Content/index';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter
} from "react-router-dom";
import React from 'react';
import { withAuthentication } from '../Session/';
import SignOutButton from '../SignOut/SignOut';

const App = () => (
  <Router>
    {/* <Header /> */}
    <SignOutButton />
    <ScrollToTop />
    <Switch>
      <Route exact strict path="/" component={Content} />
      <Route exact strict path="/login" component={LoginRegister} />
      <Redirect to="/" />
    </Switch>
    {/* <Footer /> */}
  </Router>
)

class ScrollToTopRoute extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return <React.Fragment />
  }
}

const ScrollToTop = withRouter(ScrollToTopRoute)

export default withAuthentication(App);
