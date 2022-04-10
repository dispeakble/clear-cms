import styled from "styled-components";
import { Colors } from "../../../assets/design-set";

export const HeaderContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
`;

export const HeaderWrapper = styled.header`
  width: 90%;
  margin: 0 auto;
  max-width: 1400px;
  padding: 12px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const List = styled.ul`
  list-style: none;
  display: flex;
  gap: 30px;
  margin-left: 550px;
`;

export const InputWrapper = styled.div`
  background-color: ${Colors.primaryColor};
  padding: 1px;
  position: relative;

`;
export const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 35px;
  transform: translate(-18px, -50%);
`;

export const InputSearch = styled.input`
  padding: 8px 8px 8px 65px;
  outline: none;
  border: none;
`;

export const LogoWrapper = styled.div`
  color: #fff;
  font-size: 24px;

`;