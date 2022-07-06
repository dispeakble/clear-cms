import {
  CardWrapper,
  ImageContainer,
  PackageDetails,
  PackageDetailsWrapper,
  PackageTitle,
  RatingContainer,
  PackageItems,
  ItemContainer,
  ItemText,
  PricingDetailsWrapper,
  StartingPriceContainer,
  StartingPriceText,
  AdultNightText,
  TaxText,
  ButtonContainer,
  BookNowButton,
  PriceTextContainer,
  DetailsContainer,
  ServicesTextContainer,
  ServicesDescriptionText,
  PackageMain,
  PackageMainContainer,
  PackageDetailsContainer,
  PackageDescriptionContainer, PackageDescription, PackageServicesContainer
} from "../../styled";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { StyledStarsSmall } from "../../../components/Styled/stars";
import collapseUpIcon from "../../../assets/img/collapse-up-icon.svg";
import collapseDownIcon from "../../../assets/img/collapse-down-icon.svg";
import checkCircleWhiteIcon from "../../../assets/img/check-circle-white-icon.svg";


interface PackageCardProps {
  details: any;
}

const PackageCard = ({ details }: PackageCardProps) => {

  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState<string>("");

  const handleDetails = (value: string) => {
    setIsExpanded((prev: any) => {
      return prev === value ? "" : value;
    });
  };

  return (
    <CardWrapper>
      <ImageContainer>
        <Image src={details.image}
               objectFit="cover"
               layout="fill"
               className="package-image"
               objectPosition="center top"
        />
      </ImageContainer>
      <PackageMain>
        <PackageMainContainer>
          <PackageDetailsWrapper>
            <PackageDetailsWrapper>
              <PackageDetails>
                <PackageTitle>
                  {details.title}
                </PackageTitle>
                <RatingContainer>
                  <StyledStarsSmall stars={details.rating} />
                </RatingContainer>
                <PackageItems>
                  {
                    details.packages &&
                    details.packages.map((p: any, index: number) =>
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
                </PackageItems>
                <DetailsContainer>
                  <ServicesTextContainer
                    onClick={() => handleDetails("services")}
                    isExpanded={isExpanded === "services"}
                  >
                    <ServicesDescriptionText>
                      {t("packages.main.includedServices")}
                    </ServicesDescriptionText>
                    { isExpanded === "services" && <img src={collapseUpIcon.src} /> }
                    { isExpanded !== "services" && <img src={collapseDownIcon.src} /> }
                  </ServicesTextContainer>
                  <ServicesTextContainer
                    onClick={() => handleDetails("description")}
                    isExpanded={isExpanded === "description"}
                  >
                    <ServicesDescriptionText>
                      {t("packages.main.hotelDescription")}
                    </ServicesDescriptionText>
                    { isExpanded === "description" && <img src={collapseUpIcon.src} /> }
                    { isExpanded !== "description" && <img src={collapseDownIcon.src} /> }
                  </ServicesTextContainer>
                </DetailsContainer>
              </PackageDetails>
            </PackageDetailsWrapper>
          </PackageDetailsWrapper>
          <PricingDetailsWrapper>
            <PriceTextContainer>
              <StartingPriceContainer>
                <span>From</span>
                <StartingPriceText>
                  {details.startingPrice} €
                </StartingPriceText>
              </StartingPriceContainer>
              <AdultNightText>
                {details.packageOfferType}
              </AdultNightText>
              <TaxText>
                {t("packages.main.taxes")}
              </TaxText>
            </PriceTextContainer>

            <ButtonContainer>
              <BookNowButton>
                {t("packages.main.bookNow")}
              </BookNowButton>
            </ButtonContainer>
          </PricingDetailsWrapper>
        </PackageMainContainer>

        <PackageDetailsContainer>
          {
            isExpanded === "description" &&
            <PackageDescriptionContainer>
              <PackageDescription>
                {details.description}
              </PackageDescription>
            </PackageDescriptionContainer>
          }

          {
            isExpanded === "services" &&
            <PackageServicesContainer>
              {[...details.services].map((service: any) => {

                return (
                  <div style={{height: "30px", display: "flex", alignItems: "center", gap: "10px"}}><Image width={25} height={26} src={checkCircleWhiteIcon}/> {service}</div>
                )

              })}
            </PackageServicesContainer>
          }

        </PackageDetailsContainer>
      </PackageMain>

    </CardWrapper>
  );
};

export default PackageCard;