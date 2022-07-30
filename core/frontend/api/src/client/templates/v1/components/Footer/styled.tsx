import styled from "styled-components";
import {device, size} from "../../styled";

export const FooterWrapper = styled.footer`
  display: flex;
  flex-direction: column;
  width: 100%;

  & > div {
    flex: 1;
  }

  background: ${({theme}) => theme.colors.mainBackground};
  line-height: 200%;
  font-size: 16px;
  color: ${({theme}) => theme.colors.footerLinks};

  & a {
    color: ${({theme}) => theme.colors.footerLinks};

    &:hover {
      text-decoration: underline;
    }
  }

  padding: 40px 0;

  @media (min-width: ${size.tablet}) {
    flex-direction: row;
    padding: 20px;
  }
  
  @media (min-width: ${size.laptopL}) {
    font-size: 24px;
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

export const StyledNewsletterTitle = styled.div`
`;

export const StyledNewsletterForm = styled.div`
  margin-top: 10px;
  border: 1px solid ${({theme}) => theme.colors.primaryColor};
  display: flex;
  border-radius: 12px;

  & input, & button {
    margin: 0;
    border: none;
    line-height: 54px;
    padding: 0 20px;
  }

  & input {
    border-radius: 11px 0 0 11px;
    flex: 1;
    width: 190px;
    line-height: 60px;

    &::placeholder {
      font-size: 16px;
    }
  }

  & button {
    border-radius: 0 10px 10px 0;
    cursor: pointer;
    background: ${({theme}) => theme.colors.primaryColor};
    color: ${({theme}) => theme.colors.white};

    &:hover {
      background: ${({theme}) => theme.colors.primaryColorHover};
    }
  }
`;