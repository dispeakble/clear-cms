import styled from "styled-components";
import { size } from "../../styled";
import { Shadows } from "../../../../assets/design-set";
import Calendar from "react-calendar";

export const PackageWrapper = styled.div`
  margin-top: 20px;
  @media (min-width: ${size.laptop}) {
    display: flex;
    flex: 1 1;
  }
  width: 100%;
  border-radius: 20px;
  gap: 8px;
  background: ${({ theme }) => theme.colors.white};
`;

export const DealCard = styled.div`
  flex: 1;
  @media (min-width: ${size.laptop}) {
    flex: none;
    border-right: 1px solid ${({ theme }) => theme.colors.borderOutline};
  }
`;
export const CardHead = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderOutline};

  line-height: 48px;
  font-size: 32px;
  color: ${({ theme }) => theme.colors.gray};

  display: flex;
  align-items: center;
  padding: 18px 0 18px 32px;
  font-weight: 400;
`;

export const EditDeals = styled.div`
  padding: 20px;
`;
export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  h4 {
    color: ${({ theme }) => theme.colors.black};
    font-size: 16px;
    margin-left: 12px;
  }
`;

export const ResponsiveFieldGroup = styled.div`
  @media (min-width: ${size.tablet}) {
    display: flex;
    gap: 10px;
  }
  @media (min-width: ${size.laptop}) {
    display: block;
  }
  & ${FieldGroup} {
    flex: 1;
  }
`;

export const FormElement = styled.div`
  display: flex;
  justify-content: space-around;
  height: 50px;
  background: ${({ theme }) => theme.colors.white};

  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
  box-sizing: border-box;
  box-shadow: 0 4px 7px rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  cursor: pointer;

  input {
    border: none;
    flex: 1;
    height: 48px;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    min-width: 150px;
    border-radius: 0 10px 10px 0;
  }
`;
export const SearchIcon = styled.div`
  width: 23px;
  height: 23px;
  margin: 13px 10px 0 10px;
  background: url(${({ theme }) => theme.icon("search")}) no-repeat left center;`;

export const CalenderIcon = styled.div`
  width: 23px;
  height: 24px;
  margin: 13px 10px 0 10px;
  background: url(${({ theme }) => theme.icon("calendar")}) no-repeat left center;
`;
export const DropdownIcon = styled.div`
  width: 40px;
  height: 48px;
  cursor: pointer;
  background: url(${({ theme }) => theme.icon("dropdown")}) no-repeat left center;
`;
export const SearchButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.primaryLight} 0%, ${({ theme }) => theme.colors.primaryColor} 100%);
    color: ${({ theme }) => theme.colors.white};
    height: 50px;
    padding: 0 20px;
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    display: flex;
    text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);

    &:hover {
      background: linear-gradient(180deg, ${({ theme }) => theme.colors.primaryColorHover} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
    }

    a {
      span {
        color: ${({ theme }) => theme.colors.white}
      }
    }
`;
export const SearchIconWhite = styled.div`
  width: 32px;
  height: 50px;
  display: inline-block;
  background: url(${({ theme }) => theme.icon("searchWhite")}) no-repeat left 14px;

`;
export const GuestType = styled.div`
  display: flex;
  justify-content: space-around;
  height: 50px;
  background: ${({ theme }) => theme.colors.white};

  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
  box-sizing: border-box;
  box-shadow: 0 4px 7px rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  gap: 10px;
  cursor: pointer;
  padding-left: 15px;
`;
export const AdultBox = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
`;
export const AdultIcon = styled.div`
  position: relative;
  height: 26px;
  width: 10px;
  top: 0;
  background: url(${({ theme }) => theme.icon("adults")}) no-repeat left center;
  cursor: pointer;
`;
export const AdultNumber = styled.div`
  font-weight: 500;
  font-size: 13px;
  line-height: 24px;
  white-space: nowrap;
`;
export const ChildIcon = styled.div`
  position: relative;
  height: 26px;
  width: 20px;
  top: 0;
  cursor: pointer;
  background: url(${({ theme }) => theme.icon("child")}) no-repeat left center;
`;

export const HotelView = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 10px 0;
  width: 379px;
  @media (max-width: ${size.laptop}) {
    width: 100%;
  }
`;
export const HotelWrapper = styled.div`
  display: block;
  @media (min-width: ${size.tablet}) {
    display: flex;
    justify-content: space-between;
  }
  @media (min-width: ${size.laptop}) {
    display: flex;
    justify-content: space-between;
  }
  @media (min-width: ${size.laptopL}) {
    display: flex;
    justify-content: space-between;
  }
`;
export const HotelName = styled.div`
  font-size: 32px;
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 400;
  margin: 0;
  line-height: 48px;
  padding: 8px 0 0;
`;
export const ViewPrice = styled.div`
  margin: 0 0 18px 0;
  text-align: right;
  text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  
  @media (min-width: ${size.laptop}) {
    margin: 0 18px 18px 0;
  }
`;

export const Price = styled.div`
  font-weight: 400;
  font-size: 32px;
  line-height: 48px;
  padding: 8px 0 0;
  color: #FF840D;
  
  span {
    font-size: 16px;
    line-height: initial;
  }
`;

export const AboutPrice = styled.div`
  line-height: 20px;
`;
export const InfoIcon = styled.span`
  display: inline-block;
  height: 32px;
  width: 32px;
  text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  background: url(${({ theme }) => theme.icon("info")}) no-repeat center center;

`;
export const HotelInfo = styled.div`
  padding-left: 5px;
`;
export const Star = styled.div`
`;
export const ShortDescription = styled.div`
  width: 100%;
  justify-content: space-between;
  @media only screen and (max-width: ${size.tablet}) {
    display: block;
  }
  padding: 10px 0;
`;
export const HotelLocation = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: #0009;
`;
export const ViewMap = styled.div`
  a {
    color: ${({ theme }) => theme.colors.secondaryColor};
    font-size: 16px;
    cursor: pointer;
    font-weight: 500;
    white-space: nowrap;
  }
`;
// Slider Section

export const SliderSection = styled.div`
  position: relative;
  height: 100%;
  display: flex;
`;
export const DateDiv = styled.div`
  position: relative;
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
  padding: 1px 9px;
  border-radius: 100%;
  box-shadow: ${Shadows.primaryShadow};

  :hover {
    background-color: ${({ theme }) => theme.colors.primaryColor};
    color: ${({ theme }) => theme.colors.white};
  }


`;

export const StyledDescription = styled.div<{ readMore: boolean }>`
  width: 100%;
  
  max-height: ${props => props.readMore ? " " : "600px"};
  overflow: ${props => props.readMore ? " " : "hidden"} ;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.5);
  @media only screen and (max-width: ${size.tablet}) {
    font-size: 18px;
    margin-top: 10px;
  }

`;

export const PopupFilters = styled.div`
  position: absolute;
  right: 0;
  z-index: 2;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  user-select: none;
  width: 260px;
  @media (min-width: ${size.mobileS}) {
    width: 280px;
  }
  @media (min-width: ${size.mobileM}) {
    width: 335px;
  }
  @media (min-width: ${size.mobileL}) {
    width: 360px;
  }
  @media (min-width: ${size.laptop}) {
    width: 290px;
  }
`;
export const PersonEntry = styled.div`
  padding: 0 22px 22px 22px;

`;
export const SubDetail = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;

  button {
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.primaryLight} 0%, ${({ theme }) => theme.colors.primaryColor} 100%);
    color: ${({ theme }) => theme.colors.white};
    height: 45px;
    padding-right: 20px;
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    display: flex;
    text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
    flex: 1;

    &:hover {
      background: linear-gradient(180deg, ${({ theme }) => theme.colors.primaryColorHover} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
      color: #FFFFFF;
      text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
    }
`;
export const CardDesc = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 200%;
  text-transform: uppercase;
  color: #7C7C7C;
  display: flex;
  justify-content: flex-start;
`;
export const Person = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
export const BoxLeft = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    font-weight: 600;
    font-size: 18px;
    margin: 0;
    color: ${({ theme }) => theme.colors.black};
  }

  p {
    font-weight: 500;
    font-size: 12px;
    line-height: 10px;
    color: ${({ theme }) => theme.colors.gray};
  }
`;
export const BoxRight = styled.div``;
export const PopupFilterTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  width: 100%;
  height: 60px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.25);
  line-height: 48px;
  font-size: 32px;
  color: ${({ theme }) => theme.colors.gray};
  text-align: center;
  border-radius: 12px 12px 0 0;
  margin-bottom: 12px;
`;
export const CloseIcon = styled.div`
  background: url(${({ theme }) => theme.icon("close")}) no-repeat left center;
  width: 22px;
  height: 12px;
  position: relative;
  cursor: pointer;
`;
export const Quantity = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 82px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
  user-select: none;

  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 38px;
    color: ${({ theme }) => theme.colors.black};
    cursor: pointer;
  }
  
  h3 {
    margin: 0;
  }

  h5 {
    font-weight: 600;
    font-size: 18px;
    line-height: 38px;
    color: ${({ theme }) => theme.colors.black};
    margin: 0;
  }
`;

export const HotelCalendar = styled(Calendar)`
  width: 318px;
  position: absolute;
  z-index: 2;
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
    line-height: 35px;
    padding: 0;
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

  .react-calendar__tile--now {
    background-color: #F4AC67;
    color: #fff;
  }

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
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
export const H4 = styled("h4")`
  
`;

export const span = styled("span")`
user-select: none;
`;