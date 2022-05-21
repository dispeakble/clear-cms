import * as React from "react";
import { useState } from "react";
import { ThemeProvider } from "styled-components";
import Header from "./components/Header";
import {useTranslations} from "next-intl";
import {
    ContentWrapper,
    GlobalStyle,
    MainWrapper,
    BottomContentWrapper,
    ServiceAndMapWrapper,
    ContentWrapperForPackageDetail,
    PackageDetailMainContent,
    BreadcrumbsContainer,
    MainContentWrapper,
    DetailWrapper
} from "./styled";
import Breadcrumbs from "./components/Breadcrumbs";
import PackageDetailCard from "./components/PackageDetailCard"
import moment from "moment";
import { getIcon } from "./helpers/icons";
import {Cardtitle, CheckedIcon, Feature, Highlights, MapSection, UncheckedIcon} from "./components/HotelAbout/styled";
import GoogleMapReact from "google-map-react";
import Footer from "./components/Footer";
import PacakgeCharter from './components/PackageCharter'
import HotelCardGrid from "./components/HotelCardGrid";


const PackageDetail = ({ websiteName, colorScheme }: any) => {
    // const t = useTranslations();

    const getIcons = (iconName: string) => {
        return getIcon(iconName);
    };
    const t = useTranslations();

    const [mapData] = useState({
        center: {
            lat: 30.738270,
            lng: 76.765144
        },
        zoom: 13
    });

    const [data, setData] = useState({
        hotel: "",
        checkin: new Date(),
        checkout: moment(new Date()).add(1, "d"),
        passenger: {
            adults: 1,
            infants: 0,
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
    const handleInfantsPlus = () => {
        setData({
            ...data,
            passenger: {
                ...data.passenger,
                infants: data.passenger.infants + 1
            }
        });

    };
    const handleInfantsMinus = () => {
        if (Number(data.passenger.infants) > 0) {
            setData({
                ...data,
                passenger: {
                    ...data.passenger,
                    infants: data.passenger.infants - 1
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
    const Features = [
        "Flight included",
        "1 checkin bagage",
        "1 hand bagage",
        "Airport taxes",
        "Transfer from airport to hotel",
        "Transfer from hotel to airport",
        "Tourist assistance",
        "7 nights stay"
    ];


    return (
        <>
            <ThemeProvider theme={myTheme}>
            <GlobalStyle />

            <MainWrapper>
                <Header websiteName={websiteName} />
                <MainContentWrapper>
                <BreadcrumbsContainer>
                    <Breadcrumbs countryName={t("packageDetails.countryName")} islandName={t("packageDetails.islandName")} townName={t("packageDetails.townName")} hotelName={t("packageDetails.hotelName",{hotelName: "Hotel Victoria"})}/>
                </BreadcrumbsContainer>
                <PackageDetailMainContent>
                    <ContentWrapperForPackageDetail>
                        <PacakgeCharter
                            data={data}
                            handleChildrenMinus={handleChildrenMinus}
                            handleChildrenPlus={handleChildrenPlus}
                            handleInfantsMinus={handleInfantsMinus}
                            handleInfantsPlus={handleInfantsPlus}
                            handleChangeInput={handleChangeInput}
                            handleAdultPlus={handleAdultPlus}
                            handleAdultMinus={handleAdultMinus}
                            handleSearch={handleSearch}
                            handleHotelSearch={handleHotelSearch}
                        />
                    </ContentWrapperForPackageDetail>

                <BottomContentWrapper>
                    <ServiceAndMapWrapper>
                        <ContentWrapper>
                            <Highlights>
                                <Cardtitle>
                                    Included Services
                                </Cardtitle>
                                <Feature>
                                    {
                                        Features.map((value, index) => {
                                            return (
                                                <li key={index}><CheckedIcon/><span>{value}</span></li>
                                            );
                                        })
                                    }
                                </Feature>
                                <Cardtitle>
                                    Not Included Services
                                </Cardtitle>
                            <Feature>
                                <li><UncheckedIcon/><span>Travel insurance</span></li>
                            </Feature>
                            </Highlights>
                        <MapSection id="showmap">
                            <GoogleMapReact
                                bootstrapURLKeys={{
                                    key: "AIzaSyBX1z5nvjcjzyxSMT-QCVS3ERu6Y3iNSb0",
                                    libraries: ["places", "geometry"]
                                }}
                                defaultCenter={mapData.center}
                                defaultZoom={mapData.zoom}
                                yesIWantToUseGoogleMapApiInternals

                            />
                        </MapSection>
                    </ContentWrapper>
                    </ServiceAndMapWrapper>
                    <DetailWrapper>
                        <PackageDetailCard />
                        <HotelCardGrid  title={t("packageDetails.BookingCardTitle1")} />
                        <HotelCardGrid  title={"Other Destinations"} />
                    </DetailWrapper>
                </BottomContentWrapper>
                </PackageDetailMainContent>
                </MainContentWrapper>
                <Footer />
            </MainWrapper>
            </ThemeProvider>
        </>
);

};

export default PackageDetail;