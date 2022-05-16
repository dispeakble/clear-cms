import {
    Body, CardImage, CustomButton, MutedText, TitleText,
} from './styled';
import React, {FC} from "react"
import {Rate} from "antd";
import cardBg from "../../assets/img/hotels/original/hotel1.jpg"

const HotelCard = () => {

    return(
        <Body>
            <TitleText>Sol Puerto de la Cruz</TitleText>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <MutedText>Tenerife</MutedText>
                <Rate
                    style={{fontSize: '20px'}}
                    disabled defaultValue={4} />
            </div>

            <CardImage src={cardBg.src} alt={"Card Image"} />

            <CustomButton>
                {/*<img src={calend} alt=""/>*/}
                Check Availability
            </CustomButton>
        </Body>
    )
}

export default HotelCard;
