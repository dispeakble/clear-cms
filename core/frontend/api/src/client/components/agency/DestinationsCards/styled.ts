import styled from "styled-components";
import {Colors, Widths} from "../../../assets/design-set";
import OceanImg from '../../../pages/agency/assets/Cards/ocean.jpg';


export const CardsWrapper = styled.div`
  margin: 30px;
`
export const CardsContainer = styled.div`
  width: 90%;
  max-width: ${Widths.containerWidth};
  margin: 0 auto;
`

export const Cards = styled.div`
  margin-top: 60px;
  display: flex;
  gap: 30px;
  justify-content: space-between;

`
export const Card = styled.div`
  //height: 555px;
  width: 390px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: ${Colors.white};
  padding: 24px;
  display: flex;
  flex-direction: column;
`

export const CardContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
export const BookNowButton = styled.a`
  color: ${Colors.white};

  :hover {
    color: ${Colors.white};
  }
`


export const CardTitle = styled.h3`
  font-size: 26px;
  font-weight: bold;
  color: ${Colors.black};
`
export const CardDescription = styled.p`
  color: ${Colors.gray};

`
export const CardButton = styled.button`
  align-self: flex-end;
  width: 100%;
  outline: none;
  border: none;
  border-radius: 16px;
  padding: 8px 0px;
  color: ${Colors.white};
  background-color: ${Colors.primaryColor};
  font-size: 28px;
  cursor: pointer;
`

export const CardPrice = styled.p`
  margin: 16px 0px;
  font-size: 26px;
  font-weight: 500;
  color: ${Colors.darkRed};
`
export const CardContentBottom = styled.div`
  justify-self: flex-end;
  margin-top: auto;

`

export const CardDuration = styled.h6`
  font-size: 13px;
  font-weight: bold;
  color: ${Colors.black};
`

export const CardImageWrapper = styled.div`
  margin-top: 16px;
  flex: 1;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
  position:relative;
  
`

export const ZoomImage = styled.img`
  position:absolute;
  right: 5px;
  bottom:5px;
  height: 24px;
  width:24px;
  object-fit: cover;
  cursor:pointer;
  padding:2px;
`

export const Image = styled.img`
  height: 100%;
  max-height: 178px;
  width: 100%;
  object-fit: cover;
`
export const TaglineHeading = styled.h2`
  font-size: 58px;
  font-weight: 700;
  color: ${Colors.black};
  margin: 0px 0px 30px 0px;
  text-align: center;
`