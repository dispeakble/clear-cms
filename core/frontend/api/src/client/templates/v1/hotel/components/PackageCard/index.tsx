import {
  CardWrapper,
  ImageContainer,
  HotelDetails,
  HotelDetailsWrapper,
  HotelTitle,
  AddressText,
  RatingContainer,
  HotelItems,
  ItemContainer,
  ItemText,
  PricingDetailsWrapper,
  StartingPriceContainer,
  StartingPriceText,
  AdultNightText,
  TaxText,
  BookNowContainer,
  BookNowButton,
  PriceTextContainer,
  DetailsContainer,
  ServicesTextContainer,
  ServicesDescriptionText,
  HotelMain,
  HotelMainContainer,
  HotelDetailsContainer,
  HotelDescriptionContainer, HotelDescription, HotelServicesContainer
} from "../../styled";
import Image from "next/image";
import YellowStar from "../../../assets/img/starYellowImage.png";
import GrayStar from "../../../assets/img/starGrayImage.png";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { StyledStars } from "../../../components/Styled/stars";
import collapseUpIcon from "../../../assets/img/collapse-up-icon.svg";
import collapseDownIcon from "../../../assets/img/collapse-down-icon.svg";
import Link from "next/link";


interface IProps {
  _package: any;
}

const HotelCard = ({ _package }: IProps) => {

  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState<string>("");

  const handleDetails = (value: string) => {
    setIsExpanded((prev: any) => {
      return prev === value ? "" : value;
    });
  };

  return (
    <CardWrapper className="cardWrapper">
      <ImageContainer>
        <Image src={_package.image}
               objectFit="cover"
               layout="fill"
               className="package-image"
        />
      </ImageContainer>
      <HotelMain>
        <HotelMainContainer>
          <HotelDetailsWrapper>
            <HotelDetailsWrapper>
              <HotelDetails>
                <HotelTitle>
                  {_package.title}
                </HotelTitle>
                <AddressText>
                  {_package.address}
                </AddressText>
                <RatingContainer>
                  <StyledStars stars={_package.rating} size='small' />
                </RatingContainer>
                <HotelItems>
                  {
                    _package.packages &&
                    _package.packages.map((p: any, index: number) =>
                      (
                        <ItemContainer key={index}>
                          <Image src={p.icon} alt={p.type} />
                          <ItemText>
                            {p.type}
                          </ItemText>
                        </ItemContainer>
                      )
                    )
                  }
                </HotelItems>
                <DetailsContainer>
                  <ServicesTextContainer
                    onClick={() => handleDetails("services")}
                    isExpanded={isExpanded === "services"}
                  >
                    <ServicesDescriptionText>
                      {t("hotels.main.includedServices")}
                    </ServicesDescriptionText>
                    {isExpanded === "services" && <img src={collapseUpIcon.src} />}
                    {isExpanded !== "services" && <img src={collapseDownIcon.src} />}
                  </ServicesTextContainer>
                  <ServicesTextContainer
                    onClick={() => handleDetails("description")}
                    isExpanded={isExpanded === "description"}
                  >
                    <ServicesDescriptionText>
                      {t("hotels.main.hotelDescription")}
                    </ServicesDescriptionText>
                    {isExpanded === "description" && <img src={collapseUpIcon.src} />}
                    {isExpanded !== "description" && <img src={collapseDownIcon.src} />}
                  </ServicesTextContainer>
                </DetailsContainer>
              </HotelDetails>
            </HotelDetailsWrapper>
          </HotelDetailsWrapper>
          <PricingDetailsWrapper>
            <PriceTextContainer>
              <StartingPriceContainer>
                <p>{t("hotels.main.from")}</p>
                <StartingPriceText>
                  {_package.startingPrice} €
                </StartingPriceText>
              </StartingPriceContainer>
              <AdultNightText>
                {_package.packageOfferType}
              </AdultNightText>
              <TaxText>
                {t("hotels.main.taxes")}
              </TaxText>
            </PriceTextContainer>

            <BookNowContainer>
              <Link href="/hotels/detail">
                <BookNowButton href="/hotels/detail">
                  {t("hotels.main.bookNow")}
                </BookNowButton>
              </Link>
            </BookNowContainer>
          </PricingDetailsWrapper>
        </HotelMainContainer>

        <HotelDetailsContainer>
          {
            isExpanded === "description" &&
            <HotelDescriptionContainer>
              <HotelDescription>
                {_package.description}
              </HotelDescription>
            </HotelDescriptionContainer>
          }

          {
            isExpanded === "services" &&
            <HotelServicesContainer>

            </HotelServicesContainer>
          }

        </HotelDetailsContainer>
      </HotelMain>

    </CardWrapper>
  );
};

export default HotelCard;