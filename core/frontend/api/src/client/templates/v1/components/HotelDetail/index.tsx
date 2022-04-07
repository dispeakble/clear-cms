import { useTranslations } from "next-intl";
import React, { useState } from "react";
import "antd/dist/antd.css";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { AutoComplete, Rate, Tooltip } from "antd";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-scroll";
import {
    AdultBox,
    AdultIcon,
    AdultNumber,
    CalenderIcon,
    CardHead,
    ChildIcon,
    CounterBtn,
    DateDiv,
    DealCard,
    Destination,
    DropdownIcon,
    EditDeals,
    GuestType,
    HotelInfo,
    HotelLocation,
    HotelName,
    HotelSearch,
    HotelView,
    InfantIcon,
    InfoIcon,
    LeftSide,
    MemberBox,
    NewSearch,
    PersonBox,
    SearchIcon,
    ShortDescription,
    SliderSection,
    Star,
    ViewMap,
    ViewPrice,
    WhiteIcon,
    Wrapper
} from "./styled";
import moment from "moment";
import HotelPhotoSlider from "../HotelPhotoSlider";

const HotelDetail = ({
                         data,
                         hanldeAdultPlus,
                         hanldeAdultMinus,
                         handleHotelSearch,
                         hanldeInfantsPlus,
                         handleCahngeInput,
                         hanldeChildrenMinus,
                         hanldeChildrenPlus,
                         hanldeInfantsMinus,
                         handleSearch
                     }) => {
    const [show, setShow] = useState({
        checkin: false,
        checkout: false,
        details: false
    });

    const [mainValue, setMainValue] = React.useState([]);
    const [backUpData, setBackUpData] = useState([]);
    const arr = [
        {
            hotel: "Aroma",
            price: 200,
            location: "chandigarh"
        },
        {
            hotel: "Titan",
            price: 200,
            location: "chandigarh"
        },
        {
            hotel: "Noval",
            price: 200,
            location: "Mohali"
        },
        {
            hotel: "RajHotel",
            price: 200,
            location: "Mohali"
        }
    ];

    React.useEffect(() => {
        const getHotel = arr.map((value: any) => {
            return value.location;
        });
        const uniqueChars = [...getHotel];

        const mainFilter = uniqueChars.map((hotel: any) => {
            const lableFilter = arr.map((value) => {
                if (value.location == hotel) {
                    return (
                      {
                          value: `${value.hotel}`,
                          label: (
                            <div
                              key={
                                  value.location
                              }
                              style={{
                                  marginLeft: "12px",
                                  display: "flex",
                                  justifyContent: "space-between"
                              }}
                            >
                                {value.hotel}
                                <span>
                                 {value.price}
                                  </span>
                            </div>
                          )
                      }
                    );
                }
            });
            const filtered = lableFilter.filter(function(x) {
                return x !== undefined;
            });
            return (
              {
                  label: hotel,
                  options: [filtered][0]
              }
            );
        });
        setBackUpData(mainFilter);
        setMainValue(mainFilter);

    }, []);

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
    const handleShowPassanger = () => {
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
        const str: string = String(searchText).toLowerCase();
        const searchData = backUpData.map((valueMap) => {
            const SearchHotel = valueMap.options.filter((valuehotel: any) => {
                const fildata = String(valuehotel?.value).toLowerCase();
                if (fildata?.includes(str)) {
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
        console.log(filtered);
        setMainValue(filtered);
    };

    const onSelect = (data: string) => {
        handleHotelSearch(data);
    };

    return (
      <Wrapper>
          <DealCard>
              <CardHead>
                  Find Deals
              </CardHead>
              <EditDeals>
                  <Destination>
                      <h4>Destination or Hotel:</h4>
                      <AutoComplete
                        dropdownClassName="certain-category-search-dropdown"
                        dropdownStyle={{ backgroundColor: "white" }}
                        dropdownMatchSelectWidth={500}
                        onSearch={onSearch}
                        onSelect={onSelect}
                        options={mainValue}
                        style={{ width: "100%" }}
                      >
                          <HotelSearch>
                              <SearchIcon></SearchIcon>
                              <input value={data.hotel} type="search" placeholder={t("deals.hotel")} onChange={(e) => {
                                  onSearch(e.target.value);
                                  handleSearch(e.target.value);
                              }} />
                          </HotelSearch>
                      </AutoComplete>

                  </Destination>
                  <Destination>
                      <ClickAwayListener onClickAway={() => handleClickAway("checkin")}>
                          <DateDiv>
                              <h4>Check-in date:</h4>
                              <HotelSearch>
                                  <CalenderIcon></CalenderIcon>
                                  <input placeholder={t("deals.checkin")}
                                         value={moment(data.checkin).format("dddd, DD MMMM, YYYY")} />

                                  <DropdownIcon onClick={() => {
                                      handleShowCheckin();
                                  }} />
                              </HotelSearch>

                              {show.checkin ? (

                                <Calendar
                                  minDate={data.checkin}
                                  value={data.checkin}
                                  onChange={(value) => {
                                      handleCahngeInput("checkin", value);
                                      handleDateAway("checkin");
                                  }}
                                />

                              ) : null}
                          </DateDiv>
                      </ClickAwayListener>

                  </Destination>
                  <Destination>

                      <ClickAwayListener onClickAway={() => handleClickAway("checkout")}>
                          <DateDiv>
                              <h4>Check-out date:</h4>
                              <HotelSearch>
                                  <CalenderIcon></CalenderIcon>
                                  <input placeholder={t("deals.checkout")}
                                         value={moment(data.checkout).format("dddd, DD MMMM, YYYY")} />
                                  <DropdownIcon onClick={() => {
                                      handleShowCheckout();
                                  }} />

                              </HotelSearch>


                              {show.checkout ? (

                                <Calendar
                                  minDate={new Date(moment(data.checkin).add(1, "d"))}
                                  value={new Date(data.checkout)}
                                  onChange={(value) => {
                                      handleCahngeInput("checkout", value);
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
                              <h4>Details:</h4>
                              <GuestType>
                                  <AdultBox>
                                      <AdultIcon />
                                      <AdultNumber>
                                          {t(`deals.detail.adult`)}{data.passanger.adults}

                                      </AdultNumber>
                                  </AdultBox>
                                  <AdultBox>
                                      <ChildIcon />
                                      <AdultNumber>
                                          {t(`deals.detail.child`)}{data.passanger.children}

                                      </AdultNumber>
                                  </AdultBox>
                                  <AdultBox>
                                      <InfantIcon />
                                      <AdultNumber>
                                          {t(`deals.detail.infant`)}{data.passanger.infants}
                                      </AdultNumber>
                                  </AdultBox>
                                  <DropdownIcon onClick={() => handleShowPassanger()} />
                              </GuestType>
                              {show.details ? (
                                <MemberBox>
                                    <PersonBox>
                                        <PersonBox>Adults</PersonBox>
                                        <CounterBtn onClick={hanldeAdultMinus}>-</CounterBtn>
                                        <span>{data.passanger.adults}</span>
                                        <CounterBtn onClick={hanldeAdultPlus}>+</CounterBtn>


                                    </PersonBox>


                                    <PersonBox>
                                        <PersonBox>Children</PersonBox>
                                        <CounterBtn onClick={hanldeChildrenMinus}>-</CounterBtn>
                                        <span>{data.passanger.children}</span>
                                        <CounterBtn onClick={hanldeChildrenPlus}>+</CounterBtn>


                                    </PersonBox>
                                    <PersonBox>
                                        <PersonBox>Infants</PersonBox>
                                        <CounterBtn onClick={hanldeInfantsMinus}>-</CounterBtn>
                                        <span>{data.passanger.infants}</span>
                                        <CounterBtn onClick={hanldeInfantsPlus}>+</CounterBtn>


                                    </PersonBox>

                                </MemberBox>


                              ) : null}
                          </DateDiv>
                      </ClickAwayListener>

                  </Destination>
                  <NewSearch>
                      <button><WhiteIcon /><span>New Search</span></button>
                  </NewSearch>

              </EditDeals>
          </DealCard>
          <HotelView>
              <HotelInfo>
                  <LeftSide>
                      <HotelName>Hotel Victoria</HotelName>
                      <Star>
                          <Rate disabled defaultValue={4} />
                      </Star>
                      <ShortDescription>
                          <HotelLocation>
                              {t("deals.location")}
                          </HotelLocation>
                          <ViewMap><Link to="showmap" spy={true} smooth={true}>Show Map</Link></ViewMap>
                      </ShortDescription>
                  </LeftSide>
                  <ViewPrice>
                      <button><Tooltip title="information">
                          <InfoIcon />
                      </Tooltip><span>View Prices</span></button>
                  </ViewPrice>
              </HotelInfo>
              <SliderSection>
                  <HotelPhotoSlider />
              </SliderSection>
          </HotelView>
      </Wrapper>
    );
};
export default HotelDetail;