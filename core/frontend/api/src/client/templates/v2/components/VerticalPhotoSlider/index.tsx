import { StyledSliderWrapper } from "./styled";
import ReactImageMagnify from "react-image-magnify";
import ImageGallery from "react-image-gallery";

import hotel1 from "../../assets/img/hotels/small/hotel4.jpg";
import hotel2 from "../../assets/img/hotels/small/hotel5.jpg";
import hotel3 from "../../assets/img/hotels/small/hotel6.jpg";
import { useMemo } from "react";
import * as React from "react";

type VerticalPhotoSliderProps = {
  maxWidth: string;
  maxHeight: string;
};

const VerticalPhotoSlider = ({ maxWidth, maxHeight }: VerticalPhotoSliderProps) => {

  const gallery = {
    showBullets: false,
    showThumbnails: false,
    infinite: true,
    showFullscreenButton: false,
    zoom: false,
    autoPlay: true,
    showPlayButton: false,
    showNav: true,
    showIndex: false,
    slideOnThumbnailOver: false,
    slideInterval: 5000,
    slideDuration: 300
  };

  const imgSources = [{
    src: hotel1.src
  }, {
    src: hotel2.src
  }, {
    src: hotel3.src
  }];

  const images = imgSources.map((img) => {
    try {
      const imgObject: any = {
        original: img.src,
        thumbnail: img.src
      };

      imgObject.renderItem = (item: any) => {
        const style = {
          background: `url(${item.original}) no-repeat center center`,
          backgroundSize: "cover",
          display: "block",
          height: "100%"
        };

        return <div style={style}>&nbsp;</div>;
      };

      return imgObject;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }

  });

  const renderZoom = (args: any) => {
    return (
      <ReactImageMagnify
        {...{
          smallImage: {
            alt: args.title,
            isFluidWidth: true,
            src: `${args.thumbnail}`
          },
          largeImage: {
            width: 300,
            height: 300,
            src: `${args.original}`
          },
          enlargedImagePortalId: `vertical-slider-enlargeImage`
        }}
      />
    );
  };

  const galleryProps = useMemo(() => ({
    autoPlay: gallery.autoPlay,
    showBullets: gallery.showBullets,
    showThumbnails: gallery.showThumbnails,
    infinite: gallery.infinite,
    showFullscreenButton: gallery.showFullscreenButton,
    showPlayButton: gallery.showPlayButton,
    showNav: gallery.showNav,
    showIndex: gallery.showIndex,
    slideOnThumbnailOver: gallery.slideOnThumbnailOver,
    slideInterval: gallery.slideInterval,
    slideDuration: gallery.slideDuration,
    items: images,
    renderItem: (...args: any[]) => {
      return renderZoom(args[0]);
    }
  }), [gallery]);

  return <StyledSliderWrapper>
    <ImageGallery
      {...galleryProps}
    />
    <div id={`vertical-slider-enlargeImage`} />
  </StyledSliderWrapper>;
};

export default VerticalPhotoSlider;

