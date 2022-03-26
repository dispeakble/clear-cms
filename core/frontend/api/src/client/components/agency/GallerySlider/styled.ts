import styled from "styled-components";
import {Shadows, Widths} from "../../../assets/design-set";

export const WrapperContainer = styled.div`
  width: 90%;
  margin: 0 auto;
  max-width: ${Widths.containerWidth};
  height: 100%;
  padding: 20px 0;
`

export const GalleryContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: 90%;
  max-width: ${Widths.widthMD};
  margin: 0 auto;
`

export const GalleryImage = styled.img`
  height: 400px;
  width: 30%;
  object-fit: cover;
  box-shadow: 0px 4px 28px 7px rgba(0, 0, 0, 0.17);
`

export const GalleryMainImage = styled(GalleryImage)`
  opacity: 1;
  margin: 16px -16px 0px -16px;
  z-index: 2;
`;

export const SliderButtonContainer = styled.div`
  width: calc(30% + 120px);
  display: flex;
  justify-content: space-between;
  position: absolute;
  z-index: 2;
  top: 50%;
`

export const SliderBtnLeft = styled.div`
  text-shadow: ${Shadows.shadowMD};
  cursor:pointer;
`
export const SliderBtnRight = styled(SliderBtnLeft)`
  cursor:pointer;

`