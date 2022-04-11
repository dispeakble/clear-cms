import styled from "styled-components";
import { Colors } from "../../assets/design-set";

export const StyledValuePopup = styled.div`
  position: absolute;
  z-index: 20;
  background: ${Colors.white};
  border: 1px solid ${Colors.greyBorder};
  border-radius: 10px;
  color: ${Colors.black} !important;
  padding: 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  left: 0;
  right: 0;
`;

export const StyledValue = styled.span`
  min-width: 30px;
  text-align: center;
  color: ${Colors.black};
`;

export const StyledButton = styled.button`
  border-radius: 50%;
  border: 1px solid ${Colors.primaryColor};
  cursor: pointer;
  color: ${Colors.primaryColor};
`;