import styled from "styled-components";

export const StyledSliderWrapper = styled.div`
  width: 505px;
  padding: 20px;
  height: 437px;
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
