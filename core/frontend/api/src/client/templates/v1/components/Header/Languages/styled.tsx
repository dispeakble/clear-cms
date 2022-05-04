import styled from "styled-components";


export const SelectedLanguage = styled.button`
  background-color: transparent;
  color: ${({theme}) => theme.colors.white};
  text-shadow: 2px 2px 2px rgba(0,0,0,0.3);
  font-size: 16px;
  border: none;
  cursor: pointer;

  &:hover ~ div {
    display: block;
  }

  white-space: nowrap;
`;

export const Container = styled.div`
  position: relative;
  display: inline-block;
`;

export const LanguagesDropdown = styled.div`
  display: none;
  position: absolute;
  background-color: ${({theme}) => theme.colors.primaryColor};
  min-width: 80px;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);

  &:hover {
    display: block;
  }

  a {
    color: ${({theme}) => theme.colors.white};
    text-shadow: 2px 2px 2px rgba(0,0,0,0.3);
    padding: 12px 16px;
    text-decoration: none;
    display: block;

    &:hover {
      background-color: ${({theme}) => theme.colors.primaryColorHover};
    }
  }
`;