import {
  TopContent, BottomContent, Wrapper,
  HotelImageContainer, SectionOne, SectionTwo, HotelImage, HotelInfo
} from "./styled";

import card1 from "../../../assets/img/hotelresults/card1.jpg";
import { StyledStarsSmall } from "../../Styled/stars";
import React from "react";
import { useTranslations } from "next-intl";

interface IHoteContent {
  imgSrc: string,
  hotelName: string,
  hotelLocation: string,
  averageStars: number,
  price: number,
  noOfNights: number,
  description: string
}

const HotelContent = ({
                        imgSrc,
                        hotelName,
                        hotelLocation,
                        averageStars,
                        price,
                        noOfNights,
                        description
                      }: IHoteContent) => {
  const t = useTranslations();
  return (
    <Wrapper>
      <TopContent>
        <SectionOne>
          <HotelImageContainer>
            <HotelImage url={card1.src} />
          </HotelImageContainer>
          <HotelInfo>
            <h1>{hotelName}</h1>
            <p>{hotelLocation}</p>
            <StyledStarsSmall stars={averageStars}></StyledStarsSmall>
          </HotelInfo>
        </SectionOne>
        <SectionTwo>
          <div>
            <div>{t("hotelResult.from")} <span>{price}€</span></div>
            <div>{t("hotelResult.adult")} / {noOfNights} {t("hotelResult.nights")}</div>
          </div>
          <button>{t("hotelResult.bookNow")}</button>
        </SectionTwo>
      </TopContent>
      <BottomContent>
        {description}
      </BottomContent>

    </Wrapper>
  );
};

export default HotelContent;
