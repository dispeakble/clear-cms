import styled, { createGlobalStyle } from "styled-components";
import headerBg from "./assets/img/header-bg.jpg";
import { CustomTheme } from "../../modules";

export const GlobalStyle = createGlobalStyle<{theme: CustomTheme}>`
  body, html {
    margin: 0;
    padding: 0;
    font-family: "Poppins", Arial, sans-serif, serif;
  }
`;

export const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
  laptopL: "1440px",
  desktop: "1920px",
  desktopL: "2560px"
};

export const device = {
  mobileS: `(min-width: ${size.mobileS})`,
  mobileM: `(min-width: ${size.mobileM})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopL: `(min-width: ${size.laptopL})`,
  desktop: `(min-width: ${size.desktop})`,
  desktopL: `(min-width: ${size.desktopL})`
};

export const MainWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TopContentWrapper = styled.div`
  width: 100%;
  background: url('${headerBg.src}') no-repeat center center ${({ theme }) => theme.colors.mainBackground};
  background-size: cover;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 320px;
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

export const PaperWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.mainBackground};
`;

export const StyledContentWrapper = styled.div`
  width: 100%;
  margin: 95px auto 0;
  background: ${({theme}) => theme.colors.offWhite};
  @media (min-width: ${size.tablet}) {
    padding: 0 40px;
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
  text-shadow: 2px 2px rgba(0, 0, 0, 0.3);
`;

export const StyledWebsiteSlogan = styled.div`
  font-size: 24px;
  text-align: center;
  color: #FFFFFF;
  text-shadow: 2px 2px rgba(0, 0, 0, 0.3);
`;

/*
export const StyledTermsOfUse = styled.div`
  background: ${({theme}) => theme.colors.primaryColor};
  color: ${({theme}) => theme.colors.white};
  line-height: 200%;
  padding: 10px;
  text-align: justify;
  @media (min-width: ${size.tablet}) {
    padding: 20px 90px;

`;*/
