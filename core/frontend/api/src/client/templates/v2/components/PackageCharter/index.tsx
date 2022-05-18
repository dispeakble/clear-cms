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
    CounterBtn,
    Price,
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
import {StyledStarsSmall} from "../Styled/stars";

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

const PackageCharter = ({
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
                    {t("packageDetails.findDeals")}
                </CardHead>
                <EditDeals>
                    <Destination>
                        <H4>{t("packageDetails.destinationOrHotel")}</H4>
                            <HotelSearch>
                                <SearchIcon/>
                                <input value={data.hotel} type="search"  placeholder={t("deals.hotel")} onChange={(e) => {
                                    onSearch(e.target.value);
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
                                    <CalenderIcon  />
                                    <input placeholder={t("deals.checkin") }
                                           onChange={() => {}}
                                           style={{cursor: 'pointer'}}
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
                                    <input placeholder={t("deals.checkout")} onChange={() => {}}
                                           value={moment(data.checkout).format("dddd, DD MMMM, YYYY")} readOnly
                                           style={{cursor: 'pointer'}}
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
                                <H4>Details:</H4>
                                <GuestType>
                                    <AdultBox onClick={() => handleShowPassenger()}>
                                        <AdultIcon  />
                                        <AdultNumber>
                                            {t(`deals.detail.adult`)}{data.passenger.adults}

                                        </AdultNumber>
                                    </AdultBox>
                                    <AdultBox onClick={() => handleShowPassenger()}>
                                        <ChildIcon  />
                                        <AdultNumber>
                                            {t(`deals.detail.child`)}{data.passenger.children}

                                        </AdultNumber>
                                    </AdultBox>
                                    <AdultBox onClick={() => handleShowPassenger()}>
                                        <InfantIcon  />
                                        <AdultNumber>
                                            {t(`deals.detail.infant`)}{data.passenger.infants}
                                        </AdultNumber>
                                    </AdultBox>
                                    <div style={{position:'relative', left: '7px'}}>
                                        <DropdownIcon onClick={() => handleShowPassenger()} />
                                    </div>
                                </GuestType>
                                {show.details ? (
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
                                                        <SPAN onClick={handleAdultMinus}>-</SPAN>
                                                        <h5>{data?.passenger.adults<10?`0${data?.passenger.adults}`:data?.passenger.adults}</h5>
                                                        <SPAN onClick={handleAdultPlus}>+</SPAN>
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
                                                        <SPAN onClick={handleChildrenMinus}>-</SPAN>
                                                        <h5>{data?.passenger.children<10 ? `0${data?.passenger.children}`:data?.passenger.children}</h5>
                                                        <SPAN onClick={handleChildrenPlus}>+</SPAN>
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
                                                        <SPAN onClick={handleInfantsMinus}>-</SPAN>
                                                        <h5>{data?.passenger.infants<10?`0${data?.passenger.infants}`:data?.passenger.infants}</h5>
                                                        <SPAN onClick={handleInfantsPlus}>+</SPAN>
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
                            <StyledStarsSmall stars={3}></StyledStarsSmall>
                        <ShortDescription>
                            <HotelLocation>
                                {t("deals.location")}
                            </HotelLocation>
                            <ViewMap><Link to="showmap" spy={true} smooth={true}>Show Map</Link></ViewMap>
                        </ShortDescription>
                    </LeftSide>
                    <ViewPrice>
                        <Price><span>from</span> 1409€</Price>
                        <AboutPrice>pers / stay</AboutPrice>

                    </ViewPrice>
                </HotelInfo>
                <SliderSection>
                    <HotelPhotoSlider />
                </SliderSection>
            </HotelView>
        </Wrapper>
    );
};
export default PackageCharter;