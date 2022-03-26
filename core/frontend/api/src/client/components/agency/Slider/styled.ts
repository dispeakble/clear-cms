import styled from "styled-components";
import {Colors, Shadows, Widths} from "../../../assets/design-set";
import {Check} from "@material-ui/icons";
// images
import BoxContainerBG from '../../../pages/agency/assets/Slider/slider-box-bg.jpg'

export const SliderWrapper = styled.section`
  margin: 80px 0px 120px 0px;
`

export const SliderContainer = styled.div`
  width: 90%;
  max-width: ${Widths.containerWidth};
  margin: 0 auto;
  box-shadow: ${Shadows.shadowMD};
  display: flex;
`
export const SliderLeft = styled.div`
  flex: 3;
`

export const SliderBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-image: url("${BoxContainerBG.src}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
`

export const SliderBox = styled.div`
  background-color: rgba(255, 255, 255, 0.6);
  flex: 1;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor:pointer;

`

export const SliderBoxHeading = styled.h3`
  font-size: 35px;
  font-weight: 500;
  line-height: 1.25em;
  text-align: center;
  margin-bottom: 16px;
`
export const SliderButton = styled.a`

`
export const SliderBoxActive = styled(SliderBox)`
  background-color: rgba(220,107,3,0.7);
  color: #fff;
`

export const SliderRight = styled.div`
  flex: 7;
  padding: 30px;
`
export const ImageSliderWrapper = styled.div``
export const SliderContentWrapper = styled.div``
export const ImageSliderHeading = styled.div`
  font-size: 66px;
  font-weight: 500;
  color: ${Colors.primaryColor};
  text-align: center;
`

// Gallery

export const GalleryContainer = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  position: relative;
`

export const GalleryImage = styled.img`
  flex: 3;
  width: 30%;
  height: 330px;
  object-fit: cover;
  box-shadow: 0px 4px 28px 7px rgba(0, 0, 0, 0.17);
`

export const GalleryMainImage = styled(GalleryImage)`
  flex: 5;
  opacity: 1;
  margin: 16px -16px 0px -16px;
  z-index: 2;
`;

export const SliderButtonContainer = styled.div`
  width: 60%;
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

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 50px 0px 0px 50px;
`
export const ListItemContainer = styled.div`
  display: flex;
  gap: 16px;
`

export const ListItemIcon = styled(Check)`
  font-size: 22px;
  margin-top: 8px;
  font-weight: 700;
  color: ${Colors.primaryColor};
`

export const ListItemHeading = styled.h5`
  font-size: 22px;
  color: ${Colors.black};
  font-weight: 500;
  margin: 0;
`

export const ListItemDescription = styled.p`
  color: #DC0303;
  font-weight: 500;
  margin: 0;
`