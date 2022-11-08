import styled from "styled-components";

import { device, size } from "../../styled";

export const StyledHomeSearch = styled.div<{ isHome: boolean }>`
  background-size: cover;
  width: 100%;
  display: flex;
  flex-direction: column;
  ${({isHome}) => isHome && 'padding-top: 90px;'}
  @media ${device.tablet} {
    max-width: 720px;
  }
  @media ${device.laptop} {
    max-width: 768px;
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
  padding: 15px;
  background: white;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryColorHover};
  }

  &:hover, &.selected {
    color: white;
  }

  &.selected {
    background: ${({ theme }) => theme.colors.primaryColor};
    box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.3);
  }

  flex: 1;

  &:not(:first-of-type) {
    margin-left: 5px;
  }

  @media ${device.tablet} {
    padding: 20px;
    display: inline-block;
    flex: none;
  }

`;

export const StyledSearchInput = styled.input`
  flex: 1;
  background: url(${({ theme }) => theme.icon("departure")}) no-repeat 16px center #FFFFFF;
  padding: 20px 0 20px 64px;
  width: 100%;
  outline: none;
  border: none;

  &::placeholder {
    color: rgba(0, 0, 0, 0.6);
  }

  &:focus {
    &::placeholder {
      font-weight: bold;
    }

    font-weight: bold;
  }
`;

export const AutocompleteList = styled.ul`
  position: absolute;
  z-index: 20;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.primaryColor};
  color: ${({ theme }) => theme.colors.jetBlack};
  list-style: none;
  margin: 64px 0 0;

  padding: 0;
  box-shadow: 4px 4px 15px rgb(0 0 0 / 25%);
  width: 100%;

  @media ${device.tablet} {
    width: calc(50% - 3px);
  }

  &.destination {
    margin-top: 126px;
    @media ${device.tablet} {
      margin-top: 64px;
    }
    right: 0;
  }
`;

export const AutocompleteItem = styled.li`
  display: block;
  padding: 0 10px;
  line-height: 34px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryColor};
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const StyledSearchDestinationInput = styled.input`
  flex: 1;
  background: url(${({ theme }) => theme.icon("arrival")}) no-repeat 16px center white;
  padding: 20px 0 20px 64px;
  box-sizing: border-box;
  width: 100%;
  outline: none;
  border: none;

  &::placeholder {
    color: rgba(0, 0, 0, 0.6);
  }

  &:focus {
    &::placeholder {
      font-weight: bold;
    }
  }

  &:not(.singleInput) {
    margin-top: 5px;
  }

  @media ${device.tablet} {
    margin-top: 0;
    &:not(.singleInput) {
      margin: 0 0 0 5px !important;
    }

  }
`;

export const StyledSearchHotelInput = styled.input`
  flex: 1;
  background: url(${({ theme }) => theme.icon("search")}) no-repeat 16px center white;
  padding: 20px 0 20px 64px;
  box-sizing: border-box;
  width: 100%;
  outline: none;
  border: none;

  &::placeholder {
    color: rgba(0, 0, 0, 0.6);
  }

  &:focus {
    &::placeholder {
      font-weight: bold;
    }
  }

  &:not(.singleInput) {
    margin-top: 5px;
  }

  @media ${device.tablet} {
    margin-top: 0;
    &:not(.singleInput) {
      margin: 0 0 0 5px !important;
    }

  }
`;


export const StyledSearchInputHolder = styled.div`
  position: relative;
  margin-top: 5px;
  display: flex;
  flex-direction: column;

  border-radius: 0 0 16px 16px;
  background: none;

  @media ${device.tablet} {
    flex-direction: row;
    border-radius: 0 16px 0 0;
  }
`;

export const StyledSearchButton = styled.button`
  font-size: 14px;
  white-space: nowrap;
  flex: 1;
  @media ${device.tablet} {
    flex: none;
  }
  background: ${({ theme }) => theme.colors.primaryColor};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryColorHover};
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
  gap: 10px;
  @media ${device.tablet} {
    flex-direction: row;
  }
`;

export const StyledCenterLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 30;
  cursor: pointer;
`;

export const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.5);
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
  color: ${({ theme }) => theme.colors.primaryColor};
`;

export const StyledSearchCheckinGroup = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.greyBorder};
  border-radius: 10px;
  display: flex;
  flex: 1;

  & > span:hover {
    background-color: ${({ theme }) => theme.colors.primaryColorHover};
    

    & > label {
      color: #FFFFFF !important;
      flex: 1;
    }

  }
`;

export const StyledSearchSecondGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media ${device.tablet} {
    flex-direction: row;
  }  
`;

export const StyledCheckIn = styled.span`
  cursor: pointer;
  user-select: none;
  background: url(${({ theme }) => theme.icon("checkIn")}) no-repeat 5px center;
  padding: 10px 10px 10px 35px;
  border-radius: 8px 0 0 8px;
  flex: 1;
  position: relative;
  overflow: visible;

  & label {
    pointer-events: none;
  }
  
  &:hover {
    background-image: url(${({ theme }) => theme.icon("checkInWhite")});
  }

`;

export const StyledCheckOut = styled.span`
  cursor: pointer;
  user-select: none;
  background: url(${({ theme }) => theme.icon("checkOut")}) no-repeat 5px center;
  padding: 10px 10px 10px 35px;
  border-radius: 0 8px 8px 0;
  flex: 1;
  position: relative;
  overflow: visible;

  & label {
    pointer-events: none;
    user-select: none;
  }

  &:hover {
    background-image: url(${({ theme }) => theme.icon("checkOutWhite")});
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
  border: 1px solid ${({ theme }) => theme.colors.primaryColorHover};
  border-radius: 10px;
  display: flex;
  flex: 1;
  @media ${device.tablet} {
    flex: 1;
  }

  & > label:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.primaryColorHover};

    & > ${StyledCenterLabel} * {
      color: white !important;
    }
  }

  & label:first-child {
    border-radius: 8px 0 0 8px;
    @media (max-width: ${size.mobileL}) {
      border-radius: 8px 0 0 0;
    }
  }

  & label:last-child {
    border-radius: 0 8px 8px 0;
    @media (max-width: ${size.mobileL}) {
      border-radius: 0 0 8px 0;
    }
  }
  
  & label {
    flex: 1;
  }
`;

export const StyledPersonFilter = styled.label`
  flex: 1;
  user-select: none;
  padding: 10px 0 10px 10px;
  position: relative;
  background: url(${({ theme }) => theme.icon("person")}) no-repeat 10px 10px;

  @media ${device.laptopL} {
    background-position: 45px 12px;
  }
  @media ${device.desktop} {
    background-position: 70px 12px;
  }

  &:hover {
    background-image: url(${({ theme }) => theme.icon("personWhite")});
  }
`;

export const StyledChildFilter = styled.label`
  flex: 1;
  user-select: none;
  padding: 10px 0 10px 10px;
  position: relative;
  background: url(${({ theme }) => theme.icon("child")}) no-repeat 10px 10px;
  @media (max-width: ${size.mobileL}) {
    border-radius: 0 8px 0 0;
  }
  @media ${device.laptop} {
    background-position: 10px 12px;
  }
  @media ${device.laptopL} {
    background-position: 38px 12px;
  }
  @media ${device.desktop} {
    background-position: 60px 12px;
  }
  &:hover {
    background-image: url(${({ theme }) => theme.icon("childWhite")});
  }
`;

export const StyledStarsFilter = styled.label`
  flex: 1;
  user-select: none;
  padding: 10px 0 10px 10px;
  position: relative;
  background: url(${({ theme }) => theme.icon("star")}) no-repeat 7px 12px;
  @media ${device.laptopL} {
    background-position: 35px 12px;
  }
  @media ${device.desktop} {
    background-position: 60px 12px;
  }
  &:hover {
    background-image: url(${({ theme }) => theme.icon("starWhite")});
  }
`;

export const StyledOneWay = styled.label`
  cursor: pointer;
  user-select: none;
  display: inline-block;
  position: relative;
  border-radius: 0 8px 8px 0;
  padding: 10px;

  & input {
    cursor: pointer;
  }

  @media (max-width: ${size.mobileL}) {
    border-radius: 0 0 8px 0;
  }
`;

export const CalendarContainer = styled.div`
  position: absolute;
  height: auto;
  margin-top: 80px;
  left: 0;
  z-index: 20;
  padding: 10px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px, inset 0 0 0 1px ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;

  .react-calendar {
    max-width: 100%;
    background: ${({ theme }) => theme.colors.white};
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.125em;
  }

  .react-calendar--doubleView {
    @media ${device.tablet} {
      width: 100%;
    }
  }

  .react-calendar--doubleView .react-calendar__viewContainer {
    display: flex;
    flex-direction: column;
    @media ${device.tablet} {
      flex-direction: row;
    }
    margin: -0.5em;
  }

  .react-calendar--doubleView .react-calendar__viewContainer > * {
    @media ${device.tablet} {
      width: 50%;
    }
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

  .react-calendar__navigation__label {
    font-size: 13px;
    @media ${device.tablet} {
      font-size: 16px;
    }
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
    color: transparent;
  }

  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.white};
  }

  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.75em;
  }
  
  .react-calendar__month-view:not(:first-of-type) {
    @media ${device.tablet} {
      border-left: 1px solid ${({ theme }) => theme.colors.primaryLight};
    }    
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
    color: ${({ theme }) => theme.colors.primaryLight};
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: ${({ theme }) => theme.colors.gray};
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
    background-color: ${({ theme }) => theme.colors.white};
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.white};
  }

  .react-calendar__tile--now {
    box-shadow: 0 0 0 1px inset ${({ theme }) => theme.colors.primaryColor};
  }

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.white};
  }

  .react-calendar__tile--hasActive {
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.primaryColor};
  }

  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: ${({ theme }) => theme.colors.primaryColor};
  }

  .react-calendar__tile--active {
    background: ${({ theme }) => theme.colors.primaryLight} !important;
    color: ${({ theme }) => theme.colors.white};
  }

  .react-calendar__tile--rangeStart, .react-calendar__tile--rangeEnd {
    background: ${({ theme }) => theme.colors.primaryColor} !important;
    color: ${({ theme }) => theme.colors.white} !important;
  }

  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: ${({ theme }) => theme.colors.primaryColor} !important;
  }

  .react-calendar--selectRange .react-calendar__tile--hover,
  .react-calendar--selectRange .react-calendar__tile--hoverEnd {
    &:not([disabled]) {
      background-color: ${({ theme }) => theme.colors.primaryLight};
      color: ${({ theme }) => theme.colors.white};

      &:hover {
        background-color: ${({ theme }) => theme.colors.primaryColor} !important;
      }
    }
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    visibility: hidden;
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