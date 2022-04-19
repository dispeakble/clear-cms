import { useTranslations } from "next-intl";
import {
  BookNow,
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
  RightIcon,
  RightSide,
  RoomTable,
  RoomType,
  SelectRoom,
  SpanDiv,
  StayingInfoWrapper,
  TableBody,
  TableHead,
  TopUp,
  TopUpRooms,
  Wrapper
} from "./styled";

import moment from "moment";
import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import Image from "next/image";
import adultsIcon from "../../assets/img/adults-icon.svg";
import { Overlay } from "../HomeSearch/styled";

type HotelAvailableProps = {
  data: any;
  handleAdultPlus: () => void;
  handleAdultMinus: () => void;
  handleInfantsPlus: () => void;
  handleChangeInputCheckIn:(value: any) => void;
  handleChangeInputCheckOut:(value: any) => void;
  handleChildrenMinus: () => void;
  handleChildrenPlus: () => void;
  handleInfantsMinus: () => void;
}

const HotelAvailable = ({
                          data,
                          handleAdultPlus,
                          handleAdultMinus,
                          handleInfantsPlus,
                          handleChildrenMinus,
                          handleChildrenPlus,
                          handleInfantsMinus,
                          handleChangeInputCheckIn,
                          handleChangeInputCheckOut


                        }: HotelAvailableProps) => {
  const [show, setShow] = useState("");
  const [showRoom, setShowRoom] = useState("");
  const [RoomsNumber] = useState([]);
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
  const customColors = ["#FFFFFF"];
  const allRooms = ["1 Rooms", "2 Rooms", "3 Rooms", "4 Rooms", "5 Rooms"];
  const t = useTranslations();


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

  return (
    <Wrapper>
      <QueryTitle>{t("hotelAvailable.queryTitle")}
        {moment(data.checkin).format("ddd DD MMM")} - {moment(data.checkout).format("ddd DD MMM,")} {data.passenger.adults} {t("hotelAvailable.adult")}, {data.passenger.children} {t("hotelAvailable.child")} , {data.passenger.infants} {t("hotelAvailable.infant")}  </QueryTitle>
      <Modifier>
        <HotelCheck>
          <LeftSide>
            <CalenderWrapper>
              <DivView>
                <StayingInfoWrapper onClick={handleShowCheckin}>
                  <div>
                    <CheckInSvg onClick={handleShowCheckin} />
                  </div>
                  <CheckBg>
                    <CheckTitle>{t("hotelAvailable.checkIn")}</CheckTitle>
                    <p>
                      <strong>{moment(data.checkin).format("DD MMM , ddd")}  </strong>
                    </p>
                  </CheckBg>
                </StayingInfoWrapper>
                {show === "checkin" ? (
                  <CalendarView>
                    <HotelCalendar
                      onChange={(value: any) => {
                        handleChangeInputCheckIn( value);
                      }}
                      minDate={new Date()}
                      value={data.checkin}
                    />
                  </CalendarView>
                ) : null}
              </DivView>
            </CalenderWrapper>
            <CalenderWrapper>
              <DivView>
                <StayingInfoWrapper onClick={handleShowCheckout}>
                  <div>
                    <CheckOutSvg onClick={handleShowCheckout} />
                  </div>
                  <CheckBg>
                    <CheckTitle>{t("hotelAvailable.checkOut")}</CheckTitle>
                    <p>
                      <strong>{moment(data.checkout).format("DD MMM , ddd")} </strong>
                    </p>
                  </CheckBg>
                </StayingInfoWrapper>
                {show === "checkout" ? (
                  <CalendarViewCheckout>
                    <HotelCalendar
                      onChange={(value: any) => {
                        handleChangeInputCheckOut( value);
                      }}
                      minDate={new Date(String(moment(data.checkin)))}
                      value={new Date(data.checkout)}
                    />
                  </CalendarViewCheckout>
                ) : null}
              </DivView>
            </CalenderWrapper>
          </LeftSide>
          <RightSide>
            <PassengerWrapper>
              <DivView>
                <Passenger onClick={handleShowAdults}>
                  <PassengerDetailsWrapper onClick={handleShowAdults}>
                    <Image src={adultsIcon.src} width={9} height={22} />
                    <SpanDiv>{t("hotelAvailable.selectPerson.adult")}</SpanDiv>
                    <DropdownIcon />
                  </PassengerDetailsWrapper>
                  <GuestNumber>{data?.passenger.adults}</GuestNumber>
                </Passenger>
                {show === "adults" ? (
                  <PassengerView>
                    <CounterDiv>
                      <CounterBtn onClick={handleAdultMinus}>
                        -
                      </CounterBtn>
                      <div>{data?.passenger.adults}</div>
                      <CounterBtn onClick={handleAdultPlus}>
                        +
                      </CounterBtn>


                    </CounterDiv>
                  </PassengerView>
                ) : null}
              </DivView>


            </PassengerWrapper>
            <PassengerWrapper>
              <DivView>
                <Passenger onClick={handleShowChildren}>
                  <PassengerDetailsWrapper onClick={handleShowChildren}>
                    <ChildIcon />
                    <SpanDiv>{t("hotelAvailable.selectPerson.child")}</SpanDiv>
                    <DropdownIcon />

                  </PassengerDetailsWrapper>
                  <GuestNumber>{data?.passenger.children}</GuestNumber>
                </Passenger>
                {show === "children" ? (
                  <PassengerView>
                    <CounterDiv>
                      <CounterBtn onClick={handleChildrenMinus}>
                        -
                      </CounterBtn>
                      <div>{data?.passenger.children}</div>
                      <CounterBtn onClick={handleChildrenPlus}>
                        +
                      </CounterBtn>
                    </CounterDiv>
                  </PassengerView>
                ) : null}
              </DivView>

            </PassengerWrapper>
            <PassengerWrapper>
              <DivView>
                <Passenger onClick={handleShowInfants}>
                  <PassengerDetailsWrapper onClick={handleShowInfants}>
                    <InfantIcon />
                    <SpanDiv>{t("hotelAvailable.selectPerson.infant")}</SpanDiv>
                    <DropdownIcon />

                  </PassengerDetailsWrapper>
                  <GuestNumber>{data?.passenger.infants}</GuestNumber>
                </Passenger>
                {show === "infants" ? (
                  <PassengerView>
                    <CounterDiv>
                      <CounterBtn onClick={handleInfantsMinus}>
                        -
                      </CounterBtn>
                      <div>{data?.passenger.infants}</div>
                      <CounterBtn onClick={handleInfantsPlus}>
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
            <RefreshIcon />
            <span>{t("hotelAvailable.refreshPrice")}</span></button>
        </RefreshPrice>
      </Modifier>
      <RoomTable>
        <TableHead>
          <RoomType>{t("hotelAvailable.tableHead.roomType")}</RoomType>
          <Meal>{t("hotelAvailable.tableHead.meal")}</Meal>
          <SelectRoom>{t("hotelAvailable.tableHead.room")}</SelectRoom>
          <Price>{t("hotelAvailable.tableHead.price")}</Price>
          <BookNow> </BookNow>
        </TableHead>
        {/*<RowView>*/}
        {
          forArray?.map((w, index) => {

            // @ts-ignore
            return (
              <TableBody key={index}>
                <ColumnOne>
                  {customColors.map(color => (
                    <Tooltip placement="bottom"
                             title={t("tooltip.view_price")}
                             color={color} key={color}
                             overlayInnerStyle={{
                               color: "#00000080",
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
                      <OrgInfoIcon />
                    </Tooltip>
                  ))}
                  Premium Family Room {index + 1}
                </ColumnOne>
                <ColumnTwo>Breakfast included {index + 1}</ColumnTwo>
                <div style={{ position: "relative" }}>
                  <ColumnThree onClick={() => handleShowRoomList(w.name)}>
                    {/*<input type="number" min='1' value={w.hotelRoom} max='100' onChange={(e) => {*/}
                    {/*    const value = [...forArray]*/}
                    {/*    value[index].hotelRoom = Number(e.target.value)*/}
                    {/*    seyForArray(value)*/}
                    {/*}} placeholder={t('hotelAvailable.selectRoom')}></input>*/}
                    <LeftIcon />
                    <ul>
                      <span>{t("hotelRoomAvailable.selectRoom")}</span>
                    </ul>
                    <RightIcon>
                      <TopUp />
                    </RightIcon>
                  </ColumnThree>

                  {showRoom === w.name ? (
                    <InnerRoomList>
                      <ul style={{
                        listStyleType: "none",
                        margin: "0px",
                        padding: "0px"
                      }}>
                        {
                          allRooms.map((w) => <li key={w} onClick={() => {
                            setShowRoom("");
                          }}>
                            <LeftIcon />
                            <h3>
                              {w}
                            </h3>
                          </li>)
                        }

                      </ul>


                    </InnerRoomList>
                  ) : null}
                </div>

                <ColumnFour>{Number(w.hotelPrice) * Number(w.hotelRoom)}{" \u20AC"}</ColumnFour>
                <ColumnBreak />
                <ColumnFive>
                  <button>{t("hotelAvailable.submit")}</button>
                </ColumnFive>
              </TableBody>
            );
          })
        }
      </RoomTable>
      {(show.length || showRoom.length) ? <Overlay onClick={handleClickAway} /> : ""}
    </Wrapper>
  );
};

export default HotelAvailable;