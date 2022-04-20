import styled, { createGlobalStyle } from "styled-components";
import headerBg from "../assets/img/header-bg.jpg";
import check from "../assets/img/check-sign-gold-icon.svg"
import { CustomTheme } from "../../../modules";
import Link from "next/link";

export const GlobalStyle = createGlobalStyle<{theme: CustomTheme}>`
  body, html {
    margin: 0;
    padding: 0;
    font-family: "Poppins", Arial, sans-serif, serif;
  }
`;

interface IText{
    center?: boolean;
}

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

export const TopContentWrapper = styled.div`
  width: 100%;
  background: url('${headerBg.src}') no-repeat center center ${({ theme }) => theme.colors.mainBackground};
  background-size: cover;
  height: 90px;
`;

export const StyledContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: auto 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  padding: 50px 20px;
  margin-bottom: 100px;
  gap: 40px;

  @media ${device.laptop} {
    flex-direction: row;
  }
`

export const StyledErrorImageContainer = styled.div`
  img{
    max-height: 570px;
  }
  
  &:last-child{
    display: none;
    @media ${device.laptopL} {
      flex-direction: row;
      display: flex;
    }
  }
`

export const ContentContainer = styled.div`
  max-width: 500px;
`

export const StyledHomeLink = styled.a`
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content:center;
    background: linear-gradient(180deg, #7ACD13 0%, #4F7D14 100%);
    color: ${({ theme }) => theme.colors.white};
    border-radius: 12px;
    text-decoration: none;
    text-transform: uppercase;
    border: none;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    font-weight: 700;
    cursor: pointer;
    text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
    padding: 0 20px;
    white-space: nowrap;

    &:hover {
      background: linear-gradient(180deg, #AEFF49 0%, #66AA12 100%);
      color: ${({ theme }) => theme.colors.white};
    }
`

export const StyledHeader = styled.h3`
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  text-align: center;
  font-size: 22px;
  color: #77838F;
  font-weight: 500;
  margin-bottom: 20px;
`

export const StyledInfoText = styled.h3<IText>`
  font-family: "Poppins", sans-serif;
  font-size: 30px;
  color: #FF840D;
  font-weight: 500;
  text-align: ${({center}) => center ? "center" : "start"};
`

export const StyledLinksList = styled.ul`
  margin: 48px 0;
  list-style-image: url('${check.src}');
  gap: 10px;
  display: flex;
  flex-direction: column;
`

export const StyledLinkItem = styled.li`
  margin-left: 8px;
  font-size: 18px;
  ::before {
    content: '';
    margin-left: 10px;
  }
`

export const StyledLink = styled(Link)`
  color: #000000;
  font-size: 18px;
  font-weight: 500;
  text-decoration: none;
`