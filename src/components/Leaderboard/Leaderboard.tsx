import React, { Component } from 'react';
import { ThemeContext } from '../../contexts/leaderboardContext';

export default class Leaderboard extends Component {
  constructor(props: any){
    super(props);
    this.state = {
    };
  };
  
  render() {
    return (
      <ThemeContext.Consumer>{(context: any) => {
        const {isLightTheme} = context;
        console.log(isLightTheme);
        return(
          <div className="Leaderboard">
            <div>
              { Math.max(...isLightTheme.map((score: any, id: number) => {
                return(
                  <div key={id}>
                    Nickname: {score.nick} score: {score.score}
                  </div>
                )
              },0))}
            </div>
          </div>
        )
      }}</ThemeContext.Consumer>
    );
  };
};