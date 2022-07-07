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
  top: 69px;
  user-select: none;
  &.childrenAges {
    top: 114px;
    flex-direction: column;
  }
`;

export const StyledValuePopupList = styled.div`
  padding-bottom: 10px;
  width: 100%;
`;

export const StyledValuePopupControl = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const StyledValue = styled.span`
  min-width: 30px;
  text-align: center;
  color: ${({theme}) => theme.colors.black};
  user-select: none;
`;

export const StyledButton = styled.button`
  border-radius: 50%;
  width: 24px;
  height: 24px;
  border: none;
  background: ${({theme}) => theme.colors.primaryColor};
  cursor: pointer;
  color: ${({theme}) => theme.colors.white};
  user-select: none;
  &:hover {
    background: ${({theme}) => theme.colors.primaryColorHover};
  }
`;

export const StyledAgeLabel = styled.div`
  user-select: none;
  color: rgba(0,0,0,0.5);
  font-size: 12px;
  white-space: nowrap;
`;