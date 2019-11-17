import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from './components/login/Login';
import Play from './components/play/Play';
import Leaderboard from './components/Leaderboard/Leaderboard';
import './App.scss';
import logo from './assets/logo.png';

class App extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  };

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <div>
              <Link to={'/leaderboard'}>Leaderboard</Link>
            </div>
          </header>
        </div>
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/play" component={Play} exact/>
          <Route path="/leaderboard" component={Leaderboard} exact />
        </Switch>
      </Router>
    );
  };
};

export default App;