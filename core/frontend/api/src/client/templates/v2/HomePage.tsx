import * as React from "react";

import {
  ContentWrapper,
  PaperWrapper,
} from "./styled";
import TopHotels from "./components/Promo/TopHotels";
import VerticalPhotoSlider from "./components/VerticalPhotoSlider";
import QuickAboutUs from "./components/QuickAboutUs";
import Recommended from "./components/Recommended";
import TabbedContent from "./components/TabbedContent";
import Layout from "./components/Layout";
const HomePage = ({ websiteName, websiteSlogan, colorScheme }: any) => {

  return (
      <Layout isHomePage websiteSlogan={websiteSlogan} websiteName={websiteName} colorScheme={colorScheme} >
        <PaperWrapper>
          <ContentWrapper>
            <TopHotels />
            <VerticalPhotoSlider maxWidth="890px" maxHeight="370px" />
            <QuickAboutUs />
            <Recommended />
            <TabbedContent />
          </ContentWrapper>
        </PaperWrapper>
      </Layout>
  );
};

export default HomePage;