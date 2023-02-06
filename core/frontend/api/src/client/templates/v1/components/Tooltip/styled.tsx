import styled from "styled-components";
import { size } from "../../styled";

export const TooltipText = styled.div`
  text-align: left;
  border-radius: 3px;
  cursor: pointer;
`;
export const TooltipBox = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: -145px;
  display: none;
  max-width: 350px;
  width: 350px;
  padding: 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.primaryColor};
  box-shadow: 0px 0px 4px 0px ${({ theme }) => theme.colors.primaryColor};
  
  p {
    text-align: center;
    color: ${({ theme }) => theme.colors.primaryColor};
    text-shadow: none;
    line-height: 1.5rem;
  }

  @media (max-width: ${size.tablet}) {
    left: -90px;
  }
  @media (max-width: ${size.mobileL}) {
    width: 280px;
    left: -50px;
  }
    
`;
export const TooltipCard = styled.div`
  position: relative;
  & ${TooltipText}:hover + ${TooltipBox} {
    display: block;
  }
`;

