import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GranCarniaImg from "../../../pages/agency/assets/Cards/gran-carania.jpg";
import OceanImg from "../../../pages/agency/assets/Cards/ocean.jpg";
import MountainLakeImg from "../../../pages/agency/assets/Cards/mountain-lake.jpg";

import CardsTabs from "./CardsTabs/index";

import {
    Button,
    Card,
    CardHead,
    CardImg,
    CardPrice,
    Cards,
    CardTextContent,
    CardTextItem,
    CardTitle,
    WrapperContainer
} from "./styled";

const CardsContainer = () => {
  const [card, setCard] = useState([]);
  const [, setActiveAmount] = useState(0);
  const [] = useState(0);

  useEffect(() => {
    const fetchHotels = async () => {
      const response = await fetch("http://localhost:9898/api/agency/hotel");
      const data = await response.json();
      const items = data.rows.slice(0, 3);
      setCard(items);
    };
    fetchHotels();
  }, []);


  const handleChangeState = (index: number) => {
    setActiveAmount(index);
  };

  return (
    <WrapperContainer data-testid="cards-wrapper">
      <CardsTabs handleActiveHotel={handleChangeState} />
      <Cards>
        {
          card.map((hotel: any, index: number) => <Card key={`${index}`}>
            <CardImg>
              <img src={hotel.Images} />
            </CardImg>
            <CardContent>
              <CardHead>
                <span>Relax</span>
                <p>4 Days 3 Nights</p>
                <Button>Book Now</Button>
              </CardHead>
              <CardTextContent>
                <CardTextItem>
                  <CardTitle>Gran Canaria</CardTitle>
                  <CardPrice>224$</CardPrice>
                </CardTextItem>
                <CardTextItem>
                  <CardTitle>Palma De Mallorca</CardTitle>
                  <CardPrice>244$</CardPrice>
                </CardTextItem>
                <CardTextItem>
                  <CardTitle>Tenerife</CardTitle>
                  <CardPrice>300$</CardPrice>
                </CardTextItem>
              </CardTextContent>
            </CardContent>
          </Card>)
        }
      </Cards>
    </WrapperContainer>
  );
};

CardsContainer.defaultProps = {
  cards: [
    {
      image: GranCarniaImg.src,
      tag: "Relax",
      stay: "4 Days, 3 Nights",
      prices: [
        {
          title: "Gran Canaria",
          price: "299"
        },
        {
          title: "Palma De Mallorca",
          price: "349"
        },
        {
          title: "Tenerife",
          price: "539"
        }
      ]
    },
    {
      image: OceanImg.src,
      tag: "Relax",
      stay: "4 Days, 3 Nights",
      prices: [
        {
          title: "Gran Canaria",
          price: "299"
        },
        {
          title: "Palma De Mallorca",
          price: "349"
        },
        {
          title: "Tenerife",
          price: "539"
        }
      ]
    },
    {
      image: MountainLakeImg.src,
      tag: "Relax",
      stay: "4 Days, 3 Nights",
      prices: [
        {
          title: "Gran Canaria",
          price: "299"
        },
        {
          title: "Palma De Mallorca",
          price: "349"
        },
        {
          title: "Tenerife",
          price: "539"
        }
      ]
    }
  ]
};

export default CardsContainer;
const CardContent = styled.div``;