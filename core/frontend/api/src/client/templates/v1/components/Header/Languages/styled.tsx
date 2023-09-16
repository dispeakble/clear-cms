import styled from "styled-components";

export const LanguagesDropdown = styled.div`
  display: none;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.primaryColor};
  box-shadow: 0 10px 10px -4px rgba(0,0,0,0.3);
  min-width: 60px;
  z-index: 1;

  &:hover {
    display: block;
  }

  a {
    color: ${({ theme }) => theme.colors.white};
    text-shadow: 2px 2px 2px rgba(0,0,0,0.3);
    padding: 0 16px;
    text-decoration: none;
    display: block;
    height: 52px;
    line-height: 52px;
    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryColorHover};
    }
  }
`;

export const SelectedLanguage = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.white};
  text-shadow: 2px 2px 2px rgba(0,0,0,0.3);
  font-size: 16px;
  border: none;
  cursor: pointer;
  height: 52px;
  line-height: 52px;

  &:hover ~ ${LanguagesDropdown} {
    display: block;
  }

  white-space: nowrap;
`;

export const Container = styled.div`
  position: relative;
  display: inline-block;
`;
