import { useTranslations } from "next-intl";
import {
    CalendarView,
    CalendarViewCheckout,
    CalenderWrapper,
    CheckBg,
    CheckInSvg,
    CheckOutSvg,
    CheckTitle,
    ChildIcon,
    ColumnBreak,
    ColumnFive,
    ColumnFour,
    ColumnOne,
    ColumnThree,
    ColumnTwo,
    CounterBtn,
    CounterDiv,
    DivView,
    DropdownIcon,
    GuestNumber,
    HotelCalendar,
    HotelCheck,
    InfantIcon,
    InnerRoomList,
    LeftIcon,
    LeftSide,
    Meal,
    Modifier,
    OrgInfoIcon,
    Passenger,
    PassengerDetailsWrapper,
    PassengerView,
    PassengerWrapper,
    Price,
    QueryTitle,
    RefreshIcon,
    RefreshPrice,
    RightSide,
    RoomTable,
    RoomType,
    SelectRoom,
    SpanDiv,
    StayingInfoWrapper,
    TableBody,
    TableHead,
    TopUp,
    Wrapper,
    StyledTooltipWrapper,
    Overlay,
    StyledCenterLabel, StyledChild,
    StyledLabel,
    StyledPerson,
    StyledPrimaryValue,
    StyledSearchOptionsGroup
} from "./styled";

import moment from "moment";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import adultsIcon from "../../../assets/img/adults-icon.svg";
import ReactTooltip from "react-tooltip";
import ValuePopup from "../HotelValuePopup";
import ValuePopupAges from "../../../components/HomeSearch/valuePopupAges";

type HotelAvailableProps = {
    data: any;
    handleAdultPlus: () => void;
    handleAdultMinus: () => void;
    handleInfantsPlus: () => void;
    handleChangeInput: (name: string, value: any) => void;
    handleChildrenMinus: () => void;
    handleChildrenPlus: () => void;
    handleInfantsMinus: () => void;
}

const HotelAvailable = ({
                            data,
                            handleAdultPlus,
                            handleAdultMinus,
                            handleInfantsPlus,
                            handleChangeInput,
                            handleChildrenMinus,
                            handleChildrenPlus,
                            handleInfantsMinus
                        }: HotelAvailableProps) => {
    const [show, setShow] = useState("");
    const [showRoom, setShowRoom] = useState("");
    const t = useTranslations();

    const [selectedRoom, setSelectedRoom] = useState<{ room: string, price: number }[]>([{
        room: `1 ${t("hotelDetail.hotelAvailable.room")}`,
        price: 10
    }, { room: `2 ${t("hotelDetail.hotelAvailable.rooms")}`, price: 10 }, { room: `3 ${t("hotelDetail.hotelAvailable.rooms")}`, price: 10 }, { room: `4 ${t("hotelDetail.hotelAvailable.rooms")}`, price: 10 }, { room: `5 ${t("hotelDetail.hotelAvailable.rooms")}`, price: 10 }]);
    const [forArray] = useState([
        {
            hotelPrice: 122,
            hotelRoom: 1,
            name: "one"
        },
        {
            hotelPrice: 220,
            hotelRoom: 1,
            name: "two"
        },
        {
            hotelPrice: 322,
            hotelRoom: 1,
            name: "three"
        },
        {
            hotelPrice: 342,
            hotelRoom: 1,
            name: "four"
        }


    ]);

    const allRooms = [`1 ${t("hotelDetail.hotelAvailable.room")}`, `2 ${t("hotelDetail.hotelAvailable.rooms")}`
        , `3 ${t("hotelDetail.hotelAvailable.rooms")}`, `4 ${t("hotelDetail.hotelAvailable.rooms")}`, `5 ${t("hotelDetail.hotelAvailable.rooms")}`];


    const handleClickAway = () => {
        setShow("");
        setShowRoom("");
    };
    const handleShowCheckin = () => {
        setShow("checkin");
    };
    const handleShowCheckout = () => {
        setShow("checkout");
    };

    const handleShowAdults = () => {
        setShow("adults");
    };
    const handleShowChildren = () => {
        setShow("children");
    };
    const handleShowInfants = () => {
        setShow("infants");
    };
    const handleShowRoomList = (name: string) => {
        setShowRoom(name);
    };

    useEffect(() => {
        setShowRoom("");
    }, [setShowRoom]);

    const [showFilter, setShowFilter] = useState("");
    const [filterValues, setFilterValues] = useState({
        adults: 1,
        children: 1,
        stars: 4,
        childrenAges: []
    });
    const toggleFilters = (type: string) => {
        setShowFilter(type);
    };
    const handleFilterChange = (value: Record<string, number[] | number>) => {
        setFilterValues(prevState => {
            return { ...prevState, ...value };
        });
    };
    const closeFilters = () => {
        setShowFilter("");
    };
    const closeModals = () => {
        closeFilters();
    };

    return (
        <Wrapper>
            <QueryTitle>{t("hotelDetail.hotelAvailable.roomsAvailable")} {moment(data.checkin).format("ddd DD MMM")} - {moment(data.checkout).format("ddd DD MMM,")} {data.passenger.adults} {t("global.adults")}, {data.passenger.children} {t("global.childrens")}</QueryTitle>
            <Modifier>
                <HotelCheck>
                    <LeftSide>
                        <CalenderWrapper onClick={handleShowCheckin}>
                            <DivView onClick={handleShowCheckin}>
                                <StayingInfoWrapper onClick={handleShowCheckin}>
                                    <div>
                                        <CheckInSvg onClick={handleShowCheckin}/>
                                    </div>
                                    <CheckBg>
                                        <CheckTitle>{t("hotelDetail.hotelAvailable.checkIn")}</CheckTitle>
                                        <p>
                                            <strong data-testid="avail-checkInDateInput">{moment(data.checkin).format("DD MMM , ddd")}</strong>
                                        </p>
                                    </CheckBg>
                                </StayingInfoWrapper>
                                {show === "checkin" ? (
                                    <div data-testid="avail-checkInDateCont">
                                    <CalendarView>
                                        <HotelCalendar
                                            onChange={(value: any) => {
                                                handleChangeInput("checkin", value);
                                            }}
                                            minDate={data.checkin}
                                            value={data.checkin}
                                        />
                                    </CalendarView>
                                    </div>
                                ) : null}
                            </DivView>
                        </CalenderWrapper>
                        <CalenderWrapper onClick={handleShowCheckout}>
                            <DivView>
                                <StayingInfoWrapper onClick={handleShowCheckout}>
                                    <div>
                                        <CheckOutSvg onClick={handleShowCheckout}/>
                                    </div>
                                    <CheckBg>
                                        <CheckTitle>{t("hotelDetail.hotelAvailable.checkOut")}</CheckTitle>
                                        <p>
                                            <strong data-testid="avail-checkOutDateInput">{moment(data.checkout).format("DD MMM , ddd")}</strong>
                                        </p>
                                    </CheckBg>
                                </StayingInfoWrapper>
                                {show === "checkout" ? (
                                    <div data-testid="avail-checkOutDateCont">
                                    <CalendarViewCheckout>
                                        <HotelCalendar
                                            onChange={(value: any) => {
                                                handleChangeInput("checkout", value);
                                            }}
                                            minDate={new Date(String(moment(data.checkin).add(1, "d")))}
                                            value={new Date(data.checkout)}
                                        />
                                    </CalendarViewCheckout>
                                        </div>
                                ) : null}
                            </DivView>
                        </CalenderWrapper>
                    </LeftSide>
                    <RightSide>
                        <StyledSearchOptionsGroup>
                        <StyledPerson>
                            <StyledCenterLabel data-testid="avail-adultNumberInput" onClick={() => toggleFilters("adults")}>
                                <StyledLabel>{t("search.adults")}</StyledLabel>
                                <StyledPrimaryValue data-testid="avail-adultNumberChosen">{filterValues.adults}</StyledPrimaryValue>
                            </StyledCenterLabel>
                            {showFilter === "adults" &&
                                <ValuePopup dataTestId="avail-adultNumberCont"
                                            incTestId="avail-incAdultNumber"
                                            decrTestId="avail-decAdultNumber"
                                            inputTestId="avail-adultNumberDropdown"
                                            name="adults" value={filterValues.adults} min={1} max={9}
                                            onChange={handleFilterChange} />}
                        </StyledPerson>
                        <StyledChild>
                            <StyledCenterLabel  data-testid="avail-childNumberInput" onClick={() => toggleFilters("children")}>
                                <StyledLabel>{t("search.children")}</StyledLabel>
                                <StyledPrimaryValue  data-testid="avail-childNumberChosen">{filterValues.children}</StyledPrimaryValue>
                            </StyledCenterLabel>
                            {showFilter === "children" &&
                                <><ValuePopup dataTestId="avail-childNumberCont"
                                              incTestId="avail-incChildNumber"
                                              decrTestId="avail-decChildNumber"
                                              inputTestId="avail-childNumberDropdown" name="children" value={filterValues.children} min={0}
                                              max={4} onChange={handleFilterChange} />

                                    { filterValues.children > 0 && <ValuePopupAges
                                        className="childrenAges"
                                        name="childrenAges"
                                        min={0}
                                        max={17}
                                        count={filterValues.children}
                                        data={filterValues.childrenAges}
                                        dataTestId="test-children-ages-handler"
                                        onChange={handleFilterChange}/> }
                                </>

                            }
                        </StyledChild>
                        </StyledSearchOptionsGroup>
                        {showFilter.length ? <Overlay data-testid="home-search-overlay" onClick={closeModals} /> : ""}
                    </RightSide>
                </HotelCheck>
                <RefreshPrice id="prices">

                    <button>
                        <RefreshIcon/>
                        <span>{t("hotelDetail.hotelAvailable.refreshPrice")}</span></button>
                </RefreshPrice>
            </Modifier>
            <RoomTable>
                <TableHead>
                    <RoomType>{t("hotelDetail.hotelAvailable.roomType")}</RoomType>
                    <Meal>{t("hotelDetail.hotelAvailable.meals")}</Meal>
                    <SelectRoom>{t("hotelDetail.hotelAvailable.rooms")}</SelectRoom>
                    <Price>{t("hotelDetail.hotelAvailable.price")}</Price>
                </TableHead>
                {/*<RowView>*/}
                {
                    forArray?.map((w, index) => {
                        const roomUnitPrice = selectedRoom[index].room.match(/\d/g);

                        return (
                            <TableBody key={index}>
                                <ColumnOne>
                                    <OrgInfoIcon
                                      data-for="mainTooltip"
                                      data-tip={t("tooltip.view_price")}
                                      data-iscapture="true"
                                    />
                                    {t("hotelDetail.hotelAvailable.premiumRoom")} {index + 1}
                                </ColumnOne>
                                <ColumnTwo>{t("hotelDetail.hotelAvailable.breakfastInc")} {index + 1}</ColumnTwo>
                                <div style={{position: "relative"}}>

                                    <ColumnThree onClick={() => handleShowRoomList(w.name)} data-testid={`numOfRoomsCont${index}`}>
                                        <LeftIcon/>
                                        <span>
                                            <input type="text" placeholder="1 Rooms" readOnly
                                                   value={selectedRoom[index].room} data-testid={`numOfRoomsInput${index}`}/>
                                        </span>
                                        <TopUp/>
                                    </ColumnThree>

                                    {showRoom === w.name ? (
                                        <InnerRoomList>
                                            <ul style={{
                                                listStyleType: "none",
                                                margin: "0px",
                                                padding: "0px"
                                            }} data-testid={`numOfRoomsUl${index}`}>
                                                {
                                                    allRooms.map((w) => <li key={w} onClick={() => {
                                                        setShowRoom("");
                                                        setSelectedRoom(rooms => rooms.map((s, i)=> {
                                                            if(index === i) {
                                                                s.room = w;
                                                            }
                                                            return s
                                                        }))
                                                    }}>
                                                        <LeftIcon/>
                                                        <h3>
                                                            {w}
                                                        </h3>
                                                    </li>)
                                                }

                                            </ul>


                                        </InnerRoomList>
                                    ) : null}
                                </div>

                                <ColumnFour data-testid={`amountOfRow${index}`}>{Number(selectedRoom[index].price) * Number(roomUnitPrice)}{" \u20AC"}</ColumnFour>
                                <ColumnBreak/>
                                <ColumnFive>
                                    <button>{t("hotelDetail.hotelAvailable.bookNow")}</button>
                                </ColumnFive>
                            </TableBody>
                        );
                    })
                }
            </RoomTable>
            {(show.length || showRoom.length) ? <Overlay onClick={handleClickAway}/> : ""}
            <StyledTooltipWrapper>
                <ReactTooltip
                  id="mainTooltip"
                  place="top"
                  effect="solid"
                  multiline={true}
                />
            </StyledTooltipWrapper>
        </Wrapper>
    );
};

export default HotelAvailable;