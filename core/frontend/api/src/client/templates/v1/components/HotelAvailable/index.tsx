import {useTranslations} from "next-intl";
import {
    QueryTitle,
    Wrapper,
    Modifier,
    HotelCheck,
    RefreshPrice,
    RefreshIcon,
    LeftSide,
    RightSide,
    RoomTable,
    TableHead,
    RoomType,
    Meal,
    SelectRoom,
    Price,
    BookNow,
    TableBody,
    ColumnOne,
    ColumnTwo,
    ColumnThree,
    ColumnFour,
    ColumnFive,
    OrgInfoIcon,
    DropdownIcon,
    GuestNumber,
    DivView,
    CalendarView,
    PassangerView,
    SpanDiv,
    CheckBg,
    CheckTitle,
    Passenger,
    ColumnBreak,
    LeftIcon,
    RightIcon,
    TopUp,
    InnerRoomList,
    OptionRightIcon,
    HotelCalendar,
    CalendarViewCheckout,
    TopUpRooms,
    CheckInSvg,
    CheckOutSvg,
    PersonIcon,
    ChildIcon,
    InfantIcon
} from "./styled";
import {
    PassengerWrapper,
    StayingInfoWrapper, CounterDiv, CounterBtn, PassengerDetailsWrapper, CalenderWrapper
} from '../../../../components/agency/Hero/styled'
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Calendar from "react-calendar";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {Tooltip} from 'antd';
import Image from 'next/image';
import adultsIcon from "../../assets/img/adults-icon.svg";

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
    const [show, setShow] = useState({
        checkin: false,
        checkout: false,
        adults: false,
        infants: false,
        children: false,
        roomList: false

    })
    const [ShowRoom , setShowRoom]=useState([])
    const [RoomsNumber, setRoomsNumber] = useState([])
    const [forArray, seyForArray] = useState([
        {
            hotelPrice: 122,
            totelroom: 1,
            name:"one"
        },
        {
            hotelPrice: 220,
            totelroom: 1,
            name:'two'
        },
        {
            hotelPrice: 322,
            totelroom: 1,
            name:'three'
        },
        {
            hotelPrice: 342,
            totelroom: 1,
            name:'four'
        },


    ])
    const customColors = ['#FFFFFF'];
    const allRooms = ['1 Rooms', '2 Rooms', '3 Rooms', '4 Rooms', '5 Rooms']
    const t = useTranslations();


    const handleClickAway = (name: string) => {
        setShow({
            ...show,
            [name]: false
        })
    };
    const handleShowCheckin = () => {
        setShow({
            ...show,
            checkin: !show.checkin
        })

    }
    const handleDateAway = (name: string) => {

        setShow({
            ...show,
            [name]: false
        })
    };
    const handleShowCheckout = () => {
        setShow({
            ...show,
            checkout: !show.checkout
        })
    }

    const handleShowAdults = () => {
        setShow({
            ...show,
            adults: !show.adults
        })
    }
    const handleShowChildren = () => {
        setShow({
            ...show,
            children: !show.children
        })
    }
    const handleShowInfants = () => {
        setShow({
            ...show,
            infants: !show.infants
        })
    }
    const handleShowRoomList = (name:string) => {
        setShowRoom({
            ...ShowRoom,
            [name]:!ShowRoom.[name]
        })
    }
    const handleTableClickaway = (name:string) => {

        setShowRoom({
            ...ShowRoom,
            [name]:false
        })
    }

    useEffect(()=>{

        forArray?.map((w, index) => {
            setShowRoom(state => ({...state, [w.name]: false}));
        })



    },[])


    return (
        <Wrapper>
            <QueryTitle>Available Rooms
                for {moment(data.checkin).format('ddd DD MMM')} - {moment(data.checkout).format('ddd DD MMM,')} {data.passanger.adults} adults, {data.passanger.children} children, {data.passanger.infants} infants </QueryTitle>
            <Modifier>
                <HotelCheck>
                    <LeftSide>
                        <ClickAwayListener onClickAway={() => handleClickAway('checkin')}>
                            <CalenderWrapper>
                            <DivView>
                                <StayingInfoWrapper onClick={handleShowCheckin}>
                                    <div>
                                        <CheckInSvg onClick={handleShowCheckin}/>

                                    </div>
                                    <CheckBg>
                                        <CheckTitle>Check-in</CheckTitle>
                                        <p>
                                            <strong>{moment(data.checkin).format('DD MMM , ddd')}  </strong>
                                        </p>
                                    </CheckBg>


                                </StayingInfoWrapper >
                                {show.checkin ? (
                                    <CalendarView>
                                        <HotelCalendar
                                            onChange={(value: any) => {
                                                handleChangeInput('checkin', value)
                                                handleDateAway('checkin')
                                            }}
                                            minDate={data.checkin}
                                            value={data.checkin}
                                        />
                                    </CalendarView>
                                ) : null}
                            </DivView>
                            </CalenderWrapper>
                        </ClickAwayListener>
                        <ClickAwayListener onClickAway={() => handleClickAway('checkout')}>
                        <CalenderWrapper>
                            <DivView>
                                <StayingInfoWrapper onClick={handleShowCheckout}>
                                    <div>
                                        <CheckOutSvg onClick={handleShowCheckout}/>
                                    </div>
                                    <CheckBg>
                                        <CheckTitle>Check-out</CheckTitle>
                                        <p>
                                            <strong>{moment(data.checkout).format("DD MMM , ddd")} </strong>
                                        </p>
                                    </CheckBg>
                                </StayingInfoWrapper>
                                {show.checkout ? (
                                    <CalendarViewCheckout>
                                        <HotelCalendar
                                            onChange={(value: any) => {
                                                handleChangeInput('checkout', value)
                                                handleDateAway('checkout')
                                            }}
                                            minDate={new Date(moment(data.checkin).add(1, 'd'))}
                                            value={new Date(data.checkout)}
                                        />
                                    </CalendarViewCheckout>
                                ) : null}
                            </DivView>
                    </CalenderWrapper>
                        </ClickAwayListener>
                    </LeftSide>
                    <RightSide>
                        <ClickAwayListener onClickAway={() => handleClickAway('adults')}>
                            <PassengerWrapper >
                                <DivView>
                                    <Passenger onClick={handleShowAdults}>
                                        <PassengerDetailsWrapper onClick={handleShowAdults}>
                                            <Image src={adultsIcon.src} width={9} height={22}/>
                                             <SpanDiv>Adults</SpanDiv>
                                            <DropdownIcon/>
                                        </PassengerDetailsWrapper>
                                        <GuestNumber>{data?.passanger.adults}</GuestNumber>
                                    </Passenger>
                                    {show.adults ? (
                                        <PassangerView>
                                            <CounterDiv>
                                                <CounterBtn onClick={handleAdultMinus}>
                                                    -
                                                </CounterBtn>
                                                <div>{data?.passanger.adults}</div>
                                                <CounterBtn onClick={handleAdultPlus}>
                                                    +
                                                </CounterBtn>


                                            </CounterDiv>
                                        </PassangerView>
                                    ) : null}
                                </DivView>


                            </PassengerWrapper>
                        </ClickAwayListener>
                        <PassengerWrapper>
                            <ClickAwayListener onClickAway={() => handleClickAway('children')}>
                                <DivView>
                                    <Passenger onClick={handleShowChildren}>
                                        <PassengerDetailsWrapper onClick={handleShowChildren}>
                                            <ChildIcon/>
                                            <SpanDiv>Children</SpanDiv>
                                            <DropdownIcon/>

                                        </PassengerDetailsWrapper>
                                        <GuestNumber>{data?.passanger.children}</GuestNumber>
                                    </Passenger>
                                    {show.children ? (
                                        <PassangerView>
                                            <CounterDiv>
                                                <CounterBtn onClick={handleChildrenMinus}>
                                                    -
                                                </CounterBtn>
                                                <div>{data?.passanger.children}</div>
                                                <CounterBtn onClick={handleChildrenPlus}>
                                                    +
                                                </CounterBtn>
                                            </CounterDiv>
                                        </PassangerView>
                                    ) : null}
                                </DivView>
                            </ClickAwayListener>

                        </PassengerWrapper>
                        <PassengerWrapper>
                            <ClickAwayListener onClickAway={() => handleClickAway('infants')}>
                                <DivView>
                                    <Passenger onClick={handleShowInfants}>
                                        <PassengerDetailsWrapper onClick={handleShowInfants}>
                                            <InfantIcon/>
                                            <SpanDiv>Infants</SpanDiv>
                                            <DropdownIcon/>

                                        </PassengerDetailsWrapper>
                                        <GuestNumber>{data?.passanger.infants}</GuestNumber>
                                    </Passenger>
                                    {show.infants ? (
                                        <PassangerView>
                                            <CounterDiv>
                                                <CounterBtn onClick={handleInfantsMinus}>
                                                    -
                                                </CounterBtn>
                                                <div>{data?.passanger.infants}</div>
                                                <CounterBtn onClick={handleInfantsPlus}>
                                                    +
                                                </CounterBtn>
                                            </CounterDiv>
                                        </PassangerView>
                                    ) : null}

                                </DivView>
                            </ClickAwayListener>
                        </PassengerWrapper>
                    </RightSide>
                </HotelCheck>
                <RefreshPrice id="prices">

                    <button>
                            <RefreshIcon/>
                        <span>Refresh Prices</span></button>
                </RefreshPrice>
            </Modifier>
            <RoomTable>
                <TableHead>
                    <RoomType>Room Type</RoomType>
                    <Meal>Meals</Meal>
                    <SelectRoom>Rooms</SelectRoom>
                    <Price>Price</Price>
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
                                                <OrgInfoIcon/>
                                            </Tooltip>
                                        ))}
                                        Premium Family Room {index + 1}
                                    </ColumnOne>
                                    <ColumnTwo>Breakfast included {index + 1}</ColumnTwo>
                                    <ClickAwayListener onClickAway={() => handleTableClickaway(w.name)}>
                                        <div style={{ position: 'relative' }}>
                                            <ColumnThree onClick={()=>handleShowRoomList(w.name)}>
                                                {/*<input type="number" min='1' value={w.totelroom} max='100' onChange={(e) => {*/}
                                                {/*    const value = [...forArray]*/}
                                                {/*    value[index].totelroom = Number(e.target.value)*/}
                                                {/*    seyForArray(value)*/}
                                                {/*}} placeholder={t('hotelAvailable.selectRoom')}></input>*/}
                                                <LeftIcon/>
                                                <ul>
                                                    <input type="text" placeholder="3 Rooms" readOnly value={RoomsNumber[index]}/>

                                                </ul>
                                                <RightIcon>
                                                    <TopUp/>
                                                </RightIcon>
                                            </ColumnThree>

                                            {ShowRoom?.[w.name] ? (
                                                <InnerRoomList>
                                                    <ul style={{
                                                        listStyleType: "none",
                                                        margin: "0px",
                                                        padding: "0px",
                                                    }}>
                                                        {
                                                            allRooms.map((w)=>{
                                                                return(
                                                                    <li onClick={()=>{
                                                                        let ArrayCheck=RoomsNumber
                                                                        ArrayCheck[index]=w
                                                                        setShowRoom(ArrayCheck)
                                                                    }}>
                                                                        <LeftIcon/>
                                                                        <h3>
                                                                            {w}
                                                                        </h3>
                                                                        <TopUpRooms/>
                                                                    </li>
                                                                )
                                                            })
                                                        }

                                                    </ul>


                                                </InnerRoomList>
                                            ) : null}
                                        </div>
                                    </ClickAwayListener>

                                    <ColumnFour>{Number(w.hotelPrice) * Number(w.totelroom)}{' \u20AC'}</ColumnFour>
                                    <ColumnBreak/>
                                    <ColumnFive>
                                        <button>Book Now</button>
                                    </ColumnFive>
                                </TableBody>
                            )
                        })
                    }


                {/*</RowView>*/}
            </RoomTable>
        </Wrapper>
    )
}

export default HotelAvailable;