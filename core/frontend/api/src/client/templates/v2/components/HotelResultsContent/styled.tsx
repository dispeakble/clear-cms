import styled from "styled-components";
import { device, size } from "../../500/styled";

export const Wrapper = styled.div`
    justify-content: center;
    & > div {
      width: 100%;
    }
    flex: 0 1 70%;
  @media (max-width: ${size.laptopM}) {
    flex: 1 0 100%;
    min-width: 0px;
  }
`;

export const ViewMoreButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
`;

export const ViewMoreButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.primaryLight} 0%, ${({ theme }) => theme.colors.primaryColor} 100%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  width: 321px;
  height: 47px;
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  color: #FFFFFF;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  border: none;
`;

export const ViewMoreIcon = styled.div`
  background: url(${({ theme }) => theme.icon("viewMore")}) no-repeat left center;
  width: 30px;
  height: 30px;
  margin-left: 8px;
`;



