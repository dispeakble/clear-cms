import styled from "styled-components";
import {Colors} from "../../assets/design-set";

import searchIcon from '../../assets/img/search-icon.svg'
import checkIn from '../../assets/img/check-in.svg'
import checkOut from '../../assets/img/check-out.svg'
import person from '../../assets/img/person-icon.svg'
import child from '../../assets/img/child-icon.svg'
import infant from '../../assets/img/infant-icon.svg'
import star from '../../assets/img/star-icon.svg'
import { device, size } from "../../styled";

interface IDateLabel{
  selected?:boolean
}

export const StyledHomeSearch = styled.div`
  background-size: cover;
  margin-bottom: 20px;
  padding: 114px 0 0;
  width: 100%;
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
`;
export const StyledSearchTab = styled.div`
  display: inline-block;
  padding: 20px;
  background: white;
  cursor: pointer;
  &:hover {
    background: ${Colors.primaryLight};
  }
  &:hover, &.selected {
    color: white;
  }
  &.selected {
    background: ${Colors.primaryColor};
    box-shadow: inset 0 -2px 0 rgba(0,0,0,0.3);
  }
`;

export const StyledSearchInput = styled.input`
  background: url(${searchIcon.src}) no-repeat 16px center white;
  border-radius: 0 16px 0 0;
  margin-top: 5px;
  padding: 20px 50px;
  width: 100%;
  outline: none;
  border: none;
  &::placeholder{
    color: rgba(0,0,0,0.6)
  }
`;

export const StyledSearchOptions = styled.div`
  margin-top: 5px;
  padding: 10px;
  border-radius: 0 0 16px 16px;
  background: white;
  display: block;
  @media ${device.tablet} {
    display: flex;
  }
`;

export const StyledCenterLabel = styled.div`
  display: inline-block;
  text-align: center;
`;

export const StyledLabel = styled.label`
  display: block;
  color: rgba(0,0,0,0.5);
  font-size: 12px;
  white-space: nowrap;
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
  color: ${Colors.primaryColor};
`;

export const StyledSearchCheckinGroup = styled.div`
  border: 2px solid #EFEFEF;
  border-radius: 10px;
  display: flex;
  width: 100%;
  @media ${device.tablet} {
    width: auto;
  }
  & > span:hover {
    background-color: ${Colors.primaryLight};
    & > * {
      color: #FFFFFF !important;
    }

  }
`;

export const StyledCheckIn = styled.span`
  cursor: pointer;
  background: url(${checkIn.src}) no-repeat 10px center;
  padding: 20px 40px;
  border-radius: 8px 0 0 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 77px;
  & label {
    pointer-events: none;
  }
`;

export const StyledCheckOut = styled.span`
  cursor: pointer;
  background: url(${checkOut.src}) no-repeat 10px center;
  padding: 20px 40px;
  border-radius: 0 8px 8px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 77px;
  & label {
    pointer-events: none;
  }
`;

export const StyledSearchOptionsGroup = styled.div`
  border: 2px solid #EFEFEF;
  border-radius: 10px;
  margin-top: 10px;
  @media ${device.tablet} {
    flex: 1;
    margin: 0 0 0 10px;
  }
  & > div:hover {
    background-color: ${Colors.primaryLight};
    & div > * {
      color: #FFFFFF !important;
    }
  }
`;

export const StyledPerson = styled.div`
  display: inline-block;
  cursor: pointer;
  background: url(${person.src}) no-repeat 15px 18px;
  padding: 20px 30px;
  min-width: 86px;
  min-height: 77px;
  border-radius: 8px 0 0 8px;
  @media (max-width: ${size.laptop}) {
    border-radius: 8px 0 0 0;
  }
  @media ${device.mobileS} {
    width: 50%;
  }
  @media ${device.laptop} {
    width: 25%;
  }
`;

export const StyledChild = styled.div`
  display: inline-block;
  cursor: pointer;
  background: url(${child.src}) no-repeat 8px 20px;
  padding: 20px 30px;
  min-width: 86px;
  min-height: 77px;
  @media (max-width: ${size.laptop}) {
    border-radius: 0 8px 0 0;
  }
  @media ${device.mobileS} {
    width: 50%;
  }
  @media ${device.laptop} {
    width: 25%;
  }
`;

export const StyledInfant = styled.div`
  display: inline-block;
  cursor: pointer;
  background: url(${infant.src}) no-repeat 15px 20px;
  padding: 20px 30px;
  min-width: 86px;
  min-height: 77px;
  @media (max-width: ${size.laptop}) {
    border-radius: 0 0 0 8px;
  }
  @media ${device.mobileS} {
    width: 50%;
  }
  @media ${device.laptop} {
    width: 25%;
  }
`;

export const StyledStars = styled.div`
  display: inline-block;
  cursor: pointer;
  background: url(${star.src}) no-repeat 13px 22px;
  padding: 20px 30px;
  min-width: 86px;
  min-height: 77px;
  border-radius: 0 8px 8px 0;
  @media (max-width: ${size.laptop}) {
    border-radius: 0 0 8px 0;
  }
  @media ${device.mobileS} {
    width: 50%;
  }
  @media ${device.laptop} {
    width: 25%;
  }
  
`;

export const SearchLabel = styled.label`
  font-size: 12px;
  font-weight: 800;
  color: #333;
  margin-bottom: 4px;
  cursor: pointer;
`

export const DateLabel = styled.label<IDateLabel>`
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: ${(props) => props.selected ? "#333" : "#777"};
`

export const CalendarContainer = styled.div`
  position: absolute;
  height: auto;
  margin: 40px 0 0 -40px;
  max-width: 290px;
  z-index: 20;
  padding: 30px 10px;
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
    color: ${Colors.darkRed};
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: ${Colors.gray};
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
    background: ${Colors.mainBackground};
  }
  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: ${Colors.mainBackground};
  }
  .react-calendar__tile--hasActive {
    background: ${Colors.primaryColor};
  }
  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: ${Colors.primaryColor};
  }
  .react-calendar__tile--active {
    background: ${Colors.primaryColor};
    color: white;
  }
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: ${Colors.primaryColor};
  }
  .react-calendar--selectRange .react-calendar__tile--hover {
    background-color: ${Colors.gray};
  }

`

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 15;
`