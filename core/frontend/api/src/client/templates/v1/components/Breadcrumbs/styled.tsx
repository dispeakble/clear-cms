import styled from "styled-components";
import { size } from "../../styled";

export const StyledBreadcrumbs = styled.div`
  background: ${({theme}) => theme.colors.primaryColor}; 
  color: ${({theme}) => theme.colors.white};
  border-radius: 10px;
  box-shadow: 0 4px 4px rgba(0,0,0,0.25);
  width: 100%;
  padding: 0 20px;
  margin: 20px auto 0 auto;
  
`;

export const StyledBreadcrumbLink = styled.a`
  color:  ${({theme}) => theme.colors.white};
  font-weight: 500;
  padding: 5px;
  line-height: 40px;
  text-decoration: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 11px;
  white-space: nowrap;
  &:hover {
    color: ${({theme}) => theme.colors.primaryLight};
  }

  @media (min-width: ${size.tablet}) {
    font-size: 16px;
    padding: 16px 26px 16px 5px;
    &:not(:last-of-type) {
      background: url(${({theme}) => theme.icon('breadcrumb')}) no-repeat right center;
    }
  }

  @media (min-width: ${size.laptop}) {
    padding: 16px 26px 16px 5px;
  }
`;
