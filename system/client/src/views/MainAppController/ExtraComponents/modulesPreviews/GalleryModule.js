import React, { Component } from "react";
import ReactImageMagnify from "react-image-magnify";

import { createMuiTheme } from "@material-ui/core/styles";

import ImageGallery from "react-image-gallery";

class MyReactImageMagnify extends Component {
  render() {
    return <ReactImageMagnify {...this.props} />;
  }
}

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

  renderZoom(args) {
    return (
      <MyReactImageMagnify
        {...{
          smallImage: {
            alt: "Wristwatch by Ted Baker London",
            isFluidWidth: true,
            src: `${args.thumbnail}`,
          },
          largeImage: {
            src: `${args.original}`,
          },
          enlargedImagePortalId: "myPortal",
        }}
      />
    );
  }

  getImgSizes(url) {
    return new Promise((resolve) => {
      let img = new Image();
      let res = {
        width: 0,
        height: 0,
      };

      img.onload = function () {
        res.width = this.width;
        res.height = this.height;
        resolve(res);
      };

      img.src = url;
    });
  }

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
      //img.sizes = this.getImgSizes(url);
      imgs.push(img);
    }

    console.log(imgs);

    switch (galleryType) {
      case "Carousel": {
        return (
          <React.Fragment>
            <ImageGallery
              {...this.state.gallery}
              renderItem={(...args) => {
                return this.renderZoom(args[0]);
              }}
              items={imgs}
            />
            <div id="myPortal" />
          </React.Fragment>
        );
      }
    }
  }
}

export default GalleryModule;
