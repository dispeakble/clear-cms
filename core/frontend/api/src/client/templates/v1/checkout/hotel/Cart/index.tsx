import {
    CartFlightInfo,
    CartFooterWrapper,
    CartHeader,
    CartHeaderWrapper, CartHotelInfo,
    CartItemContainer,
    CartTicketsWrapper,
    CartWrapper,
    DateText,
    DepartureDestinationText,
    DepartureTextWrapper,
    DestinationTextWrapper, DetailsText,
    DottedLines,
    FlightCartItem,
    FLightProviderImg,
    FlightTimeContainer,
    HotelCartItem, HotelCartItemElement, HotelName, RoomType,
    TicketItem,
    TicketText,
    TimeText,
    TotalPrice,
    TotalText
} from "../styled";
import Image from "next/image";
import * as React from "react";
import {useTranslations} from "next-intl";

interface IProps{
    hotelData: any;
}

const Cart = ({hotelData}: IProps) => {

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
                    hotelData.map((hotel: any) => {
                        return(
                            <CartHotelInfo>
                                <HotelCartItem>
                                    <HotelCartItemElement>
                                        <HotelName>
                                            {hotel.name}
                                        </HotelName>
                                    </HotelCartItemElement>
                                    <HotelCartItemElement>
                                        <RoomType>
                                            {hotel.roomType}
                                        </RoomType>
                                        {hotel.allInclusive &&
                                            <RoomType>
                                                {t('hotelCheckout.cart.allInclusive')}
                                            </RoomType>
                                        }

                                    </HotelCartItemElement>
                                    <HotelCartItemElement>
                                        <DetailsText>
                                            {hotel.duration}
                                        </DetailsText>
                                        <DetailsText>
                                            {hotel.adults} {t('hotelCheckout.main.adults')}, {hotel.children} {t('hotelCheckout.main.children')}
                                        </DetailsText>
                                    </HotelCartItemElement>
                                </HotelCartItem>
                                <FlightTimeContainer>
                                </FlightTimeContainer>
                            </CartHotelInfo>
                        )
                    })
                }
            </CartItemContainer>
            <CartTicketsWrapper>
                { /*
                    Object.keys(passengersCount).map((key: any) =>
                        (
                            <TicketItem>
                                <TicketText>
                                    {passengersCount[key]} x {key} ticket
                                </TicketText>
                                <TicketText>
                                    {Number((passengersCount[key] as number) * ticketPrice).toFixed(2)} €
                                </TicketText>
                            </TicketItem>
                        )
                    )
                  */
                }
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