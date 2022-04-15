import * as React from "react";
import { ThemeProvider } from "styled-components";
import Header from "./components/Header";
import { getIcon } from "./helpers/icons";

import {
  ContentWrapper,
  GlobalStyle,
  MainWrapper, PaperWrapper,
  StyledMiddleText,
  StyledWebsiteName,
  StyledWebsiteSlogan, TopContentWrapper
} from "./styled";
import HomeSearch from "./components/HomeSearch";
import TopHotels from "./components/Promo/TopHotels";
import VerticalPhotoSlider from "./components/VerticalPhotoSlider";
import QuickAboutUs from "./components/QuickAboutUs";
import Recommended from "./components/Recommended";
import TabbedContent from "./components/TabbedContent";
import Footer from "./components/Footer";

const HomePage = ({ websiteName, websiteSlogan, colorScheme }: any) => {

  const getIcons = (iconName: string) => {
    return getIcon(iconName);
  }

  return (
    <ThemeProvider theme={{colors: colorScheme, icon: getIcons}}>
      <MainWrapper>
        <TopContentWrapper>
          <ContentWrapper>
            <GlobalStyle />
            <Header websiteName={websiteName} />
            <HomeSearch />
            <StyledMiddleText>
              <StyledWebsiteName>{websiteName}</StyledWebsiteName>
              <StyledWebsiteSlogan>{websiteSlogan}</StyledWebsiteSlogan>
            </StyledMiddleText>
          </ContentWrapper>
        </TopContentWrapper>
        <PaperWrapper>
          <ContentWrapper>
            <TopHotels />
            <VerticalPhotoSlider maxWidth="890px" maxHeight="370px" />
            <QuickAboutUs />
            <Recommended />
            <TabbedContent />
            <Footer />
          </ContentWrapper>
        </PaperWrapper>
      </MainWrapper>
    </ThemeProvider>

  );
};

export default HomePage;