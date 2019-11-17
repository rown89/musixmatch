import React, { Component } from 'react';
import { ThemeContext } from './leaderboardContext';
import '../components/play/play.scss';

class UpdateLeaderboard extends Component {
  static contextType = ThemeContext;
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    const { updateLeaderboard } = this.context;
    return (
      <button style={{cursor: 'pointer', padding: 14, margin: 14, borderRadius: 5, border: 'none'}} 
      onClick={updateLeaderboard}>Save Score to Leadearboard and Profile</button>
    );
  }
}
 
export default UpdateLeaderboard;