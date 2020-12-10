import React, { Component } from "react";

import { createMuiTheme } from "@material-ui/core/styles";

import ImageGallery from "react-image-gallery";

class GalleryModule extends Component {
  state = {
    gallery: {
      showBullets: false,
      showThumbnails: true,
      infinite: true,
      showFullscreenButton: true,
      showPlayButton: true,
      showNav: true,
      showIndex: false,
      slideOnThumbnailOver: true,
      slideInterval: 2000,
      slideDuration: 450,
    },
  };
  createDefaultTheme = () => {
    return createMuiTheme({
      palette: this.props.defaultTheme,
    });
  };

  render() {
    let galleryType = "Carousel";

    let imgs = [
      {
        title: "img1",
        description: (
          <React.Fragment>
            <h4>Img 1</h4> <p>some description</p>
            <p>
              <a href="www.someImage.com" target="_blank">
                go to website
              </a>
            </p>
          </React.Fragment>
        ),
        original: "https://picsum.photos/1920/1080",
        thumbnail: "https://picsum.photos/1920/1080",
        link: "www.someImage.com",
      },
    ];

    for (var i = 0; i < 10; i++) {
      let id = Math.floor(Math.random() * 50);
      let url = `https://picsum.photos/id/${id}/1920/1080`;
      let img = Object.assign({}, imgs[0]);
      img.original = url;
      img.thumbnail = url;
      imgs.push(img);
    }

    switch (galleryType) {
      case "Carousel": {
        return <ImageGallery {...this.state.gallery} items={imgs} />;
      }
    }
  }
}

export default GalleryModule;
