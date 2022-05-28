import { Wrapper } from "./styled";

import hotel1 from "../../assets/img/hotels/small/hotel8.jpg";
import { useTranslations } from "next-intl";
import Card from "./Card";
import { StyledTabBtn, StyledTabs } from "../Promo/styled";
import * as React from "react";
import { useState } from "react";


const Recommended = () => {
  const t = useTranslations();
  const cardProps = {
    title: t("home.recommended.hotel1"),
    meal: t("home.recommended.description"),
    details: t("home.recommended.noOfNights"),
    price: "199$",
    img: hotel1.src
  };

  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <>
      <StyledTabs>
        <StyledTabBtn onClick={() => setSelectedTab(0)}
                      className={selectedTab === 0 ? "selected" : ""}>{t("home.recommended.tabs.popular")}</StyledTabBtn>
        <StyledTabBtn onClick={() => setSelectedTab(1)}
                      className={selectedTab === 1 ? "selected" : ""}>{t("home.recommended.tabs.adventure")}</StyledTabBtn>
        <StyledTabBtn onClick={() => setSelectedTab(2)}
                      className={selectedTab === 2 ? "selected" : ""}>{t("home.recommended.tabs.relax")}</StyledTabBtn>
      </StyledTabs>
      <Wrapper>
        <Card {...cardProps} />
        <Card {...cardProps} />
        <Card {...cardProps} />
      </Wrapper>
    </>
  );
};

export default Recommended;