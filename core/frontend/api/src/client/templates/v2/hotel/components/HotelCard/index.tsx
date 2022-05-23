import {
    Body, CardImage, CustomButton, MutedText, TitleText,
} from './styled';
import React from "react"

import cardBg from "../../../assets/img/hotels/original/hotel1.jpg"
import calendarCheckIcon from "../../../assets/img/calendar-check-icon.svg"
import {StyledStarsSmall} from "../../../components/Styled/stars";

const HotelCard = () => {

    return(
        <Body>
            <TitleText>Sol Puerto de la Cruz</TitleText>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <MutedText>Tenerife</MutedText>
                <StyledStarsSmall stars={4}></StyledStarsSmall>
            </div>

            <CardImage src={cardBg.src} alt={"Card Image"} />

            <CustomButton>
                <img src={calendarCheckIcon.src} alt="icon"/>
                Check Availability
            </CustomButton>
        </Body>
    )
}

export default HotelCard;
