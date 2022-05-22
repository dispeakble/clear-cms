import styled from "styled-components";


interface IDetailsContainer{
    isExpanded: boolean;
}

const size = {
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