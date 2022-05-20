import styled from "styled-components";
import {device, size} from "../../500/styled";

export const Wrapper = styled.div`
    max-width:  421px;
    margin-right: 20px;
    flex: 0 1 26%;
  @media (max-width: ${size.laptopM}) {
    flex: 1 0 100%;
  }
`;

export const SearchOptions = styled.div`
  
`;

