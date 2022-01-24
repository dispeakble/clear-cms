import React, { Component } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

class AudioModule extends Component {
  state = { url: [], volume: 0.5 };
  render() {
    return <AudioPlayer src={this.state.url} volume={this.state.volume} />;
  }
}

export default AudioModule;
