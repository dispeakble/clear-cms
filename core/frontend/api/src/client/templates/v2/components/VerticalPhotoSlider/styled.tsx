import styled from "styled-components";

export const StyledSliderWrapper = styled.div`
  margin: 60px 0;
  width: 870px;
  display: flex;
  align-items: center;
  & .swiper-button-prev {
    left: 29%;
  }
  & .swiper-button-next {
    right: 28%;
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
  width: 300px;
  height: 340px;
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