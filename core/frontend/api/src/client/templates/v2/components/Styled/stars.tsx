import styled from "styled-components";
import coldStar from "../../assets/img/cold-star-icon.svg";
import { device } from "../../styled";
import goldStar from "../../assets/img/gold-star-icon.svg";
import smallGoldStarIcon from "../../assets/img/small-gold-star-icon.svg";

export const StyledStarsBig = styled.div<{ stars: number }>`
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
  &:after{
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

export const StyledStarsSmall = styled.div<{ stars: number }>`
  height: 25px;
  width: 125px;
  display: flex;
  
  position: relative;
  &:before {
    content: " ";
    height: 25px;
    display: block;
    position: absolute;
    right: 0;
    width: ${({ stars }) => (5 - stars) * 25}px;
    background: url(${coldStar.src}) space top left;
    background-size: 25px 25px;
    opacity: .25;
  }
  &:after{
    content: " ";
    display: block;
    position: absolute;
    left: 0;
    height: 25px;
    width: ${({ stars }) => stars * 25}px;
    background: url(${smallGoldStarIcon.src}) space left center;
    background-size: 25px 25px;
  }
`;