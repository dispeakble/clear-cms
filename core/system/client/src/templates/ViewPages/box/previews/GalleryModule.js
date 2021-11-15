import React, { Component } from "react";
import ReactImageMagnify from "react-image-magnify";

import { createTheme } from "@material-ui/core/styles";

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
    return createTheme({
      palette: this.props.defaultTheme,
    });
  };

  componentDidMount() {
    if(this.props.element.moduleOptions){
      const gall = this.props.element.moduleOptions
      let gallery =  {
        showBullets: gall.bullets,
        showThumbnails: gall.thumbnails,
        infinite: gall.infiniteSliding,
        showFullscreenButton: gall.fullscreenButton,
        showPlayButton: gall.playButton,
        showNav: gall.navigation,
        showIndex: gall.index,
        slideOnThumbnailOver: gall.tbnSliding,
        slideInterval: gall.playInterval,
        slideDuration: gall.slideDuration,
      }
      this.setState({
        gallery,
      })
    }
  }

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
            width: this.width,
            height: this.height,
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
    let imgs = []
    if(this.props.element.moduleOptions?.imageSources){
      imgs = this.props.element.moduleOptions.imageSources.map(el => {
        return {
          title:  el?.title || "",
          description: el?.description || "",
          original: `/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.i}/module/${el?.path}`,
          thumbnail: `/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.i}/module/${el?.path}`,
          link: el?.link,
        }
      })
    }

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

    /*switch (galleryType) {
      case "Carousel":
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
      break;
      default:
        break;
    }*/
  }
}

export default GalleryModule;
