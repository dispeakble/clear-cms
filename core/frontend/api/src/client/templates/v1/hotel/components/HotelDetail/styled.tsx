import styled from "styled-components";
import { size } from "../../styled";
import { Shadows } from "../../../../../assets/design-set";
import Calendar from "react-calendar";
import {createTheme} from "@mui/material";

export const customTheme = createTheme({
    components: {
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: '14px',
                    color: "#DC6B03",
                    backgroundColor: 'white',
                    maxWidth: '350px',
                    borderTopColor: 'white'
                },
            },
        },
    },
});

export const Wrapper = styled.div`
  margin-top: 30px;
  gap: 20px;
  width: 100%;
  @media (min-width: ${size.laptop}) {
    display: flex;
    flex: 1 1;
  }
  background: ${({ theme }) => theme.colors.white};
`;

export const DealCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 4px 7px 0 rgb(0 0 0 / 17%);
  height: max-content;
`;
export const CardHead = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderOutline};
  background: ${({ theme }) => theme.colors.white};

  line-height: 48px;
  font-size: 32px;
  color: ${({ theme }) => theme.colors.gray};

  display: flex;
  align-items: center;
  padding: 18px 0 18px 32px;
  font-weight: 400;
`;

export const EditDeals = styled.div`
  padding: 27px;
`;
export const Destination = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  h4 {
    color: ${({ theme }) => theme.colors.black};
    font-size: 16px;
    margin-left: 12px;
  }
`;

export const HotelSearch = styled.div`
  display: flex;
  justify-content: space-around;
  height: 50px;
  background: ${({ theme }) => theme.colors.white};

  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
  box-sizing: border-box;
  box-shadow: 0 4px 7px rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  cursor: pointer;
  flex: 1 0 40%;

  input {
    border: none;
    flex: 1;
    height: 48px;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    min-width: 0;
    width: 100%;
    border-radius: 0 10px 10px 0;
  }
`;
export const SearchIcon = styled.div`
  width: 23px;
  height: 23px;
  margin: 13px 10px 0 10px;
  background: url(${({theme}) => theme.icon('search')}) no-repeat left center;`;

export const CalenderIcon = styled.div`
  width: 23px;
  height: 24px;
  margin: 13px 10px 0 10px;
  background: url(${({theme}) => theme.icon('calendar')}) no-repeat left center;
`;
export const DropdownIcon = styled.div`
  width: 40px;
  height: 48px;
  cursor: pointer;
  background: url(${({theme}) => theme.icon('dropdown')}) no-repeat left center;
`;
export const NewSearch = styled.div`
  display: flex;
  flex: 1;

  button {
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.primaryDark} 0%, ${({ theme }) => theme.colors.primaryColor} 100%);
    color: ${({ theme }) => theme.colors.white};
    height: 50px;
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
      background: linear-gradient(180deg, #FFBA77 0%, #DE8C41 100%);
      color: #FFFFFF;
      text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
    }

    a {
      span {
        color: ${({ theme }) => theme.colors.white}
      }
    }
`;
export const WhiteIcon = styled.div`
  width: 32px;
  height: 50px;
  display: inline-block;
  background: url(${({theme}) => theme.icon('searchWhite')}) no-repeat center center;

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
  padding-left: 10px;
`;
export const AdultBox = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  white-space: nowrap;
`;
export const AdultIcon = styled.div`
  position: relative;
  height: 26px;
  width: 10px;
  top: 0;
  background: url(${({theme}) => theme.icon('adults')}) no-repeat left center;
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
  background: url(${({theme}) => theme.icon('child')}) no-repeat left center;
`;

export const HotelView = styled.div`
  flex: 1;
  height: initial;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  @media (min-width: ${size.laptop}) {
    width: 379px;
    padding: 0;
    max-height: 700px;
  }
  @media (min-width: ${size.laptopL}) {
    max-height: 600px;
    & .slider-wrapper {
      height: calc(600px - 130px);
    }
  }
  @media (max-width: ${size.tablet}) {
    max-height: 700px;
    & .slider-wrapper {
      height: calc(700px - 200px);
    }
  }
`;
export const HotelInfo = styled.div`
  display: block;
  @media (min-width: ${size.tablet}) {
    display: flex;
    justify-content: space-between;
  }
  @media (min-width: ${size.laptop}) {
    display: block;
  }
  @media (min-width: ${size.laptopL}) {
    display: flex;
    justify-content: space-between;
  }
`;
export const HotelName = styled.div`
  font-size: 36px;
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 400;
  line-height: 48px;
  padding-top: 18px;
`;
export const ViewPrice = styled.div`
  position: relative;
  display: flex;
  margin: 18px 0;
  @media (min-width: ${size.laptop}) {
    margin: 18px 18px 18px 0;
  }
  

  button {
    flex: 1;
    height: 66px;
    background: linear-gradient(180deg, #7CCF13 0%, #639722 100%);
    color: ${({ theme }) => theme.colors.white};
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    font-size: 24px;
    align-items: center;
    cursor: pointer;
    text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

    &:hover {
      background: linear-gradient(180deg, #A9F945 0%, #69AD14 100%);
    }

    span {
      color: ${({ theme }) => theme.colors.white}
    }

    @media (min-width: ${size.tablet}) {
      width: 268px;
    }
  }
`;
export const InfoIcon = styled.span`
  display: inline-block;
  height: 32px;
  width: 32px;
  text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  background: url(${({theme}) => theme.icon('info')}) no-repeat center center;

`;
export const LeftSide = styled.div``;
export const Star = styled.div`
`;
export const ShortDescription = styled.div`
  display: flex;
  width: 400px;
  justify-content: space-between;
  @media only screen and (max-width: ${size.tablet}) {
    display: block;
  }
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

export const ShowDate = styled.div`
  position: absolute;
  top: 80px;
  right: 0;
  left: 0;
  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
  background-color: ${({ theme }) => theme.colors.white};
`;
export const HeadingDiv = styled.div`
  width: 200px;
  background-color: ${({ theme }) => theme.colors.white};
`;
export const MemberBox = styled.div`
  display: flex;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
  border-radius: 12px;
  gap: 18px;
  padding: 10px;
`;
export const CounterDiv = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
  justify-content: space-between;
`;
export const CounterBtn = styled.div`
  fontSize: 12px;
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

export const PersonBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;

`;
export const InfBox = styled.div`
  display: flex;
`;
export const ChildBox = styled.div`
  display: flex;
`;
export const SliderLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 10px;
  height: 437px;
  background: ${({ theme }) => theme.colors.white};

  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
  box-sizing: border-box;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.25);
  padding: 12px;
`;
export const SliderRight = styled.div`
  height: 437px;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.25);
`;

export const ImageCount = styled.div`
  width: 183px;
  height: 130px;
  background-size: cover;
  margin-top: 10px;
`;

export const StyledDescription = styled.div<{readMore: boolean}>`
  width: 100%;
  
  max-height: ${props=> props.readMore ? ' ' : '600px'};
  overflow: ${props=> props.readMore ? ' ' : 'hidden'} ;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.5);
  @media only screen and (max-width: ${size.tablet}) {
    font-size: 18px;
    margin-top: 10px;
  }

`;

export const StyledDescriptionMore = styled.a`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primaryColor};
`;

export const DetailsCard = styled.div`
  position: absolute;
  z-index: 2;
  width: 320px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

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
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.primaryDark} 0%, ${({ theme }) => theme.colors.primaryColor} 100%);
    color: ${({ theme }) => theme.colors.white};
    width: 340px;
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
      background: linear-gradient(180deg, #FFBA77 0%, #DE8C41 100%);
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
`;
export const BoxLeft = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    font-weight: 600;
    font-size: 18px;
    line-height: 35px;
    margin-bottom: 0;
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
export const DetailTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.25);
  font-weight: 600;
  font-size: 27.5px;
  line-height: 41px;
  text-align: center;
  border-radius: 12px 12px 0 0;
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 12px;
`;
export const CloseIcon = styled.div`
  background: url(${({theme}) => theme.icon('close')}) no-repeat left center;
  width: 22px;
  height: 12px;
  position: relative;
  right: 92px;
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

  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 38px;
    color: ${({ theme }) => theme.colors.black};
    cursor: pointer;
  }

  h5 {
    font-weight: 600;
    font-size: 18px;
    line-height: 38px;
    color: ${({ theme }) => theme.colors.black};
    margin-bottom: 0;
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
    line-height: 40px;
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
    background: red;
  }

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: red;
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

export const StyledButton = styled.button`
  position: relative;
  z-index: 2;
`;

export const SPAN = styled("span")`
user-select: none;
`

export const StyledTooltipWrapper = styled.div`
  & > * {
    color: ${({theme}) => theme.colors.primaryColor} !important;
    background: ${({theme}) => theme.colors.white} !important;
  }
  
  & > .place-top::after {
    border-top-color: ${({theme}) => theme.colors.white} !important;
  }
  
  & > .__react_component_tooltip {
    max-width: 350px;
  }

`;