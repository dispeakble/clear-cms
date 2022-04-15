import styled from "styled-components";

import { device, size } from "../../styled";

type HeaderWrapperProps = {
  className: string
}

export const HeaderWrapper = styled.header<HeaderWrapperProps>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0,0,0,0);
  position: fixed;
  z-index: 9999;
  top: 0;
  margin: 0 auto;
  padding: 20px;

  -webkit-transition: background-color 1000ms linear;
  -ms-transition: background-color 1000ms linear;
  transition: background-color 1000ms linear;

  &.fixedHeader {
    z-index: 999;
    background: ${({theme}) => theme.colors.primaryColor};
  }

  @media (max-width: ${size.laptop}) {
    padding: 0;
  }
  @media ${device.mobileS} {
    max-width: 320px;
  }
  @media ${device.mobileM} {
    max-width: 375px;
  }
  @media ${device.mobileL} {
    max-width: 400px;
  }
  @media ${device.tablet} {
    max-width: 720px;
  }
  @media ${device.laptop} {
    max-width: 900px;
  }
  @media ${device.laptopL} {
    max-width: 1280px;
  }
  @media ${device.desktop} {
    max-width: 1440px;
  }
  @media ${device.desktopL} {
    max-width: 1440px;
  }
`;

export const LogoWrapper = styled.div`
  order: 1;
  @media (max-width: ${size.laptop}) {
    order: 2;
    flex: 1;
    text-align: center;
  }
`;

export const MenuWrapper = styled.div`
  flex: 1;
  color: inherit;
  margin: 0 10px;
  order: 2;
  @media (max-width: ${size.laptop}) {
    order: 1;
    flex: none;
    margin: 0;
  }
`;

export const SearchWrapper = styled.div`
  border: 1px solid ${({theme}) => theme.colors.primaryColor};
  position: relative;
  background: url(${({theme}) => theme.icon('search')}) no-repeat 16px center #FFFFFF;
  order: 4;
  margin-left: 10px;
  @media (max-width: ${size.laptop}) {
    order: 3;
    margin: 0;
  }
`;

export const InputSearch = styled.input`
  outline: none;
  border: none;
  background: none;
  width: 50px;
  height: 50px;
  padding: 0;

  &::placeholder {
    color: transparent;
  }

  &:focus {
    padding: 8px 8px 8px 65px;
    width: 100%;
  }

  @media (min-width: ${size.laptop}) {
    padding: 8px 8px 8px 65px;

    width: 100%;
    &::placeholder {
      color: inherit;
    }
  }
`;

export const LanguagesWrapper = styled.div`
  order: 3;
  @media (max-width: ${size.laptop}) {
    order: 4;
  }
`;