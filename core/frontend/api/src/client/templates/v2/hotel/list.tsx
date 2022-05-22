import React, {useState} from "react";
import {useTranslations} from "next-intl";
import {getIcon} from "../helpers/icons";
import {GlobalStyle, MainWrapper, TopContentWrapper, Wrapper} from "../styled";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ThemeProvider } from "styled-components";
import Breadcrumbs from "../components/Breadcrumbs";
import HomeSearch from "../components/HomeSearch";
import {ButtonContainer, FiltersContainer, LoadMoreButton, PackagesContainer, PackagesLayout} from "./styled";
import Filters from "./components/Filters";
import PackageCard from "./components/PackageCard";

import HotelImage from "../assets/img/hotelImage.png"
import PackageFlight from "../assets/img/packageFlight-icon.svg"
import PackageHotel from "../assets/img/packageHotel-icon.svg"
import PackageTransfers from "../assets/img/packageTransfers-icon.svg"
import PackageActivities from "../assets/img/packageActivities-icon.svg"



const HotelList = ({ websiteName, colorScheme }: any) => {

    const t = useTranslations()

    const getIcons = (iconName: string) => {
        return getIcon(iconName);
    };

    const [page, setPage] = useState(5)

    const loadMorePages = () => {
        setPage((prev: number) => prev+5)
    }

    const packages = [
        {
            title : "Package Charter for Hotel Victoria",
            image : HotelImage,
            address: "Bischofshofen, 4, 38660 Adeje, Spain",
            rating: 4,
            packages: [
                {
                    type: "Flights",
                    icon: PackageFlight,
                },
                {
                    type: "Hotel",
                    icon: PackageHotel,
                },
                {
                    type: "Transfers",
                    icon: PackageTransfers,
                },
                {
                    type: "5 Activities",
                    icon: PackageActivities,
                }
            ],
            startingPrice: 1409,
            packageOfferType: "Adult / 7 nights",
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu dolor efficitur, ullamcorper lectus id, consectetur purus. Cras consequat dapibus aliquam. Aenean hendrerit convallis ultrices. Praesent scelerisque orci vel arcu tincidunt, eu facilisis massa pellentesque. Ut facilisis sem ipsum, vitae porta enim dignissim consequat. Etiam nec placerat nibh. Aliquam posuere auctor lacus vitae sollicitudin. Quisque facilisis accumsan sapien ac efficitur. Etiam eget urna vulputate, faucibus ipsum et, imperdiet ipsum. Nam eu nunc a erat tincidunt feugiat sit amet id lacus. Nunc id risus vitae neque dictum eleifend eu quis felis.\n',
            services: [
                "Flight included",
                "1 checkin baggage",
                "1 hand baggage",
                "Airport taxes",
                "Transfer from airport to hotel",
                "Transfer from hotel to airport",
                "Tourist assistance",
                "7 nights stay"
            ]
        }
    ]

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

    //console.log("filters index", filters)

    const myTheme: any = { colors: colorScheme, icon: getIcons };

    return(
        <ThemeProvider theme={myTheme}>
            <GlobalStyle />
            <MainWrapper data-testid="hotel-page-wrapper">
                <TopContentWrapper>
                    <Header websiteName={websiteName} />
                </TopContentWrapper>
                <Wrapper>
                    <Breadcrumbs />
                </Wrapper>
                <TopContentWrapper>
                    <Wrapper
                        style={{display: "flex", alignItems: "center", justifyContent: "center"}}
                    >
                        <HomeSearch />
                    </Wrapper>
                </TopContentWrapper>
                <Wrapper>
                    <PackagesLayout>
                        <FiltersContainer>
                            <Filters
                                setSelectedFilters={setSelectedFilters}
                                selectedFilters={selectedFilters}
                                filters={filters}
                            />
                        </FiltersContainer>
                        <PackagesContainer>
                            {
                                [...Array(page)]
                                    .map((value: undefined, index:number) => (
                                        <PackageCard _package={packages[0]} />
                                    ))
                            }

                            <ButtonContainer style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center", margin: "30px 0"}}>
                                <LoadMoreButton onClick={() => loadMorePages()}>
                                    {t('packages.main.loadMore')}
                                </LoadMoreButton>
                            </ButtonContainer>
                        </PackagesContainer>
                    </PackagesLayout>
                </Wrapper>
                <Footer />
            </MainWrapper>
        </ThemeProvider>
    )
}

export default HotelList