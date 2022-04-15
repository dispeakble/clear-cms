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
    Wrapper,DetailsCard,CardDesc,Person,BoxLeft,BoxRight,DetailTop,Quantity,PersonEntry,SubDetail,CloseIcon
} from "./styled";
import moment from "moment";
import HotelPhotoSlider from "../HotelPhotoSlider";

type HotelDetailProps = {
    data: any;
    handleAdultPlus: () => void;
    handleAdultMinus: () => void;
    handleHotelSearch: (hotelValue: string) => void;
    handleInfantsPlus: () => void;
    handleChangeInput: (data: string, value: any) => void;
    handleChildrenMinus: () => void;
    handleChildrenPlus: () => void;
    handleInfantsMinus: () => void;
    handleSearch: (data: string) => void;
}

const HotelDetail = ({
                         data,
                         handleAdultPlus,
                         handleAdultMinus,
                         handleHotelSearch,
                         handleInfantsPlus,
                         handleChangeInput,
                         handleChildrenMinus,
                         handleChildrenPlus,
                         handleInfantsMinus,
                         handleSearch,
                     }: HotelDetailProps) => {
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
    const customColors = ['#FFFFFF'];
    React.useEffect(() => {
        /*const getHotel = arr.map((value: any) => {
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
        setMainValue(mainFilter);*/

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
        /*const str: string = String(searchText).toLowerCase();
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
        setMainValue(filtered);*/
    };

    const onSelect = (data: string) => {
        //handleHotelSearch(data);
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
                                  <DetailsCard>
                                      <DetailTop>
                                          <CloseIcon/>
                                          Details
                                      </DetailTop>
                                      <PersonEntry>
                                      <CardDesc>Add Numbers of Persons</CardDesc>
                                      <Person>
                                          <BoxLeft>
                                              <h3>Adults</h3>
                                              <p>12Yrs & above on the day of travel</p>
                                          </BoxLeft>
                                          <BoxRight>
                                              <Quantity>
                                                  <span>-</span>
                                                  <h5>03</h5>
                                                  <span>+</span>
                                              </Quantity>
                                          </BoxRight>
                                      </Person>
                                      <Person>
                                          <BoxLeft>
                                              <h3>Children</h3>
                                              <p>2-12 yrs on the day of travel</p>
                                          </BoxLeft>
                                          <BoxRight>
                                              <Quantity>
                                                  <span>-</span>
                                                  <h5>02</h5>
                                                  <span>+</span>
                                              </Quantity>
                                          </BoxRight>
                                      </Person>
                                      <Person>
                                          <BoxLeft>
                                              <h3>Infants</h3>
                                              <p>Under 2 yrs on the day of travel</p>
                                          </BoxLeft>
                                          <BoxRight>
                                              <Quantity>
                                                  <span>-</span>
                                                  <h5>00</h5>
                                                  <span>+</span>
                                              </Quantity>
                                          </BoxRight>
                                      </Person>
                                      <SubDetail>
                                          <button>Done</button>
                                      </SubDetail>
                                      </PersonEntry>
                                  </DetailsCard>

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
                      <button>
                      {customColors.map(color => (
                          <Tooltip placement="bottom"
                                   title={t("tooltip.view_price")}
                                   color={color} key={color}
                                   overlayInnerStyle={{
                                       color:"#00000080",
                                       fontSize: "15px",
                                       lineHeight: "20px",
                                       width: "300px",
                                       cursor: "default",
                                       boxShadow: "0px 4px 13px rgba(0, 0, 0, 0.25)",
                                       borderRadius: "12px",
                                       padding: "13px 18px"
                                   }}
                                   overlayStyle={{}}
                          >
                              <InfoIcon />
                          </Tooltip>
                          ))}
                          <span>View Prices</span>
                      </button>

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