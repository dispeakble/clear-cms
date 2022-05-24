import * as React from "react";
import {useEffect, useState} from "react";
import { ThemeProvider } from "styled-components";
import Header from "../../components/Header";
import FlightImg from "../../assets/img/flight.png"
import DepartureIcon from "../../assets/img/departure-icon.svg"
import ArrivalIcon from "../../assets/img/arrival-icon.svg"
import {
    GlobalStyle,
    MainWrapper,
    TopContentWrapper, Wrapper
} from "../../styled";
import Breadcrumbs from "../../components/Breadcrumbs";
import { getIcon } from "../../helpers/icons";
import Footer from "../../components/Footer";
import {
    DetailsWrapper,
    HotelsHeaderWrapper,
    HotelsHeader,
    HotelsWrapper,
    CartStepsWrapper,
    StepWrapper,
} from "./styled";
import {useTranslations} from "next-intl";
import FirstStep from "./steps/First";
import SecondStep from "./steps/Second";
import Cart from "./Cart";
import * as shortid from "shortid"
import FourthStep from "./steps/Fourth";

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

    const hotelData = [{
        name: "Hotel Victoria",
        address: "José del Campo Llanera, 2 - Puerto de la Cruz, Tenerife, Spain",
        rating: 4,
        adults: 1,
        children: 0,
        roomType: "Double Room",
        allInclusive: true,
        duration: "8 days / 7 nights",
        checkoutDay: "Monday, 10 iun.",
        checkoutTime: "14:00",
        price: 409
    }]

    const [passengers, setPassengers] = useState<IPassenger[]>([])
    const [paymentError, setPaymentError] = useState(true)

    const [contactDetails, setContactDetails] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        emailAddress: '',
        country: ''
    })

    const [invoiceDetails, setInvoiceDetails] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        emailAddress: '',
        country: '',
        address: '',
        city: '',
        zipCode: ''
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

    const displayHeader = () => {
        switch(currentStep){
            case 1 : return t('hotelCheckout.headers.first');
            case 2 : return t('hotelCheckout.headers.second');
            case 3 : return t('hotelCheckout.headers.third');
            case 4 : if(paymentError){
                return t('hotelCheckout.headers.fourthError')
            } else {
                return t('hotelCheckout.headers.fourthSuccess')
            }
            case 5: return t('hotelCheckout.headers.confirmed')
        }
    }

    const displayStep = () => {
        switch(currentStep){
            case 1: return <FirstStep hotelData={hotelData}
                                      setCurrentStep={setCurrentStep}
                                      currentStep={currentStep}
            />;

            case 2: return <SecondStep passengers={passengers}
                                       setCurrentStep={setCurrentStep}
                                       currentStep={currentStep}
                                       setPassengers={setPassengers}
                                       contactDetails={contactDetails}
                                       setContactDetails={setContactDetails}
                                       invoiceDetails={invoiceDetails}
                                       setInvoiceDetails={setInvoiceDetails}
            />;
            case 4: return <FourthStep paymentError={paymentError}
                                       currentStep={currentStep}
                                       setCurrentStep={setCurrentStep}
            />;
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
                        <Cart hotelData={hotelData} />
                        <HotelsWrapper>
                            <HotelsHeaderWrapper>
                                <HotelsHeader>
                                    {
                                        displayHeader()
                                    }
                                </HotelsHeader>
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
                            </HotelsHeaderWrapper>
                            {
                                displayStep()
                            }
                        </HotelsWrapper>
                    </DetailsWrapper>
                </Wrapper>
                <Footer />
            </MainWrapper>
        </ThemeProvider>
    );
};

export default FlightPage;