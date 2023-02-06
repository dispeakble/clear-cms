import styled from "styled-components";
import { device, size } from "../../styled";
import { Shadows } from "../../../../assets/design-set";

export const PackageDetailContainer = styled.div`
  background: #FFFFFF;
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.14);
  border-radius: 20px;
  width: 100%;
  padding: 20px;
`;

export const CustomSection = styled.div`
  background: #FFFFFF;
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.14);
  border-radius: 27px;
  width: 65%;
  padding: 2rem;
`;

export const TitleText = styled.div`
  font-weight: 400;
  font-size: 33px;
  line-height: 50px;
  margin: 0;
`;

export const ParaTextBold = styled.p`
  font-weight: bolder;
  font-size: 17px;
  margin: 0;
`;

export const BookingHeadingText = styled.p`
  font-weight: bolder;
  font-size: 17px;
  margin: 0;
  white-space: nowrap;
`;

export const BookingMutedText = styled.div`
  font-size: 17px;
  margin: 0;
  color: #848484;
`;

export const BookingPriceText = styled.p`
  font-size: 36px;
  margin: 0;
  color: #FF840D;
`;

export const BookingCard = styled.div`
  width: 100%;
  border: 2px dashed #FFAC5B;
  border-radius: 10px;
  margin: 10px 0;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  position: relative;
  background: url(${({ theme }) => theme.icon("bookingDetailBg")}) no-repeat center;
  background-size: cover;
`;

export const BookingCardContent = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const BookingCardPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const FlightInformation = styled.div`

`;

export const FlightTakeOffInput = styled.div`
  flex: 1 0 40%;
`;
export const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  margin-top: 6px;

  inputs {
    background: #FFFFFF;
    border: 1px solid #DBDBDB;
    box-shadow: 0 4px 7px rgba(255, 255, 255, 0.25);
    border-radius: 10px;
  }
`;

export const DropdownIcon = styled.div`
  width: 30px;
  height: 48px;
  cursor: pointer;
  background: url(${({ theme }) => theme.icon("dropdown")}) no-repeat left center;
`;


// -------------- inputs section -------------
export const TakeOffInputContainer = styled.div`
  display: flex;
  border: 1px solid #DBDBDB;
  box-shadow: 0 4px 7px rgba(255, 255, 255, 0.25);
  border-radius: 10px;
`;

export const StyledSearchDepartureInput = styled.input`
  flex: 1;
  background: url(${({ theme }) => theme.icon("departure")}) no-repeat 10px center white;
  background-size: 23px 24px;
  padding: 0 0 0 43px;
  width: 100%;
  border: none;
  border-radius: 10px;

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

export const StyledSearchDestinationInput = styled.input`
  flex: 1;
  background: url(${({ theme }) => theme.icon("destination")}) no-repeat 10px center white;
  background-size: 23px 24px;
  padding: 0 0 0 43px;
  line-height: 48px;
  box-sizing: border-box;
  width: 100%;
  border: none;
  border-radius: 10px;

  &::placeholder {
    color: rgba(0, 0, 0, 0.6);
  }

  &:focus {
    &::placeholder {
      font-weight: bold;
    }
  }

  @media ${device.tablet} {
    margin-top: 0;
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

export const AutocompleteList = styled.ul`
  position: absolute;
  z-index: 20;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.primaryColor};
  color: ${({ theme }) => theme.colors.jetBlack};
  list-style: none;

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

export const FlightDetailsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 20px 0;
  gap: 20px;
`;


export const ImageForCompany = styled.div`
  background: url(${({ theme }) => theme.icon("companyImage")}) no-repeat center center white;
`;


export const FlightPort = styled.div`
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
  min-width: 60px;
`;

export const Time = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 60%;
  position: relative;

  .time-dotted {
    border-bottom: 2px dotted #A29E9E;
    height: 2px;
    flex: 1;
  }

  .dot-before, .dot-after {
    border: 2px solid #FF840D;
    width: 8px;
    height: 8px;
    border-radius: 4px;
  }

  .dot-before {
    margin-right: -8px;
  }

  .dot-after {
    margin-left: -8px;
  }

  .takeOffTime, .tandingTime {
    padding-top: 6px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
  }
`;

export const PassengerWrapper = styled.div`
  display: flex;
  border: 1px solid #DBDBDB;
  box-shadow: 0 4px 7px rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  margin: 0 0;
  height: 100%;
  flex: 1 0 40%;
  cursor: pointer;
  padding: 5px 0;
  min-width: 0 !important;

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
export const Passenger = styled.div`
  position: relative;
  cursor: pointer;
  width: 100%;
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


export const ChildIcon = styled.div`
  background: url(${({ theme }) => theme.icon("child")}) no-repeat right center;
  cursor: pointer;
  width: 40px;
  height: 20px;
`;

export const CounterDiv = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
  justify-content: space-between;
`;

export const DivView = styled.div`
  position: relative;
  cursor: pointer;
  width: 100%;
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

export const PassengerDetailsWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-left: 8px;
  width: 100%;
  height: 36px;
  justify-content: space-between;

  .icon-and-title__wrapper {
    width: 60%;
    display: flex;
  }
`;

export const PassengerView = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  top: 50px;
  right: -60px;
  transform: translate(-50%, -10%);
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${Shadows.primaryShadow};
  min-width: 120px;
  padding: 10px;
  z-index: 20;
  border-radius: 25px;
  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
`;

export const SpanDiv = styled.span`
  display: inline-block;
  font-weight: bold;
  width: 100%;
  text-align: left;
  margin-left: 10px !important;
  white-space: nowrap;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const BookingDetailContainer = styled.div`
  margin-top: 1rem;
`;

export const BookingButton = styled.button`
  padding: 10px;
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.primaryLight} 0%, ${({ theme }) => theme.colors.primaryColor} 100%);
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  font-weight: bolder;
  font-size: 20px;
  border: none;
  text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
  cursor: pointer;

  &:hover {
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.primaryColorHover} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
  }
`;

export const PackageCharterContainer = styled.div`
  margin-top: 3rem;
  padding-left: 3rem;
`;

export const BookingConditionsContainer = styled.div`
  margin-top: 3rem;
  padding-left: 3rem;
`;

export const CustomHeading = styled.p`
  position: relative;
  font-weight: 600;
  font-size: 26px;
  line-height: 50px;
  color: #FF840D;
  border-bottom: 2px solid #dedede;
`;

export const QuotedPara = styled.p`
  position: relative;

  &:before {
    content: url(${({ theme }) => theme.icon("quoteUp")});
    position: absolute;
    top: -10px;
    left: -50px;
  }
;

  &:after {
    content: url(${({ theme }) => theme.icon("quoteDown")});
    position: absolute;
    bottom: -20px;
    right: 0;
  }

  text-align: justify;;
`;

export const BetweenInputsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  @media ${device.tablet} {
    flex: 1;
    max-width: 50px;
  }
`;

export const BetweenInputs = styled.div`
  border-bottom: 1px dotted grey;
  height: 0;
  width: 100%;
`;
