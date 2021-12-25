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
    videoURL: '',
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
      videoURL: moduleOptions.videoURL,
      files: moduleOptions.files || [],
    }
    if(newState.files?.length > 0) {
      newState.url = `/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.boxId}/module/${newState.files[0].name}`
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
        url={this.state.url || this.state.videoURL}
        volume={this.state.volume}
      />
    );
  }
}

VideoModule.propTypes = {
  moduleOptions: PropTypes.object,
}

export default VideoModule;
