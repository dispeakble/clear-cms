import {
  Wrapper, CardContainer, CardHeading, Card, CardImage, CardDetail,
  BookNowBtn, SliderContainer, LeftArrow, RightArrow, SliderWrapper,
  CardDetailLeft, HotelName, CardDetailRight, StartingPrice, NoOfNights
} from "./styled";
import React, { useRef } from "react";
import Slider from "react-slick";

import card1 from "../../assets/img/hotelresults/card1.jpg";
import { StyledStars } from "../Styled/stars";
import { useTranslations } from "next-intl";

interface ICarousal {
  title: string,
  imgSrc: string,
  hotelName: string,
  averageStars: number,
  price: number,
  noOfNights: number
}


const Carousal = ({
                    title,
                    imgSrc,
                    hotelName,
                    averageStars,
                    price,
                    noOfNights
                  }: ICarousal) => {
  const sliderRef = useRef<Slider>(null);
  const settings = {
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const t = useTranslations();

  return (
    <Wrapper>
      <CardHeading>{title}</CardHeading>
      <SliderContainer>
        <LeftArrow onClick={sliderRef?.current?.slickPrev} />
        <SliderWrapper>
          <Slider ref={sliderRef} {...settings}>
            <CardContainer>
              <CardImage url={card1.src}></CardImage>
              <CardDetail>
                <CardDetailLeft>
                  <HotelName>{hotelName}</HotelName>
                  <StyledStars stars={averageStars} size='small'></StyledStars>
                </CardDetailLeft>
                <CardDetailRight>
                  <StartingPrice>{t("hotelResult.from")} <span>{price}€</span></StartingPrice>
                  <NoOfNights>{t("hotelResult.adult")} / {noOfNights} {t("hotelResult.nights")}</NoOfNights>
                </CardDetailRight>
              </CardDetail>
              <BookNowBtn>{t("hotelResult.bookNow")}</BookNowBtn>
            </CardContainer>
            <CardContainer>
              <CardImage url={card1.src}></CardImage>
              <CardDetail>
                <CardDetailLeft>
                  <HotelName>{hotelName}</HotelName>
                  <StyledStars stars={averageStars} size='small'></StyledStars>
                </CardDetailLeft>
                <CardDetailRight>
                  <StartingPrice>From <span>{price}€</span></StartingPrice>
                  <NoOfNights>{t("hotelResult.adult")} / {noOfNights} {t("hotelResult.nights")}</NoOfNights>
                </CardDetailRight>
              </CardDetail>
              <BookNowBtn>{t("hotelResult.bookNow")}</BookNowBtn>
            </CardContainer>
          </Slider>
        </SliderWrapper>
        <RightArrow onClick={sliderRef.current?.slickNext} />
      </SliderContainer>
    </Wrapper>
  );
};

export default Carousal;