import styled from "styled-components";
import {device, size} from "../../../styled";

export const StyledSliderWrapper = styled.div<{maxWidth: string}>`
  overflow: hidden;
  justify-content: center;
  display: flex;
  align-items: center;
  & .swiper-button-prev {
    left: 0;
    @media (min-width: ${size.tablet}) {
      left: 29%;
    }
  }
  & .swiper-button-next {
    right: 0;
    @media (min-width: ${size.tablet}) {
      right: 28%;
    }
  }

  & .swiper-button-next, .swiper-button-prev {
    color: #FFFFFF;
  }
  width: 320px;
  @media (min-width: ${size.mobileS}) {
    width: 320px;
  }
  @media (min-width: ${size.mobileM}) {
    width: 375px;
  }
  @media (min-width: ${size.mobileL}) {
    width: 400px;
  }
  @media (min-width: ${size.tablet}) {
    width: 620px;
  }
  @media (min-width: ${size.laptop}) {
    width: 520px;
  }
  @media (min-width: ${size.laptopL}) {
    width: 750px;
  }
`;

type StyledSliderImageProps = {
  src: any;
  maxHeight: string;
}

export const StyledSliderImage = styled.div<StyledSliderImageProps>`
  background: url(${({src}) => src}) no-repeat center center;
  background-size: cover;
  width: 120px;
  @media (min-width: ${size.mobileS}) {
    width: 140px;
  }
  @media (min-width: ${size.mobileM}) {
    width: 120px;
  }
  @media (min-width: ${size.mobileL}) {
    width: 120px;
  }
  @media (min-width: ${size.tablet}) {
    width: 215px;
  }
  @media (min-width: ${size.laptop}) {
    width: 180px;
  }
  @media (min-width: ${size.laptopL}) {
    width: 260px;
  }
  height: ${({maxHeight}) => maxHeight};
`;