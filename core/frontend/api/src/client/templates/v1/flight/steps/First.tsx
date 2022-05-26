import {
    Flight,
    FlightAircraft,
    FlightDescription,
    FlightDescriptionContainer,
    FlightDetails,
    FlightDetailsWrapper,
    FlightDuration,
    FlightExpandDetails,
    FlightLocationsText,
    FLightProviderImg,
    Flights,
    FlightInfosContainer,
    FlightInfosDate,
    FlighInfosDateTimeWrapper,
    FlightInfosItem,
    FlightInfosLocationText,
    FlightInfosTime,
    PricingRules,
    PricingText,
    Stopover,
    StopoverText,
    FlightInfosDurationAircraftWrapper,
    DottedLines,
    FlightDestinationTextContainer,
    FlightDepartureTextContainer,
    FlightInfosDateLocationDestinationWrapper,
    FlightInfosDateLocationDepartureWrapper,
    ButtonsContainer,
    CustomButton
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
    setCurrentStep: any;
    currentStep: number;
}

const FirstStep = ({flightData, setCurrentStep, currentStep}: IProps) => {

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
                flightData.map((flight: any, index: number) => {
                    return(
                        <FlightDetailsWrapper key={index}>
                            <FlightDetails>
                                <Flight>
                                    <FlightDepartureTextContainer>
                                        <Image
                                            src={DepartureIcon}
                                            width={20}
                                            height={16}
                                            alt="departureIMG"
                                        />
                                        <FlightLocationsText>
                                            {flight.departure}
                                        </FlightLocationsText>
                                    </FlightDepartureTextContainer>
                                    <DottedLines/>
                                    <FlightDuration>
                                        {flight.duration}
                                    </FlightDuration>
                                    <DottedLines/>
                                    <FlightDestinationTextContainer>
                                        <Image
                                            src={ArrivalIcon}
                                            width={20}
                                            height={16}
                                            alt="arrivalIMG"
                                        />
                                        <FlightLocationsText>
                                            {flight.destination}
                                        </FlightLocationsText>
                                    </FlightDestinationTextContainer>
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
                            </FlightExpandDetails>
                            <FlightInfosContainer>
                                <FlightInfosItem>
                                    <FlightInfosDateLocationDepartureWrapper>
                                        <FlighInfosDateTimeWrapper>
                                            <FlightInfosDate>
                                                {flight.departureDate}
                                            </FlightInfosDate>
                                            <FlightInfosTime>
                                                {flight.departureTime}
                                            </FlightInfosTime>
                                        </FlighInfosDateTimeWrapper>
                                        <FlightInfosLocationText>
                                            {flight.departure}, <span>{flight.departureShort}</span>
                                        </FlightInfosLocationText>
                                    </FlightInfosDateLocationDepartureWrapper>

                                    <DottedLines/>

                                    <FlightInfosDurationAircraftWrapper>
                                        <FlightInfosTime>
                                            {flight.duration}
                                        </FlightInfosTime>
                                        <FlightAircraft>
                                            {flight.aircraft} <span>{flight.aircraftRef}</span>
                                        </FlightAircraft>
                                        <FLightProviderImg
                                            src={flight.flightProviderIMG}
                                            alt="flightProvider"
                                            height={20}
                                            width={67}
                                        />
                                    </FlightInfosDurationAircraftWrapper>

                                    <DottedLines/>

                                    <FlightInfosDateLocationDestinationWrapper>
                                        <FlighInfosDateTimeWrapper>
                                            <FlightInfosDate>
                                                {flight.stopover ? flight.stopover.date : flight.destinationDate}
                                            </FlightInfosDate>
                                            <FlightInfosTime>
                                                {flight.stopover ? flight.stopover.departure : flight.departureTime}
                                            </FlightInfosTime>
                                        </FlighInfosDateTimeWrapper>
                                        <FlightInfosLocationText>
                                            {flight.stopover ? flight.stopover.city : flight.destination}, <span>{flight.stopover ? flight.stopover.short : flight.destinationShort}</span>
                                        </FlightInfosLocationText>
                                    </FlightInfosDateLocationDestinationWrapper>

                                </FlightInfosItem>

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
                                    <FlightInfosItem>

                                        <FlightInfosDateLocationDepartureWrapper>
                                            <FlighInfosDateTimeWrapper>
                                                <FlightInfosDate>
                                                    {flight.stopover.date}
                                                </FlightInfosDate>
                                                <FlightInfosTime>
                                                    {flight.stopover.departure}
                                                </FlightInfosTime>
                                            </FlighInfosDateTimeWrapper>
                                            <FlightInfosLocationText>
                                                {flight.stopover.city}, <span>{flight.stopover.short}</span>
                                            </FlightInfosLocationText>
                                        </FlightInfosDateLocationDepartureWrapper>

                                        <DottedLines/>

                                        <FlightInfosDurationAircraftWrapper>
                                            <FlightInfosTime>
                                                {flight.duration}
                                            </FlightInfosTime>
                                            <FlightAircraft>
                                                {flight.aircraft} <span>{flight.aircraftRef}</span>
                                            </FlightAircraft>
                                            <FLightProviderImg
                                                src={flight.flightProviderIMG}
                                                alt="flightProvider"
                                                height={20}
                                                width={67}
                                            />
                                        </FlightInfosDurationAircraftWrapper>

                                        <DottedLines/>

                                        <FlightInfosDateLocationDestinationWrapper>
                                            <FlighInfosDateTimeWrapper>
                                                <FlightInfosDate>
                                                    {flight.destinationDate}
                                                </FlightInfosDate>
                                                <FlightInfosTime>
                                                    {flight.arrivalTime}
                                                </FlightInfosTime>
                                            </FlighInfosDateTimeWrapper>
                                            <FlightInfosLocationText>
                                                {flight.destination}, <span>{flight.destinationShort}</span>
                                            </FlightInfosLocationText>
                                        </FlightInfosDateLocationDestinationWrapper>

                                    </FlightInfosItem>
                                }
                            </FlightInfosContainer>
                        </FlightDetailsWrapper>
                    )
                })
            }
            <ButtonsContainer hasOneChild>
                <CustomButton isActive onClick={() => setCurrentStep((prev: number) => prev + 1)}>
                    {t('flightsCheckout.main.nextStep')}
                    <span>
                        {currentStep+1}
                    </span>
                </CustomButton>
            </ButtonsContainer>
        </Flights>
    )
}

export default FirstStep