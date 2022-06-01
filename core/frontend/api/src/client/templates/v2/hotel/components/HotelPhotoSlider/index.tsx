import * as React from "react";
import {HotelPhotoSliderWrapper, ImageDiv} from "./styled";
import ImageGallery from 'react-image-gallery';
import { useMemo } from "react";

import hotel1 from "../../../assets/img/hotels/small/hotel4.jpg";
import hotel2 from "../../../assets/img/hotels/small/hotel5.jpg";
import hotel3 from "../../../assets/img/hotels/small/hotel6.jpg";
import "react-image-gallery/styles/css/image-gallery.css";

const HotelPhotoSlider = () => {
  const gallery = {
    showBullets: true,
    showThumbnails: true,
    thumbnailPosition: "left" as "top" | "bottom" | "left" | "right",
    infinite: true,
    showFullscreenButton: false,
    zoom: false,
    autoPlay: false,
    showPlayButton: false,
    showNav: true,
    showIndex: false,
    slideOnThumbnailOver: false,
    slideInterval: 3000,
    slideDuration: 300,
  };

  const imgSources = [{
    src: hotel1.src
  },{
    src: hotel2.src
  },{
    src: hotel3.src
  },
    {
      src: hotel1.src
    },{
      src: hotel2.src
    },{
      src: hotel3.src
    }];



  const images = imgSources.map((img) => {
    try {
      const imgObject: any = {
        original: img.src,
        thumbnail: img.src
      };

      return imgObject;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }

  });


  const galleryProps = useMemo(() => ({
    autoPlay: gallery.autoPlay,
    showBullets: gallery.showBullets,
    showThumbnails: gallery.showThumbnails,
    thumbnailPosition: gallery.thumbnailPosition,
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
      return args.map(a => <ImageDiv url={a.original} key={`${Math.random()}${a.original}`}/>);
    },
  }), [gallery]);

  return <HotelPhotoSliderWrapper className={"slider-wrapper"}>
    <ImageGallery
        {...galleryProps}
    />
  
    <div id={`vertical-slider-enlargeImage`}/>
  </HotelPhotoSliderWrapper>;
}

export default HotelPhotoSlider;