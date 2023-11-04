import styled from "styled-components";
import { device } from "../../styled";

export const StyledStars = styled.div<{ stars: number, size?: 'small' | 'big' }>`
  position: relative;
  height: 20px;
  background: url(${({ theme }) => theme.icon("coldStar")}) space left center;
  background-size: 20px 20px;
  width: 110px;
  @media ${({size}) => size === 'small' ? 'not all' : device.tablet} {
    width: 220px;
    height: 40px;
    background-size: 40px 40px;
  }
  
  &:after {
    content: " ";
    display: block;
    position: absolute;
    left: 0;
    height: 20px;
    background: url(${({ theme }) => theme.icon("goldStar")}) space left center;
    background-size: 20px 20px;
    width: ${({ stars }) => (stars * 22) - (stars === 5 ? 0 : 1)}px;
    @media ${({size}) => size === 'small' ? 'not all' : device.tablet} {
      width: ${({ stars }) => (stars * 44) - (stars === 5 ? 0 : 2)}px;
      height: 40px;
      background-size: 40px 40px;
    }
  }
`;