import styled from "styled-components";
import Calendar from "react-calendar";

export const Overlay = styled.a`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 15;
`;

export const CalendarPopup = styled(Calendar)`
  width: 100%;
  position: absolute;
  z-index: 16;
  padding: 0 12px 12px;
  border: none;
  border-radius: 12px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  user-select: none;

  .react-calendar {
    width: 318px;
    max-width: 100%;
    background: ${({ theme }) => theme.colors.white};
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
    background-color: ${({ theme }) => theme.colors.white};
    display: block;
    cursor: pointer;
  }

  .react-calendar__navigation .react-calendar__navigation__next2-button:enabled:hover,
  .react-calendar__navigation .react-calendar__navigation__prev2-button:enabled:focus {
    background-color: ${({ theme }) => theme.colors.primaryColor};
    color: ${({ theme }) => theme.colors.white};
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
    background: ${({ theme }) => theme.colors.white};
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.black};
  }

  .react-calendar__tile:disabled {
    background-color: ${({ theme }) => theme.colors.greyBorder};
    cursor: not-allowed;
    color: ${({ theme }) => theme.colors.white};
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: ${({ theme }) => theme.colors.primaryColorHover};
    color: ${({ theme }) => theme.colors.white};
  }

  .react-calendar__tile--now {
    border: 1px solid ${({ theme }) => theme.colors.primaryColorHover};
    color: ${({ theme }) => theme.colors.primaryColorHover};
  }

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background-color: ${({ theme }) => theme.colors.primaryColorHover};
    color: ${({ theme }) => theme.colors.white};
  }

  .react-calendar__tile--hasActive {
    background: ${({ theme }) => theme.colors.primaryColor};
  }

  .react-calendar__tile--active:enabled:focus {
    background: ${({ theme }) => theme.colors.primaryColor};
  }

  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: #a9d4ff;
  }

  .react-calendar__tile--active {
    background: ${({ theme }) => theme.colors.primaryColor};
    color: ${({ theme }) => theme.colors.white};
  }

  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: ${({ theme }) => theme.colors.primaryColor};
  }

  .react-calendar__navigation__arrow.react-calendar__navigation__next-button,
  .react-calendar__navigation__arrow.react-calendar__navigation__prev-button {
    display: block;
    height: 22px;
    font-size: 24px;
  }

  .react-calendar__navigation__arrow.react-calendar__navigation__next-button:disabled,
  .react-calendar__navigation__arrow.react-calendar__navigation__prev-button:disabled {
    cursor: not-allowed;
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
    background-color: ${({ theme }) => theme.colors.white};
  }

  .react-calendar__month-view__days {
    gap: 5px;
  }

  .react-calendar__navigation button {
    min-width: 30px;
    background: none;
  }

`;