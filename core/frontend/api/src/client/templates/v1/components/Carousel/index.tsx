import { Wrapper, CardContainer, CardHeading, Card, CardImage, CardDetail,
    BookNowBtn, SliderContainer, LeftArrow, RightArrow, SliderWrapper,
    CardDetailLeft, HotelName, CardDetailRight, StartingPrice, NoOfNights} from "./styled";
import React from "react";
import Slider from "react-slick";

import card1 from "../../assets/img/hotelresults/card1.jpg"
import {StyledStarsSmall} from "../Styled/stars";
import {useState} from 'react';

const  Carousal = () => {
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
            <CardHeading>Hot deals of 2022</CardHeading>
            <SliderContainer>
                <LeftArrow onClick={sliderRef?.slickPrev}/>
                <SliderWrapper>
                    <Slider ref={setSliderRef} {...settings}>
                     <CardContainer>
                         <CardImage url={card1.src}></CardImage>
                         <CardDetail>
                             <CardDetailLeft>
                                 <HotelName>Hotel Victoria</HotelName>
                                 <StyledStarsSmall stars={4}></StyledStarsSmall>
                             </CardDetailLeft>
                             <CardDetailRight>
                                 <StartingPrice>From <span>1409€</span></StartingPrice>
                                 <NoOfNights>Adult / 7 nights</NoOfNights>
                             </CardDetailRight>
                         </CardDetail>
                         <BookNowBtn>Book Now</BookNowBtn>
                     </CardContainer>
                        <CardContainer>
                            <CardImage url={card1.src}></CardImage>
                            <CardDetail>Hotel Victoria</CardDetail>
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