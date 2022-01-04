import React, { Component } from "react";
import ReactPlayer from "react-player/lazy";
import PropTypes from 'prop-types';

class VideoModule extends Component {
  state = {
    url: [],
    mute: false,
    controls: false,
    loop: false,
    volume: 50,
    files: [],
  };

  componentDidMount() {
    const {moduleOptions} = this.props;
    const newState = {
      url: moduleOptions.url,
      mute: moduleOptions.mute,
      controls: moduleOptions.controls,
      loop: moduleOptions.loop,
      volume: moduleOptions.volume,
      files: moduleOptions.files || [],
    }
    this.setState(newState);
  }
  render() {
    return (
        <ReactPlayer
            playing
            mute={this.state.mute}
            controls={this.state.controls}
            loop={this.state.loop}
            url={this.state.url}
            volume={this.state.volume}
        />
    );
  }
}

VideoModule.propTypes = {
  moduleOptions: PropTypes.object,
}

export default VideoModule;
