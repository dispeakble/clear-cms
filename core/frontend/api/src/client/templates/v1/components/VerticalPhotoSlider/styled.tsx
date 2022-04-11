import styled from "styled-components";
import { device } from "../../styled";

export const StyledSliderWrapper = styled.div<{ maxWidth: string }>`
  width: 100%;
  overflow: hidden;
  justify-content: center;
  display: flex;
  align-items: center;
  & .swiper-button-prev {
    left: 0;
    @media ${device.tablet} {
      left: 29%;
    }
  }
  & .swiper-button-next {
    right: 0;
    @media ${device.tablet} {
      right: 28%;
    }
  }

  & .swiper-button-next, .swiper-button-prev {
    color: #FFFFFF;
  }

  @media ${device.laptop} {
    width: ${({ maxWidth }) => maxWidth};
  }
`;

type StyledSliderImageProps = {
  src: any;
  maxHeight: string;
}

export const StyledSliderImage = styled.div<StyledSliderImageProps>`
  background: url(${({ src }) => src}) no-repeat center center;
  background-size: cover;
  width: 300px;
  height: ${({ maxHeight }) => maxHeight};
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