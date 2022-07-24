import * as React from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { StyledCardsWrapper, StyledTabBtn, StyledTabs, StyledWrapper } from "./styled";

import Hotel1 from "../../assets/img/hotels/small/hotel1.jpg";
import Hotel2 from "../../assets/img/hotels/small/hotel2.jpg";
import Hotel3 from "../../assets/img/hotels/small/hotel3.jpg";
import { TopHotelsCard } from "./TopHotelsCard";

const TopHotels = () => {
  const t = useTranslations();

  const [selectedTab, setSelectedTab] = useState(0);

  const fakePrices = [{
    value: "123 €",
    destination: "Gran Canaria"
  }, {
    value: "234 €",
    destination: "Tenerife"
  }, {
    value: "345 €",
    destination: "La Gomera"
  }];
  return <StyledWrapper>
    <StyledTabs>
      <StyledTabBtn data-testid="test-topHotel-button-first" onClick={() => setSelectedTab(0)}
                    className={selectedTab === 0 ? "selected" : ""}>{t("home.promo.special-offers")}</StyledTabBtn>
      <StyledTabBtn data-testid="test-topHotel-button-second" onClick={() => setSelectedTab(1)}
                    className={selectedTab === 1 ? "selected" : ""}>{t("home.promo.last-minute")}</StyledTabBtn>
      <StyledTabBtn data-testid="test-topHotel-button-third" onClick={() => setSelectedTab(2)}
                    className={selectedTab === 2 ? "selected" : ""}>{t("home.promo.flights")}</StyledTabBtn>
    </StyledTabs>
    <StyledCardsWrapper>
      <TopHotelsCard dataTestid="test-topHotel-card-first" src={Hotel1.src} tag={t("home.relax")} details={t("home.detail")} action={t("home.bookNow")} prices={fakePrices} />
      <TopHotelsCard dataTestid="test-topHotel-card-second" src={Hotel2.src} tag={t("home.relax")} details={t("home.detail")} action={t("home.bookNow")} prices={fakePrices} />
      <TopHotelsCard dataTestid="test-topHotel-card-third" src={Hotel3.src} tag={t("home.relax")} details={t("home.detail")} action={t("home.bookNow")} prices={fakePrices} />
    </StyledCardsWrapper>

  </StyledWrapper>;
};

export default TopHotels;