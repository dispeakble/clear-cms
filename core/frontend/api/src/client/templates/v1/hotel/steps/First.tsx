import {
  Flights,
  ButtonsContainer,
  CustomButton,
  HotelDetailsWrapper,
  HotelDetailsHeader,
  HotelName,
  StarsWrapper,
  StarsText,
  HotelAddressContainer,
  HotelAddress,
  HotelTicketInfosContainer, HotelInfos,
  TopLeftCircle,
  TopRightCircle,
  BottomLeftCircle,
  BottomRightCircle, TicketInfosItems, TicketInfosItem, RoomType, DetailsText
} from "../styled";
import Image from "next/image";
import YellowStar from "../../assets/img/starYellowImage.png";
import GrayStar from "../../assets/img/starGrayImage.png";
import * as React from "react";
import { useTranslations } from "next-intl";

interface IProps {
  hotelData: any;
  setCurrentStep: any;
  currentStep: number;
}

const FirstStep = ({ hotelData, setCurrentStep, currentStep }: IProps) => {

  const t = useTranslations();

  return (
    <Flights data-testid="test-hotel-first-step">
      {
        hotelData.map((hotel: any, index: number) => {
          return (
            <HotelDetailsWrapper key={index}>
              <HotelDetailsHeader>
                <HotelName>
                  {hotel.name}
                </HotelName>
                <StarsWrapper>
                  {
                    [...Array(hotel.rating)]
                      .map((value: undefined, index: number) =>
                        (
                          <Image
                            key={index}
                            src={YellowStar}
                            width={25}
                            height={25}
                            alt={"rating-positive"}
                          />
                        ))
                  }
                  {
                    hotel.rating < 5 &&
                    [...Array(5 - hotel.rating)]
                      .map((value: undefined, index: number) =>
                        (
                          <Image
                            key={index}
                            src={GrayStar}
                            width={25}
                            height={25}
                            alt={"rating-negative"}
                          />
                        ))
                  }
                </StarsWrapper>
                <StarsText>
                  ({t("hotelCheckout.main.stars", { stars: hotel.rating })})
                </StarsText>
              </HotelDetailsHeader>
              <HotelInfos>
                <HotelAddressContainer>
                  <HotelAddress>
                    {hotel.address}
                  </HotelAddress>
                </HotelAddressContainer>
                <HotelTicketInfosContainer>
                  <TicketInfosItems>
                    <TicketInfosItem>
                      <RoomType>
                        {hotel.roomType} {hotel.allInclusive && t("hotelCheckout.cart.allInclusive")}
                      </RoomType>
                      <DetailsText>
                        2 x {hotel.roomType}
                      </DetailsText>
                      <DetailsText>
                        {hotel.adults} {t("hotelCheckout.main.adults")}, {hotel.children} {t("hotelCheckout.main.children")}
                      </DetailsText>
                    </TicketInfosItem>
                    <TicketInfosItem alignEnd>
                      <DetailsText>
                        {hotel.checkoutDay}
                      </DetailsText>
                      <DetailsText>
                        {hotel.duration}
                      </DetailsText>
                    </TicketInfosItem>
                    <TicketInfosItem>
                      <HotelName>
                        {hotel.price}€
                      </HotelName>
                    </TicketInfosItem>
                  </TicketInfosItems>
                </HotelTicketInfosContainer>
              </HotelInfos>
            </HotelDetailsWrapper>
          );
        })
      }
      <ButtonsContainer hasOneChild>
        <CustomButton isActive data-testid="test-next-button"
                      onClick={() => setCurrentStep((prev: number) => prev + 1)}>
          {t("flightsCheckout.main.nextStep")}
          <span>
                        {currentStep + 1}
                    </span>
        </CustomButton>
      </ButtonsContainer>
    </Flights>
  );
};

export default FirstStep;