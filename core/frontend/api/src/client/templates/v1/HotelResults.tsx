import * as React from "react";
import { ThemeProvider } from "styled-components";

import Header from "./components/Header";
import { getIcon } from "./helpers/icons";
import { useTranslations } from "next-intl";

import {
  BreadcrumbsContainer,
  ContentWrapper,
  GlobalStyle,
  MainWrapper,
  TopContentWrapperForFlightResults,
  HotelResultsMainContent
} from "./styled";
import HomeSearch from "./components/HomeSearch";
import Footer from "./components/Footer";
import Breadcrumbs from "./components/Breadcrumbs";
import HotelResultsContent from "./components/HotelResultsContent";
import HotelResultsSideBar from "./components/HotelResultsSideBar";
import { useState } from "react";
import moment from "moment";
import PacakgeCharter from "./components/PackageCharter";


const HotelResults = ({ websiteName, websiteSlogan, colorScheme }: any) => {
  const t = useTranslations();


  const getIcons = (iconName: string) => {
    return getIcon(iconName);
  };

  const [data, setData] = useState({
    hotel: "",
    checkin: new Date(),
    checkout: moment(new Date()).add(1, "d"),
    passenger: {
      adults: 1,
      children: 0
    }

  });
  const handleChangeInput = (name: string, value: any) => {
    setData({
      ...data,
      [name]: value
    });
  };
  const handleAdultPlus = () => {
    setData({
      ...data,
      passenger: {
        ...data.passenger,
        adults: data.passenger.adults + 1
      }
    });

  };
  const handleAdultMinus = () => {
    if (Number(data.passenger.adults) > 0) {
      setData({
        ...data,
        passenger: {
          ...data.passenger,
          adults: data.passenger.adults - 1
        }
      });
    }


  };

  const handleChildrenPlus = () => {
    setData({
      ...data,
      passenger: {
        ...data.passenger,
        children: data.passenger.children + 1
      }
    });

  };
  const handleChildrenMinus = () => {
    if (Number(data.passenger.children) > 0) {
      setData({
        ...data,
        passenger: {
          ...data.passenger,
          children: data.passenger.children - 1
        }
      });
    }


  };
  const handleHotelSearch = (hotelValue: any) => {
    setData({
      ...data,
      hotel: hotelValue
    });

  };
  const handleSearch = (value: any) => {
    setData({
      ...data,
      hotel: value
    });
  };

  const myTheme: any = { colors: colorScheme, icon: getIcons };

  return (
    <ThemeProvider theme={myTheme}>
      <GlobalStyle />
      <Header websiteName={websiteName} />
      <MainWrapper>
        <TopContentWrapperForFlightResults>
          <ContentWrapper>
            <HomeSearch selectedTab="hotels" />
          </ContentWrapper>
        </TopContentWrapperForFlightResults>
      </MainWrapper>
      <BreadcrumbsContainer marg="0px 0px 0px 0px">
        <Breadcrumbs countryName={t("packageDetails.countryName")} islandName={t("packageDetails.islandName")}
                     townName={t("packageDetails.islandName")} hotelName={t("packageDetails.townName")} />
      </BreadcrumbsContainer>

      <HotelResultsMainContent>
        <HotelResultsSideBar
          data={data}
          handleChildrenMinus={handleChildrenMinus}
          handleChildrenPlus={handleChildrenPlus}
          handleChangeInput={handleChangeInput}
          handleAdultPlus={handleAdultPlus}
          handleAdultMinus={handleAdultMinus}
          handleSearch={handleSearch}
          handleHotelSearch={handleHotelSearch}
        />
        <HotelResultsContent />
      </HotelResultsMainContent>

      <Footer />
    </ThemeProvider>
  );
};

export default HotelResults;