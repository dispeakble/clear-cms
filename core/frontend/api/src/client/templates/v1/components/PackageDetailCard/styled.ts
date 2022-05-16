import styled from "styled-components";



export const PackageDetailContainer = styled.div`
  background: #FFFFFF;
  box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.14);
  border-radius: 27px;
  width: 100%;
  padding: 2rem;
`;

export const CustomSection = styled.div`
  background: #FFFFFF;
  box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.14);
  border-radius: 27px;
  width: 65%;
  padding: 2rem;
`;

export const TitleText = styled.h3`
  font-weight: 400;
  font-size: 36px;
  line-height: 54px;
`;

export const ParaTextBold = styled.p`
  font-weight: bolder;
  font-size: 17px;
  margin: 0px;
`;

export const BookingHeadingText = styled.p`
  font-weight: bolder;
  font-size: 17px;
  margin: 0px;
`;

export const BookingMutedText = styled.p`
  font-size: 17px;
  margin: 0px;
  color: #848484;
`;

export const BookingPriceText = styled.p`
  font-size: 36px;
  margin: 0px;
  color: #FF840D;
`;

export const BookingCard = styled.div`
  width: 100%;
  height: 140px;
  border: 2px dashed #FFAC5B;
  border-radius: 10px;
  margin: 1rem 0rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  position: relative;

  background: url(${({theme}) => theme.icon('bookingDetailBg')}) no-repeat center;
  background-size: cover;
`;

export const FlightInformation = styled.div`
  
`

export const FlightTakeOffInput = styled.div`

`
export const FlightInputs = styled.div`
    display: flex;
    justify-content: space-between;
  
    inputs {
      background: #FFFFFF;
      border: 1px solid #DBDBDB;
      box-shadow: 0px 4px 7px rgba(255, 255, 255, 0.25);
      border-radius: 10px;
    }
`


export const FlightTakeOffIcon = styled.div`
  width: 23px;
  height: 23px;
  margin: 13px 10px 0 10px;

`;

export const DropdownIcon = styled.div`
  width: 40px;
  height: 48px;
  cursor: pointer;
  background: url(${({theme}) => theme.icon('dropdown')}) no-repeat left center;
`;


export const BookingDetailContainer = styled.div`
  margin-top: 1rem;
`;

export const BookingButton = styled.button`
  width: 139px;
  height: 51px;
  background: linear-gradient(180deg, #FFAC5C 0%, #FF840D 100%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  font-weight: bolder;
  font-size: 20px;
  color: #fff;
  border: none;
  text-shadow: 0px 2px 2px #00000040;
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
  color: #FF840D;
  &:before{
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0px;
    width: 220px;
    height: 2px;
    background-color: #dedede;
  }
`;


export const QuotedPara = styled.p`
  position: relative;
  &:before {
    content: url(${({theme})=>theme.icon('quoteUp')});
    position: absolute;
    top: -10px;
    left: -50px;
  };
  &:after {
    content: url(${({theme})=>theme.icon('quoteDown')});
    position: absolute;
    bottom: -20px;
    right: 0px;
  };
`;

