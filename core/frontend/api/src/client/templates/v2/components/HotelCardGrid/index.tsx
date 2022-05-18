import {
    Body, CardContainer,
    TitleText,
} from './styled';
import React, {FC} from "react";

import HotelCard from "../HotelCard";


interface IHotelCardGrid {
    title: string;
}

const HotelCardGrid: FC<IHotelCardGrid> = ({title}) => {

    return(
        <Body>
            <TitleText>{title}</TitleText>

            <CardContainer>
                <HotelCard />
                <HotelCard />
                <HotelCard />
            </CardContainer>
        </Body>
    )
}

export default HotelCardGrid;
