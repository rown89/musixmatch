import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./components/login/Login";
import Play from "./components/play/Play";
import Leaderboard from "./components/leaderboard/Leaderboard";
import "./App.scss";
import logo from "./assets/logo.png";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Link className="btn" to={"/leaderboard"}>
              Leaderboard
            </Link>
          </header>
        </div>
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/play" component={Play} exact />
          <Route path="/leaderboard" component={Leaderboard} exact />
        </Switch>
      </Router>
    );
  }
}

export default App;
