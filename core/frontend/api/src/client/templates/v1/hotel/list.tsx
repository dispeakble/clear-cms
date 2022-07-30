import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { getIcon } from "../helpers/icons";
import {
  ContentWrapper,
  GlobalStyle,
  MainWrapper, PaperWrapper,
  TopContentWrapper, Wrapper
} from "../styled";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ThemeProvider } from "styled-components";
import Breadcrumbs from "../components/Breadcrumbs";
import HomeSearch from "../components/HomeSearch";
import { ButtonContainer,  LoadMoreButton, PackagesContainer, PackagesLayout } from "./styled";
import PackageCard from "./components/PackageCard";

import HotelImage from "../assets/img/hotelImage.png";
import PackageFlight from "../assets/img/packageFlight-icon.svg";
import PackageHotel from "../assets/img/packageHotel-icon.svg";
import PackageTransfers from "../assets/img/packageTransfers-icon.svg";
import PackageActivities from "../assets/img/packageActivities-icon.svg";
import Layout from "../components/Layout";


const HotelList = ({ websiteName, colorScheme }: any) => {

  const t = useTranslations();

  const getIcons = (iconName: string) => {
    return getIcon(iconName);
  };

  const [page, setPage] = useState(5);

  const loadMorePages = () => {
    setPage((prev: number) => prev + 5);
  };

  const packages = [
    {
      title: t("filters.packages.title", { hotelName: "Hotel Victoria" }),
      image: HotelImage,
      address: t("filters.packages.address"),
      rating: 4,
      packages: [
        {
          type: t("filters.packages.type.flights"),
          icon: PackageFlight
        },
        {
          type: t("filters.packages.type.hotel"),
          icon: PackageHotel
        },
        {
          type: t("filters.packages.type.transfers"),
          icon: PackageTransfers
        },
        {
          type: `5 ${t("filters.packages.type.activities")}`,
          icon: PackageActivities
        }
      ],
      startingPrice: 1409,
      packageOfferType: `${t("global.adults")} / 7 ${t("global.nights")}`,
      description: t("filters.description"),
      services: [
        t("filters.services.flightIncluded"),
        t("filters.services.checkinBaggage"),
        t("filters.services.handBaggage"),
        t("filters.services.airportTaxes"),
        t("filters.services.airportToHotel"),
        t("filters.services.hotelToAirport"),
        t("filters.services.touristAssistance"),
        `7 ${t("filters.services.flightIncluded")}`
      ]
    }
  ];

  const myTheme: any = { colors: colorScheme, icon: getIcons };

  const breadcrumbs = {
    login: "Log in"
  }

  return (
    <ThemeProvider theme={myTheme}>
      <GlobalStyle />
      <Layout websiteName={websiteName} colorScheme={colorScheme} breadcrumb={breadcrumbs} showSearch>
        <MainWrapper data-testid="hotel-page-wrapper">
          <ContentWrapper>
            <PaperWrapper>
              <ContentWrapper>
                <PackagesLayout>
                  <PackagesContainer>
                    {
                      [...Array(page)]
                        .map((value: undefined, index: number) => (
                          <PackageCard key={index} _package={packages[0]} />
                        ))
                    }
                    <ButtonContainer style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "30px 0"
                    }}>
                      <LoadMoreButton data-testid="test-loadMore-button" onClick={() => loadMorePages()}>
                        {t("packages.main.loadMore")}
                      </LoadMoreButton>
                    </ButtonContainer>
                  </PackagesContainer>
                </PackagesLayout>
              </ContentWrapper>
            </PaperWrapper>
          </ContentWrapper>
        </MainWrapper>
      </Layout>
    </ThemeProvider>
  );
};

export default HotelList;