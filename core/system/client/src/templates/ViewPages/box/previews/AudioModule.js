import React, { Component } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import PropTypes from "prop-types";

class AudioModule extends Component {
  state = { url: [], volume: 0.5, autoplay: false, enabled: false };
  componentDidMount() {
    this.setState({
      url: this.props.element.moduleOptions.url,
      volume: this.props.element.moduleOptions.volume,
      autoplay: this.props.element.moduleOptions.autoplay || false,
      enabled: true
    })
  }

  render() {

    const audioProps = {
      src: this.state.url,
      volume: this.state.volume
    }

    if(this.state.autoplay) {
      audioProps.autoPlay = true;
    }

    return this.state.enabled ? (<AudioPlayer {...audioProps} /> ) : "";
  }
}

export default AudioModule;

AudioModule.propTypes = {
  moduleOptions: PropTypes.object
};

