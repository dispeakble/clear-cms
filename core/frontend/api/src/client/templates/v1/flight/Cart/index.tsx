import {
  CartFlightInfo, CartFooterWrapper,
  CartHeader,
  CartHeaderWrapper,
  CartItemContainer, CartTicketsWrapper,
  CartWrapper, DateText, DepartureDestinationText,
  DepartureTextWrapper, DestinationTextWrapper, DottedLines,
  FlightCartItem, FLightProviderImg, FlightTimeContainer, TicketItem, TicketText, TimeText, TotalPrice, TotalText
} from "../styled";
import Image from "next/image";
import * as React from "react";
import { useTranslations } from "next-intl";

interface IProps {
  flightData: any;
  passengersCount: any;
}


const Cart = ({ flightData, passengersCount }: IProps) => {

  const t = useTranslations();
  const ticketPrice = 435.71;

  return (
    <CartWrapper>
      <CartHeaderWrapper>
        <CartHeader>
          {t("flightsCheckout.cart.header")}
        </CartHeader>
      </CartHeaderWrapper>
      <CartItemContainer>
        {
          flightData.map((flight: any, index: number) => {
            return (
              <CartFlightInfo key={index}>
                <FlightCartItem>
                  <DepartureTextWrapper>
                    <Image
                      src={flight.typeIMG}
                      alt="tripType"
                      height={18}
                      width={20}
                    />
                    <DepartureDestinationText>
                      {flight.departure}
                    </DepartureDestinationText>
                  </DepartureTextWrapper>

                  <DottedLines />

                  <FLightProviderImg
                    src={flight.flightProviderIMG}
                    alt="flightProvider"
                    height={20}
                    width={67}
                  />

                  <DottedLines />

                  <DestinationTextWrapper>
                    <DepartureDestinationText>
                      {flight.destination}
                    </DepartureDestinationText>
                  </DestinationTextWrapper>

                </FlightCartItem>
                <FlightTimeContainer>
                  <DateText>
                    {flight.departureDate}
                  </DateText>
                  <TimeText>
                    {flight.departureTime}
                  </TimeText>
                  <TimeText>
                    {flight.arrivalTime}
                  </TimeText>
                  <DateText>
                    {flight.destinationDate}
                  </DateText>
                </FlightTimeContainer>
              </CartFlightInfo>
            );
          })
        }
      </CartItemContainer>
      <CartTicketsWrapper>
        {
          Object.keys(passengersCount).map((key: any) =>
            (
              <TicketItem key={key}>
                <TicketText>

                  {passengersCount[key]} x {t(`global.${key}`)} {t("flightsCheckout.main.ticket")}
                </TicketText>
                <TicketText>
                  {Number((passengersCount[key] as number) * ticketPrice).toFixed(2)} €
                </TicketText>
              </TicketItem>
            )
          )
        }
        <TicketItem>
          <TicketText>
            {t("flightsCheckout.cart.tax")}
          </TicketText>
          <TicketText>
            15.00 €
          </TicketText>
        </TicketItem>
      </CartTicketsWrapper>
      <CartFooterWrapper>
        <TotalText>
          {t("flightsCheckout.cart.total")}
        </TotalText>
        <TotalPrice>
          468.71 €
        </TotalPrice>
      </CartFooterWrapper>
    </CartWrapper>
  );
};

export default Cart;