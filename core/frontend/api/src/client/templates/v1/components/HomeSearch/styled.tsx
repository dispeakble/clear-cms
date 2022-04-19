import styled from "styled-components";

import { device, size } from "../../styled";

interface IDateLabel {
  selected?: boolean;
}

export const StyledHomeSearch = styled.div`
  background-size: cover;
  margin-bottom: 20px;
  padding: 114px 0 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  @media ${device.tablet} {
    max-width: 720px;
  }
  @media ${device.laptop} {
    max-width: 768px;
    padding: 114px 20px 0;
  }
  @media ${device.laptopL} {
    max-width: 1024px;
  }
  @media ${device.desktop} {
    max-width: 1240px;
  }
`;

export const StyledSearchTabs = styled.div`
  border-radius: 16px 16px 0 0;
  & :first-child {
    border-radius: 16px 0 0 0;
  }
  & :last-child {
    border-radius: 0 16px 0 0;
  }

  display: flex;
  
  
  @media ${device.tablet} {
    display: block;
  }
`;
export const StyledSearchTab = styled.a`
  display: block;
  text-align: center;
  padding: 20px;
  background: white;
  cursor: pointer;
  user-select: none;
  &:hover {
    background: ${({theme}) => theme.colors.primaryColorHover};
  }
  &:hover, &.selected {
    color: white;
  }
  &.selected {
    background: ${({theme}) => theme.colors.primaryColor};
    box-shadow: inset 0 -2px 0 rgba(0,0,0,0.3);
  }
  flex: 1;

  @media ${device.tablet} {
    display: inline-block;
    flex: none;
  }
  
`;

export const StyledSearchInput = styled.input`
  flex: 1;
  background: url(${({theme}) => theme.icon('departure')}) no-repeat 16px center white;
  padding: 20px 0 20px 64px;
  width: 100%;
  outline: none;
  border: none;
  &::placeholder{
    color: rgba(0,0,0,0.6);
  }
`;

export const StyledSearchDestinationInput = styled.input`
  flex: 1;
  background: url(${({theme}) => theme.icon('arrival')}) no-repeat 16px center white;
  padding: 20px 0 20px 64px;
  box-sizing: border-box;
  width: 100%;
  outline: none;
  border: none;
  margin-top: 5px;
  &::placeholder{
    color: rgba(0,0,0,0.6);
  }
  @media ${device.tablet} {
    margin-top: 0;
  }
`;

export const StyledSearchInputHolder = styled.div`
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  
  border-radius: 0 0 16px 16px;
  background: none;
  
  @media ${device.tablet} {
    background: ${({theme}) => theme.colors.white};
    &.flights {
      background: rgb(255,255,255);
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 75%, rgba(255,255,255,1) 75%, rgba(255,255,255,1) 100%);
      & ${StyledSearchDestinationInput} {
        @media ${device.tablet} {
          margin: 0 0 0 5px;
        }
      }
    }
    flex-direction: row;
    border-radius: 0 16px 0 0;
  }
`;

export const StyledSearchButton = styled.button`
  background: ${({theme}) => theme.colors.primaryColor};
  &:hover {
    background: ${({theme}) => theme.colors.primaryColorHover};
  }
  color: white;
  border: none;
  cursor: pointer;
  user-select: none;
  border-radius: 8px;
  padding: 20px;

  margin: 10px 0 0 0;
  
  @media ${device.tablet} {
    margin: 0 0 0 10px;
  }
`;

export const StyledSearchOptions = styled.div`
  margin-top: 5px;
  padding: 10px;
  border-radius: 0 0 16px 16px;
  background: white;
  display: flex;
  flex: 1;
  flex-direction: column;
  @media ${device.tablet} {
    flex-direction: row;
  }
`;

export const StyledCenterLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
 
`;

export const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  color: rgba(0,0,0,0.5);
  font-size: 12px;
  white-space: nowrap;
  & > span {
    padding-right: 10px !important;
  }
`;

export const StyledValue = styled.label`
  display: block;
  font-weight: bold;
  color: black;
  font-size: 14px;
  white-space: nowrap;
`;

export const StyledPrimaryValue = styled.div`
  font-weight: bold;
  font-size: 14px;
  color: ${({theme}) => theme.colors.primaryColor};
`;

export const StyledSearchCheckinGroup = styled.div`
  border: 2px solid #EFEFEF;
  border-radius: 10px;
  display: flex;
  @media ${device.tablet} {
    width: auto;
  }
  & > span:hover {
    background-color: ${({theme}) => theme.colors.primaryLight};
    & > label {
      color: #FFFFFF !important;
    }

  }
`;

export const StyledCheckIn = styled.span`
  cursor: pointer;
  user-select: none;
  background: url(${({theme}) => theme.icon('checkIn')}) no-repeat 5px center;
  padding: 10px 10px 10px 35px;
  border-radius: 8px 0 0 8px;
  flex: 1;
  position: relative;
  overflow: visible;
  & label {
    pointer-events: none;
  }
 
`;

export const StyledCheckOut = styled.span`
  cursor: pointer;
  user-select: none;
  background: url(${({theme}) => theme.icon('checkOut')}) no-repeat 5px center;
  padding: 10px 10px 10px 35px;
  border-radius: 0 8px 8px 0;
  flex: 1;
  position: relative;
  overflow: visible;
  & label {
    pointer-events: none;
    user-select: none;
  }
  
`;

export const StyledFilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  @media ${device.tablet} {
    flex-direction: row;
  }
`;

export const StyledSearchOptionsGroup = styled.div`
  cursor: pointer !important;
  border: 2px solid #EFEFEF;
  border-radius: 10px;
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  @media ${device.tablet} {
    flex: 1;
    margin: 0 0 0 10px;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
  @media ${device.laptop} {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
  @media ${device.laptopL} {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
  & label:hover {
    cursor: pointer;
    background-color: ${({theme}) => theme.colors.primaryLight};
    & > ${StyledCenterLabel} * {
      color: white !important;
    }
  }
`;

export const StyledPerson = styled.label`
  cursor: pointer;
  user-select: none;
  display: inline-block;
  padding: 10px 0 10px 10px;
  border-radius: 8px 0 0 8px;
  position: relative;
  background: url(${({theme}) => theme.icon('person')}) no-repeat 10px 10px;
  @media (max-width: ${size.mobileL}) {
    border-radius: 8px 0 0 0;
  }
  @media ${device.laptopL} {
    background-position: 55px 12px;
  }
`;

export const StyledChild = styled.label`
  cursor: pointer;
  user-select: none;
  display: inline-block;
  padding: 10px 0 10px 10px;
  position: relative;
  background: url(${({theme}) => theme.icon('child')}) no-repeat 10px 10px;
  @media (max-width: ${size.mobileL}) {
    border-radius: 0 8px 0 0;
  }
  @media ${device.laptopL} {
    background-position: 55px 12px;
  }
`;

export const StyledStars = styled.label`
  cursor: pointer;
  user-select: none;
  display: inline-block;
  padding: 10px 0 10px 10px;
  position: relative;
  border-radius: 0 8px 8px 0;
  background: url(${({theme}) => theme.icon('star')}) no-repeat 0 12px;
  @media (max-width: ${size.mobileL}) {
    border-radius: 0 0 8px 0;
  }
  @media ${device.laptopL} {
    background-position: 45px 12px;
  }
`;

export const StyledOneWay = styled.label`
  cursor: pointer;
  user-select: none;
  display: inline-block;
  padding: 10px 0 10px 10px;
  position: relative;
  border-radius: 0 8px 8px 0;
  & input {
    cursor: pointer;
  }
  @media (max-width: ${size.mobileL}) {
    border-radius: 0 0 8px 0;
  }
`;
export const SearchLabel = styled.label`
  font-size: 12px;
  font-weight: 800;
  color: #333;
  margin-bottom: 4px;
  cursor: pointer;
`;

export const DateLabel = styled.label<IDateLabel>`
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: ${(props) => props.selected ? "#333" : "#777"};
`;

export const CalendarContainer = styled.div`
  position: absolute;
  height: auto;
  margin-top: 40px;
  
  &#checkOut {
    right: 0;
  }

  &#checkIn {
    left: 0;
  }
  
  max-width: 290px;
  z-index: 20;
  padding: 10px;
  background: white;
  border-radius: 16px;
  box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;

  .react-calendar {
    width: 350px;
    max-width: 100%;
    background: white;
    border: 1px solid #a0a096;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.125em;
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
  .react-calendar button:enabled:hover {
    cursor: pointer;
  }
  .react-calendar__navigation {
    display: flex;
    height: 44px;
    margin-bottom: 1em;
  }
  .react-calendar__navigation button {
    min-width: 44px;
    background: none;
  }
  .react-calendar__navigation button:disabled {
    background-color: #f0f0f0;
  }
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: #e6e6e6;
  }
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.75em;
  }
  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;
  }
  .react-calendar__month-view__weekNumbers .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75em;
    font-weight: bold;
  }
  .react-calendar__month-view__days__day--weekend {
    color: ${({theme}) => theme.colors.darkRed};
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: ${({theme}) => theme.colors.gray};
  }
  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 2em 0.5em;
  }
  .react-calendar__tile {
    max-width: 100%;
    padding: 10px 6.6667px;
    background: none;
    text-align: center;
    line-height: 16px;
  }
  .react-calendar__tile:disabled {
    background-color: #FFFFFF;
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #FFFFFF;
  }
  .react-calendar__tile--now {
    background: ${({theme}) => theme.colors.mainBackground};
  }
  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: ${({theme}) => theme.colors.mainBackground};
  }
  .react-calendar__tile--hasActive {
    background: ${({theme}) => theme.colors.primaryColor};
  }
  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: ${({theme}) => theme.colors.primaryColor};
  }
  .react-calendar__tile--active {
    background: ${({theme}) => theme.colors.primaryColor};
    color: white;
  }
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: ${({theme}) => theme.colors.primaryColor};
  }
  .react-calendar--selectRange .react-calendar__tile--hover {
    background-color: ${({theme}) => theme.colors.gray};
  }

`;

export const Overlay = styled.a`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 15;
  cursor: default;
`;