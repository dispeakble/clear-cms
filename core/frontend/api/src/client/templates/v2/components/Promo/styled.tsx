import styled from "styled-components";
import { device } from "../../styled";

export const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 60px;
  margin-top: 60px;
`;

export const StyledCardsWrapper = styled.div`
  width: 100%;

  @media ${device.laptop} {
    padding: 0 20px;
  }

  @media ${device.laptopL} {
    padding: 0 100px;
  }

  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));

  @media ${device.laptopL} {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
  min-height: 400px;
`;

export const StyledCard = styled.div`
  background: #FFFFFF;
  border-radius: 22px;
  padding: 20px 35px;
`;

export const StyledCardImageHolder = styled.div`
  overflow: hidden;
  height: 250px;
  width: 100%;
  border-radius: 18px;
  margin-bottom: 20px;
`;
export const StyledCardImage = styled.div<{ src: any }>`
  width: 100%;
  height: 100%;
  transition: transform 600ms ease-in-out;
  -moz-transition: transform 600ms ease-in-out;
  -ms-transition: transform 600ms ease-in-out;
  -o-transition: transform 600ms ease-in-out;
  -webkit-transition: transform 600ms ease-in-out;
  background: url(${({ src }) => src}) no-repeat center center;
  background-size: cover;
  cursor: pointer;
  transform: scale(1);

  &:hover {
    transform: scale(1.1);
  }
`;

export const StyledFirstRow = styled.div`
  display: flex;
  gap: 10px;
  font-size: 12px;
  margin-bottom: 10px;
`;

export const StyledLightLabel = styled.span`
  flex: 1;
  max-width: 25%;
  border-radius: 10px;
  height: 21px;
  background: #FF9F5A;
  padding: 0 10px;
  color: ${({theme}) => theme.colors.primaryColor};
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 21px;
`;

export const StyledGrayLabel = styled.span`
  flex: 1;
  line-height: 21px;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
`;

export const SmallBookNow = styled.span`
  border-radius: 10px;
  background: ${({theme}) => theme.colors.primaryColor};
  padding: 0 10px;
  color: #FFFFFF;
  white-space: nowrap;
  line-height: 21px;
  height: 21px;
  cursor: pointer;

  &:hover {
    background: ${({theme}) => theme.colors.primaryLight};
  }
`;

export const StyledFeaturedPrices = styled.div`
  display: flex;
  font-weight: bold;
  color: #000000;
  font-size: 12px;
  line-height: 27px;
`;

export const StyledDestination = styled.div`
  flex: 1;
`;

export const StyledPrice = styled.div`
  white-space: nowrap;
`;

export const StyledTabs = styled.div`
  background: #FFFFFF;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  max-width: 600px;
  width: 100%;
  margin-bottom: 20px;
  gap: 10px;
`;

export const StyledTabBtn = styled.div`
  flex: 1;
  background: #FFFFFF;
  color: ${({theme}) => theme.colors.gray};
  padding: 15px;
  text-align: center;
  cursor: pointer;
  font-size: 12px;
  @media ${device.tablet} {
    font-size: 18px;
    padding: 0 10px;
    line-height: 42px;
  }

  &:hover {
    background: ${({theme}) => theme.colors.primaryLight};
    color: #FFFFFF;
    border-radius: 8px;
  }

  &.selected {
    background: ${({theme}) => theme.colors.primaryColor};
    color: #FFFFFF;
    border-radius: 8px;
  }
`;