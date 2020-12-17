import LoginRegister from '../LoginRegister/LoginRegister';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter
} from "react-router-dom";
import React from 'react';
import { withAuthentication } from '../Session/';

const App = () => (
  <Router>
    {/* <Header /> */}
    <ScrollToTop />
    <Switch>
      <Route exact strict path="/" component={LoginRegister} />
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
