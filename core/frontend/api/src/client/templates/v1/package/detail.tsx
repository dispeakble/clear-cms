import * as React from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  BottomContentWrapper,
  ContentWrapper,
  DetailWrapper,
  PaperWrapper,
  ServiceAndMapWrapper
} from "../styled";
import PackageDetailCard from "../components/PackageDetailCard";
import moment from "moment";
import {
  Cardtitle,
  CheckedIcon,
  Feature,
  Highlights,
  MapSection,
  UncheckedIcon
} from "../hotel/components/HotelAbout/styled";
import GoogleMapReact from "google-map-react";
import PackageCharter from "../components/PackageCharter";
import HotelCardGrid from "../hotel/components/HotelCardGrid";
import Layout from "../components/Layout";

const PackageDetail = ({ websiteName, websiteSlogan, colorScheme }: any) => {
  const t = useTranslations();

  const [mapData] = useState({
    center: {
      lat: 28.251449164136275,
      lng: -16.623471598750548
    },
    zoom: 10
  });

  const [data, setData] = useState({
    hotel: "",
    checkin: new Date(),
    checkout: moment(new Date()).add(1, "d").toDate(),
    passenger: {
      adults: 1,
      children: 0,
      childAges: []
    }

  });

  const handleChangeInput = (name: string, value: any) => {
    setData({
      ...data,
      [name]: value
    });
  };
  const handleAdultPlus = () => {
    if(data.passenger.adults >= 9) return;
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
    if(data.passenger.children >= 4) return;
    const childAges = [...data.passenger.childAges];
    childAges[data.passenger.children] = 0;
    setData({
      ...data,
      passenger: {
        ...data.passenger,
        children: data.passenger.children + 1,
        childAges: childAges
      }
    });

  };
  const handleChildrenMinus = () => {
    if (Number(data.passenger.children) > 0) {
      const childAges = [...data.passenger.childAges];
      delete childAges[data.passenger.children - 1];
      setData({
        ...data,
        passenger: {
          ...data.passenger,
          children: data.passenger.children - 1,
          childAges: childAges
        }
      });
    }
  };

  const handleChildAgePlus = (i: number) => {
    const childAges = [...data.passenger.childAges];
    if(childAges[i] >= 9) return;
    childAges[i] = Number(childAges[i]) + 1;
    setData({
      ...data,
      passenger: {
        ...data.passenger,
        childAges: childAges
      }
    });

  };
  const handleChildAgeMinus = (i: number) => {
    const childAges = [...data.passenger.childAges];
    childAges[i] = Number(childAges[i]) - 1;
    if (Number(childAges[i]) > 0) {
      setData({
        ...data,
        passenger: {
          ...data.passenger,
          childAges: childAges
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

  const Features = [
    t("packageDetails.services.flightIncluded"),
    t("packageDetails.services.checkinBaggage"),
    t("packageDetails.services.handBaggage"),
    t("packageDetails.services.airportTaxes"),
    t("packageDetails.services.airportToHotel"),
    t("packageDetails.services.hotelToAirport"),
    t("packageDetails.services.touristAssistance"),
    `7 ${t("packageDetails.services.flightIncluded")}`
  ];

  const breadcrumbs = {
    //TODO translate this
    "packages/list": "Packages"
  };

  return (
    <>
      <Layout
        isHomePage={false}
        breadcrumbs={breadcrumbs}
        websiteSlogan={websiteSlogan}
        websiteName={websiteName}
        colorScheme={colorScheme}
      >
        <ContentWrapper>
          <PackageCharter
            data={data}
            handleChildrenMinus={handleChildrenMinus}
            handleChildrenPlus={handleChildrenPlus}
            handleChildAgeMinus={handleChildAgeMinus}
            handleChildAgePlus={handleChildAgePlus}
            handleChangeInput={handleChangeInput}
            handleAdultPlus={handleAdultPlus}
            handleAdultMinus={handleAdultMinus}
            handleSearch={handleSearch}
          />
        </ContentWrapper>
        <PaperWrapper style={{ marginTop: "20px" }}>
          <ContentWrapper>
            <BottomContentWrapper>
              <ServiceAndMapWrapper>
                <Highlights>
                  <Cardtitle>
                    {t("packageDetails.incService")}
                  </Cardtitle>
                  <Feature>
                    {
                      Features.map((value, index) => {
                        return <li key={index}><CheckedIcon /><span>{value}</span></li>
                      })
                    }
                  </Feature>
                  <Cardtitle>
                    {t("packageDetails.notIncService")}
                  </Cardtitle>
                  <Feature>
                    <li><UncheckedIcon /><span>{t("packageDetails.travelIns")}</span></li>
                  </Feature>
                </Highlights>
                <MapSection id="showmap">
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: "AIzaSyCpo_BJKJ9KZOTDlAXaI7o8mH1Q70Kq8v4",
                      libraries: ["places", "geometry"]
                    }}
                    defaultCenter={mapData.center}
                    defaultZoom={mapData.zoom}
                    yesIWantToUseGoogleMapApiInternals
                  />
                </MapSection>
              </ServiceAndMapWrapper>
              <DetailWrapper>
                <PackageDetailCard />
                <HotelCardGrid title={t("packageDetails.BookingCardTitle1")} />
                <HotelCardGrid title={t("packageDetails.detailCard.otherDestinations")} />
              </DetailWrapper>
            </BottomContentWrapper>
          </ContentWrapper>
        </PaperWrapper>
      </Layout>
    </>
  );

};

export default PackageDetail;