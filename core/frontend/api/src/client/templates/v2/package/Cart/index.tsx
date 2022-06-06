import {
    CartFooterWrapper,
    CartHeader,
    CartHeaderWrapper,
    CartItemContainer,
    CartTicketsWrapper,
    CartWrapper,
    TicketItem,
    TicketText,
    TotalPrice,
    TotalText,
    CartHotelSection,
    CartFlightSection,
    HotelPackageTitle,
    HotelPackageAddress,
    StarsWrapper, RoomDetailsWrapper, RoomDetails, PackageHotelInfos, StarsText
} from "../styled";
import * as React from "react";
import {useTranslations} from "next-intl";
import Image from "next/image";
import YellowStar from "../../assets/img/starYellowImage.png";
import GrayStar from "../../assets/img/starGrayImage.png";
import {
    DateText,
    DepartureDestinationText,
    DepartureTextWrapper, DestinationTextWrapper,
    DottedLines,
    FlightCartItem, FLightProviderImg, FlightTimeContainer, TimeText
} from "../../flight/styled";

interface IProps{
    packageDetails: any;
    passengersCount: any;
}

const Cart = ({packageDetails, passengersCount}: IProps) => {

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
                        packageDetails.hotels.map((hotel: any, index:number) => (
                            <CartHotelSection key={index}>
                                <HotelPackageTitle>
                                    {packageDetails.title}
                                </HotelPackageTitle>
                                <StarsWrapper style={{gap: "2px"}}>
                                    {
                                        [...Array(hotel.rating)]
                                            .map((value: undefined, index: number) =>
                                                (
                                                    <Image
                                                        key={index}
                                                        src={YellowStar}
                                                        width={26}
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
                                                        width={26}
                                                        height={25}
                                                        alt={"rating-negative"}
                                                    />
                                                ))
                                    }

                                    <StarsText style={{marginLeft: "5px"}}>
                                        ({t('hotelCheckout.main.stars', {stars: hotel.rating})})
                                    </StarsText>

                                </StarsWrapper>
                                <HotelPackageAddress>
                                    {hotel.address}
                                </HotelPackageAddress>
                                <RoomDetailsWrapper>
                                    <RoomDetails>
                                        {hotel.roomType}
                                    </RoomDetails>

                                    <RoomDetails>
                                        {hotel.roomDetails}
                                    </RoomDetails>
                                </RoomDetailsWrapper>
                                <RoomDetailsWrapper>
                                    <PackageHotelInfos>
                                        {hotel.duration}
                                    </PackageHotelInfos>
                                    <PackageHotelInfos>
                                        {
                                            Object.keys(passengersCount).map((key: any, index: number) => (
                                                <>
                                                    {`${passengersCount[key]} ${key} `}
                                                </>
                                            ))
                                        }
                                    </PackageHotelInfos>
                                </RoomDetailsWrapper>
                            </CartHotelSection>
                        ))
                    }

                {
                    packageDetails.flights.map((flight: any, index: number ) => {
                        return(
                            <CartFlightSection key={index}>
                                {
                                    Object.keys(flight.trips).map((key: any, index: number) => {
                                        return(
                                            <div key={index}>
                                                <FlightCartItem>
                                                    <DepartureTextWrapper>
                                                        <Image
                                                            src={flight.trips[key].typeIMG}
                                                            alt="tripType"
                                                            height={18}
                                                            width={20}
                                                        />
                                                        <DepartureDestinationText>
                                                            {flight.trips[key].departure}
                                                        </DepartureDestinationText>
                                                    </DepartureTextWrapper>

                                                    <DottedLines/>

                                                    <FLightProviderImg
                                                        src={flight.trips[key].flightProviderIMG}
                                                        alt="flightProvider"
                                                        height={20}
                                                        width={67}
                                                    />

                                                    <DottedLines/>

                                                    <DestinationTextWrapper>
                                                        <DepartureDestinationText>
                                                            {flight.trips[key].destination}
                                                        </DepartureDestinationText>
                                                    </DestinationTextWrapper>

                                                </FlightCartItem>
                                                <FlightTimeContainer>
                                                    <DateText>
                                                        {flight.trips[key].departureDate}
                                                    </DateText>
                                                    <TimeText>
                                                        {flight.trips[key].departureTime}
                                                    </TimeText>
                                                    <TimeText>
                                                        {flight.trips[key].arrivalTime}
                                                    </TimeText>
                                                    <DateText>
                                                        {flight.trips[key].destinationDate}
                                                    </DateText>
                                                </FlightTimeContainer>
                                            </div>
                                        )
                                    })
                                }
                            </CartFlightSection>
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
            </CartTicketsWrapper>
            <CartFooterWrapper>
                <TotalText>
                    {t('packageCheckout.cart.total')}
                </TotalText>
                <TotalPrice>
                    {packageDetails.packagePrice} €
                </TotalPrice>
            </CartFooterWrapper>
        </CartWrapper>
    )
}

export default Cart