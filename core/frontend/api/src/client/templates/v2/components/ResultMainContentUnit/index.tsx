import {
  Description, PriceContainer, DescriptionRowOne, LandingLocation,
  MoreAboutFlight, FlightTime, Price, NumberOfPersons, FlightType, BookNowBtn,
  ResultMainContent, FlightDuration, PlanName, PlanIcon, TakeOffFlightLocation
} from "./styled";
import { useTranslations } from "next-intl";

interface FlightInformation {
  from: string,
  fromAbr: string,
  takeOffTime: string,
  flightDuration: string,
  planName: string,
  landingTime: string,
  to: string,
  toAbr: string;
}

interface FlightOtherDetail {
  price: string;
  noOfPersons: number;
  flightType: string;
}

interface MainContentUnitProperties {
  flightOne: FlightInformation;
  flightTwo: FlightInformation;
  otherDetail: FlightOtherDetail;
}

interface IResultMainContentUnit {
  flightInfo: MainContentUnitProperties;
}

const ResultMainContentUnit = ({ flightInfo }: IResultMainContentUnit) => {
  const t = useTranslations();
  return (
    <ResultMainContent>
      <Description data-testid="test-flight-description">
        <DescriptionRowOne>
          <TakeOffFlightLocation>
            {flightInfo.flightOne.from}<span>, {flightInfo.flightOne.fromAbr}</span>
          </TakeOffFlightLocation>
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
          <TakeOffFlightLocation>
            {flightInfo.flightTwo.from}<span>, {flightInfo.flightTwo.fromAbr}</span>
          </TakeOffFlightLocation>
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
        <NumberOfPersons>{flightInfo.otherDetail.noOfPersons} {t("flightList.person")}</NumberOfPersons>
        <FlightType>{flightInfo.otherDetail.flightType}</FlightType>
        <BookNowBtn>{t("flightList.bookNow")}</BookNowBtn>
      </PriceContainer>
    </ResultMainContent>
  );
};

export default ResultMainContentUnit;
