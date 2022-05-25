import * as React from "react";
import { ThemeProvider } from "styled-components";

import Header from "./components/Header";
import { getIcon } from "./helpers/icons";

import {
  ContentWrapper,
  GlobalStyle,
  MainWrapper,
  PaperWrapper,
  StyledMiddleText,
  StyledWebsiteName,
  StyledWebsiteSlogan,
  TopContentWrapper
} from "./styled";
import HomeSearch from "./components/HomeSearch";
import TopHotels from "./components/Promo/TopHotels";
import VerticalPhotoSlider from "./components/VerticalPhotoSlider";
import QuickAboutUs from "./components/QuickAboutUs";
import Recommended from "./components/Recommended";
import TabbedContent from "./components/TabbedContent";
import Footer from "./components/Footer";
import useWsContext from "../../context/SocketContext";
import { useEffect } from "react";

const HomePage = ({ websiteName, websiteSlogan, colorScheme }: any) => {



  const getIcons = (iconName: string) => {
    return getIcon(iconName);
  };

  const { ws } = useWsContext();


  const sendEmail = async () => {
    const response = await ws.sendMessage({
      api: "email",
      act: "send",
      payload: {
        type: "invoice",
        destination: {
          address: "yayipaw356@runchet.com",
          name: "Ovidiu Alexa"
        }
      }
    });

    console.log(response);
  };

  useEffect(() => {
    sendEmail()
  }, [sendEmail]);

  const myTheme: any = { colors: colorScheme, icon: getIcons };

  return (
    <ThemeProvider theme={myTheme}>
      <GlobalStyle />
      <MainWrapper data-testid="home-main-wrapper">
        <TopContentWrapper>
          <ContentWrapper>
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