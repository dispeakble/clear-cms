import styled from "styled-components";
import hotel1 from "../../assets/img/hotels/small/hotel4.jpg";
import { size } from "../../styled";

export const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.offWhite};
  display: block;
  @media (min-width: ${size.tablet}) {
    padding: 34px;
  }
  width: 100%;
  box-shadow: 0 4px 12px rgba(0,0,0,.2);
  @media (min-width: ${size.laptop}) {
    display: flex;
  }
`;

export const StyledTabs = styled.div`
  background: url(${hotel1.src}) no-repeat center center;
  background-size: cover;
  display: flex;
  flex-direction: row;
  gap: 5px;
  @media (min-width: ${size.laptop}) {
    flex-direction: column;
    width: 440px;
  }
`;

export const StyledTab = styled.div`
  background: rgba(${({ theme }) => theme.colors.primaryColorFadedRBG}, .7);
  flex: 1;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.black};
  text-shadow: 0 4px 4px rgba(0,0,0,0.25);
  max-width: 440px;
  padding: 10px;
  @media (min-width: ${size.laptop}) {
    padding: 30px;
    font-size: 35px;
  }
  text-align: center;
  cursor: pointer;
  &:hover, &.selected {
    background: rgba(${({ theme }) => theme.colors.primaryColorRBG}, .7);
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const StyledContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  
  @media (min-width: ${size.tablet}) {
    padding: 20px 0 20px 20px;
  }
`;

export const StyledTitle = styled.div`
  margin: 20px 0;
  font-size: 44px;
  color: ${({ theme }) => theme.colors.primaryColor}
`;

export const StyledContentWrapper = styled.div`
  text-align: left;
  padding: 10px 40px;
`;
export const StyledContentTitle = styled.div`
  font-size: 22px;
  color:  ${({ theme }) => theme.colors.black};
  background: url(${({ theme }) => theme.icon("checkSignGold")}) no-repeat left 3px;
  padding-left: 20px;
`;
export const StyledContentSubtitle = styled.div`
  padding-left: 20px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.primaryRed};
`;