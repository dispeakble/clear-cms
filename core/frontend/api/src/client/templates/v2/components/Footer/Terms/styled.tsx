import styled from "styled-components"
import {device, size} from "../../../styled";

export const TermsContainer = styled.div`
    background: #DC6B03;
    width: 100vw;
    margin: 0;
    display: flex;
    justify-content: center;
    padding: 20px 0;
    
  
    & > div{
      width: 1440px;
      
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
    }
`

export const StyledTermsHeading = styled.h4`
  color: #FFFFFF;
  font-size:18px;
  font-weight: 600;
`

export const StyledTermsText = styled.p`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
  //readable line height
  line-height: 1.4;
`