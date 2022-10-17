import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ContentWrapper,
  PaperWrapper
} from "../styled";
import { BookNowContainer, HotelsLayout, LoadMoreButton, HotelsContainer } from "./styled";

import HotelImage from "../assets/img/hotelImage.png";
import PackageTransfers from "../assets/img/packageTransfers-icon.svg";
import PackageActivities from "../assets/img/packageActivities-icon.svg";
import Layout from "../components/Layout";
import Filters from "./components/Filters";
import { FiltersContainer } from "../package/styled";
import HotelCard from "./components/PackageCard";

const HotelList = ({ websiteName, websiteSlogan, colorScheme }: any) => {

  const t = useTranslations();

  const [selectedFilters, setSelectedFilters] = useState([]);

  const [page, setPage] = useState(5);

  const loadMorePages = () => {
    setPage((prev: number) => prev + 5);
  };

  const filters = [
    {
      title: t("filters.destination"),
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
      title: t("filters.categories"),
      items: [
        {
          value: "All",
          slug: "all"
        },
        {
          value: "Camping",
          slug: "camping",
          items: [
            {
              value: "Nature Camping",
              slug: "nature-camping"
            },
            {
              value: "Hilltop Camping",
              slug: "hilltop-camping"
            },
            {
              value: "Budget Camping",
              slug: "budget-camping"
            },
            {
              value: "Riverside Camping",
              slug: "riverside-camping"
            },
            {
              value: "Jungle Camping",
              slug: "jungle-camping"
            }
          ]
        },
        {
          value: "Local Experiences",
          slug: "local-experiences",
          items: [
            {
              value: "Photography Tours",
              slug: "photography-tours"
            },
            {
              value: "Walking Tours",
              slug: "walking-tours"
            },
            {
              value: "Spa Experiences",
              slug: "spa-experiences"
            }
          ]
        }
      ]
    }
  ];

  const data = [
    {
      title: t("filters.packages.title", { hotelName: "Hotel Victoria" }),
      image: HotelImage,
      address: t("filters.packages.address"),
      rating: 4,
      packages: [
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

  const breadcrumbs = {
    //TODO translate this
    "hotels/list": "Hotels"
  };

  return (
    <Layout selectedTab="hotels" websiteName={websiteName} colorScheme={colorScheme} breadcrumbs={breadcrumbs}
            showSearch websiteSlogan={websiteSlogan}>
      <PaperWrapper>
        <ContentWrapper>
          <HotelsLayout>
            <FiltersContainer>
              <Filters
                setSelectedFilters={setSelectedFilters}
                selectedFilters={selectedFilters}
                filters={filters}
              />
            </FiltersContainer>
            <HotelsContainer>
              {
                [...Array(page)]
                  .map((value: undefined, index: number) => (
                    <HotelCard key={index} _package={data[0]} />
                  ))
              }
              <BookNowContainer style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "30px 0"
              }}>
                <LoadMoreButton data-testid="test-loadMore-button" onClick={() => loadMorePages()}>
                  {t("hotels.main.loadMore")}
                </LoadMoreButton>
              </BookNowContainer>
            </HotelsContainer>
          </HotelsLayout>
        </ContentWrapper>
      </PaperWrapper>
    </Layout>
  );
};

export default HotelList;