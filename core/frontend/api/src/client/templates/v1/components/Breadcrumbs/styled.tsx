import styled from "styled-components";
import {Colors} from "../../assets/design-set";
import breadcrumbIcon from "../../assets/img/breadcrumb-icon.svg";
import {size} from "../../styled";

export const StyledBreadcrumbs = styled.div`
  background: ${Colors.primaryColor};
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 4px rgba(0,0,0,0.25);
  width: 100%;
  padding: 0 20px;
`;

export const StyledBreadcrumbLink = styled.a`
  color: #FFFFFF;
  padding: 5px;
  line-height: 40px;
  text-decoration: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 11px;
  white-space: nowrap;
  &:hover {
    color: ${Colors.primaryLight}
  }

  @media (min-width: ${size.tablet}) {
    font-size: 16px;
    padding: 16px 26px 16px 5px;
    &:not(:last-of-type) {
      background: url(${breadcrumbIcon.src}) no-repeat right center;
    }
  }

  @media (min-width: ${size.laptop}) {
    padding: 16px 26px 16px 5px;
  }
`;
