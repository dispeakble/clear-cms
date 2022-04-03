import styled from "styled-components";
import {Colors, Widths, Shadows} from "../../../assets/design-set";
import HeroBG from '../../../pages/agency/assets/hero-bg.jpg'
import {Rate} from 'antd';

export const HeroWrapper = styled.div`
  background-image: url(${HeroBG.src});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: rgba(0, 0, 0, 0.2);
  background-blend-mode: overlay;
  height: 100vh;
  padding: 90px 0;
  width: auto;
`

export const HeroContainer = styled.div`
  width: 90%;
  margin: 0 auto;
  max-width: ${Widths.containerWidth};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`

export const HeroSearchBar = styled.div`
  width: ${Widths.widthMD}
`

export const HeroContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  height: 100%;
  width: ${Widths.widthMD};
`

export const HeroTitle = styled.h1`
  font-size: 80px;
  font-weight: 600;
  color: ${Colors.white};
  text-align: center;
`

export const SearchBarContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const SearchInputContainer = styled.div`
  background-color: ${Colors.white};
  position: relative;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`

export const InputSearch = styled.input`
  padding: 8px 8px 8px 65px;
  outline: none;
  border: none;
  width: 100%;
  height: 60px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`

export const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: -5px;
  transform: translate(-18px, -50%);
  cursor: pointer;
`

export const SearchSettingsContainer = styled.div`
  background-color: ${Colors.white};
  height: 100px;
  width: 100%;
  margin-top: 10px;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
  display: flex;
  padding: 12px;
  column-gap: 16px;
`

export const LeftContainer = styled.div`
  border: 2px solid #acacac;
  border-radius: 16px;
  flex: 2;
  display: flex;
  justify-content: space-around;
  align-items: center ;
`
export const StayingInfoWrapper = styled.div`
  width: 125px;
  height: 50px;
  display: flex;
  row-gap: 10px;
  justify-content: space-around;

  p {
    font-size: 12px;
    font-weight: 500;
    margin: 0px 0px 5px 0px;
    color: #333333;
  }
`

export const SearchImage = styled.img`
  height: 31px;
  width: auto;
`

export const PassengerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto 0;

  span {
    margin-left: 8px;
  }

  p {
    margin: 0;
    color: ${Colors.primaryColor};
    font-weight: 500;
    font-size: 16px;
  }

  div {
    text-align: center;
  }
`


export const PassengerChildIcon = styled(SearchImage)`
  width: auto;
  height: 18px;
`
export const ParaNumber = styled.p`
  padding-left: 20px;
  align-items: center;
  font-weight: 600;
`
export const StarIcon = styled(SearchImage)`
  width: auto;
  height: 15px;
`

export const RightContainer = styled(LeftContainer)`
  flex: 3;
`

export const PassengerDetailsWrapper = styled.div`
  cursor:pointer;
  display: flex;
`

export const CalendarView = styled.div`
  position: absolute;
  top: 50px;
  left: 0px;
  bgcolor: background.paper,

`

export const DivView = styled.div`
  position: relative;
  cursor: pointer;
  width:100%;
  justify-content: space-between;
`

export const PassangerView = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  top: 110%;
  left: 65%;
  transform: translate(-50%, -10%);
  background-color: ${Colors.white};
  box-shadow: ${Shadows.primaryShadow};
  min-width: 120px;
  padding: 10px;
`


export const CounterDiv = styled.div`
  display: flex;
  padding: 10px;
  width:100%;
  justify-content: space-between;
`
export const CounterBtn = styled.div`
  fontSize: 12px;
  background-color: ${Colors.offWhite};
  cursor: pointer;
  width:20px;
  border-radius: 100%;
  box-shadow: ${Shadows.primaryShadow};
  :hover {
    background-color:${Colors.primaryColor};
    color:${Colors.white};
  }
  

`
export const StarView = styled.div`
  position: absolute;
  top: 50px;
  left: 0px;
  width: 400px;
  height: 500px;
  background-color: ${Colors.white};

`
export const Rating = styled(Rate)`
  display: flex;
  color:${Colors.primaryColor};
  li div {
    width: initial;
  }
`

export const Passenger = styled.div`
  position: relative;
`
