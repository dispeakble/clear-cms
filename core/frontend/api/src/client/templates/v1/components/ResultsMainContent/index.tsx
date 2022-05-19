import {
    ResultMainContentWrapper, Description, PriceContainer, DescriptionRowOne, LandingLocation,
    MoreAboutFlight, FlightTime, Price, NumberOfPersons, FlightType, BookNowBtn,
    ResultMainContent, FlightDuration, PlanName, PlanIcon, TakeOffFlightLocation
} from './styled'

const flightsInformation = [
    {
        flightOne: {
            from: "Bucharest",
            fromAbr: "OTP",
            takeOffTime: "10:20",
            flightDuration: "4h 0m",
            planName: "Wizz Air W12345",
            landingTime: "16:20",
            to: "Madrid",
            toAbr: "MAD"
        },
        flightTwo: {
            from: "Madrid",
            fromAbr: "MAD",
            takeOffTime: "17:20",
            flightDuration: "1h 0m",
            planName: "Wizz Air W12345",
            landingTime: "19:20",
            to: "Bucharest",
            toAbr: "OTP"
        },
        otherDetail: {
            price: "715€",
            noOfPersons: 1,
            flightType: 'direct flight'
        }
    },
    {
        flightOne: {
            from: "Bucharest",
            fromAbr: "OTP",
            takeOffTime: "10:20",
            flightDuration: "4h 0m",
            planName: "Wizz Air W12345",
            landingTime: "16:20",
            to: "Tenerife",
            toAbr: "TFS"
        },
        flightTwo: {
            from: "Tenerife",
            fromAbr: "TFS",
            takeOffTime: "17:20",
            flightDuration: "1h 0m",
            planName: "Wizz Air W12345",
            landingTime: "19:20",
            to: "Bucharest",
            toAbr: "OTP"
        },
        otherDetail: {
            price: "575€",
            noOfPersons: 1,
            flightType: 'one stop in MAD'
        }
    },
    {
        flightOne: {
            from: "Bucharest",
            fromAbr: "OTP",
            takeOffTime: "10:20",
            flightDuration: "4h 0m",
            planName: "Wizz Air W12345",
            landingTime: "16:20",
            to: "Madrid",
            toAbr: "MAD"
        },
        flightTwo: {
            from: "Madrid",
            fromAbr: "MAD",
            takeOffTime: "17:20",
            flightDuration: "1h 0m",
            planName: "Wizz Air W12345",
            landingTime: "19:20",
            to: "Bucharest",
            toAbr: "OTP"
        },
        otherDetail: {
            price: "715€",
            noOfPersons: 1,
            flightType: 'direct flight'
        }
    },
    {
        flightOne: {
            from: "Bucharest",
            fromAbr: "OTP",
            takeOffTime: "10:20",
            flightDuration: "4h 0m",
            planName: "Wizz Air W12345",
            landingTime: "16:20",
            to: "Tenerife",
            toAbr: "TFS"
        },
        flightTwo: {
            from: "Tenerife",
            fromAbr: "TFS",
            takeOffTime: "17:20",
            flightDuration: "1h 0m",
            planName: "Wizz Air W12345",
            landingTime: "19:20",
            to: "Bucharest",
            toAbr: "OTP"
        },
        otherDetail: {
            price: "575€",
            noOfPersons: 1,
            flightType: 'one stop in MAD'
        }
    },
    {
        flightOne: {
            from: "Bucharest",
            fromAbr: "OTP",
            takeOffTime: "10:20",
            flightDuration: "4h 0m",
            planName: "Wizz Air W12345",
            landingTime: "16:20",
            to: "Madrid",
            toAbr: "MAD"
        },
        flightTwo: {
            from: "Madrid",
            fromAbr: "MAD",
            takeOffTime: "17:20",
            flightDuration: "1h 0m",
            planName: "Wizz Air W12345",
            landingTime: "19:20",
            to: "Bucharest",
            toAbr: "OTP"
        },
        otherDetail: {
            price: "715€",
            noOfPersons: 1,
            flightType: 'direct flight'
        }
    },
    {
        flightOne: {
            from: "Bucharest",
            fromAbr: "OTP",
            takeOffTime: "10:20",
            flightDuration: "4h 0m",
            planName: "Wizz Air W12345",
            landingTime: "16:20",
            to: "Tenerife",
            toAbr: "TFS"
        },
        flightTwo: {
            from: "Tenerife",
            fromAbr: "TFS",
            takeOffTime: "17:20",
            flightDuration: "1h 0m",
            planName: "Wizz Air W12345",
            landingTime: "19:20",
            to: "Bucharest",
            toAbr: "OTP"
        },
        otherDetail: {
            price: "575€",
            noOfPersons: 1,
            flightType: 'one stop in MAD'
        }
    },
    {
        flightOne: {
            from: "Bucharest",
            fromAbr: "OTP",
            takeOffTime: "10:20",
            flightDuration: "4h 0m",
            planName: "Wizz Air W12345",
            landingTime: "16:20",
            to: "Madrid",
            toAbr: "MAD"
        },
        flightTwo: {
            from: "Madrid",
            fromAbr: "MAD",
            takeOffTime: "17:20",
            flightDuration: "1h 0m",
            planName: "Wizz Air W12345",
            landingTime: "19:20",
            to: "Bucharest",
            toAbr: "OTP"
        },
        otherDetail: {
            price: "715€",
            noOfPersons: 1,
            flightType: 'direct flight'
        }
    },
    {
        flightOne: {
            from: "Bucharest",
            fromAbr: "OTP",
            takeOffTime: "10:20",
            flightDuration: "4h 0m",
            planName: "Wizz Air W12345",
            landingTime: "16:20",
            to: "Tenerife",
            toAbr: "TFS"
        },
        flightTwo: {
            from: "Tenerife",
            fromAbr: "TFS",
            takeOffTime: "17:20",
            flightDuration: "1h 0m",
            planName: "Wizz Air W12345",
            landingTime: "19:20",
            to: "Bucharest",
            toAbr: "OTP"
        },
        otherDetail: {
            price: "575€",
            noOfPersons: 1,
            flightType: 'one stop in MAD'
        }
    }

];


const ResultsMainContent = () => {
    return <ResultMainContentWrapper>
        {flightsInformation?.map(flightInfo =>
        <ResultMainContent>
        <Description>
            <DescriptionRowOne>
                <TakeOffFlightLocation>{flightInfo.flightOne.from}<span>, {flightInfo.flightOne.fromAbr}</span></TakeOffFlightLocation>
                <FlightTime>{flightInfo.flightOne.takeOffTime}</FlightTime>
                <MoreAboutFlight>
                    <FlightDuration>{flightInfo.flightOne.flightDuration}</FlightDuration>
                    <PlanName>{flightInfo.flightOne.planName}</PlanName>
                    <PlanIcon />
                    </MoreAboutFlight>
                <FlightTime>{flightInfo.flightOne.landingTime}</FlightTime>
                <LandingLocation>{flightInfo.flightOne.to}<span>, {flightInfo.flightOne.toAbr}</span></LandingLocation>
            </DescriptionRowOne>
            <DescriptionRowOne>
                <TakeOffFlightLocation>{flightInfo.flightTwo.from}<span>, {flightInfo.flightTwo.fromAbr}</span></TakeOffFlightLocation>
                <FlightTime>{flightInfo.flightTwo.takeOffTime}</FlightTime>
                <MoreAboutFlight><FlightDuration>{flightInfo.flightTwo.flightDuration}</FlightDuration>
                    <PlanName>{flightInfo.flightTwo.planName}</PlanName>
                    <PlanIcon /></MoreAboutFlight>
                <FlightTime>{flightInfo.flightTwo.landingTime}</FlightTime>
                <LandingLocation>{flightInfo.flightTwo.to}<span>, {flightInfo.flightTwo.toAbr}</span></LandingLocation>
            </DescriptionRowOne>
        </Description>
        <PriceContainer>
            <Price>{flightInfo.otherDetail.price}</Price>
            <NumberOfPersons>{flightInfo.otherDetail.noOfPersons} person</NumberOfPersons>
            <FlightType>{flightInfo.otherDetail.flightType}</FlightType>
            <BookNowBtn>Book Now</BookNowBtn>
        </PriceContainer>
        </ResultMainContent>
            )}
    </ResultMainContentWrapper>
}

export default ResultsMainContent;