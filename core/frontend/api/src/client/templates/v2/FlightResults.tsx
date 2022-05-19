import * as React from "react";
import { ThemeProvider } from "styled-components";

import Header from "./components/Header";
import { getIcon } from "./helpers/icons";
import {useTranslations} from "next-intl";

import {
    BreadcrumbsContainer,
    ContentWrapper,
    GlobalStyle,
    MainWrapper,
    TopContentWrapperForFlightResults,
    BottomContentWrapperForFlightResults,
    FlightResultsMainWrapper
} from "./styled";
import HomeSearch from "./components/HomeSearch";
import Footer from "./components/Footer";
import Breadcrumbs from "./components/Breadcrumbs";
import ResultsMainContent from "./components/ResultsMainContent";
import FilteringFlightResult from "./components/FilteringFlightResult"

const FlightResults = ({ websiteName, websiteSlogan, colorScheme }: any) => {
    const t = useTranslations()

    const getIcons = (iconName: string) => {
        return getIcon(iconName);
    };

    const myTheme: any = { colors: colorScheme, icon: getIcons };

    return (
        <ThemeProvider theme={myTheme}>
            <GlobalStyle />
            <Header websiteName={websiteName} />
            <FlightResultsMainWrapper>
                <BreadcrumbsContainer>
                    <Breadcrumbs countryName={t("packageDetails.countryName")} islandName={t("packageDetails.islandName")} townName={t("packageDetails.islandName")} hotelName={t("packageDetails.townName")}/>
                </BreadcrumbsContainer>
                <MainWrapper>
                    <TopContentWrapperForFlightResults>
                        <ContentWrapper>
                            <HomeSearch />
                        </ContentWrapper>
                    </TopContentWrapperForFlightResults>
                    <BottomContentWrapperForFlightResults>
                        <FilteringFlightResult />
                        <ResultsMainContent />
                    </BottomContentWrapperForFlightResults>
                </MainWrapper>
            </FlightResultsMainWrapper>
            <Footer />
        </ThemeProvider>
    );
};

export default FlightResults;