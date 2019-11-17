import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import './login.scss';

interface MyState extends Partial<RouteComponentProps> {
  placeholder: string, nickname: string,
};

interface MyProps extends Partial<RouteComponentProps> {
  history: any
};

@(withRouter as any)
export default class Login extends Component<MyProps, MyState > {
  constructor(props:any) {
    super(props);
    this.state = {
      placeholder: 'Enter a Nickname',
      nickname: '',
    };

    this.HandleNickChange = this.HandleNickChange.bind(this);
    this.handleNickSubmit = this.handleNickSubmit.bind(this);
  };

  componentDidMount(){
    if (localStorage.nickname) this.props.history.push("/play");
  }

  HandleNickChange(event: any) {
    this.setState({ nickname: event.target.value });
  };

  handleNickSubmit(event: any) {
    if (this.state.nickname.length > 2) {
      localStorage.setItem('nickname', this.state.nickname);
      localStorage.setItem("score", '0');
      localStorage.setItem("gameCounter", '1');
      this.props.history.push("/play");
    }
    event.preventDefault()
  }

  render() {
    const { nickname, placeholder } = this.state;
    return (
      <main>
        <form onSubmit={this.handleNickSubmit}>
          <input type="text" placeholder={placeholder} onChange={this.HandleNickChange} />
          {nickname.length < 3 ?
            <div className="nickError">Nickname must have at least 3 characters</div> :
            <>
              <div className="nickFine">Good Pick!</div>
              <button type="submit">START GAME</button>
            </>}
        </form>
      </main>
    );
  };
};