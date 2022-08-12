import styled from "styled-components";
import { size } from "../../styled";
import Calendar from "react-calendar";
import { Shadows } from "../../../../../assets/design-set";
import { device } from "../../../styled";

export const QueryTitle = styled.div`
  font-weight: 600;
  font-size: 22px;
  line-height: 33px;
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 10px;
  @media only screen and (max-width: ${size.laptop}) {
    text-align: center;
    padding: 1rem;
  }
`;
export const CheckInSvg = styled.div`
  background: url(${({ theme }) => theme.icon("checkIn")}) no-repeat left center;
  cursor: pointer;
  width: 20px;
  height: 31px;
`;
export const ChildIcon = styled.div`
  background: url(${({ theme }) => theme.icon("child")}) no-repeat left center;
  cursor: pointer;
  width: 20px;
`;
export const CheckOutSvg = styled.div`
  background: url(${({ theme }) => theme.icon("checkOut")}) no-repeat left center;
  cursor: pointer;
  width: 20px;
  height: 31px;
`;
export const Wrapper = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  width: 100%;
`;
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
`;
export const HotelCheck = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;
  width: 100%;
  @media only screen and (max-width: ${size.tablet}) {
    flex-direction: column;
  }
  @media (min-width: ${size.laptop}) {
    gap: 10px;
  }
`;
export const LeftSide = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.borderOutline};
  border-radius: 16px;
  flex: 1 1 50%;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
`;
export const RightSide = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.borderOutline};
  border-radius: 16px;
  flex: 1 1 50%;
  display: flex;
  background: ${({ theme }) => theme.colors.white};
  align-items: center;
  background: #fff;
`;

export const StyledSearchOptionsGroup = styled.div`
  cursor: pointer !important;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  flex: 1;
`;


export const StyledPrimaryValue = styled.div`
  font-weight: bold;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primaryColor};
`;
export const StyledPerson = styled.label`
  cursor: pointer;
  user-select: none;
  display: inline-block;
  padding: 10px 0 10px 10px;
  position: relative;
  background: url(${({ theme }) => theme.icon("person")}) no-repeat 50px 12px;

  &:hover {
    background-color: #F6F0DF;
    border-radius: 14px 0px 0px 14px;
  }

  @media ${device.laptop} {
    background-position: 40px 12px;
  }

  @media ${device.laptopL} {
    background-position: 45px 12px;
  }
  @media ${device.desktop} {
    background-position: 70px 12px;
  }
`;


export const StyledChild = styled.label`
  cursor: pointer;
  user-select: none;
  display: inline-block;
  padding: 10px 0 10px 10px;
  position: relative;
  background: url(${({ theme }) => theme.icon("child")}) no-repeat 35px 12px;

  &:hover {
    background-color: #F6F0DF;
    border-radius: 0px 14px 14px 0px;
  }

  @media (max-width: ${size.mobileL}) {
    border-radius: 0 8px 0 0;
  }
  @media ${device.laptop} {
    background-position: 25px 12px;
  }

  @media ${device.desktop} {
    background-position: 50px 12px;
  }
`;

export const StyledCenterLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 30;
`;

export const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  color: #505050;
  font-size: inherit;
  white-space: nowrap;

  & > span {
    padding-right: 10px !important;
  }
`;


export const Overlay = styled.a`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 15;
`;


export const DropdownIcon = styled.div`
  width: 20px;
  height: 12px;
  position: relative;
  top: 5px;
  left: 5px;
  background: url(${({ theme }) => theme.icon("dropdown")}) no-repeat left center;
`;
export const RefreshPrice = styled.div`
  position: relative;

  button {
    height: 66px;
    background: linear-gradient(180deg, #7CCF13 0%, #639722 100%);
    color: ${({ theme }) => theme.colors.white};
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    font-size: 28px;
    align-items: center;
    cursor: pointer;
    text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
    padding: 0 40px;
    display: flex;
    justify-content: center;

    :hover {
      background: linear-gradient(180deg, #ABFB47 0%, #68AC14 100%);
    }

    @media (min-width: ${size.laptop}) {
      padding: 0 20px;
      font-size: 22px;
    }
    @media (min-width: ${size.laptopL}) {
      padding: 0 40px;
      font-size: 28px;
    }
  }
`;
export const RefreshIcon = styled.div`
  margin-right: 10px;
  width: 24px;
  height: 24px;
  background: url(${({ theme }) => theme.icon("refresh")}) no-repeat left center;
  cursor: pointer;
`;
export const RoomTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
`;
export const TableHead = styled.div`
  display: none;

  & > div {
    text-align: left;
  }

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
  @media (min-width: ${size.laptop}) {
    display: flex;
  }
`;
export const RoomType = styled.div`
  display: flex;
  padding-left: 35px;
  min-width: 240px;
  @media (min-width: ${size.laptopL}) {
    min-width: 300px;
  }
  @media (min-width: ${size.desktop}) {
    min-width: 345px;
  }
`;
export const Meal = styled.div`
  display: flex;
  min-width: 175px;
  @media (min-width: ${size.laptopL}) {
    min-width: 220px;
  }
  @media (min-width: ${size.desktop}) {
    min-width: 236px;
  }
`;
export const SelectRoom = styled.div`
  display: flex;
  min-width: 245px;
  @media (min-width: ${size.laptopL}) {
    min-width: 336px;
  }
  @media (min-width: ${size.desktop}) {
    min-width: 390px;
  }

`;
export const Price = styled.div`
  display: flex;
  min-width: 100px;
  flex: 0 !important;
  @media (min-width: ${size.laptopL}) {
    min-width: 100px;
  }
`;
export const BookNow = styled.div`
  @media (max-width: ${size.laptop}) {
    display: none;
  }
`;
export const TableBody = styled.div`
  display: grid;
  grid-gap: 30px;
  /*grid-template-columns: repeat(auto-fill, minmax(min-content, 1fr));*/
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.borderOutline};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.white};
  font-size: 20px;
  padding: 10px;
  gap: 10px;
  @media (max-width: ${size.laptop}) {
    font-size: 14.6px;
  }

  & > div {
    flex: 1;
  }
`;
export const OrgInfoIcon = styled.div`
  margin: 5px 10px;
  width: 22px;
  height: 22px;
  background: url(${({ theme }) => theme.icon("orginfo")}) no-repeat left center;

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
`;
export const ColumnOne = styled.div`
  display: flex;
  font-weight: 500;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.black};
  white-space: nowrap;
  @media (min-width: ${size.laptop}) {
    font-size: 16px;
  }
  @media (max-width: ${size.mobileM}) {
    justify-content: center;
  }
`;
export const ColumnTwo = styled.div`
  font-weight: 500;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.black};
  white-space: nowrap;
  text-align: center;
  @media (min-width: ${size.laptop}) {
    font-size: 16px;
  }
`;
export const ColumnThree = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #DBDBDB;
  box-sizing: border-box;
  border-radius: 26px;
  cursor: pointer;

  span {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    flex: 1;

    input {
      border: none;
      outline: none;
      background: none;
      color: rgba(0, 0, 0, 0.66);;
      font-size: 14px;
      font-weight: 600;
      line-height: 24px;
      text-align: left;
      transition: all 500ms ease-in-out;
      cursor: pointer;
      padding-left: 10px;

      :focus {
        outline: none;
        border: none;
      }
    }

    li {
      list-style-type: none;
    }
  }

  min-width: 155px;
`;
export const LeftIcon = styled.div`
  background: url(${({ theme }) => theme.icon("bedroom")}) no-repeat 8px center;
  width: 28px;
  height: 38px;
  position: relative;
  align-items: center;
`;
export const TopUp = styled.div`
  width: 10px;
  height: 18px;
  display: flex;
  right: 10px;
  align-items: center;
  background: url(${({ theme }) => theme.icon("dropLight")}) no-repeat left center;
  position: relative;
  top: 10px;

  :hover {
    background: url(${({ theme }) => theme.icon("dropDark")}) no-repeat left center;
  }
`;
export const TopUpRooms = styled.div`
  width: 10px;
  height: 18px;
  display: flex;
  right: 10px;
  align-items: center;
  background: url(${({ theme }) => theme.icon("dropLight")}) no-repeat left center;
  position: relative;
  top: 0;

  :hover {
    background: url(${({ theme }) => theme.icon("dropDark")}) no-repeat left center;
  }
`;
export const InnerRoomList = styled.div`
  position: absolute;
  top: 39px;
  cursor: pointer;
  width: 100%;
  background: white;
  border-radius: 30px;
  left: 0;
  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
  transition: all 100ms ease-in-out;
  z-index: 20;

  li {
    position: relative;
    list-style-type: none;
    color: rgba(107, 101, 101, 0.63);
    display: flex;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    height: 40px;
    transition: all 100ms ease-in-out;
    align-items: center;
    border-radius: 30px;
    border: 1px solid transparent;

    :first-child {
      border-top-left-radius: 30px;
      border-top-right-radius: 30px;
    }

    :last-child {
      border-bottom-left-radius: 30px;
      border-Bottom-right-radius: 30px;
    }

    h3 {
      color: rgba(107, 101, 101, 0.63);
      font-weight: 500;
      font-size: 14px;
      line-height: 40px;
      margin: 0 0 0 10px;
    }

    :hover {
      background: ${({ theme }) => theme.colors.white};
      border: 1px solid ${({ theme }) => theme.colors.borderOutline};
      filter: drop-shadow(1px -2px 4px rgba(0, 0, 0, 0.17));

      transition: all 100ms ease-in-out;

      & h3 {
        color: ${({ theme }) => theme.colors.gray};
      }

    }
  }
`;
export const ColumnFour = styled.div`
  font-weight: bold;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.secondaryColor};
  white-space: nowrap;
  font-size: 27px;
  display: flex;
  justify-content: center;
  @media (max-width: ${size.tablet}) {
    font-size: 24.3px;
  }
`;
export const ColumnFive = styled.div`
  font-weight: 500;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.black};
  width: 210px;
  @media (max-width: ${size.tablet}) {
    width: 100%;
    height: 50px;
    padding: 0;
    flex: 0 !important;
  }

  button {
    height: 50px;
    background: linear-gradient(180deg, #7CCF13 0%, #639722 100%);

    color: ${({ theme }) => theme.colors.white};
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    font-weight: 700;
    align-items: center;
    text-align: center;
    cursor: pointer;
    text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
    padding: 0 20px;
    white-space: nowrap;

    &:hover {
      background: linear-gradient(180deg, #ABFB47 0%, #68AC14 100%);
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
export const RowView = styled.div`

`;
export const GuestNumber = styled.div`
  padding-left: 0;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin: 0;
  color: ${({ theme }) => theme.colors.primaryColor};
  font-weight: 500;
  font-size: 16px;
`;
export const DivView = styled.div`
  position: relative;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const CalendarView = styled.div`
  position: absolute;
  top: 76px;
  left: -10px;
  z-index: 20;

`;
export const CalendarViewCheckout = styled.div`
  position: absolute;
  top: 76px;
  right: -7px;
  z-index: 20;
`;

export const PassengerView = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  top: 78px;
  left: 54%;
  transform: translate(-50%, -10%);
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${Shadows.primaryShadow};
  min-width: 120px;
  padding: 10px;
  z-index: 20;
  border-radius: 25px;
  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
`;
export const CounterDiv = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
  justify-content: space-between;
`;
export const CounterBtn = styled.div`
  font-size: 12px;
  background-color: ${({ theme }) => theme.colors.offWhite};
  cursor: pointer;
  width: 20px;
  user-select: none;
  border-radius: 100%;
  box-shadow: ${Shadows.primaryShadow};
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    background-color: ${({ theme }) => theme.colors.primaryColor};
    color: ${({ theme }) => theme.colors.white};
  }
`;
export const SpanDiv = styled.span`
  font-weight: bold;
`;
export const Passenger = styled.div`
  position: relative;
  cursor: pointer;
`;
export const CheckBg = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
export const CheckTitle = styled.div`
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
`;
export const HotelCalendar = styled(Calendar)`
  width: 255px;
  padding: 0 12px 12px;
  border: none;
  border-radius: 12px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

  .react-calendar {
    width: 318px;
    max-width: 100%;
    background: white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
    line-height: 1.125em;
    border-radius: 9px;
    padding: 0 8px 8px;
    margin-top: 15px;
  }

  .react-calendar--doubleView {
    width: 700px;
  }

  .react-calendar--doubleView .react-calendar__viewContainer {
    display: flex;
    margin: -0.5em;
  }

  .react-calendar--doubleView .react-calendar__viewContainer > * {
    width: 50%;
    margin: 0.5em;
  }

  .react-calendar,
  .react-calendar *,
  .react-calendar *:before,
  .react-calendar *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .react-calendar button {
    margin: 0;
    border: 0;
    outline: none;
  }

  abbr[title] {
  }

  .react-calendar button:enabled:hover {
    cursor: pointer;
  }

  .react-calendar__navigation {
    display: flex;
    position: relative;
    padding: 15px 0 20px;
  }

  .react-calendar__navigation button {
    min-width: 44px;
    background: none;
  }

  .react-calendar__navigation button span {
    font-weight: 600;
    font-size: 15.4984px;
    line-height: 19px;
    color: #828282;
  }

  .react-calendar__navigation__prev-button:disabled {
    background-color: #fff;
    display: block;
    cursor: pointer;
  }

  .react-calendar__navigation .react-calendar__navigation__next2-button:enabled:hover,
  .react-calendar__navigation .react-calendar__navigation__prev2-button:enabled:focus {
    background-color: #ff8427;
    color: #fff;
  }

  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 14px;
    padding-bottom: 5px;
  }

  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none;
    color: #000;
    font-style: normal;
    font-weight: 500;
    font-size: 9.29902px;
    line-height: 9px;
    letter-spacing: 0.03em;
  }

  .react-calendar__month-view__weekNumbers .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75em;
    font-weight: bold;
    margin-bottom: 3px;
  }

  .react-calendar__month-view__days__day--weekend {
    color: #000;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: #757575;
  }

  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 2em 0.5em;
  }

  .react-calendar__tile {
    max-width: 100%;
    background: none;
    text-align: center;
    line-height: 33px;
    padding: 0 0;
    border-radius: 25px;
    background: #fff;
    font-weight: 500;
    font-size: 14px;
    color: #000000;
  }

  .react-calendar__tile:disabled {
    background-color: #DBDBDB;
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #F4AC67;
    color: #fff;
  }

  .react-calendar__tile--hasActive {
    background: #ff8427;
  }

  .react-calendar__tile--active:enabled:focus {
    background: #ff8427;
  }

  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: #a9d4ff;
  }

  .react-calendar__tile--active {
    background: #ff8427;
    color: #fff;
  }

  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #ff8427;
  }

  .react-calendar__navigation__arrow.react-calendar__navigation__next-button, .react-calendar__navigation__arrow.react-calendar__navigation__prev-button {
    display: block;
    height: 22px;
    font-size: 24px;
  }

  .react-calendar__navigation__arrow.react-calendar__navigation__prev2-button, .react-calendar__navigation__arrow.react-calendar__navigation__next2-button {
    display: none;
  }

  .react-calendar__navigation__arrow.react-calendar__navigation__next2-button {
    left: inherit;
    right: 5px;
  }

  .react-calendar__navigation {
    display: -moz-box;
    display: flex;
    height: 44px;
    margin-bottom: 0;
  }

  .react-calendar__navigation__label {
    pointer-events: none;
  }

  .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus {
    background-color: #fff;
  }

  .react-calendar__month-view__days {
    gap: 5px;
  }

  .react-calendar__navigation button {
    min-width: 30px;
    background: none;
  }
`;

export const StayingInfoWrapper = styled.div`
  width: 125px;
  height: 50px;
  display: flex;
  row-gap: 10px;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;

  p {
    font-size: 12px;
    font-weight: 500;
    margin: 0 0 5px 0;
    color: #333333;
  }

  @media (min-width: ${size.laptop}) {
    width: 115px;
  }
`;

export const PassengerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin: 0 0;
  height: 100%;
  justify-self: stretch;
  flex: 1;
  cursor: pointer;
  padding: 5px 0;

  :first-child {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    @media (max-width: ${size.tablet}) {
      padding: 10px 0 10px 0;
    }
    @media (min-width: ${size.laptop}) {
      padding: 10px 0 10px 2px;
    }

  }

  :last-child {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
    @media (max-width: ${size.tablet}) {
      padding: 10px 0 10px 0;
    }
    @media (min-width: ${size.laptop}) {
      padding: 10px 10px 10px 0;
    }
  }

  :hover {
    background: #F6F0DF;
  }

  span {
    margin-left: 8px;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.primaryColor};
    font-weight: 500;
    font-size: 16px;
  }

  div {
    text-align: center;
  }

  @media (max-width: ${size.tablet}) {
    padding: 10px 0 10px 0;
  }
`;

export const PassengerDetailsWrapper = styled.div`
  cursor: pointer;
  display: flex;
`;

export const CalenderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin: 0 0;
  height: 100%;
  justify-self: stretch;
  flex: 1;
  cursor: pointer;

  :first-child {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    padding-left: 8px;
    padding-right: 8px;

    @media (max-width: ${size.tablet}) {
      padding: 10px 0 10px 0;
    }
  }

  :last-child {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
    padding-right: 8px;

    @media (max-width: ${size.tablet}) {
      padding: 10px 0 10px 0;

    }
  }

  :hover {
    background: #F6F0DF;
  }

  span {
    margin-left: 8px;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.black};
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
  }

  div {
    text-align: center;
  }
`;


export const StyledTooltipWrapper = styled.div`
  & > * {
    color: ${({ theme }) => theme.colors.primaryColor} !important;
    background: ${({ theme }) => theme.colors.white} !important;
  }

  & > .place-top::after {
    border-top-color: ${({ theme }) => theme.colors.white} !important;
  }

  & > .__react_component_tooltip {
    max-width: 350px;
  }

`;