import React, { Component } from 'react';
import './cards.scss';

class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickedArtist: this.props.artist_name,
      pickedTrackId: this.props.track_id,
    };

    this.sendBackPickedArtist = this.sendBackPickedArtist.bind(this);
  };

  componentDidMount() {
  }

  sendBackPickedArtist = () => {
    this.props.callbackFromParent(this.props.artist_name, this.props.track_id);
    if (localStorage.gameCounter < this.props.rounds) {
      let gameCounter = (parseInt(localStorage.getItem('gameCounter')) + 1);
      localStorage.setItem("gameCounter", gameCounter.toString());
    };
  };

  render() {
    return (
      <div className="Cards">
        <div className="artist">
          {this.props.artist_name}
        </div>
        {}
        <button onClick={() => this.sendBackPickedArtist()}>
          Choose
        </button>
      </div>
    );
  };
};

export default Cards;