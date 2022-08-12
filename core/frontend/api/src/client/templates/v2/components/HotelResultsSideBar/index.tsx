import { Wrapper, SearchOptions } from "./styled";


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
  ChildIcon,
  DateDiv,
  DealCard,
  Destination,
  DropdownIcon,
  EditDeals,
  GuestType,
  HotelSearch,
  InfantIcon,
  NewSearch,
  SearchIcon,
  WhiteIcon,
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
  HotelCalendar, H4, SPAN
} from "../PackageCharter/styled";
import moment from "moment";
import Carousal from "../Carousel";


type HotelDetailProps = {
  data: any;
  handleAdultPlus: () => void;
  handleAdultMinus: () => void;
  handleHotelSearch: (data: string) => void;
  handleChangeInput: (data: string, value: any) => void;
  handleChildrenMinus: () => void;
  handleChildrenPlus: () => void;
  handleSearch: (data: string) => void;
}

const HotelResultSideBar = ({
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
  const carouselsData = [
    {
      title: t("hotelResult.sideBar.carousels.title1"),
      imgSrc: "../../assets/img/hotelresults/card1.jpg",
      hotelName: "Hotel Victoria",
      averageStars: 4,
      price: 1409,
      noOfNights: 7
    },
    {
      title: t("hotelResult.sideBar.carousels.title2"),
      imgSrc: "../../assets/img/hotelresults/card1.jpg",
      hotelName: "Hotel Victoria",
      averageStars: 4,
      price: 1409,
      noOfNights: 7
    }
  ];

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

  return (
    <Wrapper>
      <DealCard>
        <EditDeals>
          <Destination>
            <H4>{t("packageDetails.destinationOrHotel")}</H4>
            <HotelSearch>
              <SearchIcon />
              <input value={data.hotel} type="search" placeholder={t("deals.hotel")} onChange={(e) => {
                handleSearch(e.target.value);
              }} />
            </HotelSearch>
          </Destination>
          <Destination>
            <ClickAwayListener onClickAway={() => handleClickAway("checkin")}>
              <DateDiv>
                <H4>{t("packageDetails.checkInDate")}</H4>
                <HotelSearch onClick={() => {
                  handleShowCheckin();
                }}>
                  <CalenderIcon />
                  <input placeholder={t("deals.checkin")}
                         onChange={() => {
                         }}
                         style={{ cursor: "pointer" }}
                         value={moment(data.checkin).format("dddd, DD MMMM, YYYY")} readOnly />

                  <DropdownIcon />
                </HotelSearch>

                {show.checkin ? (

                  <HotelCalendar
                    minDate={data.checkin}
                    value={data.checkin}

                    onChange={(value: any) => {
                      handleChangeInput("checkin", value);
                      handleDateAway("checkin");
                    }}
                  />

                ) : null}
              </DateDiv>
            </ClickAwayListener>

          </Destination>
          <Destination>

            <ClickAwayListener onClickAway={() => handleClickAway("checkout")}>
              <DateDiv onClick={() => {
                handleShowCheckout();
              }}>
                <H4>{t("packageDetails.checkOutDate")}</H4>
                <HotelSearch>
                  <CalenderIcon />
                  <input placeholder={t("deals.checkout")} onChange={() => {
                  }}
                         value={moment(data.checkout).format("dddd, DD MMMM, YYYY")} readOnly
                         style={{ cursor: "pointer" }}
                  />
                  <DropdownIcon />

                </HotelSearch>


                {show.checkout ? (

                  <HotelCalendar
                    minDate={new Date(String(moment(data.checkin).add(1, "d")))}
                    value={new Date(data.checkout)}
                    onChange={(value: any) => {
                      handleChangeInput("checkout", value);
                      handleDateAway("checkout");
                    }}
                  />

                ) : null}
              </DateDiv>
            </ClickAwayListener>


          </Destination>
          <Destination>
            <ClickAwayListener onClickAway={() => handleClickAway("details")}>
              <DateDiv>
                <H4>{t("hotelResult.sideBar.search.detail")}</H4>
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
                      <CloseIcon onClick={() =>
                        setShow({
                          ...show,
                          details: false
                        })} />
                      {t("hotelResult.sideBar.search.detail")}
                    </DetailTop>
                    <PersonEntry>
                      <CardDesc>{t("hotelResult.sideBar.search.addPersons")}</CardDesc>
                      <Person>
                        <BoxLeft>
                          <h3>{t("global.adults")}</h3>
                          <p>{t("hotelResult.sideBar.search.adultsAge")}</p>
                        </BoxLeft>
                        <BoxRight>
                          <Quantity>
                            <SPAN onClick={handleAdultMinus}>-</SPAN>
                            <h5>{data?.passenger.adults < 10 ? `0${data?.passenger.adults}` : data?.passenger.adults}</h5>
                            <SPAN onClick={handleAdultPlus}>+</SPAN>
                          </Quantity>
                        </BoxRight>
                      </Person>
                      <Person>
                        <BoxLeft>
                          <h3>{t("global.children")}</h3>
                          <p>{t("hotelResult.sideBar.search.childrensAge")}</p>
                        </BoxLeft>
                        <BoxRight>
                          <Quantity>
                            <SPAN onClick={handleChildrenMinus}>-</SPAN>
                            <h5>{data?.passenger.children < 10 ? `0${data?.passenger.children}` : data?.passenger.children}</h5>
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

          </Destination>
          <NewSearch>
            <button><WhiteIcon /><Link to="prices" spy={true}
                                       smooth={true}><span>{t("hotelResult.sideBar.search.newSearch")}</span></Link>
            </button>
          </NewSearch>
        </EditDeals>
      </DealCard>

      {carouselsData.map(carouselData => <Carousal title={carouselData.title}
                                                   imgSrc={carouselData.imgSrc} hotelName={carouselData.hotelName}
                                                   averageStars={carouselData.averageStars}
                                                   price={carouselData.price}
                                                   noOfNights={carouselData.noOfNights} />)}
    </Wrapper>
  );
};


export default HotelResultSideBar;