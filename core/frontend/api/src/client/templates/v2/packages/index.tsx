import React, {useState} from "react";
import {useTranslations} from "next-intl";
import {getIcon} from "../helpers/icons";
import {GlobalStyle, MainWrapper, TopContentWrapper, Wrapper} from "../styled";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ThemeProvider } from "styled-components";
import Breadcrumbs from "../components/Breadcrumbs";
import HomeSearch from "../components/HomeSearch";
import {FiltersContainer, PackagesContainer, PackagesLayout} from "./styled";
import Filters from "./components/Filters";

const PackagesPage = ({ websiteName, websiteSlogan, colorScheme }: any) => {

    const t = useTranslations()

    const getIcons = (iconName: string) => {
        return getIcon(iconName);
    };

    const [selectedFilters, setSelectedFilters] = useState([])

    const filters = [
        {
            title: "destinations",
            items: [
                {
                    value: "Rome",
                    slug: "rome"
                },
                {
                    value: "Paris",
                    slug: "paris"
                },
                {
                    value: "Prague",
                    slug: "prague"
                },
                {
                    value: "London",
                    slug: "london"
                },
                {
                    value: "Amsterdam",
                    slug: "amsterdam"
                },
                {
                    value: "Barcelona",
                    slug: "barcelona"
                },
                {
                    value: "Saint Petersburg",
                    slug: "saint-petersburg"
                }
            ]
        },
        {
            title: "categories",
            items: [
                {
                    value: "All",
                    slug: "all",
                },
                {
                    value: "Camping",
                    slug: "camping",
                    items: [
                        {
                            value: "Nature Camping",
                            slug: "nature-camping",
                        },
                        {
                            value: "Hilltop Camping",
                            slug: "hilltop-camping",
                        },
                        {
                            value: "Budget Camping",
                            slug: "budget-camping",
                        },
                        {
                            value: "Riverside Camping",
                            slug: "riverside-camping",
                        },
                        {
                            value: "Jungle Camping",
                            slug: "jungle-camping",
                        },
                    ]
                },
                {
                    value: "Local Experiences",
                    slug: "local-experiences",
                    items: [
                        {
                            value: "Photography Tours",
                            slug: "photography-tours",
                        },
                        {
                            value: "Walking Tours",
                            slug: "walking-tours",
                        },
                        {
                            value: "Spa Experiences",
                            slug: "spa-experiences",
                        },
                    ]
                }
            ]
        }
    ]

    const myTheme: any = { colors: colorScheme, icon: getIcons };

    return(
        <ThemeProvider theme={myTheme}>
            <GlobalStyle />
            <MainWrapper data-testid="hotel-page-wrapper">
                <TopContentWrapper>
                    <Header websiteName={websiteName} />
                </TopContentWrapper>
                <Breadcrumbs />
                <TopContentWrapper>
                    <HomeSearch />
                </TopContentWrapper>
                <Wrapper>
                    <PackagesLayout>
                        <FiltersContainer>
                            <Filters
                                setSelectedFilters={setSelectedFilters}
                                selectedFilters={selectedFilters}
                                filers={filters}
                            />
                        </FiltersContainer>
                        <PackagesContainer>

                        </PackagesContainer>
                    </PackagesLayout>
                </Wrapper>
                <Footer />
            </MainWrapper>
        </ThemeProvider>
    )
}

export default PackagesPage