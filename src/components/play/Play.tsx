import React, { Component } from 'react';
import axios from "axios";
import api from './config';
import Cards from '../cards/Cards';
import { RouteComponentProps, withRouter } from "react-router-dom";
import Modal from 'react-modal';
import UpdateLeaderboard from '../../contexts/updateLeaderboardContext';
import './play.scss';import { ThemeContext } from '../../contexts/leaderboardContext';

const customStyles = {
  content: {
    top: '50%', left: '50%',
    right: 'auto', bottom: 'auto',
    marginRight: '-50%', padding: 50,
    transform: 'translate(-50%, -50%)'
  }
};

interface MyState extends Partial<RouteComponentProps> {
  loading: boolean, score: any, rounds: number, actualRound: number, 
  randomElements: Array<String>, lyric: Array<String>, lyric2: any, 
  pickedName: String, pickedTrack: any, profileModalIsOpen: boolean,
};

interface MyProps extends Partial<RouteComponentProps> {
  history?: any,
};

@(withRouter as any)
export default class Play extends Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true, score: 0, rounds: 10, actualRound: 0, randomElements: [],
      lyric: [], lyric2: [], pickedName: '', pickedTrack: null, profileModalIsOpen: false,
    };

    this.pickedArtist = this.pickedArtist.bind(this);
    this.callbackFromParent = this.callbackFromParent.bind(this);
    this.endGame = this.endGame.bind(this);
    this.logout = this.logout.bind(this);
    this.closeModal = this.closeModal.bind(this);
  };

  componentDidMount() {
    this.getPopularSong();
    Modal.setAppElement('body');
  };

  //Get most popular songs with lyrics.
  getPopularSong = () => {
    axios.get(api.url + api.popular + api.key)
      .then(response => {
        localStorage.setItem('topSongsArr', JSON.stringify(response));
        this.setState({ loading: false });
        this.nextStep();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  nextStep = () => {
    const shuffleArray = (arr: any) => arr
      .map((a: any) => [Math.random(), a])
      .sort((a: any, b: any) => a[0] - b[0])
      .map((a: any) => a[1]);

    //Top Songs Array from axios response.
    let originalData = JSON.parse(localStorage.topSongsArr).data.message.body.track_list;
    //Shuffle originalData Array.
    let shuffledTracks = shuffleArray(originalData);
    //Get 3 random array from originalData.
    let tracksArr = shuffledTracks.sort(() => Math.random() - Math.random()).slice(0, 3)
    //Get one item lyric from the tracksArr.
    let lyric = tracksArr[Math.floor(Math.random() * tracksArr.length)];

    this.setState({ randomElements: tracksArr, lyric2: lyric });
    this.printLyric(lyric.track.track_id);
  };

  printLyric = (lyricId: string) => {
    axios.get(api.url + api.lyrics + lyricId + api.key)
      .then((response: any) => {
        this.setState({
          lyric: response.data.message.body.lyrics.lyrics_body.split('*******')[0],
        });
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  //Receive update props from Card
  callbackFromParent(name: string, track_id: number) {
    this.setState({ pickedName: name, pickedTrack: track_id });
  };

  //Check if artist name picked from card child is the same of lyric.
  pickedArtist(name: string, track_id: number) {
    this.callbackFromParent(name, track_id);
    if (this.state.lyric2.track.track_id === track_id) {
      this.setState({score:  this.state.score + 1});
      this.nextStep();
    } else this.nextStep();
  };

  startGame = () => {
    const rounds = this.state;
    return (
      <>
        <div className="lyric-text">
          "{this.state.lyric}"
        </div>
        <div className="cards-container">
          {this.state.randomElements.map((item: any, i) =>
            <Cards key={i} rounds={rounds}
              callbackFromParent={(stateFromChild: any, stateFromChild2: any) => this.pickedArtist(stateFromChild, stateFromChild2)}
              artist_name={item.track.artist_name} track_id={item.track.track_id} track_name={item.track.track_name}
            />
          )}
        </div>
      </>
    );
  };

  endGame() {
    console.log('End Game');
    localStorage.setItem('score', this.state.score.toString());
    let data = {nick: localStorage.nickname, score: localStorage.score};
    localStorage.setItem('leaderboard', JSON.stringify(data));

    return <UpdateLeaderboard />
  };

  logout() {
    localStorage.removeItem('nickname');
    localStorage.removeItem('topSongsArr');
    localStorage.removeItem('score');
    localStorage.removeItem('gameCounter');
    this.props.history.push('/');
  };

  profile = () => {
    return (
      <Modal style={customStyles}
        isOpen={this.state.profileModalIsOpen}
        onRequestClose={this.closeModal}
      >
        <h2>Profile</h2>
        <div className='modale'>
          <h4>Nickname: {localStorage.nickname}</h4>
          <p>This game score: {localStorage.score || 0}</p>
          <div>
            <p>Last games scores:</p>
            <ThemeContext.Consumer>
              {(context: any) => {
              const {isLightTheme} = context;
              return(
                <div className="Leaderboard">
                  <div>
                    {isLightTheme.map((score: any, id: number) => {
                      if(score.nick === localStorage.nickname){
                        return <div key={id}>{score.nick} {score.score}</div>
                      }
                    })}
                  </div>
                </div>
              )
              }}
            </ThemeContext.Consumer>
          </div>
          <button className={'backBtn'} onClick={() => this.closeModal()}>Back</button>
        </div>
      </Modal>
    );
  };

  closeModal() { this.setState({ profileModalIsOpen: false }) };

  render() {
    const  { loading, rounds } = this.state;
    if(localStorage.nickname) {
      return (
        <div className="Play">
          {this.profile()}
          {localStorage.nickname ? <><button className="logoutBtn" onClick={() => this.logout()}>LOGOUT</button></> : <></>}
          <div className="welcome">
            <div className="info">Nickname: <p>{localStorage.nickname}</p></div>
            {localStorage.gameCounter === this.state.rounds.toString() ? <div className="info">Score: <p>{this.state.score}</p></div> : <></>}
            <div className="info">Round: <p>{localStorage.gameCounter}/{rounds}</p></div>
          </div>
          <button className="lowerBtn" onClick={() => this.setState({ profileModalIsOpen: true })}>Profile</button>
          
          {
            loading ? <div className="loading">...loading...</div> :
              <>{
                parseInt(localStorage.gameCounter) < rounds ?
                <> <div className="game-title">Who Sing?</div> {this.startGame()}</> : this.endGame()
                }
              </>
          }
        </div>
      );
   } else return <div>You have to pick a nickname to play ;)</div>
  };
};