import React, {useEffect, useState} from 'react';
import DestinationCardTabs from "../DestinationCardTabs";
import CardView from '../Card'

import {
    CardsWrapper,
    CardsContainer,
    Cards,
    TaglineHeading,
} from '../styled'


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
                        cardatils.map((value: any,index:number) => {
                            return (
                                 <CardView key={`${index}`} value={value} />
                            )
                        })
                    }


                </Cards>
            </CardsContainer>
        </CardsWrapper>
    )
}


export default DestinationCards;