import styled from "styled-components";
import coldStar from "../../assets/img/cold-star-icon.svg";
import smallGoldStarIcon from "../../assets/img/small-gold-star-icon.svg";

export const StyledStarsSmall = styled.div<{stars: number}>`
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
    width: ${({stars}) => (5 - stars) * 25}px;
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
    width: ${({stars}) => stars * 25}px;
    background: url(${smallGoldStarIcon.src}) space left center;
    background-size: 25px 25px;
  }
`;