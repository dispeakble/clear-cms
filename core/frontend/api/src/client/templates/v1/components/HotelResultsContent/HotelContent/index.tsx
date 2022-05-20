
import {TopContent, BottomContent, Wrapper,
    HotelImageContainer, SectionOne, SectionTwo, HotelImage, HotelInfo} from './styled'

import card1 from "../../../assets/img/hotelresults/card1.jpg"
import {StyledStarsSmall} from "../../Styled/stars";
import React from "react";

interface IHoteContent {
    imgSrc: string,
    hotelName: string,
    hotelLocation: string,
    averageStars: number,
    price: number,
    noOfNights: number,
    description: string
}

const HotelContent = ({imgSrc, hotelName, hotelLocation, averageStars, price, noOfNights, description}: IHoteContent) => {
    return (
        <Wrapper>
            <TopContent>
                <SectionOne>
                    <HotelImageContainer>
                        <HotelImage url={card1.src}/>
                    </HotelImageContainer>
                    <HotelInfo>
                        <h1>Hotel Victoria</h1>
                        <p>Bischofshofen, 4, 38660 Adeje, Spain</p>
                        <StyledStarsSmall stars={4}></StyledStarsSmall>
                    </HotelInfo>
                </SectionOne>
                <SectionTwo>
                    <div>
                        <div>From <span>1409€</span></div>
                        <div>Adult / 7 nights</div>
                    </div>
                    <button>Book Now</button>
                </SectionTwo>
            </TopContent>
            <BottomContent>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu dolor efficitur,
                ullamcorper lectus id, consectetur purus. Cras consequat dapibus aliquam. Aenean hendrerit
                convallis ultrices. Praesent scelerisque orci vel arcu tincidunt, eu facilisis massa pellentesque.
                Ut facilisis sem ipsum, vitae porta enim dignissim consequat. Etiam nec placerat nibh. Aliquam posuere
                auctor lacus vitae sollicitudin. Quisque facilisis accumsan sapien ac efficitur. Etiam eget urna vulputate,
                faucibus ipsum et, imperdiet ipsum. Nam eu nunc a erat tincidunt feugiat sit amet id lacus. Nunc id risus
                vitae neque dictum eleifend eu quis felis.
            </BottomContent>

        </Wrapper>
    );
}

export default HotelContent;
