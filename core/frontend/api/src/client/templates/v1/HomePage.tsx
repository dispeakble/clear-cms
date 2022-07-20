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
import Layout from "./components/Layout";
const HomePage = ({ websiteName, websiteSlogan, colorScheme }: any) => {
  /*

  ////////////////////////////// example of sending invoice from client

  const sendEmail = async () => {

    const response = await ws.sendMessage({
      api: "email",
      act: "send",
      payload: {
        type: "invoice",
        destination: {
          address: "dosidoweb@protonmail.com",
          name: "Do Si Do Web"

        }
      }
    });
    console.log(response);
  };

  useEffect(() => {
    sendEmail()
  }, [sendEmail]);*/

  return (
      <Layout isHomePage websiteSlogan={websiteSlogan} websiteName={websiteName} colorScheme={colorScheme} >
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
      </Layout>
  );
};

export default HomePage;