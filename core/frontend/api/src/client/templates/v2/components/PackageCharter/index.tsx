import { useTranslations } from "next-intl";
import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-scroll";
import {
  AboutPrice,
  Price,
  HotelInfo,
  HotelLocation,
  HotelName,
  HotelView,
  ShortDescription,
  SliderSection,
  ViewMap,
  ViewPrice,
  PackageWrapper,
  span, HotelWrapper
} from "./styled";
import HotelPhotoSlider from "../../hotel/components/HotelPhotoSlider";
import { StyledStars } from "../Styled/stars";
import PackageSearch from "../../package/components/Search";

type HotelDetailProps = {
  data: any;
  handleAdultPlus: () => void;
  handleAdultMinus: () => void;
  handleChangeInput: (data: string, value: any) => void;
  handleChildrenMinus: () => void;
  handleChildrenPlus: () => void;
  handleChildAgeMinus: (i: number) => void;
  handleChildAgePlus: (i: number) => void;
  handleSearch: (data: string) => void;
}

const PackageCharter = ({
                          data
                        }: HotelDetailProps) => {

  const t = useTranslations();

  const onSearch = (searchText: string) => {
    /*const str: string = String(searchText).toLowerCase();
    const searchData = backUpData.map((valueMap) => {
      const SearchHotel = valueMap.options.filter((valuehotel: any) => {
        const fieldData = String(valuehotel?.value).toLowerCase();
        if (fieldData?.includes(str)) {
          return true;
        }
      });
      if (SearchHotel) {
        if (SearchHotel?.length > 0) {
          return (
            {
              label: `${valueMap.label}`,
              options: [SearchHotel][0]
            }
          );
        }
      }

    });
    const filtered = searchData.filter(function(x) {
      return x !== undefined;
    });
    setMainValue(filtered);*/
  };

  return (
    <PackageWrapper style={{ alignItems: "stretch" }}>
      <PackageSearch data={data} />
      <HotelView>
        <HotelWrapper>
          <HotelInfo>
            <HotelName>Hotel Victoria</HotelName>
            <StyledStars stars={3} size="small"></StyledStars>
            <ShortDescription>
              <HotelLocation>
                {t("deals.location")}
              </HotelLocation>
              <ViewMap><Link
                to="showmap"
                spy={true}
                smooth={true}>{t("packageDetails.packageCharter.showMap")}</Link>
              </ViewMap>
            </ShortDescription>
          </HotelInfo>
          <ViewPrice>
            <Price><span>{t("packageDetails.packageCharter.from")}</span> 1409€</Price>
            <AboutPrice>{t("packageDetails.packageCharter.perStay")}</AboutPrice>
          </ViewPrice>
        </HotelWrapper>
        <SliderSection>
          <HotelPhotoSlider />
        </SliderSection>
      </HotelView>
    </PackageWrapper>
  );
};
export default PackageCharter;