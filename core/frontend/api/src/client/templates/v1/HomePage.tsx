import * as React from "react";
import Header from "./components/Header";

import {MainWrapper, GlobalStyle, StyledWebsiteName, StyledMiddleText, StyledWebsiteSlogan} from "./styled";
import HomeSearch from './components/HomeSearch'
import TopHotels from "./components/Promo/TopHotels";
import VerticalPhotoSlider from "./components/VerticalPhotoSlider";
import QuickAboutUs from "./components/QuickAboutUs";
import Recommended from "./components/Recommended";
import TabbedContent from "./components/TabbedContent";

export type HomePageProps = {
    websiteName: string;
    websiteUrl: string;
    websiteSlogan: string;
}

const HomePage = ({websiteName, websiteUrl, websiteSlogan}: HomePageProps) => {
    return <MainWrapper>
        <GlobalStyle />
        <Header websiteName={websiteName}/>
        <HomeSearch/>
        <StyledMiddleText>
            <StyledWebsiteName>{websiteName}</StyledWebsiteName>
            <StyledWebsiteSlogan>{websiteSlogan}</StyledWebsiteSlogan>
        </StyledMiddleText>
        <TopHotels/>
        <VerticalPhotoSlider maxWidth="890px" maxHeight="370px"/>
        <QuickAboutUs />
        <Recommended />
        <TabbedContent/>
    </MainWrapper>;
};

export default HomePage;