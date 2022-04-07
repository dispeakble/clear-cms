import styled from "styled-components";
import {Colors} from "../../assets/design-set";
import {size} from "../../styled";
import refreshIcon from "../../assets/img/refresh-icon.svg"
import orgInfoIcon from "../../assets/img/orginfo-icon.svg"
import bedroomIcon from "../../assets/img/bedroom-icon.svg"
import dropdownIcon from "../../assets/img/dropdown-icon.svg"
import {Shadows} from "../../../../assets/design-set";
import {Rate} from "antd";


export const QueryTitle = styled.div`
  font-weight: 600;
  font-size: 22px;
  line-height: 33px;
  color: #${Colors.black};
  margin-bottom: 10px;
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
  gap: 20px;
`

export const HotelCheck = styled.div`
  flex: 1;
  display: flex;
  gap: 20px
`
export const LeftSide = styled.div`
  border: 2px solid ${Colors.borderOutline};
  border-radius: 16px;
  flex: 2;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 5px 0 5px;
  background: ${Colors.white};
`
export const RightSide = styled.div`
  border: 2px solid ${Colors.borderOutline};
  border-radius: 16px;
  flex: 5;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 10px 0 10px;
  background: ${Colors.white};
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
    color: ${Colors.white};
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    font-size: 17px;
    align-items: center;
    cursor: pointer;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    padding: 0 40px;
    display: flex;
    justify-content: center;
    :hover{
      background: linear-gradient(180deg, #7CCF13 100%, #639722 0%);
    }
    @media (min-width: ${size.laptopL}) {
      font-size: 24px;
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

export const RoomTable = styled.div``
export const TableHead = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 65px;
  background: linear-gradient(180deg, #9B9A9A 0%, #808080 100%);
  border-radius: 10px;
  margin-bottom: 25px;
  align-items: center;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

`
export const RoomType = styled.div`
  font-weight: 500;
  font-size: 24px;
  line-height: 36px;
  text-transform: capitalize;
  color: ${Colors.white};
  cursor: default;
`
export const Meal = styled.div`
  font-weight: 500;
  font-size: 24px;
  line-height: 36px;
  text-transform: capitalize;
  color: ${Colors.white};
  cursor: default;
`
export const SelectRoom = styled.div`
  font-weight: 500;
  font-size: 24px;
  line-height: 36px;
  text-transform: capitalize;
  color: ${Colors.white};
  cursor: default;
`
export const Price = styled.div`
  font-weight: 500;
  width: 100px;
  font-size: 24px;
  line-height: 36px;
  text-transform: capitalize;
  color: ${Colors.white};
  cursor: default;
`

export const BookNow = styled.div``
export const TableBody = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 84px;
  border: 2px solid ${Colors.borderOutline};
  border-radius: 16px;
  background-color: ${Colors.white};
`
export const OrgInfoIcon = styled.div`
  margin: 5px 10px;
  width: 22px;
  height: 22px;
  background: url(${orgInfoIcon.src}) no-repeat left center;
  :hover{
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    cursor: pointer;
  }

`
export const ColumnOne = styled.div`
  display: flex;
  font-weight: 500;
  font-size: 1vw;
  line-height: 30px;
  color: ${Colors.black};
  cursor: default;
`
export const ColumnTwo = styled.div`
  font-weight: 500;
  font-size: 1vw;
  line-height: 30px;
  color: ${Colors.black};
  cursor: default;
`
export const ColumnThree = styled.div`
  width: 200px;
  border: 1px solid ${Colors.borderOutline};
  display: flex;
  position: relative;
  font-weight: 500;
  font-size: 1vw;
  line-height: 30px;
  color: ${Colors.black};
  height: 40px;
  background: ${Colors.white};
  box-sizing: border-box;
  box-shadow: 0px 4px 7px rgb(255 255 255 / 25%);
  border-radius: 26px;
  gap: 15px;
  cursor: default;
  input {
    width: 60%;
    border: none;
    height: 37px;
    background: ${Colors.white};
    font-size: 16px;
    line-height: 38px;
    color: ${Colors.gray};
  }
`
export const ColumnFour = styled.div`
  font-weight: bold;
  font-size: 1vw;
  line-height: 30px;
  color: ${Colors.secondaryColor};
  min-width: 100px;
  cursor: default;
`

export const ColumnFive = styled.div`
  font-weight: 500;
  font-size: 20px;
  line-height: 30px;
  color: ${Colors.black};

  button {
    width: 210px;
    height: 50px;
    background: linear-gradient(180deg, #FFAC5C 0%, #FF840D 100%);
    color: ${Colors.white};
    border-radius: 12px;
    border: none;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    font-size: 20px;
    font-weight: 700;
    align-items: center;
    text-align: center;
    cursor: pointer;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    padding: 0 46px 0 65px;
    :hover{
      color: ${Colors.primaryLight};
    }
  }
`
export const BedroomIcon = styled.div`
  margin: 9px 0 0 25px;
  width: 18px;
  height: 20px;;
  background: url(${bedroomIcon.src}) no-repeat left center;

`
export const RowView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
`

export const GuestNumber = styled.div`
  padding-left: 0px;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-weight: 600;
  margin: 0;
  color: ${Colors.primaryColor};
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
  top: 110%;
  left: 65%;
  transform: translate(-50%, -10%);
  background-color: ${Colors.white};
  box-shadow: ${Shadows.primaryShadow};
  min-width: 120px;
  padding: 10px;
  z-index: 1;
`


export const CounterDiv = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
  justify-content: space-between;
`
export const CounterBtn = styled.div`
  fontSize: 12px;
  background-color: ${Colors.offWhite};
  cursor: pointer;
  width: 20px;
  border-radius: 100%;
  box-shadow: ${Shadows.primaryShadow};

  :hover {
    background-color: ${Colors.primaryColor};
    color: ${Colors.white};
  }
`
export const SpanDiv = styled.span`
  font-weight: bold;
`

export const Passenger = styled.div`
  position: relative;
  cursor: default;
`

export const CheckBg =styled.div`
cursor: default;
`
export const CheckTitle = styled.div`
  color: ${Colors.gray};
  font-weight: 500;
`