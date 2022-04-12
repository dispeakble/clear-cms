import styled from "styled-components";
import { device, size } from "../../styled";
import { Colors } from "../../assets/design-set";
import coldStar from "../../assets/img/cold-star.svg";
import goldStar from "../../assets/img/gold-star.svg";
import zoomIcon from "../../assets/img/zoom-icon.svg";

export const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

  @media (min-width: ${device.tablet}) {
    margin: 20px;
  }
  @media (min-width: ${device.laptopL}) {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
`;

export const StyledCard = styled.div`
  background: white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, .1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 10px;
  @media (min-width: ${size.tablet}) {
    margin: 20px;
    padding: 20px;
  }
`;

export const StyledTitle = styled.div`
  font-size: 25px;
  font-weight: bold;
  line-height: 60px;
`;

export const StyledLunch = styled.div`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
`;

export const StyledDetails = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
`;

export const StyledPrice = styled.div`
  color: ${Colors.darkRed};
  font-size: 26px;
  margin-bottom: 10px;
`;

export const StyledActionButton = styled.a`
  background: ${Colors.primaryColor};
  color: white;
  border-radius: 12px;
  text-align: center;
  width: 100%;
  cursor: pointer;
  display: block;
  padding: 16px;
  font-size: 28px;
  margin-bottom: 10px;

  &:hover {
    color: ${Colors.primaryLight};
  }
`;

export const StyledZoomImg = styled.div<{ src: any }>`
  flex: 1;
  min-height: 200px;
  height: 100%;
  background: url(${({ src }) => src}) no-repeat center center;
  background-size: cover;

  &:hover div {
    display: block;
    width: 395px;
    height: 450px;
    margin-right: -20px;
    margin-bottom: -20px;
  }

  overflow: visible;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  position: relative;

  &:after {
    content: " ";
    width: 26px;
    height: 26px;
    display: block;
    position: absolute;
    background: url(${zoomIcon.src}) no-repeat left top;
  }

`;

export const StyledZoomPopup = styled.div<{ src: any }>`
  width: 0;
  height: 0;
  max-width: calc(100% + 40px);
  margin-right: 15px;
  margin-bottom: 15px;
  background: url(${({ src }) => src}) no-repeat center center;
  background-size: cover;
  transition: width 600ms ease-out, height 600ms ease-out, margin 600ms ease-out;
  position: absolute;
`;
export const StyledStars = styled.div<{ stars: number }>`
  height: 25px;
  background: url(${coldStar.src}) space top left;
  background-size: 25px 25px;
  width: 125px;
  @media ${device.tablet} {
    width: 250px;
    height: 50px;
    background-size: 50px 50px;
  }


  position: relative;

  &:after {
    content: " ";
    display: block;
    position: absolute;
    left: 0;
    height: 25px;
    width: ${({ stars }) => stars * 25}px;
    background: url(${goldStar.src}) space left center;
    background-size: 25px 25px;
    @media ${device.tablet} {
      width: ${({ stars }) => stars * 50}px;
      height: 50px;
      background-size: 50px 50px;
    }
  }
`;
