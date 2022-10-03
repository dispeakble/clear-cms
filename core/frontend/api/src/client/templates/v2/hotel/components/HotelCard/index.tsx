import {
  Body, CardImage, CustomButton, SubTitle, TitleText
} from "./styled";
import React from "react";

import cardBg from "../../../assets/img/hotels/original/hotel1.jpg";
import { StyledStars } from "../../../components/Styled/stars";
import { useTranslations } from "next-intl";

const HotelCard = () => {
  const t = useTranslations();
  return (
    <Body>
      <TitleText>Sol Puerto de la Cruz</TitleText>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SubTitle>Tenerife</SubTitle>
        <StyledStars stars={4} size='small'></StyledStars>
      </div>

      <CardImage src={cardBg.src} alt={"Card Image"} />

      <CustomButton>
        {t("packageDetails.detailCard.seePrices")}
      </CustomButton>
    </Body>
  );
};

export default HotelCard;
