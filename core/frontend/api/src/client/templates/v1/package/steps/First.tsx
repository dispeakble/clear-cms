import {
  Flights,
  ButtonsContainer,
  CustomButton,
  StarsWrapper,
  StarsText,
  HotelTicketInfosContainer,
  PackageItemsWrapper,
  PackageItemsHeaderContainer,
  PackageHeader,
  PackageOffers,
  HotelMainInfosContainer,
  HotelInclusivesContainer,
  HotelPackageTitle,
  FlightsSectionPackage,
  TicketHotelTitleContainer,
  IncludedText,
  HotelPackageAddress,
  PackageHotelInfos, PlusContainer,
  TextInfoItem, TextContainer, PackagePriceWrapper, PackagePriceText, PackagePrice
} from "../styled";
import Image from "next/image";
import YellowStar from "../../assets/img/starYellowImage.png";
import GrayStar from "../../assets/img/starGrayImage.png";
import PackagePlus from "../../assets/img/packagePlus-icon.svg";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  DateText,
  DepartureDestinationText,
  DepartureTextWrapper, DestinationTextWrapper,
  DottedLines,
  FlightCartItem,
  FLightProviderImg, FlightTimeContainer, TimeText
} from "../../flight/styled";
import Link from "next/link";
import { StyledStars } from "../../components/Styled/stars";

interface IProps {
  packageDetails: any;
  setCurrentStep: any;
  currentStep: number;
  passengersCount: any;
}

const FirstStep = ({ packageDetails, setCurrentStep, currentStep, passengersCount }: IProps) => {

  const t = useTranslations();

  return (
    <Flights data-testid="test-package-first-step">
      <PackageItemsWrapper>
        <PackageItemsHeaderContainer>
          <PackageHeader>
            {t("packageCheckout.details.title")}
          </PackageHeader>
        </PackageItemsHeaderContainer>
        <PackageOffers>

          {
            packageDetails.hotels.map((hotel: any, index: number) => {
              return (
                <HotelTicketInfosContainer key={index}>
                  <HotelMainInfosContainer>
                    <TicketHotelTitleContainer>
                      <HotelPackageTitle>
                        {hotel.name}
                      </HotelPackageTitle>
                      <StarsWrapper style={{ gap: "2px" }}>
                        <StyledStars  stars={hotel.rating} size='small'/>
                        <StarsText style={{ marginLeft: "5px" }}>
                          ({t("hotelCheckout.main.stars", { stars: hotel.rating })})
                        </StarsText>
                      </StarsWrapper>
                    </TicketHotelTitleContainer>
                    <HotelPackageAddress>
                      {hotel.address}
                    </HotelPackageAddress>
                  </HotelMainInfosContainer>
                  <HotelInclusivesContainer>
                    <IncludedText>
                      {t("global.included")}:
                    </IncludedText>
                    <PackageHotelInfos>
                      {hotel.roomType}
                    </PackageHotelInfos>
                    <PackageHotelInfos>
                      {hotel.roomDetails}
                    </PackageHotelInfos>
                    <PackageHotelInfos>
                      {
                        Object.keys(passengersCount).map((key: any, index: number) => (
                          <div key={index}>
                            {`${passengersCount[key]} ${key} `}
                          </div>
                        ))
                      }
                    </PackageHotelInfos>
                  </HotelInclusivesContainer>
                </HotelTicketInfosContainer>
              );
            })
          }
          {
            packageDetails.flights.map((flight: any, index: number) => {
              return (
                <HotelTicketInfosContainer key={index}>
                  <FlightsSectionPackage>
                    {
                      Object.keys(flight.trips).map((key: any, index: number) => {
                        return (
                          <div key={index}>
                            <FlightCartItem>
                              <DepartureTextWrapper>
                                <Image
                                  src={flight.trips[key].typeIMG}
                                  alt="tripType"
                                  height={18}
                                  width={20}
                                />
                                <DepartureDestinationText>
                                  {flight.trips[key].departure}
                                </DepartureDestinationText>
                              </DepartureTextWrapper>

                              <DottedLines />

                              <FLightProviderImg
                                src={flight.trips[key].flightProviderIMG}
                                alt="flightProvider"
                                height={20}
                                width={67}
                              />

                              <DottedLines />

                              <DestinationTextWrapper>
                                <DepartureDestinationText>
                                  {flight.trips[key].destination}
                                </DepartureDestinationText>
                              </DestinationTextWrapper>

                            </FlightCartItem>
                            <FlightTimeContainer>
                              <DateText>
                                {flight.trips[key].departureDate}
                              </DateText>
                              <TimeText>
                                {flight.trips[key].departureTime}
                              </TimeText>
                              <TimeText>
                                {flight.trips[key].arrivalTime}
                              </TimeText>
                              <DateText>
                                {flight.trips[key].destinationDate}
                              </DateText>
                            </FlightTimeContainer>
                          </div>
                        );
                      })
                    }
                  </FlightsSectionPackage>
                  <HotelInclusivesContainer>
                    <IncludedText>
                      {t("global.included")}:
                    </IncludedText>
                    {
                      flight &&
                      flight.services.map((service: any, index: number) => (
                        <PackageHotelInfos key={index}>
                          {service}
                        </PackageHotelInfos>
                      ))
                    }
                  </HotelInclusivesContainer>
                </HotelTicketInfosContainer>
              );
            })
          }

          <TextContainer>
            <TextInfoItem>
              {t("packageCheckout.main.termsAndConditionsApply")}
            </TextInfoItem>
            <TextInfoItem>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut finibus lorem. Maecenas sit amet
              matti
              nulla, quis scelerisque lectus. Phasellus scelerisque nunc ac tincidunt efficitur. Sed placerat ipsum sit
              amet libero
              aliquam pulvinar. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
              Aenean tempor erat at porttitor molestie. Duis pulvinar sapien eu pulvinar fringilla. Etiam vitae eros in
              tellus
              convallis tempor. Donec eu mollis nulla. Quisque tincidunt metus et ligula elementum mollis.
            </TextInfoItem>
            <TextInfoItem>
              {t("packageCheckout.main.termsAndConditionsLong")} <Link href="#">{t("global.termsAndConditions")}</Link>.
            </TextInfoItem>
          </TextContainer>
        </PackageOffers>
      </PackageItemsWrapper>
      <PackagePriceWrapper>
        <PackagePriceText>
          {t("packageCheckout.cart.total")}
        </PackagePriceText>
        <PackagePrice>
          {packageDetails.packagePrice} €
        </PackagePrice>
      </PackagePriceWrapper>
      <ButtonsContainer hasOneChild>
        <CustomButton isActive data-testid="test-next-button"
                      onClick={() => setCurrentStep((prev: number) => prev + 1)}>
          {t("flightsCheckout.main.nextStep")}
          <span>
                        {currentStep + 1}
                    </span>
        </CustomButton>
      </ButtonsContainer>
    </Flights>
  );
};

export default FirstStep;