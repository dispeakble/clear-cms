import {
    ResultMainContentWrapper
} from './styled'
import ResultMainContentUnit from '../ResultMainContentUnit'

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
            <ResultMainContentUnit flightInfo={flightInfo}/>
            )}
    </ResultMainContentWrapper>
}

export default ResultsMainContent;