import styled from "styled-components";
import Image from "next/image";
import {Field} from "formik";


interface IDetailsContainer{
    isExpanded: boolean;
}

export const size = {
    mobileS: "320px",
    mobileM: "375px",
    mobileL: "425px",
    tablet: "768px",
    laptop: "1024px",
    laptopL: "1440px",
    desktop: "1919px",
    desktopL: "2560px"
};

export const PackagesLayout = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  
  @media screen and (max-width: 1300px){
    flex-direction: column;
  }
  
`


export const FiltersContainer = styled.div`
  display: flex;
  align-items: flex-start;
  min-width: 288px;
`

export const PackagesContainer = styled.div`
    width: 100%;
`

export const LoadMoreButton = styled.button`
  background: linear-gradient(180deg, #FF840D 0%, #DC6B03 100%);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  
  color: #FFFFFF;
  
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
  
  :hover{
    background: linear-gradient(180deg, #FFAC5C 0%, #E78F3C 100%);
    transition: background .4s ease-in-out;
  }
`


/* start Packages styles */

export const CardWrapper = styled.div`
  padding: 14px;
  background: #FFFFFF;
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.14);
  border-radius: 27px;
  display: flex;
  width:100%;
  margin-bottom: 10px;

  @media screen and (max-width: ${size.laptop}){
    flex-direction: column;
  }
`

export const ImageContainer = styled.div`
  padding: 11px;
  background: #ffffff;
  width: 340px;
  border-radius: 10px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.18);
  margin-right: 25px;
  position: relative;
  
  .package-image{
    height: 100% ;
    width: 100% ;
  }

  @media screen and (max-width: ${size.laptop}){
    flex-direction: column;
    max-width: 100%;
    min-height: 300px;
    width:100%;
    
    margin-bottom: 10px;
  }
`
export const PackageDetailsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  
  @media screen and (max-width: ${size.tablet}){
    max-width: 100%;
    width: 100%;
  }
`

export const PackageMain = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

export const PackageMainContainer = styled.div`
  display: flex;
  flex: 1;
  
  @media screen and (max-width: ${size.tablet}){
    flex-direction: column;
  }
`

export const PackageDetailsContainer = styled.div`
  display: flex;
`

export const PackageDescriptionContainer = styled.div`
    
`

export const PackageServicesContainer = styled.div`
`

export const ServiceItem = styled.div`
  
`

export const PackageDescription = styled.p`
  font-family: 'Poppins', sans-serif;
  font-style: italic;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;

  color: rgba(86, 82, 82, 0.97);
`

export const PackageDetails = styled.div`
  display: flex;
  flex-direction: column;
  
  @media screen and (max-width: ${size.tablet}){
    width: 100%;
    flex: 1;
  }
`

export const PackageTitle = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: clamp(18px, 3vw, 29px);
  line-height: 1.5;
  margin: 0;
  max-width: 390px;

  color: #000000;
  
  @media screen and (max-width: ${size.tablet}){
    max-width: 100%;
  }
  
`

export const AddressText = styled.div`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;

  color: rgba(0, 0, 0, 0.6);
`

export const RatingContainer = styled.div`
  display: flex;
  gap: 3px;
  margin-bottom: 11px;
`

export const PackageItems = styled.div`
  display: flex;
  align-items: center;
  background: #FFAC5C;
  border-radius: 27px;
  max-width: 425px;
  justify-content: space-between;
  padding: 2px 10px;
  margin-bottom: 8px;
  
  @media screen and (max-width: ${size.mobileL}){
    flex-direction: column;
    gap: 8px;
    max-width: 100%;
    width: 100%;
    border-radius:5px;
  }
`

export const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const ItemText = styled.p`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 1.5;

  color: #FFFFFF;
`

export const PricingDetailsWrapper = styled.div`
  display: flex;
  flex: 1;
  padding: 10px 0;
  align-items: flex-end;
  flex-direction: column;
  justify-content: space-between;
  
  @media screen and (max-width: ${size.tablet}){
    flex-direction: row;
  }
`

export const PriceTextContainer = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  
  @media screen and (max-width: ${size.tablet}){
    align-items: flex-start;
  }
`

export const StartingPriceContainer = styled.div`
  
  display: flex;
  align-items: flex-end;
  margin: 0 0 2px 0;

  p{
    margin: 0 10px 0 0;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 1;
    text-align:left;
    float:left;
    display: inline-block;
    color: #646464;
  }

  @media screen and (max-width: ${size.tablet}){
    p{
      display: none;
      margin-right: 0;
    }
    
    align-items: flex-start;
  }
`

export const StartingPriceText = styled.h2`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 29px;
  line-height: 1;
  text-align:right;
  float:right;
  display: inline-block;

  color: #FF840D;

  @media screen and (max-width: ${size.tablet}){
    text-align:left !important;
    float:left !important;
  }
`

export const AdultNightText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 2px 0;

  color: #000000;
`

export const TaxText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 1.5;
  margin: 0;

  color: #646464;
`

export const ButtonContainer = styled.div`
    
`

export const BookNowButton = styled.button`
  background: linear-gradient(180deg, #7ACD13 0%, #5D9519 100%);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  
  color: #FFFFFF;
  
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
  
  :hover{
    background: linear-gradient(180deg, rgba(122, 205, 19, 0.63) 0%, rgba(93, 149, 25, 0.63) 100%);
    transition: background .4s ease-in-out;
  }
`

export const DetailsContainer = styled.div`
  display: flex;
  gap: 40px;
`

export const ServicesTextContainer = styled.div<IDetailsContainer>`
  display: flex;
  gap: 8px;
  cursor: pointer;
  
  p{
    color: ${({isExpanded}) => isExpanded ? "#DC6B03" : "rgba(0, 0, 0, 0.7)"} !important;
  }
`

export const ServicesDescriptionText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 13px;
  line-height: 1.5;

  margin:0;
`

export const DescriptionContainer = styled.div`
  
`

/* end Packages styles */

/*-------------------------------------------------------------------------------*/

/* start Filters styles */

export const FiltersWrapper = styled.div`
  max-width: 290px;
  width:100%;
  background: #FFFFFF;
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.11);
  
  display: flex;
  flex-direction: column;
  border-radius: 8px;

  @media screen and (max-width: 1300px){
    flex-direction: row;
    justify-content: space-between;
    max-width: 100%;
  }

  @media screen and (max-width: 500px){
    flex-direction: column;
  }
`

export const FiltersHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 22px 11px;
  align-items: center;
  border-bottom: 1px #C4C4C4 solid;
  width: 100%;
  cursor: pointer;
  
  
`

export const FiltersHeader = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: clamp(14px, 2vw, 21px);
  line-height: 1.5;
  color: #000000;
  margin: 0;
  text-transform: capitalize;
  letter-spacing: 0.15px;
`

export const ResetText = styled.span`
  margin: 0;
  font-family: 'Lato', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;

  letter-spacing: 0.15px;
  color: #DC6B03;
`

/* end Filters styles */

interface IStep{
    currentStep?: boolean;
}

interface IFlightsDetails{
    expand?: boolean;
}

interface IButtonContainer{
    hasOneChild?: boolean;
}

interface ICustomButton{
    isActive?: boolean;
}

interface IPaymentDiv{
    isError?: boolean;
}

interface ITicketItem{
    alignEnd?: boolean;
}

export const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  gap: 17px;
  margin-top: 53px;
  
  @media(max-width: ${size.laptop}){
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
  }
`

export const CartWrapper = styled.div`
  flex: 1;
  max-width: 433px;
  height: auto;
  background: #FFFFFF;
  box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
  border-radius: 8px;
  @media(max-width: ${size.laptop}){
    max-width: 100%;
  }
`

export const HotelsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const FlightDetails = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 21px;
  border-bottom: 1px solid #FF840D;
`

export const StarsWrapper = styled.div`
  display: flex;
  gap: 4px;
`

export const StarsText = styled.p`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  
  color: #000000;

`

export const PricingRules = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  
  @media screen and (max-width: 480px){
    display: none;
  }
`

export const PricingText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 1.5;

  color: #FF840D;
`

export const DottedLines = styled.hr`
  border: none;
  border-top: 1px dashed #A29E9E;
  overflow: visible;
  text-align: center;
  height: 1px;
  flex: 1;
`

export const Flight = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 60%;
  
  @media screen and (max-width: ${size.laptop}) {
    min-width: 70%;
  }
  
  @media screen and (max-width: 480px){
    width: 100%;
  }
  
`

export const Flights = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const PassengerDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const PassengerItem = styled.div`
  width: 100%;
  border: 1px #DBDBDB solid;
  border-radius: 10px;
  background: #FFFFFF;
  padding: 20px 28px;
  margin-bottom: 8px;
  
  display: flex;
  flex-direction: column;
  gap: 10px;
`
export const PassengerHeaderContainer = styled.div`
    
`

export const PassengerHeader = styled.h2`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 36px;
  line-height: 1.5;
  color: #434343;
`

export const FormGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;

  @media screen and (max-width: ${size.laptop}){
    flex-direction: column;
    align-items: stretch;
  }
`

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const InputLabel = styled.label`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  color: #434343;
`

export const StyledField= styled(Field)`
  outline: none;
  border: 1px solid #DBDBDB;
  border-radius: 10px;
  padding: 11px 18px;
  font-size: 18px;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
  line-height: 1.5;
  color: #434343;

  ::placeholder{
    color: #ADADAD;
  }
`

export const TextInput = styled.input`
  outline: none;
  border: 1px solid #DBDBDB;
  border-radius: 10px;
  padding: 11px 18px;
  font-size: 18px;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
  line-height: 1.5;
  color: #434343;
  
  ::placeholder{
    color: #ADADAD;
  }
`

export const CustomSelect = styled.select`
  outline: none;
  border: 1px solid #DBDBDB;
  border-radius: 10px;
  padding: 11px 18px;
  font-size: 18px;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
  line-height: 1.5;
  color: #434343;
  background: #FFFFFF;

  option:first-child{
    color: #ADADAD;
  }
`


export const FlightDestinationTextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 21px;
  padding-left: 10px;
  position: relative;
  background: white;

  :after{
    content: "";
    position: absolute;
    left: -4px;
    height: 4px;
    width: 4px;
    border: 1px solid #FF840D;
    top: 50%;
    transform: translateY(-50%);
    background: #fff;
    border-radius: 50%;
  }

  @media screen and (max-width: ${size.laptop}) {
    span{
      display: none !important;
    }
  }
`

export const ButtonsContainer = styled.div<IButtonContainer>`
  display: flex;
  justify-content: ${({hasOneChild}) => hasOneChild ? "flex-end" : "space-between"};
  
  @media screen and (max-width:${size.tablet}){
    flex-direction: column;
    gap: 20px;
  }
`

export const CustomButton = styled.button<ICustomButton>`
  background: ${({isActive}) => isActive ? "linear-gradient(180deg, #7ACD13 0%, #5D9519 100%)" : "linear-gradient(180deg, #D0D0D0 0%, #919191 100%)"};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: clamp(18px, 3vw, 36px);
  line-height: 1.5;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  cursor: pointer;
  border: none;
  outline: none;
  padding: 18px 26px;
  justify-content: space-between;

  gap: 20px;

  span{
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;

    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 28px;
    line-height: 1.5;
    margin: 0;
    border-radius: 50% ;
    text-align: center;

    color: ${({isActive}) => isActive ? "#FF8C1D" : "#959595"};
  }

  @media screen and (max-width:${size.tablet}){
    justify-content: center;

    span{
      font-size: 18px;
      width: 30px;
      height: 30px;
    }
  }

  :is(:disabled){
    cursor: not-allowed;
    background: linear-gradient(180deg, #D0D0D0 0%, #919191 100%) !important;
    span{
      color: #959595;
    }
  }
`

export const FlightDepartureTextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 21px;
  padding-right: 10px;
  position: relative;
  background: white;

  :after{
    content: "";
    position: absolute;
    right: -4px;
    height: 4px;
    width: 4px;
    border: 1px solid #FF840D;
    top: 50%;
    transform: translateY(-50%);
    background: #fff;
    border-radius: 50%;
  }

  @media screen and (max-width: ${size.laptop}) {
    span{
      display: none !important;
    }
  }
`

export const FlightLocationsText = styled.p`
  font-family: 'Poppins', sans-serif;
  color: #000000;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.5;
  margin: 0;
`

export const FlightDuration = styled.p`
  font-family: 'Poppins', sans-serif;
  color: #000000;
  font-weight: 500;
  font-size: 16px;
  padding: 0 10px;
  background: #ffffff;
  line-height: 1.5;
  margin: 0;
`

export const HotelsHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 24px 33px;
  border: 1px solid #DBDBDB;
  border-radius: 10px;
  background: #ffffff;
  
  @media screen and (max-width: 480px){
    flex-direction: column;
    gap: 10px;
    padding: 12px;
  }
`

export const HotelsHeader = styled.h2`
  font-family: "Poppins", sans-serif;
  font-size: clamp(18px, 3vw, 36px);
  font-weight: 400;
  color: #434343;
  line-height:1.5;
  margin: 0;
`

export const CartHeaderWrapper = styled.div`
  padding: 25px 31px;
  border-bottom: 1px dashed #A29E9E;
  display: flex;
  align-items: center;
`

export const CartHeader = styled.h2`
  font-family: "Poppins", sans-serif;
  font-size: clamp(18px, 4vw, 32px);
  font-weight: 400;
  color: #434343;
  line-height:1.5;
  margin: 0;
`

export const FLightProviderImg = styled(Image)`
  height: 20px !important;
`

export const CartItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 23px;
  border-bottom: 1px dashed #A29E9E;
  padding: 24px 20px;
`

export const CartHotelInfo = styled.div`
`

export const HotelName = styled.h3`
  margin:0;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 26px;
  line-height: 1.5;
  
  color: #FF840D;
`

export const CartStepsWrapper = styled.div`
  display: flex;
  position: relative;
  gap: 20px;
  
  @media screen and (max-width: 1200px){
    gap: 15px;
  }
`
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
  
  border: 1px solid #FF8C1D;
  
  background: ${({currentStep}) => currentStep ? "#FF8C1D" : "#FFFFFF"};
  color:  ${({currentStep}) => currentStep ? "#FFFFFF" : "#FF8C1D"};
  
  border-radius:50%;
  
  &:not(:last-child)::after{
    content: "";
    position: absolute;
    right: -21px;
    top: 50%;
    transform: translateY(-50%);
    height: 1px;
    width: 20px;
    border-bottom: 1px dashed #A29E9E;
  }
  
  @media screen and (max-width: 1200px){
    height: 30px;
    width: 30px;
    
    font-size: 16px;

    &:not(:last-child)::after{
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
  
  
`

export const HotelCartItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

export const HotelCartItemElement = styled.div`
  display: flex;
  justify-content: space-between;
`

export const RoomType = styled.p`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5;

  color: #000000;
`

export const FlightTimeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const TimeText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #000000;
  line-height: 1.5;
  margin: 0;
  
`

export const DateText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #707070;
  line-height: 1.5;
  margin: 0;
  
`

export const DepartureDestinationText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #000000;
  line-height: 1.5;
  margin: 0;
`

export const DepartureTextWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding-right: 10px;
  position: relative;
  background: white;

  :after{
    content: "";
    position: absolute;
    right: -4px;
    height: 4px;
    width: 4px;
    border: 1px solid #FF840D;
    top: 50%;
    transform: translateY(-50%);
    background: #fff;
    border-radius: 50%;
  }
`

export const DestinationTextWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding-left: 10px;
  position: relative;
  background: white;

  :after{
    content: "";
    position: absolute;
    left: -4px;
    height: 4px;
    width: 4px;
    border: 1px solid #FF840D;
    top: 50%;
    transform: translateY(-50%);
    background: #fff;
    border-radius: 50%;
  }
`

export const FlightExpandDetails = styled.div<IFlightsDetails>`
  padding: 10px;
  display: ${({expand}) => expand ? "block" : "none"};
  transition: height .5s ease-in-out;
  overflow: hidden;
`

export const FlightDescriptionContainer = styled.div`
  padding: 25px 0;
  border-bottom: 1px solid #FF840D;
  margin-bottom: 5px;
`

export const HotelDetailsWrapper = styled.div`
  border-radius: 10px;
  border: 1px solid #FF840D;
  background: #FFFFFF;
`

export const HotelDetailsHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 36px;
  border-bottom: 1px solid #FF840D;
  gap: 12px;
  @media screen and (max-width:${size.tablet}){
    flex-direction: column;
    align-items: stretch;
  }
`

export const HotelAddressContainer = styled.div`
`

export const HotelAddress = styled.p`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 1.55;

  color: #848484;

`

export const HotelTicketInfosContainer = styled.div`
  border: 1px dashed #FF840D;
  padding: 32px 22px;
  margin: 10px 0;
  
  position: relative;
`

export const TopLeftCircle = styled.div`
  position: absolute;
  z-index: 99;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  background: #ffffff;
`
export const TopRightCircle = styled.div`
  position: absolute;
  z-index: 99;
  top: 0;
  left: 100%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
`
export const BottomLeftCircle = styled.div`
  position: absolute;
`
export const BottomRightCircle = styled.div`
  position: absolute;
`


export const HotelInfos = styled.div`
    padding: 6px 25px;
`

export const TicketInfosItem = styled.div<ITicketItem>`
  display: flex;
  flex-direction: column;
  justify-content: ${({alignEnd}) => alignEnd ? 'flex-end' : 'center'};
  
  @media screen and (max-width: ${size.tablet}){
    padding-bottom: 15px;
    :not(:last-child){
      border-bottom: 1px dashed #848484;
    }
  }
`

export const DetailsText = styled.div`
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;

  color: #848484;
`

export const TicketInfosItems = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: ${size.tablet}){
    flex-direction: column;
    gap: 15px;
  }
`

export const FlightInfosTime = styled.p`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  color: #000000;
  margin: 0;
  
  @media screen and (max-width: 480px){
    font-size: 14px;
  }
`

export const FlightInfosLocationText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5;

  color: #707070;
  margin: 0;
  
  span{
    font-weight: 500;
    margin: 0;
  }

  @media screen and (max-width: 480px){
    font-size: 14px;
  }
`
export const FlightAircraft = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;

  color: #707070;
  margin: 0;

  span{
    font-weight: 700;
    margin: 0;
  }
`

export const Stopover = styled.div`
  width: 100%;
  background: #FFF3E8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 13px;
  border-radius:5px;
  gap: 8px;
`

export const StopoverText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  margin:0;

  color: #818181;
  
  span{
    font-weight: 700;
  }
  
  span:first-child{
     color: #FF8C1D;
   }
  
  @media screen and (max-width: 480px){
    font-size: 14px;
  }
`

export const CartTicketsWrapper = styled.div`
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 18px 20px;
`

export const TicketItem = styled.div`
  display: flex;
  justify-content: space-between;
`

export const TicketText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;

  color: #000000;
`

export const CartFooterWrapper = styled.div`
  padding: 25px 31px;
  border-top: 1px dashed #A29E9E;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const TotalText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 1.5;
  margin: 0;

  color: #434343;
`

export const TotalPrice = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1.5;
  margin: 0;

  color: #434343;
`

/* start fourth step */

export const Payment = styled.div<IPaymentDiv>`
  background: ${({isError}) => isError ? "#FFFFFF" : "none"};
  display: flex;
  align-items: center;
  padding: 15px 0;
  gap:15px;
  
  @media screen and (max-width: ${size.laptop}){
    flex-direction: column;
  }
`

export const PaymentStatusImageContainer = styled.div`

`

export const PaymentStatusDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`

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
`

export const PaymentErrorText= styled.h4`
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 1.5;
  text-align: center;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  margin: 0;
  color: #FF1515;
`

export const PaymentInfoText = styled.h5`
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 28px;
  line-height: 1.1;
  margin: 0;
  text-align: center;
  letter-spacing: 0.5px;

  color: #FF840D;
`

export const RedirectText = styled.p`
  font-family: 'Nunito', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;

  text-align: center;
  letter-spacing: 0.5px;
  margin: 20px 0 0 0;
  color: #474747;
  
  a{
    color: #FF840D;
  }
`

export const PaymentStep = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

/* end fourth step */

/* start final step */

export const BookingConfirmedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const FinalStep = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  gap: 20px;

  @media screen and (max-width: ${size.laptop}){
    flex-direction: column;
  }
`

export const ConfirmedText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
`

export const DottedLinesContainer = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 18px 0;
  width: 100%;
  @media screen and (max-width: ${size.laptop}){
    display: none;
  }
`

export const ErrorText = styled.span`
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.5;
  margin:0;

  color: #e74c3c;
`

export const SuccessText = styled.h3`
  font-family: 'Metropolis', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 80px;
  line-height: 1;
  text-align: center;
  margin: 0;
  color: #FF8C1D;
`

export const EmailDetailsText = styled.h5`
  margin: 0;
  font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 36px;
    line-height: 1.5;

text-align: center;

color: #77838F;
`