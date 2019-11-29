import React, {createContext, Component} from 'react';

export const BoardContext = createContext();
class BoardContextProvider extends Component {
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
      <BoardContext.Provider value={{...this.state, updateLeaderboard: this.updateLeaderboard}}>
        {this.props.children}
      </BoardContext.Provider>
    );
  };
};

export default BoardContextProvider;