import React, {useEffect, useState} from 'react';


import DestinationCardTabs from "./DestinationCardTabs";
import StarRating from "../StarRating";

import {
    CardsWrapper,
    CardsContainer,
    CardContentBottom,
    Cards,
    Card,
    CardContentWrapper,
    CardTitle,
    CardDescription,
    CardDuration,
    CardPrice,
    CardButton,
    CardImageWrapper,
    TaglineHeading
} from './styled'


const DestinationCards = () => {
    const [cardatils, setCard] = useState([])
    useEffect(() => {
        const fetchHotels = async () => {
            const response = await fetch('http://localhost:9898/api/agency/hotel');
            const data = await response.json();
            setCard(data.rows)


        }
        fetchHotels()
    }, [])
    return (
        <CardsWrapper>
            <CardsContainer>
                <TaglineHeading>Recommended Destination</TaglineHeading>
                <DestinationCardTabs/>
                <Cards>
                    {
                        cardatils.map((value:any) => {
                            return (
                                <Card>
                                    <CardContentWrapper>
                                        <StarRating rating={value.Rating}/>
                                        <CardTitle>{value.Name}</CardTitle>
                                        <CardDescription>{`${value.Description}`.substr(0, 80)}...</CardDescription>
                                        <CardDuration>{`${value.Address}`.substr(0, 40)}...</CardDuration>
                                        <CardContentBottom>
                                            <CardPrice>159$</CardPrice>
                                            <CardButton>Book Now</CardButton>
                                        </CardContentBottom>
                                    </CardContentWrapper>
                                    <CardImageWrapper> {/* style={{backgroundImage:`url(${value.Images})`}} */}
                                        <img src={value.Images}/>
                                    </CardImageWrapper>
                                </Card>
                            )
                        })
                    }


                </Cards>
            </CardsContainer>
        </CardsWrapper>
    )
}


export default DestinationCards;