import * as React from "react";
import {useTranslations} from "next-intl";
import Header from "./components/Header";

import {MainWrapper, GlobalStyle, StyledWebsiteName, StyledMiddleText, StyledWebsiteSlogan} from "./styled";
import HomeSearch from './components/HomeSearch'
import TopHotels from "./components/Promo/TopHotels";
import VerticalPhotoSlider from "./components/VerticalPhotoSlider";

export type HomePageProps = {
    websiteName: string;
    websiteUrl: string;
    websiteSlogan: string;
}

const HomePage = ({websiteName, websiteUrl, websiteSlogan}: HomePageProps) => {
    const t = useTranslations();
    return <MainWrapper>
        <GlobalStyle />
        <Header websiteName={websiteName}/>
        <HomeSearch/>
        <StyledMiddleText>
            <StyledWebsiteName>{websiteName}</StyledWebsiteName>
            <StyledWebsiteSlogan>{websiteSlogan}</StyledWebsiteSlogan>
        </StyledMiddleText>
        <TopHotels/>
        <VerticalPhotoSlider/>
        {websiteUrl}
    </MainWrapper>;
};

export default HomePage;