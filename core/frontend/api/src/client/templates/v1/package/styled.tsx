import styled from "styled-components";
import { device, size } from "../styled";
import { Field } from "formik";


interface IDetailsContainer {
  isExpanded: boolean;
}

interface IStep {
  currentStep?: boolean;
}

interface IButtonContainer {
  hasOneChild?: boolean;
}

interface ICustomButton {
  isActive?: boolean;
}

interface IPaymentDiv {
  isError?: boolean;
}

interface ITicketItem {
  alignEnd?: boolean;
}

export const PackagesLayout = styled.div`
  margin-top: 40px;
  width: 100%;
  display: flex;
  gap: 20px;
  flex-direction: column;

  @media ${device.laptopL} {
    flex-direction: row;
  }

`;

export const FiltersContainer = styled.div`
  display: flex;
  align-items: flex-start;
  min-width: 288px;
`;

export const PackagesContainer = styled.div`
  width: 100%;
`;

export const LoadMoreButton = styled.button`
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.primaryLight} 0%, ${({ theme }) => theme.colors.primaryColor} 100%);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;

  color: ${({ theme }) => theme.colors.white};

  padding: 7px 33px;

  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 1.5;

  text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);

  border: none;
  outline: none;
  cursor: pointer;

  transition: background .4s ease-in-out;

  :hover {
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.primaryColorHover} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
    transition: background .4s ease-in-out;
  }
`;


/* start Packages styles */

export const CardWrapper = styled.div`
  padding: 14px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.14);
  border-radius: 10px;
  display: flex;
  width: 100%;
  margin-bottom: 10px;

  @media screen and (max-width: ${size.laptop}) {
    flex-direction: column;
  }
`;

export const ImageContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;
  width: 340px;
  border-radius: 10px;
  padding: 10px;
  margin-right: 25px;
  position: relative;

  .package-image {
    height: 100%;
    width: 100%;
  }

  @media screen and (max-width: ${size.laptop}) {
    flex-direction: column;
    max-width: 100%;
    min-height: 300px;
    width: 100%;

    margin-bottom: 10px;
  }
`;
export const PackageDetailsWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  &:first-child {
    flex: 1;
  }

  @media screen and (max-width: ${size.tablet}) {
    max-width: 100%;
    width: 100%;
  }
`;

export const PackageMain = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const PackageMainContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 10px;
  @media screen and (max-width: ${size.tablet}) {
    flex-direction: column;
  }
`;

export const PackageDetailsContainer = styled.div`
  display: flex;
`;

export const PackageDescriptionContainer = styled.div`

`;

export const PackageServicesContainer = styled.div`
`;

export const ServiceItem = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const PackageDescription = styled.p`
  font-family: 'Poppins', sans-serif;
  font-style: italic;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;

  color: rgba(86, 82, 82, 0.97);
`;

export const PackageDetails = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (max-width: ${size.tablet}) {
    width: 100%;
    flex: 1;
  }
`;

export const PackageTitle = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: clamp(18px, 3vw, 29px);
  line-height: 1.5;
  margin: 0;
  max-width: 390px;

  color: ${({ theme }) => theme.colors.black};

  @media screen and (max-width: ${size.tablet}) {
    max-width: 100%;
  }

`;

export const AddressText = styled.div`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;

  color: rgba(0, 0, 0, 0.6);
`;

export const RatingContainer = styled.div`
  display: flex;
  gap: 3px;
  margin-bottom: 11px;
`;

export const PackageItems = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.primaryColorHover};
  border-radius: 30px;
  width: 100%;
  justify-content: space-between;
  padding: 2px 10px;
  margin-bottom: 8px;

  @media screen and (max-width: ${size.mobileL}) {
    border-radius: 5px;
  }
`;

export const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
`;

export const ItemText = styled.p`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 1.5;

  color: ${({ theme }) => theme.colors.white};
`;

export const PricingDetailsWrapper = styled.div`
  display: flex;
  padding: 10px 0;
  align-items: flex-end;
  flex-direction: column;
  justify-content: space-between;

  @media screen and (max-width: ${size.tablet}) {
    flex-direction: row;
  }
`;

export const PriceTextContainer = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;

  @media screen and (max-width: ${size.tablet}) {
    align-items: flex-start;
  }
`;

export const StartingPriceContainer = styled.div`

  display: flex;
  align-items: flex-end;
  margin: 0 0 2px 0;
  gap: 5px;

  p {
    margin: 0 10px 0 0;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 1;
    text-align: left;
    float: left;
    display: inline-block;
    color: #646464;
  }

  @media screen and (max-width: ${size.tablet}) {
    align-items: flex-start;
  }
`;

export const StartingPriceText = styled.h2`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 29px;
  line-height: 1;
  text-align: right;
  float: right;
  display: inline-block;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.accentColor};

  @media screen and (max-width: ${size.tablet}) {
    text-align: left !important;
    float: left !important;
  }
`;

export const AdultNightText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 2px 0;

  color: ${({ theme }) => theme.colors.black};
`;

export const TaxText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 1.5;
  margin: 0;

  color: #646464;
`;

export const BookNowContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 12px;
`;
export const BookNowButton = styled.a`
  background: linear-gradient(180deg, #7ACD13 0%, #5D9519 100%);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;

  color: ${({ theme }) => theme.colors.white};

  padding: 7px 33px;

  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.5;
  white-space: nowrap;

  text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);

  border: none;
  outline: none;
  cursor: pointer;

  transition: background .4s ease-in-out;

  :hover {
    background: linear-gradient(180deg, rgba(122, 205, 19, 0.63) 0%, rgba(93, 149, 25, 0.63) 100%);
    transition: background .4s ease-in-out;
  }

  @media screen and ${device.tablet} {
    font-size: 20px;
  }
  
`;

export const DetailsContainer = styled.div`
  display: flex;
  gap: 40px;
`;

export const ServicesTextContainer = styled.div<IDetailsContainer>`
  display: flex;
  gap: 8px;
  cursor: pointer;

  p {
    color: ${({ isExpanded, theme }) => isExpanded ? theme.colors.primaryColor : "rgba(0, 0, 0, 0.7)"} !important;
  }
`;

export const ServicesDescriptionText = styled.a`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  user-select: none;
  &:hover {
    text-decoration: underline;
  }
`;

export const DescriptionContainer = styled.div`

`;

/* end Packages styles */

/*-------------------------------------------------------------------------------*/

/* start Filters styles */

export const FiltersWrapper = styled.div`
  max-width: 100%;
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.11);

  display: flex;
  justify-content: space-between;
  flex-direction: row;
  border-radius: 8px;

  @media screen and ${device.laptopL} {
    flex-direction: column;
    max-width: 290px;
  }

`;

export const FiltersHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
  width: 100%;
  cursor: pointer;

  @media screen and ${device.laptopL} {
    &:not(:last-of-type) {
      border-bottom: 1px #C4C4C4 solid;
    }
  }
`;

export const FiltersHeader = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: clamp(14px, 2vw, 21px);
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.black};
  margin: 0;
  text-transform: capitalize;
  letter-spacing: 0.15px;
`;

export const ResetText = styled.span`
  margin: 0;
  font-family: 'Lato', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;

  letter-spacing: 0.15px;
  color: ${({ theme }) => theme.colors.primaryColor};
  &:hover {
    text-decoration: underline;
  }
`;

/* end Filters styles */


/** CHECKOUT PAGE **/

export const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  gap: 17px;
  margin-top: 53px;

  @media (max-width: ${size.laptop}) {
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
  }
`;

export const HotelsHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 24px 33px;
  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white};
  flex-direction: column;

  @media screen and ${device.laptopL} {
    flex-direction: row;
    gap: 10px;
    padding: 12px;
  }
`;

export const HotelsHeader = styled.h2`
  font-family: "Poppins", sans-serif;
  font-size: 32px;
  font-weight: 400;
  color: #434343;
  line-height: 1.5;
  margin: 0;
`;

export const HotelsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CartStepsWrapper = styled.div`
  display: flex;
  position: relative;
  gap: 20px;

  @media screen and (max-width: 1200px) {
    gap: 15px;
  }
`;

export const StepWrapper = styled.div<IStep>`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;

  border: 1px solid ${({ theme }) => theme.colors.accentColor};

  background: ${({ currentStep, theme }) => currentStep ? theme.colors.accentColor : theme.colors.white};
  color: ${({ currentStep, theme }) => currentStep ? theme.colors.white : theme.colors.accentColor};

  border-radius: 50%;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    right: -21px;
    top: 50%;
    transform: translateY(-50%);
    height: 1px;
    width: 20px;
    border-bottom: 1px dashed #A29E9E;
  }

  @media screen and (max-width: 1200px) {
    height: 30px;
    width: 30px;

    font-size: 16px;

    &:not(:last-child)::after {
      content: "";
      position: absolute;
      right: -16px;
      top: 50%;
      transform: translateY(-50%);
      height: 1px;
      width: 15px;
      border-bottom: 1px dashed #A29E9E;
    }
  }
`;

/** FIRST STEP **/

export const PackageOffers = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const PlusContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const HotelMainInfosContainer = styled.div`
  flex: 1;
`;

export const HotelInclusivesContainer = styled.div`
  flex: 1;
`;

export const Flights = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const PackageItemsWrapper = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.accentColor};
  border-radius: 10px;
`;

export const PackageItemsHeaderContainer = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.accentColor};
`;

export const PackageHeader = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 1.5;
  margin: 0;

  color: ${({ theme }) => theme.colors.accentColor};

`;

export const HotelDetailsWrapper = styled.div`
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.accentColor};
  background: ${({ theme }) => theme.colors.white};
`;

export const HotelDetailsHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 36px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.accentColor};
  gap: 12px;
  @media screen and (max-width: ${size.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const HotelName = styled.h3`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 26px;
  line-height: 1.5;

  color: ${({ theme }) => theme.colors.accentColor};
`;

export const StarsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const StarsText = styled.p`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;

  color: ${({ theme }) => theme.colors.black};

`;

export const HotelAddressContainer = styled.div`
`;

export const HotelAddress = styled.p`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 1.55;

  color: ${({ theme }) => theme.colors.greyBorder};

`;

export const HotelTicketInfosContainer = styled.div`
  border: 1px dashed ${({ theme }) => theme.colors.accentColor};
  padding: 32px 22px;
  margin: 10px 0;
  gap: 40px;
  display: flex;
  justify-content: space-between;

  position: relative;

  @media screen and (max-width: 1300px) {
    flex-direction: column;
    gap: 20px;
  }
`;

export const HotelInfos = styled.div`
  padding: 6px 25px;
`;

export const IncludedText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;

  color: ${({ theme }) => theme.colors.black};
`;

export const TicketInfosItems = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: ${size.tablet}) {
    flex-direction: column;
    gap: 15px;
  }
`;

export const TicketInfosItem = styled.div<ITicketItem>`
  display: flex;
  flex-direction: column;
  justify-content: ${({ alignEnd }) => alignEnd ? "flex-end" : "center"};

  @media screen and (max-width: ${size.tablet}) {
    padding-bottom: 15px;
    :not(:last-child) {
      border-bottom: 1px dashed ${({ theme }) => theme.colors.greyBorder};
    }
  }
`;

export const RoomType = styled.p`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5;

  color: ${({ theme }) => theme.colors.black};
`;

export const DetailsText = styled.div`
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;

  color: ${({ theme }) => theme.colors.greyBorder};
`;

export const FlightsSectionPackage = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;
`;

export const TextContainer = styled.div`

`;

export const TextInfoItem = styled.p`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  margin: 0 0 10px 0;

  color: ${({ theme }) => theme.colors.greyBorder};

  a {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.accentColor};

    &:hover {
      color: ${({ theme }) => theme.colors.accentColor};
    }
  }
`;

export const PackagePriceWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
  padding: 22px 34px;
  border: 1px ${({ theme }) => theme.colors.borderOutline} solid;
  border-radius: 10px;
  gap: 10px;
`;

export const PackagePriceText = styled.h4`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 32px;
  line-height: 1.5;
  margin: 0;

  color: #434343;

  @media screen and (max-width: 590px) {
    font-size: 18px;
  }
`;

export const PackagePrice = styled.h4`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 36px;
  line-height: 1.5;
  margin: 0;

  color: ${({ theme }) => theme.colors.accentColor};

  @media screen and (max-width: 590px) {
    font-size: 18px;
  }
`;


/** END FIRST STEP **/

/** Second Step **/

export const FormGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;

  @media screen and (max-width: ${size.laptop}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const PassengerDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PassengerHeader = styled.h2`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 36px;
  line-height: 1.5;
  color: #434343;
`;

export const PassengerHeaderContainer = styled.div`

`;

export const PassengerItem = styled.div`
  width: 100%;
  border: 1px ${({ theme }) => theme.colors.borderOutline} solid;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white};
  padding: 20px 28px;
  margin-bottom: 8px;

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InputLabel = styled.label`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  color: #434343;
`;

export const TextInput = styled.input`
  outline: none;
  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
  border-radius: 10px;
  padding: 11px 18px;
  font-size: 18px;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
  line-height: 1.5;
  color: #434343;

  ::placeholder {
    color: #ADADAD;
  }
`;

export const DottedLines = styled.hr`
  border: none;
  border-top: 1px dashed #A29E9E;
  overflow: visible;
  text-align: center;
  height: 1px;
  flex: 1;
`;

export const ButtonsContainer = styled.div<IButtonContainer>`
  display: flex;
  justify-content: ${({ hasOneChild }) => hasOneChild ? "flex-end" : "space-between"};

  @media screen and (max-width: ${size.tablet}) {
    flex-direction: column;
    gap: 20px;
  }
`;

export const CustomButton = styled.button<ICustomButton>`
  background: ${({ isActive }) => isActive ? "linear-gradient(180deg, #7ACD13 0%, #5D9519 100%)" : "linear-gradient(180deg, #D0D0D0 0%, #919191 100%)"};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: clamp(18px, 2vw, 32px);
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  cursor: pointer;
  border: none;
  outline: none;
  padding: 10px 15px;
  justify-content: space-between;

  gap: 20px;

  span {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.white};

    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 28px;
    line-height: 1.5;
    margin: 0;
    border-radius: 50%;
    text-align: center;

    color: ${({ isActive, theme }) => isActive ? theme.colors.accentColor : "#959595"};
  }

  @media screen and (max-width: ${size.tablet}) {
    justify-content: center;

    span {
      font-size: 18px;
      width: 30px;
      height: 30px;
    }
  }

  :is(:disabled) {
    cursor: not-allowed;
    background: linear-gradient(180deg, #D0D0D0 0%, #919191 100%) !important;

    span {
      color: #959595;
    }
  }
`;

export const ErrorText = styled.span`
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;

  color: #e74c3c;
`;

export const StyledField = styled(Field)`
  outline: none;
  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
  border-radius: 10px;
  padding: 11px 18px;
  font-size: 18px;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
  line-height: 1.5;
  color: #434343;

  ::placeholder {
    color: #ADADAD;
  }
`;

/** END SECOND STEP **/

/** FOURTH STEP **/

export const Payment = styled.div<IPaymentDiv>`
  background: ${({ isError, theme }) => isError ? theme.colors.white : "none"};
  display: flex;
  align-items: center;
  padding: 15px 0;
  gap: 15px;

  @media screen and (max-width: ${size.laptop}) {
    flex-direction: column;
  }
`;

export const PaymentStatusImageContainer = styled.div`

`;

export const PaymentStatusDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const PaymentStatusTitle = styled.h3`
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 28px;
  line-height: 1.2;
  text-align: center;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  margin: 0;
  color: #77838F;
`;

export const PaymentErrorText = styled.h4`
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 1.5;
  text-align: center;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  margin: 0;
  color: #FF1515;
`;

export const PaymentInfoText = styled.h5`
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 28px;
  line-height: 1.1;
  margin: 0;
  text-align: center;
  letter-spacing: 0.5px;

  color: ${({ theme }) => theme.colors.accentColor};
`;

export const RedirectText = styled.p`
  font-family: 'Nunito', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;

  text-align: center;
  letter-spacing: 0.5px;
  margin: 20px 0 0 0;
  color: #474747;

  a {
    color: ${({ theme }) => theme.colors.accentColor};
  }
`;

export const PaymentStep = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/** FOURTH STEP CONTAINER **/

/** BOOKING CONFIRMED  **/

export const BookingConfirmedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FinalStep = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  gap: 20px;

  @media screen and (max-width: ${size.laptop}) {
    flex-direction: column;
  }
`;

export const ConfirmedText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
`;

export const DottedLinesContainer = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 18px 0;
  width: 100%;
  @media screen and (max-width: ${size.laptop}) {
    display: none;
  }
`;

export const SuccessText = styled.h3`
  font-family: 'Metropolis', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 80px;
  line-height: 1;
  text-align: center;
  margin: 0;
  color: ${({ theme }) => theme.colors.accentColor};
`;

export const EmailDetailsText = styled.h5`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 36px;
  line-height: 1.5;

  text-align: center;

  color: #77838F;
`;

/** END BOOKING CONFIRMED  **/

/** CART STYLES **/

export const CartTicketsWrapper = styled.div`
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 18px 20px;
`;

export const CartHotelSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-bottom: 1px dashed #A29E9E;
  padding-bottom: 12px;
`;

export const CartFlightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 12px;
`;

export const HotelPackageTitle = styled.h4`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 1.5;
  margin: 0;

  color: ${({ theme }) => theme.colors.accentColor};
`;

export const TicketHotelTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const HotelPackageAddress = styled.h4`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin: 0;

  color: rgba(0, 0, 0, 0.6);
`;

export const RoomDetailsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;


export const TicketItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TicketText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;

  color: ${({ theme }) => theme.colors.black};
`;

export const CartFooterWrapper = styled.div`
  padding: 25px 31px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TotalText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 1.5;
  margin: 0;

  color: #434343;
`;

export const TotalPrice = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1.5;
  margin: 0;

  color: #434343;
`;

export const CartHeaderWrapper = styled.div`
  padding: 25px 31px;
  border-bottom: 1px dashed #A29E9E;
  display: flex;
  align-items: center;
`;

export const CartHeader = styled.h2`
  font-family: "Poppins", sans-serif;
  font-size: clamp(18px, 4vw, 32px);
  font-weight: 400;
  color: #434343;
  line-height: 1.5;
  margin: 0;
`;

export const CartHotelInfo = styled.div`
`;

export const CartItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 23px;
  border-bottom: 1px dashed #A29E9E;
  padding: 24px 20px;
`;

export const CartWrapper = styled.div`
  flex: 1;
  max-width: 433px;
  height: auto;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
  border-radius: 8px;
  @media (max-width: ${size.laptop}) {
    max-width: 100%;
  }
`;

export const FlightTimeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HotelCartItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const HotelCartItemElement = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const RoomDetails = styled.p`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;

  color: ${({ theme }) => theme.colors.black};
`;

export const PackageHotelInfos = styled.div`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;

  color: ${({ theme }) => theme.colors.greyBorder};
`;

/** END CART STYLES **/

/** END CHECKOUT PAGE**/