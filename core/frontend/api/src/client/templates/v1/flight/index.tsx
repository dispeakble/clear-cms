import * as React from "react";
import { useState } from "react";
import { ThemeProvider } from "styled-components";
import Header from "../components/Header";
import HotelDetail from "../components/HotelDetail";
import HotelAbout from "../components/HotelAbout";
import FlightImg from "../assets/img/flight.png"
import DepartureIcon from "../assets/img/departure-icon.svg"
import ArrivalIcon from "../assets/img/arrival-icon.svg"
import {
    ContentWrapper,
    GlobalStyle,
    MainWrapper,
    TopContentWrapper, Wrapper
} from "../styled";
import Image from "next/image"
import Breadcrumbs from "../components/Breadcrumbs";
import HotelAvailable from "../components/HotelAvailable";
import moment from "moment";
import { getIcon } from "../helpers/icons";
import Footer from "../components/Footer";
import {
    CartHeader,
    CartHeaderWrapper,
    CartWrapper,
    DetailsWrapper,
    FlightsHeaderWrapper,
    FlightsHeader,
    FlightsWrapper,
    CartStepsWrapper,
    StepWrapper,
} from "./styled";
import {useTranslations} from "next-intl";
import FirstStep from "./steps/First";
import Cart from "./Cart";

const HotelPage = ({ websiteName, websiteSlogan, colorScheme }: any) => {

    const t = useTranslations()
    const [currentStep, setCurrentStep] = useState<number>(1)

    const getIcons = (iconName: string) => {
        return getIcon(iconName);
    };

    const myTheme: any = { colors: colorScheme, icon: getIcons };

    const flightData = [
        {
            typeIMG: DepartureIcon,
            flightProviderIMG: FlightImg,
            type: "departure",
            departure: "Bucharest",
            departureShort: "OTP",
            departureDate: "Monday, 10 iun.",
            departureTime: "00:20",
            destination: "Tenerife",
            destinationShort: "TFS",
            destinationDate: "Monday, 10 iun.",
            arrivalTime: "06:20",
            duration: "7h 30m",
            aircraft: "Wizz Air",
            aircraftRef: "W12345",
            stopover: {
                city: "Madrid",
                short: "MAD",
                duration: "2h 35m",
                date: "Monday, 10 iun.",
                arrival: "18:20",
                departure: "18:20",
            }
        },
        {
            typeIMG: ArrivalIcon,
            flightProviderIMG: FlightImg,
            type: "return",
            departure: "Tenerife",
            departureShort: "TFS",
            departureDate: "Monday, 10 iun.",
            departureTime: "00:20",
            destination: "Bucharest",
            destinationShort: "OTP",
            destinationDate: "Monday, 10 iun.",
            arrivalTime: "06:20",
            duration: "7h 30m",
            aircraft: "Wizz Air",
            aircraftRef: "W12345",
            stopover: {
                city: "Madrid",
                short: "MAD",
                duration: "2h 35m",
                date: "Monday, 10 iun.",
                arrival: "18:20",
                departure: "18:20",
            }
        },
        {
            typeIMG: DepartureIcon,
            flightProviderIMG: FlightImg,
            type: "departure",
            departure: "Bucharest",
            departureShort: "OTP",
            departureDate: "Monday, 10 iun.",
            departureTime: "00:20",
            destination: "Tenerife",
            destinationShort: "TFS",
            destinationDate: "Monday, 10 iun.",
            arrivalTime: "06:20",
            duration: "7h 30m",
            aircraft: "Wizz Air",
            aircraftRef: "W12345"
        },
    ]

    const displayStep = () => {
        switch(currentStep){
            case 1: return <FirstStep flightData={flightData} />;
            default: return <FirstStep flightData={flightData} />;
        }
    }

    return (
        <ThemeProvider theme={myTheme}>
            <GlobalStyle />
            <MainWrapper data-testid="hotel-page-wrapper">
                <TopContentWrapper>
                    <Header websiteName={websiteName} />
                </TopContentWrapper>
                <Wrapper>
                    <Breadcrumbs />
                    <DetailsWrapper>
                        <Cart flightData={flightData} />
                        <FlightsWrapper>
                            <FlightsHeaderWrapper>
                                <FlightsHeader>
                                    {t('flightsCheckout.flights.header')}
                                </FlightsHeader>
                                <CartStepsWrapper>
                                    <StepWrapper currentStep={currentStep===1}>
                                        1
                                    </StepWrapper>
                                    <StepWrapper currentStep={currentStep===2}>
                                        2
                                    </StepWrapper>
                                    <StepWrapper currentStep={currentStep===3}>
                                        3
                                    </StepWrapper>
                                    <StepWrapper currentStep={currentStep===4}>
                                        4
                                    </StepWrapper>
                                    <StepWrapper currentStep={currentStep===5}>
                                        5
                                    </StepWrapper>
                                </CartStepsWrapper>
                            </FlightsHeaderWrapper>
                            {
                                displayStep()
                            }
                        </FlightsWrapper>
                    </DetailsWrapper>
                </Wrapper>
                <Footer />
            </MainWrapper>
        </ThemeProvider>
    );
};

export default HotelPage;