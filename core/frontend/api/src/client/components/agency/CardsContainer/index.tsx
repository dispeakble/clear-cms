import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import GranCarniaImg from '../../../pages/agency/assets/Cards/gran-carania.jpg'
import OceanImg from '../../../pages/agency/assets/Cards/ocean.jpg'
import MountainLakeImg from '../../../pages/agency/assets/Cards/mountain-lake.jpg'

import CardsTabs from './CardsTabs/index'

import {
    WrapperContainer,
    Cards,
    Card,
    CardImg,
    CardHead,
    CardTextItem,
    CardPrice,
    CardTextContent,
    CardTitle
} from './styled'

const CardsContainer = (props) => {
    const [card , setCard]=useState([])
    const {cards} = props;

    const [] = useState(1);

    useEffect(() => {
        const fetchHotels = async () => {
            const response = await fetch('http://localhost:9898/api/agency/hotel');
            const data = await response.json();
            setCard(data.rows)
        }
        fetchHotels()
    }, [])

    return (
        <WrapperContainer data-testid='cards-wrapper'>
           <CardsTabs />
            <Cards>
                {
                    card.map((hotel:any) => <Card>
                        <CardImg>
                            <img src={hotel.Images}/>
                        </CardImg>
                        <CardContent>
                            <CardHead>
                                <span>relax</span>
                                <p>{hotel.Name}</p>
                                <button>Book Now</button>
                            </CardHead>
                            <CardTextContent>
                                <CardTextItem >
                                    <CardTitle>Gran Canaria</CardTitle>
                                    <CardPrice>224$</CardPrice>
                                </CardTextItem>
                                <CardTextItem >
                                    <CardTitle>Palma De Mallorca</CardTitle>
                                    <CardPrice>244$</CardPrice>
                                </CardTextItem> <CardTextItem >
                                <CardTitle>Tenerife</CardTitle>
                                <CardPrice>{hotel.Price}$</CardPrice>
                            </CardTextItem>

                            </CardTextContent>
                        </CardContent>
                    </Card>)
                }
            </Cards>
        </WrapperContainer>
    )
}

CardsContainer.defaultProps = {
    cards: [
        {
            image: GranCarniaImg.src,
            tag: 'Relax',
            stay: '4 Days, 3 Nights',
            prices: [
                {
                    title: 'Gran Canaria',
                    price: '299'
                },
                {
                    title: 'Palma De Mallorca',
                    price: '349'
                },
                {
                    title: 'Tenerife',
                    price: '539'
                }
            ]
        },
        {
            image: OceanImg.src,
            tag: 'Relax',
            stay: '4 Days, 3 Nights',
            prices: [
                {
                    title: 'Gran Canaria',
                    price: '299'
                },
                {
                    title: 'Palma De Mallorca',
                    price: '349'
                },
                {
                    title: 'Tenerife',
                    price: '539'
                }
            ]
        },
        {
            image: MountainLakeImg.src,
            tag: 'Relax',
            stay: '4 Days, 3 Nights',
            prices: [
                {
                    title: 'Gran Canaria',
                    price: '299'
                },
                {
                    title: 'Palma De Mallorca',
                    price: '349'
                },
                {
                    title: 'Tenerife',
                    price: '539'
                }
            ]
        }
    ]
}

export default CardsContainer;
const CardContent = styled.div``;