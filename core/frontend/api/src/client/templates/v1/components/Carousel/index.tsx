import { Wrapper, CardContainer, CardHeading, Card, CardImage, CardDetail,
    BookNowBtn, SliderContainer, LeftArrow, RightArrow, SliderWrapper,
    CardDetailLeft, HotelName, CardDetailRight, StartingPrice, NoOfNights} from "./styled";
import React from "react";
import Slider from "react-slick";

import card1 from "../../assets/img/hotelresults/card1.jpg"
import {StyledStarsSmall} from "../Styled/stars";
import {useState} from 'react';

interface ICarousal {
    title: string,
    imgSrc: string,
    hotelName: string,
    averageStars: number,
    price: number,
    noOfNights: number
}


const  Carousal = ({title,
                       imgSrc,
                       hotelName,
                       averageStars,
                       price,
                       noOfNights}: ICarousal) => {
    const [sliderRef, setSliderRef] = useState(null)
    const settings = {
        infinite: true,
        speed: 500,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return (
        <Wrapper>
            <CardHeading>{title}</CardHeading>
            <SliderContainer>
                <LeftArrow onClick={sliderRef?.slickPrev}/>
                <SliderWrapper>
                    <Slider ref={setSliderRef} {...settings}>
                     <CardContainer>
                         <CardImage url={card1.src}></CardImage>
                         <CardDetail>
                             <CardDetailLeft>
                                 <HotelName>{hotelName}</HotelName>
                                 <StyledStarsSmall stars={averageStars}></StyledStarsSmall>
                             </CardDetailLeft>
                             <CardDetailRight>
                                 <StartingPrice>From <span>{price}€</span></StartingPrice>
                                 <NoOfNights>Adult / {noOfNights} nights</NoOfNights>
                             </CardDetailRight>
                         </CardDetail>
                         <BookNowBtn>Book Now</BookNowBtn>
                     </CardContainer>
                        <CardContainer>
                            <CardImage url={card1.src}></CardImage>
                            <CardDetail>
                                <CardDetailLeft>
                                    <HotelName>{hotelName}</HotelName>
                                    <StyledStarsSmall stars={averageStars}></StyledStarsSmall>
                                </CardDetailLeft>
                                <CardDetailRight>
                                    <StartingPrice>From <span>{price}€</span></StartingPrice>
                                    <NoOfNights>Adult / {noOfNights} nights</NoOfNights>
                                </CardDetailRight>
                            </CardDetail>
                            <BookNowBtn>Book Now</BookNowBtn>
                        </CardContainer>
                    </Slider>
                </SliderWrapper>
                <RightArrow onClick={sliderRef?.slickNext}/>
            </SliderContainer>
        </Wrapper>
    );
}

export default Carousal;