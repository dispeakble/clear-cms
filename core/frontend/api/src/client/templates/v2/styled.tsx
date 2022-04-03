import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import {Colors} from "./assets/design-set";
import headerBg from './assets/img/header-bg.jpg'


export const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    background: url('${headerBg.src}') no-repeat center top ${Colors.mainBackground};
    background-size: 100%;
  }
`

export const size = {
    mobileS: '320px',
    mobileM: '375px',
    mobileL: '425px',
    tablet: '768px',
    laptop: '1024px',
    laptopL: '1440px',
    desktop: '1920px',
    desktopL: '2560px',
}

export const device = {
    mobileS: `(min-width: ${size.mobileS})`,
    mobileM: `(min-width: ${size.mobileM})`,
    mobileL: `(min-width: ${size.mobileL})`,
    tablet: `(min-width: ${size.tablet})`,
    laptop: `(min-width: ${size.laptop})`,
    laptopL: `(min-width: ${size.laptopL})`,
    desktop: `(min-width: ${size.desktop})`,
    desktopL: `(min-width: ${size.desktopL})`
}

export const MainWrapper = styled.div`
  height: 100%;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
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
`


export const StyledMiddleText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 320px;
`;

export const StyledWebsiteName = styled.div`
  font-size: 80px;
  text-align: center;
  color: #FFFFFF;
  text-shadow: 2px 2px rgba(0,0,0,0.3);
`;

export const StyledWebsiteSlogan = styled.div`
  font-size: 24px;
  text-align: center;
  color: #FFFFFF;
  text-shadow: 2px 2px rgba(0,0,0,0.3);
`;
