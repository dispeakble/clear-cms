import {
  ResultMainContentWrapper
} from "./styled";
import ResultMainContentUnit from "../ResultMainContentUnit";
import { useTranslations } from "next-intl";


const ResultsMainContent = () => {
  const t = useTranslations();

  const getFlight = () => {

    return {
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
    };
  };


  return <ResultMainContentWrapper>
    {Array.from(new Array(5)).map((flightInfo: any, index: number) =>
      <ResultMainContentUnit key={index} flightInfo={getFlight()} />
    )}
  </ResultMainContentWrapper>;
};

export default ResultsMainContent;