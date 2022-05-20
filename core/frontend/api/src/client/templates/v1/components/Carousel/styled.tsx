import styled from 'styled-components';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import card1 from "../../assets/img/hotelresults/card1.jpg"


export const Wrapper = styled.div`
  width: 100%;
  text-align: center;
`;


export const CardHeading = styled.div`
  font-weight: 700;
  font-size: 29px;
  line-height: 40px;
  color: #000000;
  margin: 24px 0px 24px 0px;
`;

export const SliderContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export const LeftArrow = styled.div`
  background: url(${({theme}) => theme.icon('leftArrow')}) no-repeat left center;
  width: 30px;
  height: 75px;
`;

export const RightArrow = styled.div`
  background: url(${({theme}) => theme.icon('rightArrow')}) no-repeat left center;
  background-position-x: right;
  width: 30px;
  height: 75px;
`;

export const SliderWrapper = styled.div`
  width: 80%;
  max-width: 350px;
  background: #FFFFFF;
  box-shadow: 4px 4px 25px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 23px 10px 20px 10px;
`


export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 314px;
  max-height: 344px;
  justify-content: center;
`;

export const Card = styled.div`

`;

interface ICardImage {
    url: string
};

export const CardImage = styled.div<ICardImage>`
  background: url(${(props) => props.url}) no-repeat center center/cover;
  height: 179px;
  margin-bottom: 16px;
`;

export const CardDetail = styled.div`
  display: flex;
  flex: 1 1 100%;
  margin-bottom: 16px;
  justify-content: space-between;
`;

export const CardDetailLeft = styled.div`
  flex: 1 1 40%;
`;
export const HotelName = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #000000;
  text-align: left;
`;
export const CardDetailRight = styled.div`
  flex: 1 1 40%;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  text-align: right;
`;
export const StartingPrice = styled.div`
  color: #000000;
  span {
    color: #FF840D;
    font-weight: 700;
    font-size: 19px;
    line-height: 28px;
  }
`;
export const NoOfNights = styled.div`
  color: #000000;
`;

export const BookNowBtn = styled.button`
  background: linear-gradient(180deg, #7ACD13 0%, #5D9519 100%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  width: 290px;
  height: 47px;
  color: #FFFFFF;
  text-align: center;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  border: none;
`;
