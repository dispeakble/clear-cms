import {
    ResultMainContentWrapper
} from './styled'
import ResultMainContentUnit from '../ResultMainContentUnit'
import {useTranslations} from "next-intl";


const ResultsMainContent = () => {
    const t = useTranslations()
    const flightsInformation = [
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.madrid"),
                toAbr: "MAD"
            },
            flightTwo: {
                from: t("flightList.madrid"),
                fromAbr: "MAD",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "715€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.directflight")
            }
        },
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.tenerife"),
                toAbr: "TFS"
            },
            flightTwo: {
                from: t("flightList.tenerife"),
                fromAbr: "TFS",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "575€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.oneStop")
            }
        },
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.madrid"),
                toAbr: "MAD"
            },
            flightTwo: {
                from: t("flightList.madrid"),
                fromAbr: "MAD",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "715€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.directflight")
            }
        },
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.tenerife"),
                toAbr: "TFS"
            },
            flightTwo: {
                from: t("flightList.tenerife"),
                fromAbr: "TFS",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "575€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.oneStop")
            }
        },
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.madrid"),
                toAbr: "MAD"
            },
            flightTwo: {
                from: t("flightList.madrid"),
                fromAbr: "MAD",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "715€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.directflight")
            }
        },
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.tenerife"),
                toAbr: "TFS"
            },
            flightTwo: {
                from: t("flightList.tenerife"),
                fromAbr: "TFS",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "575€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.oneStop")
            }
        },
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.madrid"),
                toAbr: "MAD"
            },
            flightTwo: {
                from: t("flightList.madrid"),
                fromAbr: "MAD",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "715€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.directflight")
            }
        },
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.tenerife"),
                toAbr: "TFS"
            },
            flightTwo: {
                from: t("flightList.tenerife"),
                fromAbr: "TFS",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "575€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.oneStop")
            }
        },
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.madrid"),
                toAbr: "MAD"
            },
            flightTwo: {
                from: t("flightList.madrid"),
                fromAbr: "MAD",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "715€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.directflight")
            }
        },
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.tenerife"),
                toAbr: "TFS"
            },
            flightTwo: {
                from: t("flightList.tenerife"),
                fromAbr: "TFS",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "575€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.oneStop")
            }
        },
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.madrid"),
                toAbr: "MAD"
            },
            flightTwo: {
                from: t("flightList.madrid"),
                fromAbr: "MAD",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "715€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.directflight")
            }
        },
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.tenerife"),
                toAbr: "TFS"
            },
            flightTwo: {
                from: t("flightList.tenerife"),
                fromAbr: "TFS",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "575€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.oneStop")
            }
        },
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.madrid"),
                toAbr: "MAD"
            },
            flightTwo: {
                from: t("flightList.madrid"),
                fromAbr: "MAD",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "715€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.directflight")
            }
        },
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.tenerife"),
                toAbr: "TFS"
            },
            flightTwo: {
                from: t("flightList.tenerife"),
                fromAbr: "TFS",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "575€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.oneStop")
            }
        },
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.madrid"),
                toAbr: "MAD"
            },
            flightTwo: {
                from: t("flightList.madrid"),
                fromAbr: "MAD",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "715€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.directflight")
            }
        },
        {
            flightOne: {
                from: t("flightList.bucharest"),
                fromAbr: "OTP",
                takeOffTime: "10:20",
                flightDuration: "4h 0m",
                planName: "Wizz Air W12345",
                landingTime: "16:20",
                to: t("flightList.tenerife"),
                toAbr: "TFS"
            },
            flightTwo: {
                from: t("flightList.tenerife"),
                fromAbr: "TFS",
                takeOffTime: "17:20",
                flightDuration: "1h 0m",
                planName: "Wizz Air W12345",
                landingTime: "19:20",
                to: t("flightList.bucharest"),
                toAbr: "OTP"
            },
            otherDetail: {
                price: "575€",
                noOfPersons: 1,
                flightType: t("flightList.flightType.oneStop")
            }
        }

    ];


    return <ResultMainContentWrapper>
        {flightsInformation?.map(flightInfo =>
            <ResultMainContentUnit flightInfo={flightInfo}/>
            )}
    </ResultMainContentWrapper>
}

export default ResultsMainContent;