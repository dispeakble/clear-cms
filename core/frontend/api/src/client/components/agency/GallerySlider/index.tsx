import React, { useState } from "react";

import Image1 from "../../../pages/agency/assets/Cards/ocean.jpg";
import Image2 from "../../../pages/agency/assets/Cards/mountain-lake.jpg";
import Image3 from "../../../pages/agency/assets/Cards/gran-carania.jpg";

import {
    GalleryContainer,
    GalleryImage,
    GalleryMainImage,
    SliderBtnLeft,
    SliderBtnRight,
    SliderButtonContainer,
    WrapperContainer
} from "./styled";


const GallerySlider = ({ galleryImages }: any) => {

  const [images, setImages] = useState([1, 2, 3]);

  const handleMainImage = (type: string) => {
    const newImages = [...images];
    if (type === "+") {
      newImages[0] = newImages[0] === 3 ? 1 : newImages[0] + 1;
      newImages[1] = newImages[1] === 3 ? 1 : newImages[1] + 1;
      newImages[2] = newImages[2] === 3 ? 1 : newImages[2] + 1;
    } else {
      newImages[0] = newImages[0] === 1 ? 3 : newImages[0] - 1;
      newImages[1] = newImages[1] === 1 ? 3 : newImages[1] - 1;
      newImages[2] = newImages[2] === 1 ? 3 : newImages[2] - 1;
    }
    setImages(newImages);
  };

  return (
    <WrapperContainer data-testid="gallery-wrapper">
      <GalleryContainer>
        <GalleryImage src={galleryImages.filter((img: any) => img.val === images[0])[0].img} />
        <GalleryMainImage src={galleryImages.filter((img: any) => img.val === images[1])[0].img} />
        <GalleryImage src={galleryImages.filter((img: any) => img.val === images[2])[0].img} />
        <SliderButtonContainer>
          <SliderBtnLeft data-testid="arrow-slide-left" onClick={() => handleMainImage("-")}>
            <svg width="23" height="39" viewBox="0 0 23 39" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 37L3 18.875L21 2" stroke="white" stroke-width="3" />
            </svg>

          </SliderBtnLeft>
          <SliderBtnRight data-testid="arrow-slide-right" onClick={() => handleMainImage("+")}>
            <svg width="23" height="39" viewBox="0 0 23 39" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2L20 20.125L2.00001 37" stroke="white" stroke-width="3" />
            </svg>

          </SliderBtnRight>
        </SliderButtonContainer>
      </GalleryContainer>

    </WrapperContainer>
  );
};

GallerySlider.defaultProps = {
  galleryImages: [{ val: 1, img: Image1.src }, { val: 2, img: Image2.src }, { val: 3, img: Image3.src }]
};


export default GallerySlider;


