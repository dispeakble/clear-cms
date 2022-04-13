import styled from "styled-components";
import {size} from "../../styled";
import highlight from "../../assets/img/highlight-image.svg"
import hotel1 from "../../assets/img/hotels/small/hotel1.jpg"
import checkIcon from "../../assets/img/check-icon.svg"


export const About = styled.div`
  margin-top: 37px;
  @media (min-width: ${size.laptopL}) {
    display: flex;
    gap: 20px;
    padding: 37px 42px;
  }
`

export const LeftSection = styled.div`
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  @media only screen and (max-width:${size.tablet}){
    padding:10px;
  }
`
export const HotelName = styled.div`
  font-weight: 600;
  font-size: 32px;
  line-height: 48px;
  cursor: default;
`
export const HotelRate = styled.div`

  span {
    margin-left: 6px;
    cursor: default;
  }
`
export const Description = styled.div`
  p {
    font-weight: 400;
    font-size: 20px;
    line-height: 40px;
    color: rgba(0, 0, 0, 0.5);
    cursor: default;
  }

  span {
    font-weight: 500;
    font-size: 20px;
    padding-left: 6px;
    color: ${({theme}) => theme.colors.secondaryColor};
    cursor: pointer;
    :hover{
      color: ${({theme}) => theme.colors.primaryColor};
    }
  }
`
export const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media only screen and (max-width:${size.tablet}){
    padding:10px;
    
  }
`
export const MapSection = styled.div`
  width: 100%;
  height: 298px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  div > div > div > div{
    border-radius: 10px;
  }
  @media (min-width: ${size.laptopL}) {
    width: 485px;
    border-radius: 10px;
  }
`


export const Highlights = styled.div`
  width: 100%;
  height: 427px;
  background: url(${hotel1.src}) no-repeat center center;
  background-size: cover;
  border-radius: 20px;
  padding: 20px 35px;
  cursor: default;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  @media (min-width: ${size.laptopL}) {
    width: 497px;
  }
`

export const Cardtitle = styled.div`
  font-weight: 600;
  font-size: 33px;
  line-height: 50px;
  text-align: center;
  color: ${({theme}) => theme.colors.primaryColor};
  text-shadow: 0px 4px 4px rgb(0 0 0 / 55%);
  @media only screen and (max-width:${size.tablet}){
    margin-bottom: 10px;
    line-height:1.1em;
  }
  
  ::after {
    border-bottom: 2px solid ${({theme}) => theme.colors.white};
    content: '';
    width: 90%;
    display: block;
    position: relative;
    left: 24px;
    @media only screen and (max-width:${size.tablet}){
      width: 80%;
      top: 5px;
    }
  }
`
export const Feature = styled.div`
  li {
    display: flex;
    gap: 5px;
    font-size: 23px;
    line-height: 34px;
    color: ${({theme}) => theme.colors.white};
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.55);
    list-style: none;
  }
`
export const CheckedIcon = styled.div`
  width: 26.98px;
  height: 23.51px;
  position: relative;
  top: 8px;
  background: url(${checkIcon.src}) no-repeat left center;


`