import * as React from "react";
import { useTranslations } from "next-intl";
import Header from "./components/Header";

import {
  GlobalStyle,
  MainWrapper,
  StyledMiddleText,
  StyledTermsOfUse,
  StyledWebsiteName,
  StyledWebsiteSlogan
} from "./styled";
import HomeSearch from "./components/HomeSearch";
import TopHotels from "./components/Promo/TopHotels";
import VerticalPhotoSlider from "./components/VerticalPhotoSlider";
import QuickAboutUs from "./components/QuickAboutUs";
import Recommended from "./components/Recommended";
import TabbedContent from "./components/TabbedContent";
import Footer from "./components/Footer";

export type HomePageProps = {
  websiteName: string;
  websiteUrl: string;
  websiteSlogan: string;
}

const HomePage = ({ websiteName, websiteUrl, websiteSlogan }: HomePageProps) => {
  const t = useTranslations();
  return <MainWrapper>
    <GlobalStyle />
    <Header websiteName={websiteName} />
    <HomeSearch />
    <StyledMiddleText>
      <StyledWebsiteName>{websiteName}</StyledWebsiteName>
      <StyledWebsiteSlogan>{websiteSlogan}</StyledWebsiteSlogan>
    </StyledMiddleText>
    <TopHotels />
    <VerticalPhotoSlider maxWidth="890px" maxHeight="370px" />
    <QuickAboutUs />
    <Recommended />
    <TabbedContent />
    <StyledTermsOfUse>
      <p><b>{t('home.terms-and-conditions.title')}</b></p>
      <p>
        {t('home.terms-and-conditions.content')}
      </p>
    </StyledTermsOfUse>
    <Footer/>
  </MainWrapper>;
};

export default HomePage;