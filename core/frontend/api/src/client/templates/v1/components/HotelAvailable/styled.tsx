import styled from "styled-components";
import {size} from "../../styled";
import refreshIcon from "../../assets/img/refresh-icon.svg"
import orgInfoIcon from "../../assets/img/orginfo-icon.svg"
import bedroomIcon from "../../assets/img/bedroom-icon.svg"
import dropdownIcon from "../../assets/img/dropdown-icon.svg"
import dropLightIcon from "../../assets/img/DropLight-icon.svg"
import dropDarkIcon from "../../assets/img/DropDark-icon.svg"



import {Shadows} from "../../../../assets/design-set";


export const QueryTitle = styled.div`
  font-weight: 600;
  font-size: 22px;
  line-height: 33px;
  color: #${({theme}) => theme.colors.black};
  margin-bottom: 10px;
  @media only screen and (max-width: ${size.laptop}) {
    text-align: center;
    padding: 1rem;
  }
`

export const Wrapper = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  cursor: default;
`

export const Modifier = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 240px;
  @media only screen and (max-width: ${size.laptopL}) {
    gap: 20px;
  }
  @media only screen and (max-width: ${size.laptop}) {
    flex-direction: column;
    align-items: center;
  }


`

export const HotelCheck = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;
  @media only screen and (max-width: ${size.tablet}) {
    flex-direction: column;
  }

`
export const LeftSide = styled.div`
  border: 2px solid ${({theme}) => theme.colors.borderOutline};
  border-radius: 16px;
  flex: 2;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 5px 0 5px;
  background: ${({theme}) => theme.colors.white};
`
export const RightSide = styled.div`
  border: 2px solid ${({theme}) => theme.colors.borderOutline};
  border-radius: 16px;
  flex: 5;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 10px 0 10px;
  background: ${({theme}) => theme.colors.white};
`
export const DropdownIcon = styled.div`
  width: 24px;
  position: relative;
  top: 6px;
  left: 0;
  background: url(${dropdownIcon.src}) no-repeat left center;

`
export const RefreshPrice = styled.div`
  position: relative;

  button {
    height: 66px;
    background: linear-gradient(180deg, #7CCF13 0%, #639722 100%);
    color: ${({theme}) => theme.colors.white};
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    font-size: 28px;
    align-items: center;
    cursor: pointer;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    padding: 0 40px;
    display: flex;
    justify-content: center;

    :hover {
      background: linear-gradient(180deg, #ABFB47 0%, #68AC14 100%);
    }
    
    @media (min-width: ${size.laptop}){
      padding: 0 20px;
      font-size: 22px;
    }
    @media (min-width: ${size.laptopL}){
      padding: 0 40px;
      font-size: 28px;
    }
  }
`
export const RefreshIcon = styled.div`
  margin-right: 10px;
  width: 24px;
  height: 24px;
  background: url(${refreshIcon.src}) no-repeat left center;
  cursor: pointer;
`

export const RoomTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
`
export const TableHead = styled.div`
  display: flex;
  & > div {
    flex: 1;
  }
  justify-content: space-evenly;
  width: 100%;
  height: 65px;
  font-weight: 500;
  font-size: 22px;
  color: white;
  background: linear-gradient(180deg, #9B9A9A 0%, #808080 100%);
  border-radius: 10px;
  align-items: center;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  padding: 0 10px;
  @media (max-width: ${size.tablet}) {
    font-size: 16px;
  }
  @media (max-width: ${size.tablet}) {
    display: none;  
  }
  
`
export const RoomType = styled.div`
  display: flex;
  justify-content: center;

`
export const Meal = styled.div`
  display: flex;
  justify-content: center;
`
export const SelectRoom = styled.div`
  display: flex;
  justify-content: center;
`
export const Price = styled.div`
  display: flex;
  justify-content: center;
`

export const BookNow = styled.div`

`
export const TableBody = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  border: 2px solid ${({theme}) => theme.colors.borderOutline};
  border-radius: 16px;
  background-color: ${({theme}) => theme.colors.white};
  font-size: 20px;
  padding: 10px;
  gap: 10px;
  @media (max-width: ${size.laptop}) {
    font-size: 14px;
  }
  & > div {
    flex: 1;
  }
`
export const OrgInfoIcon = styled.div`
  margin: 5px 10px;
  width: 22px;
  height: 22px;
  background: url(${orgInfoIcon.src}) no-repeat left center;

  :hover {
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    cursor: pointer;
  }

  @media (max-width: ${size.laptopL}) {
    margin: 5px 10px 0 0;

  }
  @media (max-width: ${size.laptopL}) {
    margin: 5px 5px 0 0;
    width: 28px;

  }



`
export const ColumnOne = styled.div`
  display: flex;
  font-weight: 500;
  line-height: 30px;
  color: ${({theme}) => theme.colors.black};
  cursor: default;
  white-space: nowrap;
`
export const ColumnTwo = styled.div`
  font-weight: 500;
  line-height: 30px;
  color: ${({theme}) => theme.colors.black};
  cursor: default;
  white-space: nowrap;
`
export const ColumnThree = styled.div`
  position: relative;
  display: flex;
  justify-content: space-around;
  width: 192px;
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #DBDBDB;
  box-sizing: border-box;
  border-radius: 26px;
  
  ul{
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;

    input{
      position: absolute;
      top: 50%;
      left: 61%;
      width: 42%;
      transform: translate(-50%,-50%);
      z-index: 1;
      border: none;
      outline: none;
      background: none;
      color: rgba(0, 0, 0, 0.66);;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      cursor: pointer;
      text-align: left;
      transition: all 500ms ease-in-out;
      :focus{
        outline: none;
        border: none;
      }
    }
    
    li{
      list-style-type: none;
    }
  }


  @media (max-width: ${size.laptop}) {
    width: 108px;
    gap: 4px;
  }


`
export const LeftIcon = styled.div`
  background: url(${bedroomIcon.src}) no-repeat 8px center ${({theme}) => theme.colors.white};
  width: 36px;
  height: 37px;
  position: relative;
  left: 7px;
  align-items: center;

`;
export const RightIcon = styled.div`
  display: flex;
  flex-direction: column;
  
`;
export const OptionRightIcon =styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  top: -7px;
`;
export const TopUp = styled.div`
  width: 10px;
  height: 18px;
  display: flex;
  align-items: center;
  background: url(${dropLightIcon.src}) no-repeat left center;
  position: relative;
  top: 10px;
  :hover{
    background: url(${dropDarkIcon.src}) no-repeat left center;

  }
`;

export const InnerRoomList = styled.div`
  position: absolute;
  top: 39px;
  cursor: pointer;
  width: 100%;
  background: white;
  border-radius: 30px;
  left: 0px;
  border: 1px solid ${({theme}) => theme.colors.borderOutline};
  visibility: hidden;
  opacity: 0;
  transition: all 100ms ease-in-out;
  z-index: 1;

  li{ 
    position: relative;
    list-style-type: none;
    color: rgba(107, 101, 101, 0.63);
    display: flex;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    height: 40px;
    transition: all 100ms ease-in-out;
    display: flex;
    justify-content: space-around;
    align-items: center;
    :first-child{
      border-top-left-radius: 30px;
      border-top-right-radius: 30px;

    }
    :last-child{
      border-bottom-left-radius: 30px;
      border-Bottom-right-radius: 30px;

    }
    :hover{
      background: ${({theme}) => theme.colors.white};
      border: 1px solid ${({theme}) => theme.colors.borderOutline};
      filter: drop-shadow(1px -2px 4px rgba(0,0,0,0.17));
      color: ${({theme}) => theme.colors.gray};
      border-radius: 30px;
      transition: all 100ms ease-in-out;

    }
  }
`;
export const ColumnFour = styled.div`
  font-weight: bold;
  line-height: 30px;
  color: ${({theme}) => theme.colors.secondaryColor};
  cursor: default;
  white-space: nowrap;
  font-size: 27px;
  display: flex;
  justify-content: center;
  @media (max-width: ${size.tablet}) {
    font-size: 24px;
  }
`

export const ColumnFive = styled.div`
  font-weight: 500;
  line-height: 30px;
  color: ${({theme}) => theme.colors.black};
  width: 210px;
  @media (max-width: ${size.tablet}) {
    width: 100%;
    height: 50px;
    padding: 0;
    flex: 0 !important;
  }
  button {
    width: 100%;
    height: 50px;
    background: linear-gradient(180deg, #FFAC5C 0%, #FF840D 100%);
    color: ${({theme}) => theme.colors.white};
    border-radius: 12px;
    border: none;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    font-weight: 700;
    align-items: center;
    text-align: center;
    cursor: pointer;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    padding: 0 20px;
    white-space: nowrap;

    &:hover {
      background: linear-gradient(180deg, #FDB773 0%, #E19046 100%);
    }

  }

`;

export const ColumnBreak = styled.div`
  width: 100%;
  display: none;
  @media (max-width: ${size.tablet}) {
    display: block;
    flex: 0 !important;
  }
`;
export const BedroomIcon = styled.div`
  margin: 9px 0 0 25px;
  width: 18px;
  height: 20px;;
  background: url(${bedroomIcon.src}) no-repeat left center;
  @media (max-width: ${size.laptopL}) {
    margin: 9px 0 0 9px;
  }

`
export const RowView = styled.div`
  //display: flex;
  //flex-direction: column;
  //gap: 36px;
`

export const GuestNumber = styled.div`
  padding-left: 0px;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-weight: 600;
  margin: 0;
  color: ${({theme}) => theme.colors.primaryColor};
  font-weight: 500;
  font-size: 16px;
`
export const DivView = styled.div`
  position: relative;
  cursor: pointer;
  width: 100%;
  justify-content: space-between;
`

export const CalendarView = styled.div`
  position: absolute;
  top: 50px;
  left: 0px;
  bgcolor: background .paper;
  z-index: 1;

`

export const PassangerView = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  top: 120%;
  left: 50%;
  transform: translate(-50%, -10%);
  background-color: ${({theme}) => theme.colors.white};
  box-shadow: ${Shadows.primaryShadow};
  min-width: 120px;
  padding: 10px;
  z-index: 1;
  border-radius: 25px;
  border: 1px solid ${({theme}) => theme.colors.borderOutline};
`


export const CounterDiv = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
  justify-content: space-between;
`
export const CounterBtn = styled.div`
  fontSize: 12px;
  background-color: ${({theme}) => theme.colors.offWhite};
  cursor: pointer;
  width: 20px;
  border-radius: 100%;
  box-shadow: ${Shadows.primaryShadow};

  :hover {
    background-color: ${({theme}) => theme.colors.primaryColor};
    color: ${({theme}) => theme.colors.white};
  }
`
export const SpanDiv = styled.span`
  font-weight: bold;
`

export const Passenger = styled.div`
  position: relative;
  cursor: default;
`

export const CheckBg = styled.div`
  cursor: default;
`
export const CheckTitle = styled.div`
  color: ${({theme}) => theme.colors.gray};
  font-weight: 500;
`

export const PassengerWrapper = styled.div`

`;

export const StayingInfoWrapper = styled.div`

`;

export const PassengerDetailsWrapper = styled.div`

`;