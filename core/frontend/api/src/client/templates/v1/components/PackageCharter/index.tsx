import { useTranslations } from "next-intl";
import React, { useState } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-scroll";
import {
  AdultBox,
  AdultIcon,
  AdultNumber,
  CalenderIcon,
  CardHead,
  ChildIcon,
  AboutPrice,
  Price,
  DateDiv,
  DealCard,
  FieldGroup,
  DropdownIcon,
  EditDeals,
  GuestType,
  HotelInfo,
  HotelLocation,
  HotelName,
  FormElement,
  HotelView,
  LeftSide,
  SearchButton,
  SearchIcon,
  ShortDescription,
  SliderSection,
  ViewMap,
  ViewPrice,
  SearchIconWhite,
  PackageWrapper,
  PopupFilters,
  CardDesc,
  Person,
  BoxLeft,
  BoxRight,
  PopupFilterTitle,
  Quantity,
  PersonEntry,
  SubDetail,
  CloseIcon,
  HotelCalendar, H4, span, ResponsiveFieldGroup, HotelWrapper
} from "./styled";
import moment from "moment";
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
                          data,
                          handleAdultPlus,
                          handleAdultMinus,
                          handleChangeInput,
                          handleChildrenMinus,
                          handleChildrenPlus,
                          handleChildAgeMinus,
                          handleChildAgePlus,
                          handleSearch

                        }: HotelDetailProps) => {
  const [show, setShow] = useState({
    checkin: false,
    checkout: false,
    details: false
  });

  const t = useTranslations();

  const handleClickAway = (name: string) => {
    setShow({
      ...show,
      [name]: false
    });
  };
  const handleShowCheckin = () => {
    setShow({
      ...show,
      checkin: !show.checkin
    });
  };

  const handleShowCheckout = () => {
    setShow({
      ...show,
      checkout: !show.checkout
    });
  };
  const handleShowPassenger = () => {
    setShow({
      ...show,
      details: !show.details
    });
  };

  const handleDateAway = (name: string) => {

    setShow({
      ...show,
      [name]: false
    });
  };
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
    <PackageWrapper style={{alignItems: "stretch"}}>
      <PackageSearch data={data}/>
      <HotelView>
        <HotelWrapper>
          <HotelInfo>
            <HotelName>Hotel Victoria</HotelName>
            <StyledStars stars={3} size='small'></StyledStars>
            <ShortDescription>
              <HotelLocation>
                {t("deals.location")}
              </HotelLocation>
              <ViewMap><Link to="showmap" spy={true}
                             smooth={true}>{t("packageDetails.packageCharter.showMap")}</Link></ViewMap>
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