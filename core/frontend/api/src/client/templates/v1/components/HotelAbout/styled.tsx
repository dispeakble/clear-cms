import styled from "styled-components";
import {Colors} from "../../assets/design-set";
import {size} from "../../styled";
import highlight from "../../assets/img/highlight-image.svg"
import checkIcon from "../../assets/img/check-icon.svg"


export const About = styled.div`
  display: flex;
  margin-top: 37px;
  padding: 37px 42px;
  gap: 20px;
`

export const LeftSection = styled.div``
export const HotelName = styled.div`
  font-weight: 600;
  font-size: 32px;
  line-height: 48px;
  cursor: default;
`
export const HotelRate = styled.div`

    span{
      margin-left: 6px;
      cursor: default;
    }
`
export const Description = styled.div`
p{
  font-weight: 400;
  font-size: 20px;
  line-height: 200%;
  color: rgba(0, 0, 0, 0.5);
  cursor: default;
}
  span{
    color: ${Colors.secondaryColor};
    cursor: pointer;
  }
`
export const RightSection = styled.div`
display: flex;
  flex-direction: column;
  gap:20px;
`
export const MapSection = styled.div`
  width: 485px;
  height: 298px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`


export const Highlights = styled.div`
  width: 497px;
  height: 427px;  
  background: url(${highlight.src}) no-repeat left center;
  padding: 20px 35px;
  cursor: default;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

`

export const Cardtitle =styled.div`
  font-weight: 600;
  font-size: 33px;
  line-height: 50px;
  text-align: center;
  color: ${Colors.primaryColor};
  text-shadow: 0px 4px 4px rgb(0 0 0 / 55%);
  ::after{
    border-bottom: 2px solid ${Colors.white};
    content: '';
    width: 380px;
    display: block;
    position: relative;
    left: 24px;
  }
`
export const Feature =styled.div`
li{
  display: flex;
  gap: 5px;
  font-size: 23px;
  line-height: 34px;
  color: ${Colors.white};
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.55);
  list-style: none;
}
`
export const CheckedIcon =styled.div`
  width: 26.98px;
  height: 23.51px;
  position: relative;
  top: 8px;
  background: url(${checkIcon.src}) no-repeat left center;


`