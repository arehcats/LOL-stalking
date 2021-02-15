import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter
} from "react-router-dom";
import LoginRegister from '../LoginRegister/LoginRegister';
import React from 'react';
import { withAuthentication } from '../Session/';
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import '../../css/App.css'
import SearchUserInput from '../SearchUserInput'
import SummonerInfo from '../SummonerInfo'
import ChooseSummoner from '../ChooseSummoner/ChooseSummoner'
import Walentynka from './Walentynka'

const App = () => (
  <Router>
    <Header />
    <ChooseSummoner />
    <ScrollToTop />
    <Switch>
      <Route exact strict path="/" component={SearchUserInput} />
      <Route exact strict path="/login" component={LoginRegister} />
      <Route exact strict path="/WalentynkaDlaDominiki" component={Walentynka} />
      <Route exact strict path="/eune/:SummonerName" component={(props) => <SummonerInfo {...props} key={window.location.pathname}/>}/>
      <Redirect to="/" />
    </Switch>
    <Footer />
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
