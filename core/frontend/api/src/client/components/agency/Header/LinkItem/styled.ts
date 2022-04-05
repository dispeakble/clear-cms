import styled from "styled-components";
import { Colors } from "../../../../assets/design-set";

export const Item = styled.li`
  padding: 4px 0px;
  font-size: 24px;
  letter-spacing: 0.5px;
`;

export const LinkItem = styled.a`
  color:#fff;
  transition: color 0.1s ease-in-out;
  :hover {
    color: ${Colors.primaryColor};
  }
`;