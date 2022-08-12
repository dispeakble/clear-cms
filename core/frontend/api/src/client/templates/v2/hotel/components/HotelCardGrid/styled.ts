import styled from "styled-components";
import { size } from "../../styled";


export const Body = styled.div`
  background: #FFFFFF;
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.14);
  border-radius: 27px;
  width: 100%;
  padding: 1rem;
  margin-top: 2rem;
`;

export const TitleText = styled.h3`
  font-weight: 400;
  font-size: 36px;
  line-height: 54px;
`;

export const ParaTextBold = styled.p`
  font-weight: bolder;
  font-size: 17px;
  margin: 0;
`;

export const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  };
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  @media (max-width: ${size.mobileL}) {
    overflow-x: hidden;
    flex-wrap: wrap;
    justify-content: center;
    
  }
  
`;
export const HotelCard = styled.div`
  display: flex;
  gap: 10px;
`;