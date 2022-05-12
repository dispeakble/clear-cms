import {
    Flight, FlightAircraft,
    FlightDescription,
    FlightDescriptionContainer,
    FlightDetails,
    FlightDetailsWrapper,
    FlightDuration,
    FlightExpandDetails,
    FlightLocationsText, FLightProviderImg,
    Flights,
    FlightStopoverContainer, FlightStopoverDate,
    FlightStopoverDateLocationWrapper,
    FlightStopoverDateTimeWrapper,
    FlightStopoverItem, FlightStopoverLocationText, FlightStopoverTime,
    FlightTextContainer,
    PricingRules,
    PricingText,
    Stopover, StopoverText
} from "../styled";
import Image from "next/image";
import DepartureIcon from "../../assets/img/departure-icon.svg";
import ArrivalIcon from "../../assets/img/arrival-icon.svg";
import InfoIcon from "../../assets/img/info-icon.svg";
import StopoverIcon from "../../assets/img/stopover-icon.svg";
import * as React from "react";
import {useTranslations} from "next-intl";
import {useState} from "react";

interface IProps {
    flightData: any;
}

const FirstStep = ({flightData}: IProps) => {

    const  t = useTranslations();
    const [isOpen, setIsOpen] = useState<number>(-1)

    const handleExpand = (i: number) => {
        if(isOpen === i){
            setIsOpen(-1)
        } else setIsOpen(i)
    }

    return(
        <Flights>
            {
                flightData.map((flight, index) => {
                    return(
                        <FlightDetailsWrapper>
                            <FlightDetails>
                                <Flight>
                                    <FlightTextContainer>
                                        <Image
                                            src={DepartureIcon}
                                            width={20}
                                            height={16}
                                            alt="departureIMG"
                                        />
                                        <FlightLocationsText>
                                            {flight.departure}
                                        </FlightLocationsText>
                                    </FlightTextContainer>
                                    <FlightDuration>
                                        {flight.duration}
                                    </FlightDuration>
                                    <FlightTextContainer>
                                        <Image
                                            src={ArrivalIcon}
                                            width={20}
                                            height={16}
                                            alt="arrivalIMG"
                                        />
                                        <FlightLocationsText>
                                            {flight.destination}
                                        </FlightLocationsText>
                                    </FlightTextContainer>
                                </Flight>
                                <PricingRules onClick={() => handleExpand(index)}>
                                    <Image src={InfoIcon} alt="info-pricing" height={12} width={12}/>
                                    <PricingText>
                                        {t('flightsCheckout.flights.pricingRules')}
                                    </PricingText>
                                </PricingRules>
                            </FlightDetails>
                            <FlightExpandDetails expand={isOpen === index}>
                                <FlightDescriptionContainer>
                                    <FlightDescription>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu dolor efficitur, ullamcorper lectus id, consectetur purus. Cras consequat dapibus aliquam. Aenean hendrerit convallis ultrices. Praesent scelerisque orci vel arcu tincidunt, eu facilisis massa pellentesque. Ut facilisis sem ipsum, vitae porta enim dignissim consequat. Etiam nec placerat nibh. Aliquam posuere auctor lacus vitae sollicitudin. Quisque facilisis accumsan sapien ac efficitur. Etiam eget urna vulputate, faucibus ipsum et, imperdiet ipsum. Nam eu nunc a erat tincidunt feugiat sit amet id lacus. Nunc id risus vitae neque dictum eleifend eu quis felis.
                                    </FlightDescription>
                                </FlightDescriptionContainer>
                                <FlightStopoverContainer>
                                    <FlightStopoverItem>
                                        <FlightStopoverDateLocationWrapper>
                                            <FlightStopoverDateTimeWrapper>
                                                <FlightStopoverDate>
                                                    {flight.departureDate}
                                                </FlightStopoverDate>
                                                <FlightStopoverTime>
                                                    {flight.departureTime}
                                                </FlightStopoverTime>
                                            </FlightStopoverDateTimeWrapper>
                                            <FlightStopoverLocationText>
                                                {flight.departure}, <span>{flight.departureShort}</span>
                                            </FlightStopoverLocationText>
                                        </FlightStopoverDateLocationWrapper>

                                        <FlightStopoverDateLocationWrapper>
                                            <FlightStopoverTime>
                                                {flight.duration}
                                            </FlightStopoverTime>
                                            <FlightAircraft>
                                                {flight.aircraft} <span>{flight.aircraftRef}</span>
                                            </FlightAircraft>
                                            <FLightProviderImg
                                                src={flight.flightProviderIMG}
                                                alt="flightProvider"
                                                height={20}
                                                width={67}
                                            />
                                        </FlightStopoverDateLocationWrapper>

                                        <FlightStopoverDateLocationWrapper>
                                            <FlightStopoverDateTimeWrapper>
                                                <FlightStopoverDate>
                                                    {flight.stopover ? flight.stopover.date : flight.destinationDate}
                                                </FlightStopoverDate>
                                                <FlightStopoverTime>
                                                    {flight.stopover ? flight.stopover.departure : flight.departureTime}
                                                </FlightStopoverTime>
                                            </FlightStopoverDateTimeWrapper>
                                            <FlightStopoverLocationText>
                                                {flight.stopover ? flight.stopover.city : flight.destination}, <span>{flight.stopover ? flight.stopover.short : flight.destinationShort}</span>
                                            </FlightStopoverLocationText>
                                        </FlightStopoverDateLocationWrapper>

                                    </FlightStopoverItem>

                                    {
                                        (flight.stopover) &&
                                        <Stopover>
                                            <Image
                                                src={StopoverIcon}
                                                width={22}
                                                height={18}
                                                alt="stopoverIMG"
                                            />
                                            <StopoverText>
                                                Stopover in <span>{flight.stopover.city}</span> for <span>{flight.stopover.duration}</span>
                                            </StopoverText>
                                        </Stopover>
                                    }

                                    {
                                        flight.stopover &&
                                        <FlightStopoverItem>

                                            <FlightStopoverDateLocationWrapper>
                                                <FlightStopoverDateTimeWrapper>
                                                    <FlightStopoverDate>
                                                        {flight.stopover.date}
                                                    </FlightStopoverDate>
                                                    <FlightStopoverTime>
                                                        {flight.stopover.departure}
                                                    </FlightStopoverTime>
                                                </FlightStopoverDateTimeWrapper>
                                                <FlightStopoverLocationText>
                                                    {flight.stopover.city}, <span>{flight.stopover.short}</span>
                                                </FlightStopoverLocationText>
                                            </FlightStopoverDateLocationWrapper>

                                            <FlightStopoverDateLocationWrapper>
                                                <FlightStopoverTime>
                                                    {flight.duration}
                                                </FlightStopoverTime>
                                                <FlightAircraft>
                                                    {flight.aircraft} <span>{flight.aircraftRef}</span>
                                                </FlightAircraft>
                                                <FLightProviderImg
                                                    src={flight.flightProviderIMG}
                                                    alt="flightProvider"
                                                    height={20}
                                                    width={67}
                                                />
                                            </FlightStopoverDateLocationWrapper>

                                            <FlightStopoverDateLocationWrapper>
                                                <FlightStopoverDateTimeWrapper>
                                                    <FlightStopoverDate>
                                                        {flight.destinationDate}
                                                    </FlightStopoverDate>
                                                    <FlightStopoverTime>
                                                        {flight.arrivalTime}
                                                    </FlightStopoverTime>
                                                </FlightStopoverDateTimeWrapper>
                                                <FlightStopoverLocationText>
                                                    {flight.destination}, <span>{flight.destinationShort}</span>
                                                </FlightStopoverLocationText>
                                            </FlightStopoverDateLocationWrapper>



                                        </FlightStopoverItem>
                                    }
                                </FlightStopoverContainer>
                            </FlightExpandDetails>
                        </FlightDetailsWrapper>
                    )
                })
            }
        </Flights>
    )
}

export default FirstStep