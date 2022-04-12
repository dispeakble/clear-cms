import styled from "styled-components";
import { Colors } from "../../assets/design-set";

export const StyledSliderWrapper = styled.div`
  width: 100%;
  height: 450px;

  & .image-gallery-icon {
    color: ${Colors.white};
    filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: ${Colors.primaryColorHover};
      }
    }

    &:focus {
      outline: none;
    }
  }
`;
