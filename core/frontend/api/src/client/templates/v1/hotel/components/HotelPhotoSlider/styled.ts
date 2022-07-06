import styled from "styled-components";
import {size} from "../../styled";

export const HotelPhotoSliderWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 270px;
  margin-bottom: 20px;
  
  @media (min-width: ${size.laptop}) {
    width: calc(100% - 20px);
      height: 440px;
  }
  & .image-gallery-icon {
    color: ${({theme}) => theme.colors.white};
    filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: ${({theme}) => theme.colors.primaryColorHover};
      }
    }

    &:focus {
      outline: none;
    }
  }
  
`;

interface IImageDiv {
    url: string
};

export const ImageDiv = styled.div<IImageDiv>`
  background: url(${(props) => props.url}) no-repeat center center;
  background-size: cover;
  display: block;
  height: 100% 
`