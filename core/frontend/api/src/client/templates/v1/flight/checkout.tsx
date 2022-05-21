import * as React from "react";
import {useEffect, useState} from "react";
import { ThemeProvider } from "styled-components";
import Header from "../components/Header";
import FlightImg from "../assets/img/flight.png"
import DepartureIcon from "../assets/img/departure-icon.svg"
import ArrivalIcon from "../assets/img/arrival-icon.svg"
import {
    GlobalStyle,
    MainWrapper,
    TopContentWrapper, Wrapper
} from "../styled";
import Breadcrumbs from "../components/Breadcrumbs";
import { getIcon } from "../helpers/icons";
import Footer from "../components/Footer";
import {
    DetailsWrapper,
    FlightsHeaderWrapper,
    FlightsHeader,
    FlightsWrapper,
    CartStepsWrapper,
    StepWrapper,
} from "./styled";
import {useTranslations} from "next-intl";
import FirstStep from "./steps/First";
import SecondStep from "./steps/Second";
import Cart from "./Cart";
import * as shortid from "shortid"

interface IPassenger {
    id: string,
    firstName: string;
    lastName: string;
    isAdult: boolean;
    age?: number;
}

const FlightPage = ({ websiteName, colorScheme }: any) => {

    const t = useTranslations()
    const [currentStep, setCurrentStep] = useState<number>(2)

    const getIcons = (iconName: string) => {
        return getIcon(iconName);
    };

    const myTheme: any = { colors: colorScheme, icon: getIcons };

    const passengersData = [
        {
           type: "adult"
        },
        {
            type: "adult"
        },
        {
            type: "children"
        },
        {
            type: "children"
        }
    ]

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

    const [passengers, setPassengers] = useState<IPassenger[]>([])

    const [contactDetails, setContactDetails] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        emailAddress: '',
        country: ''
    })

    useEffect(() => {
        setPassengers([])
        passengersData.map((passenger: { type: string }) => {
            setPassengers((prev: IPassenger[]) => {
                return [...prev, {
                    id: shortid.generate(),
                    firstName: "",
                    lastName: "",
                    isAdult: passenger.type === "adult",
                    ...(passenger.type !== "adult" ? {age: Number as unknown as number} : {})
                }]
            })
        })
    }, [])

    const passengersCount = {
        ...(passengers.filter((p) => p.isAdult).length > 0
            && {adults: passengers.filter((p) => p.isAdult).length} ),
        ...(passengers.filter((p) => !p.isAdult).length > 0
            && {children: passengers.filter((p) => !p.isAdult).length} ),
    }

    console.log(passengersCount)

    const displayStep = () => {
        switch(currentStep){
            case 1: return <FirstStep flightData={flightData}
                                      setCurrentStep={setCurrentStep}
                                      currentStep={currentStep}
                            />;

            case 2: return <SecondStep passengers={passengers}
                                       setCurrentStep={setCurrentStep}
                                       currentStep={currentStep}
                                       setPassengers={setPassengers}
                                       contactDetails={contactDetails}
                                       setContactDetails={setContactDetails}
                            />;

            default: return <FirstStep flightData={flightData}
                                       setCurrentStep={setCurrentStep}
                                       currentStep={currentStep}/>;
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
                        <Cart flightData={flightData} passengersCount={passengersCount} />
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

export default FlightPage;