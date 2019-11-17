import React, {createContext, Component} from 'react';

export const ThemeContext = createContext();

class ThemeContextProvider extends Component {
  state = { 
    isLightTheme: [],
  }

  updateLeaderboard = () => {
    this.setState({isLightTheme: [...this.state.isLightTheme, JSON.parse(localStorage.getItem('leaderboard'))]});
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