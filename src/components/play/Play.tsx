import React, { Component } from "react";
import axios from "axios";
import api from "./config";
import Cards from "../cards/Cards";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Modal from "react-modal";
import UpdateLeaderboard from "../../contexts/updateLeaderboardContext";
import "./play.scss";
import { BoardContext } from "../../contexts/leaderboardContext";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: 60,
    transform: "translate(-50%, -50%)"
  }
};

interface MyState {
  loading: boolean;
  score: any;
  rounds?: any;
  randomElements: Array<String>;
  lyric: Array<String>;
  lyric2: any;
  pickedName: String;
  pickedTrack: any;
  profileModalIsOpen: boolean;
}

interface MyProps extends Partial<RouteComponentProps> {
  history?: any;
}

@(withRouter as any)
export default class Play extends Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      score: 0,
      rounds: 10,
      randomElements: [],
      lyric: [],
      lyric2: [],
      pickedName: "",
      pickedTrack: null,
      profileModalIsOpen: false
    };

    this.pickedArtist = this.pickedArtist.bind(this);
    this.callbackFromParent = this.callbackFromParent.bind(this);
    this.endGame = this.endGame.bind(this);
    this.logout = this.logout.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.getPopularSong();
    Modal.setAppElement("body");
  }

  //Get most popular songs with lyrics.
  getPopularSong = () => {
    axios
      .get(api.url + api.popular + api.key)
      .then(response => {
        localStorage.setItem("topSongsArr", JSON.stringify(response));
        this.setState({ loading: false });
        this.nextStep();
      })
      .catch(err => {
        console.log(err);
      });
  };

  /**
    Put each element in the array in an object, and give it a random sort key.
    Sort using the random key.
    Unmap to get the original objects
  **/
  shuffleArray = (arr: any) =>
    arr
      .map((a: any) => [Math.random(), a])
      .sort((a: any, b: any) => a[0] - b[0])
      .map((a: any) => a[1]);

  nextStep = () => {
    //Top Songs Array from axios response.
    let originalData = JSON.parse(localStorage.topSongsArr).data.message.body
      .track_list;

    //Shuffle originalData Array.
    let shuffledTracks = this.shuffleArray(originalData);

    //Get and Slice 3 random array from originalData.
    let tracksArr = shuffledTracks
      .sort(() => Math.random() - Math.random())
      .slice(0, 3);

    /**
      Pick one random track from the tracksArr and store the result to lyric variable.
      This will be the song who people have to guess.
      Then setState for future comparison between what i show to the player as singers and what singer the player pick.
    **/
    let lyric = tracksArr[Math.floor(Math.random() * tracksArr.length)];
    this.setState({ randomElements: tracksArr, lyric2: lyric });

    // Call the track.lyrics.get?track_id= to get the choosen track from the lyric Api.
    this.printLyric(lyric.track.track_id);
  };

  printLyric = (lyricId: string) => {
    axios
      .get(api.url + api.lyrics + lyricId + api.key)
      .then((response: any) => {
        this.setState({
          lyric: response.data.message.body.lyrics.lyrics_body.split(
            "*******"
          )[0]
        });
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  //Function to receive props from Card component and set them to the state.
  callbackFromParent(name: string, track_id: number) {
    this.setState({ pickedName: name, pickedTrack: track_id });
  }

  //Check if the picked singer from the Card is the one who sing the showed lyric.
  pickedArtist(name: string, track_id: number) {
    this.callbackFromParent(name, track_id);
    if (this.state.lyric2.track.track_id === track_id) {
      this.setState({ score: this.state.score + 1 });
      this.nextStep();
    } else this.nextStep();
  }

  startGame = () => {
    const rounds = this.state;
    return (
      <>
        <div className="lyric-text">"{this.state.lyric}"</div>
        <div className="cards-container">
          {this.state.randomElements.map((item: any, i) => (
            <Cards
              key={i}
              rounds={rounds}
              callbackFromParent={(stateFromChild: any, stateFromChild2: any) =>
                this.pickedArtist(stateFromChild, stateFromChild2)
              }
              artist_name={item.track.artist_name}
              track_id={item.track.track_id}
              track_name={item.track.track_name}
            />
          ))}
        </div>
      </>
    );
  };

  endGame() {
    localStorage.setItem("score", this.state.score.toString());
    let data = { nick: localStorage.nickname, score: localStorage.score };
    localStorage.setItem("leaderboard", JSON.stringify(data));

    return <UpdateLeaderboard />;
  }

  logout() {
    localStorage.removeItem("nickname");
    localStorage.removeItem("topSongsArr");
    localStorage.removeItem("score");
    localStorage.removeItem("gameCounter");
    this.props.history.push("/");
  }

  profile = () => {
    return (
      <Modal
        style={customStyles}
        isOpen={this.state.profileModalIsOpen}
        onRequestClose={this.closeModal}
      >
        <h2>Profile</h2>
        <div className="modale">
          <h4>Nickname: {localStorage.nickname}</h4>
          <div>
            <p>Last games scores:</p>
            <BoardContext.Consumer>
              {(context: any) => {
                const { board } = context;
                return (
                  <div className="board">
                    <div>
                      {// eslint-disable-next-line
                      board.map((score: any, id: number) => {
                        if (score.nick === localStorage.nickname) {
                          return (
                            <div key={id}>
                              {score.nick} - {score.score}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                );
              }}
            </BoardContext.Consumer>
          </div>
          <button className={"backBtn"} onClick={() => this.closeModal()}>
            Back
          </button>
        </div>
      </Modal>
    );
  };

  closeModal() {
    this.setState({ profileModalIsOpen: false });
  }

  render() {
    const { loading, rounds } = this.state;
    if (localStorage.nickname) {
      return (
        <div className="Play">
          {this.profile()}
          {localStorage.nickname ? (
            <button className="logoutBtn" onClick={() => this.logout()}>
              LOGOUT
            </button>
          ) : (
            <></>
          )}
          <div className="welcome">
            <div className="info">
              Nickname: <p>{localStorage.nickname}</p>
            </div>
            {localStorage.gameCounter === this.state.rounds.toString() ? (
              <div className="info">
                Score: <p>{this.state.score}</p>
              </div>
            ) : (
              <></>
            )}
            <div className="info">
              Round:{" "}
              <p>
                {localStorage.gameCounter}/{rounds}
              </p>
            </div>
          </div>
          <button
            className="lowerBtn"
            onClick={() => this.setState({ profileModalIsOpen: true })}
          >
            Profile
          </button>
          {loading ? (
            <div className="loading">...loading...</div>
          ) : (
            <>
              {parseInt(localStorage.gameCounter) < rounds ? (
                <>
                  {" "}
                  <div className="game-title">Who Sing?</div> {this.startGame()}
                </>
              ) : (
                this.endGame()
              )}
            </>
          )}
        </div>
      );
    } else return <div>You have to pick a nickname to play ;)</div>;
  }
}
