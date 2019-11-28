import React, {createContext, Component} from 'react';

export const ThemeContext = createContext();
class ThemeContextProvider extends Component {
  state = { 
    board: [],
  }

  updateLeaderboard = () => {
    this.setState({
      board: [...this.state.board, JSON.parse(localStorage.leaderboard)],
    });
  };

  render() { 
    return (
      <ThemeContext.Provider value={{...this.state, updateLeaderboard: this.updateLeaderboard}}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  };
};

export default ThemeContextProvider;