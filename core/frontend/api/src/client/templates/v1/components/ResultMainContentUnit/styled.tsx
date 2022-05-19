import styled from "styled-components";

export const ResultMainContent = styled.div`
  display: flex;
  background: white;
  border: 1px solid #CBCBCB;
  border-radius: 10px;
  margin-bottom: 16px;
  width: 100%;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  };
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`

export const Description = styled.div`
    flex: 1 1 80%;
    min-width: 750px;
    border-right: 1px solid #CBCBCB;
    padding: 4px 12px 4px 12px;
`;

export const PriceContainer = styled.div`
  flex: 0 0 22%;
  min-width: 210px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const DescriptionRowOne = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 16px;
`;

export const TakeOffFlightLocation = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 36px;
  color: #707070;
  flex: 1 1 30%;
  span {
    font-weight: 400;
  }
`;

export const LandingLocation = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 36px;
  color: #707070;
  flex: 1 1 20%;
  text-align: right;
  span {
    font-weight: 400;
  }
`;

export const FlightTime = styled.div`
  line-height: 24px;
  color: #000000;
  flex: 0 0 10%;
`;

export const MoreAboutFlight = styled.div`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1 1 20%;
`;
export const FlightDuration = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
  
`;
export const PlanName = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  color: #818181;
`;

export const PlanIcon = styled.div`
  background: url(${({theme}) => theme.icon('companyImage')}) no-repeat 16px center white;
  width: 110px;
  height: 20px;
`;

export const Price = styled.div`
  font-weight: 400;
  font-size: 32px;
  line-height: 48px;
  color: #FF840D;
`;
export const NumberOfPersons = styled.div`
  color: #000000;
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
`;
export const FlightType = styled.div`
      
`;
export const BookNowBtn = styled.button`
  
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  width: 199px;
  height: 47px;
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  color: #FFFFFF;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  border: none;
  background: linear-gradient(180deg, rgba(122, 205, 19, 0.63) 0%, rgba(93, 149, 25, 0.63) 100%);
  &:hover {
    background: linear-gradient(180deg, #7ACD13 0%, #5D9519 100%);  
  }
`;