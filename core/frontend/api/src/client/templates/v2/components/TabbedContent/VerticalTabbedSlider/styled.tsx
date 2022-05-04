import styled from "styled-components";
import { size } from "../../../styled";

export const StyledSliderWrapper = styled.div`
  overflow: hidden;
  width: 320px;
  height: 270px;
  margin-bottom: 20px;
  @media (min-width: ${size.mobileS}) {
    width: 320px;
  }
  @media (min-width: ${size.mobileM}) {
    width: 375px;
  }
  @media (min-width: ${size.mobileL}) {
    width: 400px;
  }
  @media (min-width: ${size.tablet}) {
    width: 620px;
  }
  @media (min-width: ${size.laptop}) {
    width: 520px;
  }
  @media (min-width: ${size.laptopL}) {
    width: 850px;
  }
  @media (min-width: ${size.desktop}) {
    width: 1000px;
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