import styled from "styled-components";

export const StyledValuePopup = styled.div`
  position: absolute;
  z-index: 20;
  background: ${({theme}) => theme.colors.white};
  border: 1px solid ${({theme}) => theme.colors.greyBorder};
  border-radius: 10px;
  color: ${({theme}) => theme.colors.black} !important;
  padding: 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  left: 0;
  right: 0;
  user-select: none;
`;

export const StyledValue = styled.span`
  min-width: 30px;
  text-align: center;
  color: ${({theme}) => theme.colors.black};
  user-select: none;
`;

export const StyledButton = styled.button`
  border-radius: 50%;
  border: 1px solid ${({theme}) => theme.colors.primaryColor};
  cursor: pointer;
  color: ${({theme}) => theme.colors.primaryColor};
  user-select: none;
`;