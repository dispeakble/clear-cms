import {
    CartFlightInfo, CartFooterWrapper,
    CartHeader,
    CartHeaderWrapper,
    CartItemContainer, CartTicketsWrapper,
    CartWrapper, DateText, DepartureDestinationText,
    DepartureDestinationTextWrapper,
    FlightCartItem, FLightProviderImg, FlightTimeContainer, TicketItem, TicketText, TimeText, TotalPrice, TotalText
} from "../styled";
import Image from "next/image";
import * as React from "react";
import {useTranslations} from "next-intl";

interface IProps{
    flightData: any;
}

const Cart = ({flightData}: IProps) => {

    const t = useTranslations()

    return(
        <CartWrapper>
            <CartHeaderWrapper>
                <CartHeader>
                    {t('flightsCheckout.cart.header')}
                </CartHeader>
            </CartHeaderWrapper>
            <CartItemContainer>
                {
                    flightData.map((flight) => {
                        return(
                            <CartFlightInfo>
                                <FlightCartItem>
                                    <DepartureDestinationTextWrapper>
                                        <Image
                                            src={flight.typeIMG}
                                            alt="tripType"
                                            height={18}
                                            width={20}
                                        />
                                        <DepartureDestinationText>
                                            {flight.departure}
                                        </DepartureDestinationText>
                                    </DepartureDestinationTextWrapper>
                                    <FLightProviderImg
                                        src={flight.flightProviderIMG}
                                        alt="flightProvider"
                                        height={20}
                                        width={67}
                                    />
                                    <DepartureDestinationTextWrapper>
                                        <DepartureDestinationText>
                                            {flight.destination}
                                        </DepartureDestinationText>
                                    </DepartureDestinationTextWrapper>

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
                        )
                    })
                }
            </CartItemContainer>
            <CartTicketsWrapper>
                <TicketItem>
                    <TicketText>
                        1 x Adult ticket
                    </TicketText>
                    <TicketText>
                        435.71 €
                    </TicketText>
                </TicketItem>
                <TicketItem>
                    <TicketText>
                        {t('flightsCheckout.cart.tax')}
                    </TicketText>
                    <TicketText>
                        15.00 €
                    </TicketText>
                </TicketItem>
            </CartTicketsWrapper>
            <CartFooterWrapper>
                <TotalText>
                    {t('flightsCheckout.cart.total')}
                </TotalText>
                <TotalPrice>
                    468.71 €
                </TotalPrice>
            </CartFooterWrapper>
        </CartWrapper>
    )
}

export default Cart