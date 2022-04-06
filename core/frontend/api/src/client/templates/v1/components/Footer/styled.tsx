import styled from "styled-components"
import {device, size} from "../../styled";
import Link from "next/link"

export const FooterContainer = styled.div`
    background: #FFFFFF;
    width: 100vw;
    margin: 0;
    display: flex;
    justify-content: center;
    padding: 40px 0;
    
  
    & > div{
      width: 1440px;
      
      > div{
        display: flex;
        justify-content: space-between;
        
        &:first-child{
          margin-bottom: 40px;
        }
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
    }
`

export const StyledSocialLink = styled(Link)`
    a{
      display: flex;
      align-items: center;
      justify-content: center;
    }
`

export const StyledFooterList = styled.ul`
  padding: 0;
    margin-top: 0;
    padding-top: 0;
    list-style: none;
`

export const StyledFooterListItem = styled.li`
  margin-bottom: 10px;
    a{
      color: #868484;
      font-size: 18px;
      font-weight: 500;
    }
  
`

export const StyledFooterSearchContainer = styled.div`
  h3{
    color: #868484;
    font-weight: 600;
    margin-top: 0;
  }
`

export const CustomInputStyled = styled.div`
  position: relative;
  display: flex;
  height: 60px;
  max-height: 60px;
  border-radius: 5px;
  border: 1px solid #DC6B03;
  overflow: hidden;
  input{
    height: 60px;
    max-height: 60px;
    border: none;
    padding: 10px 30px;
    display: flex;
    align-items:center;
    outline: none;
    font-size: 18px;
    background: none;
  }
  button{
    cursor: pointer;
    height: inherit;
    border: none;
    height: 60px;
    max-height: 60px;
    width: 90px;
    color: #F5F5F5;
    background: #DC6B03;
    font-size: 18px;
  }
`