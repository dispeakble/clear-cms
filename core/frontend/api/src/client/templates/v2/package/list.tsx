import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ContentWrapper, PaperWrapper } from "../styled";
import { ButtonContainer, FiltersContainer, LoadMoreButton, PackagesContainer, PackagesLayout } from "./styled";
import Filters from "./components/Filters";
import PackageCard from "./components/PackageCard";

import HotelImage from "../assets/img/hotels/small/hotel3.jpg";
import PackageFlight from "../assets/img/packageFlight-icon.svg";
import PackageHotel from "../assets/img/packageHotel-icon.svg";
import BusIcon from "../assets/img/bus-icon.svg";
import Layout from "../components/Layout";


const PackagesPage = ({ websiteName, websiteSlogan, colorScheme }: any) => {

  const t = useTranslations();

  const [page, setPage] = useState(5);

  const loadMorePages = () => {
    setPage((prev: number) => prev + 5);
  };

  const packageMock =
    {
      title: "Package for Hotel Victoria",
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
          icon: BusIcon
        }
      ],
      startingPrice: 1409,
      packageOfferType: `${t("global.adults")} / 7 ${t("global.nights")}`,
      description: t("filters.description"),
      services: [
        `7 ${t("filters.services.nightStay")}`,
        t("filters.services.flightIncluded"),
        t("filters.services.checkinBaggage"),
        t("filters.services.handBaggage"),
        t("filters.services.airportTaxes"),
        t("filters.services.airportToHotel"),
        t("filters.services.hotelToAirport"),
        t("filters.services.touristAssistance")
      ]
    };

  const [selectedFilters, setSelectedFilters] = useState([]);

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

  const breadcrumbs = {
    //TODO translate this
    "packages/list": "Packages"
  };

  return (
    <Layout
      isHomePage={false}
      selectedTab="packages"
      showSearch={true}
      breadcrumbs={breadcrumbs}
      websiteSlogan={websiteSlogan}
      websiteName={websiteName}
      colorScheme={colorScheme}>
      <PaperWrapper>
        <ContentWrapper>
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
                  .map(() => (
                    <PackageCard details={packageMock} />
                  ))
              }

              <ButtonContainer style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "30px 0"
              }}>
                <LoadMoreButton onClick={() => loadMorePages()}>
                  {t("packages.main.loadMore")}
                </LoadMoreButton>
              </ButtonContainer>
            </PackagesContainer>
          </PackagesLayout>
        </ContentWrapper>
      </PaperWrapper>
    </Layout>
  );
};

export default PackagesPage;
