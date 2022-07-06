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
    StyledTooltipWrapper
} from "./styled";

import moment from "moment";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import adultsIcon from "../../../assets/img/adults-icon.svg";
import { Overlay } from "../../../components/HomeSearch/styled";
import ReactTooltip from "react-tooltip";

type HotelAvailableProps = {
    data: any;
    handleAdultPlus: () => void;
    handleAdultMinus: () => void;
    handleChangeInput: (name: string, value: any) => void;
    handleChildrenMinus: () => void;
    handleChildrenPlus: () => void;
}

const HotelAvailable = ({
                            data,
                            handleAdultPlus,
                            handleAdultMinus,
                            handleChangeInput,
                            handleChildrenMinus,
                            handleChildrenPlus,
                        }: HotelAvailableProps) => {
    const [show, setShow] = useState("");
    const [componentLoaded, setComponentLoaded] = useState(false);
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
    const handleShowRoomList = (name: string) => {
        setShowRoom(name);
    };

    useEffect(() => {
        setShowRoom("");
        setComponentLoaded(true);
    }, [setShowRoom, setComponentLoaded]);

    return (
        <Wrapper>
            <QueryTitle>
                {t("hotelDetail.hotelAvailable.roomsAvailable")} {moment(data.checkin).format("ddd DD MMM")} - {moment(data.checkout).format("ddd DD MMM,")} {data.passenger.adults} {t("global.adults")}, {data.passenger.children} {t("global.children")}
            </QueryTitle>
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
                        <PassengerWrapper onClick={handleShowAdults} data-testid="avail-adultNumberInput">
                            <DivView>
                                <Passenger onClick={handleShowAdults}>
                                    <PassengerDetailsWrapper onClick={handleShowAdults}>
                                        <Image src={adultsIcon.src} width={9} height={22}/>
                                        <SpanDiv>{t("global.adults")}</SpanDiv>
                                        <DropdownIcon/>
                                    </PassengerDetailsWrapper>
                                    <GuestNumber data-testid="avail-adultNumberChosen">{data?.passenger.adults}</GuestNumber>
                                </Passenger>
                                {show === "adults" ? (
                                    <PassengerView  data-testid="avail-adultNumberCont">
                                        <CounterDiv>
                                            <CounterBtn onClick={handleAdultMinus} data-testid="avail-decAdultNumber">
                                                -
                                            </CounterBtn>
                                            <div data-testid="avail-adultNumberDropdown">{data?.passenger.adults}</div>
                                            <CounterBtn onClick={handleAdultPlus} data-testid="avail-incAdultNumber">
                                                +
                                            </CounterBtn>
                                        </CounterDiv>
                                    </PassengerView>
                                ) : null}
                            </DivView>
                        </PassengerWrapper>
                        <PassengerWrapper onClick={handleShowChildren}>
                            <DivView>
                                <Passenger onClick={handleShowChildren} data-testid="avail-childNumberInput">
                                    <PassengerDetailsWrapper onClick={handleShowChildren}>
                                        <ChildIcon/>
                                        <SpanDiv>{t("global.children")}</SpanDiv>
                                        <DropdownIcon/>

                                    </PassengerDetailsWrapper>
                                    <GuestNumber data-testid="avail-childNumberChosen">{data?.passenger.children}</GuestNumber>
                                </Passenger>
                                {show === "children" ? (
                                    <PassengerView data-testid="avail-childNumberCont">
                                        <CounterDiv>
                                            <CounterBtn onClick={handleChildrenMinus} data-testid="avail-decChildNumber">
                                                -
                                            </CounterBtn>
                                            <div data-testid="avail-childNumberDropdown">{data?.passenger.children}</div>
                                            <CounterBtn onClick={handleChildrenPlus}  data-testid="avail-incChildNumber">
                                                +
                                            </CounterBtn>
                                        </CounterDiv>
                                    </PassengerView>
                                ) : null}
                            </DivView>

                        </PassengerWrapper>
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
                { componentLoaded && <ReactTooltip
                  id="mainTooltip"
                  place="top"
                  effect="solid"
                  multiline={true}
                /> }
            </StyledTooltipWrapper>
        </Wrapper>
    );
};

export default HotelAvailable;