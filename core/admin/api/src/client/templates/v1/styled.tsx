import styled, { createGlobalStyle } from 'styled-components';
import headerBg from './assets/img/header-bg.jpg';
import { CustomTheme } from '../../modules';

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

  [data-lastpass-icon-root="true"] {
    display: none;
  }
`;

export const size = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopM: '1200px',
  laptopL: '1440px',
  desktop: '1919px',
  desktopL: '2560px',
};

export const device = {
  mobileS: `(min-width: ${size.mobileS})`,
  mobileM: `(min-width: ${size.mobileM})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopM: `(min-width: ${size.laptopM})`,
  laptopL: `(min-width: ${size.laptopL})`,
  desktop: `(min-width: ${size.desktop})`,
  desktopL: `(min-width: ${size.desktopL})`,
};

export const MainWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Wrapper = styled.div<{
  isLogin?: boolean;
  isBreadcrumb?: boolean;
}>`
  min-height: ${({ isBreadcrumb }) => (isBreadcrumb ? 'auto' : '100vh')};
  border-radius: ${({ isLogin }) => (isLogin ? '10px' : '0')};
  border: ${({ isLogin, theme }) =>
    isLogin ? `3px dashed ${theme.colors.primaryColor}` : 'none'};
  background: ${({ isLogin, theme }) =>
    isLogin ? `rgb(${theme.colors.primaryColorFadedRBG})` : 'none'};
  padding: 0;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  ${({ isLogin }) => !isLogin && 'flex-direction: column;'}
  ${({ isLogin }) => !isLogin && 'width: 100%;'} @media ${device.tablet} {
    padding: ${({ isLogin }) => (isLogin ? '20px' : '0')};
  }
`;

export const TopContentWrapper = styled.div`
  width: 100%;
  padding-top: 46px;
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
  width: 100%;
`;

export const ServiceAndMapWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (${device.tablet}) {
    flex-direction: row;
  }
  @media (${device.laptopL}) {
    flex-direction: column;
  }
`;

export const DetailWrapper = styled.div`
  flex: 1;
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

export const BottomContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (${device.laptopL}) {
    flex-direction: row;
  }
`;
