import styled from "styled-components";
import {Colors} from "../../assets/design-set";

export const StyledBreadcrumbs = styled.div`
  padding: 0 20px;
  background: ${Colors.primaryColor};
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 4px rgba(0,0,0,0.25);
`;

export const StyledBreadcrumbLink = styled.a`
  color: #FFFFFF;
  font-size: 16px;
  padding: 16px;
  line-height: 40px;
  text-decoration: none;
  background-color: transparent;
  margin: 0 27px;
  cursor: pointer;
  &:hover {
    color: ${Colors.primaryLight}
  }
`;
