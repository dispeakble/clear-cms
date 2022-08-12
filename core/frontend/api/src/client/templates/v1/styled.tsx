import styled, { createGlobalStyle } from "styled-components";
import headerBg from "./assets/img/header-bg.jpg";
import { CustomTheme } from "../../modules";

export const GlobalStyle = createGlobalStyle<{ theme: CustomTheme }>`
  body, html {
    margin: 0;
    padding: 0;
    font-family: "Poppins", Arial, sans-serif, serif;
  }

  #__next {
    overflow: hidden;
  }

  .MuiTooltip-popper {
    z-index: 10001 !important;
  }
`;

export const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
  laptopM: "1200px",
  laptopL: "1440px",
  desktop: "1919px",
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

export const MainWrapper = styled.div<{ isOrange?: boolean }>`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({
                                                                                 isOrange,
                                                                                 theme
                                                                               }) => isOrange ? `linear-gradient(111.87deg, ${theme.colors.primaryLight} 3.23%, ${theme.colors.primaryColorHover} 98.39%)` : theme.colors.mainBackground};
`;

export const MainContentWrapper = styled.div`
  width: 100%;
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

export const Wrapper = styled.div<{ isLogin?: boolean; isBreadcrumb?: boolean }>`
  margin: 20px auto;
  
  min-height: ${({ isBreadcrumb }) => isBreadcrumb ? "auto" : "100vh"};
  border-radius: ${({ isLogin }) => isLogin ? "10px" : "0"};
  border: ${({ isLogin, theme }) => isLogin ? `3px dashed ${theme.colors.primaryColor}` : "none"};
  background: ${({ isLogin, theme }) => isLogin ? `rgb(${theme.colors.primaryColorFadedRBG})` : "none"};
  padding: 0;
  
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ isLogin }) => !isLogin && "flex-direction: column;"}
  ${({ isLogin }) => !isLogin && "width: 100%;"}

  @media ${device.tablet} {
    padding: ${({ isLogin }) => isLogin ? "20px" : "0"}; 
  }
`;

export const TopContentWrapper = styled.div`
  width: 100%;
  padding: 54px 0 57px 0;
  background: url('${headerBg.src}') no-repeat center center ${({ theme }) => theme.colors.mainBackground};
  background-size: cover;
`;
export const TopContentWrapperForFlightResults = styled.div`
  width: 100%;
  padding: 0 0 32px 0;
  background: url('${headerBg.src}') no-repeat center center ${({ theme }) => theme.colors.mainBackground};
  background-size: cover;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 300px;
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
  width: 100%;
`;

export const ContentWrapperForPackageDetail = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  @media (min-width: ${size.laptop}) {
    flex: 1 1 100%;
  }
`;


export const ServiceAndMapWrapper = styled.div`
  flex: 0 0 calc(35% - 8px);
  max-width: calc(35% - 8px);
  @media (max-width: ${size.laptopL}) {
    flex: 0 0 100%;
    max-width: 100%;
  }
`;

export const DetailWrapper = styled.div`
  flex: 0 0 65%;
  max-width: 65%;
  @media (max-width: ${size.laptopL}) {
    flex: 0 0 100%;
    max-width: 100%;
  }
`;

export const PaperWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.mainBackground};
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
  color: ${({ theme }) => theme.colors.white};
  text-shadow: 2px 2px rgba(0, 0, 0, 0.3);
`;

export const StyledWebsiteSlogan = styled.div`
  font-size: 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
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

export const BottomContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const PackageDetailMainContent = styled.div`
  width: 100%;
  padding: 0 1rem;
`;

export type BreadCrumbsProps = {
  marg?: string
}

export const BreadcrumbsContainer = styled.div<BreadCrumbsProps>`
  width: 100%;
  margin: ${(props) => props.marg || "120px 0px 0px 0px"};
  padding: 1rem;
`;


// ----------------------- for flight Results ---------------------------

export const BottomContentWrapperForFlightResults = styled.div`
  display: flex;
  margin-top: 16px;
  justify-content: center;
  padding: 20px;
  width: 100%;
  flex-direction: column;
  @media ${device.laptop} {
    flex-direction: row;
  }
`;

export const FlightResultsMainWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.mainBackground};
`;


export const HotelResultsMainContent = styled.div`
  display: flex;
  padding-left: 8px;
  justify-content: center;
  width: 100%;
  @media (max-width: ${size.laptopM}) {
    flex-wrap: wrap;
  }
`;

