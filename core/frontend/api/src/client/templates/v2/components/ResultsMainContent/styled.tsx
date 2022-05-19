import styled from "styled-components";
import {device} from "../../styled";

export const ResultMainContentWrapper = styled.div`
    flex: 0 1 75%;
    display: flex;
    flex-direction: column;
    margin-bottom: 36px;
    align-items: center;
    overflow-x: hidden;
    @media ${device.laptop} {
      margin-left: 20px;
    }
`;

