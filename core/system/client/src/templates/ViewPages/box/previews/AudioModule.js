import React, { Component } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import PropTypes from "prop-types";

class AudioModule extends Component {
  state = {url: '', volume: 0.5, autoplay: false, enabled: false, sourceType: 0, files: []};

  componentDidMount() {
    this.setState({
      url: this.props.moduleOptions.url,
      volume: this.props.moduleOptions.volume,
      autoplay: this.props.moduleOptions.autoplay || false,
      enabled: true,
      sourceType: this.props.moduleOptions.sourceType || 0,
      files: this.props.moduleOptions.files || [],
    })
  }

  render() {

    const audioProps = {
      src: this.state.url,
      volume: this.state.volume
    };

    if(this.state.sourceType === 2) {
      const fileName = this.props.moduleOptions.files[0].name;
      audioProps.src = `/files/pages/page-${this.props.pageOptions.pageId}/box-${this.props.boxId}/module/${fileName}`;
    }

    if(this.state.autoplay) {
      audioProps.autoPlay = true;
    }
    return this.state.enabled ? (<AudioPlayer {...audioProps} /> ) : "";
  }
}

export default AudioModule;

AudioModule.propTypes = {
  moduleOptions: PropTypes.object,
  pageOptions: PropTypes.object,
  boxId: PropTypes.number,
};

