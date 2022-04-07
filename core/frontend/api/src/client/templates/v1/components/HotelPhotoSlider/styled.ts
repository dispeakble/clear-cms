import styled from "styled-components";
import {device, size} from "../../styled";

export const HotelPhotoSliderWrapper = styled.div`
  overflow: hidden;
  justify-content: center;
  display: flex;
  align-items: center;
  & .swiper-button-prev {
    left: 0;
    @media ${device.tablet} {
      left: 0;
    }
  }
  & .swiper-button-next {
    right: 0;
    @media ${device.tablet} {
      right: 0;
    }
  }

  & .swiper-button-next, .swiper-button-prev {
    color: #FFFFFF;
  }

`;

type StyledSliderImageProps = {
  src: any;
}

export const StyledSliderImage = styled.div<StyledSliderImageProps>`
  background: url(${({src}) => src}) no-repeat center center;
  background-size: cover;
  width: 620px;
  height: 200px;
  @media (min-width: ${size.laptop}) {
    width: 438px;
    height: 375px;
  }
  @media (min-width: ${size.laptopL}) {
    width: 818px;
    height: 375px;
  }
  &.first {

  }
  &.last {

  }
  &.middle {
    width: 397px;
    height: 450px;
    box-shadow: 0 0 30px rgba(0,0,0,0.3);
  }
`;