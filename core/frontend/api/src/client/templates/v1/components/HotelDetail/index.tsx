import { useTranslations } from "next-intl";
import React, { useState } from "react";
import "antd/dist/antd.css";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { AutoComplete, Rate, Tooltip } from "antd";
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
    Wrapper,
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
    HotelCalendar, H4, SPAN,
} from "./styled";
import moment from "moment";
import HotelPhotoSlider from "../HotelPhotoSlider";

type HotelDetailProps = {
    data: any;
    handleAdultPlus: () => void;
    handleAdultMinus: () => void;
    handleHotelSearch: (data: string) => void;
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

    const [mainValue, setMainValue] = React.useState<any[]>([]);
    const [backUpData, setBackUpData] = useState<any[]>([]);
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
        setMainValue(filtered);
    };

    const onSelect = (data: string) => {
        handleHotelSearch(data);
    };


    return (
      <Wrapper>
          <DealCard>
              <CardHead>
                  Find
              </CardHead>
              <EditDeals>
                  <Destination>
                      <H4>Destination or Hotel:</H4>
                      <AutoComplete
                        dropdownClassName="certain-category-search-dropdown"
                        dropdownStyle={{ backgroundColor: "white" }}
                        dropdownMatchSelectWidth={250}
                        onSearch={onSearch}
                        onSelect={onSelect}
                        options={mainValue}
                        style={{ width: "100%" }}
                      >
                          <HotelSearch>
                              <SearchIcon/>
                              <input value={data.hotel} type="search" data-testid="hotelInput" placeholder={t("deals.hotel")} onChange={(e) => {
                                  onSearch(e.target.value);
                                  handleSearch(e.target.value);
                              }} />
                          </HotelSearch>
                      </AutoComplete>

                  </Destination>
                  <Destination>
                      <ClickAwayListener onClickAway={() => handleClickAway("checkin")}>
                          <DateDiv>
                              <H4>Check-in date:</H4>
                              <HotelSearch onClick={() => {
                                  handleShowCheckin();
                              }}>
                                  <CalenderIcon  />
                                  <input placeholder={t("deals.checkin") }
                                         onChange={() => {}}
                                         data-testid="checkInDateInput"
                                         style={{cursor: 'pointer'}}
                                         value={moment(data.checkin).format("dddd, DD MMMM, YYYY")} readOnly />

                                  <DropdownIcon />
                              </HotelSearch>

                              {show.checkin ? (
                                <div data-testid="checkInDateCont">
                                    <HotelCalendar

                                        minDate={data.checkin}
                                        value={data.checkin}

                                        onChange={(value: any) => {
                                            handleChangeInput("checkin", value);
                                            handleDateAway("checkin");
                                        }}
                                    />
                                </div>

                              ) : null}
                          </DateDiv>
                      </ClickAwayListener>

                  </Destination>
                  <Destination>

                      <ClickAwayListener onClickAway={() => handleClickAway("checkout")}>
                          <DateDiv onClick={() => {
                              handleShowCheckout();
                          }}>
                              <H4>Check-out date:</H4>

                              <HotelSearch>
                                  <CalenderIcon />
                                  <input placeholder={t("deals.checkout")} data-testid="checkOutDateInput"  onChange={() => {}}
                                         value={moment(data.checkout).format("dddd, DD MMMM, YYYY")} readOnly
                                  style={{cursor: 'pointer'}}
                                  />
                                  <DropdownIcon />

                              </HotelSearch>



                              {show.checkout ? (
                                  <div data-testid="checkOutDateCont">

                                <HotelCalendar
                                  minDate={new Date(String(moment(data.checkin).add(1, "d")))}
                                  value={new Date(data.checkout)}

                                  onChange={(value: any) => {
                                      handleChangeInput("checkout", value);
                                      handleDateAway("checkout");
                                  }}
                                /></div>
                              ) : null}
                          </DateDiv>
                      </ClickAwayListener>



                  </Destination>
                  <Destination>
                      <ClickAwayListener onClickAway={() => handleClickAway("details")}>
                          <DateDiv>
                              <H4>Details:</H4>
                              <GuestType>
                                  <AdultBox onClick={() => handleShowPassenger()} data-testid="detailsInput">
                                      <AdultIcon  />
                                      <AdultNumber>
                                          {t(`deals.detail.adult`)}<span data-testid="adultNumberChosen">{data.passenger.adults}</span>

                                      </AdultNumber>
                                  </AdultBox>
                                  <AdultBox onClick={() => handleShowPassenger()}>
                                      <ChildIcon  />
                                      <AdultNumber>
                                          {t(`deals.detail.child`)}<span data-testid="childNumberChosen">{data.passenger.children}</span>

                                      </AdultNumber>
                                  </AdultBox>
                                  <AdultBox onClick={() => handleShowPassenger()}>
                                      <InfantIcon  />
                                      <AdultNumber>
                                          {t(`deals.detail.infant`)}<span data-testid="infantNumberChosen">{data.passenger.infants}</span>
                                      </AdultNumber>
                                  </AdultBox>
                                  <div style={{position:'relative', left: '7px'}}>
                                      <DropdownIcon onClick={() => handleShowPassenger()} />
                                  </div>
                              </GuestType>
                              {show.details ? (
                                  <div data-testid="detailsContainer">
                                  <DetailsCard>
                                      <DetailTop>
                                          <CloseIcon onClick={()=>
                                              setShow({
                                              ...show,
                                              details: false
                                          })}/>
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
                                                  <SPAN onClick={handleAdultMinus} data-testid="decAdultNumber">-</SPAN>
                                                  <h5 data-testid='adultNumberFromDropdown'>{data?.passenger.adults<10?`0${data?.passenger.adults}`:data?.passenger.adults}</h5>
                                                  <SPAN onClick={handleAdultPlus} data-testid="incAdultNumber">+</SPAN>
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
                                                  <SPAN onClick={handleChildrenMinus} data-testid="decChildNumber">-</SPAN>
                                                  <h5 data-testid="childNumberFromDropdown">{data?.passenger.children<10 ? `0${data?.passenger.children}`:data?.passenger.children}</h5>
                                                  <SPAN onClick={handleChildrenPlus} data-testid="incChildNumber">+</SPAN>
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
                                                  <SPAN onClick={handleInfantsMinus} data-testid="decInfantNumber">-</SPAN>
                                                  <h5 data-testid="infantNumberFromDropdown">{data?.passenger.infants<10?`0${data?.passenger.infants}`:data?.passenger.infants}</h5>
                                                  <SPAN onClick={handleInfantsPlus} data-testid="incInfantNumber">+</SPAN>
                                              </Quantity>
                                          </BoxRight>
                                      </Person>
                                      <SubDetail>
                                          <button onClick={()=>
                                              setShow({
                                                  ...show,
                                                  details: false
                                              })}>Done</button>
                                      </SubDetail>
                                      </PersonEntry>
                                  </DetailsCard>
                                  </div>

                              ) : null}
                          </DateDiv>
                      </ClickAwayListener>

                  </Destination>
                  <NewSearch>
                      <button><WhiteIcon /><Link to="prices" spy={true} smooth={true}><span>New Search</span></Link></button>
                  </NewSearch>

              </EditDeals>
          </DealCard>
          <HotelView>
              <HotelInfo>
                  <LeftSide>
                      <HotelName>Hotel Victoria</HotelName>
                      <Star>
                          <Rate
                              style={{fontSize: '30px'}}
                              disabled defaultValue={4} />
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
                          <Link to="prices" spy={true} smooth={true}><span>View Prices</span></Link>
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