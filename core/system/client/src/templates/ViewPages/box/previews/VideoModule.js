import React, { Component } from "react";
import ReactPlayer from "react-player/lazy";

class VideoModule extends Component {
  state = {
    url: [],
    mute: false,
    controls: false,
    loop: false,
    volume: 50,
  };
  // componentDidMount() {
  //   this.setState({
  //     url: this.props.element.moduleOptions.url,
  //     volume: this.props.element.moduleOptions.volume,
  //     autoplay: this.props.element.moduleOptions.autoplay,
  //     loop: this.props.element.moduleOptions.loop,
  //     controls: this.props.element.moduleOptions.controls,
  //     enabled: true
  //   })
  // }
  componentDidMount() {
    console.log('video module - componentDidMount', this.props);

    this.setState({
      url: this.props.moduleOptions.url,
      mute: this.props.moduleOptions.mute,
      controls: this.props.moduleOptions.controls,
      loop: this.props.moduleOptions.loop,
      volume: this.props.moduleOptions.volume,
    });
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

export default VideoModule;
