import styled from 'styled-components'
import headerBg from './assets/img/header-bg.jpg'
import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
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

export const SearchWrapper = styled.div`
  background: url(${headerBg.src}) no-repeat center top;
  background-size: cover;
  min-height: 400px;
  padding: 114px 20px 0;
`

export const MainWrapper = styled.div`
  height: 100%;
  width: 100%;
  margin: 0 auto;
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
  
  body {
    margin: 0;
  }
`