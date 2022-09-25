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
  DetailsCard,
  CardDesc,
  Person,
  BoxLeft,
  BoxRight,
  DetailTop,
  Quantity,
  PersonEntry,
  SubDetail,
  CloseIcon,
  HotelCalendar, H4, SPAN, ResponsiveFieldGroup
} from "./styled";
import moment from "moment";
import HotelPhotoSlider from "../../hotel/components/HotelPhotoSlider";
import { StyledStarsSmall } from "../Styled/stars";

type HotelDetailProps = {
  data: any;
  handleAdultPlus: () => void;
  handleAdultMinus: () => void;
  handleChangeInput: (data: string, value: any) => void;
  handleChildrenMinus: () => void;
  handleChildrenPlus: () => void;
  handleSearch: (data: string) => void;
}

const PackageCharter = ({
                          data,
                          handleAdultPlus,
                          handleAdultMinus,
                          handleChangeInput,
                          handleChildrenMinus,
                          handleChildrenPlus,
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
      <DealCard>
        <CardHead>
          {t("packageDetails.findDeals")}
        </CardHead>
        <EditDeals>
          <FieldGroup>
            <H4>{t("packageDetails.destinationOrHotel")}</H4>
            <FormElement>
              <SearchIcon />
              <input data-lpignore="true" value={data.hotel} type="search" placeholder={t("deals.hotel")} onChange={(e) => {
                onSearch(e.target.value);
                handleSearch(e.target.value);
              }} />
            </FormElement>
          </FieldGroup>
          <ResponsiveFieldGroup>
            <FieldGroup>
              <ClickAwayListener onClickAway={() => handleClickAway("checkin")}>
                <DateDiv>
                  <H4>{t("packageDetails.checkInDate")}</H4>
                  <FormElement onClick={() => {
                    handleShowCheckin();
                  }}>
                    <CalenderIcon />
                    <input placeholder={t("deals.checkin")}
                           style={{ cursor: "pointer" }}
                           value={moment(data.checkin).format("dddd, DD MMMM, YYYY")} readOnly />

                    <DropdownIcon />
                  </FormElement>
                  {show.checkin ? (
                    <HotelCalendar
                      minDate={new Date()}
                      value={data.checkin}
                      onChange={(value: any) => {
                        handleChangeInput("checkin", value);
                        handleDateAway("checkin");
                      }}
                    />
                  ) : null}
                </DateDiv>
              </ClickAwayListener>
            </FieldGroup>
            <FieldGroup>
              <ClickAwayListener onClickAway={() => handleClickAway("checkout")}>
                <DateDiv onClick={() => {
                  handleShowCheckout();
                }}>
                  <H4>{t("packageDetails.checkOutDate")}</H4>
                  <FormElement>
                    <CalenderIcon />
                    <input placeholder={t("deals.checkout")}
                           value={moment(data.checkout).format("dddd, DD MMMM, YYYY")} readOnly
                           style={{ cursor: "pointer" }}
                    />
                    <DropdownIcon />
                  </FormElement>
                  {show.checkout ? (
                    <HotelCalendar
                      minDate={new Date(String(moment(data.checkin).add(1, "d")))}
                      value={data.checkout}
                      onChange={(value: any) => {
                        handleChangeInput("checkout", value);
                        handleDateAway("checkout");
                      }}
                    />
                  ) : null}
                </DateDiv>
              </ClickAwayListener>
            </FieldGroup>
          </ResponsiveFieldGroup>
          <FieldGroup>
            <ClickAwayListener onClickAway={() => handleClickAway("details")}>
              <DateDiv>
                <H4>{t("hotelResult.sideBar.search.passengers")}:</H4>
                <GuestType>
                  <AdultBox onClick={() => handleShowPassenger()}>
                    <AdultIcon />
                    <AdultNumber>
                      {t(`deals.detail.adult`)}{data.passenger.adults}

                    </AdultNumber>
                  </AdultBox>
                  <AdultBox onClick={() => handleShowPassenger()}>
                    <ChildIcon />
                    <AdultNumber>
                      {t(`deals.detail.child`)}{data.passenger.children}
                    </AdultNumber>
                  </AdultBox>
                  <div style={{ position: "relative", left: "7px" }}>
                    <DropdownIcon onClick={() => handleShowPassenger()} />
                  </div>
                </GuestType>
                {show.details ? (
                  <DetailsCard>
                    <DetailTop>
                      {t("hotelResult.sideBar.search.passengers")}
                      <CloseIcon onClick={() =>
                        setShow({
                          ...show,
                          details: false
                        })} />
                    </DetailTop>
                    <PersonEntry>
                      <CardDesc>{t("hotelResult.sideBar.search.addPersons")}</CardDesc>
                      <Person>
                        <BoxLeft>
                          <h3>{t("global.adults")}</h3>
                        </BoxLeft>
                        <BoxRight>
                          <Quantity>
                            <SPAN onClick={handleAdultMinus}>-</SPAN>
                            <h5>{data?.passenger.adults}</h5>
                            <SPAN onClick={handleAdultPlus}>+</SPAN>
                          </Quantity>
                        </BoxRight>
                      </Person>
                      <Person>
                        <BoxLeft>
                          <h3>{t("global.children")}</h3>
                        </BoxLeft>
                        <BoxRight>
                          <Quantity>
                            <SPAN onClick={handleChildrenMinus}>-</SPAN>
                            <h5>{data?.passenger.children}</h5>
                            <SPAN onClick={handleChildrenPlus}>+</SPAN>
                          </Quantity>
                        </BoxRight>
                      </Person>
                      <SubDetail>
                        <button onClick={() =>
                          setShow({
                            ...show,
                            details: false
                          })}>{t("hotelResult.sideBar.search.done")}</button>
                      </SubDetail>
                    </PersonEntry>
                  </DetailsCard>
                ) : null}
              </DateDiv>
            </ClickAwayListener>
          </FieldGroup>
          <SearchButton>
            <button>
              <SearchIconWhite />
              <Link to="prices" spy={true} smooth={true}>
                <span>{t("hotelResult.sideBar.search.newSearch")}</span>
              </Link>
            </button>
          </SearchButton>
        </EditDeals>
      </DealCard>
      <HotelView>
        <HotelInfo>
          <LeftSide>
            <HotelName>Hotel Victoria</HotelName>
            <StyledStarsSmall stars={3}></StyledStarsSmall>
            <ShortDescription>
              <HotelLocation>
                {t("deals.location")}
              </HotelLocation>
              <ViewMap><Link to="showmap" spy={true}
                             smooth={true}>{t("packageDetails.packageCharter.showMap")}</Link></ViewMap>
            </ShortDescription>
          </LeftSide>
          <ViewPrice>
            <Price><span>{t("packageDetails.packageCharter.from")}</span> 1409€</Price>
            <AboutPrice>{t("packageDetails.packageCharter.perStay")}</AboutPrice>

          </ViewPrice>
        </HotelInfo>
        <SliderSection>
          <HotelPhotoSlider />
        </SliderSection>
      </HotelView>
    </PackageWrapper>
  );
};
export default PackageCharter;