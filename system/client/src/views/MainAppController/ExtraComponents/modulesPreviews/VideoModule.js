import React, { Component } from "react";
import ReactPlayer from "react-player/lazy";

class VideoModule extends Component {
  state = {
    mute: false,
    controls: false,
    loop: false,
  };
  render() {
    return (
      <ReactPlayer
        playing
        mute={this.state.mute}
        controls={this.state.controls}
        loop={this.state.loop}
        url={["https://www.youtube.com/watch?v=4VuBio7fKO0&t=1s"]}
      />
    );
  }
}

export default VideoModule;
