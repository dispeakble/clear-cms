import styled from "styled-components";


export const SelectedLanguage = styled.button`
  background-color: transparent;
  color: white;
  font-size: 16px;
  border: none;
  cursor: pointer;

  &:hover ~ div {
    display: block;
  }
`;

export const Container = styled.div`
  position: relative;
  display: inline-block;
`;

export const LanguagesDropdown = styled.div`
  display: none;
  position: absolute;
  background-color: #333;
  min-width: 80px;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);

  &:hover {
    display: block;
  }

  a {
    color: white;
    padding: 12px 16px;
    text-decoration: none;
    display: block;

  }
`;