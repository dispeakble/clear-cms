import React from 'react';
import {
    CardButton,
    CardContentBottom,
    CardContentWrapper,
    CardDescription,
    CardDuration, CardImageWrapper,
    CardPrice,
    CardTitle,
    Card,
    Image,
    ZoomImage
} from "../styled";
import StarRating from "../../StarRating";

import ZoomPNG from '../../../../pages/agency/assets/Cards/zoom-icon.png'

const CardView = ({value}) => {
    return(
        <Card>
            <CardContentWrapper>
                <StarRating rating={value.Rating}/>
                <CardTitle>{value.Name}</CardTitle>
                <CardDescription>{`${value.Description}`.substr(0, 80)}...</CardDescription>
                <CardDuration>{`${value.Address}`.substr(0, 40)}...</CardDuration>
                <CardContentBottom>
                    <CardPrice>159$</CardPrice>
                    <CardButton >Book Now</CardButton>
                </CardContentBottom>
            </CardContentWrapper>
            <CardImageWrapper>
                <Image src={value.Images}/>
                <ZoomImage src={ZoomPNG.src} />
            </CardImageWrapper>
        </Card>
    )
}

export default CardView;