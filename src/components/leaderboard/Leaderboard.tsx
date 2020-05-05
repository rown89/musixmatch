import React, { Component } from 'react';
import ReactTable from 'react-table'
import { RouteComponentProps, withRouter } from "react-router-dom";
import { BoardContext } from '../../contexts/leaderboardContext';
import './leaderboard.scss';
import 'react-table/react-table.css';

interface MyState {};

interface MyProps extends Partial<RouteComponentProps> {
  history?: any,
};

@(withRouter as any)
export default class Leaderboard extends Component<MyProps, MyState>  {
  constructor(props: any) {
    super(props);
    this.state = {
    }
  }

  backBtn = () => {
    this.props.history.push('/');
  }

  render() {
    return (
      <BoardContext.Consumer>
        {(context: any) => {
          const { board } = context;
          const columns = [{
            Header: 'Name',
            accessor: 'nick' // String-based value accessors!
          }, {
            Header: 'Score',
            accessor: 'score'
          }]
          return (
            <div className="Leaderboard">
              <button className="backBtn" 
              onClick={() => this.backBtn()}>{'< Back'}</button>
              
              <div>
                <ReactTable 
                  columns={columns} 
                  data={board}
                  defaultSorted={[
                    {
                      id: "score",
                      desc: true
                    }
                  ]}
                />
              </div>
            </div>
          );
        }}
      </BoardContext.Consumer>
    );
  };
}; 